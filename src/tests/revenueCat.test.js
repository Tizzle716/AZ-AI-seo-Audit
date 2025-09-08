import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import revenueCatService, { SUBSCRIPTION_PRODUCTS, ENTITLEMENTS } from '../services/revenueCat';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock console methods to avoid noise in tests
const consoleMock = {
  log: vi.fn(),
  error: vi.fn(),
};
Object.defineProperty(console, 'log', { value: consoleMock.log });
Object.defineProperty(console, 'error', { value: consoleMock.error });

describe('RevenueCat Service', () => {
  beforeEach(() => {
    // Reset service state
    revenueCatService.isInitialized = false;
    revenueCatService.customerInfo = {
      entitlements: {
        active: {}
      },
      activeSubscriptions: [],
      originalAppUserId: 'mock-user-id'
    };
    revenueCatService.offerings = null;
    
    // Clear all mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      await revenueCatService.initialize('test-user-id');
      
      expect(revenueCatService.isInitialized).toBe(true);
      expect(consoleMock.log).toHaveBeenCalledWith('Mock RevenueCat initialized successfully');
    });

    it('should not reinitialize if already initialized', async () => {
      revenueCatService.isInitialized = true;
      
      await revenueCatService.initialize('test-user-id');
      
      expect(consoleMock.log).not.toHaveBeenCalledWith('Mock RevenueCat initialized successfully');
    });

    it('should load existing subscription from localStorage on init', async () => {
      const mockSubscription = {
        tier: 'premium_monthly',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        purchasedAt: new Date().toISOString()
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockSubscription));
      
      await revenueCatService.initialize('test-user-id');
      
      expect(revenueCatService.customerInfo.entitlements.active['premium_monthly']).toBeDefined();
      expect(revenueCatService.customerInfo.entitlements.active['premium_monthly'].isActive).toBe(true);
    });

    it('should handle initialization errors', async () => {
      // Mock an error in refreshCustomerInfo
      const originalRefresh = revenueCatService.refreshCustomerInfo;
      revenueCatService.refreshCustomerInfo = vi.fn().mockRejectedValue(new Error('Network error'));
      
      await expect(revenueCatService.initialize()).rejects.toThrow('Network error');
      
      // Restore original method
      revenueCatService.refreshCustomerInfo = originalRefresh;
    });
  });

  describe('Customer Info Management', () => {
    it('should refresh customer info successfully', async () => {
      const result = await revenueCatService.refreshCustomerInfo();
      
      expect(result).toEqual(revenueCatService.customerInfo);
    });

    it('should remove expired subscriptions', async () => {
      const expiredSubscription = {
        tier: 'basic_monthly',
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        purchasedAt: new Date().toISOString()
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredSubscription));
      
      await revenueCatService.refreshCustomerInfo();
      
      expect(revenueCatService.customerInfo.entitlements.active).toEqual({});
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('mock_subscription');
    });

    it('should keep valid subscriptions', async () => {
      const validSubscription = {
        tier: 'premium_monthly',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        purchasedAt: new Date().toISOString()
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(validSubscription));
      
      await revenueCatService.refreshCustomerInfo();
      
      expect(revenueCatService.customerInfo.entitlements.active['premium_monthly']).toBeDefined();
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('Offerings Management', () => {
    it('should load offerings successfully', async () => {
      const offerings = await revenueCatService.loadOfferings();
      
      expect(offerings).toBeDefined();
      expect(offerings.current.availablePackages).toHaveLength(3);
      expect(offerings.current.availablePackages[0].identifier).toBe(SUBSCRIPTION_PRODUCTS.BASIC);
      expect(offerings.current.availablePackages[1].identifier).toBe(SUBSCRIPTION_PRODUCTS.PREMIUM);
      expect(offerings.current.availablePackages[2].identifier).toBe(SUBSCRIPTION_PRODUCTS.ENTERPRISE);
    });

    it('should return correct product prices', async () => {
      await revenueCatService.loadOfferings();
      
      const basicProduct = revenueCatService.offerings.current.availablePackages[0];
      const premiumProduct = revenueCatService.offerings.current.availablePackages[1];
      const enterpriseProduct = revenueCatService.offerings.current.availablePackages[2];
      
      expect(basicProduct.product.price).toBe(29);
      expect(premiumProduct.product.price).toBe(79);
      expect(enterpriseProduct.product.price).toBe(199);
    });
  });

  describe('Subscription Purchase', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should purchase subscription successfully', async () => {
      const productId = SUBSCRIPTION_PRODUCTS.PREMIUM;
      
      const purchasePromise = revenueCatService.purchaseSubscription(productId);
      
      // Fast-forward the 2-second delay
      vi.advanceTimersByTime(2000);
      
      const result = await purchasePromise;
      
      expect(result.entitlements.active[productId]).toBeDefined();
      expect(result.entitlements.active[productId].isActive).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'mock_subscription',
        expect.stringContaining(productId)
      );
    });

    it('should initialize before purchase if not initialized', async () => {
      revenueCatService.isInitialized = false;
      const initializeSpy = vi.spyOn(revenueCatService, 'initialize');
      
      const purchasePromise = revenueCatService.purchaseSubscription(SUBSCRIPTION_PRODUCTS.BASIC);
      vi.advanceTimersByTime(2000);
      await purchasePromise;
      
      expect(initializeSpy).toHaveBeenCalled();
    });

    it('should handle purchase errors', async () => {
      // Mock setTimeout to throw an error
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = vi.fn().mockImplementation(() => {
        throw new Error('Payment failed');
      });
      
      await expect(revenueCatService.purchaseSubscription(SUBSCRIPTION_PRODUCTS.BASIC))
        .rejects.toThrow('Payment failed');
      
      // Restore original setTimeout
      global.setTimeout = originalSetTimeout;
    });

    it('should set correct expiration date (1 month from now)', async () => {
      const now = new Date('2024-01-15T10:00:00Z');
      vi.setSystemTime(now);
      
      const purchasePromise = revenueCatService.purchaseSubscription(SUBSCRIPTION_PRODUCTS.BASIC);
      vi.advanceTimersByTime(2000);
      await purchasePromise;
      
      const savedSubscription = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      const expirationDate = new Date(savedSubscription.expiresAt);
      const expectedExpiration = new Date('2024-02-15T10:00:00Z');
      
      expect(expirationDate.getTime()).toBe(expectedExpiration.getTime());
    });
  });

  describe('Purchase Restoration', () => {
    it('should restore purchases successfully', async () => {
      const refreshSpy = vi.spyOn(revenueCatService, 'refreshCustomerInfo');
      
      const result = await revenueCatService.restorePurchases();
      
      expect(refreshSpy).toHaveBeenCalled();
      expect(result).toEqual(revenueCatService.customerInfo);
    });

    it('should initialize before restore if not initialized', async () => {
      revenueCatService.isInitialized = false;
      const initializeSpy = vi.spyOn(revenueCatService, 'initialize');
      
      await revenueCatService.restorePurchases();
      
      expect(initializeSpy).toHaveBeenCalled();
    });

    it('should handle restore errors', async () => {
      const refreshSpy = vi.spyOn(revenueCatService, 'refreshCustomerInfo')
        .mockRejectedValue(new Error('Restore failed'));
      
      await expect(revenueCatService.restorePurchases()).rejects.toThrow('Restore failed');
      
      refreshSpy.mockRestore();
    });
  });

  describe('Subscription Status Checks', () => {
    it('should return false for hasActiveSubscription when no subscription', () => {
      expect(revenueCatService.hasActiveSubscription()).toBe(false);
    });

    it('should return true for hasActiveSubscription when subscription exists', () => {
      revenueCatService.customerInfo.entitlements.active[SUBSCRIPTION_PRODUCTS.PREMIUM] = {
        identifier: SUBSCRIPTION_PRODUCTS.PREMIUM,
        isActive: true
      };
      
      expect(revenueCatService.hasActiveSubscription()).toBe(true);
    });

    it('should return correct tier for getCurrentTier', () => {
      // Test free tier
      expect(revenueCatService.getCurrentTier()).toBe('free');
      
      // Test basic tier
      revenueCatService.customerInfo.entitlements.active[ENTITLEMENTS.BASIC] = { isActive: true };
      expect(revenueCatService.getCurrentTier()).toBe('basic');
      
      // Test premium tier (should override basic)
      revenueCatService.customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM] = { isActive: true };
      expect(revenueCatService.getCurrentTier()).toBe('premium');
      
      // Test enterprise tier (should override premium)
      revenueCatService.customerInfo.entitlements.active[ENTITLEMENTS.ENTERPRISE] = { isActive: true };
      expect(revenueCatService.getCurrentTier()).toBe('enterprise');
    });

    it('should return null for getSubscriptionExpiration when no subscription', () => {
      expect(revenueCatService.getSubscriptionExpiration()).toBeNull();
    });

    it('should return expiration date when subscription exists', () => {
      const expirationDate = '2024-12-31T23:59:59Z';
      revenueCatService.customerInfo.entitlements.active[SUBSCRIPTION_PRODUCTS.PREMIUM] = {
        identifier: SUBSCRIPTION_PRODUCTS.PREMIUM,
        isActive: true,
        expirationDate
      };
      
      expect(revenueCatService.getSubscriptionExpiration()).toBe(expirationDate);
    });

    it('should return false for willRenew when no subscription', () => {
      expect(revenueCatService.willRenew()).toBe(false);
    });

    it('should return correct willRenew status', () => {
      revenueCatService.customerInfo.entitlements.active[SUBSCRIPTION_PRODUCTS.PREMIUM] = {
        identifier: SUBSCRIPTION_PRODUCTS.PREMIUM,
        isActive: true,
        willRenew: true
      };
      
      expect(revenueCatService.willRenew()).toBe(true);
      
      // Test false case
      revenueCatService.customerInfo.entitlements.active[SUBSCRIPTION_PRODUCTS.PREMIUM].willRenew = false;
      expect(revenueCatService.willRenew()).toBe(false);
    });
  });

  describe('Product Management', () => {
    it('should return empty array for getAvailableProducts when no offerings', () => {
      expect(revenueCatService.getAvailableProducts()).toEqual([]);
    });

    it('should return available products when offerings loaded', async () => {
      await revenueCatService.loadOfferings();
      
      const products = revenueCatService.getAvailableProducts();
      
      expect(products).toHaveLength(3);
      expect(products[0].identifier).toBe(SUBSCRIPTION_PRODUCTS.BASIC);
      expect(products[1].identifier).toBe(SUBSCRIPTION_PRODUCTS.PREMIUM);
      expect(products[2].identifier).toBe(SUBSCRIPTION_PRODUCTS.ENTERPRISE);
    });
  });

  describe('User Logout', () => {
    it('should clear subscription data on logout', async () => {
      // Set up active subscription
      revenueCatService.customerInfo.entitlements.active[SUBSCRIPTION_PRODUCTS.PREMIUM] = {
        identifier: SUBSCRIPTION_PRODUCTS.PREMIUM,
        isActive: true
      };
      
      await revenueCatService.logOut();
      
      expect(revenueCatService.customerInfo.entitlements.active).toEqual({});
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('mock_subscription');
    });

    it('should handle logout errors gracefully', async () => {
      // Mock localStorage.removeItem to throw an error
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      await expect(revenueCatService.logOut()).rejects.toThrow('Storage error');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null customerInfo gracefully', () => {
      revenueCatService.customerInfo = null;
      
      expect(revenueCatService.hasActiveSubscription()).toBe(false);
      expect(revenueCatService.getCurrentTier()).toBe('free');
      expect(revenueCatService.getSubscriptionExpiration()).toBeNull();
      expect(revenueCatService.willRenew()).toBe(false);
    });

    it('should handle malformed localStorage data', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      // Should not throw an error, but should handle gracefully
      await expect(revenueCatService.refreshCustomerInfo()).resolves.toBeDefined();
    });

    it('should handle missing offerings gracefully', () => {
      revenueCatService.offerings = { current: null };
      
      expect(revenueCatService.getAvailableProducts()).toEqual([]);
    });
  });

  describe('Constants and Configuration', () => {
    it('should have correct subscription product IDs', () => {
      expect(SUBSCRIPTION_PRODUCTS.BASIC).toBe('basic_monthly');
      expect(SUBSCRIPTION_PRODUCTS.PREMIUM).toBe('premium_monthly');
      expect(SUBSCRIPTION_PRODUCTS.ENTERPRISE).toBe('enterprise_monthly');
    });

    it('should have correct entitlement identifiers', () => {
      expect(ENTITLEMENTS.BASIC).toBe('basic_features');
      expect(ENTITLEMENTS.PREMIUM).toBe('premium_features');
      expect(ENTITLEMENTS.ENTERPRISE).toBe('enterprise_features');
    });
  });
});