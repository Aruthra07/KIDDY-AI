const { PrismaClient } = require('@prisma/client');

const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oc3h6ZXhkbW5sdHh3eXlkbXdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjIwMjk2MSwiZXhwIjoyMDk3Nzc4OTYxfQ.8RjHklp6d-cRseFlhdO-b1MvAazYC1gs8aFiCgskW-Q";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oc3h6ZXhkbW5sdHh3eXlkbXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDI5NjEsImV4cCI6MjA5Nzc3ODk2MX0.2u31hbtTEZzi07Ax-IqjUvzx50kOBSEBvzOCo4o5URw";

async function test(url, desc) {
  console.log(`Testing [${desc}] URL...`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });
  try {
    const res = await prisma.$queryRaw`SELECT 1 as result`;
    console.log(`Success [${desc}]! Result:`, res);
    await prisma.$disconnect();
    return true;
  } catch (err) {
    console.error(`Failed [${desc}]:`, err.message);
    await prisma.$disconnect();
    return false;
  }
}

async function run() {
  const variations = [
    { desc: "Service Role Key", pass: serviceRoleKey },
    { desc: "Anon Key", pass: anonKey },
  ];

  for (const v of variations) {
    const url = `postgresql://postgres:${v.pass}@db.mhsxzexdmnltxwyydmwa.supabase.co:5432/postgres?sslmode=require`;
    const success = await test(url, v.desc);
    if (success) {
      console.log('FOUND WORKING CONNECTION DETAILS!');
      break;
    }
  }
}

run();
