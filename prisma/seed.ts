import { Category, PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  
  const admin = await prisma.user.upsert({
    where: {
      email: "putrafajarh@gmail.com"
    },
    update: {},
    create: {
      email: "putrafajarh@gmail.com",
      name: "Putra Fajar H",
      role: "ADMIN",
      password: await hashPassword('verysecret')
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

  const categories: Category[] = [];

  for (let i = 0; i < 5; i++) {
    const category = await prisma.category.create({
      data: {
        name: faker.commerce.department(),
      }
    })
    categories.push(category)
  }

  for (let i = 0; i < 100; i++) {
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        sku: faker.commerce.isbn(13),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 1000}),
        userId: admin.id,
        categoryId: Math.floor(Math.random() * categories.length) + 1,
        weight: faker.number.int({ min: 100, max: 1000}),
        length: faker.number.int({ min: 50, max: 1000}),
        width: faker.number.int({ min: 50, max: 1000}),
        height: faker.number.int({ min: 50, max: 1000}),
        image: faker.image.url({ width: 1024, height: 1024})
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