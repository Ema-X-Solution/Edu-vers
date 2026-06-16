import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Book, Code, Hash, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/app/layouts';
import { Card, FormField, Input, Select, Button } from '@/shared/ui';
import { createCourseSchema } from '../validations/createCourseSchema';
import { createCourse, updateCourse } from '../services/coursesService';
import httpClient from '@/shared/services/httpClient';
import { COURSE_YEAR_OPTIONS, COURSE_SEMESTER_OPTIONS } from '../constants/coursesConstants';
import { ROUTES } from '@/shared/constants';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // When editing, course data is passed via navigation state
  const initialData = location.state?.course || null;
  const isEdit = !!initialData;

  const [serverError, setServerError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [professors, setProfessors] = useState([]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(createCourseSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      creditHours: 0,
      academicYear: '1',
      semester: 'FALL',
      professorEmail: '',
      isTraining: false,
    },
  });

  // Fetch professors list
  useEffect(() => {
    httpClient.get('/users?role=Professor').then(res => {
      const profList = res.data || res.users || res;
      if (Array.isArray(profList)) {
        setProfessors(profList.map(p => ({
          value: p.email,
          label: `${p.fullName || p.name} (${p.email})`
        })));
      }
    }).catch(console.error);
  }, []);

  // Prefill form if editing
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        if (key === 'professor' && initialData.professor?.email) {
          setValue('professorEmail', initialData.professor.email);
        } else {
          setValue(key, initialData[key]);
        }
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    setServerError(null);
    setLoading(true);
    try {
      if (isEdit) {
        await updateCourse(initialData._id, data);
      } else {
        await createCourse(data);
      }
      navigate(ROUTES.COURSES);
    } catch (err) {
      setServerError(err.message ?? `Failed to ${isEdit ? 'update' : 'create'} course. Please try again.`);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.COURSES)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-dark-blue hover:border-dark-blue transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark-blue">
            {isEdit ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-gray-text text-sm mt-1">
            {isEdit ? 'Update the course details below.' : 'Fill in the details to add a new course to the catalog.'}
          </p>
        </div>
      </div>

      <Card>
        {serverError && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Row 1: Name & Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <FormField label="Course Name" htmlFor="c-name" error={errors.name?.message}>
              <Input id="c-name" placeholder="e.g. Data Structures" icon={Book} error={!!errors.name} {...register('name')} />
            </FormField>
            <FormField label="Course Code" htmlFor="c-code" error={errors.code?.message}>
              <Input id="c-code" placeholder="e.g. CS201" icon={Code} error={!!errors.code} {...register('code')} />
            </FormField>
          </div>

          {/* Row 2: Credit Hours & Professor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <FormField label="Credit Hours" htmlFor="c-credits" error={errors.creditHours?.message}>
              <Input id="c-credits" type="number" placeholder="e.g. 3" icon={Hash} error={!!errors.creditHours} {...register('creditHours')} />
            </FormField>
            <FormField label="Professor" htmlFor="c-prof" error={errors.professorEmail?.message}>
              <Select
                id="c-prof"
                placeholder="Select Professor"
                options={professors}
                error={!!errors.professorEmail}
                {...register('professorEmail')}
              />
            </FormField>
          </div>

          {/* Row 3: Year & Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <FormField label="Academic Year" htmlFor="c-year" error={errors.academicYear?.message}>
              <Select id="c-year" options={COURSE_YEAR_OPTIONS.filter(o => o.value !== '')} error={!!errors.academicYear} {...register('academicYear')} />
            </FormField>
            <FormField label="Semester" htmlFor="c-semester" error={errors.semester?.message}>
              <Select id="c-semester" options={COURSE_SEMESTER_OPTIONS} error={!!errors.semester} {...register('semester')} />
            </FormField>
          </div>

          {/* Description — Full-width Textarea */}
          <div className="mb-5">
            <FormField label="Description" htmlFor="c-desc" error={errors.description?.message}>
              <textarea
                id="c-desc"
                rows={5}
                placeholder="Enter a detailed course description..."
                {...register('description')}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-dark-blue placeholder:text-gray-400 outline-none transition-colors resize-none leading-relaxed
                  ${errors.description
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-[#E2E8F0] bg-white focus:border-[#0D9488]'
                  }`}
              />
            </FormField>
          </div>

          {/* isTraining Checkbox */}
          <div className="mb-8 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              id="c-training"
              {...register('isTraining')}
              className="w-4 h-4 text-[#0D9488] rounded border-gray-300 focus:ring-[#0D9488] cursor-pointer"
            />
            <label htmlFor="c-training" className="text-sm font-medium text-dark-blue cursor-pointer select-none">
              This is a <span className="text-[#0D9488] font-bold">Training Course</span> (No Credit Hours Assigned)
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-5 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => navigate(ROUTES.COURSES)}
              className="w-full sm:w-auto h-10 px-6 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-gray-text hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button type="submit" loading={isLoading} className="w-full sm:w-auto h-10 px-8">
              {isLoading
                ? (isEdit ? 'Updating...' : 'Creating...')
                : (isEdit ? 'Update Course' : 'Create Course')}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default CreateCoursePage;
