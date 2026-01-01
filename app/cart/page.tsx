'use client';

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="bg-white min-h-screen pt-32 pb-32">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
          <div className="mb-4">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          {/* <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">MY BAG</h1> */}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 font-bold uppercase tracking-widest mb-8">Your bag is empty</p>
            <Link href="/products" className="bg-black text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* 1. LEFT: Items List */}
            <div className="flex-1 space-y-10">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 pb-10 border-b border-gray-100 last:border-0 relative">
                  {/* Remove Button - Always visible */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-0 right-0 p-2 text-gray-700 hover:text-black transition-colors z-10 bg-white/80 hover:bg-white rounded-full"
                    aria-label="Remove item from cart"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Image */}
                  <Link href={`/products/${item.slug}`} className="relative aspect-[3/4] w-32 md:w-40 bg-gray-50 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{item.brand}</span>
                      <h3 className="text-base text-slate-600 font-black uppercase tracking-tight italic">{item.name}</h3>
                      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-2 flex flex-col gap-1">
                        <span>Color: <span className="text-black">{item.color}</span></span>
                        <span>Size: <span className="text-black">{item.size}</span></span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-md border border-gray-400 text-gray-600">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-xs font-bold w-12 text-center border-x border-gray-200">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-base font-black italic text-slate-600">₪{(item.price * item.quantity).toFixed(2)}</p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">₪{item.price.toFixed(2)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. RIGHT: Summary */}
            <div className="lg:w-96 flex flex-col gap-8">
              <div className="bg-gray-50 p-10 rounded-sm">
                <h2 className="text-lg font-black uppercase tracking-tighter mb-8 border-b border-gray-200 pb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-black italic">₪{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    <span>Estimated Shipping</span>
                    <span className="text-black italic">FREE</span>
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-tighter">Total</span>
                    <span className="text-2xl font-black italic">₪{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block w-full bg-[#FFFF00] hover:bg-black hover:text-[#FFFF00] text-black text-center py-6 mt-10 font-black uppercase tracking-[0.3em] text-[14px] transition-all shadow-sm">
                  CHECKOUT
                </Link>

                {/* PayPal Simulation */}
                <div className="mt-6 flex flex-col gap-3">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">Express Checkout</p>
                  <button className="w-full bg-[#FFC439] hover:bg-[#F2BA36] py-3 rounded-md flex items-center justify-center transition-colors">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="h-6" />
                  </button>
                </div>
              </div>

              {/* Extras Placeholder */}
              <div className="border border-gray-100 p-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Free Shipping</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">On all orders over ₪500</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

