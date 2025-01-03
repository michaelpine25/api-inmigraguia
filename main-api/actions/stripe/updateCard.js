import jwt from 'jsonwebtoken'

export default async function updateCard (stripe, prisma, req, res)  {
    const { stripeCustomerId, newPaymentMethodId } = req.body

    try {
        const token = req.headers.authorization.replace('Bearer ', '')

        let decodedToken
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        if (!decodedToken) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await prisma.user.findFirst({
            where: { stripeCustomerId },
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (decodedToken.userId !== user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const paymentMethod = await stripe.paymentMethods.attach(newPaymentMethodId, {
            customer: stripeCustomerId,
        })

        await stripe.customers.update(stripeCustomerId, {
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
        })

        await prisma.user.update({
            where: { id: user.id },
            data: {
                billingCardBrand: paymentMethod.card.brand,
                billingCardLast4: paymentMethod.card.last4,
                billingCardExpMonth: paymentMethod.card.exp_month.toString(),
                billingCardExpYear: paymentMethod.card.exp_year.toString(),
                hasBillingCard: true,
            },
        })

        return res.status(200).json({ message: 'Payment method updated successfully' })
    } catch (error) {
        console.error('Error updating payment method:', error)
        return res.status(500).json({ message: 'An unexpected error occurred' })
    }
}
