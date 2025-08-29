<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SliderController extends Controller
{
    public function index(): Response
    {
        $sliders = Slide::query()->orderBy('ordering')->paginate(20)->withQueryString();
        return Inertia::render('admin/sliders/index', [
            'sliders' => $sliders,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/sliders/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'image' => ['required', 'string'],
            'url' => ['nullable', 'string', 'max:255'],
            'button_text' => ['nullable', 'string', 'max:255'],
            'ordering' => ['nullable', 'integer', 'min:0'],
            'status' => ['boolean'],
        ]);

        Slide::create($validated);
        return back()->with('success', 'Đã tạo slider');
    }

    public function edit($id): Response
    {
        $slider = Slide::findOrFail($id);
        return Inertia::render('admin/sliders/edit', [
            'slider' => $slider,
        ]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $slider = Slide::findOrFail($id);
        
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'image' => ['required', 'string'],
            'url' => ['nullable', 'string', 'max:255'],
            'button_text' => ['nullable', 'string', 'max:255'],
            'ordering' => ['nullable', 'integer', 'min:0'],
            'status' => ['boolean'],
        ]);

        $slider->update($validated);
        return back()->with('success', 'Đã cập nhật slider');
    }

    public function destroy($id): RedirectResponse
    {
        $slider = Slide::findOrFail($id);
        $slider->delete();
        return back()->with('success', 'Đã xoá slider');
    }
}
