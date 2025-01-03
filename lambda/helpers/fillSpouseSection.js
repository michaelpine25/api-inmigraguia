import fillRegularFields from "./fillRegularFields.js"
import custom from "./map.js"

// Function to fill the spouse section in the PDF form
export default async function fillSpouseSection(form, spouse) {
    try {
        const spouseMap = custom.spouseMap

        await fillRegularFields(form, spouse, spouseMap)

        return { success: true }
    } catch (error) {
        console.error('Error filling spouse section:', error)
        return { error: 'An error occurred while filling the spouse section.' }
    }
}