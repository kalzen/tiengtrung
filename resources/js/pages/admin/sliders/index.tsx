import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface SliderIndexProps {
    sliders: {
        data: Array<{ 
            id: number; 
            title?: string; 
            caption?: string;
            image: string; 
            url?: string;
            button_text?: string;
            ordering?: number;
            status?: boolean;
            created_at: string;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Slider', href: route('admin.sliders.index') },
];

export default function SliderIndex({ sliders }: SliderIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Slider" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Slider</h1>
                    <Button asChild>
                        <Link href={route('admin.sliders.create')}>Thêm slider</Link>
                    </Button>
                </div>

                <Card className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hình ảnh</TableHead>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead>Thứ tự</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sliders.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="w-16 h-12 rounded overflow-hidden">
                                            <img 
                                                src={item.image} 
                                                alt={item.title || 'Slider image'} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.title ? (
                                            <span className="font-medium">{item.title}</span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {item.url ? (
                                            <a 
                                                href={item.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {item.url}
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.ordering || 0}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.status ? (
                                            <Badge variant="default">Hoạt động</Badge>
                                        ) : (
                                            <Badge variant="destructive">Không hoạt động</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.sliders.edit', item.id)}>Sửa</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" asChild>
                                                <Link method="delete" href={route('admin.sliders.destroy', item.id)} as="button">
                                                    Xoá
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {sliders.last_page > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Hiển thị {((sliders.current_page - 1) * sliders.per_page) + 1} đến{' '}
                                {Math.min(sliders.current_page * sliders.per_page, sliders.total)} trong {sliders.total} kết quả
                            </div>
                            <div className="flex gap-2">
                                {sliders.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        disabled={!link.url}
                                        asChild
                                    >
                                        <Link href={link.url || '#'}>
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}




