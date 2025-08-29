import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface TestimonialIndexProps {
    testimonials: {
        data: Array<{ 
            id: number; 
            name: string; 
            comment: string;
            image?: string;
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
    { title: 'Đánh giá', href: route('admin.testimonials.index') },
];

export default function TestimonialIndex({ testimonials }: TestimonialIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Đánh giá" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Đánh giá</h1>
                    <Button asChild>
                        <Link href={route('admin.testimonials.create')}>Thêm đánh giá</Link>
                    </Button>
                </div>

                <Card className="p-6">
                    <div className="overflow-x-auto -mx-6 sm:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">Hình ảnh</TableHead>
                                <TableHead className="w-32">Tên</TableHead>
                                <TableHead className="min-w-64">Đánh giá</TableHead>
                                <TableHead className="w-20">Thứ tự</TableHead>
                                <TableHead className="w-24">Trạng thái</TableHead>
                                <TableHead className="w-24">Ngày tạo</TableHead>
                                <TableHead className="w-32 text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.image ? (
                                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                <span className="text-xs text-muted-foreground">No image</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{item.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto pr-2">
                                            <div className="line-clamp-3 hover:line-clamp-none transition-all duration-200">
                                                {item.comment}
                                            </div>
                                        </div>
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
                                                <Link href={route('admin.testimonials.edit', item.id)}>Sửa</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" asChild>
                                                <Link method="delete" href={route('admin.testimonials.destroy', item.id)} as="button">
                                                    Xoá
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {testimonials.last_page > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Hiển thị {((testimonials.current_page - 1) * testimonials.per_page) + 1} đến{' '}
                                {Math.min(testimonials.current_page * testimonials.per_page, testimonials.total)} trong {testimonials.total} kết quả
                            </div>
                            <div className="flex gap-2">
                                {testimonials.links.map((link, index) => (
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
