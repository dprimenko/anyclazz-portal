# Teachers Approvals Feature

Sistema de aprobación y rechazo de profesores para administradores.

## Ubicación

- **Página**: `/admin/teachers-approvals`
- **Feature**: `src/features/teachers/approvals/`

## Estructura de Archivos

```
src/features/teachers/approvals/
├── domain/
│   └── types.ts                    # Tipos e interfaces de dominio
├── infrastructure/
│   ├── ApiTeacherApprovalRepository.ts  # Repositorio API
│   └── types.ts                    # Tipos de API
├── components/
│   ├── TeacherApprovalsTable.tsx   # Tabla de profesores
│   ├── TeacherApprovalsTable.module.css
│   ├── PaginatedTeacherApprovals.tsx    # Componente principal
│   └── PaginatedTeacherApprovals.module.css
└── index.ts                        # Exports principales
```

## Funcionalidades

### 1. Filtros (Radio Buttons)
- **Show Pending** (por defecto): Muestra profesores pendientes de aprobación
- **Show Rejected**: Muestra profesores rechazados
- Al cambiar el filtro, se reinicia la paginación a la página 1

### 2. Búsqueda
- Input con debounce de 500ms
- Búsqueda por nombre, email o apellido
- Botón "Search" para forzar búsqueda inmediata

### 3. Tabla Responsive
#### Vista Desktop
- 5 columnas: Teacher | Registered At | Location | Teaches | Actions
- Grid layout con hover effects
- Botones de acción organizados por prioridad

#### Vista Mobile
- Cards expandibles
- Información organizada en filas
- Botones apilados verticalmente

### 4. Acciones
- **Approve** (botón verde con check): Aprueba al profesor (estado → `confirmed`)
- **Reject** (botón rojo con X): Rechaza al profesor (estado → `rejected`)
- **View User** (ícono ojo): Redirige al perfil del profesor
- **Chat** (ícono mensaje): Abre chat con el profesor

### 5. Paginación
- 10 items por página (constante `ITEMS_PER_PAGE`)
- Componente PageSelector reutilizable
- Se oculta si solo hay 1 página

### 6. Estados
- **Loading**: Spinner centrado mientras carga
- **Empty**: Mensaje personalizado según el filtro activo
- **Error**: Console.error + alert (TODO: mejorar con sistema de notificaciones)

## Endpoints del API

Base URL: `/api/v1/admin/teachers`

### `GET /api/v1/admin/teachers`
**Query params (todos requeridos por backend):**
- `page`: número de página (1-indexed, mín: 1)
- `size`: cantidad de items por página (1-100)
- `statuses` (opcional): estados separados por coma. Default: `'pending'`
  - Valores posibles: `'pending'`, `'confirmed'`, `'rejected'`
  - Ejemplos: `'pending'`, `'rejected'`, `'pending,rejected'`
- `query` (opcional): búsqueda por nombre o apellido

**Ejemplos:**
```http
# Profesores pendientes (filtro por defecto)
GET /api/v1/admin/teachers?page=1&size=10

# Solo rechazados
GET /api/v1/admin/teachers?page=1&size=10&statuses=rejected

# Pendientes + rechazados
GET /api/v1/admin/teachers?page=1&size=10&statuses=pending,rejected

# Búsqueda
GET /api/v1/admin/teachers?page=1&size=10&statuses=pending&query=valentina
```

**Response:**
```json
{
  "teachers": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440004",
      "email": "valentina.harper@anyclazz.com",
      "name": "Valentina",
      "surname": "Harper",
      "avatar": "https://...",
      "portraitImage": null,
      "isSuperTeacher": false,
      "superTutorTo": null,
      "shortPresentation": "Hello! My name is Valentina Harper...",
      "videoPresentation": "https://...",
      "videoPresentationStatus": "ready",
      "about": "<p>...</p>",
      "academicBackground": "<ul>...</ul>",
      "certifications": "<ul>...</ul>",
      "skills": "<ul>...</ul>",
      "timezone": "America/New_York",
      "beganTeachingAt": "2015-09-10T10:26:34+00:00",
      "createdAt": "2025-10-07T10:26:34+00:00",
      "status": "pending",
      "statusUpdatedAt": "2026-02-07 10:26:34",
      "studentLevel": {
        "id": "01JHTV00-LVLS-0000-0000-000000000002",
        "name": { "en": "High School", "es": "Secundaria" }
      },
      "subject": {
        "id": "01JHTV00-SUBJ-CAT1-0013-000000000013",
        "name": { "es": "Física", "en": "Physics" }
      },
      "subjectCategory": {
        "id": "01JHTV00-0000-0000-0000-000000000001",
        "name": { "es": "Educación Académica", "en": "Academic Education" },
        "slug": "academic-education"
      },
      "classTypes": [
        {
          "type": "online_single",
          "durations": [
            { "duration": 60, "price": { "price": 20, "currencyCode": "EUR" } }
          ]
        }
      ],
      "speaksLanguages": [
        { "id": "lang-001", "name": "English", "code": "en" }
      ],
      "teacherAddress": {
        "country": "US",
        "city": "New York"
      },
      "reviewsNumber": 0,
      "averageRating": 0.0,
      "studentsNumber": 0,
      "lessonsNumber": 0,
      "savedAt": null
    }
  ],
  "meta": {
    "currentPage": 1,
    "lastPage": 3,
    "size": 10,
    "total": 25
  }
}
```

### `PUT /api/v1/admin/teachers/{teacherId}/approve`
Aprueba un profesor (cambia estado a `confirmed`).

**Response 200 OK:**
Devuelve el objeto completo del profesor actualizado.

**Errores:**
- `401`: Token ausente o inválido
- `403`: Usuario no tiene rol admin
- `404`: Profesor no encontrado

### `PUT /api/v1/admin/teachers/{teacherId}/reject`
Rechaza un profesor (cambia estado a `rejected`).

**Response 200 OK:**
Devuelve el objeto completo del profesor actualizado.

**Errores:**
- `401`: Token ausente o inválido
- `403`: Usuario no tiene rol admin
- `404`: Profesor no encontrado

## Estados de Profesor

| Estado | Descripción |
|--------|-------------|
| `pending` | Recién registrado, pendiente de revisión |
| `confirmed` | Aprobado — visible para estudiantes |
| `rejected` | Rechazado — no visible para estudiantes |

## Tipos de Dominio

```typescript
export type TeacherApprovalStatus = 'pending' | 'confirmed' | 'rejected';
export type TeacherApprovalFilter = 'pending' | 'rejected' | 'confirmed';

export interface TeacherApproval {
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string | null;
    createdAt: string;
    status: TeacherApprovalStatus | null;
    statusUpdatedAt: string | null;
    location?: {
        country?: string;
        city?: string;
    };
    teachesLanguages?: string[];
}

export interface ListTeacherApprovalsParams extends CommonParams {
    page: number;
    size: number;
    query?: string;
    statuses?: TeacherApprovalFilter[];  // Array de estados
}
```

## Seguridad

La página valida que el usuario tenga rol `admin`:

```typescript
const user = await authRepository.getCurrentUser(session);

if (user?.role !== 'admin') {
    return Astro.redirect('/dashboard');
}
```

## Traducciones

Clave utilizada:
- `menu.teachers-approvals`: "Teacher Approvals" (EN) / "Aprobaciones de profesores" (ES)

## Flujo de Usuario

```
1. Montar componente
   └─ GET /api/v1/admin/teachers?page=1&size=10&statuses=pending
       └─ Render tabla con profesores pendientes

2. Usuario activa "Show Rejected"
   └─ GET /api/v1/admin/teachers?page=1&size=10&statuses=rejected
       └─ Re-render tabla

3. Usuario escribe en el buscador
   └─ GET /api/v1/admin/teachers?page=1&size=10&statuses=pending&query=valentina

4. Usuario pulsa "Approve"
   └─ PUT /api/v1/admin/teachers/{id}/approve
       └─ 200 OK → recargar lista actual
       └─ Error → mostrar alert con mensaje

5. Usuario pulsa "Reject"
   └─ PUT /api/v1/admin/teachers/{id}/reject
       └─ 200 OK → recargar lista actual

6. Paginación
   └─ GET /api/v1/admin/teachers?page={n}&size=10&statuses=...
```

## Mejoras Futuras (TODO)

1. **Sistema de notificaciones**: Reemplazar `console.error` y `alert` por toast/notification system
2. **Confirmación de acciones**: Modal de confirmación antes de aprobar/rechazar
3. **Detalles del profesor**: Modal o drawer con información completa antes de aprobar
4. **Filtros múltiples**: Checkbox para ver pending + rejected simultáneamente
5. **Bulk actions**: Aprobar/rechazar múltiples profesores a la vez
6. **Historial**: Auditoría de quién aprobó/rechazó y cuándo
7. **Razón de rechazo**: Campo de texto para especificar motivo
8. **Optimistic updates**: Actualizar UI antes de confirmar con servidor

## Notas de Implementación

- Se basa en la estructura de `saved-teachers` para consistencia
- Usa componentes UI de `@/ui-library/` (Button, Input, RadioGroup, etc.)
- Formato de fechas con Luxon
- CSS Modules para estilos aislados
- Backend devuelve objetos completos del profesor en todas las respuestas
- `statuses` es un query param que acepta múltiples valores separados por coma
