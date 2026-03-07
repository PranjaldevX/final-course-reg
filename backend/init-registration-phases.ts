import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function initPhases() {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semesterType = currentMonth >= 7 ? 1 : 2;

    console.log(`🔍 Checking registration phases for ${currentYear} Semester ${semesterType}`);

    const existingPhases = await prisma.registrationPhase.findMany({
      where: {
        academic_year: currentYear,
        semester_type: semesterType,
      },
    });

    console.log(`📊 Found ${existingPhases.length} existing phases`);

    if (existingPhases.length > 0) {
      console.log("\n✅ Phases already exist:");
      existingPhases.forEach(phase => {
        console.log(`   - ${phase.phase_label} (${phase.is_enabled ? 'Enabled' : 'Disabled'})`);
      });
      return;
    }

    console.log("\n🔧 Creating default phases...");

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
          is_enabled: false,
          is_active: false,
        },
      });
      console.log(`   ✓ Created: ${phase.phase_label}`);
    }

    console.log("\n✅ All phases created successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Go to Faculty Dashboard → Registration Control");
    console.log("   2. Enable phases and set dates");
    console.log("   3. Save changes");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

initPhases();
