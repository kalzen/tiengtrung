import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface CategoryIndexProps {
    categories: {
        data: Array<{ 
            id: number; 
            name: string; 
            slug: string; 
            description?: string; 
            is_active: boolean;
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
    { title: 'Chuyên mục', href: route('admin.categories.index') },
];

export default function CategoryIndex({ categories }: CategoryIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chuyên mục" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Chuyên mục</h1>
                    <Button asChild>
                        <Link href={route('admin.categories.create')}>Thêm chuyên mục</Link>
                    </Button>
                </div>

                <Card className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.data.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="font-medium">{category.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-sm bg-muted px-2 py-1 rounded">/{category.slug}</code>
                                    </TableCell>
                                    <TableCell>
                                        {category.description ? (
                                            <span className="text-sm text-muted-foreground">{category.description}</span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {category.is_active ? (
                                            <Badge variant="default">Hoạt động</Badge>
                                        ) : (
                                            <Badge variant="destructive">Không hoạt động</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(category.created_at).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.categories.edit', category.id)}>Sửa</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" asChild>
                                                <Link method="delete" href={route('admin.categories.destroy', category.id)} as="button">
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
                    {categories.last_page > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Hiển thị {((categories.current_page - 1) * categories.per_page) + 1} đến{' '}
                                {Math.min(categories.current_page * categories.per_page, categories.total)} trong {categories.total} kết quả
                            </div>
                            <div className="flex gap-2">
                                {categories.links.map((link, index) => (
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
