import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enableRegistrationPhase() {
  try {
    console.log('🔧 Enabling registration phase...\n');

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const semesterType = currentMonth >= 7 ? 1 : 2;

    console.log(`Current Year: ${currentYear}`);
    console.log(`Semester Type: ${semesterType} (${semesterType === 1 ? 'Odd' : 'Even'})`);
    console.log(`Current Date: ${now.toISOString()}\n`);

    // Find or create phases for current semester
    let phases = await prisma.registrationPhase.findMany({
      where: {
        academic_year: currentYear,
        semester_type: semesterType,
      },
      orderBy: {
        phase_id: 'asc',
      },
    });

    // If no phases exist, create them
    if (phases.length === 0) {
      console.log('No phases found. Creating default phases...\n');
      
      const defaultPhases = [
        { phase_name: "REGULAR", phase_label: "Regular Registration" },
        { phase_name: "LATE", phase_label: "Late Registration" },
        { phase_name: "ADD_DROP", phase_label: "Add/Drop" },
        { phase_name: "WITHDRAWAL", phase_label: "Withdrawal (W grade)" },
        { phase_name: "FREEZE", phase_label: "Final Lock" },
      ];

      for (const phase of defaultPhases) {
        await prisma.registrationPhase.create({
          data: {
            ...phase,
            academic_year: currentYear,
            semester_type: semesterType,
          },
        });
      }

      phases = await prisma.registrationPhase.findMany({
        where: {
          academic_year: currentYear,
          semester_type: semesterType,
        },
        orderBy: {
          phase_id: 'asc',
        },
      });
    }

    // Enable the REGULAR phase with dates (today to 7 days from now)
    const regularPhase = phases.find(p => p.phase_name === 'REGULAR');
    
    if (regularPhase) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // 7 days from now

      const updated = await prisma.registrationPhase.update({
        where: { phase_id: regularPhase.phase_id },
        data: {
          is_enabled: true,
          start_date: startDate,
          end_date: endDate,
        },
      });

      console.log('✅ Regular Registration Phase Enabled!');
      console.log(`   Phase ID: ${updated.phase_id}`);
      console.log(`   Phase: ${updated.phase_label}`);
      console.log(`   Start Date: ${updated.start_date?.toISOString()}`);
      console.log(`   End Date: ${updated.end_date?.toISOString()}`);
      console.log(`   Enabled: ${updated.is_enabled}`);
      console.log(`   Academic Year: ${updated.academic_year}`);
      console.log(`   Semester Type: ${updated.semester_type}\n`);
    } else {
      console.log('❌ Regular phase not found');
    }

    // Check if there's an active phase now
    const activePhase = await prisma.registrationPhase.findFirst({
      where: {
        academic_year: currentYear,
        semester_type: semesterType,
        is_enabled: true,
        start_date: { lte: now },
        end_date: { gte: now },
      },
    });

    if (activePhase) {
      console.log('✅ Active phase found!');
      console.log(`   ${activePhase.phase_label} is currently active`);
      console.log('\n🎉 Students can now register for courses!');
    } else {
      console.log('⚠️  No active phase found. Check the dates.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enableRegistrationPhase();
