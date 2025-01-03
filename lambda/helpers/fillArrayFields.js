import { PDFTextField, PDFCheckBox } from 'pdf-lib'

/**
 * @param {Object} form 
 * @param {Object} section 
 * @param {Object} mapping 
 */
export default async function fillArrayFields(form, section, mapping) {
    try {
        for (const field in mapping) {
            const [arrayName, index, key] = mapping[field]
            const arrayData = section[arrayName]

            if (Array.isArray(arrayData) && arrayData[index]) {
                const value = arrayData[index][key]

                try {
                    const fieldObject = form.getField(field)

                    if (fieldObject instanceof PDFTextField) {
                        fieldObject.setText(value ? value.toString() : "N/A")
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
        }
    } catch (error) {
        console.error('Error filling array fields:', error.message)
        throw error
    }
}