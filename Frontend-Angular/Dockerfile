# Etapa 1: Compilar la aplicación Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Etapa 2: Servir con Nginx
FROM nginx:alpine
# Ajustar la ruta según la salida real de Angular 17/18
COPY --from=build /app/dist/Frontend-Angular/browser /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
