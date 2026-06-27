import React, { useState } from 'react';
import { PlayCircle, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import httpClient from '@/shared/services/httpClient';

const AdminSemesterButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [result, setResult] = useState(null);

  const handleStartSemester = async () => {
    try {
      setIsStarting(true);
      setResult(null);
      await httpClient.post('/academic-records/evaluate-all');
      setResult('success');
    } catch (err) {
      console.error('Failed to start new semester:', err);
      setResult('error');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors shadow-sm shadow-teal-500/20 shrink-0"
      >
        <PlayCircle size={15} />
        Start New Semester
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            {result === 'success' ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <h3 className="text-lg font-black text-dark-blue mb-2">Semester Started!</h3>
                <p className="text-sm text-gray-500 mb-6">All academic records have been evaluated and the new semester has been initiated successfully.</p>
                <button
                  onClick={() => { setShowConfirm(false); setResult(null); }}
                  className="w-full h-10 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors"
                >
                  Done
                </button>
              </div>
            ) : result === 'error' ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={28} className="text-red-500" />
                </div>
                <h3 className="text-lg font-black text-dark-blue mb-2">Something went wrong</h3>
                <p className="text-sm text-gray-500 mb-6">Failed to start the new semester. Please try again.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowConfirm(false); setResult(null); }}
                    className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartSemester}
                    className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle size={28} className="text-amber-500" />
                </div>
                <h3 className="text-lg font-black text-dark-blue text-center mb-2">Start New Semester</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                  This will evaluate all academic records and initiate a new semester for all students. Are you sure you want to proceed?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isStarting}
                    className="flex-1 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartSemester}
                    disabled={isStarting}
                    className="flex-1 h-10 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-bold transition-colors shadow-sm shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isStarting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <PlayCircle size={16} />
                    )}
                    {isStarting ? 'Starting...' : 'Confirm'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSemesterButton;
