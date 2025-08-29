<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(): Response
    {
        $branches = Branch::query()->latest('id')->paginate(12)->withQueryString();
        return Inertia::render('admin/branches/index', [
            'branches' => $branches,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/branches/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:branches,slug'],
            'images' => ['nullable', 'string'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'map_url' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);
        Branch::create($validated);

        return back()->with('success', 'Đã tạo chi nhánh');
    }

    public function edit($id): Response
    {
        $branch = Branch::findOrFail($id);
        return Inertia::render('admin/branches/edit', [
            'branch' => $branch,
        ]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $branch = Branch::findOrFail($id);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:branches,slug,' . $branch->id],
            'images' => ['nullable', 'string'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'map_url' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $branch->update($validated);
        return back()->with('success', 'Đã cập nhật chi nhánh');
    }

    public function destroy($id): RedirectResponse
    {
        $branch = Branch::findOrFail($id);
        $branch->delete();
        return back()->with('success', 'Đã xoá chi nhánh');
    }
}
