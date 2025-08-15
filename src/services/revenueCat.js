// Mock RevenueCat service for web implementation
// In a real implementation, you would integrate with Stripe, PayPal, or another web payment provider

// Subscription product IDs (these should match your RevenueCat configuration)
export const SUBSCRIPTION_PRODUCTS = {
  BASIC: 'basic_monthly',
  PREMIUM: 'premium_monthly',
  ENTERPRISE: 'enterprise_monthly'
};

// Entitlement identifiers
export const ENTITLEMENTS = {
  BASIC: 'basic_features',
  PREMIUM: 'premium_features',
  ENTERPRISE: 'enterprise_features'
};

class RevenueCatService {
  constructor() {
    this.isInitialized = false;
    this.customerInfo = {
      entitlements: {
        active: {}
      },
      activeSubscriptions: [],
      originalAppUserId: 'mock-user-id'
    };
    this.offerings = null;
  }

  // Initialize RevenueCat
  async initialize(userId = null) {
    try {
      if (this.isInitialized) return;
      
      // Mock initialization
      this.isInitialized = true;
      console.log('Mock RevenueCat initialized successfully');
      
      // Load subscription from localStorage for demo purposes
      const savedSubscription = localStorage.getItem('mock_subscription');
      if (savedSubscription) {
        const subscription = JSON.parse(savedSubscription);
        this.customerInfo.entitlements.active[subscription.tier] = {
          identifier: subscription.tier,
          isActive: true,
          expirationDate: subscription.expiresAt,
          willRenew: true
        };
      }
      
      await this.refreshCustomerInfo();
      await this.loadOfferings();
    } catch (error) {
      console.error('Failed to initialize Mock RevenueCat:', error);
      throw error;
    }
  }

  // Get current customer info
  async refreshCustomerInfo() {
    try {
      // Check if subscription is still valid
      const savedSubscription = localStorage.getItem('mock_subscription');
      if (savedSubscription) {
        const subscription = JSON.parse(savedSubscription);
        const expirationDate = new Date(subscription.expiresAt);
        
        if (expirationDate > new Date()) {
          this.customerInfo.entitlements.active[subscription.tier] = {
            identifier: subscription.tier,
            isActive: true,
            expirationDate: subscription.expiresAt,
            willRenew: true
          };
        } else {
          // Subscription expired, remove it
          this.customerInfo.entitlements.active = {};
          localStorage.removeItem('mock_subscription');
        }
      }
      
      return this.customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  // Load available offerings
  async loadOfferings() {
    try {
      // Mock offerings
      this.offerings = {
        current: {
          availablePackages: [
            {
              identifier: SUBSCRIPTION_PRODUCTS.BASIC,
              product: {
                identifier: 'basic',
                price: 29,
                priceString: '$29.00'
              }
            },
            {
              identifier: SUBSCRIPTION_PRODUCTS.PREMIUM,
              product: {
                identifier: 'premium',
                price: 79,
                priceString: '$79.00'
              }
            },
            {
              identifier: SUBSCRIPTION_PRODUCTS.ENTERPRISE,
              product: {
                identifier: 'enterprise',
                price: 199,
                priceString: '$199.00'
              }
            }
          ]
        }
      };
      
      return this.offerings;
    } catch (error) {
      console.error('Failed to load offerings:', error);
      throw error;
    }
  }

  // Purchase a subscription
  async purchaseSubscription(productId) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // Mock purchase - in real implementation, integrate with payment provider
      console.log(`Mock purchasing product: ${productId}`);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful purchase
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      
      this.customerInfo.entitlements.active[productId] = {
        identifier: productId,
        isActive: true,
        expirationDate: expirationDate.toISOString(),
        willRenew: true
      };
      
      // Save to localStorage for demo persistence
      localStorage.setItem('mock_subscription', JSON.stringify({
        tier: productId,
        expiresAt: expirationDate.toISOString(),
        purchasedAt: new Date().toISOString()
      }));
      
      return this.customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  // Restore purchases
  async restorePurchases() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      await this.refreshCustomerInfo();
      return this.customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  // Check if user has active subscription
  hasActiveSubscription() {
    if (!this.customerInfo) return false;
    
    const entitlements = this.customerInfo.entitlements.active;
    return Object.keys(entitlements).length > 0;
  }

  // Get current subscription tier
  getCurrentTier() {
    if (!this.customerInfo) return 'free';
    
    const entitlements = this.customerInfo.entitlements.active;
    
    if (entitlements[ENTITLEMENTS.ENTERPRISE]) return 'enterprise';
    if (entitlements[ENTITLEMENTS.PREMIUM]) return 'premium';
    if (entitlements[ENTITLEMENTS.BASIC]) return 'basic';
    
    return 'free';
  }

  // Get subscription expiration date
  getSubscriptionExpiration() {
    if (!this.customerInfo) return null;
    
    const entitlements = this.customerInfo.entitlements.active;
    const activeEntitlement = Object.values(entitlements)[0];
    
    return activeEntitlement ? activeEntitlement.expirationDate : null;
  }

  // Check if subscription will renew
  willRenew() {
    if (!this.customerInfo) return false;
    
    const entitlements = this.customerInfo.entitlements.active;
    const activeEntitlement = Object.values(entitlements)[0];
    
    return activeEntitlement ? activeEntitlement.willRenew : false;
  }

  // Get available products
  getAvailableProducts() {
    if (!this.offerings || !this.offerings.current) return [];
    
    return this.offerings.current.availablePackages;
  }

  // Log out user
  async logOut() {
    try {
      // Clear mock data
      this.customerInfo.entitlements.active = {};
      localStorage.removeItem('mock_subscription');
    } catch (error) {
      console.error('Failed to log out:', error);
      throw error;
    }
  }
}

// Create singleton instance
const revenueCatService = new RevenueCatService();

export default revenueCatService;