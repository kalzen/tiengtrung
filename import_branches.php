<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Starting branches import from kz_offices table...\n";

try {
    // Lấy dữ liệu văn phòng cũ
    $oldOffices = DB::table('kz_offices')->where('status', 1)->orderBy('ordering')->get();
    echo "Found " . $oldOffices->count() . " active offices in kz_offices table\n";

    // Xóa dữ liệu cũ trong branches để tránh trùng
    DB::statement('DELETE FROM branches');
    echo "Cleared existing branches table\n";

    $imported = 0;

    foreach ($oldOffices as $office) {
        $name = trim((string)($office->title ?? ''));
        if ($name === '') {
            $name = 'Chi nhánh ' . ($office->id ?? '');
        }

        // Tạo slug và đảm bảo unique
        $baseSlug = Str::slug($name);
        $slug = $baseSlug !== '' ? $baseSlug : ('branch-' . $office->id);
        $try = 1;
        while (DB::table('branches')->where('slug', $slug)->exists()) {
            $try++;
            $slug = $baseSlug . '-' . $try;
        }

        // Ảnh có thể chứa &#37;
        $images = (string)($office->images ?? '');
        if ($images !== '') {
            if (strpos($images, '&#37;') !== false) {
                $images = str_replace('&#37;', '%', $images);
                $images = urldecode($images);
            }
            if (!Str::startsWith($images, ['/','http'])) {
                $images = '/' . ltrim($images, '/');
            }
        } else {
            $images = null;
        }

        $address = (string)($office->address ?? '');
        $phone = (string)($office->mobile ?? '');
        $fax = (string)($office->fax ?? '');
        $email = (string)($office->email ?? '');

        // Tọa độ
        $geoLat = is_null($office->geo_lat) ? null : (float)$office->geo_lat;
        $geoLng = is_null($office->geo_lng) ? null : (float)$office->geo_lng;

        $newId = DB::table('branches')->insertGetId([
            'name' => $name,
            'slug' => $slug,
            'images' => $images,
            'address' => $address,
            'city' => null, // không có trong bảng cũ
            'district' => null, // không có trong bảng cũ
            'phone' => $phone,
            'fax' => $fax,
            'email' => $email,
            'country_id' => $office->country_id ?? null,
            'province_id' => $office->province_id ?? null,
            'geo_lat' => $geoLat,
            'geo_lng' => $geoLng,
            'map_url' => null,
            'description' => null,
            'is_active' => (int)($office->status ?? 0) === 1,
            'ordering' => (int)($office->ordering ?? 0),
            'created_by' => $office->created_by ?? null,
            'updated_by' => $office->updated_by ?? null,
            'language' => 'vi',
            'created_at' => $office->created_at ?? now(),
            'updated_at' => $office->updated_at ?? now(),
        ]);

        echo "Imported branch: {$name} (Old ID: {$office->id} -> New ID: {$newId})\n";
        echo "  - Slug: {$slug}\n";
        echo "  - Phone: {$phone}\n";
        echo "  - Email: {$email}\n";
        echo "  - Image: " . ($images ?? '(none)') . "\n";
        echo "  - Address: " . substr($address, 0, 120) . "\n";
        $imported++;
    }

    echo "\n=== BRANCHES IMPORT COMPLETED ===\n";
    echo "Total branches imported: {$imported}\n";

    $count = DB::table('branches')->count();
    echo "Final branches count: {$count}\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
