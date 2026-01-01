import { getPageBySlug, getProducts } from "@/lib/wordpress";
import Image from "next/image";
import Link from "next/link";
import ParallaxGallery from "@/components/ParallaxGallery";
import ProductCarousel from "@/components/ProductCarousel";

export default async function Home() {
  const homePage = await getPageBySlug("home");
  const allProducts = await getProducts();
  const carbonFields = homePage?.carbon_fields || {};

  // 1. GET MANUAL SELECTIONS
  const carouselSelection = carbonFields.homepage_featured_products || [];
  
  // Robust ID extraction (works with IDs or Objects)
  const selectionIds = Array.isArray(carouselSelection) 
    ? carouselSelection.map((item: any) => {
        const id = typeof item === 'object' ? (item.id || item.value) : item;
        return String(id);
      })
    : [];

  // 2. SORT PRODUCTS - Respect the drag-and-drop order from WordPress
  const featuredProducts = selectionIds
    .map((id: string) => allProducts.find((p: any) => String(p.id) === id))
    .filter(Boolean); // Remove any that weren't found

  // 3. STREET GALLERY IMAGES
  const streetGallery = carbonFields.street_gallery_images || [];
  
  // Fallback images so the gallery is never empty while you are setting up WP
  const placeholderImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529133039941-7f169c21ea35?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop"
  ];

  const galleryImages = streetGallery.length > 0 ? streetGallery : placeholderImages;

  return (
    <div className="bg-white">
      {/* ... (Hero and Dual Banner same as before) ... */}
      {/* 1. FULL SCREEN HERO SECTION */}
      {carbonFields.hero_bg_image && (
        <section className="relative h-[calc(120vh-64px)] w-full flex items-center justify-center overflow-hidden bg-gray-100">
          {/* Desktop Image */}
          <Image
            src={carbonFields.hero_bg_image}
            alt={carbonFields.hero_main_title || "Hero Image"}
            fill
            className={`object-cover object-top ${carbonFields.hero_bg_image_mobile ? 'hidden md:block' : 'block'}`}
            priority
          />
          {/* Mobile Image (Only shown if set in WP) */}
          {carbonFields.hero_bg_image_mobile && (
            <Image
              src={carbonFields.hero_bg_image_mobile}
              alt={carbonFields.hero_main_title || "Hero Image Mobile"}
              fill
              className="object-cover object-top md:hidden"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center text-white text-shadow-lg">
            {carbonFields.hero_main_title && (
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 uppercase">
                {carbonFields.hero_main_title}
              </h1>
            )}
            <div className="grid sm:flex-row gap-4 w-full justify-center">
              <Link
                href={carbonFields.hero_btn_1_url || "/clothing"}
                className="px-5 opacity-70 hover:opacity-100 py-3 bg-white rounded text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
              >
                {carbonFields.hero_btn_1_text || "Shop 2-hand"}
              </Link>
              <Link
                href={carbonFields.hero_btn_2_url || "/crochet"}
                className="px-5 opacity-70 hover:opacity-100 py-3 bg-white rounded text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
              >
                {carbonFields.hero_btn_2_text || "Shop Crochet"}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. SINGLE PRODUCT CAROUSEL - Seamless with Background */}
      <section className="overflow-hidden bg-white">
        {featuredProducts.length > 0 ? (
          <ProductCarousel products={featuredProducts} />
        ) : (
          <div className="text-center py-20 text-gray-400 italic">Select products in WordPress Home page to see them here.</div>
        )}
      </section>

      {/* 2. DUAL CATEGORY BANNER (RESTORED) */}
      <section className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-64px)] w-full bg-white">
        <div className="w-full md:w-1/2 relative group overflow-hidden h-[60vh] md:h-full">
          {carbonFields.cat_left_image ? (
            <Image src={carbonFields.cat_left_image} alt="Left Category" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : <div className="absolute inset-0 bg-gray-200" />}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/10 group-hover:bg-black/20 transition-all">
            <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-widest mb-6">{carbonFields.cat_left_text || "Crochet"}</h3>
            <Link href={carbonFields.cat_left_url || "/products"} className="px-8 py-3 bg-white text-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors">Shop Now</Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative group overflow-hidden h-[60vh] md:h-full">
          {carbonFields.cat_right_image ? (
            <Image src={carbonFields.cat_right_image} alt="Right Category" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : <div className="absolute inset-0 bg-gray-200" />}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/10 group-hover:bg-black/20 transition-all">
            <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-widest mb-6">{carbonFields.cat_right_text || "Clothing"}</h3>
            <Link href={carbonFields.cat_right_url || "/products"} className="px-8 py-3 bg-white text-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors">Shop Now</Link>
          </div>
        </div>
      </section>

      

      {/* 4. STREET GALLERY - RESTORED PARALLAX EFFECT */}
      <ParallaxGallery 
        title={carbonFields.gallery_title} 
        images={galleryImages} 
      />

      {/* DEBUG BOX */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 text-[10px] rounded-lg z-50">
          Products in Selection: {selectionIds.length} | Found in Shop: {featuredProducts.length}
        </div>
      )}
    </div>
  );
}
