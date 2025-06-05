import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "@atoms";
import { themeClasses } from "@theme/colors";

const Footer = ({ className = "", variant = "default" }) => {
  // Sử dụng theme system hoàn toàn với CSS variables
  const baseClasses = `${themeClasses.backgroundPrimary} text-white border-theme-border`;
  
  const variantClasses = {
    default: "py-12",
    compact: "py-6", 
    minimal: "py-4 border-t"
  };

  const footerLinks = {
    about: [
      { label: "About Us", href: "/about" },
      { label: "Our Mission", href: "/about#mission" },
      { label: "Teachers", href: "/about#teachers" },
      { label: "Facilities", href: "/about#facilities" }
    ],
    programs: [
      { label: "Classes", href: "/classes" },
      { label: "Age Groups", href: "/classes#age-groups" },
      { label: "Curriculum", href: "/classes#curriculum" },
      { label: "Special Programs", href: "/classes#special" }
    ],
    admissions: [
      { label: "Admission Process", href: "/admission" },
      { label: "Requirements", href: "/admission#requirements" },
      { label: "Tuition", href: "/admission#tuition" },
      { label: "Financial Aid", href: "/admission#aid" }
    ],
    contact: [
      { label: "Contact Us", href: "/contact" },
      { label: "Location", href: "/contact#location" },
      { label: "Hours", href: "/contact#hours" },
      { label: "Events", href: "/events" }
    ]
  };

  if (variant === "minimal") {
    return (
      <footer className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">            <p className="text-sm text-white font-bold">
              © 2024 Sunshine Preschool. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link to="/privacy" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
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
      <footer className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">            <div className="text-center md:text-left">
              <h3 className="text-lg font-black text-theme-secondary">Sunshine Preschool</h3>
              <p className="text-white text-sm font-bold">Nurturing young minds since 2010</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
                About
              </Link>
              <Link to="/classes" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
                Programs
              </Link>
              <Link to="/admission" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
                Admissions
              </Link>
              <Link to="/contact" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-white/30 text-center text-sm text-white font-bold">
            © 2024 Sunshine Preschool. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  // Default variant - sử dụng hoàn toàn theme system
  return (
    <footer className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black text-theme-secondary mb-4 drop-shadow-sm">
              Sunshine Preschool
            </h3>
            <p className="text-white mb-4 max-w-md font-bold">
              Providing quality early childhood education in a nurturing environment 
              where children develop confidence, creativity, and a love for learning.
            </p>
            <div className="space-y-2 text-white font-bold">
              <p>📍 123 Education Street, Learning City</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ info@sunshinepreschool.edu</p>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-lg font-black text-theme-secondary mb-4 drop-shadow-sm">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-white hover:text-theme-secondary transition-colors font-bold underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black text-theme-secondary mb-4 drop-shadow-sm">Programs</h4>
            <ul className="space-y-2">
              {footerLinks.programs.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-white hover:text-theme-secondary transition-colors font-bold underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black text-theme-secondary mb-4 drop-shadow-sm">Admissions</h4>
            <ul className="space-y-2">
              {footerLinks.admissions.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-white hover:text-theme-secondary transition-colors font-bold underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>        {/* Newsletter Signup */}
        <div className="mt-8 pt-8 border-t-2 border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h4 className="text-lg font-black text-theme-secondary mb-2 drop-shadow-sm">
                Stay Connected
              </h4>
              <p className="text-white font-bold">
                Get updates about events, programs, and educational tips.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-md border-2 border-gray-300 bg-white text-black font-bold min-w-64 focus:border-theme-secondary focus:outline-none focus:ring-2 focus:ring-theme-secondary"
              />
              <Button variant="secondary" size="md" className="rounded-l-none font-black border-2">
                Subscribe
              </Button>
            </div>
          </div>
        </div>        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t-2 border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-white hover:text-theme-secondary transition-colors text-sm font-bold underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white hover:text-theme-secondary transition-colors text-sm font-bold underline">
                Terms of Service
              </Link>
              <Link to="/accessibility" className="text-white hover:text-theme-secondary transition-colors text-sm font-bold underline">
                Accessibility
              </Link>
            </div>
            <div className="flex space-x-4">
              <a href="https://facebook.com/sunshinepreschool" target="_blank" rel="noopener noreferrer" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
                📘 Facebook
              </a>
              <a href="https://instagram.com/sunshinepreschool" target="_blank" rel="noopener noreferrer" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
                📸 Instagram
              </a>
              <a href="https://twitter.com/sunshinepreschool" target="_blank" rel="noopener noreferrer" className="text-white hover:text-theme-secondary transition-colors font-bold underline">
                🐦 Twitter
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-white font-bold">
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
