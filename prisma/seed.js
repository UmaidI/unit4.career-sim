const { faker } = require("@faker-js/faker");
const prisma = require("../prisma");

const seed = async (numProducts = 20) => {
  const products = Array.from({length: numProducts}, ()=>({
    title: faker.commerce.productName(),
    description: faker.lorem.sentences(2),
    price: Math.floor(Math.random() * 36) + 1
  }));
  await prisma.product.createMany({data: products});
}
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });