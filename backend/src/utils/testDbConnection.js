const { PrismaClient } = require('@prisma/client');

async function testConnection(url) {
  console.log(`Testing connection with URL: ${url}`);
  const prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    await prismaInstance.$queryRaw`SELECT 1`;
    console.log('Connection SUCCESS!');
    await prismaInstance.$disconnect();
    return true;
  } catch (error) {
    console.log(`Connection FAILED: ${error.message}`);
    await prismaInstance.$disconnect();
    return false;
  }
}

async function run() {
  const candidates = [
    'mysql://root@localhost:3306/telephony_platform',          // empty password
    'mysql://root:root@localhost:3306/telephony_platform',      // 'root' password
    'mysql://root:password@localhost:3306/telephony_platform',  // 'password' password
    'mysql://root:123456@localhost:3306/telephony_platform',    // '123456' password
    'mysql://root:admin@localhost:3306/telephony_platform',     // 'admin' password
    'mysql://root:manish@localhost:3306/telephony_platform',    // 'manish' password
    'mysql://root:manish123@localhost:3306/telephony_platform',// 'manish123' password
    'mysql://root:manishkumar@localhost:3306/telephony_platform',
    'mysql://root:mysql@localhost:3306/telephony_platform',
    'mysql://root:manish@123@localhost:3306/telephony_platform',
  ];

  for (const url of candidates) {
    const success = await testConnection(url);
    if (success) {
      console.log(`Found working connection string: ${url}`);
      process.exit(0);
    }
  }

  console.log('None of the common credentials worked.');
  process.exit(1);
}

run();
