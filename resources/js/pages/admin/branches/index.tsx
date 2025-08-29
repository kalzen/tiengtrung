import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface BranchIndexProps {
    branches: {
        data: Array<{
            id: number;
            name: string;
            slug: string;
            address: string;
            city?: string;
            district?: string;
            phone?: string;
            email?: string;
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
    { title: 'Chi nhánh', href: route('admin.branches.index') },
];

export default function BranchIndex({ branches }: BranchIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chi nhánh" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Chi nhánh</h1>
                    <Button asChild>
                        <Link href={route('admin.branches.create')}>Thêm chi nhánh</Link>
                    </Button>
                </div>

                <Card className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên chi nhánh</TableHead>
                                <TableHead>Địa chỉ</TableHead>
                                <TableHead>Liên hệ</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branches.data.map((branch) => (
                                <TableRow key={branch.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{branch.name}</div>
                                            <div className="text-sm text-muted-foreground">/{branch.slug}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>{branch.address}</div>
                                            {branch.district && branch.city && (
                                                <div className="text-muted-foreground">
                                                    {branch.district}, {branch.city}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm space-y-1">
                                            {branch.phone && (
                                                <div className="text-muted-foreground">{branch.phone}</div>
                                            )}
                                            {branch.email && (
                                                <div className="text-muted-foreground">{branch.email}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {branch.is_active ? (
                                            <Badge variant="default">Hoạt động</Badge>
                                        ) : (
                                            <Badge variant="destructive">Không hoạt động</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(branch.created_at).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.branches.edit', branch.id)}>Sửa</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" asChild>
                                                <Link method="delete" href={route('admin.branches.destroy', branch.id)} as="button">
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
                    {branches.last_page > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Hiển thị {((branches.current_page - 1) * branches.per_page) + 1} đến{' '}
                                {Math.min(branches.current_page * branches.per_page, branches.total)} trong {branches.total} kết quả
                            </div>
                            <div className="flex gap-2">
                                {branches.links.map((link, index) => (
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




