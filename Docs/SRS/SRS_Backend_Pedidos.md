# Especificación de Requisitos de Software (SRS)
**Proyecto:** Backend de Gestión de Pedidos Móviles (Single Tenant)
**Tecnología:** C# ASP.NET MVC (.NET Core / Framework)
**Seguridad:** JWT (JSON Web Token)
**Versión del Documento:** 1.3 (Actualizado: Gestión de Cuenta y Recuperación)
**Idioma del Código:** Español (Clases, Métodos, Variables)

---

## 1. Introducción
### 1.1 Propósito
Este documento define los requisitos para el backend de una aplicación de pedidos. Gestionará el ciclo de vida completo del usuario (registro, login, recuperación de clave), catálogo multimedia, lógica de impuestos dinámicos y procesamiento de pedidos seguros mediante JWT.

### 1.2 Alcance
El backend en **C# (MVC)** expondrá una API REST.
* **Público:** Registro, Login, Recuperación de Contraseña, Catálogo.
* **Privado (JWT):** Cambiar Contraseña, Crear Pedidos, Ver Historial.

---

## 2. Arquitectura y Seguridad
* **Autenticación:** Cabecera HTTP `Authorization: Bearer <token_jwt>`.
* **Nomenclatura C#:** Español (Ej: `ControladorCuenta`, `RestablecerClave`).
* **Base de Datos:** Relacional (SQL Server / MySQL).

---

## 3. Requisitos Funcionales (RF)

### 3.1 Módulo de Gestión de Cuentas y Seguridad

**RF-001: Crear Cuenta de Cliente (Registro)**
* **Controlador:** `ControladorCuenta`
* **Método:** `RegistrarCliente(ModeloRegistro registro)`
* **Validación:** Verificar que el `correoElectronico` no exista previamente en la base de datos.
* **Seguridad:** La contraseña se debe encriptar (Hash) antes de guardar.

**RF-002: Inicio de Sesión (Login)**
* **Controlador:** `ControladorCuenta`
* **Método:** `IniciarSesion(ModeloLogin login)`
* **Proceso:** Verifica credenciales (correo y hash de contraseña). Si es correcto, genera y retorna el Token JWT.

**RF-010: Cambiar Contraseña (Usuario Logueado)**
* **Acceso:** Privado (Requiere Token JWT activo).
* **Controlador:** `ControladorCuenta`
* **Método:** `CambiarContrasena(ModeloCambioContrasena datos)`
* **Entradas:** `contrasenaActual`, `nuevaContrasena`.
* **Lógica:**
    1.  Validar que `contrasenaActual` coincida con la almacenada.
    2.  Hashear la `nuevaContrasena`.
    3.  Actualizar en BD.

**RF-011: Solicitar Recuperación de Contraseña (Olvido)**
* **Acceso:** Público.
* **Controlador:** `ControladorCuenta`
* **Método:** `SolicitarRecuperacion(string correoElectronico)`
* **Lógica:**
    1.  Buscar si el correo existe.
    2.  Generar un **Código de Verificación** numérico (ej: 6 dígitos) o alfanumérico temporal.
    3.  Guardar el código en BD con una expiración (ej: 15 minutos).
    4.  Enviar el código por correo electrónico (Simulado o SMTP real).

**RF-012: Restablecer Contraseña (Confirmación)**
* **Acceso:** Público.
* **Controlador:** `ControladorCuenta`
* **Método:** `RestablecerContrasena(ModeloRestablecer datos)`
* **Entradas:** `correoElectronico`, `codigoVerificacion`, `nuevaContrasena`.
* **Lógica:**
    1.  Validar que el código coincida y no haya expirado.
    2.  Actualizar la contraseña con el nuevo hash.
    3.  Invalidar el código usado.

### 3.2 Módulo de Catálogo (Público)

**RF-003: Listado Multimedia de Productos**
* **Modelo (`ModeloProducto`):**
    * `idProducto`, `nombreProducto`, `descripcion`
    * `precioBase`, `porcentajeDescuento`, `porcentajeImpuesto` (Dinámico).
    * `listaUrlImagenes` (List<string>): Lista obligatoria de 3 URLs para carrusel.

### 3.3 Módulo de Pedidos (Privado - Requiere JWT)

**RF-005: Creación de Pedido Seguro**
* **Seguridad:** Obtener `idCliente` desde los "Claims" del Token JWT.
* **Controlador:** `ControladorPedidos`
* **Método:** `CrearPedido(ModeloPedidoSolicitud solicitud)`
* **Validación:** Recalcular totales (Descuento + Impuesto Variable) en el servidor.

### 3.4 Módulo de Pagos

**RF-007: Métodos de Pago**
* Soporte: `EfectivoContraEntrega`, `TransferenciaBancaria`, `DepositoBancario`, `TarjetaCreditoDebito`.

---

## 4. Requisitos No Funcionales (RNF)

**RNF-001: Seguridad en Credenciales**
* Las contraseñas nunca viajan en texto plano en la respuesta.
* Se debe implementar limitación de intentos (Rate Limiting) en el Login para evitar fuerza bruta.

**RNF-002: Gestión de Sesión**
* El Token JWT debe expirar en un tiempo razonable.
* Para "Cambiar Contraseña", el sistema debe invalidar sesiones previas si fuera posible (Blacklist de tokens opcional).

**RNF-003: Disponibilidad de Imágenes**
* Las 3 imágenes del producto deben estar alojadas en un servidor de contenido estático (CDN) para carga rápida en móviles.

---

## 5. Definición de Estructuras de Datos (C#)

### 5.1 Clases de Cuenta y Seguridad

```csharp
public class ModeloRegistro
{
    public string nombreCompleto { get; set; }
    public string correoElectronico { get; set; }
    public string contrasena { get; set; }
    public string telefono { get; set; }
    public string direccionPredeterminada { get; set; }
}

public class ModeloLogin
{
    public string correoElectronico { get; set; }
    public string contrasena { get; set; }
}

public class ModeloCambioContrasena
{
    public string contrasenaActual { get; set; }
    public string nuevaContrasena { get; set; }
}

public class ModeloRestablecer
{
    public string correoElectronico { get; set; }
    public string codigoVerificacion { get; set; } // El código recibido por email
    public string nuevaContrasena { get; set; }
}