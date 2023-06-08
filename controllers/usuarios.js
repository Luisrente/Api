const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { decryptString } = require('../helpers/qr');
const Usuario = require('../models/user');
const User = require('../models/user');
const moment = require('moment-timezone');
const { Campus } = require('../models');
const {Faculty,Program,Enrollment} = require('../models/index');


const usuarioByCedula = async(req = request, res = response) => {
    try {
        const { cedula } = req.params;
        if (cedula) {
        const usuario = await Usuario.findOne({cedula});
        res.json(usuario);
        } 
 
    } catch (error) {  
        
    }     
}

const usuarioByQr = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        console.log(id);
        const token = decryptString(id.toString());
        console.log()
        if (token) {
            const now = new Date();

            console.log("----------------");
            console.log(now);
            console.log("---------------");


            const parts = token.split('/');
            const cedula=parts[0];
            const code= parts[1]+ ' '+ parts[2];
            const horaUTC = moment.utc(code);
            const horaServidor = moment();

            const horaBogota = horaUTC.tz('America/Bogota');
            const horaBocgota = horaServidor.tz('America/Bogota');
            console.log(horaBocgota);
            console.log(horaBogota);
            const diferenciaHoraria = horaBocgota.diff(horaBogota, 'seconds');

            console.log('Diferencia horaria en segundos entre el servidor y Bogotá:', diferenciaHoraria, 'segundos');

            const date = new Date(code);
            console.log(horaBogota);

            console.log(date);
            const diffInMilliseconds = Math.abs(horaBogota - horaUTC);
            const diffInSeconds = diffInMilliseconds / 1000;

            console.log(diffInSeconds);
            if (cedula  && diffInSeconds <= 120) {
              const usuario = await Usuario.findOne({cedula});
              res.status(200).json(usuario);
            } else{
                res.status(400).json({
                    msg: 'invalid parameter QR'
                })
            }    
        }
    } catch (error) { 
        console.log(error);
        res.status(404).json({
            msg: ' 404 invalid parameter QR'
        });    
    }     
}

const usuarioByIdGet = async(req = request, res = response) => {
    try {
        const { uid } = req.params;
        if (uid) {
        const usuario = await Usuario.findById(uid);
        res.json(usuario);
        } 
 
    } catch (error) {  
        
    }     
}


const usuariosAllGet = async(req = request, res = response) => {

    const { id } = req.params;
    if (id) {
    console.log("ddddddddd");
    const usuario = await Usuario.find();
    res.json(usuario);
    }

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });

    
}



const userPost = async(req, res = response) => {
    try {
        const body= req.body;
        const enrollmentDB = await Enrollment.findOne({ code: body.code });
        const userDB = await User.findOne({ identification: body.identification });
        const programDB = await Program.findOne({ name: body.nombre });
        console.log(userDB);
        console.log(programDB);
        if (enrollmentDB) {

            const enrollmentDBUpdate = await Enrollment.findByIdAndUpdate(user.id,
                {
                "user_id":  userDB.id,
                "program_id":  programDB.id,
                "semester": semester,
                }
                );
        } else {
            const enrollment = new Enrollment({user_id:userDB._id,program_id:programDB._id,semester:body.semester,code:body.code , createdAt: Date.now(),  });
            await enrollment.save(); 
        }
    } catch (error) {
        console.log(error);
   
    }
}


// const userPost = async(req, res = response) => {



// {
       
//     "first_name": "Joeehn",
//     "middle_name": "Doe",
//     "last_name": "Smissth",
//     "second_last_name": "Johnson",
//     "identification": 126266262621,
//     "email": "john.doe@example.com",
//     "role": "USER_ROLE",
//     "status":"ACTIVO",
//     "campus":"MONTERIA"
//   }





//     try {
//     const {
//         first_name,
//         middle_name,
//         last_name,
//         second_last_name,
//         identification,
//         email,
//         role,
//         status,
//         campus
//     } 
//     = req.body;
//     const user = await User.findOne({identification});
//     if (user) {
//         const userUpdate = await User.findByIdAndUpdate(user.id,
//         {
//         "first_name":first_name,
//         "middle_name":middle_name,
//         "last_name":last_name,
//         "second_last_name":second_last_name,
//         "identification":identification,
//         "email":email,
//         "role":role,
//         "status":status,
//         "campus":campus
//         });
//     } else {
//   const userCreate = new Usuario(
//     { 
//         first_name,
//         middle_name,
//         last_name,
//         second_last_name,
//         identification,
//         email,
//         role,
//         status,
//         campus
//    }
//    );
//     const salt = bcryptjs.genSaltSync();
//     userCreate.password = bcryptjs.hashSync( identification.toString(), salt );
//     campu = await Campus.findOne({"name":campus})
//     userCreate.campus_id= campu.id;
//     userCreate.createdAt= await  Date.now();
//     userCreate.profile_picture= '';
//     userCreate.identification_picture= '';
//     const result= await userCreate.save(); 
// }    

//     } catch (error) {
//         console.log(error);
//         res.status(400).json({
//             "msg": "User no create"
//         }); 
//     }  
// }








const usuariosPutState = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    const usuariod = await Usuario.findByIdAndUpdate( id, resto );
    const usuario = await Usuario.findById( id);

    res.json(usuario);
}

const usuariosPutPassword = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const user = await Usuario.findByIdAndUpdate( id, resto );
    const usuario = await Usuario.findById( id );
    res.json(usuario);
}


const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json(usuario);
}




module.exports = {

    userPost,

    usuariosAllGet,
    usuarioByIdGet,

    usuarioByCedula,
    usuarioByQr,

    usuariosPutPassword,
    usuariosPutState,


    usuariosPatch,
    usuariosDelete,
}