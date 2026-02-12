# Bunny.net - Subida Segura de Videos

## ⚠️ Problema de Seguridad

**NUNCA expongas las API keys de Bunny.net en el frontend.** Las API keys deben mantenerse secretas en el servidor.

## ✅ Solución Implementada: Proxy Backend

La solución es crear endpoints en tu backend que actúen como proxy entre el frontend y Bunny.net.

### Arquitectura

```
Frontend (React)
    ↓
    ↓ (sin API keys)
    ↓
Backend Endpoints (Astro API Routes)
    ↓
    ↓ (con API keys desde env variables)
    ↓
Bunny.net API
```

## Endpoints Creados

### 1. `/api/bunny/create-video` (POST)

Crea un nuevo video en Bunny.net.

**Request:**
```json
{
  "title": "My Video Title",
  "collectionId": "optional-collection-id"
}
```

**Response:**
```json
{
  "videoId": "generated-video-id",
  "libraryId": "your-library-id"
}
```

**Seguridad:**
- ✅ Valida sesión de usuario
- ✅ Solo permite profesores
- ✅ API keys solo en el servidor

### 2. `/api/bunny/upload-video` (PUT)

Sube el archivo de video a Bunny.net.

**Request:**
- Query param: `videoId`
- Body: Binary video file (ArrayBuffer)

**Response:**
```json
{
  "success": true
}
```

**Características:**
- ✅ Soporta archivos grandes
- ✅ Valida autenticación
- ✅ API keys protegidas

### 3. `/api/bunny/upload-thumbnail` (POST)

Sube la imagen de portada del video.

**Request:**
- FormData con:
  - `videoId`: ID del video
  - `thumbnail`: Archivo de imagen

**Response:**
```json
{
  "success": true
}
```

## Variables de Entorno

Añadir en `.env`:

```bash
# Bunny.net Configuration (SERVIDOR - NO EXPONER)
BUNNY_LIBRARY_ID=your-library-id
BUNNY_API_KEY=your-api-key
BUNNY_COLLECTION_ID=optional-collection-id
```

**IMPORTANTE:** Estas variables solo están disponibles en el servidor, nunca se exponen al cliente.

## Cambios en el Frontend

### Hook Actualizado: `useBunnyUpload`

Ya no requiere configuración de Bunny.net:

```tsx
// ANTES (INSEGURO ❌)
const { uploadVideo } = useBunnyUpload({
  libraryId: 'EXPOSED_LIBRARY_ID',
  apiKey: 'EXPOSED_API_KEY', // ❌ NUNCA hacer esto
});

// AHORA (SEGURO ✅)
const { uploadVideo } = useBunnyUpload();
```

### Componentes Actualizados

Todos los componentes ya no requieren `bunnyConfig`:

```tsx
// VideoUploadButton
<VideoUploadButton
  onVideoUploaded={(videoData) => {
    // Manejar éxito
  }}
/>

// VideoUploadModal
<VideoUploadModal
  onClose={() => setShowModal(false)}
  onSuccess={(videoData) => {
    // Manejar éxito
  }}
/>

// TeacherVideosSection
<TeacherVideosSection
  teacherId={teacher.id}
  accessToken={session.accessToken}
/>
```

## Flujo de Subida Seguro

1. **Usuario hace click en "Upload video"**
   - Frontend: No tiene acceso a API keys ✅

2. **Frontend llama a `/api/bunny/create-video`**
   - Backend valida sesión
   - Backend crea video en Bunny.net usando API key del servidor
   - Retorna videoId al frontend

3. **Frontend sube el archivo a `/api/bunny/upload-video`**
   - Backend valida sesión
   - Backend hace proxy del archivo a Bunny.net
   - Progreso se trackea en el frontend

4. **Frontend sube thumbnail (opcional) a `/api/bunny/upload-thumbnail`**
   - Backend valida sesión
   - Backend hace proxy de la imagen a Bunny.net

5. **Frontend guarda metadata en `/api/teacher/videos`**
   - Se guarda en tu base de datos

## Ventajas de esta Arquitectura

### 🔒 Seguridad
- ✅ API keys nunca expuestas al frontend
- ✅ Validación de autenticación en cada request
- ✅ Solo profesores autenticados pueden subir videos
- ✅ Rate limiting posible en el backend

### 🎯 Control
- ✅ Puedes añadir validación adicional (tamaño, formato, etc.)
- ✅ Puedes limitar número de uploads por usuario
- ✅ Puedes añadir logging de uploads
- ✅ Puedes implementar cuotas

### 📊 Monitoreo
- ✅ Logs centralizados en el servidor
- ✅ Tracking de errores
- ✅ Analytics de uso

## Validaciones Adicionales (Opcional)

Puedes añadir más validaciones en el backend:

```typescript
// En /api/bunny/upload-video.ts

// Validar tamaño
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
if (videoFile.byteLength > MAX_VIDEO_SIZE) {
  return new Response(JSON.stringify({ 
    error: 'Video too large' 
  }), { status: 413 });
}

// Limitar uploads por día
const uploadsToday = await db.query(
  'SELECT COUNT(*) FROM teacher_videos WHERE teacher_id = $1 AND created_at > NOW() - INTERVAL 1 DAY',
  [session.user.id]
);

if (uploadsToday.rows[0].count >= 10) {
  return new Response(JSON.stringify({ 
    error: 'Upload limit reached' 
  }), { status: 429 });
}
```

## Rate Limiting

Considera implementar rate limiting:

```typescript
import rateLimit from 'express-rate-limit';

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 uploads por ventana
  message: 'Too many uploads, please try again later'
});
```

## CORS

Si usas un dominio diferente para el backend, configura CORS:

```typescript
// astro.config.mjs
export default defineConfig({
  server: {
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': 'https://your-frontend-domain.com',
    }
  }
});
```

## Monitoreo de Errores

Añade logging para monitorear problemas:

```typescript
// En cada endpoint
try {
  // ... código
} catch (error) {
  // Log a servicio de monitoreo (Sentry, etc.)
  console.error('[Bunny Upload Error]', {
    userId: session.user.id,
    error: error.message,
    timestamp: new Date().toISOString()
  });
  
  // Retornar error genérico al cliente
  return new Response(JSON.stringify({ 
    error: 'Upload failed' 
  }), { status: 500 });
}
```

## Testing

Para testear los endpoints:

```bash
# Crear video
curl -X POST http://localhost:4321/api/bunny/create-video \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{"title":"Test Video"}'

# Subir video
curl -X PUT "http://localhost:4321/api/bunny/upload-video?videoId=VIDEO_ID" \
  -H "Cookie: your-session-cookie" \
  --data-binary "@video.mp4"

# Subir thumbnail
curl -X POST http://localhost:4321/api/bunny/upload-thumbnail \
  -H "Cookie: your-session-cookie" \
  -F "videoId=VIDEO_ID" \
  -F "thumbnail=@thumbnail.jpg"
```

## Migración desde Versión Anterior

Si ya tenías implementada la versión insegura:

1. ✅ Añadir variables de entorno en `.env`
2. ✅ Los componentes ya están actualizados
3. ✅ Eliminar cualquier referencia a `bunnyConfig` en tu código
4. ✅ Deployar los nuevos endpoints

## Checklist de Seguridad

- [ ] Variables de entorno configuradas en el servidor
- [ ] `.env` en `.gitignore`
- [ ] No hay API keys hardcodeadas en el código
- [ ] Endpoints validan autenticación
- [ ] Solo profesores pueden subir videos
- [ ] Rate limiting implementado (opcional pero recomendado)
- [ ] Logging de errores configurado
- [ ] CORS configurado correctamente
- [ ] Validación de tamaño de archivos
- [ ] Validación de tipos de archivos

---

**✅ Con esta implementación, tus API keys están seguras y nunca se exponen al frontend.**
