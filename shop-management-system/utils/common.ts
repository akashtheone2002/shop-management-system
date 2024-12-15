function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
function convertToCSV(data: any[]): string {
    if (!data || data.length === 0) {
      return "";
    }
  
    // Extract headers from the keys of the first object
    const headers = Object.keys(data[0]);
  
    // Convert headers and rows to CSV format
    const csvRows = [
      headers.join(","), // Header row
      ...data.map(row => 
        headers.map(header => `"${row[header] ?? ""}"`).join(",") // Data rows
      ),
    ];
  
    return csvRows.join("\n");
  }
  
  function downloadCSVFile(csvData: string, fileName: string): void {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
  }
  