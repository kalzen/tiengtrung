<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Starting slides import from kz_slides table...\n";

try {
    // Step 1: Get all slides from kz_slides
    $oldSlides = DB::table('kz_slides')->where('status', 1)->orderBy('ordering')->get();
    echo "Found " . $oldSlides->count() . " active slides in kz_slides table\n";
    
    // Step 2: Clear existing slides
    DB::statement('DELETE FROM slides');
    echo "Cleared existing slides table\n";
    
    // Step 3: Import slides
    $importedSlides = 0;
    
    foreach ($oldSlides as $slide) {
        // Decode image URL if it contains HTML entities
        $image = $slide->image;
        if (strpos($image, '&#37;') !== false) {
            $image = str_replace('&#37;', '%', $image);
            $image = urldecode($image);
        }
        
        // Ensure image path starts with /
        if (!empty($image) && !str_starts_with($image, '/') && !str_starts_with($image, 'http')) {
            $image = '/' . $image;
        }
        
        // Handle URL field
        $url = $slide->url;
        if (!empty($url) && !str_starts_with($url, 'http') && !str_starts_with($url, '/')) {
            $url = '/' . $url;
        }
        
        $newId = DB::table('slides')->insertGetId([
            'title' => $slide->title,
            'caption' => $slide->caption,
            'image' => $image,
            'url' => $url,
            'button_text' => $slide->button_text,
            'status' => $slide->status == 1,
            'ordering' => $slide->ordering,
            'created_by' => $slide->created_by ?? 1,
            'updated_by' => !empty($slide->updated_by) ? $slide->updated_by : null,
            'language' => 'vi',
            'created_at' => $slide->created_at,
            'updated_at' => $slide->updated_at,
        ]);
        
        echo "Imported slide: {$slide->title} (Old ID: {$slide->id} -> New ID: {$newId})\n";
        echo "  - Image: {$image}\n";
        echo "  - URL: {$url}\n";
        $importedSlides++;
    }
    
    echo "\n=== SLIDES IMPORT COMPLETED ===\n";
    echo "Total slides imported: {$importedSlides}\n";
    
    // Show final slides count
    $totalSlides = DB::table('slides')->count();
    echo "\nFinal slides count: {$totalSlides}\n";
    
    // Show slides structure
    echo "\nSlides structure:\n";
    $slides = DB::table('slides')->orderBy('ordering')->get();
    
    foreach ($slides as $slide) {
        echo "\n🖼️  {$slide->title} (ID: {$slide->id})\n";
        echo "  - Caption: {$slide->caption}\n";
        echo "  - Image: {$slide->image}\n";
        echo "  - URL: {$slide->url}\n";
        echo "  - Status: " . ($slide->status ? 'Active' : 'Inactive') . "\n";
        echo "  - Order: {$slide->ordering}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

