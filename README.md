# 🐳 Docker Compose Cheat Sheet

Guía rápida para la gestión de contenedores y depuración del stack **Frontend (React)** + **Backend (Spring API)**.

---

## 🚀 Comandos de Uso Diario

| Acción | Comando |
| :--- | :--- |
| **Levantar todo** (segundo plano) | `docker compose up -d` |
| **Levantar y Reconstruir todo** | `docker compose up -d --build` |
| **Parar y Eliminar** contenedores/redes | `docker compose down` |
| **Ver logs** en tiempo real | `docker compose logs -f` |
| **Ver estado** de los servicios | `docker compose ps` |

---

## ⚡ Reconstrucción Selectiva (Ahorra tiempo)

Si solo has modificado el código de un servicio, no reinicies todo el stack:

## Reconstruir y actualizar solo el frontend
docker compose up -d --build frontend

## Reconstruir y actualizar solo el backend
docker compose up -d --build backend

---

## 🚀 Rutas de Acceso y Pruebas

Para probar la aplicación en el entorno de desarrollo local, utiliza los siguientes enlaces:

### 🌍 Interfaz de Usuario
* **Aplicación Principal:** [http://localhost](http://localhost)


### 🛠️ Herramientas de Desarrollo
| Componente | URL de Acceso | Descripción |
| :--- | :--- | :--- |
| **Consola H2** | [http://localhost/h2-console/](http://localhost/h2-console/) | Gestión de la base de datos en memoria. |
| **Swagger UI** | [http://localhost/swagger-ui/index.html](http://localhost/swagger-ui/index.html) | Documentación interactiva de la API. |

---

### 🔑 Configuración de Acceso a H2
Al acceder a la consola de H2, asegúrate de rellenar los campos con los siguientes valores para establecer la conexión correctamente:

* **JDBC URL:** `jdbc:h2:mem:testdb`
* **User Name:** `sa`
* **Password:** *(dejar en blanco)*
