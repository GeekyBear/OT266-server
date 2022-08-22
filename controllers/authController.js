//Import helpers
const {hashPassword} = require('../utils/bcryptHelper')

const authRegisterPOST = (req,res) => {
//El endpoint deberá validar los campos Nombre, Apellido, Email, Contraseña. 
//La contraseña debe ser encriptada. 
//Deberá devolver como respuesta el usuario generado.
    let { firstName, lastName, email, password } = req.body;

    //Hash password - Sync
    let passwordHashed = hashPassword(password);
    console.log(passwordHashed);


res.send('VISTA DE: POST /auth/register')
}


module.exports = {authRegisterPOST}