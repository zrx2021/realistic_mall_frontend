# 品牌管理功能说明

## 功能概述

品牌管理功能提供了完整的品牌信息管理能力，包括品牌的增删改查、状态管理、图片上传等功能。

## 数据库字段设计

基于 `goods_brand` 表的字段设计：

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | BIGINT | 是 | 品牌ID（自增主键） |
| name | VARCHAR(100) | 是 | 品牌名称（唯一） |
| english_name | VARCHAR(200) | 否 | 品牌英文名 |
| logo | VARCHAR(255) | 否 | 品牌LOGO URL |
| description | TEXT | 否 | 品牌描述 |
| website | VARCHAR(255) | 否 | 品牌官网 |
| country | VARCHAR(50) | 否 | 品牌国家 |
| sort_order | INT | 否 | 排序权重（默认0，数值越大越靠前） |
| is_active | TINYINT(1) | 否 | 是否启用（1-启用，0-禁用，默认1） |
| created_by | BIGINT | 否 | 创建人ID |
| updated_by | BIGINT | 否 | 更新人ID |
| created_time | DATETIME | 是 | 创建时间 |
| updated_time | DATETIME | 是 | 更新时间 |

### 索引设计

- `uk_brand_name`: 品牌名称唯一索引
- `idx_sort_order`: 排序权重索引
- `idx_is_active`: 启用状态索引
- `idx_created_time`: 创建时间索引

## 功能模块

### 1. 品牌列表页面

**文件**: `/src/views/goods/BrandManagement.vue`

**功能特性**:
- ✅ 品牌列表展示（表格形式）
- ✅ 搜索功能（品牌名称、英文名）
- ✅ 分页功能
- ✅ 排序功能（按排序权重、创建时间）
- ✅ 状态切换（启用/禁用）
- ✅ 编辑、删除操作
- ✅ 导出功能
- ✅ LOGO 图片展示

**表格列设计**:
1. ID
2. 品牌LOGO（图片展示）
3. 品牌名称（中英文）
4. 品牌国家
5. 品牌官网
6. 品牌描述
7. 排序权重
8. 状态（开关）
9. 创建时间
10. 操作（编辑/删除）

### 2. 品牌添加/编辑弹窗

**文件**: `/src/components/goods/BrandAddEditModal.vue`

**表单字段**:

#### 基本信息
- **品牌名称** (必填)
  - 类型: 文本输入
  - 验证: 1-100个字符
  - 提示: 请输入品牌名称

- **品牌英文名** (可选)
  - 类型: 文本输入
  - 验证: 最多200个字符
  - 提示: 请输入品牌英文名称

- **品牌LOGO** (可选)
  - 类型: 图片上传
  - 限制: JPG/PNG格式，不超过2MB
  - 建议: 200x200像素
  - 功能: 支持预览、移除

- **品牌描述** (可选)
  - 类型: 多行文本
  - 验证: 最多500个字符
  - 功能: 字符计数

#### 扩展信息
- **品牌官网** (可选)
  - 类型: URL输入
  - 验证: URL格式验证
  - 示例: https://www.example.com

- **品牌国家** (可选)
  - 类型: 下拉选择
  - 选项: 预设国家列表（支持搜索）
  - 包含: 中国、美国、日本、韩国等25+国家

- **排序权重** (必填)
  - 类型: 数字输入
  - 范围: 0-9999
  - 默认: 0
  - 说明: 数值越大越靠前

- **启用状态** (必填)
  - 类型: 开关
  - 默认: 启用
  - 说明: 禁用后前台不显示

#### 系统信息（编辑时显示）
- 品牌ID（只读）
- 创建时间（只读）
- 更新时间（只读）

### 3. API 接口

**文件**: `/src/api/brand.ts`

**接口列表**:

```typescript
// 获取品牌列表（分页+搜索）
getBrandList(params: BrandQueryParams): Promise<PageResponse<BrandInfo>>

// 获取品牌详情
getBrandDetail(id: number): Promise<BrandInfo>

// 新增品牌
addBrand(data: BrandCreateParams): Promise<BrandInfo>

// 更新品牌
updateBrand(id: number, data: Partial<BrandCreateParams>): Promise<BrandInfo>

// 删除品牌
deleteBrand(id: number): Promise<void>

// 批量删除品牌
batchDeleteBrands(ids: number[]): Promise<void>

// 更新品牌状态
updateBrandStatus(id: number, isActive: boolean): Promise<void>

// 导出品牌数据
exportBrands(params: BrandQueryParams): Promise<Blob>

// 上传品牌LOGO
uploadBrandLogo(file: File): Promise<string>

// 获取所有启用的品牌
getActiveBrands(): Promise<BrandInfo[]>

// 获取品牌统计信息
getBrandStats(): Promise<BrandStats>
```

## 表单验证规则

### 1. 品牌名称
- 必填
- 长度: 1-100个字符
- 触发时机: blur

### 2. 品牌英文名
- 可选
- 长度: 最多200个字符
- 触发时机: blur

### 3. 品牌描述
- 可选
- 长度: 最多500个字符
- 触发时机: blur

### 4. 品牌官网
- 可选
- 格式: URL格式验证
- 长度: 最多255个字符
- 正则: `/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/`
- 触发时机: blur

### 5. 品牌国家
- 可选
- 长度: 最多50个字符
- 触发时机: blur

### 6. 排序权重
- 必填
- 类型: number
- 范围: 0-9999
- 触发时机: blur

### 7. 图片上传
- 格式: image/*
- 大小: 最大2MB
- 验证时机: beforeUpload

## 图片处理逻辑

### 上传流程
1. 用户选择图片文件
2. 前端验证（格式、大小）
3. 调用上传API: `uploadBrandLogo(file)`
4. 后端存储并返回URL
5. 前端保存URL到表单数据

### URL处理规则
```typescript
// 支持多种URL格式的统一处理
1. 绝对URL: http(s)://domain/api/file/image/... → /file/image/...
2. /api/ 前缀: /api/file/image/... → /file/image/...
3. 标准路径: /file/image/goods brand/... → 直接使用
4. 相对路径: goods brand/xxx.png → /file/image/goods brand/xxx.png
5. 纯文件路径: 2025/01/01/xxx.png → /file/image/goods brand/2025/01/01/xxx.png
```

### 图片分类
- 上传分类: `goods brand`
- 存储路径: `/file/image/goods brand/{year}/{month}/{day}/{filename}`

## 国家/地区选项

支持的国家/地区列表：
- 中国
- 美国
- 日本
- 韩国
- 德国
- 法国
- 英国
- 意大利
- 西班牙
- 荷兰
- 瑞士
- 瑞典
- 丹麦
- 芬兰
- 挪威
- 澳大利亚
- 新西兰
- 加拿大
- 巴西
- 印度
- 新加坡
- 马来西亚
- 泰国
- 越南
- 其他

## UI/UX 设计要点

### 1. 响应式设计
- 适配不同屏幕尺寸
- 表格支持横向滚动
- 移动端优化

### 2. 用户体验
- 即时状态切换（启用/禁用）
- 删除确认弹窗
- 操作成功/失败提示
- 加载状态指示
- 表单验证反馈

### 3. 交互细节
- LOGO 图片预览
- 图片悬停显示移除按钮
- 国家选择支持搜索
- 表格支持排序
- 分页器快速跳转

### 4. 样式规范
- 品牌LOGO: 60x60px，圆角4px，边框1px
- 上传预览: 104x104px
- 表格行高: middle
- 按钮尺寸: small（操作列）

## 模拟数据

提供了6个品牌的模拟数据用于开发测试：
1. 苹果 (Apple) - 美国
2. 华为 (HUAWEI) - 中国
3. 小米 (Xiaomi) - 中国
4. Nike - 美国
5. 戴森 (Dyson) - 英国
6. 三只松鼠 (Three Squirrels) - 中国（禁用状态）

## 后端接口要求

### 1. 品牌列表接口
```
POST /api/brands/list?pageNumber=1&pageSize=10
Body: {
  "keyword": "搜索关键词",
  "country": "国家筛选",
  "isActive": true/false
}
```

### 2. 品牌详情接口
```
GET /api/brands/{id}
```

### 3. 新增品牌接口
```
POST /api/brands
Body: BrandCreateParams
```

### 4. 更新品牌接口
```
PUT /api/brands/{id}
Body: Partial<BrandCreateParams>
```

### 5. 删除品牌接口
```
DELETE /api/brands/{id}
```

### 6. 更新状态接口
```
PUT /api/brands/{id}/status
Body: { "isActive": true/false }
```

### 7. 上传图片接口
```
POST /api/file/upload/image
FormData: {
  file: File,
  category: "goods brand"
}
Response: "图片URL路径"
```

## 技术栈

- **框架**: Vue 3 (Composition API)
- **UI组件**: Ant Design Vue
- **类型检查**: TypeScript
- **状态管理**: Reactive API
- **HTTP请求**: Axios (封装在 utils/request.ts)
- **图片组件**: AuthImage (支持认证的图片组件)

## 文件结构

```
src/
├── api/
│   └── brand.ts                    # 品牌API接口
├── components/
│   └── goods/
│       └── BrandAddEditModal.vue   # 品牌添加/编辑弹窗
└── views/
    └── goods/
        └── BrandManagement.vue     # 品牌管理主页面
```

## 待实现功能（TODO）

- [ ] 批量操作（批量删除、批量启用/禁用）
- [ ] 高级搜索（多条件组合）
- [ ] 品牌Logo预加载优化
- [ ] 拖拽排序功能
- [ ] 品牌关联商品数量显示
- [ ] 操作日志记录
- [ ] 数据导入功能

## 使用说明

### 1. 新建品牌
1. 点击"新建品牌"按钮
2. 填写品牌信息（必填项：名称、排序权重）
3. 可选上传品牌LOGO
4. 点击"确定"保存

### 2. 编辑品牌
1. 在列表中点击"编辑"按钮
2. 修改品牌信息
3. 点击"确定"保存

### 3. 删除品牌
1. 点击"删除"按钮
2. 确认删除操作
3. 删除成功后刷新列表

### 4. 状态管理
- 通过状态开关快速启用/禁用品牌
- 禁用的品牌不会在前台展示

### 5. 搜索品牌
- 在搜索框输入品牌名称或英文名
- 支持模糊搜索
- 点击搜索或按回车执行搜索

## 注意事项

1. **品牌名称唯一性**: 品牌名称在数据库中必须唯一
2. **图片上传限制**: LOGO图片不超过2MB，建议200x200px
3. **权限控制**: 需要配合后端权限系统，控制增删改操作
4. **数据关联**: 删除品牌前需确认无关联商品
5. **状态同步**: 禁用品牌时，关联商品的显示需要同步处理

## 更新日志

### 2025-10-16
- ✅ 完成品牌管理页面开发
- ✅ 完成品牌添加/编辑弹窗开发
- ✅ 完成品牌API接口定义
- ✅ 实现图片上传功能
- ✅ 实现状态管理功能
- ✅ 添加表单验证规则
- ✅ 添加模拟数据


