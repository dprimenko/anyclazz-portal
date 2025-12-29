# Dockerfile multi-stage para Anyclazz Portal (Astro + Node.js)

# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Definir argumentos de build (las variables se pasan desde Dokploy)
ARG API_URL
ARG KEYCLOAK_ISSUER
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG AUTH_SECRET

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Configurar variables de entorno para el build
ENV API_URL=$API_URL
ENV KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER
ENV KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
ENV KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET
ENV AUTH_SECRET=$AUTH_SECRET

# Build de la aplicación
RUN npm run build

# Etapa 2: Production
FROM node:20-alpine AS runtime

WORKDIR /app

# Copiar solo lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
ara runtime
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Re-declarar ARGs para usarlos en runtime
ARG API_URL
ARG KEYCLOAK_ISSUER
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG AUTH_SECRET

# Configurar variables de entorno para runtime
ENV API_URL=$API_URL
ENV KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER
ENV KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID
ENV KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET
ENV AUTH_SECRET=$AUTH_SECRET

# Comando para ejecutar la aplicación (formato JSON para mejor manejo de señales)
CMD ["node", "./dist/server/entry.mjs"]

# Cambiar a usuario no-root
USER astro

# Exponer el puerto
EXPOSE 4321

# Variables de entorno por defecto (se sobrescriben en Dokploy)
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD node ./dist/server/entry.mjs
