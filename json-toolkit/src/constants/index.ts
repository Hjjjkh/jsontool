import type { ToolMenuItem } from '../types';
import { ToolCategory } from '../types';

export const TOOL_MENU_ITEMS: ToolMenuItem[] = [
  {
    label: '格式化',
    type: 'format',
    category: ToolCategory.BASIC,
    description: '格式化 JSON，支持自定义缩进',
  },
  {
    label: '压缩',
    type: 'minify',
    category: ToolCategory.BASIC,
    description: '压缩 JSON，去除所有空格',
  },
  {
    label: '校验',
    type: 'validate',
    category: ToolCategory.BASIC,
    description: '验证 JSON 语法，返回错误位置',
  },
  {
    label: '排序 Key',
    type: 'sortKeys',
    category: ToolCategory.BASIC,
    description: '递归排序 JSON 对象的键',
  },
  {
    label: '去除 null',
    type: 'removeNull',
    category: ToolCategory.BASIC,
    description: '移除所有值为 null 的字段',
  },
  {
    label: '去除空字符串',
    type: 'removeEmptyString',
    category: ToolCategory.BASIC,
    description: '移除所有空字符串字段',
  },
  {
    label: '去除 undefined',
    type: 'removeUndefined',
    category: ToolCategory.BASIC,
    description: '移除所有 undefined 值',
  },
  {
    label: '数组去重',
    type: 'deepArrayDeduplicate',
    category: ToolCategory.BASIC,
    description: '深度去重数组中的重复元素',
  },
  {
    label: '扁平化',
    type: 'flatten',
    category: ToolCategory.DATA_STRUCTURE,
    description: '将嵌套 JSON 转换为扁平结构',
  },
  {
    label: '反扁平化',
    type: 'unflatten',
    category: ToolCategory.DATA_STRUCTURE,
    description: '将扁平结构还原为嵌套 JSON',
  },
  {
    label: '深度比较',
    type: 'diff',
    category: ToolCategory.DATA_STRUCTURE,
    description: '比较两个 JSON 对象的差异',
  },
  {
    label: '合并',
    type: 'merge',
    category: ToolCategory.DATA_STRUCTURE,
    description: '深度合并多个 JSON 对象',
  },
  {
    label: 'TypeScript',
    type: 'toTypeScript',
    category: ToolCategory.CONVERSION,
    description: '将 JSON 转换为 TypeScript Interface',
  },
  {
    label: 'Java Class',
    type: 'toJava',
    category: ToolCategory.CONVERSION,
    description: '将 JSON 转换为 Java Class',
  },
  {
    label: 'Go Struct',
    type: 'toGo',
    category: ToolCategory.CONVERSION,
    description: '将 JSON 转换为 Go Struct',
  },
  {
    label: 'Python Dataclass',
    type: 'toPython',
    category: ToolCategory.CONVERSION,
    description: '将 JSON 转换为 Python Dataclass',
  },
  {
    label: 'JSON Schema',
    type: 'toSchema',
    category: ToolCategory.CONVERSION,
    description: '将 JSON 转换为 JSON Schema',
  },
  {
    label: 'JSON Path',
    type: 'jsonPath',
    category: ToolCategory.QUERY,
    description: '使用 JSONPath 查询数据',
  },
  {
    label: '搜索 Key',
    type: 'searchKey',
    category: ToolCategory.QUERY,
    description: '根据 key 搜索并高亮路径',
  },
  {
    label: '搜索值',
    type: 'searchValue',
    category: ToolCategory.QUERY,
    description: '根据值搜索匹配项',
  },
  {
    label: '字段脱敏',
    type: 'maskFields',
    category: ToolCategory.SECURITY,
    description: '对手机号、邮箱、身份证等进行脱敏',
  },
  {
    label: '删除字段',
    type: 'deleteFields',
    category: ToolCategory.SECURITY,
    description: '删除指定的字段',
  },
];

export const TOOL_CATEGORIES = [
  { id: ToolCategory.BASIC, label: '基础处理' },
  { id: ToolCategory.DATA_STRUCTURE, label: '数据结构' },
  { id: ToolCategory.CONVERSION, label: '转换' },
  { id: ToolCategory.QUERY, label: '查询' },
  { id: ToolCategory.SECURITY, label: '安全处理' },
];

export const DEFAULT_INDENT = 2;

export const ERROR_MESSAGES = {
  INVALID_JSON: '无效的 JSON 格式',
  TOOL_NOT_FOUND: '工具未找到',
  EXECUTION_ERROR: '工具执行失败',
} as const;
