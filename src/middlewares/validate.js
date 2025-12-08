/**
 * Middleware para validar datos usando esquemas Joi
 * @param {Object} schema - Esquema de validación Joi
 * @param {string} property - Propiedad del request a validar ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
        abortEarly: false, // Mostrar todos los errores
        stripUnknown: true // Eliminar campos no definidos en el schema
        });

        if (error) {
        const errorMessages = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errorMessages
        });
        }

        // Reemplazar los valores con los validados y sanitizados
        req[property] = value;
        next();
    };
    };

module.exports = validate;