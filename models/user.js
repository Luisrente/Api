
const { Schema, model } = require('mongoose');

const userSchema = Schema({
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
    enrollments: [{
        type: Schema.Types.ObjectId, 
        ref: 'Enrollment',
    }],
    program_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Program',
    },
    campus_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Campus', 
    },
    password: {
        type: String,
    },
    profile_picture: String,
    identification_picture: String,
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
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
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'User', userSchema );
