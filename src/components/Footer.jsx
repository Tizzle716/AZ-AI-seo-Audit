import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const footerNavigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'SEO Audit', href: '/audit' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '/pricing' },
  ],
  support: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Status', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
}

function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <MagnifyingGlassIcon className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">SEO Audit</span>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                Comprehensive SEO audit and analysis tool powered by Azure AI. 
                Get detailed insights about your website's performance and optimization opportunities.
              </p>
              <div className="mt-6">
                <p className="text-xs text-gray-500">
                  Powered by Azure AI Services
                </p>
              </div>
            </div>

            {/* Navigation links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {footerNavigation.main.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => onNavigate(item.href === '/' ? 'home' : item.href.substring(1))}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerNavigation.support.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SEO Audit System. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                {footerNavigation.company.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer