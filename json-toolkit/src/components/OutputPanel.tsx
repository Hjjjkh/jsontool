import React from 'react';

interface OutputPanelProps {
  value: string;
  error: string | null;
  loading?: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ value, error, loading = false }) => {
  return (
    <div className="output-panel">
      {loading ? (
        <div className="loading-state">处理中...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : value ? (
        <pre className="output-content">{value}</pre>
      ) : (
        <div className="empty-state">输出结果将显示在这里</div>
      )}
    </div>
  );
};
