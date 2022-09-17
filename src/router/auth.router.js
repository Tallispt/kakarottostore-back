import express from 'express';

import { signIn, signUp } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/sign-in', signUp)
router.post('sign-up', signIn)

export default router