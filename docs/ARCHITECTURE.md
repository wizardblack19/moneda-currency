# Arquitectura del Sistema

## Visión General

Moneda Currency utiliza una arquitectura cliente-servidor de dos capas con separación clara entre frontend y backend.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│                    (Navegador Web)                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Vue.js 3 Application                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │ │
│  │  │  Components  │  │    State     │  │   HTTP Client    │ │ │
│  │  │  (UI Layer)  │  │  Management  │  │   (Fetch API)    │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/JSON
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVIDOR                                  │
│                    (Flask Backend)                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Flask Application                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │ │
│  │  │   Routes     │  │  Validators  │  │   Cache Layer    │ │ │
│  │  │  (API REST)  │  │  (Business)  │  │   (In-Memory)    │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API EXTERNA                                 │
│                  (ExchangeRate-API)                              │
│           https://api.exchangerate-api.com/v4/latest/            │
└─────────────────────────────────────────────────────────────────┘
```

## Componentes del Sistema

### 1. Capa de Presentación (Frontend)

**Tecnologías:** Vue.js 3, TailwindCSS, HTML5

#### Componentes Principales

| Componente | Archivo | Responsabilidad |
|------------|---------|-----------------|
| Vista Principal | `index.html` | Estructura HTML y estilos |
| Aplicación Vue | `script.js` | Lógica reactiva y estado |

#### Estado de la Aplicación

```javascript
{
    // Datos de conversión
    amount: Number,           // Cantidad a convertir
    fromCurrency: String,     // Moneda origen (código ISO)
    toCurrency: String,       // Moneda destino (código ISO)
    currencies: Array,        // Lista de monedas disponibles
    result: Object,           // Resultado de conversión

    // Estado de UI
    loading: Boolean,         // Indicador de carga
    error: String,            // Mensaje de error
    serverStatus: Boolean,    // Estado del servidor

    // Dropdowns
    fromSearch: String,       // Búsqueda en dropdown origen
    toSearch: String,         // Búsqueda en dropdown destino
    showFromDropdown: Boolean,
    showToDropdown: Boolean
}
```

### 2. Capa de Negocio (Backend)

**Tecnologías:** Python 3.8+, Flask 3.0.0

#### Módulos

| Módulo | Responsabilidad |
|--------|-----------------|
| Routes | Definición de endpoints REST |
| Validators | Validación de parámetros de entrada |
| Cache | Almacenamiento temporal de tasas |
| API Client | Comunicación con API externa |

#### Sistema de Caché

```
┌─────────────────────────────────────────────────┐
│              Sistema de Caché                    │
├─────────────────────────────────────────────────┤
│  Tipo: Diccionario en memoria                   │
│  TTL: 5 minutos (300 segundos)                  │
│  Clave: Código de moneda base                   │
│  Valor: {rates, timestamp}                      │
└─────────────────────────────────────────────────┘
```

**Flujo de Caché:**

```
Request → ¿Existe en caché?
              │
         ┌────┴────┐
         │         │
        Sí        No
         │         │
         ▼         ▼
    ¿Expirado?   Fetch API
         │         │
    ┌────┴────┐    │
    │         │    │
   Sí        No    │
    │         │    │
    ▼         │    │
 Fetch API   │    │
    │         │    │
    └─────────┼────┘
              │
              ▼
        Guardar en caché
              │
              ▼
         Retornar datos
```

### 3. Capa de Datos (API Externa)

**Proveedor:** ExchangeRate-API

| Característica | Valor |
|----------------|-------|
| URL Base | `https://api.exchangerate-api.com/v4/latest/` |
| Formato | JSON |
| Actualización | Cada 24 horas |
| Timeout | 10 segundos |

## Flujo de Datos

### Conversión de Moneda

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Usuario │    │ Frontend │    │ Backend  │    │   API    │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │ Input datos   │               │               │
     │──────────────>│               │               │
     │               │               │               │
     │               │ Validar       │               │
     │               │ localmente    │               │
     │               │               │               │
     │               │ POST /api/convert             │
     │               │──────────────>│               │
     │               │               │               │
     │               │               │ Validar       │
     │               │               │ servidor      │
     │               │               │               │
     │               │               │ ¿Caché válido?│
     │               │               │───────┐       │
     │               │               │       │       │
     │               │               │<──────┘       │
     │               │               │ No            │
     │               │               │               │
     │               │               │ GET /latest/  │
     │               │               │──────────────>│
     │               │               │               │
     │               │               │    Rates      │
     │               │               │<──────────────│
     │               │               │               │
     │               │               │ Guardar caché │
     │               │               │ Calcular      │
     │               │               │               │
     │               │    Result     │               │
     │               │<──────────────│               │
     │               │               │               │
     │  Mostrar      │               │               │
     │<──────────────│               │               │
     │               │               │               │
```

## Patrones de Diseño

### 1. Patrón Cache-Aside
El backend implementa un patrón cache-aside para optimizar llamadas a la API externa.

### 2. Patrón Observer (Vue.js)
Vue.js implementa reactividad mediante el patrón observer para actualizar la UI automáticamente.

### 3. Patrón MVC Simplificado
- **Model:** Estado de Vue.js + Backend Flask
- **View:** Templates HTML + TailwindCSS
- **Controller:** Métodos de Vue.js + Rutas Flask

## Seguridad

### Validaciones

| Capa | Validación |
|------|------------|
| Frontend | Campos requeridos, formato numérico |
| Backend | Tipo de datos, rango de valores, códigos válidos |

### Protecciones

- **CORS:** Configurado para desarrollo (permite todo)
- **Input Sanitization:** Normalización de códigos de moneda
- **Error Handling:** Mensajes genéricos sin exposición de detalles internos
- **Timeout:** Límite de 10 segundos para llamadas externas

## Escalabilidad

### Consideraciones Actuales

| Aspecto | Estado Actual | Mejora Propuesta |
|---------|---------------|------------------|
| Caché | En memoria | Redis/Memcached |
| Servidor | Single-thread | Gunicorn/uWSGI |
| Base de datos | No aplica | PostgreSQL para historial |
| Balanceo | No aplica | Nginx + múltiples instancias |

### Puntos de Extensión

1. **Autenticación:** Agregar Flask-Login o JWT
2. **Rate Limiting:** Implementar Flask-Limiter
3. **Logging:** Configurar logging estructurado
4. **Métricas:** Integrar Prometheus/Grafana

## Dependencias

```
┌─────────────────────────────────────────────────┐
│                  Flask App                       │
├─────────────────────────────────────────────────┤
│  Flask 3.0.0                                    │
│    ├── Werkzeug (WSGI)                         │
│    ├── Jinja2 (Templates)                      │
│    ├── Click (CLI)                             │
│    └── ItsDangerous (Signing)                  │
│                                                  │
│  Flask-CORS 4.0.0                               │
│                                                  │
│  Requests 2.31.0                                │
│    ├── urllib3 (HTTP)                          │
│    ├── certifi (SSL)                           │
│    └── charset-normalizer                      │
└─────────────────────────────────────────────────┘
```

## Diagrama de Clases (Conceptual)

```
┌─────────────────────────┐
│      Flask App          │
├─────────────────────────┤
│ - cache: dict           │
│ - CURRENCIES: dict      │
│ - CACHE_DURATION: int   │
├─────────────────────────┤
│ + get_exchange_rates()  │
│ + convert()             │
│ + get_currencies()      │
│ + health_check()        │
└─────────────────────────┘
           │
           │ usa
           ▼
┌─────────────────────────┐
│    ExchangeRate API     │
├─────────────────────────┤
│ + GET /latest/{base}    │
└─────────────────────────┘
```
