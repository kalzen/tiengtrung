import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

interface CategoryEditProps {
    category: {
        id: number;
        name: string;
        slug: string;
        description?: string;
        is_active: boolean;
    };
}

export default function CategoryEdit({ category }: CategoryEditProps) {
    const [isActive, setIsActive] = useState<boolean>(category.is_active);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Chuyên mục', href: route('admin.categories.index') },
        { title: 'Sửa', href: route('admin.categories.edit', category.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sửa: ${category.name}`} />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.categories.update', category.id)}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="_method" value="put" />
                                <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên chuyên mục</Label>
                                    <Input id="name" name="name" defaultValue={category.name} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" name="slug" defaultValue={category.slug} />
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Input id="description" name="description" defaultValue={category.description || ''} />
                                    <InputError message={errors.description} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_active" checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
                                    <Label htmlFor="is_active">Kích hoạt</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        Cập nhật
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}
