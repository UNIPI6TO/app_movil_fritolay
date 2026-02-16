# Registro de Cambios (Changelog)
Todos los cambios notables en el proyecto "Backend de Gestión de Pedidos Móviles" se documentarán en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2026-01-27
### Agregado
- **Documentación de Auditoría:** Se incluyeron los archivos de Auditoría Física (PCA) y Funcional (RFA) para validación de calidad.
- **Documentación de Cambio (RFC):** Se formalizó el `RFC-001` como documento maestro de aprobación del backend.
- **Validación Final:** Scripts de prueba de aceptación para el cálculo de impuestos dinámicos y seguridad de precios.

### Estado
- **Release Candidate:** Versión lista para despliegue en ambiente de pruebas (Staging).

---
### Agregado
## [1.0.0] - 2026-01-29
### Modificado
- **Login:** La respuesta del endpoint `/api/cuenta/login` ahora devuelve el número de cédula junto al Token.
- **Validaciones:** El registro ahora impide crear cuentas si la Cédula ya existe en la base de datos (además del correo).

---
## [1.0.0] - 2026-01-30
### Cambiado (Arquitectura)

### Seguridad
- **Protección de Precios:** Se implementó lógica de "Cero Confianza". El backend ignora los precios enviados por el cliente y recalcula obligatoriamente usando los precios de la base de datos.

---

## [1.0.0] - 2026-02-01
### Agregado
- **Seguridad:** Implementación de Autenticación mediante **JWT (JSON Web Tokens)**.
- **Gestión de Cuentas:** Nuevo `ControladorCuenta` con 
---
### Inicial
- **Estructura del Proyecto:** Creación de la solución en .NET Core Web API con patrón MVC.
- **Base de Datos:** Definición del esquema inicial con Entity Framework Core (Code First).
- **Catálogo:** Creación de la entidad `Producto` y `ImagenesProducto`.
- **Funcionalidad:**
endpoints para:
    - Registro de Usuarios.
    - Inicio de Sesión.
    - Recuperación de Contraseña (Generación de código OTP simulado).
    - Restablecimiento de Contraseña.
- **Cifrado:** Implementación de `BCrypt` para el hasheo de contraseñas antes de guardar en SQL.

    - Soporte para **3 imágenes** por producto (Lista de URLs).
    - Cambio de lógica de impuestos: De booleano (`AplicaIva`) a decimal (`PorcentajeImpuesto`) para soportar tasas variables (0%, 12%, 15%).
- **Pedidos:** Estructura base de la tabla `Pedidos` y `DetallePedido` con campos para guardar el histórico de precios.

- **Modelo de Carrito:** Se cambió de un modelo "con estado" (carrito en BD) a un modelo "sin estado" (Stateless). El backend ya no guarda items temporales.
- **Procesamiento de Pedidos:** El endpoint `CrearPedido` ahora recibe la lista completa de productos (`Id` y `Cantidad`) directamente desde la App Móvil.
- **Identidad Legal:** Se añadió el campo `Cedula` (string, required) en la entidad `Cliente`.
- **DTOs:** Se actualizó `DtoRegistro` para requerir la cédula al crear cuenta.
- **Claims JWT:** El Token ahora incluye la cédula encriptada dentro del payload.
