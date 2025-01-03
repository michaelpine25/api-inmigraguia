import jwt from 'jsonwebtoken'

export default async function updateEmail (prisma, req, res)  {
    const { userId, newEmail } = req.body

    try {
        const token = req.headers.authorization.replace('Bearer ', '')
        console.log(req.headers.authorization)

        let decodedToken
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized token' })
        }

        if (!decodedToken) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (decodedToken.userId !== user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        await prisma.user.update({
            where: { id: Number(userId) },
            data: { emailAddress: newEmail },
        })

        return res.status(200).json({ message: 'Email address updated successfully' })
    } catch (error) {
        console.error('Error during email update:', error)
        return res.status(500).json({ message: 'An unexpected error occurred' })
    }
}
