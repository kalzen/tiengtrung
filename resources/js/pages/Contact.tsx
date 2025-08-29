import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    Facebook, 
    Youtube, 
    Home,
    MessageCircle,
    Send
} from 'lucide-react';
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

interface ContactProps {
    settings: SiteSetting;
    menus: Menu[];
    slides?: any[];
}

export default function Contact({ settings, menus, slides }: ContactProps) {
    // Helper: resolve asset URL compatible with Laravel asset() when app runs in subfolder
    const asset = (path: string) => {
        if (typeof document !== 'undefined') {
            const meta = document.querySelector('meta[name="asset-base"]') as HTMLMetaElement | null;
            const base = meta?.content || '/';
            return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
        }
        return `/${path.replace(/^\//, '')}`;
    };

    return (
        <MainLayout menus={menus} settings={settings} slides={slides}>
            <SafeHead 
                title="Liên hệ - Trung tâm Tiếng Trung Toàn Diện"
                description="Liên hệ với chúng tôi để được tư vấn về các khóa học tiếng Trung. Địa chỉ, số điện thoại và thông tin liên hệ chi tiết."
                keywords="liên hệ, tư vấn, địa chỉ, số điện thoại, tiếng Trung, khóa học"
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
                            <span className="text-[#27a8e3]">Liên hệ</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            Liên hệ với chúng tôi
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Hãy liên hệ để được tư vấn về các khóa học tiếng Trung phù hợp với nhu cầu của bạn
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Content */}
            <div className="bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left Column: Contact Information */}
                        <div className="space-y-8">
                            {/* Company Info Card */}
                            <Card className="overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-6">
                                        <Link href={route('home')} className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-4 shadow-lg border border-gray-200 hover:scale-105 transition-transform">
                                            <img 
                                                src={`${typeof document !== 'undefined' ? ((document.querySelector('meta[name="asset-base"]') as HTMLMetaElement | null)?.content || '/') : '/'}1.png`} 
                                                alt="Logo" 
                                                className="w-10 h-10" 
                                            />
                                        </Link>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{settings.company_name}</h2>
                                            <p className="text-gray-600">Trung tâm đào tạo tiếng Trung hàng đầu</p>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="space-y-6">
                                        {/* Address */}
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 bg-[#27a8e3]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                                <MapPin className="w-6 h-6 text-[#27a8e3]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                                                <p className="text-gray-600 leading-relaxed">{settings.address}</p>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 bg-[#27a8e3]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                                <Phone className="w-6 h-6 text-[#27a8e3]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Điện thoại</h3>
                                                <a 
                                                    href={`tel:${settings.phone}`}
                                                    className="text-[#27a8e3] hover:text-[#1f8bc7] transition-colors font-medium"
                                                >
                                                    {settings.phone}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 bg-[#27a8e3]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                                <Mail className="w-6 h-6 text-[#27a8e3]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                                <a 
                                                    href={`mailto:${settings.email}`}
                                                    className="text-[#27a8e3] hover:text-[#1f8bc7] transition-colors font-medium"
                                                >
                                                    {settings.email}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Working Hours */}
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 bg-[#27a8e3]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                                <Clock className="w-6 h-6 text-[#27a8e3]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">Giờ làm việc</h3>
                                                <p className="text-gray-600">{settings.working_hours}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Media */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-4">Theo dõi chúng tôi</h3>
                                        <div className="flex space-x-4">
                                            <a 
                                                href={settings.facebook} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-[#1877f2] rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                                            >
                                                <Facebook className="w-6 h-6 text-white" />
                                            </a>
                                            <a 
                                                href={settings.youtube_channel} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-[#ff0000] rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                                            >
                                                <Youtube className="w-6 h-6 text-white" />
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Contact Form */}
                            <Card>
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-[#27a8e3]/10 rounded-lg flex items-center justify-center mr-4">
                                            <MessageCircle className="w-6 h-6 text-[#27a8e3]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">Gửi tin nhắn nhanh</h3>
                                            <p className="text-gray-600">Chúng tôi sẽ phản hồi trong thời gian sớm nhất</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Họ và tên"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27a8e3] focus:border-transparent outline-none transition-all"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Số điện thoại"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27a8e3] focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27a8e3] focus:border-transparent outline-none transition-all"
                                        />
                                        <textarea
                                            placeholder="Nội dung tin nhắn"
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27a8e3] focus:border-transparent outline-none transition-all resize-none"
                                        ></textarea>
                                        <Button className="w-full bg-[#27a8e3] hover:bg-[#1f8bc7] text-white py-3">
                                            <Send className="w-4 h-4 mr-2" />
                                            Gửi tin nhắn
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Map */}
                        <div className="space-y-8">
                            {/* Google Map */}
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="h-96">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0964843001497!2d106.6822!3d20.8447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDUwJzQxLjAiTiAxMDbCsDQwJzU2LjAiRQ!5e0!3m2!1svi!2svn!4v1234567890"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 'none' }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Bản đồ Trung tâm Tiếng Trung Toàn Diện"
                                        ></iframe>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Directions Card */}
                            <Card>
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Hướng dẫn đường đi</h3>
                                    <div className="space-y-4 text-gray-600">
                                        <div className="flex items-start">
                                            <div className="w-6 h-6 bg-[#27a8e3] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                                                1
                                            </div>
                                            <p>Từ trung tâm thành phố Hải Phòng, đi theo đường Lê Hồng Phong</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-6 h-6 bg-[#27a8e3] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                                                2
                                            </div>
                                            <p>Rẽ phải vào Ngô Gia Tự, đi khoảng 200m</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-6 h-6 bg-[#27a8e3] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                                                3
                                            </div>
                                            <p>Trung tâm nằm bên tay phải, có biển hiệu màu xanh</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-[#27a8e3] text-white rounded-lg hover:bg-[#1f8bc7] transition-colors"
                                        >
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Xem trên Google Maps
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
