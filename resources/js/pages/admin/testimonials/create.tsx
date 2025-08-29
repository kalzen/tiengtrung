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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Đánh giá', href: route('admin.testimonials.index') },
    { title: 'Thêm', href: route('admin.testimonials.create') },
];

export default function TestimonialCreate() {
    const [image, setImage] = useState<string>('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Thêm đánh giá" />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.testimonials.store')}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="image" value={image} />
                                
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên người đánh giá</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>
                                

                                
                                <div className="grid gap-2">
                                    <Label htmlFor="comment">Nội dung đánh giá</Label>
                                    <Textarea id="comment" name="comment" rows={4} required />
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
                                    <Input id="ordering" name="ordering" type="number" min="0" />
                                    <InputError message={errors.ordering} />
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
