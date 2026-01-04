# Dockerfile para Anyclazz Portal (Astro + Node.js)

# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Build de la aplicación
RUN npm run build

# Etapa 2: Production
FROM node:20-alpine AS runtime

WORKDIR /app

# Copiar solo lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Crear un usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001 && \
    chown -R astro:nodejs /app

# Cambiar a usuario no-root
USER astro

# Exponer el puerto
EXPOSE 4321

# Variables de entorno
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Comando para ejecutar
CMD ["node", "./dist/server/entry.mjs"]