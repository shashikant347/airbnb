import { Link } from 'react-router-dom';
import { FaAirbnb, FaGlobe, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-50 border-t border-dark-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FaAirbnb className="text-primary-500 text-3xl" />
              <span className="text-xl font-bold text-primary-500">airbnb</span>
            </Link>
            <p className="text-dark-500 text-sm leading-relaxed">
              Find unique places to stay, from cozy cabins to luxury villas around the world.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-dark-800 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Help Center</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Safety Information</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Cancellation Options</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Report a Concern</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h4 className="font-semibold text-dark-800 mb-4">Hosting</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Airbnb Your Home</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Hosting Resources</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Community Forum</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Responsible Hosting</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-dark-800 mb-4">About</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Newsroom</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Careers</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Investors</Link></li>
              <li><Link to="/" className="text-dark-500 text-sm hover:text-dark-800 transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-dark-500 text-sm">
            <span>© 2025 Airbnb Clone</span>
            <span>·</span>
            <span>Privacy</span>
            <span>·</span>
            <span>Terms</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-dark-600 text-sm hover:text-dark-800 transition">
              <FaGlobe /> English (US)
            </button>
            <div className="flex gap-3 text-dark-500">
              <FaFacebookF className="hover:text-dark-800 cursor-pointer transition" />
              <FaTwitter className="hover:text-dark-800 cursor-pointer transition" />
              <FaInstagram className="hover:text-dark-800 cursor-pointer transition" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
