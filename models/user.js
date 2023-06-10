
const { Schema, model } = require('mongoose');

const userSchema = Schema({
    uid: {
        type: String,
    },
    first_name: {
        type: String,
        required: [true, 'El nombre1 es obligatorio']
    },
    middle_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    second_last_name: {
        type: String,
        required: [true, 'El apellido2 es obligatorio']
    },
    identification: {
        type: Number,
        required: [true, 'Identification es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El programa es obligatorio']
    },
    campus: { 
        type: String, 
        ref: 'Campus', 
    },
    programs: [{ 
        type: String, 
    }],
    password: {
        type: String,
    },
    profile_picture: String,
    identification_picture: String,
    role: {
        type: String,
    },
    status: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});



userSchema.methods.toJSON = function() {
    const { __v, password, _id,createdAt, updatedAt , ...usuario  } = this.toObject();
    usuario.uid=_id;
    return usuario;
}

module.exports = model( 'User', userSchema );
