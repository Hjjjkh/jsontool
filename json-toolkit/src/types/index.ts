export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = Array<JSONValue>;

export enum ToolCategory {
  BASIC = 'basic',
  DATA_STRUCTURE = 'data_structure',
  CONVERSION = 'conversion',
  QUERY = 'query',
  SECURITY = 'security',
}

export type ToolType =
  | 'format'
  | 'minify'
  | 'validate'
  | 'sortKeys'
  | 'removeNull'
  | 'removeEmptyString'
  | 'removeUndefined'
  | 'deepArrayDeduplicate'
  | 'flatten'
  | 'unflatten'
  | 'diff'
  | 'merge'
  | 'toTypeScript'
  | 'toJava'
  | 'toGo'
  | 'toPython'
  | 'toSchema'
  | 'jsonPath'
  | 'searchKey'
  | 'searchValue'
  | 'maskFields'
  | 'deleteFields';

export interface ToolResult {
  success: boolean;
  result?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorInfo {
  message: string;
  line?: number;
  column?: number;
  path?: string;
}

export interface JSONTool {
  name: string;
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security';
  type: ToolType;
  execute(input: JSONValue, options?: unknown): ToolResult;
}

export interface ToolConfig {
  type: ToolType;
  options?: Record<string, unknown>;
}

export interface ToolMenuItem {
  label: string;
  type: ToolType;
  category: ToolCategory;
  description: string;
}

export interface SearchMatch {
  path: string;
  value: JSONValue;
  highlightPath: string;
}

export interface DiffItem {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: JSONValue;
  newValue?: JSONValue;
}
