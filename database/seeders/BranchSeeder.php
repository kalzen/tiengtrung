<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUser = User::where('email', 'tiengtrung@admin.com')->first();

        $branches = [
            [
                'id' => 15,
                'name' => 'CƠ SỞ 1: Số 515 Lô 22 Lê Hồng Phong, Hải Phòng',
                'slug' => 'co-so-1-so-515-lo-22-le-hong-phong-hai-phong',
                'images' => 'https://admin.tiengtrungtoandien.com/upload/tiengtrung/images/2.png',
                'address' => 'Số 515 Lô 22 Lê Hồng Phong, Hải Phòng',
                'phone' => '0973330143',
                'fax' => '',
                'email' => '',
                'country_id' => 1,
                'province_id' => 0,
                'district' => '',
                'geo_lat' => 0,
                'geo_lng' => 0,
                'is_active' => true,
                'ordering' => 1,
                'created_by' => $adminUser->id,
                'updated_by' => $adminUser->id,
                'language' => 'vi',
            ],
            [
                'id' => 17,
                'name' => 'CƠ SỞ 2: Số 33 Ngô Gia Tự, Hải Phòng',
                'slug' => 'co-so-2-so-33-ngo-gia-tu-hai-phong',
                'images' => 'https://admin.tiengtrungtoandien.com/upload/tiengtrung/images/1.png',
                'address' => 'Số 33 Ngô Gia Tự, Hải An, Hải Phòng',
                'phone' => '097 333 0143',
                'fax' => '',
                'email' => '',
                'country_id' => 1,
                'province_id' => 0,
                'district' => 'Hải An',
                'geo_lat' => 0,
                'geo_lng' => 0,
                'is_active' => true,
                'ordering' => 2,
                'created_by' => $adminUser->id,
                'updated_by' => $adminUser->id,
                'language' => 'vi',
            ],
        ];

        foreach ($branches as $branch) {
            Branch::updateOrCreate(
                ['id' => $branch['id']],
                $branch
            );
        }
    }
}
