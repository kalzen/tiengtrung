<?php
namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::where('is_published', true)
            ->where('is_active', true)
            ->with('categories');

        // Filter by category if provided
        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $posts = $query->orderBy('published_at', 'desc')
            ->paginate(12);

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
        $menus = \App\Models\Menu::where('parent_id', null)
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
        $settings = \App\Models\SiteSetting::getSettings();

        // Get slides for header
        $slides = \App\Models\Slide::where('status', true)
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

        // Get featured posts
        $featuredPosts = Post::where('is_published', true)
            ->where('is_active', true)
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
                    'categories' => $post->categories->map(function($category) {
                        return [
                            'name' => $category->name,
                            'slug' => $category->slug,
                        ];
                    }),
                    'published_at' => $post->published_at,
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

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'featuredPosts' => $featuredPosts,
            'filters' => $request->only(['category']),
            'menus' => $menus,
            'settings' => $transformedSettings,
            'slides' => $slides,
        ]);
    }

    public function show($slug)
    {
        try {
            $post = Post::where('slug', $slug)
                ->where('is_published', true)
                ->where('is_active', true)
                ->with('categories', 'user')
                ->first();

            if (!$post) {
                // Get menus and settings for layout even for error case
                $menus = \App\Models\Menu::where('parent_id', null)
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
                $settings = \App\Models\SiteSetting::getSettings();
                
                return Inertia::render('Posts/Show', [
                    'post' => null,
                    'relatedPosts' => [],
                    'error' => 'Không tìm thấy bài viết',
                    'menus' => $menus,
                    'settings' => $settings
                ]);
            }

            // Simple data preparation
            $postData = [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'thumbnail' => $post->thumbnail ? html_entity_decode($post->thumbnail) : null,
                'categories' => $post->categories->map(function($category) {
                    return [
                        'name' => $category->name,
                        'slug' => $category->slug,
                    ];
                }),
                'user' => [
                    'name' => $post->user ? $post->user->name : 'Admin',
                ],
                'published_at' => $post->published_at ?: $post->created_at,
            ];

            // Get related posts
            $relatedPosts = Post::where('is_published', true)
                ->where('is_active', true)
                ->where('id', '!=', $post->id)
                ->whereHas('categories', function($q) use ($post) {
                    $q->whereIn('categories.id', $post->categories->pluck('id'));
                })
                ->with('categories')
                ->orderBy('published_at', 'desc')
                ->take(3)
                ->get()
                ->map(function ($relatedPost) {
                    return [
                        'id' => $relatedPost->id,
                        'title' => $relatedPost->title,
                        'slug' => $relatedPost->slug,
                        'excerpt' => $relatedPost->excerpt,
                        'thumbnail' => $relatedPost->thumbnail ? html_entity_decode($relatedPost->thumbnail) : null,
                        'categories' => $relatedPost->categories->map(function($category) {
                            return [
                                'name' => $category->name,
                                'slug' => $category->slug,
                            ];
                        }),
                        'published_at' => $relatedPost->published_at ?: $relatedPost->created_at,
                    ];
                });

            // Get menus and settings for layout
            $menus = \App\Models\Menu::where('parent_id', null)
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
            $settings = \App\Models\SiteSetting::getSettings();

            // Get slides for header
            $slides = \App\Models\Slide::where('status', true)
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

            return Inertia::render('Posts/Show', [
                'post' => $postData,
                'relatedPosts' => $relatedPosts,
                'menus' => $menus,
                'settings' => $transformedSettings,
                'slides' => $slides,
            ]);
        } catch (\Exception $e) {
            \Log::error('Post show error: ' . $e->getMessage());
            
            return Inertia::render('Posts/Show', [
                'post' => null,
                'relatedPosts' => [],
                'error' => 'Đã xảy ra lỗi khi tải bài viết',
                'menus' => [],
                'settings' => []
            ]);
        }
    }
}
