import express from 'express';
import cors from 'cors';
import joi from 'joi';

import { signUp, signIn } from './controllers/auth.controller.js'

const app = express()

app.use(cors())
app.use(express.json())

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

const addressSchema = joi.object({
    place: joi.string().required(),
    number: joi.number().required(),
    cep: joi.number().min(8).required(),
    city: joi.string().required(),
    state: joi.string().required()
})

const paymentSchema = joi.object({
    cardNumber: joi.number().max(16).required(),
    name: joi.string().required(),
    expireDate: joi.string().required(),
    securityCode: joi.string().required()
})

app.post('/sign-up', signUp)

app.post('/sign-in', signIn)

app.listen(5000, console.log('Listening to 5000 port'))