/* eslint-disable @next/next/no-html-link-for-pages */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f0eae8] text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-500 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-500 hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-500 hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="/contact" className="text-slate-500 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
         
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} All rights reserved to Asaf marom.</p>
        </div>
      </div>
    </footer>
  );
}

