<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\AiMarketingPostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PostController extends Controller
{
    public function __construct(
        private readonly AiMarketingPostService $postService,
    ) {}

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'body' => ['required', 'string'],
                'description' => ['nullable', 'string', 'max:500'],
                'faq' => ['nullable', 'array'],
                'faq.*.question' => ['required_with:faq', 'string'],
                'faq.*.answer' => ['required_with:faq', 'string'],
                'image_urls' => ['nullable', 'array'],
                'image_urls.*' => ['url'],
                'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            ]);

            $post = $this->postService->createFromApi($validated);

            return response()->json([
                'url' => $this->postService->postUrl($post),
            ], 201);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('AI Marketing API: publish failed', [
                'message' => $e->getMessage(),
                'payload' => $request->except(['body']),
            ]);

            return response()->json([
                'message' => 'Lỗi nội bộ khi tạo bài viết',
            ], 500);
        }
    }

    public function categories(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'slug', 'name']);

        return response()->json([
            'categories' => $categories,
        ]);
    }
}
