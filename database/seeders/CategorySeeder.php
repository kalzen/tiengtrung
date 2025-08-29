<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Tin tức',
                'description' => 'Các tin tức mới nhất về trung tâm và hoạt động dạy học',
            ],
            [
                'name' => 'Khóa học',
                'description' => 'Thông tin về các khóa học tiếng Trung từ cơ bản đến nâng cao',
            ],
            [
                'name' => 'Giáo viên',
                'description' => 'Giới thiệu đội ngũ giáo viên giàu kinh nghiệm',
            ],
            [
                'name' => 'Học viên',
                'description' => 'Chia sẻ kinh nghiệm và thành tích của học viên',
            ],
            [
                'name' => 'Tài liệu học tập',
                'description' => 'Tài liệu, sách giáo khoa và tài nguyên học tiếng Trung',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['name' => $category['name']],
                [
                    'slug' => Str::slug($category['name']),
                    'description' => $category['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
