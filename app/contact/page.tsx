import { getPageBySlug } from "@/lib/wordpress";
import Image from "next/image";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  const contactPage = await getPageBySlug("contact");

  if (!contactPage) {
    notFound();
  }

  const carbonFields = contactPage.carbon_fields || {};
  const title = carbonFields.contact_title || "Contact Us";
  const contactEmail = carbonFields.contact_email;
  const destinationEmail = carbonFields.contact_form_destination;
  const location = carbonFields.contact_location;
  const instagram = carbonFields.contact_instagram;
  const facebook = carbonFields.contact_facebook;
  const twitter = carbonFields.contact_twitter;
  const contactImage = carbonFields.contact_image;

  return (
    <div className="bg-[#F2ECE4] flex items-center justify-center">
      <div className="bg-[#F2ECE4] min-h-screen w-full h-full px-2 md:px-0 overflow-hidden flex flex-col md:flex-row relative">
        
        {/* LEFT IMAGE SECTION - Behind form on mobile, side-by-side on desktop */}
        <div className="absolute inset-0 md:relative md:w-[45%] flex min-h-[350px] md:min-h-full z-0">
          {contactImage ? (
            <Image
              src={contactImage}
              alt={title}
              fill
              className="object-contain max-w-[300px] self-end md:max-w-none"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-300 italic">
              Upload contact_image
            </div>
          )}
          {/* Light transparent overlay on mobile only */}
          <div className="absolute inset-0 bg-[#F2ECE4]/80 md:hidden"></div>
        </div>

        {/* RIGHT CONTENT SECTION - On top on mobile */}
        <div className="w-full md:w-[55%] md:pt-8 pt-4 pl-8 pr-8 md:pr-0 grid relative items-end z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 md:mb-16 tracking-tight">
            {title}
          </h1>

          <div className="grid md:flex md:gap-12 gap-6 h-fit md:h-[80%] pb-26 rounded-t-lg md:rounded-none border-l-2 md:border-l-3 border-black border-t-2 md:border-t-3 pt-8 pl-8 border-r-2 md:border-r-0 pr-8 md:pr-0">
            {/* Form Column */}
            <div className="space-y-8 h-fit">
              <ContactForm destinationEmail={destinationEmail} />
            </div>

            {/* Info Column */}
            <div className="md:space-y-12 space-y-6 lg:pl-8 h-fit">
              {/* Email Info */}
              {contactEmail && (
                <div>
                  <h2 className="text-lg font-bold text-black mb-1">Contact</h2>
                  <p className="text-gray-600">{contactEmail}</p>
                </div>
              )}

              {/* Location Info */}
              {location && (
                <div>
                  <h2 className="text-lg font-bold text-black mb-1">Based in</h2>
                  <p className="text-gray-600 whitespace-pre-line">{location}</p>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-6 md:pt-4 pt-2">
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" /></svg>
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
