import React from 'react';
import { Modal } from '@/shared/ui';

const StudentScheduleModal = ({ isOpen, onClose }) => {
  // Simple mock schedule grid
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const times = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Schedule" size="xl">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr>
              <th className="border border-teal-100 bg-teal-50 p-2 text-xs font-bold text-teal-800">Time</th>
              {days.map(day => (
                <th key={day} className="border border-teal-100 bg-teal-50 p-2 text-xs font-bold text-teal-800">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time}>
                <td className="border border-teal-100 bg-white p-2 text-xs font-bold text-teal-600 text-center w-20">
                  {time}
                </td>
                {days.map(day => (
                  <td key={`${day}-${time}`} className="border border-teal-100 bg-white p-1">
                    {/* Mock data point */}
                    {day === 'Monday' && time === '10:00' && (
                      <div className="bg-teal-100 text-teal-800 text-[10px] p-1 rounded font-bold text-center">
                        Data Mining
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default StudentScheduleModal;
