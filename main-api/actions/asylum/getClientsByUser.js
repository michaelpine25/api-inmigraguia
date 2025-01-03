import jwt from 'jsonwebtoken'

export default async function getClientsByUser (prisma, req, res)  {
    const { userId } = req.params

    try {
        const token = req.headers.authorization.replace('Bearer ', '')

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!decodedToken || decodedToken.userId !== parseInt(userId, 10)) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' })
        }

        const clients = await prisma.client.findMany({
            where: { preparerId: parseInt(userId, 10) }, 
            orderBy: { createdAt: 'desc' }, 
            take: 30, 
        })

        const serializedClients = clients.map(client => ({
            ...client,
            data: JSON.parse(client.data),
            createdAt: client.createdAt.toString(),
            updatedAt: client.updatedAt.toString(),
        }));
        
        return res.status(200).json(serializedClients);
    } catch (error) {
        console.error('Error fetching clients:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
