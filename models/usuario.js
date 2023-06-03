
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    cedula: {
        type: String,
        required: [true, 'El cedula es obligatorio']
    },
    nombre1: {
        type: String,
        required: [true, 'El nombre1 es obligatorio']
    },
    nombre2: {
        type: String,
        required: [true, 'El nombre2 es obligatorio']
    },
    apellido1: {
        type: String,
        required: [true, 'El apellido1  es obligatorio']
    },
    apellido2: {
        type: String,
        required: [true, 'El apellido2 es obligatorio']
    },
    facultad: {
        type: String,
        required: [true, 'El facultad es obligatorio']
    },
    programa: {
        type: String,
        required: [true, 'El programa es obligatorio']
    },
    codigo: {
        type: String,
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    verifi: {
        type: String,
        required: [true, 'La verifi es obligatoria'],
    },
    cedulaImg: {
        type: String,
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});



UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );
