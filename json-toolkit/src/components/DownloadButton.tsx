import React from 'react';

interface DownloadButtonProps {
  content: string;
  filename?: string;
  className?: string;
  ariaLabel?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename = 'output.json',
  className = '',
  ariaLabel = '下载文件',
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
    <button
      onClick={handleDownload}
      disabled={!content}
      className={`download-button ${className}`}
      type="button"
      aria-label={ariaLabel}
    >
      下载
    </button>
  );
};
