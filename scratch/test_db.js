const { PrismaClient } = require('@prisma/client');
const path = require('path');

async function testUrl(url) {
  const p = new PrismaClient({
    datasources: {
      db: { url }
    }
  });
  try {
    const users = await p.user.findMany();
    const categories = await p.category.findMany();
    const products = await p.product.findMany();
    console.log(`SUCCESS: ${url} -> users: ${users.length}, categories: ${categories.length}, products: ${products.length}`);
    if (users.length > 0) {
      console.log(`Admin user: ${users[0].email} / role: ${users[0].role}`);
    }
  } catch (err) {
    console.log(`FAIL: ${url} -> ${err.message}`);
  } finally {
    await p.$disconnect();
  }
}

async function main() {
  const root = process.cwd();
  console.log('Testing dev.db in root...');
  await testUrl(`file:${path.resolve(root, 'dev.db')}`);

  console.log('Testing dev.db in prisma...');
  await testUrl(`file:${path.resolve(root, 'prisma/dev.db')}`);

  console.log('Testing dev.db in server...');
  await testUrl(`file:${path.resolve(root, 'server/dev.db')}`);
}

main();
