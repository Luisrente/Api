const { response, text, json } = require('express');
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer');
const {User, Enrollment} = require('../models/index');
const Code = require('../models/code');
const { generateJWT } = require('../helpers/generate-jwt');
const { generateNumero } = require('../helpers/generate-code');


const login = async(req, res = response) => {
    const { email, password } = req.body;

    console.log(email);

    try {
        const user = await User.findOne({ email });
//    const user   = await User.findOne({email})
//     .populate('campus_id')
//     .exec((err, user) => {
//         if (err) {
//             // manejo de error
//             console.log(err);
//         } else {
//             // El objeto user ahora tiene el campo campus_id poblado con el objeto Campus relacionado
//             console.log(user);
//         }
//     });




        if ( !user ) {
            return res.status(401).json({
                msg: 'User / Password is incorrect - correo'
            });
        }
        // Verificar la contraseña
        // const validPassword = bcryptjs.compareSync( password, user.password );
        // if ( !validPassword ) {
        //     return res.status(400).json({
        //         msg: 'User / Password is incorrect - password - password'
        //     });
        // }
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

    const { email } = req.body;
    // try {
    //   // Configurar el transporte de correo
    //   const transporter = nodemailer.createTransport({
    //     service: 'gmail',

    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: 'Luisrentef@gmail.com',
    //       pass: 'zjqfvfqooeerqmhn'
    //     }
    //   });

      const numeroAleatorio = generateNumero();
      let tokenstring=  'El token es '+ numeroAleatorio;
      let user = await User.findOne({ email });
      console.log(user);
      const code = new Code({'user_id':user.id, 'code':numeroAleatorio});
     const verif= await code.save();

      console.log(verif);
      res.status(200).json({
        user
      });
      
    //   if(user){
    //     //   const usuario = await User.findByIdAndUpdate( user._id, {codigo:numeroAleatorio} );
    //       //   Definir los detalles del correo electrónico
    //       const mailOptions = {
    //         from: 'Luisrentef@gmail.com',
    //         to: email,
    //         subject: 'Token',
    //         text: tokenstring
    //       };

    //       try {
    //           const info = await transporter.sendMail(mailOptions);
    //       } catch (error) {
    //           console.log(error);         
    //       }
  
    //       res.json({
    //           usuario
    //       })
    //   }else{
    //       res.status(404).json({
    //           msg: '404 not found'
    //       });
    //   }

    // } catch (error) {
    //     console.log(error);
    //   res.status(500).json({
    //       msg: '500 ERROR'
    //   });
    // }


};


const verificationEmail = async (req, res) => {
    const { email, codigo } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log(user);
      
        const application = await Code.findOne({ user_id: user._id })
          .sort({ createdAt: -1 })
          .populate('user_id');
        
        if (application) {
          const diferencia = Math.abs(application.createdAt - Date.now());
      
          // Verificar si la diferencia es menor a 30 minutos (1800000 milisegundos)
          if (diferencia < 1800000 || application.code === codigo) {
            res.status(200).json({
              user
            });
          } else {
            res.status(400).json({
              msg: "error"
            });
          }
        } else {
          res.status(400).json({
            msg: "error"
          });
        }
      } catch (error) {
        console.error('Error al obtener la aplicación:', error);
        res.status(500).json({ error: 'Error al obtener la aplicación' });
      }
      
      


};




module.exports = {
    login,
    sendEmail,
    verificationEmail
}
