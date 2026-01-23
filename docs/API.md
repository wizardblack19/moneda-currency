# Documentación de API REST

## Información General

| Propiedad | Valor |
|-----------|-------|
| Base URL | `http://localhost:5000` |
| Formato | JSON |
| Encoding | UTF-8 |
| CORS | Habilitado |

## Endpoints

### GET /

Sirve la página principal de la aplicación.

**Request:**
```http
GET / HTTP/1.1
Host: localhost:5000
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
...
```

---

### POST /api/convert

Realiza la conversión entre dos monedas.

**Request:**
```http
POST /api/convert HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
    "amount": 100,
    "from_currency": "USD",
    "to_currency": "EUR"
}
```

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `amount` | number | Sí | Cantidad a convertir (> 0) |
| `from_currency` | string | Sí | Código ISO 4217 de moneda origen |
| `to_currency` | string | Sí | Código ISO 4217 de moneda destino |

**Response Exitoso (200):**
```json
{
    "success": true,
    "amount": 100,
    "from_currency": "USD",
    "to_currency": "EUR",
    "converted_amount": 92.15,
    "exchange_rate": 0.9215,
    "last_update": "2024-01-15T12:00:00Z"
}
```

**Response de Error - Parámetros faltantes (400):**
```json
{
    "success": false,
    "error": "Faltan parámetros requeridos: amount, from_currency, to_currency"
}
```

**Response de Error - Cantidad inválida (400):**
```json
{
    "success": false,
    "error": "La cantidad debe ser un número válido mayor a 0"
}
```

**Response de Error - Moneda inválida (400):**
```json
{
    "success": false,
    "error": "Código de moneda inválido. Debe ser un código de 3 letras."
}
```

**Response de Error - Servidor (500):**
```json
{
    "success": false,
    "error": "Error al obtener tasas de cambio. Por favor, intente más tarde."
}
```

---

### GET /api/currencies

Obtiene la lista de monedas disponibles.

**Request:**
```http
GET /api/currencies HTTP/1.1
Host: localhost:5000
```

**Response Exitoso (200):**
```json
{
    "success": true,
    "currencies": [
        {
            "code": "USD",
            "name": "Dólar Estadounidense"
        },
        {
            "code": "EUR",
            "name": "Euro"
        },
        {
            "code": "GBP",
            "name": "Libra Esterlina"
        }
        // ... más monedas
    ]
}
```

---

### GET /api/health

Verifica el estado del servidor.

**Request:**
```http
GET /api/health HTTP/1.1
Host: localhost:5000
```

**Response Exitoso (200):**
```json
{
    "status": "healthy",
    "timestamp": "2024-01-15T12:00:00.000000"
}
```

---

## Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 400 | Bad Request | Parámetros inválidos o faltantes |
| 500 | Internal Server Error | Error del servidor o API externa |

## Códigos de Moneda Soportados

### América
| Código | Nombre |
|--------|--------|
| USD | Dólar Estadounidense |
| CAD | Dólar Canadiense |
| MXN | Peso Mexicano |
| GTQ | Quetzal Guatemalteco |
| BRL | Real Brasileño |
| ARS | Peso Argentino |
| COP | Peso Colombiano |
| CLP | Peso Chileno |
| PEN | Sol Peruano |

### Europa
| Código | Nombre |
|--------|--------|
| EUR | Euro |
| GBP | Libra Esterlina |
| CHF | Franco Suizo |
| SEK | Corona Sueca |
| NOK | Corona Noruega |
| DKK | Corona Danesa |
| PLN | Zloty Polaco |

### Asia-Pacífico
| Código | Nombre |
|--------|--------|
| JPY | Yen Japonés |
| AUD | Dólar Australiano |
| CNY | Yuan Chino |
| INR | Rupia India |
| KRW | Won Surcoreano |
| SGD | Dólar de Singapur |
| HKD | Dólar de Hong Kong |
| NZD | Dólar Neozelandés |
| THB | Baht Tailandés |
| MYR | Ringgit Malayo |
| PHP | Peso Filipino |
| IDR | Rupia Indonesia |
| TWD | Dólar Taiwanés |

### Medio Oriente/África
| Código | Nombre |
|--------|--------|
| RUB | Rublo Ruso |
| ZAR | Rand Sudafricano |
| AED | Dirham de Emiratos Árabes |
| SAR | Riyal Saudí |
| TRY | Lira Turca |
| ILS | Nuevo Shekel Israelí |
| EGP | Libra Egipcia |

## Ejemplos de Uso

### cURL

**Convertir moneda:**
```bash
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "from_currency": "USD", "to_currency": "GTQ"}'
```

**Obtener monedas:**
```bash
curl http://localhost:5000/api/currencies
```

**Verificar salud:**
```bash
curl http://localhost:5000/api/health
```

### JavaScript (Fetch)

**Convertir moneda:**
```javascript
const response = await fetch('/api/convert', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        amount: 100,
        from_currency: 'USD',
        to_currency: 'EUR'
    })
});

const data = await response.json();

if (data.success) {
    console.log(`${data.amount} ${data.from_currency} = ${data.converted_amount} ${data.to_currency}`);
    console.log(`Tasa: ${data.exchange_rate}`);
} else {
    console.error(data.error);
}
```

### Python (Requests)

**Convertir moneda:**
```python
import requests

response = requests.post('http://localhost:5000/api/convert', json={
    'amount': 100,
    'from_currency': 'USD',
    'to_currency': 'EUR'
})

data = response.json()

if data['success']:
    print(f"{data['amount']} {data['from_currency']} = {data['converted_amount']} {data['to_currency']}")
else:
    print(f"Error: {data['error']}")
```

## Sistema de Caché

La API implementa un sistema de caché en memoria para optimizar el rendimiento:

| Propiedad | Valor |
|-----------|-------|
| Duración | 5 minutos |
| Tipo | En memoria (diccionario) |
| Clave | Código de moneda base |

**Comportamiento:**
1. Primera solicitud: Obtiene datos de ExchangeRate-API
2. Solicitudes posteriores (< 5 min): Retorna datos en caché
3. Después de 5 minutos: Renueva datos desde API externa

## Límites y Restricciones

| Restricción | Valor |
|-------------|-------|
| Timeout API externa | 10 segundos |
| Cantidad mínima | > 0 |
| Formato de moneda | 3 letras (ISO 4217) |
| Rate limiting | No implementado |

## Manejo de Errores

Todos los errores siguen el formato:

```json
{
    "success": false,
    "error": "Mensaje descriptivo del error"
}
```

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Faltan parámetros | No se enviaron todos los campos | Incluir amount, from_currency, to_currency |
| Cantidad inválida | amount <= 0 o no numérico | Enviar número positivo |
| Código inválido | Código de moneda no reconocido | Usar código ISO 4217 de 3 letras |
| Error de tasas | Fallo en API externa | Reintentar después |
