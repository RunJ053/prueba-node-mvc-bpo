const gestionService = require('../services/gestion.service');

class GestionController {
    /**
     * POST /api/v1/gestiones - Crear nueva gestión
     */
    async crear(req, res, next) {
        try {
        const gestion = await gestionService.crear(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Gestión creada exitosamente',
            data: gestion
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * GET /api/v1/gestiones - Listar gestiones con filtros y paginación
     */
    async listar(req, res, next) {
        try {
        const resultado = await gestionService.listar(req.query);
        
        res.status(200).json({
            success: true,
            message: 'Gestiones obtenidas exitosamente',
            data: resultado.data,
            pagination: resultado.pagination
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * GET /api/v1/gestiones/:id - Obtener gestión por ID
     */
    async obtenerPorId(req, res, next) {
        try {
        const { id } = req.params;
        const gestion = await gestionService.obtenerPorId(id);
        
        if (!gestion) {
            return res.status(404).json({
            success: false,
            message: `Gestión con ID ${id} no encontrada`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gestión obtenida exitosamente',
            data: gestion
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * PUT /api/v1/gestiones/:id - Actualizar gestión completa
     */
    async actualizar(req, res, next) {
        try {
        const { id } = req.params;
        const gestion = await gestionService.actualizar(id, req.body);
        
        if (!gestion) {
            return res.status(404).json({
            success: false,
            message: `Gestión con ID ${id} no encontrada`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gestión actualizada exitosamente',
            data: gestion
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * PATCH /api/v1/gestiones/:id - Actualizar gestión parcialmente
     */
    async actualizarParcial(req, res, next) {
        try {
        const { id } = req.params;
        const gestion = await gestionService.actualizarParcial(id, req.body);
        
        if (!gestion) {
            return res.status(404).json({
            success: false,
            message: `Gestión con ID ${id} no encontrada`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gestión actualizada exitosamente',
            data: gestion
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * DELETE /api/v1/gestiones/:id - Eliminar gestión (borrado lógico)
     */
    async eliminar(req, res, next) {
        try {
        const { id } = req.params;
        const eliminada = await gestionService.eliminar(id);
        
        if (!eliminada) {
            return res.status(404).json({
            success: false,
            message: `Gestión con ID ${id} no encontrada`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gestión eliminada exitosamente (estado cambiado a cerrada)'
        });
        } catch (error) {
        next(error);
        }
    }

    /**
     * GET /api/v1/gestiones/estadisticas - Obtener estadísticas
     */
    async obtenerEstadisticas(req, res, next) {
        try {
        const estadisticas = await gestionService.obtenerEstadisticas();
        
        res.status(200).json({
            success: true,
            message: 'Estadísticas obtenidas exitosamente',
            data: estadisticas
        });
        } catch (error) {
        next(error);
        }
    }
}

module.exports = new GestionController();