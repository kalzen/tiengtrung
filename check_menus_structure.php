<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Checking menus table structure...\n";

try {
    $columns = DB::select('DESCRIBE menus');
    echo "Menus table columns:\n";
    foreach ($columns as $column) {
        echo "- {$column->Field} ({$column->Type})\n";
    }
    
    echo "\nChecking kz_menus table structure...\n";
    $kzColumns = DB::select('DESCRIBE kz_menus');
    echo "kz_menus table columns:\n";
    foreach ($kzColumns as $column) {
        echo "- {$column->Field} ({$column->Type})\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
