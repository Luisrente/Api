const { Schema, model } = require('mongoose');

const CardApplicationSchema = Schema({
    user_id: { 
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
       },
       status: {
        type: String,
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


CardApplicationSchema.methods.toJSON = function() {
    const { __v,updatedAt, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'CardApplication', CardApplicationSchema );