import { FetchClient } from '@/features/shared/services/httpClient';
import { getApiUrl } from '@/features/shared/services/environment';
import type {
  StripeConnectStatusResponse,
  StripeOnboardingResponse,
  StripeDashboardResponse,
  StripeOnboardingRequest,
  StripeOAuthCompleteRequest,
  StripeOAuthCompleteResponse,
} from '../domain/types';

/**
 * Stripe Connect Repository
 * Maneja las llamadas a los endpoints de Stripe Connect
 */
export class StripeConnectRepository {
  private readonly httpClient: FetchClient;

  constructor() {
    this.httpClient = new FetchClient(getApiUrl());
  }

  /**
   * Obtiene el estado actual de la cuenta de Stripe Connect
   */
  async getStatus(token: string): Promise<StripeConnectStatusResponse> {
    const response = await this.httpClient.get({
      url: '/teachers/me/stripe-connect/status',
      token,
    });

    return response.json();
  }

  /**
   * Inicia el proceso de OAuth de Stripe Connect
   */
  async createOnboardingLink(
    token: string,
    data: StripeOnboardingRequest
  ): Promise<StripeOnboardingResponse> {
    const response = await this.httpClient.post({
      url: '/teachers/me/stripe-connect/onboard',
      token,
      data: data as any,
    });

    return response.json();
  }

  /**
   * Completa el flujo OAuth de Stripe Connect
   */
  async completeOAuth(
    token: string,
    data: StripeOAuthCompleteRequest
  ): Promise<StripeOAuthCompleteResponse> {
    const response = await this.httpClient.post({
      url: '/teachers/me/stripe-connect/complete',
      token,
      data: data as any,
    });

    return response.json();
  }

  /**
   * Crea un enlace al dashboard de Stripe
   */
  async createDashboardLink(token: string): Promise<StripeDashboardResponse> {
    const response = await this.httpClient.post({
      url: '/teachers/me/stripe-connect/dashboard-link',
      token,
      data: {},
    });

    return response.json();
  }

  /**
   * Desconecta la cuenta de Stripe Connect
   */
  async disconnect(token: string): Promise<{ success: boolean; message: string }> {
    const response = await this.httpClient.delete({
      url: '/teachers/me/stripe-connect/disconnect',
      token,
    });

    return response.json();
  }
}
