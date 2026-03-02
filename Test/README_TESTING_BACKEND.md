# Guía de Pruebas Backend - API Frito Lay

## 📋 Descripción

Esta guía proporciona instrucciones completas para ejecutar, mantener y extender las pruebas automatizadas del backend API desarrollado con .NET 8, Entity Framework Core y xUnit.

**Versión:** 1.1.0-pre.1  
**Framework de Pruebas:** xUnit 2.9.2  
**Cobertura Actual:** 13 pruebas de autenticación implementadas

---

## 🚀 Inicio Rápido

### Prerequisitos

- .NET SDK 8.0 o superior
- Visual Studio 2022 o VS Code con extensión C#
- SQL Server (para desarrollo, las pruebas usan InMemory)

### Instalación

```powershell
# Navegar al directorio de la solución
cd src/backend

# Restaurar dependencias
dotnet restore backend.sln

# Compilar solución
dotnet build backend.sln
```

---

## 🧪 Ejecutar Pruebas

### Todas las Pruebas

```powershell
dotnet test
```

### Pruebas por Categoría

```powershell
# Solo pruebas de integración
dotnet test --filter "Category=Integration"

# Solo pruebas unitarias
dotnet test --filter "Category=Unit"

# Solo pruebas de seguridad
dotnet test --filter "Category=Security"

# Solo pruebas de performance
dotnet test --filter "Category=Performance"
```

### Pruebas Específicas por Nombre

```powershell
# Pruebas de autenticación
dotnet test --filter "FullyQualifiedName~ControladorCuentaTests"

# Una prueba específica
dotnet test --filter "FullyQualifiedName~Registrar_DatosValidos"
```

### Con Verbosidad Detallada

```powershell
# Verbosidad normal (recomendado para debugging)
dotnet test --verbosity normal

# Verbosidad mínima (solo resumen)
dotnet test --verbosity minimal

# Verbosidad detallada (para CI/CD)
dotnet test --verbosity detailed
```

---

## 📊 Cobertura de Código

### Instalar Herramienta de Cobertura

```powershell
# Instalar Coverlet global
dotnet tool install --global coverlet.console

# O agregar como paquete local
dotnet add package coverlet.collector
```

### Generar Reporte de Cobertura

```powershell
# Generar cobertura en formato HTML
dotnet test --collect:"XPlat Code Coverage" --results-directory "./TestResults"

# Con ReportGenerator para HTML visual
dotnet tool install --global dotnet-reportgenerator-globaltool

reportgenerator `
  -reports:"./TestResults/**/coverage.cobertura.xml" `
  -targetdir:"./TestResults/coveragereport" `
  -reporttypes:Html

# Abrir reporte
start ./TestResults/coveragereport/index.html
```

### Meta de Cobertura

**Objetivo:** ≥ 80% de cobertura en código crítico

- **Alta Prioridad (🔴):** 100% cobertura obligatoria
- **Media Prioridad (🟡):** ≥ 90% cobertura
- **Baja Prioridad (🟢):** ≥ 70% cobertura

---

## 🏗️ Estructura del Proyecto

```
backend/
├── Controllers/
├── Modelos/  
├── Datos/
├── Tests/                       # ⭐ Proyecto de pruebas
│   ├── Controllers/             # Pruebas de controladores
│   │   ├── ControladorCuentaTests.cs      (13 tests) ✅
│   │   ├── ControladorProductoTests.cs    (Pendiente)
│   │   └── ControladorPedidoTests.cs      (Pendiente)
│   ├── Integration/             # Pruebas de integración
│   │   └── (Pendiente)
│   ├── Helpers/                 # Utilidades de prueba
│   │   └── TestHelper.cs        ✅
│   └── backend.Tests.csproj     # Configuración del proyecto
```

---

## 📝 Pruebas Implementadas

### ✅ Autenticación (TC-BE-001 a TC-BE-012)

| Caso | Descripción | Estado |
|------|-------------|--------|
| TC-BE-001 | Registro de usuario válido | ✅ Pasando |
| TC-BE-002 | Validación cédula única | ✅ Pasando |
| TC-BE-003 | Validación email único | ✅ Pasando |
| TC-BE-004 | Contraseña hasheada con BCrypt | ✅ Pasando |
| TC-BE-005 | Login exitoso con JWT | ✅ Pasando |
| TC-BE-006 | Login credenciales incorrectas | ✅ Pasando |
| TC-BE-007 | Login usuario no existe | ✅ Pasando |
| TC-BE-008 | JWT incluye claims de cédula | ✅ Pasando |
| TC-BE-009 | JWT expira en 7 días | ✅ Pasando |
| TC-BE-010 | Solicitar código recuperación | ✅ Pasando |
| TC-BE-011 | Recuperación email no existe | ✅ Pasando |
| TC-BE-012 | Restablecer contraseña | ✅ Pasando |

**Total:** 13/13 pruebas pasando (100%)

### 🔜 Pendientes

- **Productos:** TC-BE-013 a TC-BE-020 (8 casos)
- **Pedidos:** TC-BE-021 a TC-BE-032 (12 casos)
- **Pagos:** TC-BE-033 a TC-BE-038 (6 casos)
- **GPS:** TC-BE-039 a TC-BE-043 (5 casos)
- **Historial:** TC-BE-044 a TC-BE-051 (8 casos)
- **Seguridad:** TC-BE-052 a TC-BE-060 (9 casos)
- **Performance:** TC-BE-061 a TC-BE-064 (4 casos)

**Meta:** 64 pruebas documentadas en [test_case_backend.md](../../Test/test_case_backend.md)

---

## 🔧 Helpers de Prueba

El archivo `TestHelper.cs` proporciona métodos útiles:

```csharp
// Crear contexto de BD en memoria
var contexto = TestHelper.CrearContextoEnMemoria();

// Crear entidades de prueba
var cliente = TestHelper.CrearCliente(cedula: "0123456789");
var producto = TestHelper.CrearProducto(nombre: "Doritos");
var pedido = TestHelper.CrearPedido(idCliente: 1);

// Generar token JWT válido
var token = TestHelper.GenerarTokenJWT(
    cedula: "0123456789",
    email: "test@test.com",
    idCliente: 1
);

// Validar coordenadas GPS
bool valido = TestHelper.CoordenadasValidas(-0.2295, -78.5243);

// Calcular precio final con descuentos e impuestos
decimal precio = TestHelper.CalcularPrecioFinal(
    precioBase: 10.00m,
    descuento: 0.10m,    // 10%
    impuesto: 0.15m      // 15%
);
```

---

## 🎯 Buenas Prácticas

### 1. Nomenclatura de Pruebas

Usar el patrón: `MetodoAProbar_Escenario_ResultadoEsperado`

```csharp
✅ Correcto:
public async Task IniciarSesion_CredencialesValidas_DevuelveTokenYDatosUsuario()

❌ Incorrecto:
public async Task Test1()
public async Task LoginTest()
```

### 2. Patrón AAA (Arrange, Act, Assert)

```csharp
[Fact]
public async Task Ejemplo_Patron_AAA()
{
    // Arrange: Preparar datos y contexto
    using var contexto = TestHelper.CrearContextoEnMemoria();
    var controlador = new ControladorCuenta(contexto, _configuracion);
    var datos = new DtoLogin { /* ... */ };

    // Act: Ejecutar la acción a probar
    var resultado = await controlador.IniciarSesion(datos);

    // Assert: Verificar el resultado
    resultado.Should().BeOfType<OkObjectResult>();
}
```

### 3. Usar FluentAssertions

```csharp
// ✅ Preferido: Sintaxis fluida y mensajes claros
cliente.Cedula.Should().Be("0123456789");
cliente.NombreCompleto.Should().NotBeNullOrEmpty();
resultado.Should().BeOfType<OkObjectResult>();

// ❌ Evitar: Assert.Equal tradicional
Assert.Equal("0123456789", cliente.Cedula);
Assert.NotNull(cliente.NombreCompleto);
```

### 4. Base de Datos Aislada

Cada prueba debe usar su propio contexto en memoria:

```csharp
[Fact]
public async Task MiPrueba()
{
    // ✅ Cada prueba tiene su BD única
    using var contexto = TestHelper.CrearContextoEnMemoria();
    
    // Ejecutar prueba...
} // El contexto se destruye automáticamente
```

### 5. Traits para Organización

```csharp
[Trait("Category", "Integration")]
[Trait("Priority", "High")]
[Fact]
public async Task MiPruebaDeIntegracion()
{
    // ...
}
```

---

## 🐛 Debugging de Pruebas

### En Visual Studio

1. Abrir **Test Explorer** (Ctrl + E, T)
2. Click derecho en prueba → **Debug**
3. Establecer breakpoints en código de prueba o producción

### En VS Code

1. Instalar extensión: **.NET Core Test Explorer**
2. Agregar configuración en `.vscode/launch.json`:

```json
{
    "name": ".NET Core Test",
    "type": "coreclr",
    "request": "launch",
    "preLaunchTask": "build",
    "program": "dotnet",
    "args": ["test"],
    "cwd": "${workspaceFolder}/src/backend/Tests",
    "stopAtEntry": false
}
```

3. F5 para debug

### Logs de Entity Framework

```csharp
var options = new DbContextOptionsBuilder<ContextoBaseDatos>()
    .UseInMemoryDatabase(databaseName: "TestDB")
    .EnableSensitiveDataLogging()  // ✅ Ver valores de entidades
    .LogTo(Console.WriteLine)       // ✅ Ver queries SQL
    .Options;
```

---

## 🔒 Pruebas de Seguridad

### SQL Injection (TC-BE-054)

```csharp
[Fact]
public async Task Login_SQLInjection_NoPuedePenetrar()
{
    var datos = new DtoLogin
    {
        CorreoElectronico = "' OR 1=1 --",
        Contrasena = "cualquiera"
    };
    
    var resultado = await controlador.IniciarSesion(datos);
    
    // Entity Framework protege automáticamente
    resultado.Should().BeOfType<UnauthorizedObjectResult>();
}
```

### IDOR - Insecure Direct Object Reference (TC-BE-055)

```csharp
[Fact]
public async Task ObtenerPedido_UsuarioA_NoPuedeVerPedidoDeUsuarioB()
{
    // Usuario A intenta acceder al pedido de Usuario B
    var resultado = await controlador.ObtenerPedido(idPedidoDeB, tokenUsuarioA);
    
    resultado.Should().BeOfType<ForbiddenObjectResult>();
}
```

### BCrypt Password Hashing (TC-BE-060)

```csharp
[Fact]
public void Contrasena_GuardadaEnBD_EstaHasheada()
{
    var cliente = await contexto.Clientes.FirstAsync();
    
    // ✅ Debe ser hash BCrypt
    cliente.ContrasenaHash.Should().StartWith("$2a$");
    cliente.ContrasenaHash.Should().NotBe("passwordoriginal");
    
    // ✅ Verificación funciona
    BCrypt.Net.BCrypt.Verify("passwordoriginal", cliente.ContrasenaHash)
        .Should().BeTrue();
}
```

---

## ⚡ Pruebas de Performance

### Configuración

```csharp
[Trait("Category", "Performance")]
[Fact]
public async Task ListarProductos_ConCienProductos_RespondeEnMenosDe500ms()
{
    // Arrange: Crear 100 productos
    var productos = Enumerable.Range(1, 100)
        .Select(i => TestHelper.CrearProducto(nombre: $"Producto {i}"))
        .ToList();
    contexto.Productos.AddRange(productos);
    await contexto.SaveChangesAsync();

    // Act: Medir tiempo
    var stopwatch = Stopwatch.StartNew();
    var resultado = await controlador.ListarProductos();
    stopwatch.Stop();

    // Assert: Debe ser < 500ms
    stopwatch.ElapsedMilliseconds.Should().BeLessThan(500);
}
```

---

## 🚀 Integración CI/CD

### GitHub Actions

```yaml
name: Backend Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '8.0.x'
    
    - name: Restore dependencies
      run: dotnet restore src/backend/Tests
    
    - name: Build Tests
      run: dotnet build src/backend/Tests --no-restore
    
    - name: Run Tests
      run: dotnet test src/backend/Tests --no-build --verbosity normal --logger "trx;LogFileName=test-results.trx"
    
    - name: Generate Coverage
      run: dotnet test src/backend/Tests --collect:"XPlat Code Coverage" --results-directory ./coverage
    
    - name: Publish Test Results
      if: always()
      uses: dorny/test-reporter@v1
      with:
        name: Backend Test Results
        path: '**/*.trx'
        reporter: dotnet-trx
```

### Azure DevOps

```yaml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UseDotNet@2
  inputs:
    version: '8.0.x'

- task: DotNetCoreCLI@2
  displayName: 'Restore'
  inputs:
    command: 'restore'
    projects: 'src/backend/Tests/*.csproj'

- task: DotNetCoreCLI@2
  displayName: 'Build'
  inputs:
    command: 'build'
    projects: 'src/backend/Tests/*.csproj'

- task: DotNetCoreCLI@2
  displayName: 'Run Tests'
  inputs:
    command: 'test'
    projects: 'src/backend/Tests/*.csproj'
    arguments: '--configuration Release --collect:"XPlat Code Coverage"'
    publishTestResults: true

- task: PublishCodeCoverageResults@1
  inputs:
    codeCoverageTool: 'Cobertura'
    summaryFileLocation: '$(Agent.TempDirectory)/**/coverage.cobertura.xml'
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [xUnit Documentation](https://xunit.net/)
- [FluentAssertions](https://fluentassertions.com/)
- [Moq Documentation](https://github.com/moq/moq4)
- [Entity Framework Core Testing](https://learn.microsoft.com/en-us/ef/core/testing/)

### Archivos Relacionados

- 📄 [test_case_backend.md](../../Test/test_case_backend.md) - Casos de prueba documentados (64 casos)
- 📂 [backend](../backend/) - Código fuente del API
- 📂 [Test](../../Test/) - Documentación de QA

### Comandos Útiles

```powershell
# Ver lista de pruebas disponibles
dotnet test --list-tests

# Ejecutar solo pruebas que fallaron previamente
dotnet test --filter "TestStatus=Failed"

# Ejecutar pruebas en paralelo (más rápido)
dotnet test --parallel

# Configurar timeout para pruebas lentas
dotnet test -- xUnit.TestTimeout=5000

# Generar reporte de cobertura en JSON
dotnet test --collect:"XPlat Code Coverage" --settings coverlet.runsettings
```

---

## 🤝 Contribuir

### Agregar Nueva Prueba

1. Identificar caso de prueba en [test_case_backend.md](../../Test/test_case_backend.md)
2. Crear método de prueba siguiendo convención de nomenclatura
3. Usar patrón AAA (Arrange, Act, Assert)
4. Agregar `[Trait]` apropiado
5. Ejecutar y verificar que pasa
6. Actualizar este README

### Checklist de Pull Request

- [ ] Todas las pruebas nuevas pasan localmente
- [ ] Cobertura ≥ 80% en código nuevo
- [ ] Documentación actualizada
- [ ] Nombres de pruebas descriptivos
- [ ] Sin datos sensibles (passwords, keys) hardcodeados

---

## 🐞 Troubleshooting

### Error: "Required properties are missing"

**Problema:** Entity Framework requiere propiedades obligatorias

```csharp
// ❌ Error
var cliente = new Cliente { Cedula = "123" };

// ✅ Solución: Usar TestHelper con datos completos
var cliente = TestHelper.CrearCliente(cedula: "123");
```

### Error: "JWT validation failed"

**Problema:** Token JWT mal configurado

```csharp
// ✅ Asegurar configuración JWT en pruebas
var inMemorySettings = new Dictionary<string, string>
{
    {"ConfiguracionJwt:ClaveSecreta", "ClaveSecretaSuperSeguraParaPruebas123"}
};
_configuracion = new ConfigurationBuilder()
    .AddInMemoryCollection(inMemorySettings!)
    .Build();
```

### Error: "Database context disposed"

**Problema:** Contexto usado fuera del scope

```csharp
// ❌ Error
var contexto = TestHelper.CrearContextoEnMemoria();
// ... prueba ...
contexto.Dispose();
var cliente = await contexto.Clientes.FirstAsync(); // Error!

// ✅ Solución: Usar using
using var contexto = TestHelper.CrearContextoEnMemoria();
// El contexto se libera automáticamente
```

---

**Última Actualización:** 22 de febrero de 2026  
**Mantenido por:** Backend Team  
**Versión Backend:** v1.1.0-pre.1  
**Versión Pruebas:** v1.0
