import * as yup from 'yup';

export const createCourseSchema = yup.object({
  name:           yup.string().required('Course name is required'),
  code:           yup.string().required('Course code is required'),
  description:    yup.string().required('Description is required'),
  creditHours:    yup.number().typeError('Must be a number').min(0, 'Min 0').required('Credit hours is required'),
  academicYear:   yup.string().required('Academic year is required'),
  semester:       yup.string().required('Semester is required'),
  professorEmail: yup.string().email('Invalid email format').required('Professor is required'),
  isTraining:     yup.boolean().default(false),
});
