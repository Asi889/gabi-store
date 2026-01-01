'use client';

import { getProductBySlug, getSiteInfo } from "@/lib/wordpress";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [siteInfo, setSiteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      
      const [productData, info] = await Promise.all([
        getProductBySlug(slug),
        getSiteInfo()
      ]);

      setProduct(productData);
      setSiteInfo(info);

      if (productData) {
        setActiveImage(productData.images?.[0]?.src || "");
        const variants = productData.carbon_fields?.product_variants || [];
        if (productData.carbon_fields?.main_color_name) {
          setSelectedVariant({ 
            variant_name: productData.carbon_fields.main_color_name,
            variant_color: productData.carbon_fields.main_color_dot,
            is_main: true 
          });
        } else if (variants.length > 0) {
          setSelectedVariant(variants[0]);
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  // Sync active image when variant changes
  useEffect(() => {
    if (selectedVariant) {
      if (selectedVariant.variant_image) {
        setActiveImage(selectedVariant.variant_image);
      } else if (selectedVariant.variant_gallery && selectedVariant.variant_gallery.length > 0) {
        setActiveImage(selectedVariant.variant_gallery[0]);
      } else if (selectedVariant.is_main) {
        setActiveImage(product?.images?.[0]?.src || "");
      }
      setActiveImageIndex(0);
      if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    }
  }, [selectedVariant, product]);

  const isOnSale = product?.on_sale;
  const regularPrice = parseFloat(product?.regular_price || "0");
  const salePrice = parseFloat(product?.sale_price || "0");
  const discountPercent = isOnSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  const mainGallery = [...(product?.images || [])];
  const carbonGallery = product?.carbon_fields?.product_gallery || [];
  carbonGallery.forEach((url: string) => {
    if (!mainGallery.find(img => img.src === url)) {
      mainGallery.push({ src: url });
    }
  });

  const variantMainImage = selectedVariant?.variant_image;
  const variantGallery = selectedVariant?.variant_gallery || [];
  let displayImages: any[] = [];
  
  if (selectedVariant && !selectedVariant.is_main) {
    if (variantMainImage) displayImages.push({ src: variantMainImage });
    variantGallery.forEach((url: string) => {
      if (url !== variantMainImage) displayImages.push({ src: url });
    });
    if (displayImages.length === 0) displayImages = mainGallery;
  } else {
    displayImages = mainGallery;
  }

  // Debug Hook - NOW AT THE TOP
  useEffect(() => {
    if (product) {
      console.log("Product Images Found:", {
        main: product.images?.length || 0,
        carbon_gallery: product.carbon_fields?.product_gallery?.length || 0,
        total_display: displayImages.length
      });
    }
  }, [product, displayImages]);

  const handleAddToCart = () => {
    const availableSizes = product?.carbon_fields?.available_sizes || [];
    const allPossibleSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
    const brand = product?.carbon_fields?.brand_name || "";

    if (allPossibleSizes.some(s => availableSizes.includes(s)) && !selectedSize) {
      setError("Please select a size");
      return;
    }
    setError(null);
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: isOnSale ? salePrice : regularPrice,
      image: activeImage || product.images?.[0]?.src || "",
      color: selectedVariant?.variant_name || "Default",
      size: selectedSize || "One Size",
      slug: product.slug,
      brand: brand
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveImageIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
      setActiveImageIndex(index);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-white">
      <h1 className="text-xl font-bold uppercase tracking-tighter">Product Not Found</h1>
      <Link href="/products" className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] underline">Back to Shop</Link>
    </div>
  );

  const variants = product.carbon_fields?.product_variants || [];
  const mainColorDot = product.carbon_fields?.main_color_dot;
  const mainColorName = product.carbon_fields?.main_color_name || "Original";
  const badges = product.carbon_fields?.product_badges || [];
  const brand = product.carbon_fields?.brand_name || "";
  const availableSizes = product.carbon_fields?.available_sizes || [];
  const allPossibleSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'];

  let customButtonImage = product.carbon_fields?.add_to_bag_button_image;
  if (!customButtonImage && siteInfo?.global_buttons) {
    const categorySlugs = product.categories?.map((cat: any) => cat.slug.toLowerCase()) || [];
    const categoryNames = product.categories?.map((cat: any) => cat.name.toLowerCase()) || [];
    const productTitle = product.name?.toLowerCase() || "";
    const productSlug = product.slug?.toLowerCase() || "";
    const allSearchTerms = [...categorySlugs, ...categoryNames, productTitle, productSlug];
    
    if (allSearchTerms.some(s => s.includes('crochet') || s.includes('bag'))) {
      customButtonImage = siteInfo.global_buttons.crochet;
    } else if (allSearchTerms.some(s => s.includes('cloth') || s.includes('shirt') || s.includes('pant'))) {
      customButtonImage = siteInfo.global_buttons.clothing;
    }
  }

  return (
    <div className="bg-white min-h-screen pt-4 md:pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-0 md:gap-16 lg:gap-24">
          
          {/* 1. IMAGES SECTION (Carousel on Mobile, Main + Thumbs on Desktop) */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-4 order-1 lg:order-2">
            
            <div className="relative flex-1 group">
              <div className="relative aspect-square md:aspect-3/4 bg-gray-50 md:bg-white overflow-hidden max-h-[320px] w-full">
                {/* Desktop View */}
                <div className="hidden md:block relative w-full h-full">
                  {activeImage && (
                    <Image src={activeImage} alt={product.name} fill className="object-contain transition-transform duration-1000 hover:scale-110" priority />
                  )}
                </div>

                {/* Mobile View: Carousel */}
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="md:hidden absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth z-10"
                >
                  {displayImages.map((img: any, idx: number) => (
                    <div key={idx} className="flex-none w-full h-full snap-center relative">
                      <Image src={img.src} alt={`${product.name} ${idx}`} fill className="object-contain" priority={idx === 0} />
                    </div>
                  ))}
                </div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
                  {isOnSale && (
                    <div className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-tighter">
                      {discountPercent}% OFF
                    </div>
                  )}
                  {badges.map((badge: any, idx: number) => (
                    <div key={idx} className="bg-white text-black border-2 border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {badge.badge_type === 'custom' ? badge.badge_text : badge.badge_type}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation Arrows - Moved outside and made higher Z-index */}
              {displayImages.length > 1 && (
                <div className="md:hidden contents">
                  <button 
                    onClick={(e) => { e.preventDefault(); scrollToIndex(activeImageIndex - 1); }}
                    disabled={activeImageIndex === 0}
                    className="absolute left-2 top-[50%] -translate-y-1/2 w-10 h-10 rounded-full bg-black text-white shadow-xl flex items-center justify-center z-40 disabled:opacity-20 transition-all active:scale-90"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); scrollToIndex(activeImageIndex + 1); }}
                    disabled={activeImageIndex === displayImages.length - 1}
                    className="absolute right-2 top-[50%] -translate-y-1/2 w-10 h-10 rounded-full bg-black text-white shadow-xl flex items-center justify-center z-40 disabled:opacity-20 transition-all active:scale-90"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}

              {/* Carousel Indicators (Mobile Only) - Underneath the image */}
              {displayImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-2 md:hidden">
                  {displayImages.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => scrollToIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${activeImageIndex === idx ? 'bg-black w-8' : 'bg-gray-200 w-2'}`} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Thumbnails (Hidden on Mobile) */}
            <div className="hidden md:flex md:flex-col gap-3 w-24 shrink-0">
              {displayImages.map((img: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img.src)}
                  className={`relative aspect-[3/4] w-24 bg-gray-50 border-2 transition-all duration-300 ${activeImage === img.src ? 'border-black opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img.src} alt={`${product.name} thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. PRODUCT INFO SECTION */}
          <div className="w-full lg:w-[40%] flex flex-col order-2 lg:order-1 px-6 md:px-0 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-col-reverse">
              <div className="mb-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{brand}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 md:mb-6 leading-tight text-black">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 mb-4 md:mb-10 pb-2 md:pb-8 border-b border-gray-100">
              {isOnSale ? (
                <>
                  <span className="text-xl md:text-2xl font-black text-black">₪{salePrice.toFixed(2)}</span>
                  <span className="text-sm md:text-base text-gray-400 line-through font-medium">₪{regularPrice.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-xl md:text-2xl font-black text-black">₪{regularPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="">
              <div className="hidden md:flex items-center gap-2 mb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Color:</span>
                <span className="text-[11px] font-black uppercase text-black">{selectedVariant?.variant_name}</span>
              </div>
              <div className="flex gap-2 md:gap-3">
                {mainColorDot && (
                  <button onClick={() => setSelectedVariant({ variant_name: mainColorName, variant_color: mainColorDot, is_main: true })} className={`w-10 h-10 md:w-8 md:h-8 border-2 p-0.5 transition-all ${selectedVariant?.is_main ? 'border-black scale-105' : 'border-transparent hover:border-gray-300'} rounded-lg md:rounded-full`}><div className="w-full h-full rounded-[inherit]" style={{ backgroundColor: mainColorDot }} /></button>
                )}
                {variants.map((variant: any, idx: number) => (
                  <button key={idx} onClick={() => setSelectedVariant(variant)} className={`w-10 h-10 md:w-8 md:h-8 border-2 p-0.5 transition-all ${selectedVariant?.variant_name === variant.variant_name && !selectedVariant.is_main ? 'border-black scale-105' : 'border-transparent hover:border-gray-300'} rounded-lg md:rounded-full`}><div className="w-full h-full shadow-inner rounded-[inherit]" style={{ backgroundColor: variant.variant_color }} /></button>
                ))}
              </div>
              <div className="mt-1 md:hidden"><span className="text-[10px] font-black uppercase text-black">{selectedVariant?.variant_name}</span></div>
            </div>

            <div className="pt-3">
              <span className="hidden md:block text-[11px]  uppercase tracking-widest  mb-4">Size:</span>
              <div className="md:hidden relative">
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full h-12 px-4 appearance-none border border-gray-300 text-[11px] text-black uppercase tracking-widest bg-white rounded-none">
                  <option className="text-black" value="">Select Size</option>
                  {allPossibleSizes.map((size) => {
                    const isAvailable = availableSizes.includes(size);
                    return <option key={size} value={size} className="text-gray-400" disabled={!isAvailable}>{size.toUpperCase()} {!isAvailable ? '- Out of Stock' : ''}</option>;
                  })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="w-3 h-3" fill="none" stroke="black" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg></div>
              </div>
              <div className="hidden md:grid grid-cols-4 gap-2">
                {allPossibleSizes.map((size) => {
                  const isAvailable = availableSizes.includes(size);
                  return <button key={size} disabled={!isAvailable} onClick={() => setSelectedSize(size)} className={`h-12 flex items-center justify-center text-[10px] font-black uppercase border transition-all ${!isAvailable ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' : selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'}`}>{size}</button>;
                })}
              </div>
            </div>

            <div className="flex gap-2 mb-12">
              <div className="flex-1">
                {error && <p className="text-red-500 text-[10px] font-black uppercase mb-4 tracking-widest">{error}</p>}
                {customButtonImage ? (
                  <button onClick={handleAddToCart} className="w-full relative h-24 md:h-40 overflow-hidden group focus:outline-none mt-5">
                    <Image src={customButtonImage} alt={added ? 'Added!' : 'Add to Bag'} fill className={`object-contain object-left md:object-center transition-all duration-300 ${added ? 'brightness-50' : 'group-hover:scale-[1.02]'}`} />
                    {added && (
                      <div className="absolute inset-0 flex items-center justify-start md:justify-center pl-8 md:pl-0">
                        <span className="text-white text-[14px] font-black uppercase tracking-widest">ADDED!</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <button onClick={handleAddToCart} className={`w-full py-8 md:py-10 font-black uppercase tracking-[0.4em] text-[15px] md:text-[16px] transition-all border-2 border-black shadow-md ${added ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}>
                    {added ? 'ADDED TO BAG!' : 'ADD TO BAG'}
                  </button>
                )}
              </div>
            </div>

            {added && <Link href="/cart" className="block w-full text-left md:text-center text-[10px] font-black uppercase tracking-[0.2em] underline mb-12">View Shopping Bag</Link>}

            <div className="space-y-0 border-t border-gray-100">
              <div className="border-b border-gray-100">
                <button onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')} className="w-full py-5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-black group">Product Details <span className="text-xl font-light group-hover:scale-125 transition-transform">{openAccordion === 'details' ? '−' : '+'}</span></button>
                {openAccordion === 'details' && <div className="pb-8 text-xs text-gray-500 leading-loose prose prose-sm max-w-none animate-in fade-in slide-in-from-top-1" dangerouslySetInnerHTML={{ __html: product.carbon_fields?.product_details || product.description }} />}
              </div>
              <div className="border-b border-gray-100">
                <button onClick={() => setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')} className="w-full py-5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-black group">Delivery & Returns <span className="text-xl font-light group-hover:scale-125 transition-transform">{openAccordion === 'delivery' ? '−' : '+'}</span></button>
                {openAccordion === 'delivery' && <div className="pb-8 text-xs text-gray-500 leading-loose prose prose-sm max-w-none animate-in fade-in slide-in-from-top-1" dangerouslySetInnerHTML={{ __html: product.carbon_fields?.delivery_info || "Standard delivery: 3-5 business days. Returns accepted within 14 days of purchase." }} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
