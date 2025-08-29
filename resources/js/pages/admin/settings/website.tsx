import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

interface WebsiteSettingsProps {
    settings?: {
        site_title?: string;
        logo_path?: string;
        favicon_path?: string;
        seo_title?: string;
        seo_description?: string;
        contact_email?: string;
        contact_phone?: string;
        contact_address?: string;
        facebook_url?: string;
        youtube_url?: string;
        tiktok_url?: string;
        zalo_url?: string;
    } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Cấu hình website', href: route('settings.website.edit') },
];

export default function WebsiteSettings({ settings }: WebsiteSettingsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cấu hình website" />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('settings.website.update')}>
                        {({ errors, processing }) => (
                            <div className="grid gap-6">
                                <input type="hidden" name="_method" value="put" />
                                <div className="grid gap-2">
                                    <Label htmlFor="site_title">Tiêu đề website</Label>
                                    <Input id="site_title" name="site_title" defaultValue={settings?.site_title || ''} />
                                    <InputError message={errors.site_title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="logo_path">Logo (URL)</Label>
                                    <Input id="logo_path" name="logo_path" defaultValue={settings?.logo_path || ''} />
                                    <InputError message={errors.logo_path} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="favicon_path">Favicon (URL)</Label>
                                    <Input id="favicon_path" name="favicon_path" defaultValue={settings?.favicon_path || ''} />
                                    <InputError message={errors.favicon_path} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="seo_title">SEO Title</Label>
                                    <Input id="seo_title" name="seo_title" defaultValue={settings?.seo_title || ''} />
                                    <InputError message={errors.seo_title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="seo_description">SEO Description</Label>
                                    <Input id="seo_description" name="seo_description" defaultValue={settings?.seo_description || ''} />
                                    <InputError message={errors.seo_description} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact_email">Email liên hệ</Label>
                                    <Input id="contact_email" name="contact_email" defaultValue={settings?.contact_email || ''} />
                                    <InputError message={errors.contact_email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact_phone">Số điện thoại</Label>
                                    <Input id="contact_phone" name="contact_phone" defaultValue={settings?.contact_phone || ''} />
                                    <InputError message={errors.contact_phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact_address">Địa chỉ</Label>
                                    <Input id="contact_address" name="contact_address" defaultValue={settings?.contact_address || ''} />
                                    <InputError message={errors.contact_address} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="facebook_url">Facebook</Label>
                                    <Input id="facebook_url" name="facebook_url" defaultValue={settings?.facebook_url || ''} />
                                    <InputError message={errors.facebook_url} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="youtube_url">YouTube</Label>
                                    <Input id="youtube_url" name="youtube_url" defaultValue={settings?.youtube_url || ''} />
                                    <InputError message={errors.youtube_url} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tiktok_url">TikTok</Label>
                                    <Input id="tiktok_url" name="tiktok_url" defaultValue={settings?.tiktok_url || ''} />
                                    <InputError message={errors.tiktok_url} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="zalo_url">Zalo</Label>
                                    <Input id="zalo_url" name="zalo_url" defaultValue={settings?.zalo_url || ''} />
                                    <InputError message={errors.zalo_url} />
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>Lưu</Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}




