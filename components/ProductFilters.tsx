'use client';

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  categories: any[];
  colors: { hex: string, name: string }[];
  sizes: string[];
  onFilterChange: (filters: any) => void;
}

export default function ProductFilters({ categories, colors, sizes, onFilterChange }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string>('all');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const updateFilters = (newFilters: any) => {
    onFilterChange({
      categories: newFilters.categories || selectedCategories,
      colors: newFilters.colors || selectedColors,
      sizes: newFilters.sizes || selectedSizes,
      availability: newFilters.availability || availability,
    });
  };

  const toggleFilter = (list: string[], setList: (l: string[]) => void, value: string, key: string) => {
    const newList = list.includes(value) ? list.filter(i => i !== value) : [...list, value];
    setList(newList);
    updateFilters({ [key]: newList });
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setAvailability('all');
    onFilterChange({ categories: [], colors: [], sizes: [], availability: 'all' });
    setOpenDropdown(null);
  };

  const FilterDropdown = ({ label, id, children, activeCount }: { label: string, id: string, children: React.ReactNode, activeCount?: number }) => (
    <div className="relative">
      <button 
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 border border-gray-100 text-[11px] font-black uppercase tracking-widest transition-all",
          openDropdown === id ? "bg-black text-white border-black" : "bg-white text-slate-500 hover:border-black",
          activeCount && activeCount > 0 ? "border-black bg-gray-50 text-slate-500" : ""
        )}
      >
        {label}
        {activeCount !== undefined && activeCount > 0 && <span className="ml-1 bg-black text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">{activeCount}</span>}
        <ChevronDown className={cn("w-3 h-3 transition-transform", openDropdown === id ? "rotate-180" : "")} />
      </button>
      
      {openDropdown === id && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 shadow-xl z-[60] p-6 animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 1. Category Filter */}
      <FilterDropdown label="Category" id="category" activeCount={selectedCategories.length}>
        <div className="space-y-3">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat.slug, 'categories')}
              className="flex items-center justify-between w-full text-left text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-400"
            >
              {cat.name}
              {selectedCategories.includes(cat.slug) && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </FilterDropdown>

      {/* 2. Color Filter */}
      <FilterDropdown label="Color" id="color" activeCount={selectedColors.length}>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => (
            <button 
              key={color.hex}
              onClick={() => toggleFilter(selectedColors, setSelectedColors, color.hex, 'colors')}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all hover:scale-110 relative",
                selectedColors.includes(color.hex) ? "border-black scale-110" : "border-gray-100"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColors.includes(color.hex) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={cn("w-1.5 h-1.5 rounded-full", ['#ffffff', '#fff', 'white'].includes(color.hex.toLowerCase()) ? "bg-black" : "bg-white")} />
                </div>
              )}
            </button>
          ))}
        </div>
      </FilterDropdown>

      {/* 3. Size Filter */}
      <FilterDropdown label="Size" id="size" activeCount={selectedSizes.length}>
        <div className="grid grid-cols-3 gap-2">
          {sizes.length > 0 ? sizes.map((size) => (
            <button 
              key={size}
              onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size, 'sizes')}
              className={cn(
                "h-10 flex items-center justify-center border text-[10px] font-black uppercase tracking-widest transition-all",
                selectedSizes.includes(size) ? "bg-black text-white border-black" : "bg-white text-slate-500 border-gray-100 hover:border-black"
              )}
            >
              {size}
            </button>
          )) : (
            <p className="col-span-3 text-[9px] text-gray-400 uppercase text-center py-4">No sizes available</p>
          )}
        </div>
      </FilterDropdown>

      {/* 4. Availability Filter */}
      <FilterDropdown label="Availability" id="availability" activeCount={availability !== 'all' ? 1 : 0}>
        <div className="space-y-3">
          {['all', 'instock', 'preorder'].map((status) => (
            <button 
              key={status}
              onClick={() => {
                setAvailability(status);
                updateFilters({ availability: status });
                setOpenDropdown(null);
              }}
              className="flex items-center justify-between w-full text-left text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-400"
            >
              {status === 'all' ? 'Show All' : status === 'instock' ? 'In Stock' : 'Pre-order'}
              {availability === status && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </FilterDropdown>

      {/* Reset Button - Always visible */}
      <button 
        onClick={handleReset}
        className={cn(
          "text-[9px] font-black uppercase tracking-widest transition-colors px-4",
          (selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || availability !== 'all')
            ? "text-slate-300 hover:text-slate-400"
            : "text-slate-500 hover:text-slate-400"
        )}
        disabled={selectedCategories.length === 0 && selectedColors.length === 0 && selectedSizes.length === 0 && availability === 'all'}
      >
        Clear All
      </button>

      {/* Close Dropdown Backdrop */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}
