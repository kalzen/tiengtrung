import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, Images, LayoutGrid, MessageSquare, Newspaper, Settings2, FolderOpen } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const computedItems: NavItem[] = [
        { title: 'Dashboard', href: route('dashboard'), icon: LayoutGrid },
        { title: 'Chuyên mục', href: route('admin.categories.index'), icon: FolderOpen },
        { title: 'Bài viết', href: route('admin.posts.index'), icon: Newspaper },
        { title: 'Chi nhánh', href: route('admin.branches.index'), icon: Building2 },
        { title: 'Đánh giá', href: route('admin.testimonials.index'), icon: MessageSquare },
        { title: 'Sliders', href: route('admin.sliders.index'), icon: Images },
        { title: 'Cấu hình Website', href: route('admin.settings.website.edit'), icon: Settings2 },
    ];

    return (
        <SidebarMenu>
            {computedItems.map((item) => {
                const isActive = page.url === item.href;

                return (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                            <Link href={item.href}>
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
