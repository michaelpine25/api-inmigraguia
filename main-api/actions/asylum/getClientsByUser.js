import jwt from 'jsonwebtoken'
import { Prisma } from '@prisma/client'

export default async function getClientsByUser (prisma, req, res)  {
    const { userId } = req.params

    try {
        const token = req.headers.authorization.replace('Bearer ', '')

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!decodedToken || decodedToken.userId !== parseInt(userId, 10)) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' })
        }

        const { search } = req.query;

        let clients;
        if (search) {
            const searchTerms = search.trim().toLowerCase().split(/\s+/);

            let query;
            if (searchTerms.length === 2) {
                query = Prisma.sql`
                    SELECT * FROM \`client\`
                    WHERE \`preparerId\` = ${parseInt(userId, 10)}
                    AND (
                        (LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`data\`, '$.applicant.firstName'))) LIKE ${'%' + searchTerms[0] + '%'} 
                        AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`data\`, '$.applicant.lastName'))) LIKE ${'%' + searchTerms[1] + '%'})
                        OR 
                        (LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`data\`, '$.applicant.firstName'))) LIKE ${'%' + searchTerms[1] + '%'} 
                        AND LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`data\`, '$.applicant.lastName'))) LIKE ${'%' + searchTerms[0] + '%'})
                    )
                    LIMIT 30
                `;
            } else {
                query = Prisma.sql`
                    SELECT * FROM \`client\`
                    WHERE \`preparerId\` = ${parseInt(userId, 10)}
                    AND (
                        LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`data\`, '$.applicant.firstName'))) LIKE ${'%' + searchTerms[0] + '%'} OR
                        LOWER(JSON_UNQUOTE(JSON_EXTRACT(\`data\`, '$.applicant.lastName'))) LIKE ${'%' + searchTerms[0] + '%'}
                    )
                    LIMIT 30
                `;
            }

            clients = await prisma.$queryRaw(query);
        } else {
            clients = await prisma.client.findMany({
                where: { preparerId: parseInt(userId, 10) },
                orderBy: { createdAt: 'desc' },
                take: 30,
            });
        }

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
