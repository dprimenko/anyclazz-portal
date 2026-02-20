# ProgressIndicator

Componente de indicador de carga (spinner) con mensaje opcional.

## Uso Básico

```tsx
import { ProgressIndicator } from '@/ui-library/components/progress-indicator';

// Simple - Centrado con mensaje "Loading..."
<ProgressIndicator />

// Con mensaje personalizado
<ProgressIndicator message="Cargando datos..." />

// Sin mensaje
<ProgressIndicator showMessage={false} />

// Diferentes tamaños
<ProgressIndicator size="sm" />
<ProgressIndicator size="default" />
<ProgressIndicator size="lg" />
<ProgressIndicator size="xl" />

// Sin centrar (inline)
<ProgressIndicator centered={false} />

// Variantes de color
<ProgressIndicator variant="default" />     // Primary color
<ProgressIndicator variant="secondary" />   // Secondary color
<ProgressIndicator variant="muted" />       // Muted color
<ProgressIndicator variant="white" />       // White (para fondos oscuros)
```

## Ejemplo en Páginas

```tsx
// Loading de página completa
function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ProgressIndicator size="xl" message="Cargando..." />
    </div>
  );
}

// Loading inline en componentes
function DataList() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <ProgressIndicator />;
  }
  
  return <div>...</div>;
}

// Loading sin centrar
function SmallLoader() {
  return (
    <div className="p-4">
      <ProgressIndicator 
        size="sm" 
        centered={false}
        message="Procesando..."
      />
    </div>
  );
}
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl'` | `'lg'` | Tamaño del spinner |
| `message` | `string` | `'Loading...'` | Mensaje a mostrar |
| `showMessage` | `boolean` | `true` | Si mostrar el mensaje |
| `variant` | `'default' \| 'secondary' \| 'muted' \| 'white'` | `'default'` | Variante de color |
| `centered` | `boolean` | `true` | Si centrar el indicador verticalmente |
| `className` | `string` | - | Clases CSS adicionales |

## Componente Base: Spinner

También puedes usar el componente `Spinner` directamente desde `@/ui-library/shared/spinner`:

```tsx
import { Spinner } from '@/ui-library/shared/spinner';

<Spinner size="default" variant="default" />
```
