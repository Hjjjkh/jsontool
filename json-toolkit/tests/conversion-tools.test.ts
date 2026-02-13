import { describe, it, expect } from 'vitest';
import { ToTypeScriptTool, ToJavaTool, ToGoTool } from '../src/tools/conversionTools';

describe('转换工具测试', () => {
  describe('ToTypeScriptTool - 转 TypeScript Interface', () => {
    it('应该生成简单的 interface', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ name: 'test', age: 25 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('export interface');
      expect(result.result).toContain('name: string');
      expect(result.result).toContain('age: number');
    });

    it('应该生成嵌套对象', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ profile: { name: 'test' } });
      expect(result.success).toBe(true);
      expect(result.result).toContain('profile:');
      expect(result.result).toContain('name: string');
    });

    it('应该生成数组类型', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ items: [1, 2, 3] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('items: number[]');
    });

    it('应该生成空数组类型', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ items: [] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('items: unknown[]');
    });

    it('应该生成混合类型数组', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ items: [1, 'a', true] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('items: unknown[]');
    });

    it('应该生成嵌套数组', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ matrix: [[1, 2], [3, 4]] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('matrix: number[][]');
    });

    it('应该生成 null 类型', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ value: null });
      expect(result.success).toBe(true);
      expect(result.result).toContain('value: null');
    });

    it('应该生成布尔类型', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ active: true });
      expect(result.success).toBe(true);
      expect(result.result).toContain('active: boolean');
    });

    it('应该生成整数类型', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ count: 100 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('count: number');
    });

    it('应该生成浮点数类型', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ price: 99.99 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('price: number');
    });

    it('应该支持自定义 interface 名称', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({ name: 'test' }, { interfaceName: 'User' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('export interface User');
    });

    it('应该处理空对象', () => {
      const tool = new ToTypeScriptTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toContain('export interface');
    });
  });

  describe('ToJavaTool - 转 Java Class', () => {
    it('应该生成简单的 class', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ name: 'test', age: 25 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('public class');
      expect(result.result).toContain('private String name');
      expect(result.result).toContain('private Integer age');
    });

    it('应该将字段名转换为下划线命名', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ userName: 'test' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('user_name');
    });

    it('应该生成数组类型', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ items: [1, 2, 3] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('private List<Integer> items');
    });

    it('应该生成空数组类型', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ items: [] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('private List<Object> items');
    });

    it('应该生成布尔类型', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ active: true });
      expect(result.success).toBe(true);
      expect(result.result).toContain('private Boolean active');
    });

    it('应该生成双精度浮点类型', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ price: 99.99 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('private Double price');
    });

    it('应该为嵌套对象生成 Object 类型', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ profile: { name: 'test' } });
      expect(result.success).toBe(true);
      expect(result.result).toContain('private Object profile');
    });

    it('应该为 null 生成 Object 类型', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ value: null });
      expect(result.success).toBe(true);
      expect(result.result).toContain('private Object value');
    });

    it('应该支持自定义 class 名称', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({ name: 'test' }, { className: 'User' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('public class User');
    });

    it('应该处理空对象', () => {
      const tool = new ToJavaTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toContain('public class');
    });
  });

  describe('ToGoTool - 转 Go Struct', () => {
    it('应该生成简单的 struct', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ name: 'test', age: 25 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('type');
      expect(result.result).toContain('struct');
      expect(result.result).toContain('Name string');
      expect(result.result).toContain('Age int');
    });

    it('应该将字段名转换为 PascalCase', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ user_name: 'test' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('UserName string');
    });

    it('应该生成 json 标签', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ name: 'test' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('`json:"name"`');
    });

    it('应该生成数组类型', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ items: [1, 2, 3] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('Items []int');
    });

    it('应该生成空数组类型', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ items: [] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('Items []any');
    });

    it('应该生成布尔类型', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ active: true });
      expect(result.success).toBe(true);
      expect(result.result).toContain('Active bool');
    });

    it('应该生成浮点数类型', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ price: 99.99 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('Price float64');
    });

    it('应该为嵌套对象生成 any 类型', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ profile: { name: 'test' } });
      expect(result.success).toBe(true);
      expect(result.result).toContain('Profile any');
    });

    it('应该为 null 生成 any 类型', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ value: null });
      expect(result.success).toBe(true);
      expect(result.result).toContain('Value any');
    });

    it('应该支持自定义 struct 名称', () => {
      const tool = new ToGoTool();
      const result = tool.execute({ name: 'test' }, { structName: 'User' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('type User struct');
    });

    it('应该处理空对象', () => {
      const tool = new ToGoTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toContain('type');
      expect(result.result).toContain('struct');
    });
  });
});
