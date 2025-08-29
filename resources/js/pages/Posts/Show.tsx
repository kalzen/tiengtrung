import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, ArrowRight, Home } from 'lucide-react';
import ShadcnContentRenderer from '@/components/ShadcnContentRenderer';
import SafeHead from '@/components/SafeHead';
import MainLayout from '@/layouts/MainLayout';
export default function PostShow({ post, relatedPosts, error, menus, settings, slides }: any) {
    // Helper: resolve asset URL compatible with Laravel asset() when app runs in subfolder
    const asset = (path: string) => {
        if (typeof document !== 'undefined') {
            const meta = document.querySelector('meta[name="asset-base"]') as HTMLMetaElement | null;
            const base = meta?.content || '/';
            return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
        }
        return `/${path.replace(/^\//, '')}`;
    };
    // Safe data extraction with defaults - do this first
    const title = post?.title || 'Bài viết';
    const excerpt = post?.excerpt || '';
    const content = post?.content || '';
    const thumbnail = post?.thumbnail || '';
    const publishedAt = post?.published_at || post?.created_at || new Date().toISOString();
    
    const categoryName = post?.categories && post.categories.length > 0 ? post.categories[0].name : 'Tin tức';
    const categorySlug = post?.categories && post.categories.length > 0 ? post.categories[0].slug : 'tin-tuc';
    const userName = post?.user?.name || 'Admin';

    // Simple validation - if no post or error, show not found
    if (!post || error) {
        return (
            <MainLayout menus={menus} settings={settings} slides={slides}>
                <SafeHead 
                    title="Không tìm thấy bài viết"
                    description="Không tìm thấy bài viết"
                />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {error || 'Không tìm thấy bài viết'}
                        </h1>
                        <Link href={route('posts.index')}>
                            <Button className="bg-[#27a8e3] hover:bg-[#1f8bc7] text-white">
                                Quay lại danh sách bài viết
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
                title={title}
                description={excerpt}
                image={thumbnail}
            />

            {/* Breadcrumb with Background */}
            <div 
                className="relative bg-cover bg-center bg-no-repeat py-20 mt-16"
                style={{
                    backgroundImage: `url('${typeof document !== 'undefined' ? ((document.querySelector('meta[name="asset-base"]') as HTMLMetaElement | null)?.content || '/') : '/'}banner-bg-2.png')`,
                }}
            >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <div className="text-center text-white">
                        {/* Breadcrumb */}
                        <div className="flex items-center justify-center space-x-2 mb-4 text-sm">
                            <Link href="/" className="flex items-center hover:text-[#27a8e3] transition-colors">
                                <Home className="w-4 h-4 mr-1" />
                                Trang chủ
                            </Link>
                            <span>/</span>
                            <Link href={route('posts.index')} className="hover:text-[#27a8e3] transition-colors">
                                Tin tức
                            </Link>
                            <span>/</span>
                            <span className="text-[#27a8e3]">{title}</span>
                        </div>

                        {/* Category Badge */}
                        <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
                            {categoryName}
                        </Badge>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center justify-center space-x-6 text-white/80">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(publishedAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {userName}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {thumbnail && (
                                <div className="h-96 overflow-hidden">
                                    <img 
                                        src={thumbnail} 
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="p-8">
                                <ShadcnContentRenderer content={content} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Related Posts */}
                        {relatedPosts && relatedPosts.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                                <h3 className="text-lg font-semibold mb-4">Bài viết liên quan</h3>
                                <div className="space-y-4">
                                    {relatedPosts.map((relatedPost: any) => {
                                        const relatedTitle = relatedPost.title || 'Bài viết liên quan';
                                        const relatedSlug = relatedPost.slug || '';
                                        const relatedThumbnail = relatedPost.thumbnail || '';
                                        const relatedCategoryName = relatedPost.categories && relatedPost.categories.length > 0 ? relatedPost.categories[0].name : 'Tin tức';
                                        const relatedPublishedAt = relatedPost.published_at || relatedPost.created_at || new Date().toISOString();
                                        
                                        return (
                                            <div key={relatedPost.id || Math.random()} className="flex space-x-3">
                                                <div className="w-20 h-16 flex-shrink-0 overflow-hidden rounded">
                                                    <Link href={route('posts.show', relatedSlug)}>
                                                        <img 
                                                            src={relatedThumbnail ? decodeURIComponent(relatedThumbnail.replace(/&#37;/g, '%')) : asset('placeholder.jpg')} 
                                                            alt={relatedTitle}
                                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
                                                            onError={(e) => {
                                                                e.currentTarget.src = asset('placeholder.jpg');
                                                            }}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Badge variant="secondary" className="mb-1 text-xs">
                                                        {relatedCategoryName}
                                                    </Badge>
                                                    <h4 className="text-sm font-semibold line-clamp-2 mb-1">
                                                        <Link 
                                                            href={route('posts.show', relatedSlug)} 
                                                            className="hover:text-[#27a8e3] transition-colors"
                                                        >
                                                            {relatedTitle}
                                                        </Link>
                                                    </h4>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(relatedPublishedAt).toLocaleDateString('vi-VN')}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Back to Posts */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <Link href={route('posts.index')}>
                                <Button className="w-full bg-[#27a8e3] hover:bg-[#1f8bc7] text-white">
                                    Xem tất cả bài viết
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
