const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { decryptString } = require('../helpers/qr');
const moment = require('moment-timezone');
const { Campus } = require('../models');
const {CardApplication, User} = require('../models/index');
const axios = require('axios');


const usuarioByCedula = async(req = request, res = response) => {
    try {
        const { cedula } = req.params;
        const identification= cedula;
        const usuario = await User.findOne({identification});
        if (usuario) {
        res.json(usuario);
        }else{
            res.status(400).json({
                "msj":"No Found 404"
            })    
        }
    } catch (error) {  
        res.status(500).json({
            "msj":"No Found 500"
        }) 
    }     
}

const usuarioByQr = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        console.log(id);
        const token = decryptString(id.toString());
        console.log(token);
        if (token) {
            const now = new Date();
            const parts = token.split('/');
            const identification=parts[0];
        
            const code= parts[1]+ ' '+ parts[2];
            const horaUTC = moment.utc(code);
            const horaServidor = moment();
            const horaBogota = horaUTC.tz('America/Bogota');
            const horaBocgota = horaServidor.tz('America/Bogota');
            const diferenciaHoraria = horaBocgota.diff(horaBogota, 'seconds');
            const date = new Date(code);
            const diffInMilliseconds = Math.abs(horaBogota - horaUTC);
            const diffInSeconds = diffInMilliseconds / 1000;

            const usuario = await User.findOne({identification});
            console.log(usuario);
            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(400).json({
                            msg: 'invalid parameter QR'
                        })
            }
            
            // if (cedula  && diffInSeconds <= 120) {
            // } else{
            //     res.status(400).json({
            //         msg: 'invalid parameter QR'
            //     })
            // }    
        }
    } catch (error) { 
        console.log(error);
        res.status(500).json({
            msg: ' 404 invalid parameter QR'
        });    
    }     
}


const usuarioByIdGet = async(req = request, res = response) => {
    try {
        const { uid } = req.params;
        console.log(uid);
        const usuario = await User.findById(uid);
        if (usuario) {
        res.json(usuario);
        }else{
        res.status(400).json({
            "msj":"No Found 404"
        })
        }
    } catch (error) {  
        res.status(400).json({
            "msj":"No Found 404"
        })        
    }     
}


const usuariosAllGet = async(req = request, res = response) => {

    const users = await User.find();
    if (users) {
    res.json({users});
    }

   
    
}



// const userPost = async(req, res = response) => {
//     try {
//         const body= req.body;
//         const enrollmentDB = await Enrollment.findOne({ code: body.code });
//         const userDB = await User.findOne({ identification: body.identification });
//         const programDB = await Program.findOne({ name: body.nombre });
//         console.log(userDB);
//         console.log(programDB);
//         if (enrollmentDB) {

//             const enrollmentDBUpdate = await Enrollment.findByIdAndUpdate(user.id,
//                 {
//                 "user_id":  userDB.id,
//                 "program_id":  programDB.id,
//                 "semester": semester,
//                 }
//                 );
//         } else {
//             const enrollment = new Enrollment({user_id:userDB._id,program_id:programDB._id,semester:body.semester,code:body.code , createdAt: Date.now(),  });
//             await enrollment.save(); 
//         }
//     } catch (error) {
//         console.log(error);
   
//     }
// }



const userPost = async(req, res = response) => {
    const response = await axios.get('http://3.85.53.75:3000/api/users');
    console.log(response);
    const datos = response.data;   
      for (const user of datos.users) {
        try {
        const existingUser = await User.findOne({ identification: user.identification });
        if (existingUser) {
            await User.findByIdAndUpdate(existingUser.id,
                {
                "first_name":existingUser.first_name,
                "middle_name":existingUser.middle_name,
                "last_name":existingUser.last_name,
                "second_last_name":existingUser.second_last_name,
                "identification":existingUser.identification,
                "email":existingUser.email,
                "role":existingUser.role,
                "campus":'existingUser.campu',
                "programs":existingUser.programs,
                "statusUnniversity":existingUser.status
                });
        } else {
            const salt = bcryptjs.genSaltSync();
            const password= bcryptjs.hashSync( user.identification.toString(), salt );
            const userCreate = new User(
                { 
                    "first_name":user.first_name,
                    "middle_name":user.middle_name,
                    "last_name":user.last_name,
                    "second_last_name":user.second_last_name,
                    "identification":user.identification,
                    "password":password,
                    "email":user.email,
                    "role":user.role,
                    "status":user.status,
                    "campus":user.campus,
                    "programs":user.programs,
                    "profile_picture":'',
                    "identification_picture":'',
                    "createdAt":  Date.now()
               }
               );
               await userCreate.save();
            }
            } catch (error) {
                console.log(error);
            }  
        }
        res.status(200).json({
            msg: 'OK'
        });
      }



const usuariosPutState = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;
    const usuariod = await User.findByIdAndUpdate( id, resto );
    const usuario = await User.findById( id);
    const cardApplication = new CardApplication();
    cardApplication.user_id=usuario.id;
    cardApplication.createdAt= Date.now();
    cardApplication.save();
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
    const user = await User.findByIdAndUpdate( id, resto );
    const usuario = await User.findById( id );
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