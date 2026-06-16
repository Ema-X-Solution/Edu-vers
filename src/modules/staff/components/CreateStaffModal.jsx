import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, Mail, Hash } from 'lucide-react';
import { Modal, FormField, Input, Select, Button } from '@/shared/ui';
import PasswordField from '@/modules/auth/components/PasswordField';
import { createAccount } from '@/modules/auth/services/authService';
import { createStaffSchema } from '../validations/createStaffSchema';

const ROLE_OPTIONS = [
  { value: 'Professor', label: 'Professor' }
];

const CreateStaffModal = ({ isOpen, onClose, onSuccess }) => {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(createStaffSchema),
    defaultValues: {
      fullName: '', email: '', password: '', role: 'Professor',
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Academic Staff Member" size="lg">
      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Row 1: Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormField label="Full Name" htmlFor="st-fullName" error={errors.fullName?.message}>
            <Input id="st-fullName" placeholder="e.g. Dr. Ahmed Ali" icon={User} error={!!errors.fullName} {...register('fullName')} />
          </FormField>
          <FormField label="Email Address" htmlFor="st-email" error={errors.email?.message}>
            <Input id="st-email" type="email" placeholder="staff@edu.com" icon={Mail} error={!!errors.email} {...register('email')} />
          </FormField>
        </div>

        {/* Row 2: Password & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <FormField label="Password" htmlFor="st-password" error={errors.password?.message}>
            <PasswordField
              id="st-password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              error={!!errors.password}
              {...register('password')}
            />
          </FormField>
          <FormField label="Role" htmlFor="st-role" error={errors.role?.message}>
            <Select id="st-role" options={ROLE_OPTIONS} error={!!errors.role} {...register('role')} />
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
            {isLoading ? 'Creating...' : 'Add Staff Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStaffModal;
