import React, { useState } from 'react'
import { useSubscription } from '../contexts/SubscriptionContext'
import {
  CheckIcon,
  XMarkIcon,
  StarIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started with basic SEO analysis',
    features: [
      'Up to 5 pages analyzed',
      'Basic technical checks',
      'Page speed analysis',
      'Meta tags review',
      'Mobile responsiveness check',
      'Basic security scan',
    ],
    limitations: [
      'No PDF reports',
      'No competitor analysis',
      'Limited support',
    ],
    cta: 'Start Free Audit',
    popular: false,
    color: 'gray',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    description: 'Enhanced analysis with more comprehensive features',
    features: [
      'Up to 25 pages analyzed',
      'Everything in Free',
      'Content analysis & optimization',
      'Image optimization suggestions',
      'PDF report generation',
      'Email support',
      'Historical data (30 days)',
    ],
    limitations: [
      'No competitor analysis',
      'No keyword research',
      'Standard support',
    ],
    cta: 'Choose Basic',
    popular: true,
    color: 'primary',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    description: 'Comprehensive SEO audit with advanced features',
    features: [
      'Up to 100 pages analyzed',
      'Everything in Basic',
      'Competitor analysis',
      'Keyword research & tracking',
      'Advanced technical SEO',
      'Priority support',
      'Historical data (90 days)',
      'Custom recommendations',
    ],
    limitations: [],
    cta: 'Choose Premium',
    popular: false,
    color: 'success',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    description: 'Full-scale SEO solution for large websites',
    features: [
      'Unlimited pages analyzed',
      'Everything in Premium',
      'White-label reports',
      'API access',
      'Dedicated account manager',
      '24/7 phone support',
      'Historical data (1 year)',
      'Custom integrations',
      'Team collaboration tools',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
    color: 'warning',
  },
]

const faqs = [
  {
    question: 'How does the free tier work?',
    answer: 'The free tier allows you to analyze up to 5 pages of your website with basic SEO checks. No credit card required.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.',
  },
  {
    question: 'How often can I run audits?',
    answer: 'There are no limits on how often you can run audits within your plan\'s page limits. You can audit the same site multiple times to track improvements.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes, annual billing saves you 20% compared to monthly billing on all paid plans.',
  },
]

function PricingPage({ onNavigate }) {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingTier, setProcessingTier] = useState(null)
  
  const { 
    currentTier, 
    isSubscribed, 
    purchaseSubscription, 
    restorePurchases, 
    isLoading: subscriptionLoading,
    error: subscriptionError 
  } = useSubscription()

  const getPrice = (price) => {
    if (price === 0) return 'Free'
    const finalPrice = billingCycle === 'annual' ? Math.round(price * 0.8) : price
    return `$${finalPrice}`
  }

  const getPeriod = () => {
    return billingCycle === 'annual' ? '/year' : '/month'
  }

  const getProductId = (tierId) => {
    const suffix = billingCycle === 'annual' ? '_annual' : '_monthly'
    return `${tierId}${suffix}`
  }

  const handleSubscribe = async (tierId) => {
    if (tierId === 'free') {
      onNavigate?.('audit')
      return
    }
    
    if (tierId === 'enterprise') {
      window.open('mailto:sales@seoaudit.com?subject=Enterprise Plan Inquiry', '_blank')
      return
    }

    try {
      setIsProcessing(true)
      setProcessingTier(tierId)
      
      const productId = getProductId(tierId)
      const result = await purchaseSubscription(productId)
      
      if (result.success) {
        // Show success message and redirect to dashboard
        alert('Subscription successful! Welcome to your new plan.')
        onNavigate?.('dashboard')
      } else {
        alert(`Subscription failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Subscription failed. Please try again.')
    } finally {
      setIsProcessing(false)
      setProcessingTier(null)
    }
  }

  const handleRestorePurchases = async () => {
    try {
      setIsProcessing(true)
      const result = await restorePurchases()
      
      if (result.success) {
        alert('Purchases restored successfully!')
      } else {
        alert('No purchases found to restore.')
      }
    } catch (error) {
      console.error('Restore error:', error)
      alert('Failed to restore purchases. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const isCurrentTier = (tierId) => {
    return currentTier === tierId
  }

  const getButtonText = (tier) => {
    if (isCurrentTier(tier.id)) {
      return 'Current Plan'
    }
    if (isProcessing && processingTier === tier.id) {
      return 'Processing...'
    }
    return tier.cta
  }

  const isButtonDisabled = (tier) => {
    return isCurrentTier(tier.id) || (isProcessing && processingTier === tier.id)
  }

  return (
    <div className="bg-white">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start with our free tier and upgrade as you grow.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-1 text-xs bg-success-100 text-success-800 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border-2 p-8 transition-all hover:shadow-lg ${
                tier.popular
                  ? 'border-primary-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {getPrice(tier.price)}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-gray-600 ml-1">{getPeriod()}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-6">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-success-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
                {tier.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.id)}
                disabled={isButtonDisabled(tier.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                  isCurrentTier(tier.id)
                    ? 'bg-success-100 text-success-800 border border-success-300'
                    : tier.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isProcessing && processingTier === tier.id && (
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                )}
                {getButtonText(tier.id)}
              </button>
            </div>
          ))}
        </div>

        {/* Restore Purchases */}
        <div className="text-center mb-16">
          <p className="text-gray-600 mb-4">Already have a subscription?</p>
          <button
            onClick={handleRestorePurchases}
            disabled={isProcessing}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowPathIcon className="h-4 w-4 mr-2" />
            )}
            Restore Purchases
          </button>
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Compare Features
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Feature
                  </th>
                  {pricingTiers.map((tier) => (
                    <th key={tier.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Pages Analyzed</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">5</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">25</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">100</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">PDF Reports</td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Competitor Analysis</td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">API Access</td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckIcon className="h-5 w-5 text-success-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Support</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Community</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Email</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Priority</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">24/7 Phone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <ShieldCheckIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your data is encrypted and never shared with third parties.</p>
          </div>
          <div className="text-center">
            <CreditCardIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Guarantee</h3>
            <p className="text-gray-600">Not satisfied? Get a full refund within 30 days.</p>
          </div>
          <div className="text-center">
            <ClockIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Anytime</h3>
            <p className="text-gray-600">No long-term contracts. Cancel your subscription anytime.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <span className="text-gray-500">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Improve Your SEO?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start with our free tier and see the difference professional SEO analysis can make.
          </p>
          <button onClick={() => onNavigate('audit')} className="btn btn-primary btn-lg">
            Start Free Audit Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingPage