import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import Papa from 'papaparse';
import * as path from 'path';

const prisma = new PrismaClient();

async function importCourses() {
  try {
    // Read CSV file
    const csvPath = path.join(__dirname, '..', 'Sample CSV Files', 'bulk-courses.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found:', csvPath);
      console.log('Please create the file at:', csvPath);
      return;
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('📂 Reading CSV file...\n');
    
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      console.error('❌ CSV parsing errors:');
      parsed.errors.forEach(err => console.error(`  - ${err.message}`));
      return;
    }

    const courses = parsed.data as any[];
    console.log(`Found ${courses.length} courses to import\n`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const row of courses) {
      try {
        const courseData = {
          course_code: row.course_code?.trim(),
          course_name: row.course_name?.trim(),
          credits: parseInt(row.credits),
          semester_no: parseInt(row.semester_no),
          branch_code: row.branch_code?.trim(),
          is_elective: row.is_elective?.toLowerCase() === 'true',
          elective_group: row.elective_group?.trim() || null,
          course_type: row.course_type?.trim(),
        };

        // Validate required fields
        if (!courseData.course_code || !courseData.course_name) {
          console.error(`❌ Skipping row: Missing course_code or course_name`);
          errors++;
          continue;
        }

        // Check if course exists
        const existing = await prisma.course.findUnique({
          where: { course_code: courseData.course_code },
        });

        if (existing) {
          // Update existing course
          await prisma.course.update({
            where: { course_code: courseData.course_code },
            data: courseData,
          });
          console.log(`🔄 Updated: ${courseData.course_code} - ${courseData.course_name}`);
          updated++;
        } else {
          // Create new course
          await prisma.course.create({
            data: courseData,
          });
          console.log(`✅ Created: ${courseData.course_code} - ${courseData.course_name}`);
          created++;
        }
      } catch (error: any) {
        console.error(`❌ Error processing ${row.course_code}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📝 Total: ${courses.length}`);

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

console.log('🚀 Starting course import...\n');
importCourses();
