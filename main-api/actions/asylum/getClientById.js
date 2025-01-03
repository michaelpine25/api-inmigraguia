import jwt from 'jsonwebtoken'

export default async function getClientById (prisma, req, res)  {
    const { clientId } = req.params

    try {
        const token = req.headers.authorization.replace('Bearer ', '')

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!decodedToken) {
            return res.status(401).json({ message: 'Unauthorized access' })
        }

        const client = await prisma.client.findUnique({
            where: { id: Number(clientId) },
        })

        if (!client) {
            return res.status(404).json({ message: 'Client not found' })
        }

        if (decodedToken.userId !== client.preparerId) {
            return res.status(401).json({ message: 'Unauthorized access' })
        }

        const serializedClient = {
            ...client,
            createdAt: client.createdAt.toString(),
            updatedAt: client.updatedAt.toString()
        }
        
        res.status(200).json({
            client: JSON.parse(serializedClient.data),
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized access' })
        }

        console.error('Error fetching client:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
