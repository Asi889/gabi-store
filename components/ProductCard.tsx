'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0]?.src;
  const hoverImage = product.carbon_fields?.hover_person_image;
  const variants = product.carbon_fields?.product_variants || [];
  
  // Original Color info from WordPress
  const mainColorName = product.carbon_fields?.main_color_name || "Original";
  const mainColorDot = product.carbon_fields?.main_color_dot;

  // State to track which variant image is currently "active"
  const [activeImage, setActiveImage] = useState(mainImage);
  // State to track if we are hovering over the image area specifically
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  // Price Logic
  const isOnSale = product.on_sale;
  const regularPrice = product.regular_price;
  const salePrice = product.sale_price;
  
  // Color Count
  const totalColors = (mainColorDot ? 1 : 0) + variants.length;

  return (
    <div className="group relative bg-[#F7F1EE] flex flex-col overflow-hidden border-b border-r border-gray-100 transition-all duration-500 hover:shadow-xl hover:z-10">
      
      {/* 1. IMAGE AREA - Only this part triggers the hover image swap */}
      <Link 
        href={`/products/${product.slug}`} 
        className="relative aspect-4/5 w-full p-8 md:p-12 cursor-pointer bg-[#F7F1EE] group-hover:bg-[#F7F1EE] transition-colors duration-500"
        onMouseEnter={() => setIsHoveringImage(true)}
        onMouseLeave={() => setIsHoveringImage(false)}
      >
        {/* Sale Badge */}
        {isOnSale && (
          <Badge variant="sale" className="absolute top-6 left-6 z-10 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-none border-none">
            Sale
          </Badge>
        )}

        {/* The Selected Variant Image (or Default) */}
        {activeImage && (
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className={`object-contain h-full w-full p-2 md:p-12 transition-all duration-700 ease-in-out ${isHoveringImage && hoverImage ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          />
        )}

        {/* The Hover/Person Image - Only visible when hovering the image area */}
        {hoverImage && (
          
          <Image
            src={hoverImage}
            alt={`${product.name} hover`}
            fill
            className={`object-contain p-8 md:p-12 absolute inset-0 transition-all duration-700 ease-in-out ${isHoveringImage ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          />
        )}

        {/* Quick View / Add overlay (Optional for template) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-[#F7F1EE] backdrop-blur-sm hidden md:block">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-center text-black">View Details</p>
        </div>
      </Link>

      {/* 2. INFO AREA */}
      <div className="p-6 pt-8 relative bg-[#F7F1EE]">
        <Link href={`/products/${product.slug}`} className="block mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-black transition-colors mb-2 truncate">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-3 flex-wrap">
            {isOnSale ? (
              <>
                <span className="text-sm font-black text-green-700">₪{salePrice}</span>
                <span className="text-xs font-medium text-gray-400 line-through italic">₪{regularPrice}</span>
              </>
            ) : (
              <span className="text-sm font-black text-gray-900">₪{product.price || regularPrice}</span>
            )}
          </div>
        </Link>
          
        {/* COLOR DOTS - Clicking these updates the activeImage */}
        {(variants.length > 0 || mainColorDot) && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <div className="flex space-x-2">
              {/* 1. The Original/Main Color Dot */}
              {mainColorDot && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveImage(mainImage);
                  }}
                  className={`w-4 h-4 rounded-full border-2 transition-all hover:scale-125 focus:outline-none ${activeImage === mainImage ? 'border-black scale-110' : 'border-transparent shadow-sm'}`}
                  style={{ backgroundColor: mainColorDot }}
                  title={mainColorName}
                />
              )}

              {/* 2. The Variation Dots */}
              {variants.slice(0, 4).map((variant: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={(e) => {
                    e.preventDefault();
                    if (variant.variant_image) {
                      setActiveImage(variant.variant_image);
                    }
                  }}
                  className={`w-4 h-4 rounded-full border-2 transition-all hover:scale-125 focus:outline-none ${activeImage === variant.variant_image ? 'border-black scale-110' : 'border-transparent shadow-sm'}`}
                  style={{ backgroundColor: variant.variant_color || '#ccc' }}
                  title={variant.variant_name}
                />
              ))}
            </div>

            {/* Color Count Label */}
            {totalColors > 1 && (
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                +{totalColors - 1} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
