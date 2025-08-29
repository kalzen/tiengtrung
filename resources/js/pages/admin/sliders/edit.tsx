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

interface SliderEditProps {
    slider: { 
        id: number; 
        title?: string; 
        caption?: string;
        image: string; 
        url?: string;
        button_text?: string;
        ordering?: number;
        status?: boolean;
    };
}

export default function SliderEdit({ slider }: SliderEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Slider', href: route('admin.sliders.index') },
        { title: 'Sửa', href: route('admin.sliders.edit', slider.id) },
    ];

    const [image, setImage] = useState<string>(slider.image ? decodeURIComponent(slider.image.replace(/&#37;/g, '%')) : '');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sửa slider`} />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.sliders.update', slider.id)}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="_method" value="put" />
                                <input type="hidden" name="image" value={image} />
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Tiêu đề</Label>
                                    <Input id="title" name="title" defaultValue={slider.title || ''} />
                                    <InputError message={errors.title} />
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




