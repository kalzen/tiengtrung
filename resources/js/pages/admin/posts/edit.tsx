import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Editor } from '@/components/blocks/editor-x/editor';
import { ImageSelector } from '@/components/image-selector';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { SerializedEditorState } from 'lexical';
import { X, Image as ImageIcon } from 'lucide-react';

interface EditProps {
    post: {
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        thumbnail: string;
        seo_title: string;
        seo_description: string;
        is_published: boolean;
        categories: Array<{
            id: number;
            name: string;
        }>;
        is_active: boolean;
    };
    categories: Array<{
        id: number;
        name: string;
        parent_id?: number;
        children?: Array<{
            id: number;
            name: string;
            parent_id?: number;
        }>;
    }>;
}

export default function PostEdit({ post, categories }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Bài viết', href: route('admin.posts.index') },
        { title: 'Sửa', href: route('admin.posts.edit', post.id) },
    ];

    const initialValue = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "",
                        type: "text",
                        version: 1,
                    },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
} as unknown as SerializedEditorState;

    const [categoryIds, setCategoryIds] = useState<string[]>(post.categories.map(c => String(c.id)));
    const [editorState, setEditorState] = useState<SerializedEditorState>(() => {
        try {
            return post.content ? JSON.parse(post.content) : initialValue;
        } catch {
            return initialValue;
        }
    });
    const [isActive, setIsActive] = useState<boolean>(post.is_active);
    const [isPublished, setIsPublished] = useState<boolean>(post.is_published);
    const [thumbnail, setThumbnail] = useState<string>(post.thumbnail ? decodeURIComponent(post.thumbnail.replace(/&#37;/g, '%')) : '');
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sửa bài viết" />
            <div className="p-4">
                <Card className="p-6">
                    <Form method="post" action={route('admin.posts.update', post.id)}>
                        {({ errors, processing }) => (
                            <div className="grid gap-4">
                                <input type="hidden" name="_method" value="PUT" />
                                {categoryIds.map((id, index) => (
                                    <input key={index} type="hidden" name={`category_ids[${index}]`} value={id} />
                                ))}
                                <input type="hidden" name="content" value={JSON.stringify(editorState)} />
                                <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />
                                <input type="hidden" name="is_published" value={isPublished ? '1' : '0'} />
                                <input type="hidden" name="thumbnail" value={thumbnail} />
                                
                                <Tabs defaultValue="general" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                                        <TabsTrigger value="seo">Thẻ SEO</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="general" className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Tiêu đề</Label>
                                            <Input id="title" name="title" defaultValue={post.title} required />
                                            <InputError message={errors.title} />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="slug">Slug</Label>
                                            <Input id="slug" name="slug" defaultValue={post.slug} />
                                            <InputError message={errors.slug} />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label>Chuyên mục</Label>
                                            <div className="grid gap-2">
                                                {categories.map((category) => (
                                                    <div key={category.id} className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            {category.children && category.children.length > 0 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 w-6 p-0"
                                                                    onClick={() => {
                                                                        const newExpanded = new Set(expandedCategories);
                                                                        if (newExpanded.has(category.id)) {
                                                                            newExpanded.delete(category.id);
                                                                        } else {
                                                                            newExpanded.add(category.id);
                                                                        }
                                                                        setExpandedCategories(newExpanded);
                                                                    }}
                                                                >
                                                                    {expandedCategories.has(category.id) ? '−' : '+'}
                                                                </Button>
                                                            )}
                                                            <Checkbox 
                                                                id={`category_${category.id}`}
                                                                checked={categoryIds.includes(String(category.id))}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        setCategoryIds([...categoryIds, String(category.id)]);
                                                                    } else {
                                                                        setCategoryIds(categoryIds.filter(id => id !== String(category.id)));
                                                                    }
                                                                }}
                                                            />
                                                            <Label htmlFor={`category_${category.id}`}>{category.name}</Label>
                                                        </div>
                                                        
                                                        {/* Children categories */}
                                                        {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
                                                            <div className="ml-12 space-y-1">
                                                                {category.children.map((child) => (
                                                                    <div key={child.id} className="flex items-center gap-2">
                                                                        <Checkbox 
                                                                            id={`category_${child.id}`}
                                                                            checked={categoryIds.includes(String(child.id))}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked) {
                                                                                    setCategoryIds([...categoryIds, String(child.id)]);
                                                                                } else {
                                                                                    setCategoryIds(categoryIds.filter(id => id !== String(child.id)));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Label htmlFor={`category_${child.id}`}>{child.name}</Label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <InputError message={errors.category_ids} />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <ImageSelector
                                                value={thumbnail}
                                                onChange={setThumbnail}
                                                label="Ảnh đại diện"
                                                placeholder="Chọn ảnh đại diện cho bài viết..."
                                                size="large"
                                            />
                                            <InputError message={errors.thumbnail} />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label>Nội dung</Label>
                                            <Editor
                                                editorSerializedState={editorState}
                                                onSerializedChange={(value: SerializedEditorState) => setEditorState(value)}
                                            />
                                            <InputError message={errors.content} />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="excerpt">Mô tả ngắn</Label>
                                            <Input 
                                                id="excerpt" 
                                                name="excerpt" 
                                                defaultValue={post.excerpt ? decodeURIComponent(post.excerpt.replace(/&#37;/g, '%')) : ''} 
                                            />
                                            <InputError message={errors.excerpt} />
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="is_active" checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
                                            <Label htmlFor="is_active">Kích hoạt</Label>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="is_published" checked={isPublished} onCheckedChange={(v) => setIsPublished(Boolean(v))} />
                                            <Label htmlFor="is_published">Xuất bản</Label>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="seo" className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="seo_title">SEO Title</Label>
                                            <Input id="seo_title" name="seo_title" defaultValue={post.seo_title} />
                                            <InputError message={errors.seo_title} />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="seo_description">SEO Description</Label>
                                            <Input id="seo_description" name="seo_description" defaultValue={post.seo_description} />
                                            <InputError message={errors.seo_description} />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                
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


