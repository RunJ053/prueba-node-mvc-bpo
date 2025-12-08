const Joi = require('joi');

// Valores permitidos para tipificación
const tipificacionValues = [
    'Contacto Efectivo',
    'No Contacto',
    'Promesa de Pago',
    'Pago Realizado',
    'Refinanciación',
    'Información',
    'Escalamiento',
    'Otros'
    ];

    // Valores permitidos para estado
    const estadoValues = ['abierta', 'cerrada'];

    /**
     * Esquema de validación para crear una gestión
     */
    const crearGestionSchema = Joi.object({
    clienteDocumento: Joi.string()
        .min(3)
        .max(50)
        .required()
        .trim()
        .messages({
        'string.empty': 'El documento del cliente es requerido',
        'string.min': 'El documento debe tener al menos 3 caracteres',
        'string.max': 'El documento no puede exceder 50 caracteres',
        'any.required': 'El documento del cliente es requerido'
        }),

    clienteNombre: Joi.string()
        .min(3)
        .max(200)
        .required()
        .trim()
        .messages({
        'string.empty': 'El nombre del cliente es requerido',
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'string.max': 'El nombre no puede exceder 200 caracteres',
        'any.required': 'El nombre del cliente es requerido'
        }),

    asesorId: Joi.string()
        .required()
        .trim()
        .messages({
        'string.empty': 'El ID del asesor es requerido',
        'any.required': 'El ID del asesor es requerido'
        }),

    tipificacion: Joi.string()
        .valid(...tipificacionValues)
        .required()
        .messages({
        'any.only': `La tipificación debe ser una de: ${tipificacionValues.join(', ')}`,
        'any.required': 'La tipificación es requerida'
        }),

    subtipificacion: Joi.string()
        .max(100)
        .allow(null, '')
        .optional()
        .messages({
        'string.max': 'La subtipificación no puede exceder 100 caracteres'
        }),

    canalOficial: Joi.boolean()
        .default(true)
        .messages({
        'boolean.base': 'El canal oficial debe ser verdadero o falso'
        }),

    valorCompromiso: Joi.number()
        .min(0)
        .precision(2)
        .allow(null)
        .optional()
        .messages({
        'number.min': 'El valor del compromiso debe ser mayor o igual a 0',
        'number.base': 'El valor del compromiso debe ser un número'
        }),

    fechaCompromiso: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
        'date.format': 'La fecha de compromiso debe estar en formato ISO 8601',
        'date.base': 'La fecha de compromiso debe ser una fecha válida'
        }),

    observaciones: Joi.string()
        .max(1000)
        .allow(null, '')
        .optional()
        .messages({
        'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
        }),

    recordingUrl: Joi.string()
        .uri()
        .max(500)
        .allow(null, '')
        .optional()
        .messages({
        'string.uri': 'La URL de grabación debe ser una URL válida',
        'string.max': 'La URL no puede exceder 500 caracteres'
        }),

    estado: Joi.string()
        .valid(...estadoValues)
        .default('abierta')
        .messages({
        'any.only': `El estado debe ser: ${estadoValues.join(' o ')}`
        })
    });

    /**
     * Esquema de validación para actualizar completamente una gestión (PUT)
     */
    const actualizarGestionSchema = crearGestionSchema;

    /**
     * Esquema de validación para actualización parcial (PATCH)
     */
    const actualizarParcialGestionSchema = Joi.object({
    clienteDocumento: Joi.string()
        .min(3)
        .max(50)
        .trim()
        .optional(),

    clienteNombre: Joi.string()
        .min(3)
        .max(200)
        .trim()
        .optional(),

    asesorId: Joi.string()
        .trim()
        .optional(),

    tipificacion: Joi.string()
        .valid(...tipificacionValues)
        .optional(),

    subtipificacion: Joi.string()
        .max(100)
        .allow(null, '')
        .optional(),

    canalOficial: Joi.boolean()
        .optional(),

    valorCompromiso: Joi.number()
        .min(0)
        .precision(2)
        .allow(null)
        .optional(),

    fechaCompromiso: Joi.date()
        .iso()
        .allow(null)
        .optional(),

    observaciones: Joi.string()
        .max(1000)
        .allow(null, '')
        .optional(),

    recordingUrl: Joi.string()
        .uri()
        .max(500)
        .allow(null, '')
        .optional(),

    estado: Joi.string()
        .valid(...estadoValues)
        .optional()
    }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
    });

    /**
     * Esquema de validación para query params (filtros de listado)
     */
    const listarGestionesSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
        'number.base': 'La página debe ser un número',
        'number.min': 'La página debe ser mayor o igual a 1'
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
        'number.base': 'El límite debe ser un número',
        'number.min': 'El límite debe ser mayor o igual a 1',
        'number.max': 'El límite no puede exceder 100'
        }),

    q: Joi.string()
        .max(200)
        .allow('')
        .optional()
        .messages({
        'string.max': 'La búsqueda no puede exceder 200 caracteres'
        }),

    tipificacion: Joi.string()
        .valid(...tipificacionValues)
        .optional()
        .messages({
        'any.only': `La tipificación debe ser una de: ${tipificacionValues.join(', ')}`
        }),

    asesorId: Joi.string()
        .max(50)
        .optional()
        .messages({
        'string.max': 'El ID del asesor no puede exceder 50 caracteres'
        }),

    estado: Joi.string()
        .valid(...estadoValues)
        .optional()
        .messages({
        'any.only': `El estado debe ser: ${estadoValues.join(' o ')}`
        }),

    desde: Joi.date()
        .iso()
        .optional()
        .messages({
        'date.format': 'La fecha "desde" debe estar en formato ISO 8601'
        }),

    hasta: Joi.date()
        .iso()
        .min(Joi.ref('desde'))
        .optional()
        .messages({
        'date.format': 'La fecha "hasta" debe estar en formato ISO 8601',
        'date.min': 'La fecha "hasta" debe ser posterior o igual a "desde"'
        })
    });

    /**
     * Esquema de validación para el parámetro ID
     */
    const idParamSchema = Joi.object({
    id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
        'number.base': 'El ID debe ser un número',
        'number.integer': 'El ID debe ser un número entero',
        'number.positive': 'El ID debe ser un número positivo',
        'any.required': 'El ID es requerido'
        })
    });

    module.exports = {
    crearGestionSchema,
    actualizarGestionSchema,
    actualizarParcialGestionSchema,
    listarGestionesSchema,
    idParamSchema
    };