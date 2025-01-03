import fillRegularFields from "./fillRegularFields.js"
import fillArrayFields from "./fillArrayFields.js"
import fillExtraSiblings from "./fillExtraSiblings.js"
import custom from "./map.js"

// This function is the main helper to fill the applicant section
export default async function fillApplicantSection(form, applicant) {
    try {
        const applicantMap = custom.applicantMap
        const arrayMap = custom.arrayMap

        await fillRegularFields(form, applicant, applicantMap)
        await fillArrayFields(form, applicant, arrayMap)

        if (applicant.sibling.length > 4) {
            await fillExtraSiblings(form, applicant, applicantMap)
        }

        return { success: true }
    } catch (error) {
        console.error('Error filling applicant section:', error)
        return { error: 'An error occurred while filling the applicant section.' }
    }
}