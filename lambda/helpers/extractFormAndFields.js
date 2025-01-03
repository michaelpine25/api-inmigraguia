import { PDFDocument } from "pdf-lib"
import fs from 'fs/promises'

/**
 * @param {string} pdfPath 
 * @returns {Promise<{ form: any, pdfDoc: PDFDocument }>} 
 * @throws {Error} 
 */

export default async function extractFormAndFields(pdfPath) {
    try {
        const input = await fs.readFile(pdfPath)

        const pdfDoc = await PDFDocument.load(input, { ignoreEncryption: true })

        const form = pdfDoc.getForm()

        return { form, pdfDoc }

    } catch (error) {
        console.error('Error extracting form fields:', error.message)
        throw new Error('Failed to extract the form and fields from the PDF.')
    }
}