
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
} = require('../middlewares');


const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { 

        userPost,

        usuariosAllGet,
        usuarioByIdGet,
        usuarioByQr,
        usuariosPutPassword,
        usuariosPutState,
        usuarioByCedula,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();



router.get('/', usuariosAllGet );

router.get('/up', userPost );

//LIST USER BY ID
router.get('/:uid', usuarioByIdGet );


router.get('/cedula/:cedula', usuarioByCedula );
router.get('/qr/:id', usuarioByQr );

//UPDATE PASSWORD
router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validateFields
],usuariosPutPassword );

//UPDATE STATE
router.put('/state/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validateFields
],usuariosPutState );


router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validateFields
],usuariosDelete );


router.patch('/', usuariosPatch );


module.exports = router;