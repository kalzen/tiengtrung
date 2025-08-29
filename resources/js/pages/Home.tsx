import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

// Asset helper function
const asset = (path: string): string => {
    const meta = document.querySelector('meta[name="asset-base"]');
    const base = meta?.getAttribute('content') || '/';
    return `${base}${path}`;
};
import { 
    ChevronDown, 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Star, 
    Play, 
    ArrowRight,
    Facebook,
    Youtube,
    Instagram,
    MessageCircle,
    Users,
    BookOpen,
    Award,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import SafeHead from '@/components/SafeHead';
import MainLayout from '@/layouts/MainLayout';

interface SiteSetting {
    id: number;
    title: string;
    company_name: string;
    description: string;
    keywords: string[];
    address: string;
    phone: string;
    email: string;
    facebook: string;
    youtube_channel: string;
    working_hours: string;
    image: string;
    favicon: string;
}

interface Menu {
    id: number;
    title: string;
    url: string;
    parent_id?: number;
    children?: Menu[];
}

interface Slide {
    id: number;
    title: string;
    caption: string;
    image: string;
    url: string;
    button_text: string;
}

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    images: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: string;
    categories?: { name: string; slug: string }[];
    published_at: string;
}

interface Testimonial {
    id: number;
    name: string;
    position: string;
    comment: string;
    image: string;
}

interface HomeProps {
    settings: SiteSetting;
    menus: Menu[];
    slides: Slide[];
    branches: Branch[];
    posts: Post[];
    testimonials: Testimonial[];
}

export default function Home({ settings, menus, slides, branches, posts, testimonials }: HomeProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Helper function to convert YouTube URL to embed URL
    const getYouTubeEmbedUrl = (youtubeUrl: string) => {
        if (!youtubeUrl) return 'https://www.youtube.com/embed/1wPKZ3QavgI';
        
        // Extract video ID from YouTube URL
        let videoId = '';
        if (youtubeUrl.includes('watch?v=')) {
            videoId = youtubeUrl.split('watch?v=')[1]?.split('&')[0];
        } else if (youtubeUrl.includes('youtu.be/')) {
            videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
        }
        
        return videoId ? `https://www.youtube.com/embed/${videoId}` : 'https://www.youtube.com/embed/1wPKZ3QavgI';
    };

    useEffect(() => {
        setIsVisible(true);
        
        // Auto slide for hero slider
        if (slides.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [slides.length]);



    const faqData = [
        {
            question: "Trung tâm có dạy tiếng Trung cho người mới bắt đầu không?",
            answer: "Có, chúng tôi có các khóa học từ cơ bản đến nâng cao, phù hợp cho mọi đối tượng từ người mới bắt đầu đến người muốn nâng cao trình độ."
        },
        {
            question: "Học phí các khóa học như thế nào?",
            answer: "Học phí được tính theo từng khóa học cụ thể. Chúng tôi có nhiều gói học phí linh hoạt và ưu đãi đặc biệt cho học viên đăng ký sớm."
        },
        {
            question: "Trung tâm có cơ sở ở đâu?",
            answer: "Hiện tại chúng tôi có 2 cơ sở tại Hải Phòng: Cơ sở 1 tại số 515 Lô 22 Lê Hồng Phong và Cơ sở 2 tại số 33 Ngô Gia Tự."
        },
        {
            question: "Có khóa học online không?",
            answer: "Có, chúng tôi cung cấp cả khóa học offline và online để phù hợp với nhu cầu của học viên."
        },
        {
            question: "Giáo viên có kinh nghiệm như thế nào?",
            answer: "Đội ngũ giáo viên của chúng tôi đều có bằng cấp chuyên ngành và kinh nghiệm giảng dạy tiếng Trung nhiều năm."
        }
    ];

    return (
        <MainLayout menus={menus} settings={settings} slides={slides}>
            <SafeHead 
                title={settings.title}
                description={settings.description}
                keywords={settings.keywords?.join(', ')}
            />

            {/* Hero Slider */}
            <section className="relative h-[500px] bg-gray-100">
                <div className="container mx-auto px-4 h-full">
                    {slides.length > 0 && (
                        <div className="relative h-full flex items-center justify-center">
                            <img 
                                src={decodeURIComponent(slides[currentSlide].image.replace(/&#37;/g, '%'))} 
                                alt={slides[currentSlide].title}
                                className="max-w-full max-h-full object-contain transition-all duration-1000"
                                onError={(e) => {
                                    e.currentTarget.src = asset('placeholder.jpg');
                                }}
                            />
                            
                            {/* Prev Button */}
                            {slides.length > 1 && (
                                <button
                                    onClick={() => setCurrentSlide((prev) => prev === 0 ? slides.length - 1 : prev - 1)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                >
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            
                            {/* Next Button */}
                            {slides.length > 1 && (
                                <button
                                    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                >
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                    
                    {/* Slider Navigation Dots */}
                    {slides.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentSlide ? 'bg-[#27a8e3] scale-125' : 'bg-gray-400 hover:bg-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 gradient-secondary">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Tại sao chọn chúng tôi?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Trung tâm tiếng Trung Toàn Diện với hơn 10 năm kinh nghiệm đào tạo, 
                            cam kết mang đến chất lượng học tập tốt nhất cho học viên.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, title: "Giáo viên kinh nghiệm", desc: "Đội ngũ giáo viên có bằng cấp và kinh nghiệm giảng dạy nhiều năm" },
                            { icon: BookOpen, title: "Phương pháp hiện đại", desc: "Áp dụng phương pháp giảng dạy tiên tiến, phù hợp với từng đối tượng" },
                            { icon: Award, title: "Chứng chỉ quốc tế", desc: "Luyện thi và cấp chứng chỉ HSK, TOCFL được công nhận quốc tế" },
                            { icon: Globe, title: "Môi trường quốc tế", desc: "Tạo môi trường học tập đa văn hóa, giao lưu với người bản xứ" }
                        ].map((feature, index) => (
                            <div key={index} className="text-center group animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                                <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Branches Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Chi nhánh của chúng tôi
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hệ thống chi nhánh rộng khắp, thuận tiện cho việc học tập
                        </p>
                    </div>
                    
                    {branches.length === 2 ? (
                        <div className="grid md:grid-cols-2 gap-10">
                            {branches.map((branch, index) => (
                                <div key={branch.id} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                                    {/* Background Image */}
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                        <img
                                            src={decodeURIComponent(branch.images.replace(/&#37;/g, '%'))}
                                            alt={branch.name}
                                            className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src = asset('placeholder.jpg');
                                            }}
                                        />
                                        {/* Decorative gradient overlay */}
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-[#27a8e3]/20 rounded-full blur-3xl" />
                                            <div className="absolute -right-10 -top-10 w-60 h-60 bg-sky-300/20 rounded-full blur-3xl" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                        </div>

                                        {/* Floating info panel */}
                                        <div className="absolute left-6 right-6 bottom-6">
                                            <div className="backdrop-blur-xl bg-white/75 rounded-xl border border-white/40 shadow-xl p-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{branch.name}</h3>
                                                        <div className="space-y-2 text-gray-700">
                                                            <div className="flex items-start">
                                                                <MapPin className="w-5 h-5 mr-3 text-[#27a8e3] mt-0.5" />
                                                                <span className="font-medium leading-relaxed">{branch.address}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Phone className="w-5 h-5 mr-3 text-[#27a8e3]" />
                                                                <span className="font-medium">{branch.phone}</span>
                                                            </div>
                                                            {branch.email && (
                                                                <div className="flex items-center">
                                                                    <Mail className="w-5 h-5 mr-3 text-[#27a8e3]" />
                                                                    <span className="font-medium">{branch.email}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Badge */}
                                                    <div className="hidden md:block">
                                                        <span className="inline-flex items-center rounded-full bg-[#27a8e3]/10 text-[#27a8e3] px-3 py-1 text-sm font-semibold border border-[#27a8e3]/20">
                                                            Cơ sở {index + 1}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="mt-5 flex flex-wrap gap-3">
                                                    <a
                                                        href={`tel:${branch.phone}`}
                                                        className="inline-flex items-center justify-center rounded-lg bg-[#27a8e3] px-4 py-2 text-white font-medium shadow hover:opacity-90 transition"
                                                    >
                                                        Gọi ngay
                                                    </a>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center rounded-lg border border-[#27a8e3] px-4 py-2 text-[#27a8e3] font-medium hover:bg-[#27a8e3] hover:text-white transition"
                                                    >
                                                        Xem bản đồ
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {branches.map((branch, index) => (
                                <Card key={branch.id} className="overflow-hidden hover-lift animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                                    <div className="h-48 overflow-hidden">
                                        <img 
                                            src={decodeURIComponent(branch.images.replace(/&#37;/g, '%'))} 
                                            alt={branch.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.src = asset('placeholder.jpg');
                                            }}
                                        />
                                    </div>
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-semibold mb-4 text-gray-900">{branch.name}</h3>
                                        <div className="space-y-3 text-gray-600">
                                            <div className="flex items-center">
                                                <MapPin className="w-5 h-5 mr-3 text-[#27a8e3]" />
                                                <span className="font-medium">{branch.address}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="w-5 h-5 mr-3 text-[#27a8e3]" />
                                                <span className="font-medium">{branch.phone}</span>
                                            </div>
                                            {branch.email && (
                                                <div className="flex items-center">
                                                    <Mail className="w-5 h-5 mr-3 text-[#27a8e3]" />
                                                    <span className="font-medium">{branch.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Video Section */}
            <section className="py-20 gradient-secondary">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Giới thiệu về chúng tôi
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Xem video để hiểu rõ hơn về phương pháp giảng dạy và môi trường học tập
                        </p>
                    </div>
                    
                                         <div className="max-w-5xl mx-auto animate-scale-in">
                         <div className="relative aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                             <iframe
                                 className="w-full h-full"
                                 src={getYouTubeEmbedUrl(settings.youtube_channel)}
                                 title="Giới thiệu Trung tâm Tiếng Trung Toàn Diện"
                                 frameBorder="0"
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                 allowFullScreen
                             ></iframe>
                         </div>
                     </div>
                </div>
            </section>

            {/* Posts Section - Asymmetric Layout */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-16 animate-fade-in-up">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Tin tức & Bài viết
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl">
                                Cập nhật những tin tức mới nhất về tiếng Trung và hoạt động của trung tâm
                            </p>
                        </div>
                        <Link href={route('posts.index')}>
                            <Button variant="outline" className="border-[#27a8e3] text-[#27a8e3] hover:bg-[#27a8e3] hover:text-white transition-all duration-200">
                                Xem tất cả
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Featured Post - Large */}
                        {posts.length > 0 && (
                            <div className="lg:col-span-2 animate-fade-in-left">
                                <Card className="overflow-hidden hover-lift h-full">
                                    <div className="h-80 overflow-hidden">
                                        <Link href={route('posts.show', posts[0].slug)}>
                                            <img 
                                                src={decodeURIComponent(posts[0].thumbnail.replace(/&#37;/g, '%'))} 
                                                alt={posts[0].title}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-pointer"
                                                onError={(e) => {
                                                    e.currentTarget.src = asset('placeholder.jpg');
                                                }}
                                            />
                                        </Link>
                                    </div>
                                    <CardContent className="p-8">
                                        <Badge variant="secondary" className="mb-4">
                                            {posts[0].categories?.[0]?.name || 'Tin tức'}
                                        </Badge>
                                        <h3 className="text-3xl font-bold mb-4 leading-tight">
                                            <Link href={route('posts.show', posts[0].slug)} className="hover:text-[#27a8e3] transition-colors">
                                                {posts[0].title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-600 mb-6 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: posts[0].excerpt }} />
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500 font-medium">
                                                {new Date(posts[0].published_at).toLocaleDateString('vi-VN')}
                                            </div>
                                            <Link href={route('posts.show', posts[0].slug)}>
                                                <Button variant="outline" className="border-[#27a8e3] text-[#27a8e3] hover:bg-[#27a8e3] hover:text-white transition-all duration-200">
                                                    Tìm hiểu thêm
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        
                        {/* Smaller Posts */}
                        <div className="space-y-6 animate-fade-in-right">
                            {posts.slice(1, 4).map((post, index) => (
                                <Card key={post.id} className="overflow-hidden hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className="flex">
                                        {/* Image - Left side */}
                                        <div className="w-32 h-24 flex-shrink-0 overflow-hidden">
                                            <Link href={route('posts.show', post.slug)}>
                                                                                            <img 
                                                src={decodeURIComponent(post.thumbnail.replace(/&#37;/g, '%'))} 
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-pointer"
                                                onError={(e) => {
                                                    e.currentTarget.src = asset('placeholder.jpg');
                                                }}
                                            />
                                            </Link>
                                        </div>
                                        
                                        {/* Content - Right side */}
                                        <CardContent className="p-4 flex-1">
                                            <Badge variant="secondary" className="mb-2 text-xs">
                                                {post.categories?.[0]?.name || 'Tin tức'}
                                            </Badge>
                                            <h4 className="text-lg font-semibold mb-2 line-clamp-2 leading-tight">
                                                <Link href={route('posts.show', post.slug)} className="hover:text-[#27a8e3] transition-colors">
                                                    {post.title}
                                                </Link>
                                            </h4>
                                            <p className="text-gray-600 mb-3 text-sm line-clamp-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                                            <div className="text-xs text-gray-500 font-medium">
                                                {new Date(post.published_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 gradient-secondary">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Cảm nhận của học viên
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Những chia sẻ chân thực từ học viên đã và đang theo học tại trung tâm
                        </p>
                    </div>
                    
                                         <div className="max-w-6xl mx-auto">
                        {/* Testimonials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.slice(0, 3).map((testimonial, index) => (
                                <Card key={testimonial.id} className="p-8 h-full animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                                    <div className="flex items-center mb-6">
                                        <img 
                                            src={decodeURIComponent(testimonial.image.replace(/&#37;/g, '%'))} 
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full mr-4 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = asset('placeholder.jpg');
                                            }}
                                        />
                                        <div>
                                            <h4 className="font-bold text-lg">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">{testimonial.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: testimonial.comment }} />
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Câu hỏi thường gặp
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Giải đáp những thắc mắc phổ biến của học viên
                        </p>
                    </div>
                    
                    <div className="max-w-4xl mx-auto animate-fade-in-up">
                        <Accordion type="single" collapsible className="w-full">
                            {faqData.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left text-lg font-medium">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

        </MainLayout>
    );
}
