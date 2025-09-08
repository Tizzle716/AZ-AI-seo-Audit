import React from 'react'
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  BoltIcon,
  CloudIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Comprehensive Analysis',
    description: 'Deep dive into your website\'s SEO performance with detailed technical analysis.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Performance Metrics',
    description: 'Track Core Web Vitals, page speed, and user experience metrics.',
    icon: ChartBarIcon,
  },
  {
    name: 'Technical SEO',
    description: 'Identify and fix technical issues affecting your search rankings.',
    icon: CogIcon,
  },
  {
    name: 'Security Checks',
    description: 'Ensure your website meets security best practices and standards.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Fast Results',
    description: 'Get instant insights powered by Azure AI and machine learning.',
    icon: BoltIcon,
  },
  {
    name: 'Cloud-Powered',
    description: 'Scalable analysis backed by Microsoft Azure infrastructure.',
    icon: CloudIcon,
  },
]

const stats = [
  { id: 1, name: 'Websites Analyzed', value: '10,000+' },
  { id: 2, name: 'Issues Identified', value: '50,000+' },
  { id: 3, name: 'Average Score Improvement', value: '35%' },
  { id: 4, name: 'Customer Satisfaction', value: '98%' },
]

function HomePage({ onNavigate }) {
  return (
    <div className="bg-white">

      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-primary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center animate-header">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-shadow-hero">
              Professional{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">SEO Audit</span>{' '}
              System
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Get comprehensive website analysis powered by Azure AI. Identify technical issues, 
              improve performance, and boost your search rankings with actionable insights.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => onNavigate('audit')}
                className="btn-hero px-8 py-3 rounded-lg text-base font-semibold"
              >
                Start Free Audit
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="px-8 py-3 rounded-lg text-base font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-primary opacity-15 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Comprehensive Analysis</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for SEO success
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our AI-powered platform provides deep insights into your website's performance, 
              helping you identify and fix issues that impact your search rankings.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by thousands of websites
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Join the growing community of website owners who trust our SEO audit system.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col bg-white p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-primary-600">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-shadow-hero">
              Ready to improve your SEO?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Start your free SEO audit today and discover opportunities to boost your search rankings.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => onNavigate('audit')}
                className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-elevated hover:bg-gray-50 transition-all duration-200 hover:transform hover:-translate-y-0.5"
              >
                Start Free Audit
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-base font-semibold leading-6 text-white hover:text-blue-100 transition-colors"
              >
                View Dashboard <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage