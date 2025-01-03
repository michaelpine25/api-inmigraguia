import { PDFTextField, PDFCheckBox } from 'pdf-lib'
import custom from './map.js'
const asylumMap = custom.asylumMap

/**
 * @param {Object} form
 * @param {Object} data 
 * @param {Object} mapping 
 */
export default async function fillRegularFields(form, data, mapping) {
    try {
        for (const field in mapping) {
            const value = data[mapping[field]]
            try {
                const fieldObject = form.getField(field)

                if (fieldObject instanceof PDFTextField) {
                    if (asylumMap[field]) {
                        fieldObject.setText(value?.text ?? "")
                    } else {
                        fieldObject.setText(value ? value.toString() : "N/A")
                    }
                } else if (fieldObject instanceof PDFCheckBox) {
                    if (value === true || value === 'true' || value === 1 || value === '1') {
                        fieldObject.check()
                    } else {
                        fieldObject.uncheck()
                    }
                }
            } catch (error) {
                console.warn(`Field "${field}" not found or not supported:`, error.message)
            }
        }
    } catch (error) {
        console.error('Error filling regular fields:', error.message)
        throw error
    }
}