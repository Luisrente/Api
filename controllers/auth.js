const { response, text } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { generarNumero } = require('../helpers/generar-code');
const nodemailer = require('nodemailer');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}


const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }



}


const sendEmail = async (req, res) => {
 const { correo } = req.body;
  try {
    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user:process.env.USER,
        pass: process.env.PASS
      }
    });
    const numeroAleatorio = generarNumero();
    let tokenstring=  'El token es '+ numeroAleatorio;
    let user = await Usuario.findOne({ correo });   
    

    if(user){
        const usuario = await Usuario.findByIdAndUpdate( user._id, {codigo:numeroAleatorio} );
        //   Definir los detalles del correo electrónico
        const mailOptions = {
          from:process.env.USER,
          to: correo,
          subject: 'Token',
          text: tokenstring
        };
        try {
            const info = await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);         
        }

        res.json({
            usuario
        })
    }else{
        res.status(404).json({
            msg: '404 not found'
        });

    }
  } catch (error) {
    res.status(500).json({
        msg: '500 ERROR'
    });
  }
};



module.exports = {
    login,
    googleSignin,
    sendEmail
}
