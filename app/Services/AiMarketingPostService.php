<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;

class AiMarketingPostService
{
    /**
     * @param  array{title: string, body: string, description?: string|null, faq?: array<int, array{question: string, answer: string}>|null, image_urls?: array<int, string>|null, category_id?: int|null}  $data
     */
    public function createFromApi(array $data): Post
    {
        $slug = $this->generateUniqueSlug($data['title']);

        $imageUrls = $data['image_urls'] ?? [];
        $thumbnail = ! empty($imageUrls) ? $imageUrls[0] : null;

        $post = Post::create([
            'title' => $data['title'],
            'slug' => $slug,
            'excerpt' => $data['description'] ?? null,
            'content' => $this->buildContent(
                $data['body'],
                $data['faq'] ?? null,
                $imageUrls,
            ),
            'thumbnail' => $thumbnail,
            'seo_title' => $data['title'],
            'seo_description' => $data['description'] ?? null,
            'is_published' => true,
            'is_active' => true,
            'published_at' => now(),
            'user_id' => $this->resolveAuthorId(),
        ]);

        if (! empty($data['category_id'])) {
            $post->categories()->attach($data['category_id']);
        }

        return $post;
    }

    public function postUrl(Post $post): string
    {
        return url('/' . $post->slug);
    }

    private function resolveAuthorId(): int
    {
        $userId = config('aimarketing.default_user_id');

        if ($userId && User::query()->whereKey($userId)->exists()) {
            return (int) $userId;
        }

        $user = User::query()->orderBy('id')->first();

        if (! $user) {
            throw new \RuntimeException('Không tìm thấy user để gán làm tác giả bài viết');
        }

        return $user->id;
    }

    private function generateUniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug ?: 'bai-viet';
        $counter = 1;

        while (Post::query()->where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * @param  array<int, array{question: string, answer: string}>|null  $faq
     * @param  array<int, string>|null  $imageUrls
     */
    private function buildContent(string $body, ?array $faq, ?array $imageUrls): string
    {
        $content = $body;

        if (! empty($imageUrls) && count($imageUrls) > 1) {
            foreach (array_slice($imageUrls, 1) as $imageUrl) {
                $content .= sprintf(
                    '<p><img src="%s" alt="" class="max-w-full h-auto" /></p>',
                    e($imageUrl),
                );
            }
        }

        if (! empty($faq)) {
            $content .= '<h2>Câu hỏi thường gặp</h2>';

            foreach ($faq as $item) {
                $question = $item['question'] ?? '';
                $answer = $item['answer'] ?? '';

                if ($question !== '') {
                    $content .= '<h3>' . e($question) . '</h3>';
                }

                if ($answer !== '') {
                    $content .= $answer;
                }
            }
        }

        return $content;
    }
}
