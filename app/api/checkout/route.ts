import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, cart, total, orderId } = body;

    const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL?.replace(/\/$/, "");

    // 1. Create Order in WooCommerce
    const orderData = {
      payment_method: "paypal",
      payment_method_title: "PayPal",
      set_paid: true, // Assuming PayPal success
      billing: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_1: "Online Order",
        city: "Web",
        state: "Web",
        postcode: "00000",
        country: "IL",
        email: customer.email,
        phone: customer.phone
      },
      line_items: cart.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
        meta_data: [
          { key: "Color", value: item.color },
          { key: "Size", value: item.size }
        ]
      })),
      customer_note: `PayPal Order ID: ${orderId}`
    };

    const response = await fetch(`${wpUrl}/index.php?rest_route=/wc/v3/orders&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    return NextResponse.json({ success: true, order: data });

  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

