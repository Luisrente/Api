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
  code: { 
    type: String, 
    required: true 
  },
  semester: { 
    type: String, 
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

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
