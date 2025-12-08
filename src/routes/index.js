const express = require('express');
const router = express.Router();
const gestionRoutes = require('./gestion.routes');

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

/**
 * Información de la API
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API BPO - Gestión de Contactos',
        version: '1.0.0',
        endpoints: {
        gestiones: '/api/v1/gestiones',
        health: '/health'
        }
    });
});

/**
 * Rutas de gestiones
 */
router.use('/gestiones', gestionRoutes);

module.exports = router;