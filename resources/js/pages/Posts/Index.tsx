import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home, ChevronDown } from 'lucide-react';
import SafeHead from '@/components/SafeHead';
import MainLayout from '@/layouts/MainLayout';
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: string;
    categories: {
        name: string;
        slug: string;
    }[];
    published_at: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    parent_id?: number;
    children?: Category[];
}

interface PostsIndexProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Category[];
    featuredPosts: Post[];
    filters: {
        category?: string;
    };
    menus: any[];
    settings: any;
    slides?: any[];
    error?: string;
}

export default function PostsIndex({ posts, categories, featuredPosts, filters, menus, settings, slides, error }: PostsIndexProps) {
    // Separate parent and child categories
    const parentCategories = categories.filter(cat => !cat.parent_id);
    const childCategories = categories.filter(cat => cat.parent_id);

    // Get children for each parent category
    const getCategoryChildren = (parentId: number) => {
        return childCategories.filter(cat => cat.parent_id === parentId);
    };

    // Helper: resolve asset URL compatible with Laravel asset() when app runs in subfolder
    const asset = (path: string) => {
        if (typeof document !== 'undefined') {
            const meta = document.querySelector('meta[name="asset-base"]') as HTMLMetaElement | null;
            const base = meta?.content || '/';
            return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
        }
        return `/${path.replace(/^\//, '')}`;
    };

    // Build compact pagination pages with ellipsis
    const buildPages = (current: number, last: number) => {
        const delta = 2;
        const pages: (number | '...')[] = [];
        const range = [] as number[];
        const left = Math.max(1, current - delta);
        const right = Math.min(last, current + delta);

        for (let i = left; i <= right; i++) range.push(i);

        if (left > 2) pages.push(1, '...');
        else if (left === 2) pages.push(1);

        pages.push(...range);

        if (right < last - 1) pages.push('...', last);
        else if (right === last - 1) pages.push(last);

        return pages;
    };

    // Handle error case
    if (error) {
        return (
            <MainLayout menus={menus} settings={settings} slides={slides}>
                <SafeHead 
                    title="Không tìm thấy - Trung tâm Tiếng Trung Toàn Diện"
                    description="Trang bạn tìm kiếm không tồn tại"
                />

                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Không tìm thấy trang</h2>
                        <p className="text-gray-600 mb-8">{error}</p>
                        <Link href={route('home')}>
                            <Button className="bg-[#27a8e3] hover:bg-[#1f8bc7] text-white">
                                Về trang chủ
                            </Button>
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout menus={menus} settings={settings} slides={slides}>
            <SafeHead 
                title={filters.category 
                    ? `${categories.find(cat => cat.slug === filters.category)?.name || 
                       categories.flatMap(cat => cat.children || []).find(child => child.slug === filters.category)?.name || 
                       filters.category} - Trung tâm Tiếng Trung Toàn Diện`
                    : "Tin tức & Bài viết - Trung tâm Tiếng Trung Toàn Diện"
                }
                description={filters.category 
                    ? `Các bài viết về ${categories.find(cat => cat.slug === filters.category)?.name || 
                       categories.flatMap(cat => cat.children || []).find(child => child.slug === filters.category)?.name || 
                       filters.category}`
                    : "Cập nhật những tin tức mới nhất về tiếng Trung và hoạt động của trung tâm"
                }
            />

            {/* Breadcrumb with Background */}
            <div 
                className="relative bg-cover bg-center bg-no-repeat py-20 mt-16"
                style={{
                    backgroundImage: `url(${asset('banner-bg-2.png')})`,
                }}
            >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <div className="text-center text-white">
                        {/* Breadcrumb */}
                        <div className="flex items-center justify-center space-x-2 mb-4 text-sm">
                            <Link href={route('home')} className="flex items-center hover:text-[#27a8e3] transition-colors">
                                <Home className="w-4 h-4 mr-1" />
                                Trang chủ
                            </Link>
                            <span>/</span>
                            {filters.category ? (
                                <>
                                    <Link href={route('posts.index')} className="hover:text-[#27a8e3] transition-colors">
                                        Tin tức & Bài viết
                                    </Link>
                                    <span>/</span>
                                    <span className="text-[#27a8e3]">
                                        {categories.find(cat => cat.slug === filters.category)?.name || 
                                         categories.flatMap(cat => cat.children || []).find(child => child.slug === filters.category)?.name || 
                                         filters.category}
                                    </span>
                                </>
                            ) : (
                                <span className="text-[#27a8e3]">Tin tức & Bài viết</span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {filters.category 
                                ? categories.find(cat => cat.slug === filters.category)?.name || 
                                  categories.flatMap(cat => cat.children || []).find(child => child.slug === filters.category)?.name || 
                                  filters.category
                                : "Tin tức & Bài viết"
                            }
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            {filters.category 
                                ? `Các bài viết về ${categories.find(cat => cat.slug === filters.category)?.name || 
                                   categories.flatMap(cat => cat.children || []).find(child => child.slug === filters.category)?.name || 
                                   filters.category}`
                                : "Cập nhật những tin tức mới nhất về tiếng Trung và hoạt động của trung tâm"
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                                
                                {/* All Posts Link */}
                                <div className="mb-4">
                                    <Link 
                                        href={route('posts.index')}
                                        className={`block px-3 py-2 rounded-md transition-colors ${
                                            !filters.category 
                                                ? 'bg-[#27a8e3] text-white' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        Tất cả bài viết
                                    </Link>
                                </div>

                                {/* Categories Accordion */}
                                <Accordion 
                                    type="single" 
                                    collapsible 
                                    className="w-full"
                                    defaultValue={
                                        filters.category 
                                            ? parentCategories.find(cat => 
                                                cat.slug === filters.category || 
                                                getCategoryChildren(cat.id).some(child => child.slug === filters.category)
                                              )?.id 
                                                ? `category-${parentCategories.find(cat => 
                                                    cat.slug === filters.category || 
                                                    getCategoryChildren(cat.id).some(child => child.slug === filters.category)
                                                  )?.id}` 
                                                : undefined
                                            : undefined
                                    }
                                >
                                    {parentCategories.map((category) => {
                                        const children = getCategoryChildren(category.id);
                                        const isActive = filters.category === category.slug || 
                                                       children.some(child => child.slug === filters.category);
                                        return (
                                            <AccordionItem key={category.id} value={`category-${category.id}`}>
                                                <AccordionTrigger className="text-left hover:no-underline">
                                                    <div className="flex items-center justify-between w-full">
                                                        <Link 
                                                            href={`/${category.slug}`}
                                                            className={`flex-1 text-left ${
                                                                filters.category === category.slug 
                                                                    ? 'text-[#27a8e3] font-semibold' 
                                                                    : 'text-gray-700'
                                                            }`}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    </div>
                                                </AccordionTrigger>
                                                {children.length > 0 && (
                                                    <AccordionContent>
                                                        <div className="space-y-1 pl-4">
                                                            {children.map((child) => (
                                                                                                                            <Link 
                                                                key={child.id}
                                                                href={`/${child.slug}`}
                                                                className={`block px-3 py-2 rounded-md transition-colors text-sm ${
                                                                    filters.category === child.slug 
                                                                        ? 'bg-[#27a8e3] text-white' 
                                                                        : 'text-gray-600 hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                {child.name}
                                                            </Link>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                )}
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>

                                {/* Featured Posts */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold mb-4">Bài viết nổi bật</h4>
                                    <div className="space-y-4">
                                        {featuredPosts.map((post) => (
                                            <div key={post.id} className="flex space-x-3">
                                                <div className="w-16 h-12 flex-shrink-0 overflow-hidden rounded">
                                                    <Link href={route('posts.show', post.slug)}>
                                                        <img 
                                                            src={post.thumbnail ? decodeURIComponent(post.thumbnail.replace(/&#37;/g, '%')) : asset('placeholder.jpg')} 
                                                            alt={post.title}
                                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
                                                            onError={(e) => {
                                                                e.currentTarget.src = asset('placeholder.jpg');
                                                            }}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Badge variant="secondary" className="mb-1 text-xs">
                                                        {post.categories && post.categories.length > 0 ? post.categories[0].name : 'Không phân loại'}
                                                    </Badge>
                                                    <h5 className="text-sm font-semibold line-clamp-2 mb-1">
                                                        <Link 
                                                            href={route('posts.show', post.slug)} 
                                                            className="hover:text-[#27a8e3] transition-colors"
                                                        >
                                                            {post.title}
                                                        </Link>
                                                    </h5>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(post.published_at).toLocaleDateString('vi-VN')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="lg:col-span-3">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.data.map((post) => (
                                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="h-48 overflow-hidden">
                                            <Link href={route('posts.show', post.slug)}>
                                                <img 
                                                    src={post.thumbnail ? decodeURIComponent(post.thumbnail.replace(/&#37;/g, '%')) : asset('placeholder.jpg')} 
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-pointer"
                                                    onError={(e) => {
                                                        e.currentTarget.src = asset('placeholder.jpg');
                                                    }}
                                                />
                                            </Link>
                                        </div>
                                        <CardContent className="p-6">
                                            <Badge variant="secondary" className="mb-3">
                                                {post.categories && post.categories.length > 0 ? post.categories[0].name : 'Không phân loại'}
                                            </Badge>
                                            <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                                                <Link href={route('posts.show', post.slug)} className="hover:text-[#27a8e3] transition-colors">
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                <span dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(post.published_at).toLocaleDateString('vi-VN')}
                                                </div>
                                                <Link href={route('posts.show', post.slug)}>
                                                    <Button variant="outline" size="sm" className="border-[#27a8e3] text-[#27a8e3] hover:bg-[#27a8e3] hover:text-white">
                                                        Đọc thêm
                                                        <ArrowRight className="ml-1 h-3 w-3" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {posts.last_page > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <div className="flex items-center space-x-2">
                                        {/* Prev */}
                                        <Link
                                            href={filters.category 
                                                ? `/${filters.category}?page=${Math.max(1, posts.current_page - 1)}`
                                                : route('posts.index', { page: Math.max(1, posts.current_page - 1) })
                                            }
                                            className={`px-3 py-2 rounded-md border ${posts.current_page === 1 ? 'pointer-events-none opacity-50' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            Trước
                                        </Link>

                                        {buildPages(posts.current_page, posts.last_page).map((p, idx) => (
                                            p === '...'
                                                ? <span key={`e-${idx}`} className="px-2 text-gray-500">…</span>
                                                : (
                                                    <Link
                                                        key={p}
                                                        href={filters.category 
                                                            ? `/${filters.category}?page=${p}`
                                                            : route('posts.index', { page: p })
                                                        }
                                                        className={`px-3 py-2 rounded-md transition-colors ${
                                                            p === posts.current_page
                                                                ? 'bg-[#27a8e3] text-white'
                                                                : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                                        }`}
                                                    >
                                                        {p}
                                                    </Link>
                                                )
                                        ))}

                                        {/* Next */}
                                        <Link
                                            href={filters.category 
                                                ? `/${filters.category}?page=${Math.min(posts.last_page, posts.current_page + 1)}`
                                                : route('posts.index', { page: Math.min(posts.last_page, posts.current_page + 1) })
                                            }
                                            className={`px-3 py-2 rounded-md border ${posts.current_page === posts.last_page ? 'pointer-events-none opacity-50' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            Sau
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
