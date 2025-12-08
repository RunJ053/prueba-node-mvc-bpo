const express = require('express');
const router = express.Router();
const gestionController = require('../controllers/gestion.controller');
const validate = require('../middlewares/validate');
const {
    crearGestionSchema,
    actualizarGestionSchema,
    actualizarParcialGestionSchema,
    listarGestionesSchema,
    idParamSchema
} = require('../validations/gestion.schema');

    /**
     * POST /api/v1/gestiones
     * Crear una nueva gestión
     */
    router.post(
    '/',
    validate(crearGestionSchema, 'body'),
    gestionController.crear
    );

    /**
     * GET /api/v1/gestiones
     * Listar gestiones con filtros y paginación
     */
    router.get(
    '/',
    validate(listarGestionesSchema, 'query'),
    gestionController.listar
    );

    /**
     * GET /api/v1/gestiones/:id
     * Obtener una gestión por ID
     */
    router.get(
    '/:id',
    validate(idParamSchema, 'params'),
    gestionController.obtenerPorId
    );

    /**
     * PUT /api/v1/gestiones/:id
     * Actualizar completamente una gestión
     */
    router.put(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(actualizarGestionSchema, 'body'),
    gestionController.actualizar
    );

    /**
     * PATCH /api/v1/gestiones/:id
     * Actualizar parcialmente una gestión
     */
    router.patch(
    '/:id',
    validate(idParamSchema, 'params'),
    validate(actualizarParcialGestionSchema, 'body'),
    gestionController.actualizarParcial
    );

    /**
     * DELETE /api/v1/gestiones/:id
     * Eliminar una gestión (borrado lógico)
     */
    router.delete(
    '/:id',
    validate(idParamSchema, 'params'),
    gestionController.eliminar
    );

module.exports = router;