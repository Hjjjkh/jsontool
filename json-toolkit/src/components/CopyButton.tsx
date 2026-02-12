import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
  ariaLabel?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className = '',
  ariaLabel = '复制到剪贴板',
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`copy-button ${className}`}
      type="button"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {copied ? '已复制' : '复制'}
    </button>
  );
};
