// Mock IAP service for v1
export type SubscriptionStatus = 'free' | 'monthly' | 'annual' | 'lifetime';

let status: SubscriptionStatus = 'free';

export const IAP = {
  getStatus(): SubscriptionStatus {
    return status;
  },
  setStatus(next: SubscriptionStatus) {
    status = next;
  },
  isPremium(): boolean {
    return status !== 'free';
  },
};
