const express = require('express');
const cors = require('cors');
const path = require('path');  // 🆕 AGREGADO
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.handler');

const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permitir solicitudes desde otros dominios
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser de JSON
app.use(express.json());

// Parser de URL-encoded (formularios)
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

// Logging de requests en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`, {
        query: req.query,
        body: Object.keys(req.body).length > 0 ? req.body : undefined
        });
        next();
    });
}

// ============================================
// RUTAS
// ============================================

// Health check directo (sin prefijo /api/v1)
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API con prefijo /api/v1
app.use('/api/v1', routes);

// Ruta para la interfaz web (debe estar ANTES del notFoundHandler)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));   
});

// ============================================
// MANEJO DE ERRORES
// ============================================

// Middleware para rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware centralizado de manejo de errores
app.use(errorHandler);

module.exports = app;