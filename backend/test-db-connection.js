// Quick database connection test
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📍 Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    // Try to connect
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Try a simple query
    const studentCount = await prisma.student.count();
    console.log('📊 Students in database:', studentCount);
    
    const teacherCount = await prisma.teacher.count();
    console.log('👨‍🏫 Teachers in database:', teacherCount);
    
    const courseCount = await prisma.course.count();
    console.log('📚 Courses in database:', courseCount);
    
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
