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
        <p className="subtitle">专业的 JSON 处理工具 - 格式化、压缩、转换、校验一站式解决方案</p>
      </header>

      <main className="app-main">
        <section className="editor-section" aria-labelledby="input-heading">
          <div className="section-header">
            <h2 id="input-heading">输入</h2>
            <div className="action-buttons">
              <button onClick={handleClear} className="clear-button" type="button">
                清空
              </button>
            </div>
          </div>
          <Editor
            value={inputJSON}
            onChange={setInputJSON}
            placeholder="请输入或粘贴 JSON 数据..."
            aria-label="JSON 输入区域"
          />
        </section>

        <section className="tools-section" aria-labelledby="tools-heading">
          <ToolTabs
            activeTool={activeTool as any}
            onToolChange={handleToolChange}
          />
          <button
            onClick={handleExecute}
            disabled={isExecuting || !inputJSON}
            className="execute-button"
            type="button"
            aria-live="polite"
          >
            {isExecuting ? '处理中...' : '执行'}
          </button>
        </section>

        <section className="output-section" aria-labelledby="output-heading">
          <div className="section-header">
            <h2 id="output-heading">输出</h2>
            <div className="action-buttons">
              <CopyButton text={outputResult} aria-label="复制输出结果" />
              <DownloadButton
                content={outputResult}
                filename="output.json"
                aria-label="下载输出结果"
              />
            </div>
          </div>
          <OutputPanel
            value={outputResult}
            error={errorState?.message || null}
            loading={isExecuting}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>基于 React + TypeScript + Vite 构建 · 专业开发工具</p>
      </footer>
    </div>
  );
};

export default App;
