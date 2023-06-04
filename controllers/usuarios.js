const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { decryptString } = require('../helpers/qr');
const Usuario = require('../models/usuario');


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
        console.log(token);
        if (token) {
            const now = new Date();
            const parts = token.split('/');
            const cedula=parts[0];
            const code= parts[1]+ ' '+ parts[2];
            const date = new Date(code);
            const diffInMilliseconds = Math.abs(now - date);
            const diffInSeconds = diffInMilliseconds / 1000;
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

const usuariosPost = async(req, res = response) => {
    
    const { cedula,codigo,nombre1,nombre2,apellido1,apellido2,facultad,programa,img, correo, verifi, password, rol } = req.body;
    const usuario = new Usuario({ cedula,codigo,nombre1,nombre2,apellido1,apellido2,facultad,programa,img, correo, verifi,password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

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


    usuariosAllGet,
    usuarioByIdGet,

    usuarioByCedula,
    usuarioByQr,
    usuariosPost,

    usuariosPutPassword,
    usuariosPutState,


    usuariosPatch,
    usuariosDelete,
}