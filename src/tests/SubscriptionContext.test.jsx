import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { SubscriptionProvider, useSubscription } from '../contexts/SubscriptionContext';
import revenueCatService from '../services/revenueCat';

// Mock the revenueCat service
vi.mock('../services/revenueCat', () => ({
  default: {
    initialize: vi.fn(),
    refreshCustomerInfo: vi.fn(),
    loadOfferings: vi.fn(),
    purchaseSubscription: vi.fn(),
    restorePurchases: vi.fn(),
    getCurrentTier: vi.fn(),
    hasActiveSubscription: vi.fn(),
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Test component to access context
const TestComponent = () => {
  const {
    isLoading,
    customerInfo,
    currentTier,
    isSubscribed,
    offerings,
    error,
    purchaseSubscription,
    restorePurchases,
    hasFeature,
    canPerformAction,
    getSubscriptionLimits
  } = useSubscription();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="tier">{currentTier}</div>
      <div data-testid="subscribed">{isSubscribed ? 'subscribed' : 'not-subscribed'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <button 
        data-testid="purchase-btn" 
        onClick={() => purchaseSubscription('premium_monthly')}
      >
        Purchase
      </button>
      <button 
        data-testid="restore-btn" 
        onClick={restorePurchases}
      >
        Restore
      </button>
      <div data-testid="has-feature">{hasFeature('advancedAnalytics') ? 'has-feature' : 'no-feature'}</div>
      <div data-testid="can-analyze">{canPerformAction('analyzePages', 5) ? 'can-analyze' : 'cannot-analyze'}</div>
      <div data-testid="limits">{JSON.stringify(getSubscriptionLimits())}</div>
    </div>
  );
};

const renderWithProvider = (component) => {
  return render(
    <SubscriptionProvider>
      {component}
    </SubscriptionProvider>
  );
};

describe('SubscriptionContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Default mock implementations
    revenueCatService.initialize.mockResolvedValue();
    revenueCatService.refreshCustomerInfo.mockResolvedValue({
      entitlements: { active: {} },
      activeSubscriptions: []
    });
    revenueCatService.loadOfferings.mockResolvedValue({
      current: {
        availablePackages: [
          { identifier: 'basic_monthly', product: { price: 29 } },
          { identifier: 'premium_monthly', product: { price: 79 } }
        ]
      }
    });
    revenueCatService.getCurrentTier.mockReturnValue('free');
    revenueCatService.hasActiveSubscription.mockReturnValue(false);
  });

  describe('Provider Initialization', () => {
    it('should initialize RevenueCat on mount', async () => {
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(revenueCatService.initialize).toHaveBeenCalled();
      });
    });

    it('should generate and store user ID if not exists', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'userId',
          expect.stringMatching(/^user_\d+$/)
        );
      });
    });

    it('should use existing user ID from localStorage', async () => {
      const existingUserId = 'existing-user-123';
      localStorageMock.getItem.mockReturnValue(existingUserId);
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(revenueCatService.initialize).toHaveBeenCalledWith(existingUserId);
      });
    });

    it('should show loading state initially', () => {
      renderWithProvider(<TestComponent />);
      
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    });

    it('should hide loading state after initialization', async () => {
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      const errorMessage = 'Network connection failed';
      revenueCatService.initialize.mockRejectedValue(new Error(errorMessage));
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
        expect(screen.getByTestId('tier')).toHaveTextContent('free');
        expect(screen.getByTestId('subscribed')).toHaveTextContent('not-subscribed');
      });
    });

    it('should handle refresh errors', async () => {
      revenueCatService.refreshCustomerInfo.mockRejectedValue(new Error('Refresh failed'));
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Refresh failed');
      });
    });
  });

  describe('Subscription State Management', () => {
    it('should display correct subscription state for free user', async () => {
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('tier')).toHaveTextContent('free');
        expect(screen.getByTestId('subscribed')).toHaveTextContent('not-subscribed');
      });
    });

    it('should display correct subscription state for premium user', async () => {
      revenueCatService.getCurrentTier.mockReturnValue('premium');
      revenueCatService.hasActiveSubscription.mockReturnValue(true);
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('tier')).toHaveTextContent('premium');
        expect(screen.getByTestId('subscribed')).toHaveTextContent('subscribed');
      });
    });
  });

  describe('Purchase Functionality', () => {
    it('should handle successful purchase', async () => {
      const mockCustomerInfo = {
        entitlements: {
          active: {
            premium_monthly: { isActive: true }
          }
        }
      };
      
      revenueCatService.purchaseSubscription.mockResolvedValue(mockCustomerInfo);
      revenueCatService.getCurrentTier.mockReturnValue('premium');
      revenueCatService.hasActiveSubscription.mockReturnValue(true);
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
      
      await act(async () => {
        screen.getByTestId('purchase-btn').click();
      });
      
      await waitFor(() => {
        expect(revenueCatService.purchaseSubscription).toHaveBeenCalledWith('premium_monthly');
      });
    });

    it('should handle purchase errors', async () => {
      const errorMessage = 'Payment failed';
      revenueCatService.purchaseSubscription.mockRejectedValue(new Error(errorMessage));
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
      
      await act(async () => {
        screen.getByTestId('purchase-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });

    it('should show loading state during purchase', async () => {
      let resolvePromise;
      const purchasePromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      revenueCatService.purchaseSubscription.mockReturnValue(purchasePromise);
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
      
      await act(async () => {
        screen.getByTestId('purchase-btn').click();
      });
      
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
      
      // Resolve the purchase
      await act(async () => {
        resolvePromise({ entitlements: { active: {} } });
        await purchasePromise;
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
    });
  });

  describe('Restore Purchases', () => {
    it('should handle successful restore', async () => {
      const mockCustomerInfo = {
        entitlements: {
          active: {
            basic_monthly: { isActive: true }
          }
        }
      };
      
      revenueCatService.restorePurchases.mockResolvedValue(mockCustomerInfo);
      revenueCatService.getCurrentTier.mockReturnValue('basic');
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
      
      await act(async () => {
        screen.getByTestId('restore-btn').click();
      });
      
      await waitFor(() => {
        expect(revenueCatService.restorePurchases).toHaveBeenCalled();
      });
    });

    it('should handle restore errors', async () => {
      const errorMessage = 'Restore failed';
      revenueCatService.restorePurchases.mockRejectedValue(new Error(errorMessage));
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
      
      await act(async () => {
        screen.getByTestId('restore-btn').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });
  });

  describe('Subscription Limits and Features', () => {
    it('should return correct limits for free tier', async () => {
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        const limits = JSON.parse(screen.getByTestId('limits').textContent);
        expect(limits).toEqual({
          maxPages: 5,
          maxReports: 3,
          advancedAnalytics: false,
          prioritySupport: false,
          customBranding: false
        });
      });
    });

    it('should return correct limits for basic tier', async () => {
      revenueCatService.getCurrentTier.mockReturnValue('basic');
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        const limits = JSON.parse(screen.getByTestId('limits').textContent);
        expect(limits).toEqual({
          maxPages: 25,
          maxReports: 10,
          advancedAnalytics: true,
          prioritySupport: false,
          customBranding: false
        });
      });
    });

    it('should return correct limits for premium tier', async () => {
      revenueCatService.getCurrentTier.mockReturnValue('premium');
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        const limits = JSON.parse(screen.getByTestId('limits').textContent);
        expect(limits).toEqual({
          maxPages: 100,
          maxReports: 50,
          advancedAnalytics: true,
          prioritySupport: true,
          customBranding: true
        });
      });
    });

    it('should return correct limits for enterprise tier', async () => {
      revenueCatService.getCurrentTier.mockReturnValue('enterprise');
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        const limits = JSON.parse(screen.getByTestId('limits').textContent);
        expect(limits).toEqual({
          maxPages: -1,
          maxReports: -1,
          advancedAnalytics: true,
          prioritySupport: true,
          customBranding: true
        });
      });
    });

    it('should check features correctly', async () => {
      // Test free tier - no advanced analytics
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('has-feature')).toHaveTextContent('no-feature');
      });
      
      // Test premium tier - has advanced analytics
      revenueCatService.getCurrentTier.mockReturnValue('premium');
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('has-feature')).toHaveTextContent('has-feature');
      });
    });

    it('should check action permissions correctly', async () => {
      // Test free tier - can analyze 5 pages, but not more
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('can-analyze')).toHaveTextContent('cannot-analyze'); // 5 >= 5
      });
      
      // Test enterprise tier - unlimited pages
      revenueCatService.getCurrentTier.mockReturnValue('enterprise');
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('can-analyze')).toHaveTextContent('can-analyze');
      });
    });
  });

  describe('Context Hook Error Handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useSubscription must be used within a SubscriptionProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown subscription tier', async () => {
      revenueCatService.getCurrentTier.mockReturnValue('unknown');
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        const limits = JSON.parse(screen.getByTestId('limits').textContent);
        // Should default to free tier limits
        expect(limits.maxPages).toBe(5);
      });
    });

    it('should handle null offerings', async () => {
      revenueCatService.loadOfferings.mockResolvedValue(null);
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
      
      // Should not crash
    });

    it('should handle null customer info', async () => {
      revenueCatService.refreshCustomerInfo.mockResolvedValue(null);
      
      renderWithProvider(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });
      
      // Should not crash and show default values
    });
  });
});