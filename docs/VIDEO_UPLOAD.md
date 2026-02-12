# Video Upload Feature - Documentación

## Descripción General

Sistema completo de subida de videos para profesores en AnyClazz Portal. Los videos se suben directamente a Bunny.net desde el frontend, con soporte para:

- Upload de videos (MP4, MOV, AVI)
- Upload de imagen de portada (JPG, PNG)
- Descripción del video
- Validación de tamaño de archivo
- Barra de progreso en tiempo real
- Drag & drop

## Componentes Creados

### 1. Componentes Base (UI Library)

#### `/src/ui-library/shared/input.tsx`
Input de texto estilizado con shadcn/ui.

```tsx
import { Input } from '@/ui-library/shared/input';

<Input 
  type="text"
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

#### `/src/ui-library/shared/textarea.tsx`
Textarea estilizado con shadcn/ui.

```tsx
import { Textarea } from '@/ui-library/shared/textarea';

<Textarea 
  placeholder="Enter description..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
/>
```

#### `/src/ui-library/components/file-upload/FileUpload.tsx`
Componente de upload de archivos con drag & drop.

**Props:**
- `accept`: Tipos de archivos aceptados (MIME types)
- `maxSize`: Tamaño máximo en bytes
- `recommendedSize`: Texto informativo sobre el tamaño recomendado
- `onFileSelect`: Callback cuando se selecciona un archivo
- `label`: Texto del botón de upload
- `description`: Texto descriptivo
- `icon`: Icono a mostrar
- `className`: Clases CSS adicionales
- `disabled`: Deshabilitar el componente

```tsx
import { FileUpload } from '@/ui-library/components/file-upload';

<FileUpload
  accept="video/mp4,video/quicktime"
  maxSize={500 * 1024 * 1024} // 500MB
  recommendedSize=".mp4 (Recommended size: 1080 x 1920px)"
  onFileSelect={(file) => handleVideoSelect(file)}
  label="Click to upload"
  description="or drag and drop"
  icon="upload-cloud"
/>
```

### 2. Feature: Video Upload

#### `/src/features/stories/feed/hooks/useBunnyUpload.ts`
Hook personalizado para manejar la subida a Bunny.net.

**Opciones:**
```typescript
interface BunnyUploadOptions {
  libraryId: string;    // ID de la librería de Bunny.net
  apiKey: string;       // API Key de Bunny.net
  collectionId?: string; // ID de la colección (opcional)
}
```

**Returns:**
```typescript
{
  uploadVideo: (file: File, title: string, collectionId?: string) => Promise<BunnyUploadResult | null>,
  uploadImage: (file: File, videoId: string) => Promise<boolean>,
  isUploading: boolean,
  progress: { loaded: number, total: number, percentage: number },
  error: string | null
}
```

**Uso:**
```tsx
const { uploadVideo, uploadImage, isUploading, progress, error } = useBunnyUpload({
  libraryId: 'YOUR_LIBRARY_ID',
  apiKey: 'YOUR_API_KEY',
  collectionId: 'optional-collection-id'
});

// Subir video
const result = await uploadVideo(videoFile, 'My Video Title');
if (result) {
  console.log('Video URL:', result.videoUrl);
  console.log('Video ID:', result.videoId);
  
  // Subir thumbnail (opcional)
  await uploadImage(coverImage, result.videoId);
}
```

#### `/src/features/stories/feed/components/video-upload-modal/VideoUploadModal.tsx`
Modal completo para subir videos con preview y validación.

**Props:**
```typescript
interface VideoUploadModalProps {
  onClose: () => void;
  onSuccess?: (videoData: {
    videoId: string;
    videoUrl: string;
    description: string;
    thumbnailUrl?: string;
  }) => void;
  bunnyConfig: {
    libraryId: string;
    apiKey: string;
    collectionId?: string;
  };
}
```

**Uso:**
```tsx
import { VideoUploadModal } from '@/features/stories/feed/components/video-upload-modal';

const [showModal, setShowModal] = useState(false);

<VideoUploadModal
  onClose={() => setShowModal(false)}
  onSuccess={(videoData) => {
    console.log('Video uploaded:', videoData);
    // Guardar en tu backend/estado
  }}
  bunnyConfig={{
    libraryId: process.env.BUNNY_LIBRARY_ID,
    apiKey: process.env.BUNNY_API_KEY,
  }}
/>
```

#### `/src/features/stories/feed/components/video-upload-button/VideoUploadButton.tsx`
Botón que abre el modal de subida de video.

**Uso:**
```tsx
import { VideoUploadButton } from '@/features/stories/feed/components/video-upload-button';

<VideoUploadButton
  bunnyConfig={{
    libraryId: 'YOUR_LIBRARY_ID',
    apiKey: 'YOUR_API_KEY',
  }}
  onVideoUploaded={(videoData) => {
    console.log('Video uploaded:', videoData);
    // Actualizar lista de videos, etc.
  }}
/>
```

## Integración en el Dashboard del Profesor

### Opción 1: Botón directo

```tsx
// En /src/features/teachers/dashboard/Dashboard.tsx o similar

import { VideoUploadButton } from '@/features/stories/feed/components';

export const TeacherDashboard = () => {
  const handleVideoUploaded = async (videoData) => {
    // Guardar en tu backend
    await fetch('/api/teacher/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoData)
    });
    
    // Refrescar lista de videos
    fetchVideos();
  };

  return (
    <div>
      <h1>My Videos</h1>
      <VideoUploadButton
        bunnyConfig={{
          libraryId: import.meta.env.BUNNY_LIBRARY_ID,
          apiKey: import.meta.env.BUNNY_API_KEY,
        }}
        onVideoUploaded={handleVideoUploaded}
      />
      {/* Lista de videos existentes */}
    </div>
  );
};
```

### Opción 2: Modal controlado manualmente

```tsx
import { VideoUploadModal } from '@/features/stories/feed/components';
import { Button } from '@/ui-library/shared/button';
import { Icon } from '@/ui-library/components/ssr/icon/Icon';

export const TeacherProfile = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowUploadModal(true)}>
        <Icon icon="upload-cloud" iconWidth={20} iconHeight={20} />
        Upload Video
      </Button>

      {showUploadModal && (
        <VideoUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={(videoData) => {
            // Manejar éxito
            console.log('Video uploaded:', videoData);
            setShowUploadModal(false);
          }}
          bunnyConfig={{
            libraryId: import.meta.env.BUNNY_LIBRARY_ID,
            apiKey: import.meta.env.BUNNY_API_KEY,
          }}
        />
      )}
    </div>
  );
};
```

## Variables de Entorno

Añadir en `.env`:

```bash
# Bunny.net Configuration
BUNNY_LIBRARY_ID=your-library-id
BUNNY_API_KEY=your-api-key
BUNNY_COLLECTION_ID=optional-collection-id
```

## Iconos Añadidos

Se crearon los siguientes iconos SVG en `/src/assets/images/icons/`:

- `upload-cloud.svg` - Icono de subida de archivos
- `trash.svg` - Icono de eliminar
- `image.svg` - Icono de imagen
- `x.svg` - Icono de cerrar
- `alert-circle.svg` - Icono de alerta/error

## Traducciones (i18n)

Se añadieron las siguientes claves de traducción en español e inglés:

- `video.upload.title`
- `video.upload.subtitle`
- `video.upload.description_label`
- `video.upload.description_placeholder`
- `video.upload.cover_label`
- `video.upload.upload_video`
- `video.upload.drag_drop`
- `video.upload.video_format`
- `video.upload.image_format`
- `video.upload.publish`
- `video.upload.publishing`
- `video.upload.remove_video`
- `video.upload.remove_image`
- `video.upload.uploading`
- `video.upload.error`
- `video.upload.max_size_error`
- `video.upload_new`

## API Backend (Sugerencia)

Para guardar la información del video en tu backend, crear endpoint:

```typescript
// /src/pages/api/teacher/videos.ts
import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await request.json();
  const { videoId, videoUrl, description, thumbnailUrl } = data;

  // Guardar en base de datos
  // await db.insert('teacher_videos', {
  //   teacher_id: session.user.id,
  //   video_id: videoId,
  //   video_url: videoUrl,
  //   description,
  //   thumbnail_url: thumbnailUrl,
  //   created_at: new Date()
  // });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

## Flujo de Subida

1. Usuario hace click en "Upload new video"
2. Se abre el modal `VideoUploadModal`
3. Usuario selecciona archivo de video (drag & drop o click)
4. Se muestra preview del video
5. Usuario añade descripción (requerido)
6. Usuario opcionalmente añade imagen de portada
7. Usuario hace click en "Publish video"
8. Hook `useBunnyUpload` sube el video a Bunny.net
9. Se muestra barra de progreso
10. Si hay cover image, se sube también
11. Se ejecuta callback `onSuccess` con los datos del video
12. Se cierra el modal
13. La aplicación guarda los datos en el backend

## Personalización

### Cambiar tamaños máximos

```tsx
// En VideoUploadModal.tsx
const MAX_VIDEO_SIZE = 1000 * 1024 * 1024; // 1GB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
```

### Añadir campos adicionales

Puedes extender el modal para incluir más campos como tags, categoría, etc:

```tsx
const [tags, setTags] = useState<string[]>([]);
const [category, setCategory] = useState('');

// ... en el JSX
<div className={styles.field}>
  <Label htmlFor="category">Category</Label>
  <Select value={category} onValueChange={setCategory}>
    {/* Opciones */}
  </Select>
</div>
```

## Notas Importantes

1. **Seguridad**: Las API keys de Bunny.net NO deben exponerse en el frontend en producción. Considera crear un endpoint en tu backend que haga de proxy.

2. **Límites de tamaño**: 500MB es el límite por defecto para videos. Ajusta según tus necesidades.

3. **Formatos soportados**: MP4, MOV, AVI. Bunny.net procesa automáticamente los videos.

4. **Mobile**: El componente está optimizado para mobile con bottom sheet en dispositivos móviles.

5. **Accesibilidad**: Todos los componentes incluyen labels apropiados y son accesibles por teclado.

## Próximos Pasos

- [ ] Crear página de gestión de videos del profesor
- [ ] Implementar reproductor de videos en el feed
- [ ] Añadir sistema de likes y comentarios
- [ ] Implementar analytics de visualizaciones
- [ ] Añadir capacidad de editar/eliminar videos

## Soporte

Para problemas o preguntas sobre la integración de Bunny.net, consulta la [documentación oficial](https://docs.bunny.net/).
