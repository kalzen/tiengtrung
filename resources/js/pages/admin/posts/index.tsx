import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface PostIndexProps {
    posts: {
        data: Array<{
            id: number;
            title: string;
            slug: string;
            excerpt: string;
            is_published: boolean;
            is_active: boolean;
            created_at: string;
            categories: Array<{
                id: number;
                name: string;
            }>;
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
    { title: 'Bài viết', href: route('admin.posts.index') },
];

export default function PostIndex({ posts }: PostIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bài viết" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Bài viết</h1>
                    <Button asChild>
                        <Link href={route('admin.posts.create')}>Thêm bài viết</Link>
                    </Button>
                </div>

                <Card className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.data.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{post.title}</div>
                                            <div className="text-sm text-muted-foreground">/{post.slug}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {post.categories && post.categories.length > 0 ? (
                                            <div className="flex gap-1 flex-wrap">
                                                {post.categories.map((category) => (
                                                    <Badge key={category.id} variant="secondary">
                                                        {category.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {post.is_published ? (
                                                <Badge variant="default">Đã xuất bản</Badge>
                                            ) : (
                                                <Badge variant="secondary">Bản nháp</Badge>
                                            )}
                                            {post.is_active ? (
                                                <Badge variant="outline">Hoạt động</Badge>
                                            ) : (
                                                <Badge variant="destructive">Không hoạt động</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={route('admin.posts.edit', post.id)}>Sửa</Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" asChild>
                                                <Link method="delete" href={route('admin.posts.destroy', post.id)} as="button">
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
                    {posts.last_page > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Hiển thị {((posts.current_page - 1) * posts.per_page) + 1} đến{' '}
                                {Math.min(posts.current_page * posts.per_page, posts.total)} trong {posts.total} kết quả
                            </div>
                            <div className="flex gap-2">
                                {posts.links.map((link, index) => (
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




