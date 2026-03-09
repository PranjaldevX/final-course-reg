-- Dummy Data for Testing Course Registration System
-- Run this AFTER running database-setup.sql

-- ============================================
-- 1. ADMIN/TEACHER ACCOUNTS
-- ============================================
-- Password for all: "password123"
-- Hashed using bcrypt with 10 rounds

INSERT INTO "Teacher" (name, email, password_hash, role, department, is_active) VALUES
('Admin User', 'admin@amu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 'admin', 'Administration', true),
('Dr. Rajesh Kumar', 'rajesh.kumar@amu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 'teacher', 'Computer Science', true),
('Prof. Priya Sharma', 'priya.sharma@amu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 'teacher', 'Mathematics', true),
('Dr. Mohammed Ali', 'mohammed.ali@amu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 'teacher', 'Physics', true);

-- ============================================
-- 2. FACULTY NUMBERS (Required for Students)
-- ============================================
INSERT INTO "FacultyNumber" (faculty_no, admission_year, branch_code, branch_name, roll_number, program_type) VALUES
('GP2201', 2022, 'CSE', 'Computer Science & Engineering', '001', 'B.Tech'),
('GP2202', 2022, 'CSE', 'Computer Science & Engineering', '002', 'B.Tech'),
('GP2203', 2022, 'CSE', 'Computer Science & Engineering', '003', 'B.Tech'),
('GP2204', 2022, 'ECE', 'Electronics & Communication', '004', 'B.Tech'),
('GP2205', 2022, 'ECE', 'Electronics & Communication', '005', 'B.Tech'),
('GM7605', 2022, 'CSE', 'Computer Science & Engineering', '7605', 'B.Tech');

-- ============================================
-- 3. STUDENT ACCOUNTS
-- ============================================
-- Password for all: "password123"
-- Email format: enrollment_no@myamu.ac.in

INSERT INTO "Student" (enrollment_no, faculty_no, name, email, password_hash, current_semester, current_cpi, hall, is_active) VALUES
('GF2201', 'GP2201', 'Rahul Verma', 'gf2201@myamu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 4, 8.5, 'Hall 1', true),
('GF2202', 'GP2202', 'Priya Singh', 'gf2202@myamu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 4, 9.0, 'Hall 2', true),
('GF2203', 'GP2203', 'Amit Patel', 'gf2203@myamu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 4, 7.8, 'Hall 1', true),
('GF2204', 'GP2204', 'Sneha Reddy', 'gf2204@myamu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 4, 8.2, 'Hall 3', true),
('GF2205', 'GP2205', 'Arjun Mehta', 'gf2205@myamu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 4, 8.7, 'Hall 2', true),
('GM7605', 'GM7605', 'Prityush Yadav', 'gm7605@myamu.ac.in', '$2b$10$qkqyrpV.kiJGI/sjRlGsMObmeLB/yG1EhQ99rDT4SalRGbtcC6bzS', 4, 8.3, 'Hall 1', true);

-- ============================================
-- 4. COURSES (Semester 4 - CSE)
-- ============================================
INSERT INTO "Course" (course_code, course_name, credits, semester_no, branch_code, is_elective, course_type) VALUES
-- Core Courses
('CSE401', 'Data Structures and Algorithms', 4, 4, 'CSE', false, 'Theory'),
('CSE402', 'Database Management Systems', 4, 4, 'CSE', false, 'Theory'),
('CSE403', 'Operating Systems', 4, 4, 'CSE', false, 'Theory'),
('CSE404', 'Computer Networks', 3, 4, 'CSE', false, 'Theory'),
('CSE405', 'Software Engineering', 3, 4, 'CSE', false, 'Theory'),

-- Lab Courses
('CSE411', 'Data Structures Lab', 2, 4, 'CSE', false, 'Lab'),
('CSE412', 'DBMS Lab', 2, 4, 'CSE', false, 'Lab'),

-- Elective Courses
('CSE451', 'Machine Learning', 3, 4, 'CSE', true, 'Theory'),
('CSE452', 'Web Development', 3, 4, 'CSE', true, 'Theory'),
('CSE453', 'Mobile App Development', 3, 4, 'CSE', true, 'Theory'),
('CSE454', 'Cloud Computing', 3, 4, 'CSE', true, 'Theory');

-- ============================================
-- 5. ELECTIVE GROUPS
-- ============================================
INSERT INTO "ElectiveGroup" (group_code, group_name, branch_code, semester_no, min_selection, max_selection) VALUES
('CSE-E1', 'Technical Elective Group 1', 'CSE', 4, 1, 2);

-- ============================================
-- 6. REGISTRATION PHASES (Current Semester)
-- ============================================
INSERT INTO "RegistrationPhase" (phase_name, phase_label, academic_year, semester_type, start_date, end_date, is_active, is_enabled) VALUES
('REGULAR', 'Regular Registration', 2024, 2, '2024-01-01 00:00:00', '2024-01-15 23:59:59', true, true),
('LATE', 'Late Registration', 2024, 2, '2024-01-16 00:00:00', '2024-01-20 23:59:59', false, true),
('ADD_DROP', 'Add/Drop Period', 2024, 2, '2024-01-21 00:00:00', '2024-01-25 23:59:59', false, true),
('WITHDRAWAL', 'Withdrawal Period', 2024, 2, '2024-01-26 00:00:00', '2024-01-31 23:59:59', false, true),
('FREEZE', 'Registration Frozen', 2024, 2, '2024-02-01 00:00:00', '2024-06-30 23:59:59', false, true);

-- ============================================
-- 7. SAMPLE COURSE REGISTRATIONS
-- ============================================
INSERT INTO "CourseRegistration" (enrollment_no, course_code, academic_year, semester_type, registration_type, is_approved, registered_at) VALUES
-- Student 1 registrations
('GF2201', 'CSE401', 2024, 2, 'regular', true, NOW()),
('GF2201', 'CSE402', 2024, 2, 'regular', true, NOW()),
('GF2201', 'CSE403', 2024, 2, 'regular', true, NOW()),

-- Student 2 registrations
('GF2202', 'CSE401', 2024, 2, 'regular', true, NOW()),
('GF2202', 'CSE404', 2024, 2, 'regular', true, NOW());

-- ============================================
-- TESTING CREDENTIALS
-- ============================================
-- 
-- ADMIN LOGIN:
-- Email: admin@amu.ac.in
-- Password: password123
--
-- TEACHER LOGIN:
-- Email: rajesh.kumar@amu.ac.in
-- Password: password123
--
-- STUDENT LOGINS:
-- Email: gf2201@myamu.ac.in
-- Password: password123
--
-- Email: gf2202@myamu.ac.in
-- Password: password123
--
-- Email: gm7605@myamu.ac.in (Prityush Yadav)
-- Password: password123
--
-- ============================================
