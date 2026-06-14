import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, Mail, Hash } from 'lucide-react';
import { Modal, FormField, Input, Select, Button } from '@/shared/ui';
import PasswordField from '@/modules/auth/components/PasswordField';
import { createAccount } from '@/modules/auth/services/authService';
import { createStudentSchema } from '../validations/createStudentSchema';

const YEAR_OPTIONS = [
  { value: '1', label: '1st Year (Freshman)' },
  { value: '2', label: '2nd Year (Sophomore)' },
  { value: '3', label: '3rd Year (Junior)' },
  { value: '4', label: '4th Year (Senior)' },
];

const ROLE_OPTIONS = [
  { value: 'Student', label: 'Student' }
];

const CreateStudentModal = ({ isOpen, onClose, onSuccess }) => {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(createStudentSchema),
    defaultValues: {
      fullName: '', email: '', password: '', role: 'Student',
      academicId: '', currentYear: '',
    },
  });

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (data) => {
    setServerError(null);
    setLoading(true);
    try {
      await createAccount(data);
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      setServerError(err.message ?? 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Account" size="lg">
      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormField label="Full Name" htmlFor="s-fullName" error={errors.fullName?.message}>
            <Input id="s-fullName" placeholder="e.g. Ahmed Ali" icon={User} error={!!errors.fullName} {...register('fullName')} />
          </FormField>
          <FormField label="Email Address" htmlFor="s-email" error={errors.email?.message}>
            <Input id="s-email" type="email" placeholder="student@edu.com" icon={Mail} error={!!errors.email} {...register('email')} />
          </FormField>
        </div>

        {/* Row 2: Password & Role */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormField label="Password" htmlFor="s-password" error={errors.password?.message}>
            <PasswordField
              id="s-password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              error={!!errors.password}
              {...register('password')}
            />
          </FormField>
          <FormField label="Role" htmlFor="s-role" error={errors.role?.message}>
            <Select id="s-role" options={ROLE_OPTIONS} error={!!errors.role} {...register('role')} />
          </FormField>
        </div>

        {/* Row 3: Academic ID & Academic Year */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <FormField label="Academic ID" htmlFor="s-academicId" error={errors.academicId?.message}>
            <Input id="s-academicId" placeholder="e.g. #42022034" icon={Hash} error={!!errors.academicId} {...register('academicId')} />
          </FormField>
          <FormField label="Academic Year" htmlFor="s-year" error={errors.currentYear?.message}>
            <Select id="s-year" placeholder="Select year" options={YEAR_OPTIONS} error={!!errors.currentYear} {...register('currentYear')} />
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
            {isLoading ? 'Creating...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStudentModal;
