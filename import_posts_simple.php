<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Importing posts from SQL...\n";

// Đọc file SQL
$sqlFile = 'tiengtrung_db.sql';
if (!file_exists($sqlFile)) {
    die("Không tìm thấy file $sqlFile\n");
}

$sqlContent = file_get_contents($sqlFile);

// Tìm tất cả INSERT statements cho kz_news
preg_match_all('/INSERT INTO `kz_news`[^;]+;/s', $sqlContent, $matches);

if (empty($matches[0])) {
    die("Không tìm thấy dữ liệu INSERT INTO kz_news trong file SQL\n");
}

echo "Tìm thấy " . count($matches[0]) . " INSERT statements\n";

$successCount = 0;
$errorCount = 0;

foreach ($matches[0] as $index => $insertStatement) {
    try {
        // Thay thế kz_news thành posts và điều chỉnh cột
        $modifiedStatement = str_replace('INSERT INTO `kz_news`', 'INSERT INTO `posts`', $insertStatement);
        
        // Thay thế tên cột
        $modifiedStatement = str_replace('`title`', '`title`', $modifiedStatement);
        $modifiedStatement = str_replace('`alias`', '`slug`', $modifiedStatement);
        $modifiedStatement = str_replace('`introtext`', '`excerpt`', $modifiedStatement);
        $modifiedStatement = str_replace('`fulltext`', '`content`', $modifiedStatement);
        $modifiedStatement = str_replace('`catid`', '`category_id`', $modifiedStatement);
        $modifiedStatement = str_replace('`published`', '`is_published`', $modifiedStatement);
        $modifiedStatement = str_replace('`created`', '`created_at`', $modifiedStatement);
        $modifiedStatement = str_replace('`modified`', '`updated_at`', $modifiedStatement);
        $modifiedStatement = str_replace('`created_by`', '`user_id`', $modifiedStatement);
        
        // Thêm các cột cần thiết
        $modifiedStatement = str_replace('`id`, `title`, `alias`, `introtext`, `fulltext`, `catid`, `published`, `created`, `created_by`, `modified`, `modified_by`, `images`', 
                                       '`id`, `title`, `slug`, `excerpt`, `content`, `category_id`, `is_published`, `created_at`, `user_id`, `updated_at`, `modified_by`, `thumbnail`, `is_active`, `published_at`, `seo_keywords`', 
                                       $modifiedStatement);
        
        // Thêm giá trị mặc định cho các cột mới
        $modifiedStatement = preg_replace('/\)\s*VALUES\s*\(/', ', 1, NOW(), \'[]\') VALUES (', $modifiedStatement);
        
        DB::unprepared($modifiedStatement);
        
        $successCount++;
        if ($successCount % 10 === 0) {
            echo "Đã import $successCount bài viết...\n";
        }
    } catch (Exception $e) {
        $errorCount++;
        if ($errorCount <= 5) {
            echo "Lỗi khi import bài viết $index: " . $e->getMessage() . "\n";
        }
    }
}

echo "Import hoàn thành!\n";
echo "Thành công: $successCount bài viết\n";
echo "Lỗi: $errorCount bài viết\n";

