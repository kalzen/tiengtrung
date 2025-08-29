import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageSelector } from '@/components/image-selector';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Chi nhánh', href: route('admin.branches.index') },
    { title: 'Thêm', href: route('admin.branches.create') },
];

export default function BranchCreate() {
    const [images, setImages] = useState<string>('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Thêm chi nhánh" />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.branches.store')}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="images" value={images} />
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên chi nhánh</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" name="slug" />
                                    <InputError message={errors.slug} />
                                </div>
                                
                                <div className="grid gap-2">
                                    <ImageSelector
                                        value={images}
                                        onChange={setImages}
                                        label="Ảnh chi nhánh"
                                        placeholder="Chọn ảnh cho chi nhánh..."
                                        size="large"
                                    />
                                    <InputError message={errors.images} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Địa chỉ</Label>
                                    <Input id="address" name="address" required />
                                    <InputError message={errors.address} />
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




