import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearRegistrations() {
  try {
    const enrollmentNo = process.argv[2] || 'gq5012'; // Default to Vipan
    
    console.log(`🗑️  Clearing registrations for: ${enrollmentNo}\n`);

    const student = await prisma.student.findUnique({
      where: { enrollment_no: enrollmentNo },
    });

    if (!student) {
      console.log('❌ Student not found!');
      return;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semesterType = currentMonth >= 7 ? 1 : 2;

    console.log(`✅ Found: ${student.name}`);
    console.log(`📧 Email: ${student.email}`);
    console.log(`📚 Current Semester: ${student.current_semester}`);
    console.log(`📅 Academic Year: ${currentYear}`);
    console.log(`📆 Semester Type: ${semesterType} (${semesterType === 1 ? 'Odd' : 'Even'})\n`);

    const registrations = await prisma.courseRegistration.findMany({
      where: {
        enrollment_no: enrollmentNo,
        academic_year: currentYear,
        semester_type: semesterType,
        deleted_at: null,
      },
      include: {
        course: true,
      },
    });

    if (registrations.length === 0) {
      console.log('✅ No active registrations found. Already clean!\n');
      return;
    }

    console.log(`📋 Found ${registrations.length} active registration(s):\n`);
    
    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.course.course_code} - ${reg.course.course_name}`);
      console.log(`   Credits: ${reg.course.credits}`);
      console.log(`   Type: ${reg.registration_type}`);
      console.log(`   Approved: ${reg.is_approved ? 'Yes' : 'No'}`);
      console.log('');
    });

    const result = await prisma.courseRegistration.deleteMany({
      where: {
        enrollment_no: enrollmentNo,
        academic_year: currentYear,
        semester_type: semesterType,
        deleted_at: null,
      },
    });

    console.log(`✅ Deleted ${result.count} registration(s)`);
    console.log(`\n🎉 Registrations cleared for ${student.name}!\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearRegistrations();
