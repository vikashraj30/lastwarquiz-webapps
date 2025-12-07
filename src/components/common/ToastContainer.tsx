/**
 * Toast Container Component
 * Container for displaying toast notifications
 */

import React from 'react';
import Toast from './Toast';
import type { Toast as ToastType } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

/**
 * Container for managing multiple toasts
 * @param props - Toast container props
 */
const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

