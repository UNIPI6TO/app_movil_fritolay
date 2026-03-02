# ✅ Checklist de Configuración CI/CD

Use esta checklist para verificar que los workflows de GitHub Actions están correctamente configurados.

## 📋 Pre-requisitos

### Repositorio GitHub
- [ ] El proyecto está en un repositorio de GitHub
- [ ] Tienes permisos de administrador/mantenedor
- [ ] La rama principal se llama `main` (o actualizar workflows si es diferente)

---

## 🔧 Archivos de Workflow

### Backend Workflow
- [x] Archivo `.github/workflows/backend-tests.yml` creado
- [ ] El path `src/backend/**` coincide con tu estructura de carpetas
- [ ] .NET SDK version `8.0.x` es correcto
- [ ] El comando `dotnet test` encuentra todos los proyectos de test

### Frontend Workflow
- [x] Archivo `.github/workflows/frontend-tests.yml` creado
- [ ] El path `src/fritolay-app/**` coincide con tu estructura
- [ ] Node.js version `20.x` es correcta
- [ ] El archivo `package-lock.json` existe en `src/fritolay-app/`

---

## 📦 Configuración de Proyecto

### Backend (src/backend)
- [x] Proyecto compila con `dotnet build`
- [x] Tests ejecutan con `dotnet test`
- [ ] Solución (.sln) incluye proyectos de test
- [ ] Los tests usan xUnit (o actualizar workflow para otro framework)

### Frontend (src/fritolay-app)
- [x] `package.json` tiene script `test:ci`
- [x] `package.json` tiene script `test:coverage`
- [x] `karma.conf.js` tiene reporter `lcovonly` configurado
- [x] Tests ejecutan con `npm run test:ci` localmente
- [ ] No hay errores de linter con `npm run lint`

---

## 🚀 Verificación de Workflows

### Probar Localmente

**Backend:**
```bash
cd src/backend
dotnet restore
dotnet build --configuration Release
dotnet test --verbosity normal
```
- [ ] ✅ Todos los comandos ejecutan sin errores

**Frontend:**
```bash
cd src/fritolay-app
npm ci
npm run lint
npm run test:ci
npm run build
```
- [ ] ✅ Todos los comandos ejecutan sin errores

### Probar en GitHub

#### Opción 1: Crear PR de Prueba
```bash
# 1. Crear rama de prueba
git checkout -b test/ci-cd-verification

# 2. Hacer un cambio mínimo (ej: agregar comentario)
echo "// Test CI/CD" >> src/backend/Program.cs

# 3. Commit y push
git add .
git commit -m "test: verificar workflows de CI/CD"
git push origin test/ci-cd-verification

# 4. Crear PR en GitHub hacia main
```

- [ ] ✅ Workflow de backend se ejecutó automáticamente
- [ ] ✅ Workflow de frontend se ejecutó automáticamente
- [ ] ✅ Ambos workflows completaron exitosamente
- [ ] ✅ Los checks aparecen en el PR

#### Opción 2: Push a Main (si tienes permisos)
```bash
git checkout main
git push origin main
```
- [ ] ✅ Workflows se ejecutan en push a main
- [ ] ✅ Resultados visibles en pestaña "Actions"

---

## 🔐 Branch Protection (Opcional pero Recomendado)

### Configurar en GitHub

1. **Ir a Settings del repositorio**
   - [ ] Settings → Branches

2. **Add branch protection rule**
   - [ ] Branch name pattern: `main`

3. **Configurar reglas:**
   - [ ] ✅ Require a pull request before merging
   - [ ] ✅ Require approvals: 1 (mínimo)
   - [ ] ✅ Require status checks to pass before merging
   - [ ] ✅ Require branches to be up to date before merging

4. **Seleccionar status checks requeridos:**
   - [ ] ✅ Backend Tests / test
   - [ ] ✅ Backend Tests / build-check
   - [ ] ✅ Frontend Tests / test
   - [ ] ✅ Frontend Tests / build-check
   - [ ] ✅ Frontend Tests / security-check

5. **Otras opciones (opcional):**
   - [ ] Require linear history
   - [ ] Include administrators (aplicar reglas a admins)

---

## 📊 Configuración de Codecov (Opcional)

### Si deseas reportes de cobertura

1. **Crear cuenta en Codecov**
   - [ ] Ir a https://codecov.io
   - [ ] Conectar con GitHub
   - [ ] Autorizar acceso al repositorio

2. **Obtener token**
   - [ ] Copiar token desde Codecov dashboard

3. **Configurar en GitHub**
   - [ ] Settings → Secrets and variables → Actions
   - [ ] New repository secret
   - [ ] Name: `CODECOV_TOKEN`
   - [ ] Value: [pegar token]
   - [ ] Add secret

4. **Verificar integración**
   - [ ] Crear nuevo PR
   - [ ] Verificar que Codecov comenta en el PR
   - [ ] Dashboard de Codecov muestra cobertura

---

## 🧪 Tests de Verificación

### Test 1: Backend Modified
```bash
# Modificar archivo de backend
echo "// Test" >> src/backend/Controllers/InfoController.cs
git add .
git commit -m "test: trigger backend workflow"
git push
```
- [ ] ✅ Solo backend-tests.yml se ejecuta
- [ ] ✅ frontend-tests.yml NO se ejecuta

### Test 2: Frontend Modified
```bash
# Modificar archivo de frontend
echo "// Test" >> src/fritolay-app/src/app/app.component.ts
git add .
git commit -m "test: trigger frontend workflow"
git push
```
- [ ] ✅ Solo frontend-tests.yml se ejecuta
- [ ] ✅ backend-tests.yml NO se ejecuta

### Test 3: Both Modified
```bash
# Modificar ambos
echo "// Test" >> src/backend/Program.cs
echo "// Test" >> src/fritolay-app/src/main.ts
git add .
git commit -m "test: trigger both workflows"
git push
```
- [ ] ✅ Ambos workflows se ejecutan en paralelo
- [ ] ✅ Resultados independientes

### Test 4: Workflow Modified
```bash
# Modificar workflow
echo "# Test" >> .github/workflows/backend-tests.yml
git add .
git commit -m "test: workflow modification"
git push
```
- [ ] ✅ Backend workflow se ejecuta
- [ ] ✅ Cambios aplicados correctamente

---

## 🐛 Solución de Problemas

### Workflow no se ejecuta

**Posibles causas:**
- [ ] ¿Los archivos de workflow están en `.github/workflows/`?
- [ ] ¿Los archivos tienen extensión `.yml` o `.yaml`?
- [ ] ¿El formato YAML es válido? (verificar con https://yamlchecker.com/)
- [ ] ¿El trigger `paths` coincide con archivos modificados?

### Tests fallan en CI pero pasan localmente

**Verificar:**
- [ ] Timezone (usar UTC en tests)
- [ ] Variables de entorno faltantes
- [ ] Archivos no commiteados
- [ ] Versiones diferentes de dependencias
- [ ] Permisos de archivos

### Build falla con "npm ci"

**Solución:**
```bash
cd src/fritolay-app
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "chore: update lockfile"
git push
```

### Coverage no se publica

**Verificar:**
- [ ] Reporter `lcovonly` en karma.conf.js
- [ ] Archivo `coverage/lcov.info` se genera
- [ ] Token de Codecov configurado (si aplica)

---

## ✅ Checklist Final

### Antes de Merge
- [ ] Todos los workflows se ejecutan correctamente
- [ ] Los tests pasan en CI
- [ ] No hay errores de linter
- [ ] El build de producción funciona
- [ ] No hay vulnerabilidades críticas (npm audit)
- [ ] La cobertura no disminuyó significativamente

### Documentación
- [ ] README principal actualizado
- [ ] README_WORKFLOWS.md revisado
- [ ] Equipo notificado de nuevos workflows
- [ ] Branch protection configurada (si aplica)

---

## 🎉 ¡Listo!

Si todos los items están marcados, tus workflows de CI/CD están correctamente configurados.

**Próximos pasos:**
1. ✅ Hacer merge del PR de configuración
2. ✅ Notificar al equipo sobre los nuevos workflows
3. ✅ Monitorear los primeros PRs con workflows activos
4. ✅ Ajustar configuración si es necesario

---

**Última actualización:** 22 de febrero de 2026  
**Versión:** 1.0.0
