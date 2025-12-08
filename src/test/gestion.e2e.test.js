const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/database');
const { syncDatabase } = require('../models');

// Variable para almacenar el ID de una gestión creada
let gestionId;

// Configuración antes de todas las pruebas
beforeAll(async () => {
  // Conectar y sincronizar base de datos
    await sequelize.authenticate();
    await syncDatabase(true); // true = recrear tablas para tests
    console.log('✅ Base de datos de test configurada');
    });

    // Limpiar después de todas las pruebas
    afterAll(async () => {
    await sequelize.close();
    console.log('✅ Conexión a base de datos cerrada');
    });

    describe('API de Gestiones BPO - Tests E2E', () => {
    
    // ============================================
    // TESTS DE HEALTH CHECK
    // ============================================
    describe('GET /health', () => {
        it('debería retornar estado 200 y mensaje de salud', async () => {
        const response = await request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message');
        });
    });

    // ============================================
    // TESTS DE CREACIÓN (POST)
    // ============================================
    describe('POST /api/v1/gestiones', () => {
        it('debería crear una gestión válida exitosamente', async () => {
        const nuevaGestion = {
            clienteDocumento: '123456789',
            clienteNombre: 'Juan Pérez',
            asesorId: 'ASE001',
            tipificacion: 'Contacto Efectivo',
            subtipificacion: 'Cliente interesado',
            canalOficial: true,
            valorCompromiso: 5000.50,
            fechaCompromiso: '2025-12-31T00:00:00.000Z',
            observaciones: 'Cliente se compromete a pagar en diciembre',
            recordingUrl: 'https://example.com/recording/123',
            estado: 'abierta'
        };

        const response = await request(app)
            .post('/api/v1/gestiones')
            .send(nuevaGestion)
            .expect('Content-Type', /json/)
            .expect(201);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.clienteDocumento).toBe(nuevaGestion.clienteDocumento);
        expect(response.body.data.clienteNombre).toBe(nuevaGestion.clienteNombre);
        expect(response.body.data.asesorId).toBe(nuevaGestion.asesorId);
        expect(response.body.data.tipificacion).toBe(nuevaGestion.tipificacion);

        // Guardar el ID para pruebas posteriores
        gestionId = response.body.data.id;
        });

        it('debería fallar al crear gestión sin campos requeridos', async () => {
        const gestionInvalida = {
            clienteDocumento: '987654321'
            // Faltan campos requeridos
        };

        const response = await request(app)
            .post('/api/v1/gestiones')
            .send(gestionInvalida)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('errors');
        expect(Array.isArray(response.body.errors)).toBe(true);
        });

        it('debería fallar con tipificación inválida', async () => {
        const gestionInvalida = {
            clienteDocumento: '111222333',
            clienteNombre: 'María García',
            asesorId: 'ASE002',
            tipificacion: 'Tipificación Inválida' // No está en el enum
        };

        const response = await request(app)
            .post('/api/v1/gestiones')
            .send(gestionInvalida)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('errors');
        });
    });

    // ============================================
    // TESTS DE LISTADO (GET)
    // ============================================
    describe('GET /api/v1/gestiones', () => {
        // Crear gestiones de prueba antes de los tests de listado
        beforeAll(async () => {
        const gestiones = [
            {
            clienteDocumento: '11111111',
            clienteNombre: 'Cliente Test 1',
            asesorId: 'ASE001',
            tipificacion: 'Promesa de Pago'
            },
            {
            clienteDocumento: '22222222',
            clienteNombre: 'Cliente Test 2',
            asesorId: 'ASE002',
            tipificacion: 'No Contacto'
            },
            {
            clienteDocumento: '33333333',
            clienteNombre: 'Cliente Test 3',
            asesorId: 'ASE001',
            tipificacion: 'Pago Realizado'
            }
        ];

        for (const gestion of gestiones) {
            await request(app).post('/api/v1/gestiones').send(gestion);
        }
        });

        it('debería listar todas las gestiones con paginación', async () => {
        const response = await request(app)
            .get('/api/v1/gestiones')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.pagination).toHaveProperty('page');
        expect(response.body.pagination).toHaveProperty('limit');
        expect(response.body.pagination).toHaveProperty('total');
        expect(response.body.pagination).toHaveProperty('totalPages');
        });

        it('debería filtrar por tipificación', async () => {
        const response = await request(app)
            .get('/api/v1/gestiones')
            .query({ tipificacion: 'Promesa de Pago' })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        response.body.data.forEach(gestion => {
            expect(gestion.tipificacion).toBe('Promesa de Pago');
        });
        });

        it('debería filtrar por asesorId', async () => {
        const response = await request(app)
            .get('/api/v1/gestiones')
            .query({ asesorId: 'ASE001' })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        response.body.data.forEach(gestion => {
            expect(gestion.asesorId).toBe('ASE001');
        });
        });

        it('debería buscar por nombre de cliente', async () => {
        const response = await request(app)
            .get('/api/v1/gestiones')
            .query({ q: 'Test 1' })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('debería respetar paginación', async () => {
        const response = await request(app)
            .get('/api/v1/gestiones')
            .query({ page: 1, limit: 2 })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.pagination.page).toBe(1);
        expect(response.body.pagination.limit).toBe(2);
        expect(response.body.data.length).toBeLessThanOrEqual(2);
        });
    });

    // ============================================
    // TESTS DE OBTENCIÓN POR ID (GET /:id)
    // ============================================
    describe('GET /api/v1/gestiones/:id', () => {
        it('debería obtener una gestión por ID', async () => {
        const response = await request(app)
            .get(`/api/v1/gestiones/${gestionId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('id', gestionId);
        expect(response.body.data).toHaveProperty('clienteDocumento');
        expect(response.body.data).toHaveProperty('clienteNombre');
        });

        it('debería retornar 404 para ID inexistente', async () => {
        const response = await request(app)
            .get('/api/v1/gestiones/99999')
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toContain('no encontrada');
        });

        it('debería fallar con ID inválido', async () => {
        const response = await request(app)
            .get('/api/v1/gestiones/abc')
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('success', false);
        });
    });

    // ============================================
    // TESTS DE ACTUALIZACIÓN (PUT)
    // ============================================
    describe('PUT /api/v1/gestiones/:id', () => {
        it('debería actualizar completamente una gestión', async () => {
        const datosActualizados = {
            clienteDocumento: '123456789',
            clienteNombre: 'Juan Pérez Actualizado',
            asesorId: 'ASE001',
            tipificacion: 'Pago Realizado',
            subtipificacion: 'Pago confirmado',
            canalOficial: true,
            observaciones: 'Actualización de test',
            estado: 'abierta'
        };

        const response = await request(app)
            .put(`/api/v1/gestiones/${gestionId}`)
            .send(datosActualizados)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data.clienteNombre).toBe(datosActualizados.clienteNombre);
        expect(response.body.data.tipificacion).toBe(datosActualizados.tipificacion);
        });

        it('debería fallar al actualizar con datos inválidos', async () => {
        const datosInvalidos = {
            clienteDocumento: 'ab', // Muy corto
            clienteNombre: 'Nombre',
            asesorId: 'ASE001',
            tipificacion: 'Contacto Efectivo'
        };

        const response = await request(app)
            .put(`/api/v1/gestiones/${gestionId}`)
            .send(datosInvalidos)
            .expect(400);

        expect(response.body).toHaveProperty('success', false);
        });
    });

    // ============================================
    // TESTS DE ACTUALIZACIÓN PARCIAL (PATCH)
    // ============================================
    describe('PATCH /api/v1/gestiones/:id', () => {
        it('debería actualizar parcialmente una gestión', async () => {
        const actualizacionParcial = {
            observaciones: 'Observación actualizada parcialmente',
            valorCompromiso: 7500.00
        };

        const response = await request(app)
            .patch(`/api/v1/gestiones/${gestionId}`)
            .send(actualizacionParcial)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data.observaciones).toBe(actualizacionParcial.observaciones);
        expect(parseFloat(response.body.data.valorCompromiso)).toBe(actualizacionParcial.valorCompromiso);
        });

        it('debería fallar si no se envía ningún campo', async () => {
        const response = await request(app)
            .patch(`/api/v1/gestiones/${gestionId}`)
            .send({})
            .expect(400);

        expect(response.body).toHaveProperty('success', false);
        });
    });

    // ============================================
    // TESTS DE ELIMINACIÓN (DELETE)
    // ============================================
    describe('DELETE /api/v1/gestiones/:id', () => {
        it('debería eliminar una gestión (borrado lógico)', async () => {
        const response = await request(app)
            .delete(`/api/v1/gestiones/${gestionId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.message).toContain('cerrada');

        // Verificar que el estado cambió a 'cerrada'
        const verificacion = await request(app)
            .get(`/api/v1/gestiones/${gestionId}`)
            .expect(200);

        expect(verificacion.body.data.estado).toBe('cerrada');
        });

        it('debería retornar 404 al intentar eliminar gestión inexistente', async () => {
        const response = await request(app)
            .delete('/api/v1/gestiones/99999')
            .expect(404);

        expect(response.body).toHaveProperty('success', false);
        });
    });
});