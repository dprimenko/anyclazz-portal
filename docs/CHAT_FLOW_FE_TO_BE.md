# Chat Flow: FE → BE — Abrir conversación con un Profesor

Este documento describe el flujo completo que sigue el frontend cuando un **estudiante** abre un chat con un **profesor**, para ayudar al backend a identificar dónde falla el proceso.

---

## Flujo de llamadas

```
Estudiante hace clic en el icono de chat en el listado de profesores
  → Navega a /messages/{teacherId}
  → MessagesPage monta y llama a useStreamChat
    → [1] POST /api/v1/chat/token          (obtener credenciales del estudiante)
    → client.connectUser({ id: studentId }, token)
  → useAutoOpenChannel detecta initialUserId={teacherId}
    → [2] POST /api/v1/chat/channels       (crear/obtener canal con el profesor)
  → ChatView se monta y renderiza ChatHeader
    → Lee otherMember.user.anyclazz_role desde el estado de Stream
    → Si anyclazz_role === 'teacher': muestra botones "Ver perfil" y "Reservar clase"
```

---

## Llamada 1 — `POST /api/v1/chat/token`

**Propósito:** Obtener las credenciales de Stream Chat para el usuario actual (el estudiante).

**Headers:**
```
Authorization: Bearer <keycloak_access_token_del_estudiante>
Content-Type: application/json
```

**Body:** `{}`

**Respuesta esperada:**
```json
{
  "token": "<stream_jwt_token>",
  "apiKey": "<stream_api_key>",
  "userId": "<keycloak_user_id_del_estudiante>"
}
```

**Lo que BE debe hacer aquí:**
1. Verificar el token de Keycloak.
2. Llamar a `serverClient.upsertUser()` para el estudiante con su rol:
   ```js
   await serverClient.upsertUser({
     id: keycloakUserId,
     name: user.name,
     image: user.avatar,
     anyclazz_role: 'student', // rol del usuario autenticado
   });
   ```
3. Generar y devolver el token de Stream: `serverClient.createUserToken(keycloakUserId)`.

---

## Llamada 2 — `POST /api/v1/chat/channels`

**Propósito:** Crear o recuperar el canal 1:1 entre el estudiante y el profesor.

**Headers:**
```
Authorization: Bearer <keycloak_access_token_del_estudiante>
Content-Type: application/json
```

**Body:**
```json
{
  "otherUserId": "<keycloak_user_id_del_profesor>",
  "otherUserRole": "teacher"
}
```

> `otherUserRole` fue añadido recientemente por FE para que BE pueda saber el rol del otro participante sin necesidad de consultarlo en Keycloak.

**Respuesta esperada:**
```json
{
  "channelType": "messaging",
  "channelId": "dm_<hash>",
  "cid": "messaging:dm_<hash>"
}
```

**Lo que BE debe hacer aquí — PUNTO CRÍTICO:**

Antes de crear/obtener el canal, BE debe hacer `upsertUser` del profesor en Stream usando el `otherUserRole` recibido:

```js
// Upsert del profesor en Stream con su rol correcto
await serverClient.upsertUser({
  id: otherUserId,           // ID del profesor en Keycloak
  anyclazz_role: otherUserRole, // 'teacher' — enviado por FE
  // name e image se pueden obtener de Keycloak o de la DB si están disponibles
});

// Crear o recuperar el canal
const channel = serverClient.channel('messaging', {
  members: [currentUserId, otherUserId],
});
await channel.create();
```

**Si este `upsertUser` no se ejecuta** (o se ejecuta sin `anyclazz_role`), Stream almacena al profesor sin ese campo, y cuando el frontend consulta los miembros del canal recibe `anyclazz_role: undefined`. Esto provoca que el ChatHeader lo trate como estudiante: no muestra el badge "Teacher", ni los botones de "Ver perfil" / "Reservar clase", y el botón de "Schedule lesson" no aparece.

---

## Dónde falla actualmente

| Síntoma en FE | Causa probable en BE |
|---|---|
| El otro usuario aparece como "Student" aunque sea profesor | `upsertUser` del profesor en Stream no incluye `anyclazz_role: 'teacher'` |
| No aparecen los botones "Ver perfil" y "Reservar clase" | Mismo motivo — `isTeacher` evalúa como `false` |
| El nombre/avatar aparece como UUID o vacío | `upsertUser` no está propagando `name` e `image` del profesor |

---

## Cómo verificarlo

Desde el **Stream Dashboard** (o con la API de administración de Stream), consultar el usuario con ID = `<keycloak_user_id_del_profesor>` y verificar que tenga:

```json
{
  "id": "<profesor_id>",
  "name": "...",
  "image": "...",
  "anyclazz_role": "teacher"
}
```

Si `anyclazz_role` no está presente o es `"student"`, el problema está confirmado en el `upsertUser` del backend.

---

## Resumen de campos custom en Stream

| Campo | Tipo | Quién lo setea | Dónde se usa en FE |
|---|---|---|---|
| `anyclazz_role` | `'teacher' \| 'student'` | BE en `upsertUser` | `ChatHeader` para mostrar rol, botones de reserva y enlace al perfil |
