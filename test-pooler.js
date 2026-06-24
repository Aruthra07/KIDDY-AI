const dns = require('dns');
const { PrismaClient } = require('@prisma/client');

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-west-2',
  'eu-central-1',
  'ca-central-1',
  'sa-east-1'
];

const projectRef = 'mhsxzexdmnltxwyydmwa';
const password = 'sb_secret_go_oZZj-hYxdzOd1WYOaPg_nbcBXDSP'; // main candidate

function resolveHost(host) {
  return new Promise((resolve) => {
    dns.lookup(host, (err, address) => {
      if (err) resolve(null);
      else resolve(address);
    });
  });
}

async function testConnection(url, desc) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });
  try {
    const res = await prisma.$queryRaw`SELECT 1 as result`;
    await prisma.$disconnect();
    return { success: true, res };
  } catch (err) {
    await prisma.$disconnect();
    return { success: false, error: err.message };
  }
}

async function run() {
  console.log('Testing regions...');
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const ip = await resolveHost(host);
    if (ip) {
      console.log(`Region [${region}] resolved to IP: ${ip}. Testing connection...`);
      
      // We will test both 5432 and 6543 ports
      // Standard username format for pooler is: postgres.projectRef
      const url5432 = `postgresql://postgres.${projectRef}:${password}@${host}:5432/postgres?sslmode=require`;
      const url6543 = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres?sslmode=require&pgbouncer=true`;

      console.log(`  Testing port 5432...`);
      const res5432 = await testConnection(url5432, `5432-${region}`);
      if (res5432.success) {
        console.log(`  SUCCESS! Port 5432 is working. Connection URL: ${url5432}`);
        return;
      } else {
        console.log(`  Failed port 5432: ${res5432.error}`);
      }

      console.log(`  Testing port 6543...`);
      const res6543 = await testConnection(url6543, `6543-${region}`);
      if (res6543.success) {
        console.log(`  SUCCESS! Port 6543 is working. Connection URL: ${url6543}`);
        return;
      } else {
        console.log(`  Failed port 6543: ${res6543.error}`);
      }
    }
  }
  console.log('All regional pooler connection attempts finished.');
}

run();
