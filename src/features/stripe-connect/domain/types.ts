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
  requirements?: StripeRequirements;
}

export interface StripeOnboardingResponse {
  onboarding_url: string;
  stripe_account_id: string;
  expires_at: number;
}

export interface StripeDashboardResponse {
  dashboard_url: string;
  created: number;
}

export interface StripeOnboardingRequest {
  country: string; // ISO 3166-1 alpha-2 code
  [key: string]: string;
}
