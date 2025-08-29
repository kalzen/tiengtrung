<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\SiteSetting;
use App\Models\Slide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::getSettings();
        
        // Transform settings to match React component interface using accessor methods
        $transformedSettings = [
            'id' => $settings->id,
            'title' => $settings->title,
            'company_name' => $settings->company_name,
            'description' => $settings->description,
            'keywords' => $settings->keywords,
            'address' => $settings->address,
            'phone' => $settings->phone,
            'email' => $settings->email,
            'facebook' => $settings->facebook,
            'youtube_channel' => $settings->youtube_channel,
            'working_hours' => $settings->working_hours,
            'image' => $settings->image,
            'favicon' => $settings->favicon,
        ];
        
        $data = [
            'settings' => $transformedSettings,
            'menus' => Menu::where('parent_id', null)
                ->where('status', true)
                ->with(['activeChildren'])
                ->orderBy('ordering')
                ->get()
                ->map(function($menu) {
                    return [
                        'id' => $menu->id,
                        'title' => $menu->title,
                        'url' => $menu->link,
                        'parent_id' => $menu->parent_id,
                        'children' => $menu->activeChildren->map(function($child) {
                            return [
                                'id' => $child->id,
                                'title' => $child->title,
                                'url' => $child->link,
                                'parent_id' => $child->parent_id,
                            ];
                        })
                    ];
                }),
            'slides' => Slide::where('status', true)
                ->orderBy('ordering')
                ->get(),
        ];

        return Inertia::render('Contact', $data);
    }
}
