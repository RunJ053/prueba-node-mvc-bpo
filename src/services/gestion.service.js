const { Op } = require('sequelize');
const Gestion = require('../models/gestion.model');

class GestionService {
    /**
     * Crear una nueva gestión
     * @param {Object} gestionData - Datos de la gestión
     * @returns {Promise<Object>} Gestión creada
     */
    async crear(gestionData) {
        try {
        const gestion = await Gestion.create(gestionData);
        return gestion;
        } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            throw new Error(`Errores de validación: ${messages.join(', ')}`);
        }
        throw error;
        }
    }

    /**
     * Listar gestiones con filtros y paginación
     * @param {Object} filtros - Filtros de búsqueda
     * @returns {Promise<Object>} Lista paginada de gestiones
     */
    async listar(filtros = {}) {
        const {
        page = 1,
        limit = 10,
        q = '',
        tipificacion,
        asesorId,
        estado,
        desde,
        hasta
        } = filtros;

        // Convertir a números
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;

        // Construir condiciones WHERE
        const whereConditions = {};

        // Búsqueda por texto (nombre o documento del cliente)
        if (q && q.trim() !== '') {
        whereConditions[Op.or] = [
            { clienteNombre: { [Op.like]: `%${q}%` } },
            { clienteDocumento: { [Op.like]: `%${q}%` } }
        ];
        }

        // Filtro por tipificación
        if (tipificacion) {
        whereConditions.tipificacion = tipificacion;
        }

        // Filtro por asesor
        if (asesorId) {
        whereConditions.asesorId = asesorId;
        }

        // Filtro por estado
        if (estado) {
        whereConditions.estado = estado;
        }

        // Filtro por rango de fechas
        if (desde || hasta) {
        whereConditions.createdAt = {};
        if (desde) {
            whereConditions.createdAt[Op.gte] = new Date(desde);
        }
        if (hasta) {
            // Agregar 23:59:59 a la fecha 'hasta' para incluir todo el día
            const hastaDate = new Date(hasta);
            hastaDate.setHours(23, 59, 59, 999);
            whereConditions.createdAt[Op.lte] = hastaDate;
        }
        }

        try {
        const { count, rows } = await Gestion.findAndCountAll({
            where: whereConditions,
            limit: limitNum,
            offset: offset,
            order: [['createdAt', 'DESC']],
            distinct: true
        });

        const totalPages = Math.ceil(count / limitNum);

        return {
            data: rows,
            pagination: {
            page: pageNum,
            limit: limitNum,
            total: count,
            totalPages: totalPages
            }
        };
        } catch (error) {
        throw new Error(`Error al listar gestiones: ${error.message}`);
        }
    }

    /**
     * Obtener una gestión por ID
     * @param {number} id - ID de la gestión
     * @returns {Promise<Object|null>} Gestión encontrada o null
     */
    async obtenerPorId(id) {
        try {
        const gestion = await Gestion.findByPk(id);
        return gestion;
        } catch (error) {
        throw new Error(`Error al obtener gestión: ${error.message}`);
        }
    }

    /**
   * Actualizar una gestión completamente (PUT)
   * @param {number} id - ID de la gestión
   * @param {Object} gestionData - Datos completos de la gestión
   * @returns {Promise<Object|null>} Gestión actualizada o null
   */
    async actualizar(id, gestionData) {
        try {
        const gestion = await Gestion.findByPk(id);
        
        if (!gestion) {
            return null;
        }

        await gestion.update(gestionData);
        return gestion;
        } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            throw new Error(`Errores de validación: ${messages.join(', ')}`);
        }
        throw new Error(`Error al actualizar gestión: ${error.message}`);
        }
    }

    /**
     * Actualizar parcialmente una gestión (PATCH)
     * @param {number} id - ID de la gestión
     * @param {Object} gestionData - Datos parciales a actualizar
     * @returns {Promise<Object|null>} Gestión actualizada o null
     */
    async actualizarParcial(id, gestionData) {
        try {
        const gestion = await Gestion.findByPk(id);
        
        if (!gestion) {
            return null;
        }

        // Solo actualizar los campos proporcionados
        await gestion.update(gestionData, { fields: Object.keys(gestionData) });
        return gestion;
        } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            throw new Error(`Errores de validación: ${messages.join(', ')}`);
        }
        throw new Error(`Error al actualizar gestión: ${error.message}`);
        }
    }

    /**
     * Eliminar (borrado lógico) una gestión
     * @param {number} id - ID de la gestión
     * @returns {Promise<boolean>} true si se eliminó, false si no existe
     */
    async eliminar(id) {
        try {
        const gestion = await Gestion.findByPk(id);
        
        if (!gestion) {
            return false;
        }

        // Borrado lógico: cambiar estado a 'cerrada'
        await gestion.update({ estado: 'cerrada' });
        return true;
        } catch (error) {
        throw new Error(`Error al eliminar gestión: ${error.message}`);
        }
    }

    /**
     * Obtener estadísticas de gestiones
     * @returns {Promise<Object>} Estadísticas
     */
    async obtenerEstadisticas() {
        try {
        const total = await Gestion.count();
        const abiertas = await Gestion.count({ where: { estado: 'abierta' } });
        const cerradas = await Gestion.count({ where: { estado: 'cerrada' } });

        const porTipificacion = await Gestion.findAll({
            attributes: [
            'tipificacion',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['tipificacion']
        });

        return {
            total,
            abiertas,
            cerradas,
            porTipificacion
        };
        } catch (error) {
        throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
    }

module.exports = new GestionService();