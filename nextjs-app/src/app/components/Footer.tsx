'use client';

import Link from 'next/link';
import { FaGithub, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-40">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <Link href="https://github.com/wassimfarah" target="_blank" className="text-white hover:text-gray-400">
            <FaGithub size={24} />
          </Link>
          <span className="text-white hover:text-gray-400 cursor-not-allowed">
            <FaTwitter size={24} />
          </span>
          <span className="text-white hover:text-gray-400 cursor-not-allowed">
            <FaFacebook size={24} />
          </span>
          <span className="text-white hover:text-gray-400 cursor-not-allowed">
            <FaInstagram size={24} />
          </span>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} OpenAdClassify. All rights reserved.
        </p>
        <div className="mt-4">
          <p>
            <span className="text-white hover:text-gray-400 cursor-not-allowed">About Us</span> |{' '}
            <span className="text-white hover:text-gray-400 cursor-not-allowed">Contact</span> |{' '}
            <span className="text-white hover:text-gray-400 cursor-not-allowed">Privacy Policy</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
