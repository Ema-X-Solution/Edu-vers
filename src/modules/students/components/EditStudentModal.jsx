import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Hash } from 'lucide-react';
import { Modal, FormField, Input, Select, Button } from '@/shared/ui';
import PasswordField from '@/modules/auth/components/PasswordField';
import { updateStudent } from '../services/studentsService';

const YEAR_OPTIONS = [
  { value: '1', label: '1st Year (Freshman)' },
  { value: '2', label: '2nd Year (Sophomore)' },
  { value: '3', label: '3rd Year (Junior)' },
  { value: '4', label: '4th Year (Senior)' },
];

const ROLE_OPTIONS = [
  { value: 'Student', label: 'Student' }
];

const updateStudentSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().nullable().transform((v, o) => o === '' ? null : v).notRequired()
    .test('min', 'Password must be at least 8 characters', (value) => !value || value.length >= 8)
    .test('uppercase', 'Must contain at least one uppercase letter', (value) => !value || /[A-Z]/.test(value))
    .test('number', 'Must contain at least one number', (value) => !value || /\d/.test(value)),
  role: yup.string().required('Role is required').oneOf(['Student']),
  academicId: yup.string().required('Academic ID is required'),
  currentYear: yup.string().required('Academic year is required'),
});

const EditStudentModal = ({ isOpen, onClose, onSuccess, student }) => {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(updateStudentSchema),
    defaultValues: {
      fullName: '', email: '', password: '', role: 'Student',
      academicId: '', currentYear: '',
    },
  });

  useEffect(() => {
    if (student && isOpen) {
      reset({
        fullName: student.fullName || '',
        email: student.email || '',
        role: student.role || 'Student',
        academicId: student.academicId || '',
        currentYear: String(student.currentYear || ''),
        password: '',
      });
    }
  }, [student, isOpen, reset]);

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (data) => {
    setServerError(null);
    setLoading(true);
    try {
      const payload = { ...data };
      if (!payload.password) delete payload.password;
      await updateStudent(student._id, payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.message ?? 'Failed to update account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Account" size="lg">
      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormField label="Full Name" htmlFor="es-fullName" error={errors.fullName?.message}>
            <Input id="es-fullName" placeholder="e.g. Ahmed Ali" icon={User} error={!!errors.fullName} {...register('fullName')} />
          </FormField>
          <FormField label="Email Address" htmlFor="es-email" error={errors.email?.message}>
            <Input id="es-email" type="email" placeholder="student@edu.com" icon={Mail} error={!!errors.email} {...register('email')} />
          </FormField>
        </div>

        {/* Row 2: Password & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormField label="Password (Leave empty to keep)" htmlFor="es-password" error={errors.password?.message}>
            <PasswordField
              id="es-password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              error={!!errors.password}
              {...register('password')}
            />
          </FormField>
          <FormField label="Role" htmlFor="es-role" error={errors.role?.message}>
            <Select id="es-role" options={ROLE_OPTIONS} error={!!errors.role} {...register('role')} />
          </FormField>
        </div>

        {/* Row 3: Academic ID & Academic Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <FormField label="Academic ID" htmlFor="es-academicId" error={errors.academicId?.message}>
            <Input id="es-academicId" placeholder="e.g. #42022034" icon={Hash} error={!!errors.academicId} {...register('academicId')} />
          </FormField>
          <FormField label="Academic Year" htmlFor="es-year" error={errors.currentYear?.message}>
            <Select id="es-year" placeholder="Select year" options={YEAR_OPTIONS} error={!!errors.currentYear} {...register('currentYear')} />
          </FormField>
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditStudentModal;
