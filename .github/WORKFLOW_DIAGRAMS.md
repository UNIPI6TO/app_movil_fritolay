# Diagramas de Flujo - CI/CD Workflows

## 🔄 Flujo General de CI/CD

```mermaid
flowchart TB
    Start([Desarrollador crea PR]) --> Trigger{Archivos modificados?}
    
    Trigger -->|src/backend/**| BackendWF[Backend Workflow]
    Trigger -->|src/fritolay-app/**| FrontendWF[Frontend Workflow]
    Trigger -->|Ambos| Both[Ambos Workflows]
    
    BackendWF --> BackendTests[Run Backend Tests]
    BackendTests --> BackendBuild[Verify Build]
    BackendBuild --> BackendFormat[Check Code Format]
    BackendFormat --> BackendResult{Tests Pass?}
    
    FrontendWF --> FrontendTests[Run Frontend Tests]
    FrontendTests --> FrontendLint[Run Linter]
    FrontendLint --> FrontendBuild[Build Production]
    FrontendBuild --> FrontendSecurity[Security Audit]
    FrontendSecurity --> FrontendResult{Tests Pass?}
    
    BackendResult -->|✅ Yes| BackendSuccess[✅ Backend Check Pass]
    BackendResult -->|❌ No| BackendFail[❌ Backend Check Fail]
    
    FrontendResult -->|✅ Yes| FrontendSuccess[✅ Frontend Check Pass]
    FrontendResult -->|❌ No| FrontendFail[❌ Frontend Check Fail]
    
    BackendSuccess --> MergeCheck{All Checks Pass?}
    FrontendSuccess --> MergeCheck
    BackendFail --> Block[🚫 Merge Blocked]
    FrontendFail --> Block
    
    MergeCheck -->|✅ Yes| Approve[✅ Ready to Merge]
    MergeCheck -->|❌ No| Block
    
    Approve --> Merge([Merge to main])
    Block --> Fix([Developer fixes issues])
    Fix --> Start
    
    style BackendSuccess fill:#90EE90
    style FrontendSuccess fill:#90EE90
    style Approve fill:#90EE90
    style BackendFail fill:#FFB6C1
    style FrontendFail fill:#FFB6C1
    style Block fill:#FFB6C1
```

## 🔧 Backend Workflow Detallado

```mermaid
flowchart LR
    subgraph "Backend Tests Job"
        B1[Checkout Code] --> B2[Setup .NET 8]
        B2 --> B3[dotnet restore]
        B3 --> B4[dotnet build]
        B4 --> B5[dotnet test]
        B5 --> B6[Generate Coverage]
        B6 --> B7[Publish Results]
    end
    
    subgraph "Build Check Job"
        C1[Checkout Code] --> C2[Setup .NET 8]
        C2 --> C3[Build /warnaserror]
        C3 --> C4[dotnet format verify]
    end
    
    B7 --> Result{Success?}
    C4 --> Result
    Result -->|✅| Pass[PR Check Pass]
    Result -->|❌| Fail[PR Check Fail]
    
    style Pass fill:#90EE90
    style Fail fill:#FFB6C1
```

## 📱 Frontend Workflow Detallado

```mermaid
flowchart LR
    subgraph "Test Job"
        F1[Checkout Code] --> F2[Setup Node 20]
        F2 --> F3[npm ci]
        F3 --> F4[npm run lint]
        F4 --> F5[npm run test:ci]
        F5 --> F6[Generate Coverage]
        F6 --> F7[Comment on PR]
    end
    
    subgraph "Build Check Job"
        G1[Checkout Code] --> G2[Setup Node 20]
        G2 --> G3[npm ci]
        G3 --> G4[npm run build]
        G4 --> G5[Check Bundle Size]
    end
    
    subgraph "Security Check Job"
        H1[Checkout Code] --> H2[Setup Node 20]
        H2 --> H3[npm audit]
        H3 --> H4[Check Outdated]
    end
    
    F7 --> Result{All Pass?}
    G5 --> Result
    H4 --> Result
    Result -->|✅| Pass[PR Check Pass]
    Result -->|❌| Fail[PR Check Fail]
    
    style Pass fill:#90EE90
    style Fail fill:#FFB6C1
```

## 🎯 Flujo de Trabajo del Desarrollador

```mermaid
sequenceDiagram
    participant Dev as Desarrollador
    participant Git as Git Local
    participant GH as GitHub
    participant GHA as GitHub Actions
    participant PR as Pull Request
    
    Dev->>Git: git checkout -b feature/xyz
    Dev->>Git: Hacer cambios
    Dev->>Git: git commit -m "feat: xyz"
    Dev->>GH: git push origin feature/xyz
    Dev->>GH: Crear Pull Request
    
    Note over GH,GHA: Trigger automático
    
    GH->>GHA: Detecta PR a main
    GHA->>GHA: Analiza archivos modificados
    
    alt Backend modificado
        GHA->>GHA: Ejecuta backend-tests.yml
        GHA->>GHA: 13 tests unitarios
        GHA-->>PR: ✅ Backend Tests Pass
    end
    
    alt Frontend modificado
        GHA->>GHA: Ejecuta frontend-tests.yml
        GHA->>GHA: 44 tests unitarios
        GHA->>GHA: Build producción
        GHA->>GHA: npm audit
        GHA-->>PR: ✅ Frontend Tests Pass
    end
    
    PR->>Dev: Notificación de resultados
    
    alt Todos los checks pasan
        Dev->>PR: ✅ Merge Pull Request
        PR->>GH: Código integrado en main
    else Hay fallos
        Dev->>Git: Corregir errores
        Dev->>GH: git push (nuevo commit)
        Note over GH,GHA: Workflows se re-ejecutan
    end
```

## 📊 Cobertura de Código

```mermaid
flowchart TB
    subgraph "Backend Coverage"
        BE1[dotnet test --collect Coverage] --> BE2[Cobertura XML]
        BE2 --> BE3[Codecov Upload]
        BE3 --> BE4[Report on PR]
    end
    
    subgraph "Frontend Coverage"
        FE1[ng test --code-coverage] --> FE2[lcov.info]
        FE2 --> FE3[Codecov Upload]
        FE3 --> FE4[Comment on PR]
    end
    
    BE4 --> Dashboard[Codecov Dashboard]
    FE4 --> Dashboard
    
    style Dashboard fill:#87CEEB
```

## 🔐 Estrategia de Protección de Rama

```mermaid
flowchart TB
    PR[Pull Request a main] --> Check1{Backend Tests Pass?}
    Check1 -->|❌ No| Block1[🚫 Merge Bloqueado]
    Check1 -->|✅ Yes| Check2{Frontend Tests Pass?}
    
    Check2 -->|❌ No| Block2[🚫 Merge Bloqueado]
    Check2 -->|✅ Yes| Check3{Build Success?}
    
    Check3 -->|❌ No| Block3[🚫 Merge Bloqueado]
    Check3 -->|✅ Yes| Check4{Security OK?}
    
    Check4 -->|❌ No| Block4[🚫 Merge Bloqueado]
    Check4 -->|✅ Yes| Approve[✅ Aprobado para Merge]
    
    Approve --> Review{Code Review?}
    Review -->|Pendiente| Wait[⏳ Esperando Review]
    Review -->|Aprobado| Merge[🎉 Merge a main]
    
    Block1 --> Fix[Developer Fix]
    Block2 --> Fix
    Block3 --> Fix
    Block4 --> Fix
    Fix --> PR
    
    style Approve fill:#90EE90
    style Merge fill:#90EE90
    style Block1 fill:#FFB6C1
    style Block2 fill:#FFB6C1
    style Block3 fill:#FFB6C1
    style Block4 fill:#FFB6C1
```

## 📈 Métricas de Calidad

**Estado Actual:**

```mermaid
pie title Tests por Módulo
    "Backend xUnit" : 13
    "Frontend Unit" : 44
    "Frontend E2E" : 0
    "Integration" : 0
```

**Cobertura de Código:**

```mermaid
gantt
    title Cobertura de Código
    dateFormat X
    axisFormat %s%%
    
    section Backend
    Statements :done, 0, 100
    Branches   :done, 0, 90
    Functions  :done, 0, 95
    Lines      :done, 0, 98
    
    section Frontend
    Statements :active, 0, 30
    Branches   :active, 0, 13
    Functions  :active, 0, 29
    Lines      :active, 0, 30
```

---

**Última actualización:** 22 de febrero de 2026  
**Versión:** 1.1.0-pre.2-stable
