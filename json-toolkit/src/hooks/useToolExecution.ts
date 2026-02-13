import { useState, useCallback } from 'react';
import type { ToolResult, ErrorInfo } from '../types';
import { toolRegistry } from '../tools/ToolRegistry';
import { parseJSON } from '../utils/jsonHelper';
import { ERROR_MESSAGES } from '../constants';

export const useToolExecution = () => {
  const [inputJSON, setInputJSON] = useState<string>('');
  const [outputResult, setOutputResult] = useState<string>('');
  const [activeTool, setActiveTool] = useState<string>('format');
  const [errorState, setErrorState] = useState<ErrorInfo | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [autoExecute, setAutoExecute] = useState<boolean>(true);

  const executeTool = useCallback(
    async (toolType: string, options?: Record<string, unknown>) => {
      setIsExecuting(true);
      setErrorState(null);
      setOutputResult('');

      try {
        const parsedInput = parseJSON(inputJSON);

        if (parsedInput === null && toolType !== 'validate') {
          setErrorState({
            message: ERROR_MESSAGES.INVALID_JSON,
          });
          setIsExecuting(false);
          return;
        }

        const result = toolRegistry.execute(toolType as any, parsedInput || inputJSON, options);

        if (result.success && result.result) {
          setOutputResult(result.result);
        } else {
          setErrorState({
            message: result.error || ERROR_MESSAGES.EXECUTION_ERROR,
          });
        }
      } catch (error) {
        setErrorState({
          message: error instanceof Error ? error.message : ERROR_MESSAGES.EXECUTION_ERROR,
        });
      } finally {
        setIsExecuting(false);
      }
    },
    [inputJSON]
  );

  const handleInputChange = useCallback((value: string) => {
    setInputJSON(value);
    setErrorState(null);
    if (autoExecute && value && value.trim()) {
      executeTool(activeTool);
    }
  }, [autoExecute, activeTool, executeTool]);

  const clearOutput = useCallback(() => {
    setOutputResult('');
    setErrorState(null);
  }, []);

  return {
    inputJSON,
    setInputJSON: handleInputChange,
    outputResult,
    activeTool,
    setActiveTool,
    errorState,
    isExecuting,
    executeTool,
    clearOutput,
    autoExecute,
    setAutoExecute,
  };
};
