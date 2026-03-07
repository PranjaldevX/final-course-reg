# Bulk Upload Guide

## Overview

Your system supports bulk uploading of:
1. ✅ **Students with Grades** (via CSV - already working)
2. ✅ **Student Information** (via CSV - already working)
3. ✅ **Courses** (via CSV script - new)

---

## 1. Student Data Upload (Already Working)

### How to Use:
1. Login as **Admin**
2. Go to **Faculty Dashboard**
3. Click **Upload CSV** tab
4. Choose your CSV file
5. Click **Upload**

### Supported Formats:

#### Format 1: Student Grades
```csv
faculty_no,enrollment_no,semester,current_sem,course1,grade1,course2,grade2
24COBEA160,gq5012,S21221,4,EEC2922,A,EEC2932,B+
```

#### Format 2: Student Info
```csv
Sem,Br,FacultyN,EnrolN,Name,Semester,Hall,SPI,CPI
S21221,COBEA,24COBEA160,gq5012,Vipan Kumar,4,Hall A,8.5,8.2
```

### Sample Files:
- `Sample CSV Files/format1-student-grades.csv` (10 students with grades)
- `Sample CSV Files/format2-student-info.csv` (10 students with info)

---

## 2. Bulk Course Import (New Script)

### Sample File:
- `Sample CSV Files/bulk-courses.csv` (25 courses across 3 branches)

### CSV Format:
```csv
course_code,course_name,credits,semester_no,branch_code,is_elective,elective_group,course_type
CSE401,Data Structures,4,4,COBEA,false,,Theory
CSE408,Machine Learning,3,4,COBEA,true,ELEC_A,Theory
```

### How to Import:

**Step 1:** Edit the CSV file with your courses
```bash
# File location: Sample CSV Files/bulk-courses.csv
```

**Step 2:** Run the import script
```bash
cd backend
npx ts-node import-courses-from-csv.ts
```

**Step 3:** Check the output
```
🚀 Starting course import...
📂 Reading CSV file...
Found 25 courses to import

✅ Created: CSE401 - Data Structures
✅ Created: CSE402 - Database Management Systems
...

📊 Import Summary:
   ✅ Created: 25
   🔄 Updated: 0
   ❌ Errors: 0
   📝 Total: 25
```

---

## 3. Quick Reference

### Student CSV Upload
- **Location:** Faculty Dashboard → Upload CSV tab
- **Status:** ✅ Working
- **Formats:** 2 formats supported (auto-detected)
- **Features:**
  - Auto-creates students, faculty numbers, courses, grades
  - Handles duplicates gracefully
  - Shows detailed error messages
  - Preview before upload

### Course CSV Import
- **Location:** Backend script
- **Status:** ✅ Ready to use
- **Script:** `backend/import-courses-from-csv.ts`
- **Features:**
  - Creates new courses
  - Updates existing courses
  - Validates data
  - Shows progress and summary

---

## 4. Sample Data Included

### Students (Format 1 - with grades):
- 10 students across 3 branches (COBEA, ELBEA, MEBEA)
- Each with 5 courses and grades
- Semester 4 students

### Students (Format 2 - info only):
- 10 students with profile information
- Includes: Name, Hall, SPI, CPI
- No grade data

### Courses:
- 25 courses across 3 branches
- Mix of Theory and Lab courses
- Includes mandatory and elective courses
- Elective groups configured

---

## 5. Testing the Upload Feature

### Test Student Upload:
1. Login as admin (teacher@myamu.ac.in / Teacher@123)
2. Go to Faculty Dashboard
3. Click "Upload CSV" tab
4. Upload `Sample CSV Files/format1-student-grades.csv`
5. Check the results

### Test Course Import:
```bash
cd backend
npx ts-node import-courses-from-csv.ts
```

---

## 6. Important Notes

### Student Upload:
- ✅ Students are created as **inactive** by default
- ✅ Use activation script to enable login
- ✅ Duplicate students are updated, not duplicated
- ✅ Courses are auto-created if they don't exist

### Course Import:
- ✅ Duplicate courses are updated, not duplicated
- ✅ All fields are validated
- ✅ Elective groups are optional
- ✅ Branch codes must match existing branches

---

## 7. File Locations

```
CourseRegistrationSystem/
├── Sample CSV Files/
│   ├── README.md                    # Student CSV documentation
│   ├── README-COURSES.md            # Course CSV documentation
│   ├── format1-student-grades.csv   # 10 students with grades
│   ├── format2-student-info.csv     # 10 students with info
│   └── bulk-courses.csv             # 25 courses
│
└── backend/
    ├── import-courses-from-csv.ts   # Course import script
    └── src/
        └── services/
            └── csv-upload.service.ts # Student upload service
```

---

## 8. Next Steps

### To Add More Students:
1. Edit `format1-student-grades.csv` or `format2-student-info.csv`
2. Add more rows following the same format
3. Upload via Faculty Dashboard

### To Add More Courses:
1. Edit `bulk-courses.csv`
2. Add more rows following the same format
3. Run `npx ts-node import-courses-from-csv.ts`

### To Activate Students:
```bash
cd backend
npx ts-node activate-student.ts
# Follow the prompts
```

---

## 9. Troubleshooting

### "CSV file not found"
- Make sure you're in the `backend` folder
- Check that `Sample CSV Files/bulk-courses.csv` exists

### "Course already exists"
- The script will update existing courses
- Check the "Updated" count in the summary

### "Invalid branch code"
- Make sure branch codes match: COBEA, ELBEA, MEBEA, etc.
- Check the branch codes in your database

### Student upload not working
- Make sure you're logged in as admin
- Check that the CSV format matches exactly
- Look for error messages in the upload response

---

## Summary

✅ **Student Upload:** Working via UI (Faculty Dashboard → Upload CSV)
✅ **Course Import:** Working via script (`import-courses-from-csv.ts`)
✅ **Sample Files:** Created with realistic data
✅ **Documentation:** Complete with examples

You can now bulk upload both students and courses!
