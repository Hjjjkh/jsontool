import { describe, it, expect } from 'vitest';
import { RemoveUndefinedTool, DeepArrayDeduplicateTool, DiffTool, MergeTool } from '../src/tools/basicAdditionalTools';

describe('基础附加工具测试', () => {
  describe('RemoveUndefinedTool - 去除 undefined 字段', () => {
    it('应该去除顶层 undefined 字段', () => {
      const tool = new RemoveUndefinedTool();
      const result = tool.execute({ a: 1, b: undefined, c: 2 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1, c: 2 });
    });

    it('应该递归去除嵌套对象的 undefined 字段', () => {
      const tool = new RemoveUndefinedTool();
      const result = tool.execute({ a: { b: undefined, c: 1 } });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual({ c: 1 });
    });

    it('应该处理数组中的 undefined', () => {
      const tool = new RemoveUndefinedTool();
      const result = tool.execute([1, undefined, 2]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([1, null, 2]);
    });

    it('应该处理 null 值', () => {
      const tool = new RemoveUndefinedTool();
      const result = tool.execute({ a: null, b: undefined });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBeNull();
      expect('b' in parsed).toBe(false);
    });

    it('应该处理空字符串', () => {
      const tool = new RemoveUndefinedTool();
      const result = tool.execute({ a: '', b: undefined });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe('');
      expect('b' in parsed).toBe(false);
    });

    it('应该处理数字 0', () => {
      const tool = new RemoveUndefinedTool();
      const result = tool.execute({ a: 0, b: undefined });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe(0);
    });

    it('应该处理 false 值', () => {
      const tool = new RemoveUndefinedTool();
      const result = tool.execute({ a: false, b: undefined });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe(false);
    });

    it('应该处理空对象', () => {
      const tool = new RemoveUndefinedTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });
  });

  describe('DeepArrayDeduplicateTool - 数组去重', () => {
    it('应该去重简单数组', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute([1, 2, 2, 3]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([1, 2, 3]);
    });

    it('应该去重字符串数组', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute(['a', 'b', 'a', 'c']);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual(['a', 'b', 'c']);
    });

    it('应该深度去重对象数组', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute([{ a: 1 }, { a: 1 }, { b: 2 }]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([{ a: 1 }, { b: 2 }]);
    });

    it('应该去重嵌套数组', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute([[1, 2], [1, 2], [3, 4]]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([[1, 2], [3, 4]]);
    });

    it('应该处理对象中的数组字段', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute({ arr: [1, 2, 2, 3] });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.arr).toEqual([1, 2, 3]);
    });

    it('应该处理嵌套对象中的数组', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute({ a: { b: [1, 1, 2] } });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a.b).toEqual([1, 2]);
    });

    it('应该处理空数组', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute([]);
      expect(result.success).toBe(true);
      expect(result.result).toBe('[]');
    });

    it('应该处理单个元素数组', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute([1]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([1]);
    });

    it('应该处理 null 值数组', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute([null, null, 1]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([null, 1]);
    });

    it('应该保持顺序', () => {
      const tool = new DeepArrayDeduplicateTool();
      const result = tool.execute([3, 1, 2, 1, 3]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([3, 1, 2]);
    });
  });

  describe('DiffTool - 深度比较', () => {
    it('应该检测相等的对象', () => {
      const tool = new DiffTool();
      const result = tool.execute({ a: 1 }, { compareWith: JSON.stringify({ a: 1 }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('no_changes');
    });

    it('应该检测不同的值', () => {
      const tool = new DiffTool();
      const result = tool.execute({ a: 1 }, { compareWith: JSON.stringify({ a: 2 }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('object_diff');
      expect(parsed.changes[0].type).toBe('changed');
    });

    it('应该检测新增的字段', () => {
      const tool = new DiffTool();
      const result = tool.execute({ a: 1 }, { compareWith: JSON.stringify({ a: 1, b: 2 }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.changes[0].type).toBe('added');
    });

    it('应该检测删除的字段', () => {
      const tool = new DiffTool();
      const result = tool.execute({ a: 1, b: 2 }, { compareWith: JSON.stringify({ a: 1 }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.changes[0].type).toBe('removed');
    });

    it('应该检测嵌套对象的差异', () => {
      const tool = new DiffTool();
      const result = tool.execute(
        { a: { b: 1 } },
        { compareWith: JSON.stringify({ a: { b: 2 } }) }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.changes[0].path).toBe('a');
    });

    it('应该检测数组的差异', () => {
      const tool = new DiffTool();
      const result = tool.execute([1, 2, 3], { compareWith: JSON.stringify([1, 2, 4]) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('array_diff');
    });

    it('应该检测数组长度差异', () => {
      const tool = new DiffTool();
      const result = tool.execute([1, 2], { compareWith: JSON.stringify([1, 2, 3]) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.changes[0].type).toBe('added');
    });

    it('应该检测类型不匹配', () => {
      const tool = new DiffTool();
      const result = tool.execute({ a: 1 }, { compareWith: JSON.stringify({ a: '1' }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.changes[0].type).toBe('type_mismatch');
    });

    it('应该处理空对象', () => {
      const tool = new DiffTool();
      const result = tool.execute({}, { compareWith: JSON.stringify({}) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('no_changes');
    });

    it('应该要求 compareWith 参数', () => {
      const tool = new DiffTool();
      const result = tool.execute({ a: 1 });
      expect(result.success).toBe(false);
      expect(result.error).toContain('compareWith');
    });
  });

  describe('MergeTool - 合并', () => {
    it('应该合并简单对象', () => {
      const tool = new MergeTool();
      const result = tool.execute({ a: 1 }, { mergeWith: JSON.stringify({ b: 2 }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1, b: 2 });
    });

    it('应该覆盖相同键的值', () => {
      const tool = new MergeTool();
      const result = tool.execute({ a: 1 }, { mergeWith: JSON.stringify({ a: 2 }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe(2);
    });

    it('应该深度合并嵌套对象', () => {
      const tool = new MergeTool();
      const result = tool.execute(
        { a: { b: 1, c: 2 } },
        { mergeWith: JSON.stringify({ a: { c: 3, d: 4 } }) }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual({ b: 1, c: 3, d: 4 });
    });

    it('应该替换数组', () => {
      const tool = new MergeTool();
      const result = tool.execute({ a: [1, 2] }, { mergeWith: JSON.stringify({ a: [3, 4] }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual([3, 4]);
    });

    it('应该添加新字段到嵌套对象', () => {
      const tool = new MergeTool();
      const result = tool.execute(
        { a: { b: 1 } },
        { mergeWith: JSON.stringify({ a: { b: { c: 2 } } }) }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a.b).toEqual({ c: 2 });
    });

    it('应该处理 null 值', () => {
      const tool = new MergeTool();
      const result = tool.execute({ a: 1 }, { mergeWith: JSON.stringify({ b: null }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.b).toBeNull();
    });

    it('应该处理空对象', () => {
      const tool = new MergeTool();
      const result = tool.execute({}, { mergeWith: JSON.stringify({ a: 1 }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1 });
    });

    it('应该要求 mergeWith 参数', () => {
      const tool = new MergeTool();
      const result = tool.execute({ a: 1 });
      expect(result.success).toBe(false);
      expect(result.error).toContain('mergeWith');
    });

    it('应该处理非对象目标', () => {
      const tool = new MergeTool();
      const result = tool.execute('string', { mergeWith: JSON.stringify({ a: 1 }) });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1 });
    });
  });
});
