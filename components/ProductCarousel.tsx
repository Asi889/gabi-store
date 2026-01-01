'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCarouselProps {
  products: any[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScrollability);
      }
      window.removeEventListener('resize', checkScrollability);
    };
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product: any) => (
          <div key={product.id} className="flex-none w-[250px] md:w-[450px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {products.length > 1 && (
        <>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 text-white shadow-xl flex items-center justify-center z-20 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-black active:scale-90"
            aria-label="Previous product"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/80 text-white shadow-xl flex items-center justify-center z-20 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-black active:scale-90"
            aria-label="Next product"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const hoverImage = product.carbon_fields?.hover_person_image;
  const mainImage = product.images?.[0]?.src;

  return (
    <Link href={`/products/${product.slug}`} className="group block relative aspect-[3/4] bg-gray-50 overflow-hidden">
      {mainImage && (
        <Image 
          src={mainImage} 
          alt={product.name} 
          fill 
          className={`object-cover transition-opacity duration-1000 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} 
        />
      )}
      {hoverImage && (
        <Image
          src={hoverImage}
          alt={`${product.name} lifestyle`}
          fill
          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        />
      )}
      {!mainImage && <div className="absolute inset-0 flex items-center justify-center text-gray-300 italic text-xs uppercase tracking-widest">No Image</div>}
    </Link>
  );
}

