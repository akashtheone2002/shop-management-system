import React from "react";
import { X } from "lucide-react"; // Import close icon

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ show, onClose, children }: ModalProps) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md transition-opacity duration-300 ease-in-out"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white/90 shadow-2xl rounded-2xl p-8 w-[70%] max-w-3xl max-h-[90vh] overflow-auto relative animate-fadeIn">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
