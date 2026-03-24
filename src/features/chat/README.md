# Chat Feature

Sistema de mensajería 1:1 implementado con Stream Chat para AnyClazz Portal.

## Estructura

```
src/features/chat/
├── domain/
│   ├── types.ts           # Interfaces TypeScript
│   └── constants.ts       # Constantes de configuración
├── infrastructure/
│   ├── chatApi.ts         # Repository con FetchClient
│   └── streamClient.ts    # Cliente Stream Chat
├── components/
│   ├── MessagesPage.tsx   # Página principal de mensajes
│   ├── ConversationList/  # Lista de conversaciones
│   ├── ChatView/          # Vista de chat activa
│   ├── ChatNotificationBadge.tsx  # Badge de notificaciones
│   └── ChatWithTeacherButton.tsx  # Botón para iniciar chat
└── hooks/
    ├── useStreamChat.ts      # Hook de inicialización
    ├── useChatChannel.ts     # Hook de canal individual
    ├── useUnreadCount.ts     # Hook de contador de no leídos
    ├── useConversationList.ts # Hook de lista de conversaciones
    └── useAutoOpenChannel.ts  # Hook para deep linking
```

**Arquitectura:**
- Sigue el **Repository Pattern** del proyecto
- Usa **FetchClient** para llamadas HTTP centralizadas
- **No usa `fetch` directo** - todo va por el httpClient compartido

## Configuración

### Variables de entorno

Añade las siguientes variables en tu archivo `.env.local`:

```bash
# Stream Chat API Key (pública)
PUBLIC_STREAM_API_KEY=tu_api_key_de_stream_aqui

# URL del backend (debe incluir /api/v1 si es necesario)
PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Backend

El backend debe tener los siguientes endpoints implementados:

- `POST /chat/token` - Obtener token de Stream Chat
- `POST /chat/channels` - Crear/obtener canal 1:1

**Nota:** Las rutas se concatenan con `PUBLIC_API_URL`, resultando en:
- `http://localhost:8080/api/v1/chat/token`
- `http://localhost:8080/api/v1/chat/channels`

Ver documentación completa del backend en la guía de integración.

## Uso

### Página de mensajes

La aplicación ofrece dos rutas para acceder al chat:

1. **`/messages`** - Lista de conversaciones
2. **`/messages/{userId}`** - Abrir chat directamente con un usuario específico

```astro
---
// src/pages/messages/index.astro - Lista general
import { MessagesPage } from '@/features/chat';

const session = await getSession(Astro.request);
---

<MessagesPage
  client:load
  keycloakToken={session.accessToken}
  currentUserId={session.user.id}
  initialUserId={undefined}
/>
```

```astro
---
// src/pages/messages/[userId].astro - Chat directo
import { MessagesPage } from '@/features/chat';

const session = await getSession(Astro.request);
const { userId } = Astro.params;
---

<MessagesPage
  client:load
  keycloakToken={session.accessToken}
  currentUserId={session.user.id}
  initialUserId={userId}
/>
```

### Botón para chatear con profesor

**Opción 1: Navegación directa con link/botón (Recomendado)**

```tsx
// En TeacherCard o cualquier componente
function TeacherCard({ teacher }) {
  return (
    <button onClick={() => window.location.href = `/messages/${teacher.id}`}>
      Chatear con {teacher.name}
    </button>
  );
}
```

**Opción 2: Con componente ChatWithTeacherButton (para casos especiales)**

```tsx
import { ChatWithTeacherButton } from '@/features/chat';
import { useStreamChat } from '@/features/chat';

function TeacherCard({ teacher }) {
  const { client } = useStreamChat({ keycloakToken });

  const handleChannelReady = (channelId: string) => {
    // Navegar a /messages o abrir modal
    window.location.href = '/messages';
  };

  return (
    <ChatWithTeacherButton
      teacherId={teacher.id}
      teacherName={teacher.name}
      streamClient={client}
      keycloakToken={keycloakToken}
      onChannelReady={handleChannelReady}
    />
  );
}
```

### Badge de notificaciones en el menú

```tsx
import { ChatNotificationBadge } from '@/features/chat';
import { useStreamChat } from '@/features/chat';

function Navigation() {
  const { client } = useStreamChat({ keycloakToken });

  return (
    <nav>
      <a href="/messages">
        Mensajes
        <ChatNotificationBadge streamClient={client} />
      </a>
    </nav>
  );
}
```

## Características

- ✅ Chat 1:1 en tiempo real
- ✅ Historial de mensajes persistente
- ✅ Indicadores de lectura (read receipts)
- ✅ Contador de mensajes no leídos
- ✅ Estado online/offline de usuarios
- ✅ Búsqueda de conversaciones
- ✅ **URLs dinámicas** para deep linking (`/messages/{userId}`)
- ✅ Apertura automática de chat con usuario específico
- ✅ Responsive design
- ✅ Integración con sistema de autenticación

## Flujo de trabajo

1. Usuario se autentica en la aplicación
2. Al cargar componente de chat, se inicializa cliente Stream con token del backend
3. Usuario puede ver lista de conversaciones existentes
4. Usuario puede iniciar nueva conversación:
   - **Desde el perfil del profesor**: Click en botón "Chat" → navega a `/messages/{teacherId}`
   - **Desde cualquier link**: Acceso directo a `/messages/{userId}`
5. El componente detecta `initialUserId` y abre automáticamente ese chat
6. Mensajes se sincronizan en tiempo real
7. Notificaciones de no leídos se actualizan automáticamente

## Estilos

Los componentes usan CSS Modules y siguen el design system de la aplicación:

- Variables CSS del design system (`--color-*`, `--spacing-*`, etc.)
- Responsive approach mobile-first
- Estados hover, active, disabled
- Accesibilidad (ARIA labels, keyboard navigation)

## Notas de implementación

- Stream Chat SDK requiere `client:load` en Astro (no funciona en SSR)
- El token de Stream se genera en el backend por seguridad
- Los canales son idempotentes: crear múltiples veces devuelve el mismo canal
- El cliente se desconecta automáticamente al desmontar componente

## Próximas mejoras

- [ ] Typing indicators (indicadores de "está escribiendo...")
- [ ] Envío de archivos e imágenes
- [ ] Mensajes de voz
- [ ] Reacciones a mensajes
- [ ] Notificaciones push (fuera de la app)
- [ ] Chat grupal (cuando se requiera)
