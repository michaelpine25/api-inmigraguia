import path from 'path'
import fillApplicantSection from './helpers/fillApplicantSection.js'
import fillSpouseSection from './helpers/fillSpouseSection.js'
import fillAsylumSection from './helpers/fillAsylumSection.js'
import fillKidsSection from './helpers/fillKidsSection.js'
import extractFormAndFields from './helpers/extractFormAndFields.js'
import sendEmailWithAttatchment from './helpers/sendEmailWithAttachment.js'

export const handler = async (event, context) => {
  const { applicant, spouse, asylum, kids, userEmail } = event

  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname)
    const uncompressedPdfPath = path.resolve(__dirname, './assets/uncompressed.pdf')

    const { form, pdfDoc } = await extractFormAndFields(uncompressedPdfPath)

    form.getField("form1[0].#subform[0].CheckBox31[0]").check()

    await Promise.all([
      fillApplicantSection(form, applicant),
      fillSpouseSection(form, spouse),
      fillAsylumSection(form, asylum),
      fillKidsSection(form, kids)
    ])

    const modifiedPdfBytes = await pdfDoc.save()
    await sendEmailWithAttatchment(userEmail, modifiedPdfBytes, event)

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'success',
      })
    }

  } catch (error) {
    console.error('Error filling PDF:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    }
  }
}