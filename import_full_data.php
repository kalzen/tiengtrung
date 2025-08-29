<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Bắt đầu import dữ liệu hoàn chỉnh...\n";

// Disable foreign key checks
DB::statement('SET FOREIGN_KEY_CHECKS=0;');

// 1. Import categories từ kz_news_categories.sql
echo "1. Importing categories...\n";
$categoriesFile = 'kz_news_categories.sql';
if (file_exists($categoriesFile)) {
    $categoriesContent = file_get_contents($categoriesFile);
    
    // Tạo bảng kz_news_categories nếu chưa có
    DB::statement('DROP TABLE IF EXISTS `kz_news_categories`');
    DB::statement('CREATE TABLE `kz_news_categories` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `title` varchar(255) DEFAULT NULL,
        `alias` varchar(255) DEFAULT NULL,
        `parent_id` int(11) DEFAULT 0,
        `description` text DEFAULT NULL,
        `images` text DEFAULT NULL,
        `status` tinyint(4) DEFAULT 1,
        `ordering` int(11) DEFAULT 0,
        `created_at` datetime DEFAULT NULL,
        `updated_at` datetime DEFAULT NULL,
        `created_by` int(11) DEFAULT 0,
        `updated_by` int(11) DEFAULT 0,
        `language` varchar(50) DEFAULT "vi",
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
    
    // Tìm tất cả INSERT statements cho kz_news_categories
    preg_match_all('/INSERT INTO `kz_news_categories`[^;]+;/s', $categoriesContent, $matches);
    
    if (!empty($matches[0])) {
        // Xóa dữ liệu cũ (xóa posts trước)
        DB::table('posts')->truncate();
        DB::table('categories')->truncate();
        
        foreach ($matches[0] as $insertStatement) {
            try {
                DB::unprepared($insertStatement);
            } catch (Exception $e) {
                echo "Lỗi khi import category: " . $e->getMessage() . "\n";
            }
        }
        
        // Chuyển đổi từ kz_news_categories sang categories
        $oldCategories = DB::table('kz_news_categories')->get();
        
        foreach ($oldCategories as $oldCat) {
            DB::table('categories')->insert([
                'id' => $oldCat->id,
                'name' => $oldCat->title,
                'slug' => $oldCat->alias,
                'description' => $oldCat->description ?: '',
                'image' => $oldCat->images ?: null,
                'is_active' => $oldCat->status == 1,
                'parent_id' => $oldCat->parent_id ?: null,
                'ordering' => $oldCat->ordering ?: 0,
                'created_at' => $oldCat->created_at ?: now(),
                'updated_at' => $oldCat->updated_at ?: now(),
            ]);
        }
        
        echo "Đã import " . count($oldCategories) . " categories\n";
    }
} else {
    echo "Không tìm thấy file $categoriesFile\n";
}

// 2. Import posts từ tiengtrung_db.sql
echo "2. Importing posts...\n";
$postsFile = 'tiengtrung_db.sql';
if (file_exists($postsFile)) {
    $postsContent = file_get_contents($postsFile);
    
    // Tìm tất cả INSERT statements cho kz_news
    preg_match_all('/INSERT INTO `kz_news`[^;]+;/s', $postsContent, $matches);
    
    if (!empty($matches[0])) {
        echo "Tìm thấy " . count($matches[0]) . " INSERT statements cho posts\n";
        
        $successCount = 0;
        $errorCount = 0;
        
        foreach ($matches[0] as $index => $insertStatement) {
            try {
                // Parse INSERT statement
                if (preg_match('/VALUES\s*\((.*?)\);/s', $insertStatement, $valuesMatch)) {
                    $valuesString = $valuesMatch[1];
                    
                    // Split values by comma, but be careful with commas inside quotes
                    $values = [];
                    $currentValue = '';
                    $inQuotes = false;
                    $quoteChar = null;
                    
                    for ($i = 0; $i < strlen($valuesString); $i++) {
                        $char = $valuesString[$i];
                        
                        if (($char === "'" || $char === '"') && ($i === 0 || $valuesString[$i-1] !== '\\')) {
                            if (!$inQuotes) {
                                $inQuotes = true;
                                $quoteChar = $char;
                            } elseif ($char === $quoteChar) {
                                $inQuotes = false;
                                $quoteChar = null;
                            }
                        }
                        
                        if ($char === ',' && !$inQuotes) {
                            $values[] = trim($currentValue);
                            $currentValue = '';
                        } else {
                            $currentValue .= $char;
                        }
                    }
                    
                    if (trim($currentValue)) {
                        $values[] = trim($currentValue);
                    }
                    
                    if (count($values) >= 10) {
                        $id = trim($values[0], "'");
                        $title = trim($values[1], "'");
                        $alias = trim($values[2], "'");
                        $introtext = trim($values[3], "'");
                        $fulltext = trim($values[4], "'");
                        $categoryId = trim($values[5], "'");
                        $published = trim($values[6], "'");
                        $created = trim($values[7], "'");
                        $createdBy = trim($values[8], "'");
                        $modified = trim($values[9], "'");
                        $modifiedBy = trim($values[10], "'");
                        $thumbnail = isset($values[11]) ? trim($values[11], "'") : '';
                        
                        // Decode HTML entities
                        $title = html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                        $introtext = html_entity_decode($introtext, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                        $fulltext = html_entity_decode($fulltext, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                        
                        // Normalize line breaks
                        $introtext = str_replace(['\r\n', '\r', '\n'], "\n", $introtext);
                        $fulltext = str_replace(['\r\n', '\r', '\n'], "\n", $fulltext);
                        
                        // Convert to HTML format
                        $htmlContent = convertToHtml($introtext . "\n\n" . $fulltext);
                        
                        // Create slug from title
                        $slug = createSlug($title);
                        
                        // Create excerpt from introtext
                        $excerpt = strip_tags($introtext);
                        if (strlen($excerpt) > 200) {
                            $excerpt = substr($excerpt, 0, 200) . '...';
                        }
                        
                        // Clean thumbnail URL
                        if ($thumbnail && strpos($thumbnail, 'http') === false) {
                            $thumbnail = '/images/' . basename($thumbnail);
                        }
                        
                        // Insert vào database
                        DB::table('posts')->insert([
                            'title' => $title,
                            'slug' => $slug,
                            'excerpt' => $excerpt,
                            'content' => $htmlContent,
                            'category_id' => $categoryId ?: 1,
                            'is_published' => $published == '1',
                            'is_active' => true,
                            'published_at' => $created ? date('Y-m-d H:i:s', strtotime($created)) : now(),
                            'created_at' => $created ? date('Y-m-d H:i:s', strtotime($created)) : now(),
                            'updated_at' => $modified ? date('Y-m-d H:i:s', strtotime($modified)) : now(),
                            'seo_keywords' => '[]',
                            'user_id' => 1,
                        ]);
                        
                        $successCount++;
                        if ($successCount % 50 === 0) {
                            echo "Đã import $successCount bài viết...\n";
                        }
                    }
                }
            } catch (Exception $e) {
                $errorCount++;
                if ($errorCount <= 10) { // Chỉ hiển thị 10 lỗi đầu tiên
                    echo "Lỗi khi import bài viết $index: " . $e->getMessage() . "\n";
                }
            }
        }
        
        echo "Import posts hoàn thành!\n";
        echo "Thành công: $successCount bài viết\n";
        echo "Lỗi: $errorCount bài viết\n";
    } else {
        echo "Không tìm thấy dữ liệu INSERT INTO kz_news trong file SQL\n";
    }
} else {
    echo "Không tìm thấy file $postsFile\n";
}

// Re-enable foreign key checks
DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo "\nHoàn thành import dữ liệu!\n";

function convertToHtml($text) {
    // Convert basic formatting
    $html = $text;
    
    // Convert line breaks to paragraphs
    $paragraphs = explode("\n\n", $html);
    $html = '';
    
    foreach ($paragraphs as $paragraph) {
        $paragraph = trim($paragraph);
        if ($paragraph) {
            // Convert single line breaks to <br>
            $paragraph = str_replace("\n", "<br>", $paragraph);
            
            // Convert basic formatting
            $paragraph = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $paragraph);
            $paragraph = preg_replace('/\*(.*?)\*/', '<em>$1</em>', $paragraph);
            $paragraph = preg_replace('/__(.*?)__/', '<u>$1</u>', $paragraph);
            
            // Convert numbered lists
            $paragraph = preg_replace('/^\d+\.\s+(.*)$/m', '<li>$1</li>', $paragraph);
            
            // Convert bullet lists
            $paragraph = preg_replace('/^[-*]\s+(.*)$/m', '<li>$1</li>', $paragraph);
            
            // Wrap in paragraph tags
            $html .= "<p>$paragraph</p>\n";
        }
    }
    
    // Convert lists
    $html = preg_replace('/(<li>.*?<\/li>)/s', '<ol>$1</ol>', $html);
    
    return $html;
}

function createSlug($title) {
    // Convert Vietnamese characters
    $vietnamese = array(
        'à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ',
        'è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ',
        'ì', 'í', 'ị', 'ỉ', 'ĩ',
        'ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ',
        'ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ',
        'ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ',
        'đ',
        'À', 'Á', 'Ạ', 'Ả', 'Ã', 'Â', 'Ầ', 'Ấ', 'Ậ', 'Ẩ', 'Ẫ', 'Ă', 'Ằ', 'Ắ', 'Ặ', 'Ẳ', 'Ẵ',
        'È', 'É', 'Ẹ', 'Ẻ', 'Ẽ', 'Ê', 'Ề', 'Ế', 'Ệ', 'Ể', 'Ễ',
        'Ì', 'Í', 'Ị', 'Ỉ', 'Ĩ',
        'Ò', 'Ó', 'Ọ', 'Ỏ', 'Õ', 'Ô', 'Ồ', 'Ố', 'Ộ', 'Ổ', 'Ỗ', 'Ơ', 'Ờ', 'Ớ', 'Ợ', 'Ở', 'Ỡ',
        'Ù', 'Ú', 'Ụ', 'Ủ', 'Ũ', 'Ư', 'Ừ', 'Ứ', 'Ự', 'Ử', 'Ữ',
        'Ỳ', 'Ý', 'Ỵ', 'Ỷ', 'Ỹ',
        'Đ'
    );
    
    $latin = array(
        'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
        'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
        'i', 'i', 'i', 'i', 'i',
        'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
        'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
        'y', 'y', 'y', 'y', 'y',
        'd',
        'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
        'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
        'i', 'i', 'i', 'i', 'i',
        'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
        'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
        'y', 'y', 'y', 'y', 'y',
        'd'
    );
    
    $title = str_replace($vietnamese, $latin, $title);
    $title = strtolower($title);
    $title = preg_replace('/[^a-z0-9\s-]/', '', $title);
    $title = preg_replace('/[\s-]+/', '-', $title);
    $title = trim($title, '-');
    
    return $title;
}
