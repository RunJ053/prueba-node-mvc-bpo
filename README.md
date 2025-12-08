# 📊 API REST BPO - Gestión de Contactos

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18-blue.svg)
![Sequelize](https://img.shields.io/badge/Sequelize-6.35-orange.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)
![Jest](https://img.shields.io/badge/Jest-29.7-red.svg)

API RESTful desarrollada con Node.js, Express y MySQL para la gestión de contactos en un entorno BPO (Business Process Outsourcing). Implementa arquitectura MVC con capa de servicios, validaciones robustas y pruebas E2E.

## 📑 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints](#-endpoints)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Testing](#-testing)
- [Scripts Disponibles](#-scripts-disponibles)
- [Modelo de Datos](#-modelo-de-datos)
- [Buenas Prácticas](#-buenas-prácticas)

---

## ✨ Características

- ✅ **CRUD Completo** de gestiones con MySQL
- ✅ **Arquitectura MVC** con capa de servicios
- ✅ **Validaciones** robustas con Joi
- ✅ **Paginación** y metadatos en listados
- ✅ **Filtros múltiples**: fecha, tipificación, asesor, búsqueda de texto
- ✅ **Manejo de errores** centralizado
- ✅ **Tests E2E** con Jest y Supertest
- ✅ **Borrado lógico** (cambio de estado)
- ✅ **Índices de BD** para optimización
- ✅ **Documentación** completa

---

## 🛠 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime de JavaScript |
| Express | 4.18+ | Framework web |
| Sequelize | 6.35+ | ORM para MySQL |
| MySQL | 8.0 | Base de datos |
| Joi | 17.11+ | Validación de esquemas |
| Jest | 29.7+ | Framework de testing |
| Supertest | 6.3+ | Testing de APIs HTTP |

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** >= 8.0
- **MySQL Workbench** (recomendado)

---

## 🚀 Instalación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/prueba-node-mvc-bpo.git
cd prueba-node-mvc-bpo
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar Base de Datos MySQL

#### Opción A: Usando MySQL Workbench

1. Abrir MySQL Workbench
2. Conectar a tu servidor MySQL
3. Ejecutar el siguiente script SQL:

```sql
-- Crear base de datos
CREATE DATABASE bpo_prueba 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Crear usuario
CREATE USER 'bpo_user'@'%' 
IDENTIFIED BY 'bpo_pass';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON bpo_prueba.* 
TO 'bpo_user'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;
```

#### Opción B: Usando MySQL CLI

```bash
mysql -u root -p
```

Luego ejecutar el script SQL anterior.

### 4️⃣ Configurar variables de entorno

Copiar el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bpo_prueba
DB_USER=bpo_user
DB_PASSWORD=bpo_pass
DB_DIALECT=mysql

# Logging
LOG_LEVEL=info
```

### 5️⃣ Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

Si todo está correcto, deberías ver:

```
✅ Conexión a MySQL establecida correctamente
✅ Modelos sincronizados con la base de datos
==================================================
✅ Servidor corriendo en puerto 3000
🌐 URL: http://localhost:3000
🏥 Health: http://localhost:3000/health
📊 API: http://localhost:3000/api/v1
🗂️  Gestiones: http://localhost:3000/api/v1/gestiones
⚙️  Entorno: development
==================================================
```

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_NAME` | Nombre de la BD | `bpo_prueba` |
| `DB_USER` | Usuario de MySQL | `bpo_user` |
| `DB_PASSWORD` | Contraseña | `bpo_pass` |
| `DB_DIALECT` | Dialecto SQL | `mysql` |

---

## 📁 Estructura del Proyecto

```
prueba-node-mvc-bpo/
├── package.json              # Dependencias y scripts
├── .env.example              # Ejemplo de variables de entorno
├── .gitignore               # Archivos ignorados por Git
├── jest.config.js           # Configuración de Jest
├── README.md                # Este archivo
└── src/
    ├── app.js               # Configuración de Express
    ├── server.js            # Punto de entrada del servidor
    ├── config/
    │   └── database.js      # Configuración de Sequelize
    ├── models/
    │   ├── index.js         # Índice de modelos
    │   └── gestion.model.js # Modelo de Gestión
    ├── services/
    │   └── gestion.service.js # Lógica de negocio
    ├── controllers/
    │   └── gestion.controller.js # Controladores
    ├── routes/
    │   ├── index.js         # Router principal
    │   └── gestion.routes.js # Rutas de gestiones
    ├── middlewares/
    │   ├── error.handler.js # Manejo de errores
    │   └── validate.js      # Middleware de validación
    ├── validations/
    │   └── gestion.schema.js # Esquemas Joi
    └── tests/
        └── gestion.e2e.test.js # Tests E2E
```

---

## 🔌 Endpoints

Base URL: `http://localhost:3000/api/v1`

### Health Check

```http
GET /health
```

### Gestiones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/gestiones` | Crear gestión |
| `GET` | `/gestiones` | Listar gestiones (con filtros) |
| `GET` | `/gestiones/:id` | Obtener gestión por ID |
| `PUT` | `/gestiones/:id` | Actualizar gestión completa |
| `PATCH` | `/gestiones/:id` | Actualizar gestión parcial |
| `DELETE` | `/gestiones/:id` | Eliminar gestión (borrado lógico) |

---

## 📝 Ejemplos de Uso

### 1. Crear una Gestión

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/gestiones \
  -H "Content-Type: application/json" \
  -d '{
    "clienteDocumento": "123456789",
    "clienteNombre": "Juan Pérez",
    "asesorId": "ASE001",
    "tipificacion": "Contacto Efectivo",
    "subtipificacion": "Cliente interesado",
    "canalOficial": true,
    "valorCompromiso": 5000.50,
    "fechaCompromiso": "2025-12-31T00:00:00.000Z",
    "observaciones": "Cliente se compromete a pagar",
    "recordingUrl": "https://example.com/recording/123"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Gestión creada exitosamente",
  "data": {
    "id": 1,
    "clienteDocumento": "123456789",
    "clienteNombre": "Juan Pérez",
    "asesorId": "ASE001",
    "tipificacion": "Contacto Efectivo",
    "subtipificacion": "Cliente interesado",
    "canalOficial": true,
    "valorCompromiso": "5000.50",
    "fechaCompromiso": "2025-12-31T00:00:00.000Z",
    "observaciones": "Cliente se compromete a pagar",
    "recordingUrl": "https://example.com/recording/123",
    "estado": "abierta",
    "createdAt": "2025-12-05T10:30:00.000Z",
    "updatedAt": "2025-12-05T10:30:00.000Z"
  }
}
```

### 2. Listar Gestiones con Filtros

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/gestiones?page=1&limit=10&tipificacion=Contacto%20Efectivo&asesorId=ASE001"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Gestiones obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "clienteDocumento": "123456789",
      "clienteNombre": "Juan Pérez",
      "asesorId": "ASE001",
      "tipificacion": "Contacto Efectivo",
      "estado": "abierta",
      "createdAt": "2025-12-05T10:30:00.000Z",
      "updatedAt": "2025-12-05T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Filtros Disponibles

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | number | Número de página | `?page=1` |
| `limit` | number | Registros por página (max 100) | `?limit=10` |
| `q` | string | Búsqueda en nombre/documento | `?q=Juan` |
| `tipificacion` | string | Filtrar por tipificación | `?tipificacion=Contacto%20Efectivo` |
| `asesorId` | string | Filtrar por asesor | `?asesorId=ASE001` |
| `estado` | string | Filtrar por estado | `?estado=abierta` |
| `desde` | date | Fecha desde (ISO 8601) | `?desde=2025-01-01` |
| `hasta` | date | Fecha hasta (ISO 8601) | `?hasta=2025-12-31` |

### 4. Obtener Gestión por ID

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/gestiones/1
```

### 5. Actualizar Gestión (PUT)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/v1/gestiones/1 \
  -H "Content-Type: application/json" \
  -d '{
    "clienteDocumento": "123456789",
    "clienteNombre": "Juan Pérez Actualizado",
    "asesorId": "ASE001",
    "tipificacion": "Pago Realizado"
  }'
```

### 6. Actualizar Parcialmente (PATCH)

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/gestiones/1 \
  -H "Content-Type: application/json" \
  -d '{
    "observaciones": "Pago confirmado",
    "valorCompromiso": 7500.00
  }'
```

### 7. Eliminar Gestión (Borrado Lógico)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/gestiones/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Gestión eliminada exitosamente (estado cambiado a cerrada)"
}
```

---

## 🧪 Testing

### Ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm test -- --coverage
```

### Resultado esperado

```
 PASS  src/tests/gestion.e2e.test.js
  API de Gestiones BPO - Tests E2E
    GET /health
      ✓ debería retornar estado 200 y mensaje de salud (50ms)
    POST /api/v1/gestiones
      ✓ debería crear una gestión válida exitosamente (120ms)
      ✓ debería fallar al crear gestión sin campos requeridos (45ms)
      ✓ debería fallar con tipificación inválida (40ms)
    GET /api/v1/gestiones
      ✓ debería listar todas las gestiones con paginación (80ms)
      ✓ debería filtrar por tipificación (75ms)
      ✓ debería filtrar por asesorId (70ms)
      ✓ debería buscar por nombre de cliente (65ms)
      ✓ debería respetar paginación (60ms)
    GET /api/v1/gestiones/:id
      ✓ debería obtener una gestión por ID (55ms)
      ✓ debería retornar 404 para ID inexistente (40ms)
      ✓ debería fallar con ID inválido (35ms)
    PUT /api/v1/gestiones/:id
      ✓ debería actualizar completamente una gestión (90ms)
      ✓ debería fallar al actualizar con datos inválidos (45ms)
    PATCH /api/v1/gestiones/:id
      ✓ debería actualizar parcialmente una gestión (85ms)
      ✓ debería fallar si no se envía ningún campo (40ms)
    DELETE /api/v1/gestiones/:id
      ✓ debería eliminar una gestión (borrado lógico) (70ms)
      ✓ debería retornar 404 al intentar eliminar gestión inexistente (35ms)

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
```

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Iniciar en producción | `npm start` | Inicia el servidor |
| Desarrollo | `npm run dev` | Inicia con nodemon |
| Tests | `npm test` | Ejecuta todos los tests |
| Tests watch | `npm run test:watch` | Tests en modo watch |

---

## 🗄️ Modelo de Datos

### Entidad: Gestion

| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `id` | INTEGER | ✅ | AUTO | ID autoincremental |
| `clienteDocumento` | STRING(50) | ✅ | - | Documento del cliente |
| `clienteNombre` | STRING(200) | ✅ | - | Nombre completo |
| `asesorId` | STRING(50) | ✅ | - | ID del asesor |
| `tipificacion` | ENUM | ✅ | - | Tipo de gestión |
| `subtipificacion` | STRING(100) | ❌ | null | Subtipo específico |
| `canalOficial` | BOOLEAN | ❌ | true | Canal oficial o no |
| `valorCompromiso` | DECIMAL(12,2) | ❌ | null | Valor monetario |
| `fechaCompromiso` | DATE | ❌ | null | Fecha del compromiso |
| `observaciones` | TEXT | ❌ | null | Observaciones (max 1000) |
| `recordingUrl` | STRING(500) | ❌ | null | URL de grabación |
| `estado` | ENUM | ❌ | abierta | Estado actual |
| `createdAt` | TIMESTAMP | ✅ | AUTO | Fecha de creación |
| `updatedAt` | TIMESTAMP | ✅ | AUTO | Fecha de actualización |

### Valores ENUM

**Tipificación:**
- Contacto Efectivo
- No Contacto
- Promesa de Pago
- Pago Realizado
- Refinanciación
- Información
- Escalamiento
- Otros

**Estado:**
- abierta
- cerrada

### Índices

- `idx_cliente_documento` en `clienteDocumento`
- `idx_asesor_id` en `asesorId`
- `idx_tipificacion` en `tipificacion`
- `idx_estado` en `estado`
- `idx_created_at` en `createdAt`

---

## 💡 Buenas Prácticas

### ✅ Implementadas

1. **Separación de capas** (Modelo-Servicio-Controlador)
2. **Validaciones** en cada capa (Joi + Sequelize)
3. **Manejo de errores** centralizado
4. **Paginación** eficiente
5. **Índices de BD** para optimización
6. **Borrado lógico** en vez de físico
7. **Tests automatizados** con alta cobertura
8. **Documentación** completa
9. **Variables de entorno** para configuración
10. **Commits semánticos** y versionamiento

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles

---

## 👤 Autor

Desarrollado como prueba técnica para posición Node.js Backend Developer

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que MySQL esté corriendo
2. Revisa las credenciales en `.env`
3. Confirma que el puerto 3000 esté libre
4. Revisa los logs del servidor

---

**¡Happy Coding! 🚀**