# Guía de Ejecución de Pruebas - Frontend Móvil

**Proyecto:** Aplicación Móvil de Pedidos Frito Lay  
**Framework de Pruebas:** Jasmine + Karma  
**Versión:** 1.1.0-pre.1  
**Última Actualización:** 22 de febrero de 2026

---

## 📋 Índice

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Estructura de Pruebas](#estructura-de-pruebas)
4. [Comandos de Ejecución](#comandos-de-ejecución)
5. [Cobertura de Código](#cobertura-de-código)
6. [Casos de Prueba](#casos-de-prueba)
7. [Debugging](#debugging)
8. [CI/CD Integration](#cicd-integration)

---

## 1. Introducción

Este documento describe cómo ejecutar las pruebas automatizadas del frontend móvil. Se han implementado **73 casos de prueba** distribuidos en:

- **30 pruebas unitarias** (servicios y componentes aislados)
- **21 pruebas de integración** (comunicación con backend)
- **10 pruebas E2E** (flujos completos)
- **13 pruebas de UI** (interfaz y experiencia)

---

## 2. Requisitos Previos

### Software Necesario

```bash
Node.js: v20.x o superior
npm: v10.x o superior
Chrome: Última versión (para Karma)
```

### Instalación de Dependencias

```powershell
cd src/fritolay-app
npm install
```

### Dependencias de Testing

Ya incluidas en `package.json`:
- `karma` - Test runner
- `jasmine` - Testing framework
- `karma-jasmine` - Adaptador
- `karma-chrome-launcher` - Navegador headless
- `karma-coverage` - Reportes de cobertura
- `@angular-devkit/build-angular` - Builder de Angular

---

## 3. Estructura de Pruebas

```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.spec.ts ✅ (8 tests)
│   │   ├── carrito.service.spec.ts ✅ (12 tests)
│   │   ├── api.service.spec.ts ✅ (11 tests)
│   │   └── pedido.service.spec.ts ✅ (10 tests)
│   ├── pages/
│   │   ├── login/
│   │   │   └── login.page.spec.ts ✅ (8 tests)
│   │   ├── checkout/
│   │   │   └── checkout.page.spec.ts ✅ (11 tests)
│   │   └── mis-pedidos/
│   │       └── mis-pedidos.page.spec.ts ✅ (10 tests)
│   └── components/
│       └── mapa-entrega/
│           └── mapa-entrega.component.spec.ts ✅ (básico)
└── karma.conf.js ⚙️
```

**Total:** 70+ pruebas implementadas

---

## 4. Comandos de Ejecución

### 🚀 Ejecutar Todas las Pruebas

```powershell
npm run test
```

Este comando:
- Inicia Karma en modo watch
- Abre Chrome en modo headless
- Ejecuta todas las pruebas `*.spec.ts`
- Muestra resultados en la terminal y en navegador

### 🔂 Ejecución Única (CI Mode)

```powershell
ng test --watch=false --browsers=ChromeHeadless
```

Ideal para pipelines de CI/CD. Ejecuta una vez y termina.

### 🎯 Ejecutar Tests Específicos

Para ejecutar solo un archivo:

```powershell
ng test --include='**/auth.service.spec.ts'
```

Para ejecutar solo servicios:

```powershell
ng test --include='**/services/**/*.spec.ts'
```

Para ejecutar solo páginas:

```powershell
ng test --include='**/pages/**/*.spec.ts'
```

### 🐛 Modo Debug

```powershell
ng test --browsers=Chrome
```

Esto abre Chrome visible donde puedes:
1. Hacer clic en "Debug" button
2. Abrir DevTools (F12)
3. Ver console.log() de las pruebas
4. Usar breakpoints en el código

---

## 5. Cobertura de Código

### Generar Reporte de Cobertura

```powershell
ng test --no-watch --code-coverage --browsers=ChromeHeadless
```

Los reportes se generan en:
```
src/fritolay-app/coverage/app/
├── index.html       (Reporte visual)
├── lcov.info        (Para SonarQube)
└── clover.xml       (Para Jenkins)
```

### Ver Reporte HTML

```powershell
# Abrir en navegador
start coverage/app/index.html
```

### Objetivo de Cobertura

| Tipo | Objetivo | Actual |
|------|----------|--------|
| **Statements** | ≥ 80% | ~75% |
| **Branches** | ≥ 75% | ~70% |
| **Functions** | ≥ 80% | ~78% |
| **Lines** | ≥ 80% | ~76% |

---

## 6. Casos de Prueba

### Por Módulo

#### 🔐 AuthService (auth.service.spec.ts)

```typescript
✅ TC-FE-001: Login exitoso con credenciales válidas
✅ TC-FE-003: Login con credenciales incorrectas
✅ TC-FE-004: Login sin conexión a internet
✅ TC-FE-005: Persistencia de sesión
✅ TC-FE-006: Logout exitoso
✅ Registro de usuario
✅ Recuperación de contraseña
✅ Manejo de errores de red
```

#### 🛒 CarritoService (carrito.service.spec.ts)

```typescript
✅ TC-FE-014: Agregar producto nuevo al carrito
✅ TC-FE-015: Incrementar cantidad de producto existente
✅ TC-FE-016: Modificar cantidad con controles +/-
✅ TC-FE-017: Eliminar producto del carrito
✅ TC-FE-018: Cálculo de subtotal e impuestos
✅ TC-FE-019: Cálculo con productos mixtos (con/sin IVA)
✅ TC-FE-020: Persistencia del carrito
✅ TC-FE-021: Vaciar carrito completo (v1.1.0)
✅ TC-FE-022: Carrito vacío
✅ Cálculo de precio con descuento
✅ getSubtotal(), getImpuestos()
```

#### 🌐 ApiService (api.service.spec.ts)

```typescript
✅ TC-FE-042: cleanObject() elimina undefined (v1.1.0)
✅ TC-FE-043: cleanObject() elimina null (v1.1.0)
✅ TC-FE-044: cleanObject() recursivo (v1.1.0)
✅ TC-FE-045: cleanObject() con arrays (v1.1.0)
✅ TC-FE-046: Authorization header con JWT
✅ TC-FE-047: Manejo de errores 401
✅ TC-FE-050: Timeout de peticiones HTTP
✅ Extracción de mensajes desde Blob
✅ Preservar valores válidos (0, false, '')
✅ Mantener arrays vacíos
```

#### 📦 PedidoService (pedido.service.spec.ts)

```typescript
✅ TC-FE-028: Crear pedido correctamente
✅ TC-FE-030: Limpieza de valores undefined/null (v1.1.0)
✅ TC-FE-031: Manejo de errores del backend
✅ TC-FE-034: Listar pedidos del usuario (v1.1.0)
✅ TC-FE-035: Lista vacía de pedidos
✅ TC-FE-036: Detalle completo de un pedido (v1.1.0)
✅ TC-FE-052: No enviar precios (Zero Trust)
✅ Registrar pago
✅ Registrar entrega
```

#### 🔑 LoginPage (login.page.spec.ts)

```typescript
✅ TC-FE-001: Navegar tras login exitoso
✅ TC-FE-003: Mostrar error con credenciales incorrectas
✅ TC-FE-005: Redirigir si hay sesión activa
✅ TC-FE-007: Validar campos vacíos
✅ Loading controller durante login
✅ Flag isLoading
```

#### 💳 CheckoutPage (checkout.page.spec.ts)

```typescript
✅ TC-FE-025: Validar dirección requerida
✅ TC-FE-026: Configurar método Tarjeta
✅ TC-FE-027: Mostrar campo referencia para Transferencia
✅ TC-FE-028: Crear pedido y registrar pago con Tarjeta (v1.1.0)
✅ TC-FE-029: NO registrar pago con Efectivo
✅ TC-FE-031: Manejar errores al crear pedido
✅ TC-FE-032: Limpieza post-orden (v1.1.0)
✅ TC-FE-023: Captura de GPS
✅ Cálculos de totales
✅ Navegación de steps
```

#### 📋 MisPedidosPage (mis-pedidos.page.spec.ts) *(v1.1.0 - NUEVO)*

```typescript
✅ TC-FE-034: Cargar lista de pedidos
✅ TC-FE-035: Manejar lista vacía
✅ TC-FE-036: Abrir modal de detalle
✅ TC-FE-039: Colores según estado
✅ TC-FE-040: Pull-to-refresh
✅ TC-FE-041: Indicador de pago registrado
✅ Manejo de errores
✅ Loading state
✅ Inicialización
```

---

## 7. Debugging

### Problemas Comunes

#### ❌ Error: "Chrome not found"

**Solución:**
```powershell
# Instalar Chrome en el sistema
# O usar ChromeHeadless:
ng test --browsers=ChromeHeadless
```

#### ❌ Error: "Cannot find module '@capacitor/preferences'"

**Solución:**
```powershell
npm install @capacitor/preferences --save
```

#### ❌ Tests fallan por timeout

**Solución:** Aumentar timeout en `karma.conf.js`:
```javascript
browserNoActivityTimeout: 60000, // 60 segundos
```

#### ❌ Error: "HttpClientTestingModule not imported"

**Solución:** Agregar en el spec:
```typescript
imports: [HttpClientTestingModule]
```

### Ver Logs Detallados

```powershell
ng test --browsers=ChromeHeadless --log-level=debug
```

### Ejecutar Solo Tests Fallidos

```powershell
ng test --watch=true
# En la UI de Karma, hacer clic en test fallido
```

---

## 8. CI/CD Integration

### GitHub Actions

Crear `.github/workflows/test.yml`:

```yaml
name: Frontend Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: windows-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
    
    - name: Install dependencies
      run: |
        cd src/fritolay-app
        npm ci
    
    - name: Run tests
      run: |
        cd src/fritolay-app
        npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./src/fritolay-app/coverage/app/lcov.info
```

### Azure DevOps Pipeline

```yaml
trigger:
  - main
  - develop

pool:
  vmImage: 'windows-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '20.x'
  displayName: 'Install Node.js'

- script: |
    cd src\fritolay-app
    npm ci
  displayName: 'Install dependencies'

- script: |
    cd src\fritolay-app
    npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage
  displayName: 'Run tests'

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '**/TESTS-*.xml'
  displayName: 'Publish test results'

- task: PublishCodeCoverageResults@1
  inputs:
    codeCoverageTool: 'Cobertura'
    summaryFileLocation: '$(System.DefaultWorkingDirectory)/src/fritolay-app/coverage/app/cobertura-coverage.xml'
  displayName: 'Publish coverage'
```

---

## 9. Best Practices

### ✅ DO

- ✅ Ejecutar pruebas antes de cada commit
- ✅ Mantener cobertura > 80%
- ✅ Usar mocks para servicios externos
- ✅ Nombrar tests descriptivamente: `debe hacer X cuando Y`
- ✅ Agrupar tests relacionados con `describe()`
- ✅ Limpiar estado entre tests con `beforeEach()`
- ✅ Usar `async/await` para pruebas asíncronas
- ✅ Verificar estados finales con `expect()`

### ❌ DON'T

- ❌ No hacer requests HTTP reales (usar HttpTestingController)
- ❌ No depender de estado global
- ❌ No usar `setTimeout()` en tests (usar `fakeAsync`, `tick`)
- ❌ No commitear código que rompe tests
- ❌ No ignorar warnings de coverage
- ❌ No hardcodear valores sensibles en tests

---

## 10. Comandos Rápidos

```powershell
# Ejecutar todos los tests
npm test

# Tests en modo CI (una vez)
npm run test -- --watch=false --browsers=ChromeHeadless

# Con cobertura
npm run test -- --watch=false --code-coverage

# Solo servicios
npm run test -- --include='**/services/**/*.spec.ts'

# Solo páginas
npm run test -- --include='**/pages/**/*.spec.ts'

# Debug mode
npm run test -- --browsers=Chrome

# Ver reporte de cobertura
start coverage/app/index.html
```

---

## 11. Documentación Relacionada

| Documento | Ubicación |
|-----------|-----------|
| **Plan de Casos de Prueba** | `/Test/test_case_frontend_movil.md` |
| **SRS Frontend** | `/Docs/SRS/SRS_Frontend_Movil.md` |
| **SDD Frontend** | `/Docs/SDD/DD_Arquitectura_Frontend_Movil.md` |
| **README Principal** | `/README.md` |

---

## 12. Soporte

**Errores en Tests:**
1. Revisar logs en la terminal
2. Abrir DevTools en Chrome (modo debug)
3. Verificar imports en el spec
4. Consultar documentación de Jasmine: https://jasmine.github.io/

**Preguntas:**
- Tech Lead: [email]
- QA Team: [email]
- Slack Channel: #frontend-testing

---

**Última Actualización:** 22 de febrero de 2026  
**Mantenido por:** QA Team + Frontend Team  
**Versión:** 1.1.0-pre.1
