const { response, text } = require('express');
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer');
const {User,Campus} = require('../models/index');
const { generateJWT } = require('../helpers/generate-jwt');
const { generateCode } = require('../helpers/generate-code');


const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        // const user = await User.findOne({ email });
   const user   = await User.findOne({email})
    .populate('campus_id')
    .populate('campus_id')
    .exec((err, user) => {
        if (err) {
            // manejo de error
        } else {
            // El objeto user ahora tiene el campo campus_id poblado con el objeto Campus relacionado
            console.log(user);
        }
    });

        if ( !user ) {
            return res.status(400).json({
                msg: 'User / Password is incorrect - correo'
            });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'User / Password is incorrect - password - password'
            });
        }
        // Generar el JWT
        const token = await generateJWT( 'user._id' );

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Please contact the administrator'
        });
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
    const numeroAleatorio = generateCode();
    let tokenstring=  'El token es '+ numeroAleatorio;
    let user = await User.findOne({ correo });   
    

    if(user){
        const User = await User.findByIdAndUpdate( user._id, {codigo:numeroAleatorio} );
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
            User
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
    sendEmail
}
