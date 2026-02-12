import React from 'react';
import { useToolExecution } from './hooks/useToolExecution';
import { Editor } from './components/Editor';
import { ToolTabs } from './components/ToolTabs';
import { OutputPanel } from './components/OutputPanel';
import { CopyButton } from './components/CopyButton';
import { DownloadButton } from './components/DownloadButton';

const App: React.FC = () => {
  const {
    inputJSON,
    setInputJSON,
    outputResult,
    activeTool,
    setActiveTool,
    errorState,
    isExecuting,
    executeTool,
    clearOutput,
  } = useToolExecution();

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    clearOutput();
  };

  const handleExecute = () => {
    executeTool(activeTool as any);
  };

  const handleClear = () => {
    setInputJSON('');
    clearOutput();
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>JSON 工具站</h1>
        <p className="subtitle">工程化的 JSON 处理工具</p>
      </header>

      <main className="app-main">
        <div className="editor-section">
          <div className="section-header">
            <h2>输入</h2>
            <div className="action-buttons">
              <button onClick={handleClear} className="clear-button">
                清空
              </button>
            </div>
          </div>
          <Editor value={inputJSON} onChange={setInputJSON} placeholder="请输入 JSON 数据..." />
        </div>

        <div className="tools-section">
          <ToolTabs activeTool={activeTool as any} onToolChange={handleToolChange} />
          <button
            onClick={handleExecute}
            disabled={isExecuting || !inputJSON}
            className="execute-button"
          >
            {isExecuting ? '处理中...' : '执行'}
          </button>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2>输出</h2>
            <div className="action-buttons">
              <CopyButton text={outputResult} />
              <DownloadButton content={outputResult} />
            </div>
          </div>
          <OutputPanel
            value={outputResult}
            error={errorState?.message || null}
            loading={isExecuting}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>基于 React + TypeScript + Vite 构建</p>
      </footer>
    </div>
  );
};

export default App;
