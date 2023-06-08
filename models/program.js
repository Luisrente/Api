const { Schema, model } = require('mongoose');

const ProgramSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    faculty_id: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
        required: [true, 'Faculty ID is required']
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
        required: [true, 'Updated at is required'],
        default: Date.now
    },
});


ProgramSchema.methods.toJSON = function() {
    const { __v,...data  } = this.toObject();
    return data;
}


module.exports = model( 'Program', ProgramSchema );