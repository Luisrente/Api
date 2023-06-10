const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
   },
  program_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Program', 
    required: true 
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

enrollmentSchema.methods.toJSON = function() {
  const { __v,createdAt, updatedAt , ...enrollment  } = this.toObject();
  return enrollment;
}

module.exports=model('Enrollment', enrollmentSchema);

