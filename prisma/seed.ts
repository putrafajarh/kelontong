import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  
  await prisma.user.upsert({
    where: {
      email: "putrafajarh@gmail.com"
    },
    update: {},
    create: {
      email: "putrafajarh@gmail.com",
      name: "Putra Fajar H",
      role: "ADMIN",
      password: await hashPassword('password')
    }
  })

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const fullName = `${firstName} ${lastName}`
    const email = faker.internet.email({ firstName, lastName}).toLowerCase()
    await prisma.user.upsert({
      where: {
        email
      },
      update: {},
      create: {
        email,
        name: fullName,
        role: "USER",
        password: await hashPassword('password')
      }
    })
  }
}

function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
})