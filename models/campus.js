const { Schema, model } = require('mongoose');

const CampusSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});


CampusSchema.methods.toJSON = function() {
    const { __v,createdAt,updatedAt, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Campus', CampusSchema );