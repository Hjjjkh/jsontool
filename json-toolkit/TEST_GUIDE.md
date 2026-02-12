# JSON 工具站测试指南

## 测试数据

```json
{
  "name": "测试用户",
  "age": 25,
  "email": "test@example.com",
  "phone": "13812345678",
  "address": {
    "city": "北京",
    "district": "朝阳区",
    "street": "长安街"
  },
  "hobbies": ["编程", "阅读", "编程"],
  "metadata": {
    "id": "1234567890123456",
    "token": "secret_token_abc123",
    "password": "mypassword123",
    "nullField": null,
    "emptyString": ""
  },
  "scores": [90, 85, 95],
  "active": true
}
```

## 工具测试清单

### 1. 格式化 (format)
**输入：** 压缩的 JSON
**预期输出：** 格式化的 JSON，缩进 2 空格
**验证点：**
- JSON 语法正确
- 缩进一致
- 对象和数组格式正确

### 2. 压缩 (minify)
**输入：** 格式化的 JSON
**预期输出：** 无空格的单行 JSON
**验证点：**
- 无换行符
- 无多余空格
- JSON 语法正确

### 3. 校验 (validate)
**输入：** JSON 字符串
**预期输出：** 格式化的 JSON + valid: true
**验证点：**
- 无效 JSON 返回错误信息
- 有效 JSON 返回格式化结果

### 4. 排序 Key (sortKeys)
**输入：** 乱序的 JSON
**预期输出：** 键按字母顺序排列
**验证点：**
- 所有层级递归排序
- 支持升序和降序
- 保持嵌套结构

### 5. 去除 null (removeNull)
**输入：** 包含 null 字段的 JSON
**预期输出：** 移除所有 null 值的字段
**验证点：**
- null 值字段被删除
- 嵌套对象中的 null 也被删除
- 保留其他字段

### 6. 去除空字符串 (removeEmptyString)
**输入：** 包含空字符串字段的 JSON
**预期输出：** 移除所有空字符串的字段
**验证点：**
- 空字符串字段被删除
- 嵌套对象中的空字符串也被删除
- 保留其他字段

### 7. 去除 undefined (removeUndefined)
**输入：** 包含 undefined 值的 JSON
**预期输出：** 移除所有 undefined 值的字段
**验证点：**
- undefined 值字段被删除
- 嵌套对象中的 undefined 也被删除
- 保留其他字段

### 8. 数组去重 (deepArrayDeduplicate)
**输入：** 包含重复项的数组
**预期输出：** 移除重复项
**验证点：**
- 数组中的重复项被移除
- 对象和数组递归去重
- 保持顺序

### 9. 扁平化 (flatten)
**输入：** 嵌套的 JSON 对象
**预期输出：** 扁平的键值对
**验证点：**
- 嵌套路径用点号连接
- 数组用索引表示
- 保留所有数据

**示例：**
输入：`{"a": {"b": {"c": 1}}}`
输出：`{"a.b.c": 1}`

### 10. 反扁平化 (unflatten)
**输入：** 扁平的 JSON
**预期输出：** 还原为嵌套结构
**验证点：**
- 点号分隔的键被正确还原
- 数组索引被正确处理
- 嵌套结构完整

**示例：**
输入：`{"a.b.c": 1}`
输出：`{"a": {"b": {"c": 1}}}`

### 11. 深度比较 (diff)
**输入：** 两个 JSON 对象 + compareWith 参数
**预期输出：** 差异报告
**验证点：**
- 标识添加的字段
- 标识删除的字段
- 标识修改的值
- 递归比较嵌套结构

### 12. 合并 (merge)
**输入：** JSON 对象 + mergeWith 参数
**预期输出：** 深度合并的对象
**验证点：**
- 后面的值覆盖前面的
- 嵌套对象深度合并
- 不修改原对象

### 13. TypeScript Interface (toTypeScript)
**输入：** JSON 对象
**预期输出：** TypeScript 接口定义
**验证点：**
- 类型推断正确
- 嵌套对象正确处理
- 数组类型正确

**示例：**
```typescript
export interface MyType {
  name: string;
  age: number;
  address: {
    city: string;
    district: string;
    street: string;
  };
}
```

### 14. Java Class (toJava)
**输入：** JSON 对象
**预期输出：** Java 类定义
**验证点：**
- 类型映射正确
- 驼峰命名转换
- 数组使用 List 类型

**示例：**
```java
public class MyClass {
  private String name;
  private Integer age;
  private Object address;
}
```

### 15. Go Struct (toGo)
**输入：** JSON 对象
**预期输出：** Go 结构体定义
**验证点：**
- 类型映射正确
- 帕斯卡命名转换
- json 标签正确

**示例：**
```go
type MyStruct struct {
  Name string `json:"name"`
  Age int `json:"age"`
  Address interface{} `json:"address"`
}
```

### 16. Python Dataclass (toPython)
**输入：** JSON 对象
**预期输出：** Python Dataclass 定义
**验证点：**
- 类型映射正确
- 蛇形命名转换
- 导入必要的模块

**示例：**
```python
from dataclasses import dataclass
from typing import Optional, List

@dataclass
class MyData:
    name: str
    age: int
    address: dict
```

### 17. JSON Schema (toSchema)
**输入：** JSON 对象
**预期输出：** JSON Schema 定义
**验证点：**
- 类型推断正确
- 嵌套结构正确
- 对象和数组类型正确

**示例：**
```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "number"}
  }
}
```

### 18. JSON Path 查询 (jsonPath)
**输入：** JSON 对象 + path 参数
**预期输出：** 路径对应的值
**验证点：**
- 支持点号分隔的路径
- 支持数组索引
- 路径不存在返回 null

**示例：**
输入：`{"address": {"city": "北京"}}`, path: `"address.city"`
输出：`"北京"`

### 19. 搜索 Key (searchKey)
**输入：** JSON 对象 + keyword 参数
**预期输出：** 匹配的键和路径列表
**验证点：**
- 不区分大小写搜索
- 返回完整路径
- 包含值信息

### 20. 搜索值 (searchValue)
**输入：** JSON 对象 + keyword 参数
**预期输出：** 匹配的值和路径列表
**验证点：**
- 不区分大小写搜索
- 递归搜索所有值
- 返回完整路径

### 21. 字段脱敏 (maskFields)
**输入：** 包含敏感信息的 JSON
**预期输出：** 脱敏后的 JSON
**验证点：**
- 邮箱脱敏：`te***@example.com`
- 手机号脱敏：`138****5678`
- 身份证脱敏：`1234****5678`
- 密码等敏感字段也被脱敏

### 22. 删除字段 (deleteFields)
**输入：** JSON 对象 + fields 参数
**预期输出：** 删除指定字段后的 JSON
**验证点：**
- 指定字段被删除
- 嵌套对象中的字段也被删除
- 其他字段保留

**示例：**
输入：`{"a": 1, "b": 2}`, fields: `["a"]`
输出：`{"b": 2}`

## 常见问题排查

### 问题 1：输出为空或 undefined
**可能原因：**
- 输入 JSON 格式错误
- 工具参数缺失或错误
- 类型转换失败

**解决方法：**
- 检查输入 JSON 语法
- 查看错误信息
- 使用校验工具先验证 JSON

### 问题 2：输出 JSON 格式错误
**可能原因：**
- 类型断言失败
- 对象访问错误
- 递归逻辑问题

**解决方法：**
- 检查 TypeScript 类型定义
- 确保对象访问前检查类型
- 验证递归终止条件

### 问题 3：嵌套对象处理错误
**可能原因：**
- 未正确处理 null 值
- 数组和对象类型判断错误
- 深度遍历逻辑错误

**解决方法：**
- 使用 isObject() 和 isArray() 辅助函数
- 明确处理 null 值
- 检查递归边界条件

### 问题 4：参数传递错误
**可能原因：**
- options 参数解构错误
- 默认值设置不当
- 参数类型未定义

**解决方法：**
- 明确 options 参数类型
- 提供合理的默认值
- 添加参数验证

## 调试建议

1. **添加日志输出**
```typescript
console.log('Input:', input);
console.log('Options:', options);
console.log('Output:', result);
```

2. **测试边界情况**
- 空对象 `{}`
- 空数组 `[]`
- null 值
- 深度嵌套对象
- 包含特殊字符的字符串

3. **验证类型检查**
- 使用 `typeof` 检查基本类型
- 使用 `Array.isArray()` 检查数组
- 使用 `isObject()` 检查对象

4. **错误处理**
- 所有操作包裹在 try-catch 中
- 返回结构化的错误信息
- 提供有用的错误消息
