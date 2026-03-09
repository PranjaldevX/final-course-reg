-- Add Prityush Yadav Student Account
-- Run this in Neon SQL Editor

-- Step 1: Add Faculty Number
INSERT INTO "FacultyNumber" (faculty_no, admission_year, branch_code, branch_name, roll_number, program_type) 
VALUES ('GM7605', 2022, 'CSE', 'Computer Science & Engineering', '7605', 'B.Tech')
ON CONFLICT (faculty_no) DO NOTHING;

-- Step 2: Add Student Account
-- Email: gm7605@myamu.ac.in
-- Password: password123
INSERT INTO "Student" (enrollment_no, faculty_no, name, email, password_hash, current_semester, current_cpi, hall, is_active) 
VALUES (
  'GM7605', 
  'GM7605', 
  'Prityush Yadav', 
  'gm7605@myamu.ac.in', 
  '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 
  4, 
  8.3, 
  'Hall 1', 
  true
)
ON CONFLICT (enrollment_no) DO NOTHING;

-- Verify the account was created
SELECT 
  s.enrollment_no,
  s.name,
  s.email,
  s.current_semester,
  s.current_cpi,
  s.hall,
  s.is_active,
  f.branch_name
FROM "Student" s
JOIN "FacultyNumber" f ON s.faculty_no = f.faculty_no
WHERE s.enrollment_no = 'GM7605';

-- ============================================
-- LOGIN CREDENTIALS:
-- Email: gm7605@myamu.ac.in
-- Password: password123
-- ============================================
