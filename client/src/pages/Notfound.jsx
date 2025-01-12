import { FaHome, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
      {/* Illustration */}
      <img
        src="../../public/page-not-found.png"
        alt="Page not found"
        className="w-72 md:w-96 mx-auto mb-8 drop-shadow-md"
      />

      {/* Main Content */}
      <div className="text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          404 - Oops! Page Not Found
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-[60%] mx-auto">
          The page you’re looking for doesn’t exist or may have been moved. We
          can&apos;t seem to find the page you&apos;re looking for. It might
          have been moved, deleted, or never existed. Let us help you get back
          on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
          >
            <FaHome className="mr-2" />
            Return Home
          </Link>
          <Link
            to="/search"
            className="flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-200"
          >
            <FaSearch className="mr-2" />
            Explore Properties
          </Link>
        </div>
      </div>

      {/* Additional Links */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-lg mb-4">
          Or check out some of our helpful links:
        </p>
        <ul className="flex flex-wrap justify-center gap-6">
          <li>
            <Link
              to="/about"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contact Support
            </Link>
          </li>
          <li>
            <Link
              to="/faq"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              FAQs
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Visit Our Blog
            </Link>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p className="mb-2">
          Still having trouble? Need help finding what you&apos;re looking for?
          Our team is here to assist you. Contact our support team!
          <br />
          <Link to="/contact" className="text-blue-600 hover:underline">
            Visit our Contact Page. Reach out to us →
          </Link>
        </p>
        <p>
          &copy; {new Date().getFullYear()} AbodeConnect Estate. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
