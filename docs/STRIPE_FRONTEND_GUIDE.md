# Guía de Integración Stripe - Frontend (AnyClazz Portal)

## 📋 Resumen

Esta guía explica cómo integrar Stripe en el frontend de AnyClazz Portal (Astro + React) para:

- ✅ Mostrar planes de suscripción Super Tutor
- ✅ Crear suscripciones con Stripe Elements
- ✅ Realizar pagos de clases (bookings)
- ✅ Gestionar métodos de pago
- ✅ Manejar actualizaciones/downgrades de suscripciones

---

## 🔧 Configuración Inicial

### 1. Instalar Stripe.js

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Variables de Entorno

Crea o actualiza el archivo `.env` en el frontend:

```env
# Stripe Publishable Key (obtener del backend endpoint)
PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Backend API URL
PUBLIC_API_URL="http://localhost:8000"
```

### 3. Configurar Stripe Provider

Crea un componente wrapper para Stripe Elements:

**`src/components/stripe/StripeProvider.tsx`**
```typescript
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { ReactNode } from 'react';

// Cargar Stripe con tu publishable key
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
```

---

## 💰 Mostrar Planes Super Tutor

### 1. Obtener Planes desde el Backend

**`src/services/stripe.ts`**
```typescript
const API_URL = import.meta.env.PUBLIC_API_URL;

interface StripePlan {
  interval: 'week' | 'month' | 'year';
  price_id: string;
  amount: number;
  currency: string;
  recurring_interval: string;
  recurring_interval_count: number;
  product: {
    id: string;
    name: string;
    description?: string;
  };
}

interface GetPlansResponse {
  plans: StripePlan[];
  currency: string;
}

export async function getSuperTutorPlans(): Promise<GetPlansResponse> {
  const response = await fetch(`${API_URL}/api/v1/super-tutor/plans`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch plans');
  }
  
  return response.json();
}

export async function getSuperTutorPlan(interval: 'week' | 'month' | 'year'): Promise<StripePlan> {
  const response = await fetch(`${API_URL}/api/v1/super-tutor/plans/${interval}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${interval} plan`);
  }
  
  return response.json();
}
```

### 2. Componente de Planes

**`src/components/stripe/SuperTutorPlans.tsx`**
```typescript
import { useEffect, useState } from 'react';
import { getSuperTutorPlans } from '@/services/stripe';
import type { StripePlan } from '@/services/stripe';

export function SuperTutorPlans() {
  const [plans, setPlans] = useState<StripePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      const data = await getSuperTutorPlans();
      setPlans(data.plans);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading plans...</div>;
  }

  return (
    <div className="plans-container">
      <h2>Become a Super Tutor</h2>
      
      <div className="interval-selector">
        <button 
          onClick={() => setSelectedInterval('week')}
          className={selectedInterval === 'week' ? 'active' : ''}
        >
          Weekly
        </button>
        <button 
          onClick={() => setSelectedInterval('month')}
          className={selectedInterval === 'month' ? 'active' : ''}
        >
          Monthly
        </button>
        <button 
          onClick={() => setSelectedInterval('year')}
          className={selectedInterval === 'year' ? 'active' : ''}
        >
          Yearly
        </button>
      </div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.interval} className={`plan-card ${plan.interval === selectedInterval ? 'selected' : ''}`}>
            <h3>{plan.interval === 'week' ? 'Weekly' : plan.interval === 'month' ? 'Monthly' : 'Yearly'}</h3>
            <div className="price">
              <span className="amount">${plan.amount}</span>
              <span className="currency">{plan.currency}</span>
              <span className="period">/{plan.recurring_interval}</span>
            </div>
            <p>{plan.product.description}</p>
            
            {plan.interval === selectedInterval && (
              <button onClick={() => handleSubscribe(plan)}>
                Subscribe Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  function handleSubscribe(plan: StripePlan) {
    // Implementar en la siguiente sección
  }
}
```

---

## 🎯 Crear Suscripción Super Tutor

### 1. Service de Suscripción

**`src/services/subscription.ts`**
```typescript
const API_URL = import.meta.env.PUBLIC_API_URL;

interface CreateSubscriptionRequest {
  interval: 'week' | 'month' | 'year';
  payment_method_id?: string;
}

interface SubscriptionResponse {
  subscription_id: string;
  stripe_subscription_id: string;
  status: string;
  interval: string;
  current_period_end: string;
  client_secret: string;
  is_upgrade?: boolean;
  message?: string;
}

export async function createSuperTutorSubscription(
  token: string,
  data: CreateSubscriptionRequest
): Promise<SubscriptionResponse> {
  const response = await fetch(`${API_URL}/api/v1/teachers/subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create subscription');
  }

  return response.json();
}

export async function cancelSubscription(
  token: string,
  immediately: boolean = false
): Promise<any> {
  const response = await fetch(`${API_URL}/api/v1/teachers/subscription/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ immediately }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel subscription');
  }

  return response.json();
}
```

### 2. Componente de Checkout con Stripe Elements

**`src/components/stripe/SubscriptionCheckout.tsx`**
```typescript
import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createSuperTutorSubscription } from '@/services/subscription';
import type { StripePlan } from '@/services/stripe';

interface SubscriptionCheckoutProps {
  plan: StripePlan;
  token: string; // JWT token del usuario
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function SubscriptionCheckout({ plan, token, onSuccess, onError }: SubscriptionCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [useExistingCard, setUseExistingCard] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      let paymentMethodId: string | undefined;

      if (!useExistingCard) {
        // Crear Payment Method desde la tarjeta ingresada
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          throw new Error(error.message);
        }

        paymentMethodId = paymentMethod.id;
      }

      // Crear suscripción en el backend
      const subscription = await createSuperTutorSubscription(token, {
        interval: plan.interval,
        payment_method_id: paymentMethodId,
      });

      // Si hay client_secret, confirmar el pago
      if (subscription.client_secret) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          subscription.client_secret
        );

        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      // Mostrar mensaje si es upgrade/downgrade
      if (subscription.is_upgrade) {
        console.log(subscription.message);
      }

      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="subscription-checkout">
      <h3>Subscribe to {plan.interval === 'week' ? 'Weekly' : plan.interval === 'month' ? 'Monthly' : 'Yearly'} Plan</h3>
      
      <div className="plan-summary">
        <p>Amount: ${plan.amount} {plan.currency}</p>
        <p>Billing: Every {plan.recurring_interval}</p>
      </div>

      <div className="payment-method-section">
        <label>
          <input
            type="checkbox"
            checked={useExistingCard}
            onChange={(e) => setUseExistingCard(e.target.checked)}
          />
          Use saved payment method
        </label>

        {!useExistingCard && (
          <div className="card-element-wrapper">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
}
```

### 3. EJEMPLO: Página de Suscripción

**`src/pages/subscribe.astro`**
```astro
---
import Layout from '@/layouts/Layout.astro';
import { StripeProvider } from '@/components/stripe/StripeProvider';
import { SubscriptionPage } from '@/components/stripe/SubscriptionPage';
---

<Layout title="Become a Super Tutor">
  <StripeProvider client:load>
    <SubscriptionPage client:load />
  </StripeProvider>
</Layout>
```

**`src/components/stripe/SubscriptionPage.tsx`**
```typescript
import { useState, useEffect } from 'react';
import { getSuperTutorPlans } from '@/services/stripe';
import { SubscriptionCheckout } from './SubscriptionCheckout';
import type { StripePlan } from '@/services/stripe';

export function SubscriptionPage() {
  const [plans, setPlans] = useState<StripePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<StripePlan | null>(null);
  const [token, setToken] = useState<string>(''); // Obtener del contexto de autenticación

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    const data = await getSuperTutorPlans();
    setPlans(data.plans);
  }

  if (selectedPlan) {
    return (
      <SubscriptionCheckout
        plan={selectedPlan}
        token={token}
        onSuccess={() => {
          alert('Subscription created successfully!');
          setSelectedPlan(null);
        }}
        onError={(error) => {
          alert(`Error: ${error}`);
        }}
      />
    );
  }

  return (
    <div>
      <h1>Choose Your Plan</h1>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.interval} className="plan-card">
            <h3>{plan.interval}</h3>
            <p>${plan.amount} {plan.currency}</p>
            <button onClick={() => setSelectedPlan(plan)}>
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 💳 Pagar una Clase (Booking)

### 1. Service de Pagos

**`src/services/payment.ts`**
```typescript
const API_URL = import.meta.env.PUBLIC_API_URL;

interface CreatePaymentIntentRequest {
  booking_id?: string;
  subscription_id?: string;
  payment_method_id?: string;
}

interface PaymentIntentResponse {
  payment_intent_id: string;
  client_secret: string;
  amount: string;
  currency: string;
  status: string;
  type: 'booking' | 'subscription';
}

export async function createPaymentIntent(
  token: string,
  data: CreatePaymentIntentRequest
): Promise<PaymentIntentResponse> {
  const response = await fetch(`${API_URL}/api/v1/payment-intents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment intent');
  }

  return response.json();
}
```

### 2. Componente de Pago de Booking

**`src/components/stripe/BookingPayment.tsx`**
```typescript
import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '@/services/payment';

interface BookingPaymentProps {
  bookingId: string;
  token: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function BookingPayment({ bookingId, token, onSuccess, onError }: BookingPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Crear Payment Method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      // Crear Payment Intent
      const paymentIntent = await createPaymentIntent(token, {
        booking_id: bookingId,
        payment_method_id: paymentMethod.id,
      });

      // Confirmar el pago
      const { error: confirmError } = await stripe.confirmCardPayment(
        paymentIntent.client_secret
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePayment}>
      <h3>Pay for Class</h3>
      
      <div className="card-element">
        <CardElement />
      </div>

      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

---

## 💾 Gestionar Métodos de Pago

### 1. Service de Payment Methods

**`src/services/paymentMethods.ts`**
```typescript
const API_URL = import.meta.env.PUBLIC_API_URL;

interface PaymentMethod {
  payment_method_id: string;
  type: 'card' | 'paypal';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  paypal_email?: string;
  is_default: boolean;
  is_expired: boolean;
  created_at: string;
}

export async function getPaymentMethods(token: string): Promise<PaymentMethod[]> {
  const response = await fetch(`${API_URL}/api/v1/payment-methods`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment methods');
  }

  return response.json();
}

export async function savePaymentMethod(
  token: string,
  stripePaymentMethodId: string,
  setAsDefault: boolean = false
): Promise<PaymentMethod> {
  const response = await fetch(`${API_URL}/api/v1/payment-methods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      stripe_payment_method_id: stripePaymentMethodId,
      set_as_default: setAsDefault,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save payment method');
  }

  return response.json();
}
```

### 2. Componente de Payment Methods

**`src/components/stripe/PaymentMethodsList.tsx`**
```typescript
import { useEffect, useState } from 'react';
import { getPaymentMethods, savePaymentMethod } from '@/services/paymentMethods';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import type { PaymentMethod } from '@/services/paymentMethods';

interface PaymentMethodsListProps {
  token: string;
}

export function PaymentMethodsList({ token }: PaymentMethodsListProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    loadMethods();
  }, []);

  async function loadMethods() {
    try {
      const data = await getPaymentMethods(token);
      setMethods(data);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  }

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      await savePaymentMethod(token, paymentMethod.id, methods.length === 0);
      
      setShowAddCard(false);
      loadMethods();
    } catch (error) {
      console.error('Error adding card:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="payment-methods">
      <h3>Saved Payment Methods</h3>

      <div className="methods-list">
        {methods.map((method) => (
          <div key={method.payment_method_id} className={`method-card ${method.is_default ? 'default' : ''}`}>
            {method.type === 'card' && (
              <>
                <span className="brand">{method.card_brand?.toUpperCase()}</span>
                <span className="last4">•••• {method.card_last4}</span>
                <span className="expiry">{method.card_exp_month}/{method.card_exp_year}</span>
                {method.is_default && <span className="badge">Default</span>}
                {method.is_expired && <span className="badge error">Expired</span>}
              </>
            )}
          </div>
        ))}
      </div>

      {!showAddCard && (
        <button onClick={() => setShowAddCard(true)}>
          Add New Card
        </button>
      )}

      {showAddCard && (
        <form onSubmit={handleAddCard}>
          <CardElement />
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Card'}
          </button>
          <button type="button" onClick={() => setShowAddCard(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
```

---

## 🔄 Flujos Completos

### Flujo 1: Usuario se Suscribe a Super Tutor

```
1. Usuario ve planes → GET /api/v1/super-tutor/plans
2. Usuario selecciona plan (monthly)
3. Usuario ingresa tarjeta → Stripe.createPaymentMethod()
4. Frontend envía → POST /api/v1/teachers/subscription
5. Backend crea suscripción en Stripe
6. Frontend confirma pago → stripe.confirmCardPayment()
7. ✅ Suscripción activa
```

### Flujo 2: Usuario Cambia de Plan (Upgrade/Downgrade)

```
1. Usuario tiene plan semanal activo
2. Usuario selecciona plan mensual
3. Usuario ingresa/usa tarjeta guardada
4. Frontend envía → POST /api/v1/teachers/subscription (interval: 'month')
5. Backend detecta suscripción existente
6. Backend cancela suscripción semanal automáticamente
7. Backend crea nueva suscripción mensual
8. Frontend recibe is_upgrade: true
9. ✅ Plan actualizado
```

### Flujo 3: Estudiante Paga una Clase

```
1. Estudiante reserva una clase (booking creado)
2. Frontend muestra checkout
3. Usuario ingresa tarjeta → Stripe.createPaymentMethod()
4. Frontend envía → POST /api/v1/payment-intents (booking_id)
5. Backend calcula precio desde booking
6. Backend crea Payment Intent en Stripe
7. Frontend confirma → stripe.confirmCardPayment()
8. Stripe envía webhook → backend actualiza payment
9. ✅ Clase pagada
```

---

## 📱 Testing

### Tarjetas de Prueba Stripe

```javascript
// Pago exitoso
const testCard = {
  number: '4242 4242 4242 4242',
  exp_month: 12,
  exp_year: 2030,
  cvc: '123'
};

// Pago rechazado
const declinedCard = {
  number: '4000 0000 0000 0002',
  exp_month: 12,
  exp_year: 2030,
  cvc: '123'
};

// Requiere autenticación 3D Secure
const secure3DCard = {
  number: '4000 0025 0000 3155',
  exp_month: 12,
  exp_year: 2030,
  cvc: '123'
};
```

---

## 🚨 Manejo de Errores

### Errores Comunes

**`src/utils/stripeErrors.ts`**
```typescript
export function getStripeErrorMessage(error: any): string {
  if (error.type === 'card_error') {
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try another card.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please use another card.';
      case 'expired_card':
        return 'Your card has expired. Please use another card.';
      case 'incorrect_cvc':
        return 'Incorrect CVC code. Please check and try again.';
      default:
        return error.message || 'Card error occurred.';
    }
  }

  if (error.type === 'validation_error') {
    return 'Please check your card details and try again.';
  }

  return error.message || 'An unexpected error occurred.';
}
```

---

## 🔒 Seguridad

### ⚠️ NUNCA hagas esto:

❌ NO envíes números de tarjeta al backend  
❌ NO almacenes datos de tarjeta en localStorage  
❌ NO uses la Secret Key en el frontend  
❌ NO confíes solo en validación frontend para precios  

### ✅ SÍ haz esto:

✅ Usa Stripe Elements para capturar tarjetas  
✅ Usa Payment Methods (tokens) en lugar de tarjetas  
✅ Usa solo Publishable Key en frontend  
✅ Confía en el backend para calcular precios  
✅ Valida JWT tokens en cada request  

---

## 📚 Recursos

- [Stripe.js Reference](https://stripe.com/docs/js)
- [React Stripe.js](https://stripe.com/docs/stripe-js/react)
- [Stripe Elements](https://stripe.com/docs/payments/elements)
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Backend Integration Guide](../../STRIPE_INTEGRATION_GUIDE.md)

---

**Última actualización:** 19 de febrero de 2026
