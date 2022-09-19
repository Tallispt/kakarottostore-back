import express from 'express';
import cors from 'cors';
import joi from 'joi';

import AuthRouter from './router/auth.router.js'

const app = express()
app.use(cors())
app.use(express.json())

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

app.use(AuthRouter)

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});