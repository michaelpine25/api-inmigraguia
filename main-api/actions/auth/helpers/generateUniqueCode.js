export default async function generateUniqueCode(prisma) {
  let uniqueCode
  let isUnique = false

  while (!isUnique) {
    uniqueCode = Math.floor(100000 + Math.random() * 900000).toString()

    const existingUser = await prisma.user.findFirst({
      where: { code: uniqueCode },
    })
    if (!existingUser) {
      isUnique = true
    }
  }
  return uniqueCode
}
