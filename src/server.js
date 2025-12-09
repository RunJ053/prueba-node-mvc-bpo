require('dotenv').config();
const app = require('./app');
const { sequelize, testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 3000;

/**
 * Iniciar servidor
 */
const startServer = async () => {
    try {
    // 1. Probar conexión a la base de datos
    console.log('🔌 Conectando a la base de datos...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
        console.error('❌ No se pudo conectar a la base de datos. Abortando...');
        process.exit(1);
    }

    // 2. Sincronizar modelos con la base de datos
    console.log('🔄 Sincronizando modelos...');
    await syncDatabase(false); // false = no forzar recreación de tablas

    // 3. Iniciar servidor Express
    app.listen(PORT, () => {
        console.log('');
        console.log('='.repeat(50));
        console.log(`✅ Servidor corriendo en puerto ${PORT}`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
        console.log(`🏥 Health: http://localhost:${PORT}/health`);
        console.log(`📊 API: http://localhost:${PORT}/api/v1`);
        console.log(`🗂️  Gestiones: http://localhost:${PORT}/api/v1/gestiones`);
        console.log(`⚙️  Entorno: ${process.env.NODE_ENV || 'development'}`);
        console.log('='.repeat(50));
        console.log('');
    });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
    console.log('⚠️ SIGTERM recibido. Cerrando servidor...');
    await sequelize.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('⚠️ SIGINT recibido. Cerrando servidor...');
    await sequelize.close();
    process.exit(0);
});

// Iniciar el servidor
startServer();