import { useState, useEffect } from "react";

interface IAlertProps {
  success: boolean;
  text: string;
  duration: number; // Duration in seconds
  setVisible: (visible: boolean) => void; // Function to set visibility externally
}

const Alert = (props: IAlertProps) => {
  const { success, text, duration, setVisible } = props;

  useEffect(() => {
    // Set a timer to hide the alert after the specified duration
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration * 1000); // Convert seconds to milliseconds

    // Cleanup the timer when the component unmounts or re-renders
    return () => clearTimeout(timer);
  }, [duration, setVisible]); // Rerun if `duration` or `setVisible` changes

  return (
    <div
      className={`${
        success ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"
      } border px-4 py-3 rounded relative`}
      role="alert"
    >
      <strong className="font-bold">{success ? "Success!" : "Failed!"}</strong>
      <span className="block sm:inline"> {text}</span>
      <span
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={() => setVisible(false)} // Allow manual dismissal
        role="button"
      >
        <svg
          className="fill-current h-6 w-6 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </span>
    </div>
  );
};

export default Alert;
