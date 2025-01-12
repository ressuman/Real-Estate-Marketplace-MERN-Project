import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            About AbodeConnect Estate
          </h2>
          <p className="text-sm leading-relaxed mb-4">
            AbodeConnect Estate is dedicated to connecting you with your dream
            property. We specialize in seamless real estate experiences, from
            finding your perfect home to making secure investments.
          </p>
          <p className="text-sm leading-relaxed">
            Your trust is our priority. We’re here to simplify your property
            journey with expertise, transparency, and professionalism.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Quick Links</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-blue-500 transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-blue-500 transition duration-200"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="hover:text-blue-500 transition duration-200"
              >
                Search Properties
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-blue-500 transition duration-200"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:text-blue-500 transition duration-200"
              >
                My Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Contact Us</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center">
              <FaMapMarkerAlt className="text-blue-500 mr-2" />
              <span>123 Dream Lane, Home City, CA 98765</span>
            </li>
            <li className="flex items-center">
              <FaPhone className="text-blue-500 mr-2" />
              <a href="tel:+1234567890" className="hover:text-blue-500">
                +1 (234) 567-890
              </a>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="text-blue-500 mr-2" />
              <a
                href="mailto:support@abodeconnect.com"
                className="hover:text-blue-500"
              >
                support@abodeconnect.com
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            Stay Connected and Get Updates
          </h2>
          <p className="text-sm mb-4">
            Subscribe to our newsletter and never miss out on the latest
            property updates and exclusive offers.
          </p>
          <form className="flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-gray-900 rounded-l-lg focus:outline-none"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between text-sm">
          {/* Social Media Links */}
          <div className="flex space-x-4 mb-4 lg:mb-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              <FaLinkedin size={20} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center lg:text-right">
            &copy; {new Date().getFullYear()} AbodeConnect Estate. All rights
            reserved. Built with ❤️ for your perfect home.
          </div>
        </div>
      </div>
    </footer>
  );
}
