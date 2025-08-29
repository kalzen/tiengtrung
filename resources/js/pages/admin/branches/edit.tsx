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

interface BranchEditProps {
    branch: { id: number; name: string; slug: string; address: string; images?: string };
}

export default function BranchEdit({ branch }: BranchEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Chi nhánh', href: route('admin.branches.index') },
    { title: 'Sửa', href: route('admin.branches.edit', branch.id) },
];

    const [images, setImages] = useState<string>(branch.images ? decodeURIComponent(branch.images.replace(/&#37;/g, '%')) : '');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sửa: ${branch.name}`} />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.branches.update', branch.id)}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="_method" value="put" />
                                <input type="hidden" name="images" value={images} />
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên chi nhánh</Label>
                                    <Input id="name" name="name" defaultValue={branch.name} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" name="slug" defaultValue={branch.slug} />
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
                                    <Input id="address" name="address" defaultValue={branch.address} required />
                                    <InputError message={errors.address} />
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




