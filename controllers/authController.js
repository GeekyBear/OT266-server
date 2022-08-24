//import models
const { token } = require('morgan');
const {User} = require('../db/models/index');

//Import helpers
const {checkEmailExists} = require("./userController")
const {hashPassword,comparePassword} = require('../utils/bcryptHelper')
const { signToken7d, verifyToken } = require('../utils/jwtHelper')

//Register
const authRegisterGET = async (req,res) => {
    res.send('Peticion GET a /auth/login -> Aqui form con campos: firstName,lastName,email,password')
}
const authRegisterPOST = async (req,res) => {
    let { firstName, lastName, email, password } = req.body;

    let existeEmail = await checkEmailExists(email)

    //Si existeEmail es true, existe el user en la DB y hay que devolver que el correo ya existe.
    //Caso contrario, se hace el insert en la DB
    if(existeEmail == true){
        res.send('El correo ya tiene una cuenta hecha')
    } else {
        try {
            //Hash password - Sync
            let passwordHashed = hashPassword(password);
            console.log(passwordHashed);
    
            //Create new user, asigno automaticamente rol 2: usuario regular
            let newUser = await User.create({
                firstName,
                lastName,
                email,
                password: passwordHashed,
                roleId: 2
            })
    
            res.send(`User creado ${JSON.stringify(newUser)}`)
        } catch (error) {
            res.json(error)
        }
    }
}

//Login
const authLoginGET = async (req,res) => {
    res.send('Peticion GET a /auth/register -> Aqui form con campos: email,password')
}
const authLoginPOST = async (req,res) => {
    let {email,password} = req.body;
    //Busco email
    const searchUser = await User.findOne({
        where: {
            email: email
        }
    })

    //searchUser == null : no existe el usuario, else si existe
    if (searchUser == null) {
        res.send('{ok: false}, No existe user')
    } else {
        //De la busqueda searchUser, saco el hash de la password.
        let hashedPass = searchUser.password
        //Hago la comparacion de la pass introducida y el hash
        let isPass = comparePassword(password,hashedPass)
        //console.log('comprobacion:', isPass)

        if (isPass == true) {
            //La password introducida es correcta

            //Armo objeto para firmar token: id,name,rol
            let dataForToken = {
                id: searchUser.id,
                name: searchUser.firstName,
                rol:searchUser.roleId
            }

            //Firmo token
            let JWT = await signToken7d(dataForToken)

            res.json({"Email":searchUser.email,"Password":isPass,"JWT Token": JWT})
        } else {
            //Password introducida es incorrecta
            res.json({"Email":searchUser.email,"Password":isPass})
        }
    }
}

module.exports = {authRegisterGET,authRegisterPOST,authLoginGET, authLoginPOST}