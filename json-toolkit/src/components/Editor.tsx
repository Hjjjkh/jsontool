import React, { useCallback } from 'react';

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
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className={`editor-container ${className}`}>
      <textarea
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className="editor-textarea"
        spellCheck={false}
        aria-label={ariaLabel}
      />
    </div>
  );
};
