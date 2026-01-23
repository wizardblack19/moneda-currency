# Guía de Instalación

## Requisitos del Sistema

### Software Requerido

| Software | Versión Mínima | Recomendada |
|----------|----------------|-------------|
| Python | 3.8 | 3.10+ |
| pip | 20.0 | Última |
| Git | 2.0 | Última |
| Navegador | Chrome 80+ / Firefox 75+ | Última |

### Requisitos de Hardware

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| RAM | 512 MB | 1 GB |
| Disco | 100 MB | 500 MB |
| CPU | 1 core | 2 cores |

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd moneda-currency
```

### 2. Crear Entorno Virtual

#### Windows (PowerShell)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### Windows (CMD)
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

#### Linux/macOS
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias

```bash
pip install -r requirements.txt
```

**Dependencias instaladas:**
- Flask 3.0.0
- Flask-CORS 4.0.0
- requests 2.31.0

### 4. Verificar Instalación

```bash
python -c "import flask; print(f'Flask {flask.__version__}')"
python -c "import requests; print(f'Requests {requests.__version__}')"
```

## Ejecución

### Modo Desarrollo

```bash
python app.py
```

**Salida esperada:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://<tu-ip>:5000
```

### Acceder a la Aplicación

Abrir en navegador: `http://localhost:5000`

## Configuración

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 5000 |
| `DEBUG` | Modo debug | True |

#### Ejemplo de configuración:

**Windows (CMD):**
```cmd
set PORT=8080
set DEBUG=False
python app.py
```

**Windows (PowerShell):**
```powershell
$env:PORT = "8080"
$env:DEBUG = "False"
python app.py
```

**Linux/macOS:**
```bash
export PORT=8080
export DEBUG=False
python app.py
```

### Archivo .env (Opcional)

Crear archivo `.env` en la raíz:

```env
PORT=5000
DEBUG=True
```

> **Nota:** Requiere instalar `python-dotenv` para cargar automáticamente.

## Verificación

### 1. Verificar Servidor

```bash
curl http://localhost:5000/api/health
```

**Respuesta esperada:**
```json
{
    "status": "healthy",
    "timestamp": "2024-01-15T12:00:00.000000"
}
```

### 2. Verificar Monedas

```bash
curl http://localhost:5000/api/currencies
```

### 3. Probar Conversión

```bash
curl -X POST http://localhost:5000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "from_currency": "USD", "to_currency": "GTQ"}'
```

## Solución de Problemas

### Error: "Module not found"

**Causa:** Entorno virtual no activado o dependencias no instaladas.

**Solución:**
```bash
# Activar entorno
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/macOS

# Reinstalar dependencias
pip install -r requirements.txt
```

### Error: "Port already in use"

**Causa:** Otro proceso usa el puerto 5000.

**Solución:**
```bash
# Cambiar puerto
set PORT=8080  # Windows
export PORT=8080  # Linux/macOS
python app.py
```

O encontrar y cerrar el proceso:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Linux/macOS
lsof -i :5000
kill -9 <pid>
```

### Error: "Connection refused"

**Causa:** Servidor no está corriendo.

**Solución:**
1. Verificar que `python app.py` esté ejecutándose
2. Verificar la URL correcta (http://localhost:5000)
3. Verificar firewall

### Error: "Exchange rate API failed"

**Causa:** Problema con API externa o sin conexión a internet.

**Solución:**
1. Verificar conexión a internet
2. Probar acceso a: https://api.exchangerate-api.com/v4/latest/USD
3. Esperar si la API está temporalmente caída

## Despliegue en Producción

### Recomendaciones

1. **Desactivar modo debug:**
   ```bash
   export DEBUG=False
   ```

2. **Usar servidor WSGI:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Configurar proxy reverso (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. **Usar HTTPS** con Let's Encrypt

5. **Configurar CORS** para dominios específicos

## Actualización

```bash
# Obtener últimos cambios
git pull origin master

# Actualizar dependencias
pip install -r requirements.txt --upgrade

# Reiniciar servidor
```

## Desinstalación

```bash
# Desactivar entorno
deactivate

# Eliminar entorno virtual
rm -rf venv/  # Linux/macOS
rmdir /s venv  # Windows

# Eliminar proyecto (opcional)
cd ..
rm -rf moneda-currency/
```
