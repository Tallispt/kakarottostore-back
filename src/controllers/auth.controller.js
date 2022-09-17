import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import joi from 'joi';
import db from '../database/database.js'

const signInSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required()
})

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(8).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required().strict()
})

const signUp = async (req, res) => {

    const userData = req.body

    const validation = signUpSchema.validate(userData)
    if (validation.error) return res.status(422).send(validation.error.details[0].message)

    try {
        const existingEmail = await db.collection('users').findOne({ email: userData.email })
        if (existingEmail) return res.status(409).send("E-mail já cadastrado!")

        const hashPassword = bcrypt.hashSync(userData.password, 10);
        await db.collection('users').insertOne({
            name: userData.name,
            email: userData.email,
            password: hashPassword
        })

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao cadastrar usuário!");
    }
    res.status(201).send("Usuário cadastrado");

}

const signIn = async (req, res) => {

    const userSignin = req.body

    const validation = signInSchema.validate(userSignin)
    if (validation.error)
        return res.status(422).send(validation.error.details[0].message)

    try {
        const dbUser = await db.collection('users').findOne({ email: userSignin.email })

        if (!dbUser) return res.status(409).send("E-mail ou senha inválidos")

        const isPasswordValid = bcrypt.compareSync(userSignin.password, dbUser.password)

        if (isPasswordValid) {
            const token = uuid()
            await db.collection('sessions').insertOne({
                userId: dbUser._id,
                token
            })

            delete dbUser.password
            delete dbUser._id

            return res.status(201).send({
                ...dbUser,
                token
            })
        } else res.status(409).send("E-mail ou senha inválidos")


    } catch (error) {
        console.error(error);
        return res.status(500).send("Erro ao realizar login!");
    }
}

export { signIn, signUp }