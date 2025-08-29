<?php

namespace Database\Seeders;

use App\Models\Slide;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SlideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUser = User::where('email', 'tiengtrung@admin.com')->first();

        $slides = [
            [
                'id' => 7,
                'title' => 'Lộ trình học tiếng Trung hiệu quả tại Tiếng Trung Toàn Diện',
                'caption' => '',
                'image' => '/upload/images/2(28).jpg',
                'url' => '',
                'button_text' => '',
                'status' => true,
                'ordering' => 0,
                'created_by' => $adminUser->id,
                'updated_by' => $adminUser->id,
                'language' => 'vi',
            ],
            [
                'id' => 11,
                'title' => '.',
                'caption' => '',
                'image' => '/upload/images/ảnh%20bìa%20web%20TTTD.png',
                'url' => '',
                'button_text' => '',
                'status' => true,
                'ordering' => 0,
                'created_by' => $adminUser->id,
                'updated_by' => $adminUser->id,
                'language' => 'vi',
            ],
            [
                'id' => 13,
                'title' => 'Tuyển dụng Trợ giảng tiếng Trung tại Hải Phòng',
                'caption' => '',
                'image' => '/upload/images/tuyen-dung-tro-giang-tieng-trung.png',
                'url' => 'https://tiengtrungtoandien.com/tuyen-dung-tro-giang-tieng-trung-tai-hai-phong',
                'button_text' => '',
                'status' => false,
                'ordering' => 0,
                'created_by' => $adminUser->id,
                'updated_by' => $adminUser->id,
                'language' => 'vi',
            ],
            [
                'id' => 14,
                'title' => 'Tiếng Trung Toàn Diện chúc mừng năm mới 2020',
                'caption' => '',
                'image' => '/upload/images/Bộ%20video%20Onl%201(1).png',
                'url' => 'https://tiengtrungtoandien.com/khoa-hoc-tieng-trung-online-cho-nguoi-moi-bat-dau-hoc-tieng-trung-de-dang-moi-luc-moi-noi',
                'button_text' => '',
                'status' => true,
                'ordering' => 0,
                'created_by' => $adminUser->id,
                'updated_by' => $adminUser->id,
                'language' => 'vi',
            ],
            [
                'id' => 15,
                'title' => 'Đào tạo Tiếng Trung cho Doanh Nghiệp tại Hải Phòng',
                'caption' => '',
                'image' => '/upload/images/template_10.png',
                'url' => 'https://tiengtrungtoandien.com/dao-tao-tieng-trung-cho-doanh-nghiep-tai-hai-phong',
                'button_text' => null,
                'status' => true,
                'ordering' => 0,
                'created_by' => $adminUser->id,
                'updated_by' => null,
                'language' => 'vi',
            ],
            [
                'id' => 17,
                'title' => 'Ưu đãi 2022',
                'caption' => '',
                'image' => '/upload/images/新年快乐2.png',
                'url' => 'https://www.facebook.com/tiengtrungtoandien/posts/1614784472195633',
                'button_text' => null,
                'status' => true,
                'ordering' => 0,
                'created_by' => $adminUser->id,
                'updated_by' => null,
                'language' => 'vi',
            ],
        ];

        foreach ($slides as $slide) {
            Slide::updateOrCreate(
                ['id' => $slide['id']],
                $slide
            );
        }
    }
}
