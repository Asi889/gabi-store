'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  // 1. FORM VALIDATION
  const isEmailValid = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isPhoneValid = (phone: string) => {
    // Basic phone validation: digits, spaces, hyphens, and optional + prefix
    // At least 9 digits for Israeli numbers
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 9;
  };

  const isFormValid = 
    customer.firstName.trim().length > 1 && 
    customer.lastName.trim().length > 1 && 
    isEmailValid(customer.email) && 
    isPhoneValid(customer.phone);

  const handlePayPalSuccess = async (details: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          cart,
          total: cartTotal,
          orderId: details.id
        })
      });

      const result = await response.json();
      if (result.success) {
        setOrderData(result.order);
        setSuccess(true);
        clearCart();
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error("Finalizing Order Error:", err);
      setError("Payment received, but failed to create order in WordPress. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-8">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Payment Success!</h1>
          <p className="text-gray-500 mb-8 font-medium">Thank you for your order. We've sent a confirmation email to <span className="text-black">{customer.email}</span>.</p>
          <div className="bg-gray-50 p-6 rounded-sm mb-8 text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Order Number</p>
            <p className="text-lg font-black italic">#{orderData?.id || '...'}</p>
          </div>
          <Link href="/products" className="block w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-[12px] hover:bg-gray-900 transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ 
      "client-id": "test", // Use "test" for simulation, or your Real Client ID
      currency: "ILS",
      intent: "capture"
    }}>
      <div className="bg-white min-h-screen md:pt-32 pt-10 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* 1. LEFT: Customer Info Form */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-12 text-slate-800">Checkout</h1>
              
              <div className="space-y-8">
                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 border-b border-gray-100 pb-2">Customer Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={customer.firstName}
                        onChange={(e) => setCustomer({...customer, firstName: e.target.value})}
                        className="w-full bg-gray-50 border-none p-4 text-sm font-bold text-slate-700 focus:ring-1 focus:ring-black placeholder-slate-300" 
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={customer.lastName}
                        onChange={(e) => setCustomer({...customer, lastName: e.target.value})}
                        className="w-full bg-gray-50 border-none p-4 text-sm font-bold text-slate-700 focus:ring-1 focus:ring-black placeholder-slate-300" 
                        placeholder="Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                        className="w-full bg-gray-50 border-none p-4 text-sm font-bold text-slate-700 focus:ring-1 focus:ring-black placeholder-slate-300" 
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                        className="w-full bg-gray-50 border-none p-4 text-sm font-bold text-slate-700 focus:ring-1 focus:ring-black placeholder-slate-300" 
                        placeholder="050-000-0000"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 border-b border-gray-100 pb-2">Payment</h2>
                  
                  {!isFormValid ? (
                    <div className="p-8 bg-gray-50 border border-dashed border-gray-200 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Please fill in your contact information first</p>
                    </div>
                  ) : (
                    <div className="max-w-md">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                          <Loader2 className="w-8 h-8 animate-spin text-black" />
                          <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Creating Order...</p>
                        </div>
                      ) : (
                        <PayPalButtons 
                          style={{ layout: "vertical", shape: "rect", label: "checkout" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [{
                                amount: {
                                  currency_code: "ILS",
                                  value: cartTotal.toFixed(2)
                                }
                              }]
                            });
                          }}
                          onApprove={async (data, actions) => {
                            if (actions.order) {
                              const details = await actions.order.capture();
                              handlePayPalSuccess(details);
                            }
                          }}
                          onError={(err) => {
                            console.error("PayPal Error:", err);
                            setError("There was an error with PayPal. Please try again.");
                          }}
                        />
                      )}
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-sm flex items-center gap-3 text-xs font-bold">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* 2. RIGHT: Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-gray-50 p-8 rounded-sm sticky top-24">
                <h2 className="text-lg text-slate-600 font-black uppercase tracking-tighter mb-8 border-b border-gray-200 pb-4 italic">Summary</h2>
                
                <div className="space-y-6 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-20 bg-white">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">{item.quantity}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-tight truncate">{item.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{item.color} / {item.size}</p>
                      </div>
                      <p className="text-[11px] font-black italic">₪{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-800 italic">₪{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Shipping</span>
                    <span className="text-slate-800 italic tracking-tighter">FREE</span>
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-tighter italic text-slate-800">Total</span>
                    <span className="text-2xl font-black italic text-slate-900">₪{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

