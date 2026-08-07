import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-primary">StyleDecor</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Smart home & ceremony decoration booking system. Book expert
            decorators for your special moments with ease.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="link link-hover">
                Home
              </a>
            </li>
            <li>
              <a href="/services" className="link link-hover">
                Services
              </a>
            </li>
            <li>
              <a href="/about" className="link link-hover">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="link link-hover">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="footer-title">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 Dhaka, Bangladesh</li>
            <li>📞 +880 1234 567 890</li>
            <li>✉️ support@styledecor.com</li>
          </ul>
        </div>

        {/* Working Hours & Social */}
        <div>
          <h3 className="footer-title">Working Hours</h3>
          <p className="text-sm">Sat - Thu: 9:00 AM – 9:00 PM</p>
          <p className="text-sm mb-4">Friday: Closed</p>

          <div className="flex items-center gap-4 mt-4">
            <a href="#" className="btn btn-circle btn-sm btn-outline">
              <FaFacebookF />
            </a>
            <a href="#" className="btn btn-circle btn-sm btn-outline">
              <FaInstagram />
            </a>
            <a href="#" className="btn btn-circle btn-sm btn-outline">
              <FaTwitter />
            </a>
            <a href="#" className="btn btn-circle btn-sm btn-outline">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300 py-4 text-center text-sm">
        © {new Date().getFullYear()} StyleDecor. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
