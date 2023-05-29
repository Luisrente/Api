const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');



const usuarioByIdGet = async(req = request, res = response) => {

    const { id } = req.params;
    if (id) {
    console.log("ddddddddd");
    const usuario = await Usuario.findById(id);
    res.json(usuario);
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
    
    const { cedula,nombre1,nombre2,apellido1,apellido2,facultad,programa,img, correo, verifi, password, rol } = req.body;
    const usuario = new Usuario({ cedula,nombre1,nombre2,apellido1,apellido2,facultad,programa,img, correo, verifi,password, rol });

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

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

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


    usuariosPost,

    usuariosPutPassword,
    usuariosPutState,


    usuariosPatch,
    usuariosDelete,
}