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

# Reconstruir y actualizar solo el frontend
docker compose up -d --build frontend

# Reconstruir y actualizar solo el backend
docker compose up -d --build backend
