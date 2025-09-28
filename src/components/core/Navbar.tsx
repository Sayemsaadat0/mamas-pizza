'use client';
import { useEffect, useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowRight,
    MenuIcon,
    ShoppingCart,
    X,
    Phone,
    Mail,
    MapPin,
    Truck,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    User,
    LogIn,
    LogOut,
    UserCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';
import { defaultNavMenuData } from '../constant';
import Image from 'next/image';
import Logo from './Logo';
// import Logo from './logo/Logo';

// -------------------------
// Top Contact Navbar
// -------------------------
interface ContactNavProps {
    hide?: boolean;
}

const ContactNav: React.FC<ContactNavProps> = ({ hide }) => {
    return (
        <div
            className={`${hide ? "hidden" : "block"
                } bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white`}
        >
            <div className="w-full ah-container text-xs md:text-sm flex justify-between items-center py-3">
                {/* Left Side - Contact Info */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Phone */}
                    <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <Phone size={14} className="text-orange-500" />
                        <span>+1 (555) 123-4567</span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <Mail size={14} className="text-orange-500" />
                        <span>hello@foodapp.com</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <MapPin size={14} className="text-orange-500" />
                        <span>123 Food Street, NY</span>
                    </div>
                </div>

                {/* Center - Delivery Status */}
                <div className="flex items-center gap-2 text-green-400 font-medium">
                    <Truck size={14} className="animate-pulse" />
                    <span className="hidden sm:inline">Fast Delivery Available</span>
                    <span className="sm:hidden">Fast Delivery</span>
                </div>

                {/* Right Side - Social Media & Payment */}
                <div className="flex items-center gap-4">
                    {/* Social Media */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Facebook size={14} />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Twitter size={14} />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Instagram size={14} />
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                            <Youtube size={14} />
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px h-4 bg-gray-600"></div>

                    {/* Payment Methods */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">We Accept:</span>
                        <Image
                            width={100}
                            height={30}
                            src="/payments/paymen.jpg"
                            alt="Payment Methods"
                            className="object-contain rounded-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------
// Hamburger Menu
// -------------------------
const DefaultHamburgerMenu: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <aside>
            <Sheet open={open} onOpenChange={() => setOpen(!open)}>
                <SheetTrigger asChild>
                    <button className="p-2 rounded-xl bg-gray-100 border border-gray-300 hover:border-gray-400 transition-colors duration-300 group">
                        <MenuIcon size={24} className="text-gray-800 group-hover:text-black" />
                    </button>
                </SheetTrigger>
                <SheetContent className="bg-white border-l border-gray-200 p-0 overflow-hidden w-[320px] sm:w-[380px]">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <Logo />
                            <SheetClose asChild>
                                <button className="p-2 rounded-xl bg-gray-100 border border-gray-300 hover:border-gray-400 transition-colors duration-300">
                                    <X size={20} className="text-gray-800" />
                                </button>
                            </SheetClose>
                        </div>

                        {/* Menu Content */}
                        <div className="flex-1 flex flex-col justify-between p-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-0.5 bg-orange-500 rounded-full"></div>
                                    Navigation
                                </h3>

                                <div className="space-y-1">
                                    {defaultNavMenuData.map((item: any, index: number) => (
                                        <div key={item.path} >
                                            <DefaultNavMenuItem item={item} index={index} />
                                        </div>
                                    ))}
                                </div>

                                {/* Additional Mobile Menu Items */}
                                <div className="mt-8 space-y-1">
                                    <Link href="/menu" className="flex items-center justify-between p-4 rounded-2xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all duration-300">
                                        <span className="text-base font-medium">Order Now</span>
                                        <ShoppingCart size={16} className="text-gray-500" />
                                    </Link>
                                    <Link href="/contact" className="flex items-center justify-between p-4 rounded-2xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200 transition-all duration-300">
                                        <span className="text-base font-medium">Track Order</span>
                                        <Truck size={16} className="text-gray-500" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </aside>
    );
};

// -------------------------
// Nav Item
// -------------------------
const DefaultNavMenuItem: React.FC<{ item: any; index: number }> = ({ item }) => {
    const pathname = usePathname();
    const isActive = pathname === item.path;

    return (
        <Link
            href={item.path}
            className={`block p-4 rounded-2xl transition-all duration-300 group ${isActive
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200'
                }`}
        >
            <div className="flex items-center justify-between">
                <span className="text-base font-medium">{item.title}</span>
                <ArrowRight
                    size={16}
                    className={`transition-transform duration-300 group-hover:translate-x-1 ${isActive ? 'text-white' : 'text-gray-500'
                        }`}
                />
            </div>
        </Link>
    );
};

// -------------------------
// Desktop Menu
// -------------------------
export const DefaultNavMenuList: React.FC = () => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col pl-7 py-16 lg:gap-6 lg:pl-0 lg:py-0 lg:flex-row lg:items-center whitespace-nowrap">
            {defaultNavMenuData.map((i) => (
                <div key={i.path}>
                    <Link
                        className={`font-semibold uppercase px-3 tracking-widest py-2 rounded-full transition-all duration-300 ${pathname === i.path
                            ? 'text-orange-600 bg-orange-100'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                            }`}
                        href={i.path}
                    >
                        {i.title}
                    </Link>
                </div>
            ))}
        </div>
    );
};

// -------------------------
// Main Navbar (with scroll hide)
// -------------------------
const Navbar: React.FC = () => {
    const [hide, setHide] = useState(false);
    const { user, isAuthenticated, clearUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setHide(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        clearUser();
        router.push('/');
    };

    return (
        <div className={` fixed w-full top-0 left-0 z-30`}>
            <ContactNav hide={hide} />

            {/* Main Nav */}
            <div className={`w-full bg-white shadow-lg border-b border-gray-100`}>
                <nav className="flex relative  justify-between ah-container items-center text-gray-800">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center">
                            <div >
                                <Logo />
                            </div>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3 md:gap-4 xl:gap-6 justify-end">
                        {/* Desktop Menu */}
                        <div className="hidden lg:flex">
                            <DefaultNavMenuList />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 md:gap-3">
                        

                            {/* User Account */}
                            {isAuthenticated ? (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition-colors group"
                                    >
                                        <UserCircle size={20} className="text-gray-600 group-hover:text-orange-600" />
                                        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors group"
                                    >
                                        <LogOut size={16} className="text-red-600" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden md:flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-orange-100 transition-colors group"
                                >
                                    <LogIn size={20} className="text-gray-600 group-hover:text-orange-600" />
                                    <span className="text-sm font-medium text-gray-700">Login</span>
                                </Link>
                            )}

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative p-2 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors group"
                            >
                                <ShoppingCart size={20} className="text-white" />
                                {/* Badge */}
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                                    3
                                </span>
                            </Link>

                            {/* CTA */}
                            <Link
                                href="/menu"
                                className="hidden md:block bg-gradient-to-r from-orange-600 to-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg hover:from-orange-700 hover:to-red-600 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Order Now
                            </Link>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="block lg:hidden pl-1">
                            <DefaultHamburgerMenu />
                        </div>
                    </div>

                </nav>
            </div>
        </div>
    );
};

export default Navbar;
