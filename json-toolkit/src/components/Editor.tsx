import React, { useCallback, useRef, useState } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  readOnly = false,
  placeholder = '请输入 JSON 数据...',
  className = '',
  ariaLabel = 'JSON 编辑器',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onChange(content);
        }
      };
      reader.readAsText(file);
    }
  }, [onChange]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onChange(content);
        }
      };
      reader.readAsText(file);
    }
  }, [onChange]);

  const handleOpenFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`editor-container ${className} ${isDragging ? 'dragging' : ''}`}>
      <div className="editor-toolbar">
        <button 
          onClick={handleOpenFile} 
          className="file-open-button" 
          type="button"
          title="打开文件"
        >
          📁 打开文件
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.jsonl,.txt"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <span className="drag-hint">或拖拽文件到此处</span>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className="editor-textarea"
        spellCheck={false}
        aria-label={ariaLabel}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />
    </div>
  );
};
