# Guía de Despliegue en Dokploy - Anyclazz Portal

Esta guía te ayudará a desplegar el portal Anyclazz en Dokploy paso a paso.

## 📋 Requisitos Previos

1. Una cuenta en Dokploy con acceso a un servidor
2. Un repositorio Git con el código del proyecto
3. Acceso a tu servidor Keycloak (para autenticación)
4. Acceso a tu API backend

## 🚀 Pasos de Despliegue

### 1. Preparar el Proyecto

El proyecto ya está configurado con:
- ✅ Dockerfile optimizado para producción
- ✅ .dockerignore para excluir archivos innecesarios
- ✅ Configuración de Astro con adaptador Node.js
- ✅ Variables de entorno documentadas

### 2. Generar AUTH_SECRET

Antes de desplegar, necesitas generar un `AUTH_SECRET` único:

```bash
# En tu terminal local:
openssl rand -base64 32
```

Guarda este valor, lo necesitarás para configurar las variables de entorno.

### 3. Configurar Variables de Entorno en Dokploy

En el panel de Dokploy, configura las siguientes variables de entorno **tanto para Build como para Runtime**:

#### ⚠️ IMPORTANTE: Configurar en BUILD TIME y RUNTIME

Las variables deben estar disponibles en ambas fases:
1. **Build Variables** (Build-time environment variables)
2. **Environment Variables** (Runtime environment variables)

#### Variables Requeridas:

```env
# API Configuration
API_URL=https://api.tudominio.com/api/v1
PUBLIC_API_URL=https://api.tudominio.com/api/v1

# Keycloak Configuration
KEYCLOAK_ISSUER=https://keycloak.tudominio.com/realms/anyclazz
KEYCLOAK_CLIENT_ID=anyclazz-app
KEYCLOAK_CLIENT_SECRET=tu-client-secret-de-keycloak

# Auth Secret (generado en el paso 2)
AUTH_SECRET=el-secret-generado-con-openssl

# Server Configuration
HOST=0.0.0.0
PORT=4321
NODE_ENV=production
```

#### 📝 Cómo configurar en Dokploy:

1. **Build Variables (Build-time):**
   - Ve a la sección "Build" o "Advanced" en tu aplicación
   - Busca "Build Arguments" o "Build-time Environment Variables"
   - Agrega todas las variables listadas arriba

2. **Environment Variables (Runtime):**
   - Ve a la sección "Environment" o "Environment Variables"
   - Agrega las mismas variables

💡 **Tip:** Copia y pega las mismas variables en ambas secciones.

#### ⚠️ Importante:
- Reemplaza `tudominio.com` con tu dominio real
- Usa HTTPS en producción para todas las URLs
- El `KEYCLOAK_CLIENT_SECRET` debe coincidir con el configurado en Keycloak
- El `AUTH_SECRET` debe ser único y seguro

### 4. Crear Nueva Aplicación en Dokploy

1. **Accede a tu panel de Dokploy**
2. **Crea una nueva aplicación:**
   - Click en "New Application" o "Create Application"
   - Tipo: **Docker** (usaremos el Dockerfile del proyecto)
   - Nombre: `anyclazz-portal` (o el nombre que prefieras)

3. **Configura el repositorio:**
   - Conecta tu repositorio Git (GitHub, GitLab, etc.)
   - Branch: `main` (o tu branch principal)
   - Build Context: `/` (raíz del proyecto)
   - Dockerfile Path: `./Dockerfile`

4. **Configura el puerto:**
   - Puerto del contenedor: `4321`
   - Puerto público: El que asigne Dokploy o personalízalo

5. **Agrega las variables de entorno:**
   - Copia las variables del paso 3
   - Pégalas en la sección de "Environment Variables" de Dokploy

### 5. Configurar Dominio (Opcional pero Recomendado)

1. En la configuración de la aplicación, ve a la sección de "Domains"
2. Agrega tu dominio personalizado (ej: `portal.anyclazz.com`)
3. Dokploy configurará automáticamente:
   - Proxy inverso
   - Certificado SSL/TLS (Let's Encrypt)

### 6. Desplegar

1. Guarda la configuración
2. Click en **"Deploy"** o **"Build & Deploy"**
3. Dokploy:
   - Clonará tu repositorio
   - Construirá la imagen Docker
   - Iniciará el contenedor
   - Configurará el proxy y SSL

4. **Monitorea el proceso:**
   - Revisa los logs en tiempo real en Dokploy
   - Verifica que no haya errores de build

### 7. Configurar Keycloak

#### Actualizar URLs Válidas en Keycloak:

1. Accede a tu consola de Keycloak Admin
2. Ve a: `Realm Settings` → `anyclazz` → `Clients` → `anyclazz-app`
3. Actualiza:
   - **Valid Redirect URIs:** 
     - `https://tudominio.com/*`
     - `https://tudominio.com/api/auth/callback/keycloak`
   - **Valid Post Logout Redirect URIs:**
     - `https://tudominio.com/*`
   - **Web Origins:**
     - `https://tudominio.com`

4. Guarda los cambios

### 8. Verificar el Despliegue

1. **Accede a tu aplicación:**
   ```
   https://tudominio.com
   ```

2. **Verifica que funcione:**
   - ✅ La página principal carga
   - ✅ El login redirige a Keycloak
   - ✅ Puedes autenticarte
   - ✅ Las rutas protegidas funcionan
   - ✅ Las llamadas a la API funcionan

3. **Revisa los logs en Dokploy:**
   - No debe haber errores críticos
   - El servidor debe estar escuchando en el puerto 4321

## 🔧 Troubleshooting

### Error: "AUTH_SECRET is not defined"
**Solución:** Verifica que la variable `AUTH_SECRET` esté configurada en Dokploy.

### Error de conexión con Keycloak
**Solución:** 
- Verifica que `KEYCLOAK_ISSUER` use HTTPS y sea accesible públicamente
- Confirma que las URLs de redirección estén correctamente configuradas en Keycloak

### Error 404 en rutas
**Solución:** Verifica que el adaptador Node.js esté configurado correctamente en `astro.config.mjs`.

### Error de CORS
**Solución:** 
- Verifica que tu API backend permita el dominio del portal
- Configura los headers CORS apropiados en el backend

## 🔄 Actualizaciones

Para desplegar nuevas versiones:

1. Haz push de tus cambios al repositorio Git
2. En Dokploy, click en **"Redeploy"**
3. Dokploy automáticamente:
   - Detectará los cambios
   - Reconstruirá la imagen
   - Reiniciará el contenedor sin downtime

## 📊 Monitoreo

En Dokploy puedes:
- Ver logs en tiempo real
- Monitorear uso de recursos (CPU, RAM)
- Configurar alertas
- Ver métricas de la aplicación

## 🔐 Seguridad en Producción

✅ **Checklist de Seguridad:**
- [ ] Usar HTTPS para todas las conexiones
- [ ] `AUTH_SECRET` único y seguro (min. 32 caracteres)
- [ ] Variables de entorno no están en el código
- [ ] Keycloak configurado con URLs válidas únicamente
- [ ] Contenedor corre como usuario no-root (ya configurado en Dockerfile)
- [ ] Firewall configurado apropiadamente
- [ ] Backups automáticos configurados

## 🌐 Arquitectura de Producción

```
Internet
   ↓
Dokploy (Proxy + SSL)
   ↓
Docker Container (Anyclazz Portal:4321)
   ↓
   ├→ Keycloak (Autenticación)
   └→ API Backend (Datos)
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Dokploy
2. Verifica la configuración de variables de entorno
3. Confirma que Keycloak esté accesible
4. Verifica que el backend API esté respondiendo

---

## 📝 Notas Adicionales

### Optimizaciones Aplicadas:
- Build multi-stage en Docker para imagen más pequeña
- Usuario no-root para mayor seguridad
- Modo standalone de Node.js para mejor rendimiento
- Alpine Linux para reducir tamaño de imagen

### Escalabilidad:
Si necesitas escalar la aplicación:
- Dokploy permite configurar múltiples réplicas
- Considera usar un CDN para assets estáticos
- Implementa caché en Redis si es necesario

---

**¡Listo!** Tu portal Anyclazz debería estar funcionando en producción 🎉
