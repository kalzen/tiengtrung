<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'id' => 1,
                'name' => 'Trần Ngô Thiên Trang',
                'position' => 'hoc-vien-tran-ngo-thien-trang-du-hoc-sinh-tai-truong-dai-hoc-thien-tan',
                'comment' => '<p>Cảm thấy bản thân thực sự may mắn khi được học tiếng từ chị, làm việc cùng chị và được chị giúp đỡ từ Việt Nam cho đến những ngày đầu bước qua đây.</p>',
                'image' => '/upload/images/tranngothientrang.png',
                'status' => true,
                'ordering' => 0,
            ],
            [
                'id' => 2,
                'name' => 'Lê Thùy Linh',
                'position' => 'hoc-vien-le-thuy-linh-theo-hoc-tai-trung-tam-3-khoa-so-cap-trung-cap-giao-tiep',
                'comment' => '<p>Các cô cũng luôn truyền cảm hứng bằng các câu chuyện cực hấp dẫn tại đất nước Trung Quốc, mình không chỉ được học chữ, học tiếng, mà còn hiểu hơn về văn hóa Trung Hoa.</p>',
                'image' => '/upload/images/45353064_2253256238286517_3824522670322483200_o.jpg',
                'status' => true,
                'ordering' => 0,
            ],
            [
                'id' => 3,
                'name' => 'Lê Thị Vân Nhi',
                'position' => 'le-thi-van-nhi-17-tuoi-chinh-phuc-hsk-4',
                'comment' => '<p>Cô Linh dạy từ vựng và ngữ pháp rất kĩ, nhẹ nhàng, giọng cô lại hay nữa, truyền đạt kiến thức vô cùng tận tâm, học tiết của cô rất vui vẻ vì thế sau khi học cô kiến thức của mình đã chắc hơn rất nhiều.</p>',
                'image' => '/upload/images/21231770_1991666157734385_5987463416954942308_n.jpg',
                'status' => true,
                'ordering' => 0,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::updateOrCreate(
                ['id' => $testimonial['id']],
                $testimonial
            );
        }
    }
}
