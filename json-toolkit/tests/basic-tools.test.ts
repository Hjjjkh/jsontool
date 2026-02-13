import { describe, it, expect } from 'vitest';
import { FormatTool, MinifyTool, ValidateTool, SortKeysTool } from '../src/tools/basicTools';

describe('基础工具测试', () => {
  describe('FormatTool - 格式化工具', () => {
    it('应该正确格式化简单对象', () => {
      const tool = new FormatTool();
      const result = tool.execute({ name: '张三', age: 25 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('  "name": "张三"');
      expect(result.result).toContain('  "age": 25');
    });

    it('应该支持自定义缩进', () => {
      const tool = new FormatTool();
      const result = tool.execute({ a: 1 }, { indent: 4 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('    "a": 1');
    });

    it('应该格式化嵌套对象', () => {
      const tool = new FormatTool();
      const result = tool.execute({ a: { b: { c: 1 } } });
      expect(result.success).toBe(true);
      expect(result.result).toContain('    "c": 1');
    });

    it('应该格式化数组', () => {
      const tool = new FormatTool();
      const result = tool.execute([1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toContain('[');
      expect(result.result).toContain(']');
    });

    it('应该处理 null 值', () => {
      const tool = new FormatTool();
      const result = tool.execute(null);
      expect(result.success).toBe(true);
      expect(result.result).toBe('null');
    });

    it('应该处理空对象', () => {
      const tool = new FormatTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });

    it('应该处理空数组', () => {
      const tool = new FormatTool();
      const result = tool.execute([]);
      expect(result.success).toBe(true);
      expect(result.result).toBe('[]');
    });

    it('应该处理特殊字符', () => {
      const tool = new FormatTool();
      const result = tool.execute({ text: '换行\n制表\t引号"' });
      expect(result.success).toBe(true);
    });

    it('应该处理 Unicode 字符', () => {
      const tool = new FormatTool();
      const result = tool.execute({ emoji: '😊', chinese: '中文' });
      expect(result.success).toBe(true);
    });

    it('应该处理深度嵌套', () => {
      const tool = new FormatTool();
      const deep = { a: { b: { c: { d: { e: 1 } } } } };
      const result = tool.execute(deep);
      expect(result.success).toBe(true);
    });
  });

  describe('MinifyTool - 压缩工具', () => {
    it('应该正确压缩 JSON', () => {
      const tool = new MinifyTool();
      const result = tool.execute({ a: 1, b: 2 });
      expect(result.success).toBe(true);
      expect(result.result).toBe('{"a":1,"b":2}');
    });

    it('应该压缩嵌套对象', () => {
      const tool = new MinifyTool();
      const result = tool.execute({ a: { b: 1 } });
      expect(result.success).toBe(true);
      expect(result.result).toBe('{"a":{"b":1}}');
    });

    it('应该压缩数组', () => {
      const tool = new MinifyTool();
      const result = tool.execute([1, 2, 3]);
      expect(result.success).toBe(true);
      expect(result.result).toBe('[1,2,3]');
    });

    it('应该压缩 null 值', () => {
      const tool = new MinifyTool();
      const result = tool.execute(null);
      expect(result.success).toBe(true);
      expect(result.result).toBe('null');
    });

    it('应该压缩布尔值', () => {
      const tool = new MinifyTool();
      const result = tool.execute(true);
      expect(result.success).toBe(true);
      expect(result.result).toBe('true');
    });

    it('应该压缩字符串', () => {
      const tool = new MinifyTool();
      const result = tool.execute('test');
      expect(result.success).toBe(true);
      expect(result.result).toBe('"test"');
    });
  });

  describe('ValidateTool - 校验工具', () => {
    it('应该验证有效的 JSON 字符串', () => {
      const tool = new ValidateTool();
      const result = tool.execute('{"a":1}');
      expect(result.success).toBe(true);
    });

    it('应该验证有效的 JSON 对象', () => {
      const tool = new ValidateTool();
      const result = tool.execute({ a: 1 });
      expect(result.success).toBe(true);
    });

    it('应该检测无效的 JSON 语法', () => {
      const tool = new ValidateTool();
      const result = tool.execute('{invalid}');
      expect(result.success).toBe(false);
      expect(result.error).toContain('语法错误');
    });

    it('应该检测缺少引号的键', () => {
      const tool = new ValidateTool();
      const result = tool.execute('{a:1}');
      expect(result.success).toBe(false);
    });

    it('应该检测多余的逗号', () => {
      const tool = new ValidateTool();
      const result = tool.execute('{"a":1,}');
      expect(result.success).toBe(false);
    });

    it('应该检测未闭合的括号', () => {
      const tool = new ValidateTool();
      const result = tool.execute('{"a":1');
      expect(result.success).toBe(false);
    });

    it('应该验证空对象', () => {
      const tool = new ValidateTool();
      const result = tool.execute('{}');
      expect(result.success).toBe(true);
    });

    it('应该验证空数组', () => {
      const tool = new ValidateTool();
      const result = tool.execute('[]');
      expect(result.success).toBe(true);
    });

    it('应该验证 null', () => {
      const tool = new ValidateTool();
      const result = tool.execute('null');
      expect(result.success).toBe(true);
    });

    it('应该验证数字', () => {
      const tool = new ValidateTool();
      const result = tool.execute('123');
      expect(result.success).toBe(true);
    });

    it('应该验证字符串', () => {
      const tool = new ValidateTool();
      const result = tool.execute('"test"');
      expect(result.success).toBe(true);
    });
  });

  describe('SortKeysTool - Key 排序工具', () => {
    it('应该按升序排序键', () => {
      const tool = new SortKeysTool();
      const result = tool.execute({ z: 1, a: 2, m: 3 }, { order: 'asc' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      const keys = Object.keys(parsed);
      expect(keys).toEqual(['a', 'm', 'z']);
    });

    it('应该按降序排序键', () => {
      const tool = new SortKeysTool();
      const result = tool.execute({ z: 1, a: 2, m: 3 }, { order: 'desc' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      const keys = Object.keys(parsed);
      expect(keys).toEqual(['z', 'm', 'a']);
    });

    it('应该递归排序嵌套对象的键', () => {
      const tool = new SortKeysTool();
      const result = tool.execute({ b: { d: 2, c: 1 }, a: 3 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(Object.keys(parsed)).toEqual(['a', 'b']);
      expect(Object.keys(parsed.b)).toEqual(['c', 'd']);
    });

    it('应该递归排序数组中的对象', () => {
      const tool = new SortKeysTool();
      const result = tool.execute([{ z: 1, a: 2 }]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(Object.keys(parsed[0])).toEqual(['a', 'z']);
    });

    it('应该处理数字键', () => {
      const tool = new SortKeysTool();
      const result = tool.execute({ 2: 'b', 1: 'a', 10: 'c' });
      expect(result.success).toBe(true);
      const keys = Object.keys(JSON.parse(result.result || '{}'));
      expect(keys).toEqual(['1', '2', '10']);
    });

    it('应该处理特殊字符键', () => {
      const tool = new SortKeysTool();
      const result = tool.execute({ '_a': 1, 'a_': 2 });
      expect(result.success).toBe(true);
    });

    it('应该处理中文键', () => {
      const tool = new SortKeysTool();
      const result = tool.execute({ '中文': 1, 'english': 2 });
      expect(result.success).toBe(true);
    });

    it('应该处理空对象', () => {
      const tool = new SortKeysTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
    });

    it('默认使用升序', () => {
      const tool = new SortKeysTool();
      const result = tool.execute({ z: 1, a: 2 });
      expect(result.success).toBe(true);
      const keys = Object.keys(JSON.parse(result.result || '{}'));
      expect(keys[0]).toBe('a');
    });

    it('应该保持非对象类型不变', () => {
      const tool = new SortKeysTool();
      const result = tool.execute('test');
      expect(result.success).toBe(true);
      expect(result.result).toBe('"test"');
    });
  });
});
