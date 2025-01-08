import axios from 'axios';

export default async function fillForm(prisma, req, res) {
  const { applicant, spouse, asylum, kids, code } = req.body
  const url = process.env.LAMBDA_URL

  const user = await prisma.user.findFirst({
    where: {
      code: code,
    },
  })

  if (!user) {
    return res.status(400).json({ error: 'Invalid code' });
  }
  const userEmail = user ? user.emailAddress : null

  try {
    const response = await axios.post(url, {
      applicant,
      spouse,
      asylum,
      kids, 
      userEmail
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    res.status(200).json({
      message: 'Successfully invoked Lambda',
      lambdaResponse: response.data
    })
  } catch (error) {
    console.error('Error invoking Lambda:', error);
    res.status(500).json({
      error: 'Failed to invoke Lambda function',
      details: error.message
    })
  }
}
