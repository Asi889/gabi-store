'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: number;
  title: string;
  url: string;
  slug: string;
  parent: number;
  children?: MenuItem[];
}

interface HeaderProps {
  siteName?: string;
  logo?: string;
  menuItems?: MenuItem[];
}

export default function Header({ siteName = 'Headless Store', logo, menuItems = [] }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileShopOpen(false);
  }, [pathname]);

  // Transform flat list to tree
  const menuTree = menuItems.reduce((acc: MenuItem[], item) => {
    if (item.parent === 0) {
      acc.push({ ...item, children: menuItems.filter(child => child.parent === item.id) });
    }
    return acc;
  }, []);

  const shopItem = menuTree.find(item => item.title.toLowerCase() === 'shop');

  const getHref = (item: MenuItem | { slug: string, title?: string, url?: string }) => {
    if (item.title?.toLowerCase() === 'shop') return '/products';
    if (item.slug && item.slug !== 'home') return `/${item.slug}`;
    if (item.slug === 'home') return "/";
    if ('url' in item && item.url) {
      if (item.url.includes('localhost') || item.url.includes('127.0.0.1')) {
        try {
          const url = new URL(item.url);
          return url.pathname;
        } catch (e) {
          return item.url;
        }
      }
      if (item.url.startsWith('/')) return item.url;
    }
    return "/";
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo Section */}
            <div className="flex shrink-0">
              <Link href="/" className="flex items-center group">
                {logo ? (
                  <div className="relative h-8 w-32 md:w-40">
                    <Image src={logo} alt={siteName} fill className="object-contain transition-transform group-hover:scale-105" priority />
                  </div>
                ) : (
                  <span className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">{siteName}</span>
                )}
              </Link>
            </div>

            {/* Desktop Navigation Section */}
            <div className="hidden md:flex space-x-1 items-center">
              {menuTree.map((item) => (
                <div key={item.id} className="relative" onMouseEnter={() => setActiveDropdown(item.id)} onMouseLeave={() => setActiveDropdown(null)}>
                  <Link href={getHref(item)} className="text-gray-600 hover:text-black px-4 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-colors flex items-center">
                    {item.title}
                    {item.children && item.children.length > 0 && <ChevronDown className="ml-1 w-3 h-3" />}
                  </Link>
                  {item.children && item.children.length > 0 && activeDropdown === item.id && (
                    <div className="absolute top-full left-0 w-48 bg-white shadow-xl border-t-2 border-black py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.children.map((child) => (
                        <Link key={child.id} href={getHref(child)} className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 transition-all">{child.title}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/cart" className="ml-4 text-black px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-black hover:text-white transition-all flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Bag ({cartCount})</span>
              </Link>
            </div>

            {/* Mobile Actions Section */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Shop Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                  className="flex items-center gap-1 px-2 py-2 text-[10px] font-black uppercase tracking-widest text-black"
                >
                  Shop <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isMobileShopOpen ? "rotate-180" : "")} />
                </button>

                {isMobileShopOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-2xl border border-gray-100 py-3 z-[70] animate-in fade-in slide-in-from-top-2">
                    <Link href="/products" className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-black border-b border-gray-50">All Products</Link>
                    {shopItem?.children?.map((child) => (
                      <Link key={child.id} href={getHref(child)} className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 active:bg-gray-50">{child.title}</Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Shopping Bag */}
              <Link href="/cart" className="relative p-2">
                <ShoppingBag className="w-6 h-6 text-black" />
                <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              </Link>

              {/* Hamburger Button */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black p-2 hover:bg-gray-50 transition-colors">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-[80%] h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-black"><X className="w-8 h-8" strokeWidth={1.5} /></button>
            </div>
            <div className="flex-1 px-8 py-4 overflow-y-auto">
              <nav className="flex flex-col gap-8 text-slate-600">
                <Link href="/" className="text-2xl font-black uppercase tracking-tighter italic border-b border-gray-100 pb-4">Home</Link>
                <Link href="/about" className="text-2xl font-black uppercase tracking-tighter italic border-b border-gray-100 pb-4">About</Link>
                <Link href="/contact" className="text-2xl font-black uppercase tracking-tighter italic border-b border-gray-100 pb-4">Contact</Link>
                <Link href="/cart" className="text-2xl font-black uppercase tracking-tighter italic ">My Bag / Checkout</Link>
              </nav>
            </div>
            <div className="p-8 border-t border-gray-100 bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Support</p>
              <Link href="mailto:hi@store.com" className="text-sm font-black uppercase tracking-widest text-black">hi@store.com</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
