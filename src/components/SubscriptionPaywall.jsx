import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import {
  LockClosedIcon,
  StarIcon,
  CreditCardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const SubscriptionPaywall = ({ 
  feature, 
  requiredTier = 'basic', 
  children, 
  onNavigate,
  customMessage,
  showUpgradeButton = true 
}) => {
  const { currentTier, hasFeature, isSubscribed } = useSubscription();

  // Define tier hierarchy
  const tierHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  // Check if user has access to the feature
  const hasAccess = () => {
    if (feature && !hasFeature(feature)) return false;
    if (requiredTier && tierHierarchy[currentTier] < tierHierarchy[requiredTier]) return false;
    return true;
  };

  // If user has access, render children
  if (hasAccess()) {
    return children;
  }

  // Define tier benefits
  const tierBenefits = {
    basic: [
      'Up to 25 pages analyzed',
      'PDF report generation',
      'Content analysis',
      'Email support',
      '30-day history'
    ],
    premium: [
      'Up to 100 pages analyzed',
      'Competitor analysis',
      'Keyword research',
      'Priority support',
      '90-day history'
    ],
    enterprise: [
      'Unlimited pages',
      'White-label reports',
      'API access',
      'Dedicated support',
      '1-year history'
    ]
  };

  const getFeatureName = () => {
    const featureNames = {
      pdfReports: 'PDF Reports',
      competitorAnalysis: 'Competitor Analysis',
      keywordResearch: 'Keyword Research',
      prioritySupport: 'Priority Support',
      whiteLabel: 'White-label Reports',
      apiAccess: 'API Access',
      dedicatedSupport: 'Dedicated Support'
    };
    return featureNames[feature] || 'Premium Feature';
  };

  const getTierDisplayName = (tier) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const getTierPrice = (tier) => {
    const prices = {
      basic: '$29',
      premium: '$79',
      enterprise: '$199'
    };
    return prices[tier] || '$29';
  };

  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
        <LockClosedIcon className="h-8 w-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {customMessage || `${getFeatureName()} requires ${getTierDisplayName(requiredTier)} plan`}
      </h3>
      
      <p className="text-gray-600 mb-6">
        Upgrade to unlock this feature and get access to advanced SEO analysis tools.
      </p>

      {/* Feature benefits */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">
          {getTierDisplayName(requiredTier)} Plan includes:
        </h4>
        <ul className="space-y-2">
          {tierBenefits[requiredTier]?.slice(0, 3).map((benefit, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade buttons */}
      {showUpgradeButton && (
        <div className="space-y-3">
          <button
            onClick={() => onNavigate?.('pricing')}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <StarIcon className="h-5 w-5 mr-2" />
            Upgrade to {getTierDisplayName(requiredTier)} - {getTierPrice(requiredTier)}/month
          </button>
          
          <button
            onClick={() => onNavigate?.('pricing')}
            className="w-full text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            View all plans
          </button>
        </div>
      )}

      {/* Current tier info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Current plan: <span className="font-medium">{getTierDisplayName(currentTier)}</span>
          {currentTier === 'free' && ' (Free)'}
        </p>
      </div>
    </div>
  );
};

// Higher-order component for easy feature gating
export const withSubscriptionGate = (Component, requiredTier = 'basic', feature = null) => {
  return function SubscriptionGatedComponent(props) {
    return (
      <SubscriptionPaywall 
        requiredTier={requiredTier} 
        feature={feature}
        onNavigate={props.onNavigate}
      >
        <Component {...props} />
      </SubscriptionPaywall>
    );
  };
};

// Hook for checking subscription access
export const useSubscriptionGate = () => {
  const { currentTier, hasFeature } = useSubscription();
  
  const tierHierarchy = {
    free: 0,
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  const checkAccess = (requiredTier, feature = null) => {
    if (feature && !hasFeature(feature)) return false;
    if (requiredTier && tierHierarchy[currentTier] < tierHierarchy[requiredTier]) return false;
    return true;
  };

  return { checkAccess, currentTier };
};

export default SubscriptionPaywall;