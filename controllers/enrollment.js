const { User, Program } = require('../models');
const Enrollment = require('../models/enrollment');
const createEnrollment = async(req, res = response ) => {
    try {
        const body= req.body;
        const enrollmentDB = await Enrollment.findOne({ code: body.code });
        const userDB = await User.findOne({ identification: body.identification });
        const programDB = await Program.findOne({ name: body.nombre });
        if (enrollmentDB) {

            const enrollmentDBUpdate = await Enrollment.findByIdAndUpdate(user.id,
                {
                "student":  userDB.id,
                "program":  programDB.id,
                "semester": semester,
                }
                );
        } else {
            const campu = new Campus({student:userDB.id,program:programDB.id, createdAt: Date.now(),  });
            await campu.save(); 
        }
    } catch (error) {
        console.log(error);
   
    }
}