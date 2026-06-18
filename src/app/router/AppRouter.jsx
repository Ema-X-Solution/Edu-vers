import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { Loader } from '@/shared/ui';

// ---------------------------------------------------------------------------
// Lazy-loaded pages — each page is a separate chunk, loaded on demand.
// Suspense shows a full-page spinner while the chunk is fetching.
// ---------------------------------------------------------------------------
const LoginPage          = lazy(() => import('@/modules/auth/pages/LoginPage'));
const ForgotPasswordPage  = lazy(() => import('@/modules/auth/pages/ForgotPasswordPage'));
const OTPVerificationPage = lazy(() => import('@/modules/auth/pages/OTPVerificationPage'));
const ResetPasswordPage   = lazy(() => import('@/modules/auth/pages/ResetPasswordPage'));
const DashboardPage       = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const StudentDashboardPage = lazy(() => import('@/modules/dashboard/pages/StudentDashboardPage'));
const ProfDashboardPage    = lazy(() => import('@/modules/dashboard/pages/ProfDashboardPage'));
const StudentsPage        = lazy(() => import('@/modules/students/pages/StudentsPage'));
const StaffPage           = lazy(() => import('@/modules/staff/pages/StaffPage'));
const CoursesPage         = lazy(() => import('@/modules/courses/pages/CoursesPage'));
const StudentCoursesPage  = lazy(() => import('@/modules/courses/pages/StudentCoursesPage'));
const CreateCoursePage    = lazy(() => import('@/modules/courses/pages/CreateCoursePage'));
const CourseDetailsPage   = lazy(() => import('@/modules/courses/pages/CourseDetailsPage'));

/** Full-page loading fallback shown during lazy chunk fetch */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-app">
    <Loader size="lg" />
  </div>
);

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Root redirect */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

      {/* Auth Flow */}
      <Route path={ROUTES.LOGIN}           element={<LoginPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD}  element={<ForgotPasswordPage />} />
      <Route path={ROUTES.VERIFY_OTP}       element={<OTPVerificationPage />} />
      <Route path={ROUTES.RESET_PASSWORD}   element={<ResetPasswordPage />} />

      {/* Dashboards */}
      <Route path={ROUTES.DASHBOARD}  element={<DashboardPage />} />
      <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboardPage />} />
      <Route path={ROUTES.PROF_DASHBOARD} element={<ProfDashboardPage />} />

      {/* Students, Staff & Courses */}
      <Route path={ROUTES.STUDENTS}   element={<StudentsPage />} />
      <Route path={ROUTES.STAFF}      element={<StaffPage />} />
      <Route path={ROUTES.COURSES}         element={<CoursesPage />} />
      <Route path={ROUTES.STUDENT_COURSES} element={<StudentCoursesPage />} />
      <Route path={ROUTES.COURSE_CREATE}   element={<CreateCoursePage />} />
      <Route path={`${ROUTES.COURSE_EDIT}/:id`} element={<CreateCoursePage />} />
      <Route path={`${ROUTES.COURSES}/:id`}     element={<CourseDetailsPage />} />

      {/* Fallback — redirect unknown paths to login or dashboard */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  </Suspense>
);

export default AppRouter;
