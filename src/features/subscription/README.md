# Subscription Feature

Feature para gestionar suscripciones de Super Tutor.

## Arquitectura

```
src/features/subscription/
├── domain/
│   └── types.ts              # Interfaces y tipos del dominio
├── infrastructure/
│   └── ApiSubscriptionRepository.ts  # Implementación del repositorio
├── hooks/
│   ├── useCreateSubscription.ts      # Hook para crear suscripción
│   └── useSubscriptionStatus.ts      # Hook para obtener estado de suscripción
└── index.ts                   # Punto de entrada del feature
```

## Uso

### Crear una suscripción

```typescript
import { useCreateSubscription } from '@/features/subscription';

function MyComponent() {
  const { createSubscription, loading, error, data } = useCreateSubscription(token);

  async function handleSubscribe() {
    const subscription = await createSubscription({
      interval: 'month',
      // payment_method_id es opcional - si se usa PaymentElement, no es necesario
    });

    if (subscription) {
      console.log('Suscripción creada:', subscription.subscription_id);
      console.log('Client secret:', subscription.client_secret);
    }
  }

  return (
    <button onClick={handleSubscribe} disabled={loading}>
      {loading ? 'Procesando...' : 'Suscribirse'}
    </button>
  );
}
```

### Obtener estado de suscripción

```typescript
import { useSubscriptionStatus } from '@/features/subscription';

function MyComponent() {
  const { hasSubscription, subscription, loading, error, refetch } = useSubscriptionStatus(token);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {hasSubscription ? (
        <div>
          <p>Suscripción activa hasta: {subscription?.current_period_end}</p>
          <p>Intervalo: {subscription?.interval}</p>
          <p>Estado: {subscription?.status}</p>
        </div>
      ) : (
        <p>No tienes suscripción activa</p>
      )}
    </div>
  );
}
```

### Uso directo del repositorio

Si necesitas más control, puedes usar el repositorio directamente:

```typescript
import { ApiSubscriptionRepository } from '@/features/subscription';

const subscriptionRepository = new ApiSubscriptionRepository();

// Crear suscripción
const subscription = await subscriptionRepository.createSubscription(token, {
  interval: 'month',
});

// Obtener estado
const status = await subscriptionRepository.getSubscriptionStatus(token);

// Cancelar suscripción
await subscriptionRepository.cancelSubscription(token, { immediately: true });
```

## Integración con Stripe

El flujo de pago funciona así:

1. **Crear suscripción**: El backend crea automáticamente un Payment Intent
2. **Client Secret**: El backend retorna un `client_secret` para Stripe Elements
3. **PaymentElement**: Stripe renderiza los métodos de pago disponibles
4. **Confirmación**: El usuario selecciona método y confirma el pago

```typescript
import { useCreateSubscription } from '@/features/subscription';
import { PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function SubscriptionCheckout({ plan, token }) {
  const { createSubscription, loading } = useCreateSubscription(token);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    async function init() {
      const sub = await createSubscription({ interval: plan.interval });
      if (sub) {
        setClientSecret(sub.client_secret);
      }
    }
    init();
  }, []);

  if (!clientSecret) return <div>Inicializando...</div>;

  const stripePromise = loadStripe(PUBLISHABLE_KEY);

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentElement />
      {/* Botón de confirmación */}
    </Elements>
  );
}
```

## Tipos

### CreateSubscriptionRequest
```typescript
interface CreateSubscriptionRequest {
  interval: 'week' | 'month' | 'year';
  payment_method_id?: string;  // Opcional si usas PaymentElement
}
```

### SubscriptionResponse
```typescript
interface SubscriptionResponse {
  subscription_id: string;
  stripe_subscription_id: string;
  status: string;
  interval: string;
  current_period_end: string;
  client_secret: string;         // Para inicializar Stripe Elements
  is_upgrade?: boolean;
  message?: string;
}
```

### SubscriptionStatusResponse
```typescript
interface SubscriptionStatusResponse {
  has_subscription: boolean;
  subscription?: {
    subscription_id: string;
    stripe_subscription_id: string;
    interval: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  };
}
```

## Endpoints del Backend

- `POST /teachers/subscription` - Crear suscripción (crea Payment Intent automáticamente)
- `GET /teachers/subscription/status` - Obtener estado de suscripción
- `POST /teachers/subscription/cancel` - Cancelar suscripción

## Notas

- **Payment Intents automáticos**: No necesitas crear payment intents manualmente, el backend lo hace al crear la suscripción
- **Client Secret**: El `client_secret` es necesario para inicializar Stripe Elements
- **PaymentElement**: Carga automáticamente métodos de pago guardados y opciones de pago
- **Backward compatibility**: El archivo `/src/services/subscription.ts` sigue funcionando pero está deprecated
