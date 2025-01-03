export default async function logout (req, res) {
    try {
        res.clearCookie('token')

        return res.status(200).json({ message: 'You have been successfully logged out.' })

    } catch (error) {
        console.error('Error during logout:', error)
        return res.status(500).json({ message: 'An unexpected error occurred during logout.' })
    }
}
