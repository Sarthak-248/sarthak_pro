import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaEnvelope,
  } from 'react-icons/fa';
  
  export default function Footer() {
    return (
      <div className="relative">
  
        {/* Top Wave */}
        <div className="w-full -mt-1">
          <svg className="block w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#0f172a"
              d="M0,64L60,85.3C120,107,240,149,360,170.7C480,192,600,192,720,181.3C840,171,960,149,1080,138.7C1200,128,1320,128,1380,133.3L1440,138.7L1440,0L0,0Z"
            />
          </svg>
        </div>
  
        {/* Footer Main */}
        <footer className="bg-gradient-to-br from-blue-800 via-black to-blue-800 text-white pt-20 pb-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/20 pb-12">
            
            {/* Company */}
            <div>
              <h2 className="text-2xl font-extrabold mb-4 text-yellow-400">Sarthak Heights</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Helping you unlock the door to your dream home. Listings, insights, and deals — all in one place.
              </p>
            </div>
  
            {/* Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-300">Explore</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/" className="hover:text-yellow-400 transition">🏠 Home</a></li>
                <li><a href="/search" className="hover:text-yellow-400 transition">🔍 Search Listings</a></li>
                <li><a href="/about" className="hover:text-yellow-400 transition">📘 About Us</a></li>
                <li><a href="/contact" className="hover:text-yellow-400 transition">📞 Contact Us</a></li>
                <li><a href="/faq" className="hover:text-yellow-400 transition">❓ FAQ</a></li>
              </ul>
            </div>
  
            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-300">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-yellow-400" />123 Dream Street, BlueCity</li>
                <li className="flex items-center gap-2"><FaPhoneAlt className="text-yellow-400" />+91 98765 43210</li>
                <li className="flex items-center gap-2"><FaEnvelope className="text-yellow-400" />info@sarthaksestate.com</li>
              </ul>
            </div>
  
            {/* Social + Newsletter */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-yellow-300">Stay Connected</h3>
              <p className="text-sm text-gray-300 mb-4">Subscribe for updates.</p>
              <div className="flex mb-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 rounded-l-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none"
                />
                <button className="bg-yellow-400 text-black px-4 py-2 rounded-r-md hover:bg-yellow-300 transition">
                  Subscribe
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <a href="https://www.linkedin.com/in/sarthak-morgaonkar" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-yellow-400 hover:text-black transition"><FaLinkedinIn /></a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-yellow-400 hover:text-black transition"><FaFacebookF /></a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-yellow-400 hover:text-black transition"><FaInstagram /></a>
                <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-yellow-400 hover:text-black transition"><FaTwitter /></a>
              </div>
            </div>
          </div>
  
          {/* Bottom Text */}
          <div className="mt-10 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Sarthak Heights. All rights reserved.
          </div>
        </footer>
  
        {/* Bottom Wave */}
        <div className="w-full -mb-1">
          <svg className="block w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#0f172a"
              d="M0,160L60,160C120,160,240,160,360,160C480,160,600,160,720,170.7C840,181,960,203,1080,192C1200,181,1320,139,1380,117.3L1440,96L1440,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    );
  }
  