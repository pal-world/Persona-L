import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  warningText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  warningText,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소'
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in backdrop-blur-sm'>
      <div className='bg-white rounded-modern-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden animate-scale-in'>
        <div className='p-5 border-b border-gray-200 bg-gradient-to-r from-purple-100 to-purple-50'>
          <div className='flex items-center'>
            <div className='w-10 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 shadow-sm'>
              <FaExclamationTriangle className='text-purple-600' />
            </div>
            <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
          </div>
        </div>
        <div className='p-5 bg-white'>
          <p className='text-gray-600 mb-5 leading-relaxed'>
            {message}
            {warningText && (
              <>
                <br />
                <span className='text-sm text-purple-600'>{warningText}</span>
              </>
            )}
          </p>
          <div className='flex justify-end gap-3'>
            <button
              onClick={onCancel}
              className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-modern transition-colors'
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-modern transition-colors shadow-sm'
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 