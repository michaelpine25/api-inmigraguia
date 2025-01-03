import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default async function login(prisma, req, res)  {
    const { emailAddress, password, rememberMe } = req.body

    try {
        const userRecord = await prisma.user.findUnique({
            where: { emailAddress: emailAddress.toLowerCase() },
        })

        if (!userRecord) {
            return res.status(401).json({ message: 'The provided email and password combination does not match any user in the database.' })
        }

        const passwordMatch = await bcrypt.compare(password, userRecord.password)
        if (!passwordMatch) {
            return res.status(401).json({ message: 'The provided email and password combination does not match any user in the database.' })
        }

        // Generate JWT
        const expiresIn = rememberMe ? '10y' : '1h'
        const token = jwt.sign(
            {
                userId: userRecord.id,
                emailAddress: userRecord.emailAddress
            },
            process.env.JWT_SECRET,
            { expiresIn }
        )

        const serializedUser = {
            ...userRecord,
            createdAt: userRecord.createdAt.toString(),
            updatedAt: userRecord.updatedAt.toString()
        }

        return res.status(200).json({
            token: token,
            user: serializedUser
        })

    } catch (error) {
        console.error('Error during login:', error)
        return res.status(500).json({ message: 'An unexpected error occurred.' })
    }
}
