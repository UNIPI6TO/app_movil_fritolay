
# Backend de Gestión de Pedidos Móviles (API REST)

![Estado](https://img.shields.io/badge/Estado-Release_Candidate-green)
![Tecnología](https://img.shields.io/badge/.NET-Core_7.0%2F8.0-blue)
![Base de Datos](https://img.shields.io/badge/SQL_Server-Entity_Framework-red)
![Seguridad](https://img.shields.io/badge/Auth-JWT_Bearer-orange)

Sistema Backend (Single Tenant) diseñado para gestionar el ciclo de vida de pedidos, clientes y catálogo de productos para una aplicación móvil. Construido con arquitectura **Stateless** para máxima escalabilidad y seguridad financiera.

---


## 🚀 Características Principales

* **Seguridad Robusta:** Autenticación vía **JWT (JSON Web Tokens)** con roles y claims personalizados (incluyendo Cédula encriptada).
* **Gestión de Identidad:** Registro de usuarios con validación estricta de **Cédula/DNI** única.
* **Catálogo Multimedia:** Soporte para múltiples imágenes por producto y descripciones detalladas.
* **Motor Financiero Dinámico:**
    * Cálculo de impuestos variable por producto (0%, 12%, 15%).
    * Manejo de decimales de alta precisión (`decimal` en C#).
* **Transacciones Seguras (Stateless):**
    * No almacena carrito en BD (optimización de recursos).
    * **Protección de Precios:** El backend ignora los precios enviados por el cliente y recalcula todo basado en la BD.
    * Transacciones ACID completas (Commit/Rollback).

---

## 🏗 Arquitectura y Diseño

El proyecto sigue una arquitectura en capas basada en el patrón **MVC (Modelo-Vista-Controlador)** actuando como API RESTful.

```mermaid
graph LR
    App[App Móvil] -->|JSON + JWT| API[Controladores .NET]
    API -->|Lógica Negocio| Core[Servicios/Cálculos]
    Core -->|Entity Framework| DB[(SQL Server)]