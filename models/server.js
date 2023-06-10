const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',

            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',

            user:       '/api/users',
            enrollment: '/api/enrollment',
            faculty:    '/api/faculty',
            uploads:    '/api/uploads',
            program:    '/api/program',
            campus:    '/api/campus',
        }
        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        this.app.use( express.json() );

        this.app.use( express.static('public') );

        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.user, require('../routes/user'));

        // this.app.use( this.paths.buscar, require('../routes/buscar'));
        // this.app.use( this.paths.categorias, require('../routes/categorias'));
        // this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
        
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
