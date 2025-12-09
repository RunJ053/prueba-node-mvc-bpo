const { Op } = require("sequelize");
const Gestion = require("../models/gestion.model");
const sequelize = require("../config/database");

class GestionService {

// ===============================
    // CREAR
// ===============================
    async crear(gestionData) {
        try {
            return await Gestion.create(gestionData);
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const messages = error.errors.map(e => e.message);
                throw new Error(`Errores de validación: ${messages.join(", ")}`);
            }
            throw error;
        }
    }

    // ===============================
    // LISTAR CON FILTROS Y PAGINACIÓN
    // ===============================
    async listar(filtros = {}) {
        const {
            page = 1,
            limit = 3,
            q = "",
            tipificacion,
            asesorId,
            estado,
            desde,
            hasta
        } = filtros;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const whereConditions = {};

        if (q.trim() !== "") {
            whereConditions[Op.or] = [
                { clienteNombre: { [Op.like]: `%${q}%` } },
                { clienteDocumento: { [Op.like]: `%${q}%` } }
            ];
        }

        if (tipificacion) whereConditions.tipificacion = tipificacion;
        if (asesorId) whereConditions.asesorId = asesorId;
        if (estado) whereConditions.estado = estado;

        // Rango de fechas
        if (desde || hasta) {
            whereConditions.createdAt = {};

            if (desde) whereConditions.createdAt[Op.gte] = new Date(desde);

            if (hasta) {
                const h = new Date(hasta);
                h.setHours(23, 59, 59, 999);
                whereConditions.createdAt[Op.lte] = h;
            }
        }

        const { count, rows } = await Gestion.findAndCountAll({
            where: whereConditions,
            limit: limitNum,
            offset,
            order: [["id", "ASC"]],
            distinct: true
        });

        return {
            data: rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                totalPages: Math.ceil(count / limitNum)
            }
        };
    }

    // ===============================
    // OBTENER POR ID
    // ===============================
    async obtenerPorId(id) {
        return await Gestion.findByPk(id);
    }

    // ===============================
    // ACTUALIZAR COMPLETO (PUT)
    // ===============================
    async actualizar(id, data) {
        const gestion = await Gestion.findByPk(id);

        if (!gestion) return null;

        try {
            await gestion.update(data);
            return gestion;
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const messages = error.errors.map(e => e.message);
                throw new Error(`Errores de validación: ${messages.join(", ")}`);
            }
            throw new Error(`Error al actualizar gestión: ${error.message}`);
        }
    }

    // ===============================
    // ACTUALIZAR PARCIAL (PATCH)
    // ===============================
    async actualizarParcial(id, data) {
        const gestion = await Gestion.findByPk(id);
        if (!gestion) return null;

        try {
            await gestion.update(data, { fields: Object.keys(data) });
            return gestion;
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const messages = error.errors.map(e => e.message);
                throw new Error(`Errores de validación: ${messages.join(", ")}`);
            }
            throw new Error(`Error al actualizar gestión: ${error.message}`);
        }
    }

    // ===============================
    // ELIMINAR (BORRADO REAL)
    // ===============================
    async eliminar(id) {
        const gestion = await Gestion.findByPk(id);
        if (!gestion) return false;

        await gestion.destroy(); // 💥 ELIMINACIÓN REAL
        return true;
    }

    // ===============================
    // ESTADÍSTICAS
    // ===============================
    async obtenerEstadisticas() {
        try {
            const total = await Gestion.count();
            const abiertas = await Gestion.count({ where: { estado: "abierta" } });
            const cerradas = await Gestion.count({ where: { estado: "cerrada" } });

            const porTipificacion = await Gestion.findAll({
                attributes: [
                    "tipificacion",
                    [sequelize.fn("COUNT", sequelize.col("id")), "count"]
                ],
                group: ["tipificacion"]
            });

            return { total, abiertas, cerradas, porTipificacion };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

module.exports = new GestionService();