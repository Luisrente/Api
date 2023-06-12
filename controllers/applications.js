const Application = require('../models/cardApplication');
const User = require('../models/user');


const listApplications = async (req, res = response) => {
    try {
      const applications = await Application.find().populate('user_id');
      res.json(applications);
    } catch (error) {
      console.error('Error al obtener la lista de aplicaciones:', error);
      res.status(500).json({ error: 'Error al obtener la lista de aplicaciones' });
    }
}

const updateApplications = async (req, res = response) => {
    const { status , _id}= req.body;
    try {
      const applications = await Application.findByIdAndUpdate(_id,{status:status});
      if(applications){
          const user = await User.findByIdAndUpdate(applications.user_id,{status:status})
          res.json({user});
      }else{
        res.status(400).json({ error: 'Application not found' });
      }
    } catch (error) {
      console.error('Error al obtener la lista de aplicaciones:', error);
      res.status(500).json({ error: 'Error al obtener la lista de aplicaciones' });
    }
}


module.exports = {
    listApplications,
    updateApplications
}