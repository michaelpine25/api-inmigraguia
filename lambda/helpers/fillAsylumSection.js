import fillRegularFields from "./fillRegularFields.js"
import custom from "./map.js"

// Function to fill the asylum section in the PDF form
export default async function fillAsylumSection(form, asylum) {
    try {
        const asylumMap = custom.asylumMap

        await fillRegularFields(form, asylum, asylumMap)

        return { success: true }
    } catch (error) {
        console.error('Error filling asylum section:', error)
        return { error: 'An error occurred while filling the asylum section.' }
    }
}