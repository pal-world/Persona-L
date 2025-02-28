import React from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in'>
      <div className='glass-card p-6 rounded-modern-lg w-[90%] max-w-md shadow-float relative'>
        <div className='flex items-center mb-4 text-amber-600'>
          <FaExclamationTriangle className='text-2xl mr-3' />
          <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
        </div>

        <p className='text-gray-600 mb-6'>{message}</p>

        <div className='flex gap-3 justify-end'>
          <button
            onClick={onCancel}
            className='btn btn-secondary py-2 px-4 rounded-modern flex items-center gap-2'
          >
            <FaTimes className='text-sm' />
            <span>취소</span>
          </button>
          <button
            onClick={onConfirm}
            className='btn btn-primary py-2 px-4 rounded-modern flex items-center gap-2'
          >
            <FaCheck className='text-sm' />
            <span>확인</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 