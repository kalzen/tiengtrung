<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Starting menu import from kz_menus table...\n";

try {
    // Step 1: Get all menus from kz_menus
    $oldMenus = DB::table('kz_menus')->where('status', 1)->orderBy('ordering')->get();
    echo "Found " . $oldMenus->count() . " active menus in kz_menus table\n";
    
    // Step 2: Clear existing menus
    DB::statement('DELETE FROM menus');
    echo "Cleared existing menus table\n";
    
    // Step 3: Import menus in two phases
    $importedMenus = 0;
    $menuIdMapping = []; // Old ID => New ID mapping
    
    // Phase 1: Import parent menus first (parent_id = 0)
    echo "\n=== Phase 1: Importing parent menus ===\n";
    foreach ($oldMenus as $menu) {
        if ($menu->parent_id == 0) {
            // Map link to appropriate route or URL
            $link = $menu->link;
            
            // Check if this is a category link
            if ($link === 'tin-tuc') {
                $link = 'posts.index';
            } elseif ($link === 'gioi-thieu') {
                $link = 'about';
            } elseif ($link === 'khoa-hoc-mien-phi') {
                $link = 'free-courses';
            } elseif ($link === 'thu-vien') {
                $link = 'library';
            } elseif ($link === 'lien-he') {
                $link = 'contact';
            } else {
                // For other links, keep as is or add / prefix
                if (!str_starts_with($link, 'http') && !str_starts_with($link, '/')) {
                    $link = '/' . $link;
                }
            }
            
            $newId = DB::table('menus')->insertGetId([
                'title' => $menu->title,
                'link' => $link,
                'parent_id' => null,
                'level' => $menu->level,
                'ordering' => $menu->ordering,
                'status' => $menu->status == 1,
                'language' => $menu->language,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $menuIdMapping[$menu->id] = $newId;
            echo "Imported parent menu: {$menu->title} (Old ID: {$menu->id} -> New ID: {$newId}, Link: {$link})\n";
            $importedMenus++;
        }
    }
    
    // Phase 2: Import child menus with updated parent_id
    echo "\n=== Phase 2: Importing child menus ===\n";
    foreach ($oldMenus as $menu) {
        if ($menu->parent_id > 0 && isset($menuIdMapping[$menu->parent_id])) {
            // Map link to appropriate route or URL
            $link = $menu->link;
            
            // Check if this is a category link
            if ($link === 'tin-tuc') {
                $link = 'posts.index';
            } elseif ($link === 'gioi-thieu') {
                $link = 'about';
            } elseif ($link === 'khoa-hoc-mien-phi') {
                $link = 'free-courses';
            } elseif ($link === 'thu-vien') {
                $link = 'library';
            } elseif ($link === 'lien-he') {
                $link = 'contact';
            } else {
                // For other links, keep as is or add / prefix
                if (!str_starts_with($link, 'http') && !str_starts_with($link, '/')) {
                    $link = '/' . $link;
                }
            }
            
            $newId = DB::table('menus')->insertGetId([
                'title' => $menu->title,
                'link' => $link,
                'parent_id' => $menuIdMapping[$menu->parent_id],
                'level' => $menu->level,
                'ordering' => $menu->ordering,
                'status' => $menu->status == 1,
                'language' => $menu->language,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $menuIdMapping[$menu->id] = $newId;
            $parentMenu = DB::table('menus')->where('id', $menuIdMapping[$menu->parent_id])->first();
            echo "Imported child menu: {$menu->title} (Old ID: {$menu->id} -> New ID: {$newId}, Parent: {$parentMenu->title}, Link: {$link})\n";
            $importedMenus++;
        }
    }
    
    echo "\n=== MENU IMPORT COMPLETED ===\n";
    echo "Total menus imported: {$importedMenus}\n";
    
    // Show final menu structure
    $totalMenus = DB::table('menus')->count();
    echo "\nFinal menu count: {$totalMenus}\n";
    
    // Show menu structure
    echo "\nMenu structure:\n";
    $parentMenus = DB::table('menus')->whereNull('parent_id')->orderBy('ordering')->get();
    
    foreach ($parentMenus as $parent) {
        echo "\n📁 {$parent->title} (ID: {$parent->id}, Link: {$parent->link})\n";
        $children = DB::table('menus')->where('parent_id', $parent->id)->orderBy('ordering')->get();
        foreach ($children as $child) {
            echo "  └── {$child->title} (ID: {$child->id}, Link: {$child->link})\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

