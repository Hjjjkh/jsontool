import type { JSONValue, ToolResult } from '../types';

export const parseJSON = (input: string): JSONValue | null => {
  try {
    return JSON.parse(input);
  } catch (error) {
    return null;
  }
};

export const stringifyJSON = (value: JSONValue, indent: number = 2): string => {
  return JSON.stringify(value, null, indent);
};

export const stringifyMinified = (value: JSONValue): string => {
  return JSON.stringify(value);
};

export const isErrorResult = (result: ToolResult): boolean => {
  return !result.success;
};

export const createErrorResult = (error: string): ToolResult => ({
  success: false,
  error,
});

export const createSuccessResult = (result: string, metadata?: Record<string, unknown>): ToolResult => ({
  success: true,
  result,
  metadata,
});
