/**
 * Stripe Connect Domain Types
 * Tipos para la integración con Stripe Connect
 */

export type StripeAccountStatus = 
  | 'not_connected' 
  | 'pending' 
  | 'enabled' 
  | 'restricted' 
  | 'disabled';

export interface StripeRequirements {
  currently_due: string[];
  eventually_due: string[];
  past_due: string[];
  pending_verification?: string[];
}

export interface StripeConnectStatusResponse {
  connected: boolean;
  stripe_account_id?: string;
  account_type?: 'express' | 'standard';
  status: StripeAccountStatus;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  onboarding_completed: boolean;
  can_receive_payments: boolean;
  needs_reconnection?: boolean;
  requirements?: StripeRequirements;
}

export interface StripeOnboardingResponse {
  message?: string;
  onboarding_url?: string;
  stripe_account_id?: string;
  status?: StripeAccountStatus;
  expires_at?: number;
  state?: string;
}

export interface StripeOAuthCompleteRequest {
  code: string;
  state: string;
}

export interface StripeOAuthCompleteResponse {
  success: boolean;
  stripe_account_id: string;
  status: StripeAccountStatus;
  can_receive_payments: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  error?: string;
}

export interface StripeDashboardResponse {
  url: string;
  expires_at: number;
}

export interface StripeOnboardingRequest {
  country: string; // ISO 3166-1 alpha-2 code
  [key: string]: string;
}
