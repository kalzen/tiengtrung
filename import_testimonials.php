<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Starting testimonials import from kz_testimonials table...\n";

try {
    // Step 1: Get all testimonials from kz_testimonials
    $oldTestimonials = DB::table('kz_testimonials')->where('status', 1)->orderBy('ordering')->get();
    echo "Found " . $oldTestimonials->count() . " active testimonials in kz_testimonials table\n";
    
    // Step 2: Clear existing testimonials
    DB::statement('DELETE FROM testimonials');
    echo "Cleared existing testimonials table\n";
    
    // Step 3: Import testimonials
    $importedTestimonials = 0;
    
    foreach ($oldTestimonials as $testimonial) {
        // Decode image URL if it contains HTML entities
        $image = $testimonial->image;
        if (strpos($image, '&#37;') !== false) {
            $image = str_replace('&#37;', '%', $image);
            $image = urldecode($image);
        }
        
        // Ensure image path starts with /
        if (!empty($image) && !str_starts_with($image, '/') && !str_starts_with($image, 'http')) {
            $image = '/' . $image;
        }
        
        // Decode HTML entities in comment
        $comment = html_entity_decode($testimonial->comment, ENT_QUOTES, 'UTF-8');
        
        // Clean up comment - remove HTML tags if needed
        $comment = strip_tags($comment);
        
        $newId = DB::table('testimonials')->insertGetId([
            'name' => $testimonial->name,
            'position' => $testimonial->position,
            'comment' => $comment,
            'image' => $image,
            'status' => $testimonial->status == 1,
            'ordering' => $testimonial->ordering,
            'created_at' => $testimonial->created_at,
            'updated_at' => $testimonial->updated_at,
        ]);
        
        echo "Imported testimonial: {$testimonial->name} (Old ID: {$testimonial->id} -> New ID: {$newId})\n";
        echo "  - Position: {$testimonial->position}\n";
        echo "  - Image: {$image}\n";
        echo "  - Comment: " . substr($comment, 0, 100) . "...\n";
        $importedTestimonials++;
    }
    
    echo "\n=== TESTIMONIALS IMPORT COMPLETED ===\n";
    echo "Total testimonials imported: {$importedTestimonials}\n";
    
    // Show final testimonials count
    $totalTestimonials = DB::table('testimonials')->count();
    echo "\nFinal testimonials count: {$totalTestimonials}\n";
    
    // Show testimonials structure
    echo "\nTestimonials structure:\n";
    $testimonials = DB::table('testimonials')->orderBy('ordering')->get();
    
    foreach ($testimonials as $testimonial) {
        echo "\n💬 {$testimonial->name} (ID: {$testimonial->id})\n";
        echo "  - Position: {$testimonial->position}\n";
        echo "  - Image: {$testimonial->image}\n";
        echo "  - Comment: " . substr($testimonial->comment, 0, 100) . "...\n";
        echo "  - Status: " . ($testimonial->status ? 'Active' : 'Inactive') . "\n";
        echo "  - Order: {$testimonial->ordering}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

