import React, { useState } from 'react';
import Papa from 'papaparse'; // Install with `npm install papaparse`

interface IUploaderProps<T extends Record<string, unknown>> {
  text: string; // A description or the name of the data model
  handleUpload: (data: T[]) => void; // Function to handle the processed data
}

const Uploader = <T extends Record<string, unknown>>({
  text,
  handleUpload,
}: IUploaderProps<T>) => {
  const [fileData, setFileData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFileSelected(false);

    const file = e.target.files ? e.target.files[0] : null;
    console.log(file);
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        header: true, // Automatically map CSV headers to object keys
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result);
          const parsedData = result.data as T[];
          setFileData(parsedData); // Set the parsed data as state
          setFileSelected(true);
          setLoading(false);
        },
        error: (err) => {
          setError(`Error parsing CSV: ${err.message}`);
          setLoading(false);
        },
      });
    }
    console.log(fileData)
  };

  const handleUploadClick = () => {
    if (fileData.length > 0) {
      handleUpload(fileData); // Pass processed data to the parent function
    } else {
      setError('No data to upload!');
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-2xl mb-4">{text}</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 p-2 border rounded"
      />
      <button
        onClick={handleUploadClick}
        disabled={loading || !fileSelected}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload CSV'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {fileSelected && fileData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl mb-4">Preview</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {Object.keys(fileData[0]).map((key, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 bg-gray-100"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 px-4 py-2 text-center"
                    >
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Uploader;
