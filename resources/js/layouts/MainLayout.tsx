import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone, MapPin, Mail, Facebook, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Helper function to get proper URL
const getMenuUrl = (menu: any) => {
    if (!menu.url) return '#';
    
    // If it's already a full URL, return as is
    if (menu.url.startsWith('http://') || menu.url.startsWith('https://')) {
        return menu.url;
    }
    
    // If it's a route name (no slash), try to use route() helper
    if (!menu.url.includes('/') && !menu.url.startsWith('#')) {
        try {
            return route(menu.url);
        } catch {
            // If route doesn't exist, treat as relative path
            return '/' + menu.url;
        }
    }
    
    // If it's a relative path, ensure it starts with /
    if (!menu.url.startsWith('/') && !menu.url.startsWith('#')) {
        return '/' + menu.url;
    }
    
    return menu.url;
}

interface Menu {
    id: number;
    title: string;
    url: string;
    parent_id?: number;
    children?: Menu[];
}

interface MainLayoutProps {
    children: React.ReactNode;
    menus?: Menu[];
    settings?: any;
    slides?: any[];
}

export default function MainLayout({ children, menus = [], settings = {}, slides = [] }: MainLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const mainMenus = menus;

    const getSubMenus = (parentId: number) => {
        const menu = mainMenus.find(m => m.id === parentId);
        return menu?.children || [];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
            }`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center space-x-2">
                            <img src={`${typeof document !== 'undefined' ? ((document.querySelector('meta[name="asset-base"]') as HTMLMetaElement | null)?.content || '/') : '/'}1.png`} alt="Logo" className="h-8 w-auto" />
                            <span className="text-xl font-bold text-[#27a8e3]">Tiếng Trung Toàn Diện</span>
                        </Link>

                        {/* Desktop Menu */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {mainMenus.map((menu) => {
                                const children = getSubMenus(menu.id);
                                return (
                                    <div key={menu.id} className="relative group">
                                        <Link
                                            href={getMenuUrl(menu)}
                                            className="flex items-center space-x-1 text-gray-700 hover:text-[#27a8e3] transition-colors font-medium"
                                        >
                                            <span>{menu.title}</span>
                                            {children.length > 0 && (
                                                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                            )}
                                        </Link>
                                        
                                        {children.length > 0 && (
                                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top">
                                                <div className="py-2">
                                                    {children.map((subMenu) => (
                                                        <Link
                                                            key={subMenu.id}
                                                            href={getMenuUrl(subMenu)}
                                                            className="block px-4 py-2 text-gray-700 hover:text-[#27a8e3] hover:bg-gray-50 transition-colors"
                                                        >
                                                            {subMenu.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Contact Info */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-[#27a8e3]">
                                <Phone className="w-4 h-4" />
                                <span className="font-medium">{settings.phone || '0123 456 789'}</span>
                            </div>
                            <Link href={route('contact.index')}>
                                <Button className="bg-[#27a8e3] hover:bg-[#1f8bc7] text-white">
                                    Liên hệ ngay
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-gray-700 hover:text-[#27a8e3] transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-t">
                        <div className="container mx-auto px-4 py-4">
                            <nav className="space-y-2">
                                {mainMenus.map((menu) => {
                                    const children = getSubMenus(menu.id);
                                    return (
                                        <div key={menu.id}>
                                            <Link
                                                href={getMenuUrl(menu)}
                                                className="block py-2 text-gray-700 hover:text-[#27a8e3] transition-colors font-medium"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {menu.title}
                                            </Link>
                                            {children.length > 0 && (
                                                <div className="ml-4 space-y-1">
                                                    {children.map((subMenu) => (
                                                        <Link
                                                            key={subMenu.id}
                                                            href={getMenuUrl(subMenu)}
                                                            className="block py-1 text-gray-600 hover:text-[#27a8e3] transition-colors"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            {subMenu.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center space-x-2 text-[#27a8e3] mb-3">
                                    <Phone className="w-4 h-4" />
                                    <span className="font-medium">{settings.phone || '0123 456 789'}</span>
                                </div>
                                <Link href={route('contact.index')} onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full bg-[#27a8e3] hover:bg-[#1f8bc7] text-white">
                                        Liên hệ ngay
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            

            {/* Main Content */}
            <main className={slides && slides.length > 0 ? '' : 'pt-16'}>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                {/* Top Footer Bar */}
                <div className="bg-black/20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-6">
                                <Link href={route('contact.index')} className="text-gray-300 hover:text-[#27a8e3] transition-colors">
                                    Liên Hệ
                                </Link>
                                <Link href="/tuyen-dung" className="text-gray-300 hover:text-[#27a8e3] transition-colors">
                                    Tuyển Dụng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column: Contact Information & Logo */}
                        <div>
                            {/* Logo */}
                            <div className="flex items-center mb-6">
                                <Link href={route('home')} className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 shadow-lg hover:scale-105 transition-transform">
                                    <img src={`${typeof document !== 'undefined' ? ((document.querySelector('meta[name="asset-base"]') as HTMLMetaElement | null)?.content || '/') : '/'}1.png`} alt="Logo" className="w-10 h-10" />
                                </Link>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{settings.company_name || 'Trung tâm Tiếng Trung Toàn Diện'}</h3>
                                </div>
                            </div>
                            
                            {/* Contact Details */}
                            <div className="space-y-4 text-gray-300">
                                <div className="flex items-center">
                                    <Phone className="w-5 h-5 mr-3 text-[#27a8e3] flex-shrink-0" />
                                    <span className="font-medium">{settings.phone || '0123 456 789'}</span>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="w-5 h-5 mr-3 mt-1 text-[#27a8e3] flex-shrink-0" />
                                    <span>{settings.address || 'Địa chỉ trung tâm'}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 mr-3 text-[#27a8e3] flex-shrink-0" />
                                    <span className="font-medium">{settings.email || 'info@tiengtrung.com'}</span>
                                </div>
                            </div>
                            
                            {/* Social Media */}
                            <div className="flex space-x-4 mt-6">
                                <a href={settings.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                    <Facebook className="w-5 h-5 text-white" />
                                </a>
                                <a href={settings.youtube_channel || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#ff0000] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                    <Youtube className="w-5 h-5 text-white" />
                                </a>
                            </div>
                        </div>

                        {/* Middle Column: Courses */}
                        <div>
                            <h4 className="text-xl font-bold mb-6 text-white">CÁC KHÓA HỌC</h4>
                            <div className="space-y-3">
                                {[
                                    "Tiếng Trung sơ cấp",
                                    "Tiếng Trung trung cấp", 
                                    "Tiếng Trung giao tiếp (có G.V nước ngoài)",
                                    "Luyện thi HSK 4",
                                    "Luyện thi HSK 5"
                                ].map((course, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        <span className="text-gray-300 hover:text-[#27a8e3] transition-colors cursor-pointer">
                                            {course}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Location Map */}
                        <div>
                            <h4 className="text-xl font-bold mb-6 text-white">VỊ TRÍ TRÊN BẢN ĐỒ</h4>
                            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0964843001497!2d106.6822!3d20.8447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDUwJzQxLjAiTiAxMDbCsDQwJzU2LjAiRQ!5e0!3m2!1svi!2svn!4v1234567890"
                                    width="100%"
                                    height="250"
                                    style={{ border: 'none' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Bar */}
                <div className="bg-black py-4">
                    <div className="container mx-auto px-4">
                        <div className="text-center text-gray-400">
                            <p>Copyright 2019 Designed by Kz Media</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Hotline Button */}
            <div className="fixed bottom-6 left-6 z-40">
                <Link href={`tel:${settings.phone || '0123456789'}`}>
                    <Button className="bg-[#27a8e3] hover:bg-[#1f8bc7] text-white rounded-full w-14 h-14 shadow-lg">
                        <Phone className="w-6 h-6" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
