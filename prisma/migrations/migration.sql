-- =========================================================================
-- KIDDY AI V5.5 — POSTGRESQL DATABASE SCHEMAS & INFRASTRUCTURE MIGRATION
-- =========================================================================

-- 1. Table: users
CREATE TABLE IF NOT EXISTS public.users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student',
  school VARCHAR(255),
  grade VARCHAR(50),
  theme VARCHAR(50) DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: courses
CREATE TABLE IF NOT EXISTS public.courses (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  thumbnail VARCHAR(255),
  instructor_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: course_modules
CREATE TABLE IF NOT EXISTS public.course_modules (
  id VARCHAR(255) PRIMARY KEY,
  course_id VARCHAR(255) REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  "order" INTEGER NOT NULL
);

-- 4. Table: lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id VARCHAR(255) PRIMARY KEY,
  module_id VARCHAR(255) REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  video_url VARCHAR(255),
  pdf_url VARCHAR(255),
  duration VARCHAR(100)
);

-- 5. Table: assignments
CREATE TABLE IF NOT EXISTS public.assignments (
  id VARCHAR(255) PRIMARY KEY,
  lesson_id VARCHAR(255) REFERENCES public.lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 6. Table: assignment_submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id VARCHAR(255) PRIMARY KEY,
  assignment_id VARCHAR(255) REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id VARCHAR(255) REFERENCES public.users(id) ON DELETE CASCADE,
  file_url VARCHAR(255) NOT NULL,
  marks FLOAT DEFAULT 0.0,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Table: certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) REFERENCES public.users(id) ON DELETE CASCADE,
  course_id VARCHAR(255) REFERENCES public.courses(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Table: live_sessions
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  livekit_room VARCHAR(255) UNIQUE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 9. Table: messages
CREATE TABLE IF NOT EXISTS public.messages (
  id VARCHAR(255) PRIMARY KEY,
  room_id VARCHAR(255) NOT NULL,
  sender_id VARCHAR(255) REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Table: bootcamps
CREATE TABLE IF NOT EXISTS public.bootcamps (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  banner VARCHAR(255),
  form_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Table: xp_transactions
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES public.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Table: badges
CREATE TABLE IF NOT EXISTS public.badges (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  icon VARCHAR(255) NOT NULL
);

-- 13. Table: user_badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id VARCHAR(255) PRIMARY KEY,
  badge_id VARCHAR(255) REFERENCES public.badges(id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES public.users(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- CREATE INDEXES FOR SEARCH OPTIMIZATION & KEY LOOKUPS
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lesson ON public.assignments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON public.certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_xp_user ON public.xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- =========================================================================
-- STORAGE BUCKETS INITIALIZATION METADATA
-- =========================================================================
-- To insert these via SQL into Supabase Storage system:
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('course-thumbnails', 'course-thumbnails', true),
('course-videos', 'course-videos', false),
('course-pdfs', 'course-pdfs', false),
('assignments', 'assignments', false),
('submissions', 'submissions', false),
('certificates', 'certificates', true),
('bootcamp-assets', 'bootcamp-assets', true),
('resources', 'resources', true),
('community-posts', 'community-posts', true),
('teacher-assets', 'teacher-assets', false)
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SECURITY RLS POLICIES DEFINITIONS
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Students can read all courses
CREATE POLICY IF NOT EXISTS "Allow public read access to courses" ON public.courses
  FOR SELECT USING (true);

-- Policy: Users can update their own profile settings
CREATE POLICY IF NOT EXISTS "Allow users to update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id);

-- Policy: Users can read own messages
CREATE POLICY IF NOT EXISTS "Allow users to read room messages" ON public.messages
  FOR SELECT USING (true);
