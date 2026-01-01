/**
 * Carbon Fields Example Component
 * 
 * This component demonstrates how to use Carbon Fields data
 * from WordPress in your Next.js frontend.
 */

import Image from 'next/image';
import Link from 'next/link';
import { WordPressPage } from '@/lib/wordpress';

interface CarbonFieldsExampleProps {
  page: WordPressPage;
}

export default function CarbonFieldsExample({ page }: CarbonFieldsExampleProps) {
  const carbonFields = page.carbon_fields || {};

  return (
    <div className="space-y-12">
      {/* Hero Section Example */}
      {carbonFields.hero_image && (
        <section className="relative h-96 w-full">
          <Image
            src={carbonFields.hero_image}
            alt={carbonFields.hero_title || page.title.rendered}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl font-bold mb-4">
                {carbonFields.hero_title || page.title.rendered}
              </h1>
              {carbonFields.hero_subtitle && (
                <p className="text-xl mb-6">{carbonFields.hero_subtitle}</p>
              )}
              {carbonFields.hero_button_text && carbonFields.hero_button_url && (
                <Link
                  href={carbonFields.hero_button_url}
                  className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {carbonFields.hero_button_text}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Featured Content Section Example */}
      {carbonFields.show_featured_section && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {carbonFields.featured_image && (
              <div className="relative h-64 w-full">
                <Image
                  src={carbonFields.featured_image}
                  alt={carbonFields.featured_title || 'Featured'}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div>
              {carbonFields.featured_title && (
                <h2 className="text-3xl font-bold mb-4">
                  {carbonFields.featured_title}
                </h2>
              )}
              {carbonFields.featured_content && (
                <div
                  dangerouslySetInnerHTML={{ __html: carbonFields.featured_content }}
                  className="prose prose-lg"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section Example */}
      {carbonFields.show_cta && (
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            {carbonFields.cta_title && (
              <h2 className="text-3xl font-bold mb-4">{carbonFields.cta_title}</h2>
            )}
            {carbonFields.cta_description && (
              <p className="text-xl mb-8 text-gray-300">{carbonFields.cta_description}</p>
            )}
            {carbonFields.cta_button_text && carbonFields.cta_button_url && (
              <Link
                href={carbonFields.cta_button_url}
                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                {carbonFields.cta_button_text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Testimonials Example (for Home Page) */}
      {carbonFields.testimonials && carbonFields.testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {carbonFields.testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                {testimonial.rating && (
                  <div className="flex mb-4">
                    {[...Array(parseInt(testimonial.rating))].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                )}
                <p className="text-gray-700 mb-4 italic">"{testimonial.testimonial_text}"</p>
                <div className="flex items-center">
                  {testimonial.customer_photo && (
                    <Image
                      src={testimonial.customer_photo}
                      alt={testimonial.customer_name}
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.customer_name}</p>
                    {testimonial.customer_title && (
                      <p className="text-sm text-gray-600">{testimonial.customer_title}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

