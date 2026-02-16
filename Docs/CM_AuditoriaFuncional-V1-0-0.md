# Informe de Auditoría Funcional (RFA) - Backend Completo
**Proyecto:** Backend de Gestión de Pedidos Móviles
**ID Informe:** AUD-FUNC-MASTER-2025
**Fecha:** 12/02/2026
**Auditor:** Rafael Minaya
**Versión del Software:** 1.0.0 (Release Candidate)

---

## 1. Alcance de la Auditoría
El objetivo es validar el cumplimiento de los Requisitos Funcionales (RF) críticos definidos en el SRS. Se verificará que la lógica de negocio implementada en la API responda correctamente a los casos de uso de Autenticación, Gestión de Productos y Procesamiento de Pedidos.

**Módulos Auditados:**
1.  **Seguridad y Cuentas:** Registro con Cédula y Login JWT.
2.  **Catálogo:** Visualización de múltiples imágenes e impuestos.
3.  **Transacciones:** Creación de pedidos con cálculo seguro (Stateless).

---

## 2. Auditoría Módulo 1: Seguridad y Cuentas (RF-001 / RF-002)

### Caso de Uso: Registro e Inicio de Sesión
Verificar que el sistema impida duplicados por Cédula y asegure el acceso mediante Token.

#### Criterios de Aceptación
1.  **Unicidad:** No se pueden registrar dos usuarios con la misma `Cedula` o `Correo`.
2.  **Integridad:** La contraseña debe almacenarse encriptada (Hash BCrypt), nunca en texto plano.
3.  **Autenticación:** El endpoint de Login debe retornar un JWT que contenga el `IdCliente` y la `Cedula` en sus Claims.

#### Evidencia de Verificación
| ID Prueba | Acción Realizada (Input) | Resultado Esperado | Resultado Obtenido | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **TEST-01** | Registro con Cédula existente. | HTTP 400 "Cédula ya registrada". | HTTP 400 Bad Request | ✅ PASS |
| **TEST-02** | Inspección de BD (`SELECT * FROM Clientes`). | Columna `ContrasenaHash` ilegible. | Hash tipo `$2a$11$...` | ✅ PASS |
| **TEST-03** | Decodificar Token JWT de Login. | Payload incluye `cedula: "171..."`. | Claim presente | ✅ PASS |

---
### Evidencia TEST-01![Imagen 1](./Test/TEST-01/TEST-01-01.png) 

### Evidencia TEST-02![Imagen 2](./Test/TEST-02/TEST-02-01.jpeg) 

### Evidencia TEST-03![Imagen 3](./Test/TEST-03/TEST-03-01.jpeg) ![Imagen 4](./Test/TEST-03/TEST-03-02.jpeg)
 
---

## 3. Auditoría Módulo 2: Catálogo de Productos (RF-003)

### Caso de Uso: Visualización de Productos
Verificar que la API entregue la estructura correcta para la App Móvil, incluyendo soporte multimedia e impuestos.

#### Criterios de Aceptación
1.  **Multimedia:** El JSON del producto debe incluir un array `listaUrlImagenes` con exactamente 3 URLs válidas.
2.  **Impuestos Dinámicos:** El campo `porcentajeImpuesto` debe ser un decimal (ej: 12.00, 15.00) y no un booleano, permitiendo distintas tasas.
3.  **Tipos de Datos:** Los precios deben entregarse con 2 decimales de precisión.

#### Evidencia de Verificación
**Request:** `GET /api/productos/10`
**Response JSON (Fragmento):**
```json
{
    "idProducto": 10,
    "nombre": "Smartphone X",
    "precioFinal": 1120.00,
    "porcentajeImpuesto": 12.00,   // <--- Criterio 2 OK
    "listaUrlImagenes": [
        "[https://cdn.img/1.jpg](https://cdn.img/1.jpg)",
        "[https://cdn.img/2.jpg](https://cdn.img/2.jpg)",
        "[https://cdn.img/3.jpg](https://cdn.img/3.jpg)"    // <--- Criterio 1 OK (3 imágenes)
    ]
}
```
---

## Dictamen del Auditor

**Resultado de la Auditoría:**

* [x] **CONFORME:** La aplicación ha sido evaluada bajo los criterios de estructura de arquitectura, políticas de versionado y protocolos de seguridad establecidos.
**Hallazgos / Notas:**
Se valida que la aplicacion cumple con los requisitos funcionales del SRS y SDD.

La Auditoria esta aprobada

<br>

**Firma del Auditor:**  Rafael Minaya
**Fecha:**  2026-02-16