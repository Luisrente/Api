const { Faculty } = require('../models');
const Program = require('../models/faculty');
const createProgram = async(req, res = response ) => {
    try {
        const body= req.body;
        const programDB = await Program.findOne({ name: body.nombre });
        const faculty = await Faculty.findOne({ name: body.faculty });
        console.log(faculty);
        if (programDB) {
            const programUpdate = await Program.findByIdAndUpdate(programDB.id,
                {
                "name":name,
                "description":address,
                "faculty":faculty.id,
                });
        } else {
            const program = new Program({name:"INGENERIA SISTEMAS", description:"Para la industria",faculty_id: faculty._id, createdAt: Date.now() });
            await program.save(); 
        }
    } catch (error) {
        console.log(error);
    }
}

