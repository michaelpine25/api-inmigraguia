import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import generateUniqueCode from './helpers/generateUniqueCode.js'


export default async function signup (stripe, prisma, req, res)  {
    const { emailAddress, password, fullName, paymentMethodId } = req.body

    try {
        if (!emailAddress || !password || !fullName || !paymentMethodId) {
            return res.status(400).json({ message: 'Missing required fields.' })
        }

        const existingUser = await prisma.user.findUnique({
            where: { emailAddress: emailAddress.toLowerCase() }
        })

        if (existingUser) {
            return res.status(409).json({ message: 'Email address is already in use.' })
        }

        const customer = await stripe.customers.create({
            email: emailAddress,
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        })

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: process.env.PRICE_ID }],
            expand: ['latest_invoice.payment_intent'],
        })

        const paymentIntent = subscription.latest_invoice.payment_intent
        if (paymentIntent.status !== 'succeeded') {

            await stripe.customers.del(customer.id)
            return res.status(402).json({ message: 'Payment failed.' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const uniqueCode = await generateUniqueCode(prisma)

        const newUser = await prisma.user.create({
            data: {
                fullName,
                emailAddress: emailAddress.toLowerCase(),
                password: hashedPassword,
                stripeCustomerId: customer.id,
                code: uniqueCode,
                createdAt: Date.now(),
                updatedAt: Date.now()
            },
        })

        const serializedUser = {
            ...newUser,
            createdAt: newUser.createdAt?.toString(),
            updatedAt: newUser.updatedAt?.toString(),
        }

        const token = jwt.sign(
            { userId: newUser.id, emailAddress: newUser.emailAddress },
            process.env.JWT_SECRET,
            { expiresIn: '10y' }
        )


        res.status(201).json({ token, user: serializedUser })
    } catch (error) {
        console.error('Error during signup:', error)

        if (error.code === 'P2002') { 
            return res.status(409).json({ message: 'Email address is already in use.' })
        }

        res.status(500).json({ message: 'An unexpected error occurred.' })
    }
}
