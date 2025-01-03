import PDFTextField from "pdf-lib"
/**
 *
 * @param {Object} form 
 * @param {Object} applicant 
 */
export default async function fillExtraSiblings (form, applicant) {
  try {
    const additionalSiblings = []
    const numSiblings = applicant.sibling.length

    for (let i = 4; i < numSiblings; i++) {
      const sibling = applicant.sibling[i]
      const siblingInfo = []

      siblingInfo.push(`Name: ${sibling.name || 'N/A'}`)
      siblingInfo.push(`Origin: ${sibling.origin || 'N/A'}`)
      siblingInfo.push(`Location: ${sibling.location || 'N/A'}`)
      siblingInfo.push(`Deceased: ${sibling.deceased ? 'Yes' : 'No'}`)

      const siblingText = siblingInfo.join('\n')
      additionalSiblings.push(siblingText)
    }

    const additionalSiblingsText = additionalSiblings.join('\n\n')

    const extraSiblingsField = "form1[0].#subform[13].TextField32[0]"
    const partField = "form1[0].#subform[13].TextField31[0]"
    const questionField = "form1[0].#subform[13].TextField31[1]"

    try {
      const extraSiblingsFieldObject = form.getField(extraSiblingsField)
      const partFieldObject = form.getField(partField)
      const questionFieldObject = form.getField(questionField)

      if (extraSiblingsFieldObject instanceof PDFTextField) {
        extraSiblingsFieldObject.setText(
          additionalSiblingsText.trim() ? additionalSiblingsText : "N/A"
        )
      }

      if (partFieldObject instanceof PDFTextField) {
        partFieldObject.setText("A.III")
      }

      if (questionFieldObject instanceof PDFTextField) {
        questionFieldObject.setText("5")
      }
    } catch (fieldError) {
      console.warn("One or more fields not found in the PDF form or are not supported.", fieldError)
    }

    console.log("Extra siblings section filled successfully.")
  } catch (error) {
    console.error("Error filling extra siblings information:", error)
    throw new Error("An error occurred while filling extra siblings information.")
  }
}