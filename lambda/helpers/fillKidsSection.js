import { PDFTextField, PDFCheckBox } from 'pdf-lib'
import custom from './map.js'

// Function to fill the kids section in the PDF form
export default async function fillKidsSection(form, kids) {
    try {
        const kidsMap = custom.kidsMap

        for (const field in kidsMap) {
            const [index, dataField] = kidsMap[field]
            let value = 'N/A'

            if (index >= 0 && index < kids.length) {
                const kid = kids[index]
                value = kid[dataField] !== undefined && kid[dataField] !== null ? kid[dataField].toString() : 'N/A'
            }

            try {
                const fieldObject = form.getField(field)

                if (fieldObject instanceof PDFTextField) {
                    fieldObject.setText(value)
                } else if (fieldObject instanceof PDFCheckBox) {
                    if (value === true || value === 'true' || value === 1 || value === '1') {
                        fieldObject.check()
                    } else {
                        fieldObject.uncheck()
                    }
                }
            } catch (error) {
                console.warn(`Field ${field} not found in PDF form or is not supported.`, error)
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Error filling kids section:', error)
        return { error: 'An error occurred while filling the kids section.' }
    }
}