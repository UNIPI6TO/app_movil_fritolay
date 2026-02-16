# Auditoría Física de Configuración (PCA)
**Proyecto:** Backend de Gestión de Pedidos Móviles (.NET Core)
**ID Auditoría:** AUD-PHY-2026-001
**Fecha:** 16/02/2026
**Auditor:** Wilson Salinas Flores

---

## 1. Objetivo
Verificar la existencia, integridad y correcta ubicación de los Elementos de Configuración (CIs) definidos en el Plan de Gestión de Configuración. Asegurar que el entregable de software incluya toda la documentación, scripts y configuraciones necesarias para su despliegue.



---

## 2. Lista de Verificación de Elementos Raíz

| Elemento (CI) | Archivo Esperado | Estado | Observaciones |
| :--- | :--- | :--- | :--- |
| **Documentación Principal** | `README.md` | `Aprobado` | Debe incluir instrucciones de instalación, prerrequisitos (.NET 7/8, SQL Server) y cómo ejecutar el proyecto. |
| **Control de Versiones** | `.gitignore` | `Aprobado` | **Crítico:** Debe excluir `bin/`, `obj/`, `.vs/` y archivos con secretos reales (`appsettings.Development.json` con claves reales). |
| **Solución .NET** | `BackendPedidos.sln` | `Aprobado` | Archivo de solución que agrupa los proyectos. |
| **Historial de Cambios** | `CHANGELOG.md` | `Aprobado` | Registro de cambios por versión. |

---

## 3. Verificación de Seguridad y Entorno

| Elemento (CI) | Archivo Esperado | Estado | Observaciones |
| :--- | :--- | :--- | :--- |
| **Plantilla de Entorno** | `.env.example` o `appsettings.example.json` | `Aprobado` | Debe existir una plantilla con las claves vacías (ConnectionStrings, JwtSecret) para que el desarrollador sepa qué configurar. |
| **Secretos Excluidos** | *Ausencia de claves reales* | `Aprobado` | **Seguridad:** Verificar que NO existan contraseñas reales hardcodeadas en el repositorio. |

---

## 4. Auditoría de Documentación Técnica (Artifacts)

Se verifica la existencia de los documentos generados en fases previas.

- [x] **SRS (Requerimientos):** `SRS_Backend_Pedidos.md`  
- [x] **SDD (Diseño):** `SDD_Arquitectura_Backend.md` (Diagramas ER y Arquitectura).
Nota: No se encuentra renombrtado correctamente el archivo¿
- [x] **RFC (Cambios):** `RFC-001-Implementacion-Master.md` (Aprobado).
- [x] **Plan de Pruebas:** `Plan_Pruebas_QA.md` (Casos de uso CP-001 a CP-020).

---

## 5. Auditoría de Estructura de Código (Backend)

Verificación de la estructura de carpetas según el patrón MVC/API definido.

### 📂 /BackendPedidos
- [x] **Controllers/**
    - [x] `Cuenta/ControladorCuenta.cs` (Debe contener Registro con Cédula).
    - [x] `Productos/ControladorProductos.cs` (Debe manejar lista de imágenes).
    - [x] `Pedido/ControladorPedidos.cs` (Lógica transaccional sin carrito BD).
- [x] **Modelos/**
    - [x] `Cliente.cs` (Verificar propiedad `[Required] string Cedula`).
    - [x] `Producto.cs` (Verificar `decimal PorcentajeImpuesto`).
    - [x] `Pedido.cs` y `DetallePedido.cs`.
- [x] **Modelos/Dto/**
    - [x] `DtoRegistro.cs`, `DtoLogin.cs`.
    - [x] `DtoCrearPedido.cs` (Estructura limpia sin precios).
- [x] **Datos/**
    - [x] `ContextoBaseDatos.cs` (DbSet definidos).
- [x] **Migrations/**
    - [x] Verificar existencia de archivos de migración.

---

## 6. Scripts y Automatización

| Elemento (CI) | Archivo Esperado | Estado | Observaciones |
| :--- | :--- | :--- | :--- |
| **Script de BD** | `script_inicial_db.sql` | `Aprobado` | Script SQL generado para crear la BD manualmente si las migraciones fallan. |
| **Postman** | `Coleccion_API_Pedidos.json` | `Aprobado` | Archivo de exportación de Postman para probar los Endpoints. |


---

## 7. Dictamen del Auditor

**Resultado de la Auditoría:**

* [x] **CONFORME:** El repositorio cumple con la estructura, versionado y seguridad requerida. Se autoriza el paso a entorno de Testing/Staging.
* [ ] **NO CONFORME:** Se encontraron faltantes críticos. Se rechaza la entrega hasta subsanar los hallazgos.
* [ ] **CONFORME CON OBSERVACIONES:** Se aprueba condicionalmente (detallar abajo).

**Hallazgos / Notas:**
Los nombres estan mal documentados SRS y SDD, no hay changelogs, readme, script iniciales y colecciones de postman o bruno. Se crea un issue con una rama de corrección como sub tarea del issue de auditoria.

Con el PR https://github.com/UNIPI6TO/app_movil_fritolay/pull/7 se solventan las novedades la Auditoria esta aprobada

<br>

**Firma del Auditor:**  Wilson Salinas
**Fecha:**  2026-02-16