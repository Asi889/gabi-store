'use client';

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/wordpress";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function CrochetPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<{hex: string, name: string}[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      const products = await getProducts();
      
      // Filter for crochet products
      const crochetProducts = products.filter((p: any) => 
        p.categories?.some((c: any) => c.slug.toLowerCase().includes('crochet')) ||
        p.name.toLowerCase().includes('crochet') ||
        p.name.toLowerCase().includes('bag')
      );
      
      setAllProducts(crochetProducts);
      setFilteredProducts(crochetProducts);
      
      // 1. Extract Categories (only from crochet products)
      const cats: any[] = [];
      const catIds = new Set();
      
      // 2. Extract Colors
      const colorMap = new Map<string, string>(); // hex -> name
      
      // 3. Extract Sizes
      const sizeSet = new Set<string>();

      crochetProducts.forEach((p: any) => {
        // Categories
        p.categories?.forEach((c: any) => {
          if (!catIds.has(c.id)) {
            catIds.add(c.id);
            cats.push(c);
          }
        });

        // Colors from Carbon Fields
        const mainColor = p.carbon_fields?.main_color_dot;
        const mainColorName = p.carbon_fields?.main_color_name;
        if (mainColor) colorMap.set(mainColor.toLowerCase(), mainColorName || 'Original');

        const variants = p.carbon_fields?.product_variants || [];
        variants.forEach((v: any) => {
          if (v.variant_color) {
            colorMap.set(v.variant_color.toLowerCase(), v.variant_name || 'Variant');
          }
          if (v.variant_size) {
            sizeSet.add(v.variant_size.toLowerCase());
          }
        });

        // Sizes from 'available_sizes' set
        const availableSizes = p.carbon_fields?.available_sizes || [];
        availableSizes.forEach((s: string) => sizeSet.add(s.toLowerCase()));
      });

      setCategories(cats);
      setColors(Array.from(colorMap.entries()).map(([hex, name]) => ({ hex, name })));
      
      // Sort sizes logically
      const sizeOrder = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'one size'];
      setSizes(Array.from(sizeSet).sort((a, b) => {
        const indexA = sizeOrder.indexOf(a);
        const indexB = sizeOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      }));

      setLoading(false);
    }
    loadData();
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = [...allProducts];

    // 1. Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => 
        p.categories?.some((c: any) => filters.categories.includes(c.slug))
      );
    }

    // 2. Filter by Color
    if (filters.colors.length > 0) {
      filtered = filtered.filter(p => {
        const mainColor = p.carbon_fields?.main_color_dot?.toLowerCase();
        const variantColors = (p.carbon_fields?.product_variants || []).map((v: any) => v.variant_color?.toLowerCase());
        const allProductColors = [mainColor, ...variantColors].filter(Boolean);
        return filters.colors.some((color: string) => allProductColors.includes(color.toLowerCase()));
      });
    }

    // 3. Filter by Size
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p => {
        const availableSizes = (p.carbon_fields?.available_sizes || []).map((s: string) => s.toLowerCase());
        const variantSizes = (p.carbon_fields?.product_variants || []).map((v: any) => v.variant_size?.toLowerCase());
        const allProductSizes = [...availableSizes, ...variantSizes].filter(Boolean);
        return filters.sizes.some((size: string) => allProductSizes.includes(size.toLowerCase()));
      });
    }

    // 4. Filter by Availability
    if (filters.availability && filters.availability !== 'all') {
      filtered = filtered.filter(p => {
        if (filters.availability === 'instock') return p.stock_status === 'instock';
        if (filters.availability === 'preorder') return p.stock_status === 'onbackorder';
        return true;
      });
    }

    // 5. Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#F7F1EE]">
      {/* Header Section */}
      <div className="px-8 mb-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-600 uppercase tracking-tighter italic leading-none mb-6">
              Crochet
            </h1>
            <div className="flex items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              <span>{filteredProducts.length} Products Found</span>
              {searchQuery && (
                <>
                  <span className="w-1 h-1 bg-gray-200 rounded-full" />
                  <span className="text-black tracking-normal italic normal-case font-medium">Searching for &quot;{searchQuery}&quot;</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-80">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange({ categories: [], colors: [], sizes: [], availability: 'all' });
                }}
                className="w-full bg-gray-50 border-none px-6 py-4 text-sm font-medium text-slate-500 focus:ring-1 focus:ring-black placeholder-gray-400"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`md:hidden p-4 bg-gray-50 text-black transition-colors ${showFilters ? 'bg-black text-white' : ''}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto md:px-8 px-6 bg-[#F7F1EE]">
        {/* Horizontal Top Filter */}
        <div className={`mb-12 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <ProductFilters 
            categories={categories} 
            colors={colors}
            sizes={sizes}
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Main Product Grid */}
        <div className="flex-1 bg-[#d7d5d4]">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full border-t border-l border-gray-100 gap-1">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-100">
              <X className="w-8 h-8 text-gray-200 mb-4" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">No matching results</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setFilteredProducts(allProducts);
                }}
                className="text-[10px] font-black uppercase tracking-widest underline underline-offset-8 decoration-1"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
