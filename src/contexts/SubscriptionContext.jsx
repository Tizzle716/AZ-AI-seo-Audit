import React, { createContext, useContext, useState, useEffect } from 'react';
import revenueCatService from '../services/revenueCat';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [currentTier, setCurrentTier] = useState('free');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [error, setError] = useState(null);

  // Initialize RevenueCat on mount
  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get user ID from localStorage or generate one
      const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
      localStorage.setItem('userId', userId);
      
      await revenueCatService.initialize(userId);
      await refreshSubscriptionStatus();
    } catch (err) {
      console.error('Failed to initialize RevenueCat:', err);
      setError(err.message);
      // Set default values for demo purposes
      setCurrentTier('free');
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    try {
      const customerInfo = await revenueCatService.refreshCustomerInfo();
      const offerings = await revenueCatService.loadOfferings();
      
      setCustomerInfo(customerInfo);
      setOfferings(offerings);
      setCurrentTier(revenueCatService.getCurrentTier());
      setIsSubscribed(revenueCatService.hasActiveSubscription());
    } catch (err) {
      console.error('Failed to refresh subscription status:', err);
      setError(err.message);
    }
  };

  const purchaseSubscription = async (productId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const customerInfo = await revenueCatService.purchaseSubscription(productId);
      
      setCustomerInfo(customerInfo);
      setCurrentTier(revenueCatService.getCurrentTier());
      setIsSubscribed(revenueCatService.hasActiveSubscription());
      
      return { success: true, customerInfo };
    } catch (err) {
      console.error('Purchase failed:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const customerInfo = await revenueCatService.restorePurchases();
      
      setCustomerInfo(customerInfo);
      setCurrentTier(revenueCatService.getCurrentTier());
      setIsSubscribed(revenueCatService.hasActiveSubscription());
      
      return { success: true, customerInfo };
    } catch (err) {
      console.error('Restore failed:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Get subscription limits based on current tier
  const getSubscriptionLimits = () => {
    switch (currentTier) {
      case 'basic':
        return {
          maxPages: 25,
          pdfReports: true,
          competitorAnalysis: false,
          keywordResearch: false,
          prioritySupport: false,
          historyDays: 30
        };
      case 'premium':
        return {
          maxPages: 100,
          pdfReports: true,
          competitorAnalysis: true,
          keywordResearch: true,
          prioritySupport: true,
          historyDays: 90
        };
      case 'enterprise':
        return {
          maxPages: -1, // unlimited
          pdfReports: true,
          competitorAnalysis: true,
          keywordResearch: true,
          prioritySupport: true,
          historyDays: 365,
          whiteLabel: true,
          apiAccess: true,
          dedicatedSupport: true
        };
      default: // free
        return {
          maxPages: 5,
          pdfReports: false,
          competitorAnalysis: false,
          keywordResearch: false,
          prioritySupport: false,
          historyDays: 0
        };
    }
  };

  // Check if feature is available for current tier
  const hasFeature = (feature) => {
    const limits = getSubscriptionLimits();
    return limits[feature] === true;
  };

  // Check if user can perform action based on limits
  const canPerformAction = (action, currentUsage = 0) => {
    const limits = getSubscriptionLimits();
    
    switch (action) {
      case 'analyzePages':
        return limits.maxPages === -1 || currentUsage < limits.maxPages;
      default:
        return true;
    }
  };

  const value = {
    // State
    isLoading,
    customerInfo,
    currentTier,
    isSubscribed,
    offerings,
    error,
    
    // Actions
    purchaseSubscription,
    restorePurchases,
    refreshSubscriptionStatus,
    
    // Utilities
    getSubscriptionLimits,
    hasFeature,
    canPerformAction,
    
    // Subscription info
    subscriptionExpiration: revenueCatService.getSubscriptionExpiration(),
    willRenew: revenueCatService.willRenew(),
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;