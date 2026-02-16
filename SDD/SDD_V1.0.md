# Documento de Diseño de Software (SDD)
**Proyecto:** Backend de Gestión de Pedidos Móviles
**Tecnología:** C# ASP.NET Core Web API (Patrón MVC)
**Base de Datos:** SQL Server (Recomendado)
**Versión:** 1.0
**Estado:** Borrador Técnico

---

## 1. Diseño de Arquitectura
El sistema seguirá una arquitectura en capas basada en el patrón MVC (Modelo-Vista-Controlador), actuando estrictamente como una API RESTful.

### 1.1 Diagrama de Arquitectura Lógica
El flujo de datos se comportará de la siguiente manera:
1.  **App Móvil:** Realiza peticiones HTTP (JSON).
2.  **Capa Controladores (API):** Recibe la petición y valida el Token JWT.
3.  **Capa de Lógica de Negocio (Servicios):** Realiza cálculos (IVA, descuentos) y validaciones complejas.
4.  **Capa de Acceso a Datos (Repositorio/EF):** Interactúa con la Base de Datos.

```mermaid
graph TD
    A[App Móvil iOS/Android] -->|JSON + JWT| B(Controladores API)
    B -->|Modelos Vista| C{Capa Lógica de Negocio}
    C -->|Reglas de Negocio| D[Capa Acceso a Datos]
    D -->|Entity Framework| E[(Base de Datos SQL)]