<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\Slide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function show($slug, Request $request)
    {
        try {
            // First, try to find a post with this slug
            $post = Post::where('slug', $slug)
                ->where('is_published', true)
                ->where('is_active', true)
                ->with('categories', 'user')
                ->first();

            if ($post) {
                // If post found, render post instead
                return app(PostController::class)->show($slug);
            }

            // If no post found, try to find category
            $category = Category::where('slug', $slug)
                ->where('is_active', true)
                ->first();

            if (!$category) {
                return Inertia::render('Posts/Index', [
                    'posts' => [
                        'data' => [],
                        'current_page' => 1,
                        'last_page' => 1,
                        'per_page' => 12,
                        'total' => 0
                    ],
                    'categories' => [],
                    'featuredPosts' => [],
                    'filters' => [],
                    'error' => 'Không tìm thấy trang',
                    'menus' => [],
                    'settings' => []
                ]);
            }

            // Get posts in this category with pagination
            $posts = Post::where('is_published', true)
                ->where('is_active', true)
                ->whereHas('categories', function($q) use ($category) {
                    $q->where('categories.id', $category->id);
                })
                ->with('categories', 'user')
                ->orderBy('published_at', 'desc')
                ->paginate(12, ['*'], 'page', $request->get('page', 1));

            // Get all categories for sidebar
            $categories = Category::where('is_active', true)
                ->with('children')
                ->orderBy('name')
                ->get()
                ->map(function($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'parent_id' => $category->parent_id,
                        'children' => $category->children->map(function($child) {
                            return [
                                'id' => $child->id,
                                'name' => $child->name,
                                'slug' => $child->slug,
                                'parent_id' => $child->parent_id,
                            ];
                        })
                    ];
                });

            // Get menus and settings for layout
            $menus = Menu::where('parent_id', null)
                ->where('status', true)
                ->with(['activeChildren'])
                ->orderBy('ordering')
                ->get()
                ->map(function($menu) {
                    return [
                        'id' => $menu->id,
                        'title' => $menu->title,
                        'url' => $menu->link,
                        'parent_id' => $menu->parent_id,
                        'children' => $menu->activeChildren->map(function($child) {
                            return [
                                'id' => $child->id,
                                'title' => $child->title,
                                'url' => $child->link,
                                'parent_id' => $child->parent_id,
                            ];
                        })
                    ];
                });
            $settings = SiteSetting::getSettings();

            // Get slides for header
            $slides = Slide::where('status', true)
                ->orderBy('ordering')
                ->get()
                ->map(function($slide) {
                    return [
                        'id' => $slide->id,
                        'title' => $slide->title,
                        'caption' => $slide->caption,
                        'image' => $slide->image,
                        'url' => $slide->url,
                        'button_text' => $slide->button_text,
                    ];
                });

            // Transform settings to match React component interface using accessor methods
            $transformedSettings = [
                'id' => $settings->id,
                'title' => $settings->title,
                'company_name' => $settings->company_name,
                'description' => $settings->description,
                'keywords' => $settings->keywords,
                'address' => $settings->address,
                'phone' => $settings->phone,
                'email' => $settings->email,
                'facebook' => $settings->facebook,
                'youtube_channel' => $settings->youtube_channel,
                'working_hours' => $settings->working_hours,
                'image' => $settings->image,
                'favicon' => $settings->favicon,
            ];

            // Get featured posts for this category
            $featuredPosts = Post::where('is_published', true)
                ->where('is_active', true)
                ->whereHas('categories', function($q) use ($category) {
                    $q->where('categories.id', $category->id);
                })
                ->with('categories')
                ->orderBy('published_at', 'desc')
                ->take(3)
                ->get()
                ->map(function($post) {
                    return [
                        'id' => $post->id,
                        'title' => $post->title,
                        'slug' => $post->slug,
                        'excerpt' => $post->excerpt,
                        'thumbnail' => $post->thumbnail,
                        'categories' => $post->categories->map(function($cat) {
                            return [
                                'name' => $cat->name,
                                'slug' => $cat->slug,
                            ];
                        }),
                        'published_at' => $post->published_at,
                    ];
                });

            return Inertia::render('Posts/Index', [
                'posts' => $posts,
                'categories' => $categories,
                'featuredPosts' => $featuredPosts,
                'filters' => [
                    'category' => $category->slug
                ],
                'menus' => $menus,
                'settings' => $transformedSettings,
                'slides' => $slides,
            ]);

        } catch (\Exception $e) {
            return Inertia::render('Posts/Index', [
                'posts' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 12,
                    'total' => 0
                ],
                'categories' => [],
                'featuredPosts' => [],
                'filters' => [],
                'error' => 'Không tìm thấy danh mục',
                'menus' => [],
                'settings' => []
            ]);
        }
    }
}
