/**
 * Students service — thin API layer.
 * All data-fetching logic lives here so pages stay pure UI.
 * Replace the mock implementations with real HTTP calls (axios/fetch) later.
 */

import { MOCK_STUDENTS } from '../constants/studentsConstants.jsx';

/** Simulate async network latency */
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

/**
 * Fetch a paginated + filtered slice of students.
 * @param {{ search?: string, status?: string, page?: number, pageSize?: number }} params
 * @returns {{ data: object[], total: number }}
 */
export const fetchStudents = async ({ search = '', status = '', page = 1, pageSize = 5 } = {}) => {
  await delay();

  let results = [...MOCK_STUDENTS];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }

  if (status) {
    results = results.filter((s) => s.status === status);
  }

  const total = results.length;
  const start = (page - 1) * pageSize;
  const data  = results.slice(start, start + pageSize);

  return { data, total };
};

/**
 * Delete a student by ID (mock).
 * @param {string} id
 */
export const deleteStudent = async (id) => {
  await delay(300);
  return { success: true, id };
};
