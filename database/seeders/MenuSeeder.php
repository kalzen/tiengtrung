<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            // Top level menus
            ['id' => 9, 'title' => 'Giới thiệu', 'link' => 'gioi-thieu', 'parent_id' => null, 'level' => 0, 'ordering' => 0, 'status' => true, 'language' => 'vi'],
            ['id' => 14, 'title' => 'Khóa học miễn phí', 'link' => 'khoa-hoc-mien-phi', 'parent_id' => null, 'level' => 0, 'ordering' => 1, 'status' => true, 'language' => 'vi'],
            ['id' => 20, 'title' => 'Thư viện', 'link' => 'thu-vien', 'parent_id' => null, 'level' => 0, 'ordering' => 2, 'status' => true, 'language' => 'vi'],
            ['id' => 27, 'title' => 'Tin tức', 'link' => 'posts.index', 'parent_id' => null, 'level' => 0, 'ordering' => 3, 'status' => true, 'language' => 'vi'],
            
            // Children of Giới thiệu
            ['id' => 10, 'title' => 'Về trung tâm TTTD', 'link' => 've-trung-tam-tttd', 'parent_id' => 9, 'level' => 1, 'ordering' => 0, 'status' => true, 'language' => 'vi'],
            ['id' => 11, 'title' => 'Đội ngũ giáo viên', 'link' => 'doi-ngu-giao-vien', 'parent_id' => 9, 'level' => 1, 'ordering' => 1, 'status' => true, 'language' => 'vi'],
            ['id' => 12, 'title' => 'Cảm nhận học viên', 'link' => 'cam-nhan-hoc-vien', 'parent_id' => 9, 'level' => 1, 'ordering' => 2, 'status' => true, 'language' => 'vi'],
            ['id' => 13, 'title' => 'Chương trình đào tạo', 'link' => 'chuong-trinh-dao-tao', 'parent_id' => 9, 'level' => 1, 'ordering' => 3, 'status' => true, 'language' => 'vi'],
            
            // Children of Khóa học miễn phí
            ['id' => 15, 'title' => 'Sơ cấp', 'link' => 'so-cap', 'parent_id' => 14, 'level' => 1, 'ordering' => 0, 'status' => true, 'language' => 'vi'],
            ['id' => 16, 'title' => 'Trung cấp', 'link' => 'trung-cap', 'parent_id' => 14, 'level' => 1, 'ordering' => 1, 'status' => true, 'language' => 'vi'],
            ['id' => 17, 'title' => 'Giao tiếp', 'link' => 'giao-tiep', 'parent_id' => 14, 'level' => 1, 'ordering' => 2, 'status' => true, 'language' => 'vi'],
            ['id' => 18, 'title' => 'Bài học bổ sung', 'link' => 'bai-hoc-bo-sung', 'parent_id' => 14, 'level' => 1, 'ordering' => 3, 'status' => true, 'language' => 'vi'],
            ['id' => 19, 'title' => 'Chia sẻ kinh nghiệm', 'link' => 'chia-se-kinh-nghiem', 'parent_id' => 14, 'level' => 1, 'ordering' => 4, 'status' => true, 'language' => 'vi'],
            ['id' => 21, 'title' => 'Giáo trình cơ bản', 'link' => 'giao-trinh-co-ban', 'parent_id' => 14, 'level' => 1, 'ordering' => 5, 'status' => true, 'language' => 'vi'],
            ['id' => 22, 'title' => 'Giáo trình du lịch', 'link' => 'giao-trinh-du-lich', 'parent_id' => 14, 'level' => 1, 'ordering' => 6, 'status' => true, 'language' => 'vi'],
            
            // Children of Thư viện
            ['id' => 23, 'title' => 'Từ vựng', 'link' => 'tu-vung', 'parent_id' => 20, 'level' => 1, 'ordering' => 0, 'status' => true, 'language' => 'vi'],
            ['id' => 24, 'title' => 'Ngữ pháp', 'link' => 'ngu-phap', 'parent_id' => 20, 'level' => 1, 'ordering' => 1, 'status' => true, 'language' => 'vi'],
            ['id' => 25, 'title' => 'Giao tiếp', 'link' => 'giao-tiep-thu-vien', 'parent_id' => 20, 'level' => 1, 'ordering' => 2, 'status' => true, 'language' => 'vi'],
            ['id' => 26, 'title' => 'Tài liệu hay', 'link' => 'tai-lieu-hay', 'parent_id' => 20, 'level' => 1, 'ordering' => 3, 'status' => true, 'language' => 'vi'],
            ['id' => 28, 'title' => 'HSK + TOCFL', 'link' => 'hsk-tocfl', 'parent_id' => 20, 'level' => 1, 'ordering' => 4, 'status' => true, 'language' => 'vi'],
            ['id' => 29, 'title' => 'Giải trí', 'link' => 'giai-tri', 'parent_id' => 20, 'level' => 1, 'ordering' => 5, 'status' => true, 'language' => 'vi'],
            
            // Children of Tin tức
            ['id' => 30, 'title' => 'Hoạt động tại trung tâm', 'link' => 'hoat-dong-tai-trung-tam', 'parent_id' => 27, 'level' => 1, 'ordering' => 0, 'status' => true, 'language' => 'vi'],
            ['id' => 31, 'title' => 'Tin tức chung', 'link' => 'tin-tuc-chung', 'parent_id' => 27, 'level' => 1, 'ordering' => 1, 'status' => true, 'language' => 'vi'],
            ['id' => 32, 'title' => 'Du học + Việc làm', 'link' => 'du-hoc-viec-lam', 'parent_id' => 27, 'level' => 1, 'ordering' => 2, 'status' => true, 'language' => 'vi'],
            ['id' => 33, 'title' => 'Tuyển dụng', 'link' => 'tuyen-dung', 'parent_id' => 27, 'level' => 1, 'ordering' => 3, 'status' => true, 'language' => 'vi'],
        ];

        foreach ($menus as $menu) {
            Menu::updateOrCreate(
                ['id' => $menu['id']],
                $menu
            );
        }
    }
}
