# 🎓 Tutorial: Configurar CI/CD desde Cero

Guía paso a paso para configurar y usar los workflows de GitHub Actions en tu proyecto.

---

## 📚 Tabla de Contenidos

1. [Verificar Archivos](#1-verificar-archivos)
2. [Probar Workflows Localmente](#2-probar-workflows-localmente)
3. [Hacer Primer Commit](#3-hacer-primer-commit)
4. [Crear Pull Request de Prueba](#4-crear-pull-request-de-prueba)
5. [Ver Resultados](#5-ver-resultados)
6. [Configurar Branch Protection](#6-configurar-branch-protection)
7. [Uso Diario](#7-uso-diario)

---

## 1. Verificar Archivos

### 1.1 Verificar estructura de carpetas

Tu proyecto debe tener esta estructura:

```
app_movil_fritolay/
├── .github/
│   └── workflows/
│       ├── backend-tests.yml     ← Archivo de workflow backend
│       └── frontend-tests.yml    ← Archivo de workflow frontend
├── src/
│   ├── backend/                  ← Código del backend
│   │   ├── backend.csproj
│   │   ├── Program.cs
│   │   └── ...
│   └── fritolay-app/            ← Código del frontend
│       ├── package.json
│       ├── karma.conf.js
│       └── ...
└── README.md
```

### 1.2 Verificar que los workflows existen

```bash
# Desde la raíz del proyecto
ls -la .github/workflows/

# Deberías ver:
# backend-tests.yml
# frontend-tests.yml
```

---

## 2. Probar Workflows Localmente

Antes de hacer commit, verifica que todo funciona localmente.

### 2.1 Probar Backend

```bash
# Terminal 1: Backend
cd src/backend

# Restaurar dependencias
dotnet restore

# Compilar
dotnet build --configuration Release

# Ejecutar tests
dotnet test --verbosity normal
```

**Resultado esperado:**
```
Test Run Successful.
Total tests: 13
     Passed: 13
 Total time: 2.5 Seconds
```

### 2.2 Probar Frontend

```bash
# Terminal 2: Frontend
cd src/fritolay-app

# Instalar dependencias
npm ci

# Ejecutar linter
npm run lint

# Ejecutar tests
npm run test:ci
```

**Resultado esperado:**
```
Chrome Headless 145.0.0.0: Executed 44 of 45 (skipped 1) SUCCESS
TOTAL: 44 SUCCESS
```

---

## 3. Hacer Primer Commit

### 3.1 Verificar estado de Git

```bash
# Volver a la raíz del proyecto
cd ../..

# Ver archivos nuevos
git status
```

**Deberías ver:**
```
Untracked files:
  .github/workflows/backend-tests.yml
  .github/workflows/frontend-tests.yml
  .github/README_WORKFLOWS.md
  .github/CHECKLIST.md
  ... (otros archivos de documentación)

Modified files:
  src/fritolay-app/package.json
  src/fritolay-app/karma.conf.js
  README.md
```

### 3.2 Agregar archivos

```bash
# Agregar todos los archivos nuevos
git add .github/
git add src/fritolay-app/package.json
git add src/fritolay-app/karma.conf.js
git add README.md
```

### 3.3 Hacer commit

```bash
git commit -m "ci: agregar workflows de GitHub Actions para backend y frontend

- Añadir backend-tests.yml para tests de .NET
- Añadir frontend-tests.yml para tests de Angular
- Agregar scripts test:ci y test:coverage en package.json
- Configurar lcovonly reporter en karma.conf.js
- Actualizar README con sección de CI/CD
- Agregar documentación completa en .github/"
```

### 3.4 Push a GitHub

**⚠️ IMPORTANTE:** Si tienes branch protection configurada en `main`, necesitarás crear una rama:

```bash
# Opción A: Push directo a main (si tienes permisos)
git push origin main

# Opción B: Crear rama de feature (recomendado)
git checkout -b feature/ci-cd-setup
git push origin feature/ci-cd-setup
```

---

## 4. Crear Pull Request de Prueba

### 4.1 En GitHub Web

1. **Ve a tu repositorio en GitHub**
   ```
   https://github.com/TU_USUARIO/TU_REPO
   ```

2. **Click en "Pull requests"** (pestaña superior)

3. **Click en "New pull request"** (botón verde)

4. **Seleccionar ramas:**
   - Base: `main`
   - Compare: `feature/ci-cd-setup` (o tu rama)

5. **Click en "Create pull request"**

6. **Completar información:**
   ```
   Title: 🚀 Configurar CI/CD con GitHub Actions
   
   Description:
   ## Cambios
   - ✅ Workflow de backend (dotnet test)
   - ✅ Workflow de frontend (ng test)
   - ✅ Branch protection preparada
   - ✅ Documentación completa
   
   ## Tests
   - Backend: 13/13 passing ✅
   - Frontend: 44/44 passing ✅
   
   ## Checklist
   - [x] Tests pasan localmente
   - [x] Documentación actualizada
   - [x] Workflows funcionan
   ```

7. **Click en "Create pull request"** (botón verde)

---

## 5. Ver Resultados

### 5.1 Verificar que los workflows se ejecutan

**Inmediatamente después de crear el PR:**

1. En la página del PR, verás un mensaje:
   ```
   ⟳ Some checks haven't completed yet
   ```

2. Click en "Show all checks" para expandir

3. Deberías ver algo como:
   ```
   ⟳ Backend Tests / test — In progress...
   ⟳ Backend Tests / build-check — In progress...
   ⟳ Frontend Tests / test — Queued...
   ⟳ Frontend Tests / build-check — Queued...
   ⟳ Frontend Tests / security-check — Queued...
   ```

### 5.2 Seguir la ejecución en tiempo real

**Opción 1: Desde el PR**
- Click en "Details" junto a cualquier check
- Te llevará a la página de logs del workflow

**Opción 2: Pestaña Actions**
1. Click en "Actions" (pestaña superior del repo)
2. Verás todos los workflows ejecutándose
3. Click en cualquiera para ver logs detallados

### 5.3 Interpretar resultados

**✅ Success (Verde):**
```
✓ Backend Tests / test
✓ Backend Tests / build-check
✓ Frontend Tests / test
✓ Frontend Tests / build-check
✓ Frontend Tests / security-check

All checks have passed
```
→ **¡Puedes hacer merge!**

**❌ Failure (Rojo):**
```
✗ Frontend Tests / test — Details
✓ Backend Tests / test
...
```
→ **Hay que corregir errores antes de merge**

### 5.4 Ver logs de errores

Si un check falla:

1. Click en "Details" del check fallido
2. Verás el log completo
3. Busca la línea con ❌ o "Error:"
4. Copia el error
5. Corrige en tu código local
6. Push nuevo commit (el workflow se re-ejecuta automáticamente)

---

## 6. Configurar Branch Protection

### 6.1 Acceder a configuración

1. **En GitHub, ir a Settings** (pestaña del repo)
2. **Click en "Branches"** (menú izquierdo)
3. **Click en "Add branch protection rule"**

### 6.2 Configurar regla

**Branch name pattern:**
```
main
```

**Configuraciones recomendadas:**

✅ **Require a pull request before merging**
- ✅ Require approvals: 1
- ⬜ Dismiss stale pull request approvals when new commits are pushed
- ⬜ Require review from Code Owners

✅ **Require status checks to pass before merging**
- ✅ Require branches to be up to date before merging
- **Status checks required:** (buscar y seleccionar)
  - ✅ Backend Tests / test
  - ✅ Backend Tests / build-check
  - ✅ Frontend Tests / test
  - ✅ Frontend Tests / build-check
  - ✅ Frontend Tests / security-check

⬜ **Require conversation resolution before merging**
⬜ **Require signed commits**
⬜ **Require linear history** (opcional, recomendado)
⬜ **Include administrators** (aplicar reglas a admins)

⬜ **Allow force pushes** (NUNCA activar en main)
⬜ **Allow deletions** (NUNCA activar en main)

### 6.3 Guardar

Click en **"Create"** al final de la página

### 6.4 Verificar

Vuelve al PR y verás:
```
🔒 This branch is protected
Merging can be performed automatically once all required status checks pass
```

---

## 7. Uso Diario

### 7.1 Flujo de trabajo típico

```bash
# 1. Crear rama de feature
git checkout main
git pull origin main
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios
# ... editar archivos ...

# 3. Commit frecuentes
git add .
git commit -m "feat: descripción"

# 4. Push
git push origin feature/nueva-funcionalidad

# 5. Crear PR en GitHub
# → Los workflows se ejecutan automáticamente

# 6. Esperar que los checks pasen
# → Si fallan, corregir y hacer nuevo commit

# 7. Solicitar review (si branch protection lo requiere)

# 8. Hacer merge cuando todo esté ✅
```

### 7.2 Verificar tests antes de push (opcional)

```bash
# Backend
cd src/backend && dotnet test && cd ../..

# Frontend
cd src/fritolay-app && npm run test:ci && cd ../..
```

### 7.3 Comandos útiles

```bash
# Ver estado de workflows desde CLI
gh run list --limit 5

# Ver logs de última ejecución
gh run view --log

# Re-ejecutar workflow fallido
gh run rerun <run_id>
```

---

## 8. Troubleshooting

### Problema: "npm ci" falla

**Solución:**
```bash
cd src/fritolay-app
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "chore: update package-lock"
git push
```

### Problema: Tests pasan localmente pero fallan en CI

**Causas comunes:**
- Timezone (usar UTC en tests)
- Archivos no commiteados
- Variables de entorno faltantes

**Solución:**
```bash
# Verificar archivos no tracked
git status

# Ver diff con remoto
git diff origin/main

# Ejecutar tests en modo CI localmente
cd src/fritolay-app
npm run test:ci
```

### Problema: Workflow no se ejecuta

**Verificar:**
1. ¿Los archivos están en `.github/workflows/`?
2. ¿La extensión es `.yml`?
3. ¿El YAML es válido? → https://yamlchecker.com/
4. ¿El path trigger coincide con archivos modificados?

---

## 🎉 ¡Felicidades!

Ya tienes CI/CD configurado en tu proyecto. Cada PR será verificado automáticamente antes de merge.

---

## 📚 Recursos Adicionales

- [GitHub Actions Quickstart](https://docs.github.com/en/actions/quickstart)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

---

**Última actualización:** 22 de febrero de 2026  
**Versión:** 1.0.0
