import { getPageBySlug } from "@/lib/wordpress";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function AboutPage() {
  const aboutPage = await getPageBySlug("about");

  if (!aboutPage) {
    notFound();
  }

  const carbonFields = aboutPage.carbon_fields || {};
  const title = carbonFields.about_title || aboutPage.title.rendered;
  const tagline = carbonFields.about_tagline;
  const content = carbonFields.about_content || aboutPage.content.rendered;
  const clients = carbonFields.about_selected_clients;
  const aboutImage = carbonFields.about_image;

  return (
    <div className="bg-white min-h-screen pt-16 md:pt-24 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          
          {/* LEFT CONTENT SECTION */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4 md:pt-10">
            <h1 className="text-4xl md:text-6xl font-normal text-gray-900 mb-4 tracking-tight">
              {title}
            </h1>
            
            {tagline && (
              <p className="text-xl md:text-2xl text-gray-400 font-light mb-12">
                {tagline}
              </p>
            )}

            <div 
              className="prose prose-gray md:prose-lg max-w-xl text-gray-800 leading-relaxed 
                prose-p:mb-6 last:prose-p:mb-0"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {clients && (
              <div className="mt-20 pt-10 border-t border-gray-100">
                <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-6">
                  Selected Clients
                </h2>
                <div 
                  className="prose prose-sm text-gray-500 leading-loose"
                  dangerouslySetInnerHTML={{ __html: clients }}
                />
              </div>
            )}
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="w-full lg:w-1/2 order-first lg:order-last">
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full bg-gray-50 overflow-hidden shadow-sm">
              {aboutImage ? (
                <Image
                  src={aboutImage}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 italic">
                  Upload about_image in WordPress
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
