const { sequelize } = require('../config/database');
const Gestion = require('./gestion.model');

const db = {
    sequelize,
    Gestion
};

// Función para sincronizar modelos con la base de datos
const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force, alter: !force });
        console.log(`✅ Modelos sincronizados con la base de datos ${force ? '(FORZADO)' : ''}`);
    } catch (error) {
        console.error('❌ Error al sincronizar modelos:', error.message);
        throw error;
    }
    };

module.exports = { ...db, syncDatabase };