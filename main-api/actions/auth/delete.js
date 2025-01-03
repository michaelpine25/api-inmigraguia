import  jwt from 'jsonwebtoken'

export default async function deleteAccount (stripe, prisma, req, res)  {
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

        const user = await prisma.user.findUnique({
            where: { id: Number(decodedToken.userId) },
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (decodedToken.userId !== user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        await stripe.customers.del(user.stripeCustomerId)

        await prisma.user.delete({
            where: { id: Number(decodedToken.userId) },
        })

        return res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error during user deletion:', error)
        return res.status(500).json({ message: 'An unexpected error occurred' })
    }
}
