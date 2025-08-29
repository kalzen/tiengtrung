<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        $posts = Post::query()
            ->with('categories')
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/create', [
            'categories' => Category::query()
                ->where('is_active', true)
                ->whereNull('parent_id')
                ->with(['children' => function($query) {
                    $query->where('is_active', true)->orderBy('name');
                }])
                ->orderBy('name')
                ->get(['id', 'name', 'parent_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:posts,slug'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'array'],
            'is_published' => ['boolean'],
            'is_active' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['user_id'] = $request->user()->id;
        $validated['is_published'] = $validated['is_published'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        // Set published_at if is_published is true and not already set
        if ($validated['is_published'] && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        // Attach categories
        if (isset($validated['category_ids'])) {
            $post->categories()->attach($validated['category_ids']);
        }

        return back()->with('success', 'Đã tạo bài viết');
    }

    public function edit($id): Response
    {
        $post = Post::with('categories')->findOrFail($id);
        
        return Inertia::render('admin/posts/edit', [
            'post' => $post,
            'categories' => Category::query()
                ->where('is_active', true)
                ->whereNull('parent_id')
                ->with(['children' => function($query) {
                    $query->where('is_active', true)->orderBy('name');
                }])
                ->orderBy('name')
                ->get(['id', 'name', 'parent_id']),
        ]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $post = Post::findOrFail($id);
        
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:posts,slug,' . $post->id],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'array'],
            'is_published' => ['boolean'],
            'is_active' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],
        ]);

        $validated['is_published'] = $validated['is_published'] ?? false;
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        // Set published_at if is_published is true and not already set
        if ($validated['is_published'] && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        // Sync categories
        if (isset($validated['category_ids'])) {
            $post->categories()->sync($validated['category_ids']);
        } else {
            $post->categories()->detach();
        }

        return back()->with('success', 'Đã cập nhật bài viết');
    }

    public function destroy($id): RedirectResponse
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return back()->with('success', 'Đã xoá bài viết');
    }
}
