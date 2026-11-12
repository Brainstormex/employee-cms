import prisma from '../src/prisma'

const employees = [
  {
    name: 'Ada Lovelace',
    email: 'ada.lovelace@example.com',
    role: 'Software Engineer',
  },
  {
    name: 'Alan Turing',
    email: 'alan.turing@example.com',
    role: 'Data Scientist',
  },
  {
    name: 'Grace Hopper',
    email: 'grace.hopper@example.com',
    role: 'Engineering Manager',
  },
  {
    name: 'Katherine Johnson',
    email: 'katherine.johnson@example.com',
    role: 'Product Designer',
  },
  {
    name: 'Linus Torvalds',
    email: 'linus.torvalds@example.com',
    role: 'DevOps Engineer',
  },
]

async function main() {
  for (const employee of employees) {
    await prisma.employee.upsert({
      where: { email: employee.email },
      update: {},
      create: employee,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
