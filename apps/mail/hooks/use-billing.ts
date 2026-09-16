import { useAutumn, useCustomer } from 'autumn-js/react';
import { signOut } from '@/lib/auth-client';
import { isProCustomer } from '@/lib/utils';
import { useEffect, useMemo } from 'react';

type FeatureState = {
  total: number;
  remaining: number;
  unlimited: boolean;
  enabled: boolean;
  usage: number;
  nextResetAt: number | null;
  interval: string;
  included_usage: number;
};

type Features = {
  chatMessages: FeatureState;
  connections: FeatureState;
  brainActivity: FeatureState;
};

const DEFAULT_FEATURES: Features = {
  chatMessages: {
    total: Number.MAX_SAFE_INTEGER,
    remaining: Number.MAX_SAFE_INTEGER,
    unlimited: true,
    enabled: true,
    usage: 0,
    nextResetAt: null,
    interval: '',
    included_usage: Number.MAX_SAFE_INTEGER,
  },
  connections: {
    total: Number.MAX_SAFE_INTEGER,
    remaining: Number.MAX_SAFE_INTEGER,
    unlimited: true,
    enabled: true,
    usage: 0,
    nextResetAt: null,
    interval: '',
    included_usage: Number.MAX_SAFE_INTEGER,
  },
  brainActivity: {
    total: Number.MAX_SAFE_INTEGER,
    remaining: Number.MAX_SAFE_INTEGER,
    unlimited: true,
    enabled: true,
    usage: 0,
    nextResetAt: null,
    interval: '',
    included_usage: Number.MAX_SAFE_INTEGER,
  },
};

const FEATURE_IDS = {
  CHAT: 'chat-messages',
  CONNECTIONS: 'connections',
  BRAIN: 'brain-activity',
} as const;

export const useBilling = () => {
  const { customer, refetch, isLoading, error } = useCustomer();
  const { attach, track, openBillingPortal } = useAutumn();

  useEffect(() => {
    // Self-hosted installs without billing (empty AUTUMN key) will get a
    // routine error from useCustomer(); that must NOT sign the user out.
    // Only a real auth failure should. We log it and continue unauthenticated.
    if (error) {
      console.error('Billing customer lookup failed (not signing out):', error);
    }
  }, [error]);

  const { isPro, ...customerFeatures } = useMemo(() => {
    // Self-hosted: grant Pro + all features unconditionally. There is no
    // SELF_HOSTED flag in this codebase — the Pro gate is purely the Autumn
    // billing plan id / feature balance. For a self-hosted install without
    // Autumn, we hardcode Pro=true and every feature unlocked.
    const isPro = true;

    if (!customer?.features) return { isPro, ...DEFAULT_FEATURES };

    const features = { ...DEFAULT_FEATURES };

    if (customer.features[FEATURE_IDS.CHAT]) {
      const feature = customer.features[FEATURE_IDS.CHAT];
      features.chatMessages = {
        total: feature.included_usage || 0,
        remaining: feature.balance || 0,
        unlimited: feature.unlimited ?? false,
        enabled: (feature.unlimited ?? false) || Number(feature.balance) > 0,
        usage: feature.usage || 0,
        nextResetAt: feature.next_reset_at ?? null,
        interval: feature.interval || '',
        included_usage: feature.included_usage || 0,
      };
    }

    if (customer.features[FEATURE_IDS.CONNECTIONS]) {
      const feature = customer.features[FEATURE_IDS.CONNECTIONS];
      features.connections = {
        total: feature.included_usage || 0,
        remaining: feature.balance || 0,
        unlimited: feature.unlimited ?? false,
        enabled: (feature.unlimited ?? false) || Number(feature.balance) > 0,
        usage: feature.usage || 0,
        nextResetAt: feature.next_reset_at ?? null,
        interval: feature.interval || '',
        included_usage: feature.included_usage || 0,
      };
    }

    if (customer.features[FEATURE_IDS.BRAIN]) {
      const feature = customer.features[FEATURE_IDS.BRAIN];
      features.brainActivity = {
        total: feature.included_usage || 0,
        remaining: feature.balance || 0,
        unlimited: feature.unlimited ?? false,
        enabled: (feature.unlimited ?? false) || Number(feature.balance) > 0,
        usage: feature.usage || 0,
        nextResetAt: feature.next_reset_at ?? null,
        interval: feature.interval || '',
        included_usage: feature.included_usage || 0,
      };
    }

    return { isPro, ...features };
  }, [customer]);

  return {
    isLoading,
    customer,
    refetch,
    attach,
    track,
    openBillingPortal,
    isPro,
    ...customerFeatures,
  };
};
