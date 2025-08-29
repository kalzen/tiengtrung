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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Chuyên mục', href: route('admin.categories.index') },
    { title: 'Thêm', href: route('admin.categories.create') },
];

export default function CategoryCreate() {
    const [isActive, setIsActive] = useState<boolean>(true);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Thêm chuyên mục" />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.categories.store')}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên chuyên mục</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" name="slug" />
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Input id="description" name="description" />
                                    <InputError message={errors.description} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_active" checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
                                    <Label htmlFor="is_active">Kích hoạt</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        Lưu
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
