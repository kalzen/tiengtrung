<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        $testimonials = Testimonial::query()->latest('id')->paginate(20)->withQueryString();
        return Inertia::render('admin/testimonials/index', [
            'testimonials' => $testimonials,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/testimonials/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'comment' => ['required', 'string'],
            'image' => ['nullable', 'string'],
            'ordering' => ['nullable', 'integer', 'min:0'],
            'status' => ['boolean'],
        ]);

        Testimonial::create($validated);
        return back()->with('success', 'Đã tạo đánh giá');
    }

    public function edit($id): Response
    {
        $testimonial = Testimonial::findOrFail($id);
        return Inertia::render('admin/testimonials/edit', [
            'testimonial' => $testimonial,
        ]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'comment' => ['required', 'string'],
            'image' => ['nullable', 'string'],
            'ordering' => ['nullable', 'integer', 'min:0'],
            'status' => ['boolean'],
        ]);

        $testimonial->update($validated);
        return back()->with('success', 'Đã cập nhật đánh giá');
    }

    public function destroy($id): RedirectResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();
        return back()->with('success', 'Đã xoá đánh giá');
    }
}
