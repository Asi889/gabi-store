import { getProducts } from "@/lib/wordpress";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const allProducts = await getProducts();
  
  // Filter products by category slug
  const products = allProducts.filter((product: any) => 
    product.categories?.some((cat: any) => cat.slug === slug)
  );

  // LOG THE PRODUCTS AS REQUESTED
  console.log(`--- Category: ${slug} ---`);
  console.log(`Found ${products.length} products:`, products.map(p => p.name));
  console.log('-------------------------');

  const displayName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/products" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors mb-6 block">
          ← Back to All
        </Link>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">
          {displayName}
        </h1>
        <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-12">
          {products.length} {products.length === 1 ? 'item' : 'items'} found
        </p>

        {/* Product Grid - Using the same interactive ProductCard */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full border-t border-gray-100 -mx-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Development Mode</h2>
            <p className="text-sm text-gray-500 font-bold max-w-md mx-auto leading-relaxed">
              No products found in category "{slug}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
