import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "@atoms";

const Footer = ({ className = "", variant = "default" }) => {
  const baseClasses = "theme-aware-bg theme-aware-text";
  
  // Style với độ tương phản cao cho footer
  const footerStyle = {
    backgroundColor: '#042818', // Xanh lá đậm nhất cho contrast cao
    color: '#ffffff'
  };

  const variantClasses = {
    default: "py-12 text-white",
    compact: "py-6 text-white", 
    minimal: "py-4 border-t text-white"
  };
  const footerLinks = {
    about: [
      { label: "About Us", href: "/homepage/about-us" },
      { label: "Our Mission", href: "/homepage/about-us#mission" },
      { label: "Teachers", href: "/homepage/about-us#teachers" },
      { label: "Facilities", href: "/homepage/about-us#facilities" }
    ],
    programs: [
      { label: "Classes", href: "/homepage/classes" },
      { label: "Age Groups", href: "/homepage/classes#age-groups" },
      { label: "Curriculum", href: "/homepage/classes#curriculum" },
      { label: "Special Programs", href: "/homepage/classes#special" }
    ],
    admissions: [
      { label: "Admission Process", href: "/homepage/admission" },
      { label: "Requirements", href: "/homepage/admission#requirements" },
      { label: "Tuition", href: "/homepage/admission#tuition" },
      { label: "Financial Aid", href: "/homepage/admission#aid" }
    ],
    contact: [
      { label: "Contact Us", href: "/homepage/contact" },
      { label: "Location", href: "/homepage/contact#location" },
      { label: "Hours", href: "/homepage/contact#hours" },
      { label: "Events", href: "/homepage/events" }
    ]
  };

  if (variant === "minimal") {
    return (
      <footer className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={footerStyle}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-white font-medium">
              © 2024 Sunshine Preschool. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link to="/privacy" className="text-white hover:text-yellow-300 transition-colors font-medium underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white hover:text-yellow-300 transition-colors font-medium underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === "compact") {
    return (
      <footer className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={footerStyle}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-yellow-300">Sunshine Preschool</h3>
              <p className="text-white text-sm font-medium">Nurturing young minds since 2010</p>
            </div>            <div className="flex space-x-6">
              <Link to="/homepage/about-us" className="text-white hover:text-yellow-300 transition-colors font-medium">
                About
              </Link>
              <Link to="/homepage/classes" className="text-white hover:text-yellow-300 transition-colors font-medium">
                Programs
              </Link>
              <Link to="/homepage/admission" className="text-white hover:text-yellow-300 transition-colors font-medium">
                Admissions
              </Link>
              <Link to="/homepage/contact" className="text-white hover:text-yellow-300 transition-colors font-medium">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/30 text-center text-sm text-white font-medium">
            © 2024 Sunshine Preschool. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={footerStyle}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">
              Sunshine Preschool
            </h3>
            <p className="text-white mb-4 max-w-md font-medium">
              Providing quality early childhood education in a nurturing environment 
              where children develop confidence, creativity, and a love for learning.
            </p>
            <div className="space-y-2 text-white font-medium">
              <p>📍 123 Education Street, Learning City</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ info@sunshinepreschool.edu</p>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-lg font-bold text-yellow-300 mb-4">About</h4>            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={`about-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Link 
                    to={link.href} 
                    className="text-white hover:text-yellow-300 transition-colors font-medium underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-yellow-300 mb-4">Programs</h4>            <ul className="space-y-2">
              {footerLinks.programs.map((link) => (
                <li key={`programs-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Link 
                    to={link.href} 
                    className="text-white hover:text-yellow-300 transition-colors font-medium underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-yellow-300 mb-4">Admissions</h4>            <ul className="space-y-2">
              {footerLinks.admissions.map((link) => (
                <li key={`admissions-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Link 
                    to={link.href} 
                    className="text-white hover:text-yellow-300 transition-colors font-medium underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 pt-8 border-t border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h4 className="text-lg font-bold text-yellow-300 mb-2">
                Stay Connected
              </h4>
              <p className="text-white font-medium">
                Get updates about events, programs, and educational tips.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-md border-2 border-gray-300 text-black font-medium min-w-64 focus:border-yellow-300 focus:outline-none"
              />
              <Button variant="primary" size="md" className="rounded-l-none bg-yellow-300 text-black font-bold hover:bg-yellow-400">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-white hover:text-yellow-300 transition-colors text-sm font-medium underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white hover:text-yellow-300 transition-colors text-sm font-medium underline">
                Terms of Service
              </Link>
              <Link to="/accessibility" className="text-white hover:text-yellow-300 transition-colors text-sm font-medium underline">
                Accessibility
              </Link>
            </div>            <div className="flex space-x-4">
              <button 
                onClick={() => window.open('https://facebook.com', '_blank')}
                className="text-white hover:text-yellow-300 transition-colors font-medium bg-transparent border-none cursor-pointer"
                aria-label="Visit our Facebook page"
              >
                📘 Facebook
              </button>
              <button 
                onClick={() => window.open('https://instagram.com', '_blank')}
                className="text-white hover:text-yellow-300 transition-colors font-medium bg-transparent border-none cursor-pointer"
                aria-label="Visit our Instagram page"
              >
                📸 Instagram
              </button>
              <button 
                onClick={() => window.open('https://twitter.com', '_blank')}
                className="text-white hover:text-yellow-300 transition-colors font-medium bg-transparent border-none cursor-pointer"
                aria-label="Visit our Twitter page"
              >
                🐦 Twitter
              </button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-white font-medium">
            © 2024 Sunshine Preschool. All rights reserved. | Designed with ❤️ for little learners.
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "compact", "minimal"])
};

export default Footer;
