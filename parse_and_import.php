<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Parsing and importing posts from SQL...\n";

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
            
            if (count($values) >= 15) {
                $id = trim($values[0], "'");
                $title = trim($values[1], "'");
                $slug = trim($values[2], "'");
                $categoryId = trim($values[3], "'");
                $keywords = trim($values[4], "'");
                $description = trim($values[5], "'");
                $metaTitle = trim($values[6], "'");
                $metaKeywords = trim($values[7], "'");
                $metaDescription = trim($values[8], "'");
                $content = trim($values[9], "'");
                $images = trim($values[10], "'");
                $isHot = trim($values[11], "'");
                $viewCount = trim($values[12], "'");
                $status = trim($values[13], "'");
                $ordering = trim($values[14], "'");
                $createdAt = trim($values[15], "'");
                $updatedAt = trim($values[16], "'");
                $userId = trim($values[17], "'");
                $updatedBy = trim($values[18], "'");
                $language = trim($values[19], "'");
                
                // Decode HTML entities
                $title = html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $content = html_entity_decode($content, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $description = html_entity_decode($description, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                
                // Normalize line breaks
                $content = str_replace(['\r\n', '\r', '\n'], "\n", $content);
                
                // Convert to HTML format
                $htmlContent = convertToHtml($content);
                
                // Create excerpt from description
                $excerpt = strip_tags($description);
                if (strlen($excerpt) > 200) {
                    $excerpt = substr($excerpt, 0, 200) . '...';
                }
                
                // Clean thumbnail URL
                if ($images && strpos($images, 'http') === false) {
                    $images = '/images/' . basename($images);
                }
                
                // Parse category_id (có thể có nhiều category)
                $categoryIds = explode(',', $categoryId);
                $mainCategoryId = trim($categoryIds[0]);
                
                // Insert vào database
                DB::table('posts')->insert([
                    'title' => $title,
                    'slug' => $slug,
                    'excerpt' => $excerpt,
                    'content' => $htmlContent,
                    'category_id' => $mainCategoryId ?: 1,
                    'is_published' => $status == '1',
                    'is_active' => true,
                    'published_at' => $createdAt ? date('Y-m-d H:i:s', strtotime($createdAt)) : now(),
                    'created_at' => $createdAt ? date('Y-m-d H:i:s', strtotime($createdAt)) : now(),
                    'updated_at' => $updatedAt ? date('Y-m-d H:i:s', strtotime($updatedAt)) : now(),
                    'seo_keywords' => json_encode(explode(',', $keywords)),
                    'user_id' => $userId ?: 1,
                ]);
                
                $successCount++;
                if ($successCount % 10 === 0) {
                    echo "Đã import $successCount bài viết...\n";
                }
            }
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

