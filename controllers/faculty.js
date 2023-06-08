const Faculty = require('../models/faculty');
const createFaculty = async(req, res = response ) => {
    try {
        const body= req.body;
        const facultyDB = await Faculty.findOne({ name: body.nombre });
        if (facultyDB) {
            const userUpdate = await Faculty.findByIdAndUpdate(facultyDB.id,
                {
                "name":name,
                "description":address,
                });
        } else {
            const faculty = new Faculty({name:"FACULTAD DE INGENERIA", description:"Para la industria",createdAt: Date.now() });
            await faculty.save(); 
        }
    } catch (error) {
   
    }
}