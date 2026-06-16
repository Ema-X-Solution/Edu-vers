import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Book, Code, Mail, FileText, Hash } from 'lucide-react';
import { Modal, FormField, Input, Select, Button } from '@/shared/ui';
import { createCourseSchema } from '../validations/createCourseSchema';
import { createCourse, updateCourse } from '../services/coursesService';
import httpClient from '@/shared/services/httpClient';
import { COURSE_YEAR_OPTIONS, COURSE_SEMESTER_OPTIONS } from '../constants/coursesConstants';

const CreateCourseModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [professors, setProfessors] = useState([]);

  const isEdit = !!initialData;

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(createCourseSchema),
    defaultValues: {
      name: '', code: '', description: '', creditHours: 0,
      academicYear: '1', semester: 'FALL', professorEmail: '', isTraining: false,
    },
  });

  // Fetch Professors for dropdown
  useEffect(() => {
    if (isOpen) {
      httpClient.get('/users?role=Professor').then(res => {
        const profList = res.data || res.users || res;
        if (Array.isArray(profList)) {
          setProfessors(profList.map(p => ({
            value: p.email,
            label: `${p.fullName || p.name} (${p.email})`
          })));
        }
      }).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialData) {
      Object.keys(initialData).forEach(key => {
        if (key === 'professor' && initialData.professor?.email) {
          setValue('professorEmail', initialData.professor.email);
        } else {
          setValue(key, initialData[key]);
        }
      });
    } else if (isOpen) {
      reset();
    }
  }, [isOpen, initialData, setValue, reset]);

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (data) => {
    setServerError(null);
    setLoading(true);
    try {
      if (isEdit) {
        await updateCourse(initialData._id, data);
      } else {
        await createCourse(data);
      }
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.message ?? `Failed to ${isEdit ? 'update' : 'create'} course. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? "Edit Course" : "Add New Course"} size="lg">
      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Row 1: Name & Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField label="Course Name" htmlFor="c-name" error={errors.name?.message}>
            <Input id="c-name" placeholder="e.g. Data Structures" icon={Book} error={!!errors.name} {...register('name')} />
          </FormField>
          <FormField label="Course Code" htmlFor="c-code" error={errors.code?.message}>
            <Input id="c-code" placeholder="e.g. CS201" icon={Code} error={!!errors.code} {...register('code')} />
          </FormField>
        </div>

        {/* Row 2: Credit Hours & Professor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField label="Academic Year" htmlFor="c-year" error={errors.academicYear?.message}>
            <Select id="c-year" options={COURSE_YEAR_OPTIONS.filter(o => o.value !== '')} error={!!errors.academicYear} {...register('academicYear')} />
          </FormField>
          <FormField label="Semester" htmlFor="c-semester" error={errors.semester?.message}>
            <Select id="c-semester" options={COURSE_SEMESTER_OPTIONS} error={!!errors.semester} {...register('semester')} />
          </FormField>
        </div>

        {/* Row 4: Description */}
        <div className="mb-4">
          <FormField label="Description" htmlFor="c-desc" error={errors.description?.message}>
            <Input id="c-desc" placeholder="Course description..." icon={FileText} error={!!errors.description} {...register('description')} />
          </FormField>
        </div>

        {/* Row 5: isTraining Checkbox */}
        <div className="mb-6 flex items-center gap-2">
          <input 
            type="checkbox" 
            id="c-training" 
            {...register('isTraining')} 
            className="w-4 h-4 text-[#0D9488] rounded border-gray-300 focus:ring-[#0D9488]"
          />
          <label htmlFor="c-training" className="text-sm font-medium text-dark-blue cursor-pointer">
            This is a Training Course (0 Credit Hours)
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={handleClose}
            className="h-10 px-5 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-gray-text hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <Button type="submit" loading={isLoading} className="h-10 px-6">
            {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Course' : 'Create Course')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCourseModal;
