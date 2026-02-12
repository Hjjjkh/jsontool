import React from 'react';

interface DownloadButtonProps {
  content: string;
  filename?: string;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename = 'output.json',
  className = '',
}) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} disabled={!content} className={`download-button ${className}`}>
      下载
    </button>
  );
};
