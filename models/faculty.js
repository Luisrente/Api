
const { Schema, model } = require('mongoose');

const FacultadSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        required: [true, 'UpdatedAt is required '],
        default: Date.now
    },
});


FacultadSchema.methods.toJSON = function() {
    const { __v,...data  } = this.toObject();
    return data;
}


module.exports = model( 'Faculty', FacultadSchema );
