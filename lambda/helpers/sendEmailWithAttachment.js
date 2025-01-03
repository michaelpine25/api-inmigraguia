import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'inmigraguia.formularios@gmail.com',
        pass: process.env.EMAIL_PASSWORD 
    }
})

export default async function sendEmailWithAttachment(userEmail, modifiedPdfBytes, event) {
    try {
        const mailOptions = {
            from: 'inmigraguia.formularios@gmail.com',
            to: userEmail,
            subject: `i-589 Asilo de ${event.applicant?.firstName + ' ' + event.applicant?.lastName}`,
            attachments: [
                {
                    filename: 'asylum.pdf',
                    content: modifiedPdfBytes,
                    contentType: 'application/pdf'
                }
            ]
        }

        await transporter.sendMail(mailOptions)
        console.log('Email sent successfully')
    } catch (error) {
        console.error('Error sending email:', error)
        throw new Error('Failed to send email')
    }
}