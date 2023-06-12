const { Schema, model } = require('mongoose');

const codeAuthSchema = Schema({
    user_id: { 
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
       },
       code: {
        type: String,
       },
      createdAt: {
        type: Date,
        default: Date.now
       },
 
});


codeAuthSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'codeAuth', codeAuthSchema );