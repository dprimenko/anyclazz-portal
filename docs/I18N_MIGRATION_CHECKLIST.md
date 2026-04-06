# Checklist de Migración i18n - Sistema de Cookies

## Objetivo
Asegurar que todos los componentes reciban el idioma desde Astro SSR para evitar el flash de inglés→español durante la hidratación.

## ✅ Patrón Correcto

### En páginas Astro
```astro
---
const lang = Astro.cookies.get('app_lang')?.value || 'en';
---

<MiComponente lang={lang} client:load />
```

### En componentes React
```tsx
interface MiComponenteProps {
    lang?: 'en' | 'es';
    // ... otras props
}

export function MiComponente({ lang, ...props }: MiComponenteProps) {
    const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });
    // ... resto del componente
}
```

## 📋 Componentes que Necesitan Actualización

### 🔴 ALTA PRIORIDAD - Componentes Visibles en Páginas Principales

#### Dashboard y Lecciones
- [x] `Dashboard.tsx` - ✅ Ya actualizado  
- [x] `LessonsTable.tsx` - ✅ Ya actualizado
- [x] `LessonItem.tsx` - ✅ Ya actualizado
- [x] `LessonItemCard.tsx` - ✅ Ya actualizado
- [x] `PaginatedLessons.tsx` - ✅ Ya actualizado
- [x] `LessonDetailsModal.tsx` - ✅ Ya actualizado
- [x] `LessonCancelModal.tsx` - ✅ Ya actualizado
- [x] `RateTutorModal.tsx` - ✅ Ya recibe lang

#### Teachers Section
- [ ] `TeachersList.tsx` - Necesita prop lang
- [ ] `TeacherItem.tsx` - Necesita prop lang
- [ ] `PriceRangeFilter.tsx` - Necesita prop lang

#### User Settings
- [x] `UserProfile.tsx` - ✅ Ya recibe lang
- [x] `MyDetails.tsx` - ✅ Ya recibe lang
- [x] `ChangePassword.tsx` - ✅ Ya recibe lang

### 🟡 MEDIA PRIORIDAD - Componentes Específicos

#### Onboarding
- [x] `OnboardingStep1.tsx` - ✅ Ya recibe lang
- [ ] `OnboardingStep2.tsx` - Verificar
- [x] `OnboardingStep3.tsx` - ✅ Ya recibe lang
- [x] `OnboardingStep4.tsx` - ✅ Ya recibe lang
- [ ] `OnboardingLayout.tsx` - Necesita prop lang
- [ ] `LanguageSelector.tsx` - Necesita prop lang

#### Teacher Availability & Modalities
- [ ] `AvailabilityAndModalitiesManager.tsx` - Necesita prop lang
- [ ] `WeeklyAvailabilitySelector.tsx` - Necesita prop lang
- [ ] `ClassModalitySelector.tsx` - Necesita prop lang

#### Bookings
- [ ] `BookingCreator.tsx` - Necesita prop lang
- [x] `WeeklyAgenda.tsx` - ✅ Ya recibe lang

#### Chat
- [ ] `MessagesPage.tsx` - Necesita prop lang
- [ ] `ConversationList.tsx` - Necesita prop lang
- [ ] `ConversationItem.tsx` - Necesita prop lang
- [ ] `ChatMessage.tsx` - Necesita prop lang
- [ ] `CustomEmptyStateIndicator.tsx` - Necesita prop lang

### 🟢 BAJA PRIORIDAD - Componentes UI Genéricos

- [ ] `ProgressIndicator.tsx` - Necesita prop lang
- [ ] `PageSelector.tsx` - Necesita prop lang

#### Stories/Feed
- [ ] `StoryView.tsx` - Necesita prop lang
- [ ] `ModalStory.tsx` - Necesita prop lang
- [ ] `VideoUploadModal.tsx` - Necesita prop lang
- [ ] `VideoUploadButton.tsx` - Necesita prop lang

#### Stripe/Payments
- [ ] `StripeConnectButton.tsx` - Necesita prop lang
- [x] `PaymentsDashboardSummary.tsx` - Verificar si ya recibe lang

#### Teacher Profile
- [ ] `SuperTutorMembership.tsx` - Necesita prop lang
- [ ] `LastLessonCard.tsx` - Necesita prop lang
- [ ] `TeacherVideosSection.tsx` - Necesita prop lang

## 📑 Páginas Astro que Necesitan Pasar lang

### Ya Actualizadas ✅
- [x] `dashboard.astro`
- [x] `teachers.astro`
- [x] `teacher/[id].astro`
- [x] `me/last-lessons.astro`
- [x] `me/upcoming-lessons.astro`
- [x] `me/saved-teachers.astro`
- [x] `me/my-agenda.astro`
- [x] `profile.astro`
- [x] `onboarding/quick-intro.astro`
- [x] `onboarding/profile-basics.astro`

### Necesitan Actualización 🔴
- [ ] `payments.astro` - Varios componentes sin lang
- [ ] `me/settings.astro` - UserProfile necesita lang
- [ ] `admin/teachers-approvals.astro` - Verificar componentes
- [ ] `booking/checkout/[id].astro` - Verificar componentes
- [ ] `me/clazzmate.astro` - Verificar componentes
- [ ] `onboarding/what-do-you-teach.astro` - OnboardingStep1 sin lang
- [ ] `onboarding/class-modality.astro` - OnboardingStep2 sin lang

## 🔧 Script de Actualización Rápida

Para actualizar un componente:

1. **Agregar prop lang a la interfaz:**
```tsx
interface Props {
    // ... props existentes
    lang?: 'en' | 'es';
}
```

2. **Actualizar useTranslations:**
```tsx
const t = useTranslations({ lang: lang as 'en' | 'es' | undefined });
```

3. **Pasar lang a componentes hijos que usen traducciones:**
```tsx
<ComponenteHijo lang={lang} otherProp={value} />
```

4. **En la página Astro, obtener y pasar lang:**
```astro
---
const lang = Astro.cookies.get('app_lang')?.value || 'en';
---
<Componente lang={lang} client:load />
```

## 🎯 Estrategia de Implementación

### Fase 1: Componentes de Alta Prioridad (1-2 días)
Actualizar componentes visibles en dashboard y páginas principales.

### Fase 2: Componentes de Media Prioridad (2-3 días)
Actualizar onboarding, settings, y funcionalidades específicas.

### Fase 3: Componentes de Baja Prioridad (1-2 días)
Actualizar componentes UI genéricos y funcionalidades secundarias.

### Fase 4: Testing y Verificación (1 día)
- Probar cambio de idioma en todas las páginas
- Verificar que no haya flash de inglés→español
- Confirmar que las cookies persisten correctamente

## ⚠️ Notas Importantes

1. **Componentes Modales**: Los modales que se abren desde componentes deben recibir `lang` como prop
2. **Componentes Anidados**: Verificar toda la cadena de componentes padres→hijos
3. **Lazy Loading**: Los componentes con `client:load` deben recibir `lang` explícitamente
4. **Backward Compatibility**: Mantener `lang` como opcional (`lang?: 'en' | 'es'`) para no romper componentes existentes

## 🧪 Testing

Después de cada actualización, verificar:
- [ ] No hay flash de contenido en inglés
- [ ] El cambio de idioma funciona correctamente
- [ ] Las cookies persisten después de recargar
- [ ] SSR y cliente renderizan el mismo contenido (sin errores de hidratación)
