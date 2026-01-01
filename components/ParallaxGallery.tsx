'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ParallaxGalleryProps {
  title?: string;
  images?: string[];
}

export default function ParallaxGallery({ title = "Street Gallery", images = [] }: ParallaxGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Fallback images if none provided
  const placeholderImages = [
    'https://images.unsplash.com/photo-1607419726991-5fc7e74cda67?q=80&w=2487&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=2487&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2272&auto=format&fit=crop',
  ];

  const galleryImages = images.length > 0 ? images : placeholderImages;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!trackRef.current || ticking) return;
      
      ticking = true;
      requestAnimationFrame(() => {
        if (!trackRef.current) {
          ticking = false;
          return;
        }
        
        const cards = trackRef.current.querySelectorAll('.parallax-card-img');
        const windowHeight = window.innerHeight;

        cards.forEach((el: Element) => {
          const img = el as HTMLElement;
          const parent = img.parentElement;
          if (!parent) return;
          const rect = parent.getBoundingClientRect();
          
          // Only animate if the card is visible on screen
          if (rect.top < windowHeight && rect.bottom > 0) {
            // EXACT CODEPEN PARALLAX LOGIC
            // Calculate how far through the viewport the card is (0 to 1)
            const percentage = (windowHeight - rect.top) / (windowHeight + rect.height);
            
            // Travel distance is the extra height of the image (35%)
            // We move from -17.5% to +17.5%
            const move = (percentage - 0.5) * 35; 
            img.style.transform = `translateY(${move}%)`;
          }
        });
        
        ticking = false;
      });
    };

    // Support both scroll and touch events for mobile
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [galleryImages]); // Re-run if images change

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter italic">
          {title}
        </h2>
        {/* <p className="text-gray-400 mt-2 uppercase tracking-widest text-[10px] font-bold italic">Scroll to experience</p> */}
      </div>

      <div ref={trackRef} className="grid grid-cols-2 gap-1 md:gap-2 p-1 md:p-2 bg-white max-w-7xl mx-auto">
        {galleryImages.map((src, i) => (
          <div key={i} className="parallax-card relative h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden">
            <div className="parallax-card-img absolute top-[-17.5%] left-0 w-full h-[135%] will-change-transform">
              <Image
                src={src}
                alt={`Gallery ${i}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
