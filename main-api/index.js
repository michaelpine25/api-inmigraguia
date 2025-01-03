import logout from './actions/auth/logout.js'
import fillForm from './actions/asylum/fillForm.js'
import updateEmail from './actions/auth/updateEmail.js'
import deleteUser from './actions/auth/delete.js'
import login from './actions/auth/login.js'
import signup from './actions/auth/signup.js'
import getClientsByUser from './actions/asylum/getClientsByUser.js'
import getClientById from './actions/asylum/getClientById.js'
import updateCard from './actions/stripe/updateCard.js'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const siteUrl = process.env.SITE_URL
const deployUrl = process.env.DEPLOY_URL
const localUrl = process.env.LOCAL_URL
const app = express()
const port = 3000
app.use(express.json())

const corsOptions = {
    origin: [localUrl, siteUrl, deployUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())

// Auth routes
app.post('/api/v1/account/logout', (req, res) => logout(prisma, req, res))
app.post('/api/v1/update-email', (req, res) => updateEmail(prisma, req, res))
app.post('/api/v1/delete-user', (req, res) => deleteUser(stripe, prisma, req, res))
app.put('/api/v1/entrance/login', (req, res) => login(prisma, req, res))
app.post('/api/v1/entrance/signup', (req, res) => signup(stripe, prisma, req, res))

// Asylum routes
app.post('/api/v1/fill-form', (req, res) => fillForm(prisma, req, res))
app.get('/api/v1/clients/:userId', (req, res) => getClientsByUser(prisma, req, res))
app.get('/api/v1/client/:clientId', (req, res) => getClientById(prisma, req, res))

// Stripe routes
app.post('/api/v1/update-card', (req, res) => updateCard(stripe, prisma, req, res))

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
