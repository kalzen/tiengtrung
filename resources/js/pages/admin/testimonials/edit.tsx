import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageSelector } from '@/components/image-selector';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

interface TestimonialEditProps {
    testimonial: { 
        id: number; 
        name: string; 
        comment: string;
        image?: string;
        ordering?: number;
        status?: boolean;
    };
}

export default function TestimonialEdit({ testimonial }: TestimonialEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Đánh giá', href: route('admin.testimonials.index') },
        { title: 'Sửa', href: route('admin.testimonials.edit', testimonial.id) },
    ];

    const [image, setImage] = useState<string>(testimonial.image ? decodeURIComponent(testimonial.image.replace(/&#37;/g, '%')) : '');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sửa đánh giá: ${testimonial.name}`} />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.testimonials.update', testimonial.id)}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="_method" value="put" />
                                <input type="hidden" name="image" value={image} />
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên người đánh giá</Label>
                                    <Input id="name" name="name" defaultValue={testimonial.name} required />
                                    <InputError message={errors.name} />
                                </div>
                                

                                
                                <div className="grid gap-2">
                                    <Label htmlFor="comment">Nội dung đánh giá</Label>
                                    <Textarea id="comment" name="comment" rows={4} defaultValue={testimonial.comment} required />
                                    <InputError message={errors.comment} />
                                </div>
                                
                                <div className="grid gap-2">
                                    <ImageSelector
                                        value={image}
                                        onChange={setImage}
                                        label="Ảnh đại diện"
                                        placeholder="Chọn ảnh đại diện..."
                                        size="default"
                                    />
                                    <InputError message={errors.image} />
                                </div>
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="ordering">Thứ tự</Label>
                                    <Input id="ordering" name="ordering" type="number" min="0" defaultValue={testimonial.ordering || 0} />
                                    <InputError message={errors.ordering} />
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
