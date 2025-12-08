const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gestion = sequelize.define('Gestion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    clienteDocumento: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
        notEmpty: { msg: 'El documento del cliente es requerido' },
        len: {
            args: [3, 50],
            msg: 'El documento debe tener entre 3 y 50 caracteres'
        }
        }
    },
    clienteNombre: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
        notEmpty: { msg: 'El nombre del cliente es requerido' },
        len: {
            args: [3, 200],
            msg: 'El nombre debe tener entre 3 y 200 caracteres'
        }
        }
    },
    asesorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
        notEmpty: { msg: 'El ID del asesor es requerido' }
        }
    },
    tipificacion: {
        type: DataTypes.ENUM(
        'Contacto Efectivo',
        'No Contacto',
        'Promesa de Pago',
        'Pago Realizado',
        'Refinanciación',
        'Información',
        'Escalamiento',
        'Otros'
        ),
        allowNull: false,
        validate: {
        notEmpty: { msg: 'La tipificación es requerida' }
        }
    },
    subtipificacion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    canalOficial: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    valorCompromiso: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        validate: {
        min: {
            args: [0],
            msg: 'El valor del compromiso debe ser mayor o igual a 0'
        }
        }
    },
    fechaCompromiso: {
        type: DataTypes.DATE,
        allowNull: true
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
        len: {
            args: [0, 1000],
            msg: 'Las observaciones no pueden exceder 1000 caracteres'
        }
        }
    },
    recordingUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
        isUrl: {
            msg: 'Debe ser una URL válida'
        }
        }
    },
    estado: {
        type: DataTypes.ENUM('abierta', 'cerrada'),
        defaultValue: 'abierta',
        allowNull: false
    }
    }, {
    tableName: 'gestiones',
    timestamps: true,
    indexes: [
        {
        name: 'idx_cliente_documento',
        fields: ['clienteDocumento']
        },
        {
        name: 'idx_asesor_id',
        fields: ['asesorId']
        },
        {
        name: 'idx_tipificacion',
        fields: ['tipificacion']
        },
        {
        name: 'idx_estado',
        fields: ['estado']
        },
        {
        name: 'idx_created_at',
        fields: ['createdAt']
        }
    ]
    });

module.exports = Gestion;