const Campus = require('../models/user');
const createCampus = async(req, res = response ) => {
    try {
        const campusDB = await Campus.findOne({ name: body.nombre });
        if (campusDB) {
            const userUpdate = await Campus.findByIdAndUpdate(user.id,
                {
                "name":name,
                "address":address,
                }
                );
        } else {
            const campu = new Campus({name:"MONTERIA", address:"CALLE 42 L",createdAt: Date.now() });
            await campu.save(); 
        }
    } catch (error) {
   
    }
}