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
    { title: 'Slider', href: route('admin.sliders.index') },
    { title: 'Thêm', href: route('admin.sliders.create') },
];

export default function SliderCreate() {
    const [image, setImage] = useState<string>('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Thêm slider" />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.sliders.store')}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="image" value={image} />
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Tiêu đề</Label>
                                    <Input id="title" name="title" />
                                    <InputError message={errors.title} />
                                </div>
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="caption">Mô tả</Label>
                                    <Input id="caption" name="caption" />
                                    <InputError message={errors.caption} />
                                </div>
                                <div className="grid gap-2">
                                    <ImageSelector
                                        value={image}
                                        onChange={setImage}
                                        label="Ảnh slider"
                                        placeholder="Chọn ảnh cho slider..."
                                        size="large"
                                    />
                                    <InputError message={errors.image} />
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




