import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTeacher() {
  try {
    const email = process.argv[2] || 'gm7605@myamu.ac.in';
    
    console.log(`🔍 Checking for teacher with email: ${email}\n`);

    const teacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (teacher) {
      console.log('✅ Teacher found:');
      console.log(`   ID: ${teacher.teacher_id}`);
      console.log(`   Name: ${teacher.name}`);
      console.log(`   Email: ${teacher.email}`);
      console.log(`   Role: ${teacher.role}`);
      console.log(`   Department: ${teacher.department || 'N/A'}`);
      console.log(`   Active: ${teacher.is_active}`);
      console.log(`   Has Password: ${teacher.password_hash ? 'Yes' : 'No'}`);
      console.log(`   Created: ${teacher.created_at}`);
    } else {
      console.log('❌ No teacher found with this email');
    }

    // Also check if it's a student
    console.log('\n🔍 Checking if this is a student email...\n');
    
    const enrollmentNo = email.split('@')[0];
    const student = await prisma.student.findUnique({
      where: { enrollment_no: enrollmentNo },
    });

    if (student) {
      console.log('✅ Student found:');
      console.log(`   Enrollment: ${student.enrollment_no}`);
      console.log(`   Name: ${student.name}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   Active: ${student.is_active}`);
      console.log(`   Has Password: ${student.password_hash ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ No student found with this enrollment number');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTeacher();
