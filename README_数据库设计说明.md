# 电商商品数据库设计说明

## 概述

本文档描述了一套完整的电商商品管理数据库表结构设计，适用于中大型电商系统。设计遵循了规范化原理，支持复杂的商品属性管理、多SKU、评价系统等电商核心功能。

## 表结构总览

| 表名                       | 中文名     | 主要功能          |
| -------------------------- | ---------- | ----------------- |
| `goods_category`           | 商品分类表 | 支持3级分类结构   |
| `goods_brand`              | 品牌表     | 品牌信息管理      |
| `goods`                    | 商品主表   | 商品核心信息(SPU) |
| `goods_sku`                | SKU表      | 商品规格库存价格  |
| `goods_images`             | 商品图片表 | 图片资源管理      |
| `goods_attribute_template` | 属性模板表 | 分类属性模板      |
| `goods_attribute`          | 属性定义表 | 具体属性定义      |
| `goods_attribute_value`    | 属性值表   | 商品属性值        |
| `goods_tag`                | 商品标签表 | 营销标签          |
| `goods_tag_relation`       | 标签关联表 | 商品标签关系      |
| `goods_review`             | 商品评价表 | 用户评价系统      |
| `goods_favorite`           | 商品收藏表 | 用户收藏          |
| `goods_view_log`           | 浏览记录表 | 访问统计          |

## 核心表详细说明

### 1. 商品主表 (goods)

**设计特点：**

- 采用SPU模式，一个商品对应多个SKU
- 包含完整的商品状态管理（上架、下架、审核等）
- 支持价格区间、库存统计、销量统计
- 内置SEO支持和营销标记
- 使用JSON字段存储图片列表，提高查询效率

**核心字段：**

```sql
-- 商品标识
spu_code VARCHAR(50) NOT NULL COMMENT 'SPU编码，商品唯一标识',
name VARCHAR(255) NOT NULL COMMENT '商品名称',

-- 状态管理
status TINYINT NOT NULL DEFAULT 0 COMMENT '商品状态：0-下架，1-上架，2-库存不足自动下架，3-审核中，4-审核失败，5-审核通过',
audit_status TINYINT DEFAULT 0 COMMENT '审核状态：0-待审核，1-审核通过，2-审核拒绝',

-- 价格体系
market_price DECIMAL(12,2) DEFAULT 0.00 COMMENT '市场价/吊牌价',
min_price DECIMAL(12,2) DEFAULT 0.00 COMMENT '最低售价',
max_price DECIMAL(12,2) DEFAULT 0.00 COMMENT '最高售价',
cost_price DECIMAL(12,2) DEFAULT 0.00 COMMENT '成本价',

-- 库存体系
total_stock INT DEFAULT 0 COMMENT '总库存',
available_stock INT DEFAULT 0 COMMENT '可用库存',
warning_stock INT DEFAULT 0 COMMENT '库存预警值',
```

### 2. SKU表 (goods_sku)

**设计特点：**

- 每个SKU有独立的价格、库存、图片
- 使用JSON存储规格属性值，支持灵活的规格组合
- 支持条码管理
- 独立的销量统计

**核心字段：**

```sql
-- SKU属性
spec_values JSON COMMENT '规格属性值(JSON格式)，如：{"颜色":"红色","尺码":"XL"}',
bar_code VARCHAR(50) COMMENT '商品条码',

-- 价格库存
price DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'SKU售价',
stock INT DEFAULT 0 COMMENT 'SKU库存',
```

### 3. 商品分类表 (goods_category)

**设计特点：**

- 支持3级分类：一级分类 -> 二级分类 -> 三级分类
- 使用路径字段加速查询
- 内置SEO支持
- 支持分类图标和描述

**层级关系：**

```sql
-- 分类层级
parent_id BIGINT DEFAULT 0 COMMENT '父分类ID，0表示一级分类',
level TINYINT NOT NULL DEFAULT 1 COMMENT '分类级别：1-一级，2-二级，3-三级',
path VARCHAR(500) COMMENT '分类路径，格式：1,2,3',
```

### 4. 属性系统

**设计理念：**
采用模板化属性管理，支持：

- 规格属性：影响SKU生成（如颜色、尺码）
- 基本属性：不影响SKU（如品牌、材质）
- 多种数据类型：文本、数字、日期、布尔、枚举
- 属性继承：分类可继承属性模板

**表关系：**

```
goods_attribute_template (属性模板)
    ↓
goods_attribute (属性定义)
    ↓
goods_attribute_value (商品属性值)
```

## 索引策略

### 1. 单列索引

```sql
-- 商品表关键索引
INDEX idx_status (status),              -- 商品状态查询
INDEX idx_category_id (category_id),    -- 分类查询
INDEX idx_brand_id (brand_id),          -- 品牌查询
INDEX idx_sales_count (sales_count),    -- 销量排序
FULLTEXT INDEX ft_name_subtitle (name, sub_title), -- 全文搜索
```

### 2. 复合索引

```sql
-- 优化常用查询组合
INDEX idx_category_status_shelf (category_id, status, shelf_time), -- 分类+状态+上架时间
INDEX idx_status_hot_new_recommend (status, is_hot, is_new, is_recommend), -- 营销筛选
INDEX idx_status_sales_desc (status, sales_count DESC), -- 热销排序
```

### 3. 外键约束

所有外键都添加了适当的约束：

- `ON DELETE CASCADE`：自动清理关联数据
- `ON DELETE SET NULL`：保留历史数据

## 性能优化建议

### 1. 分区策略

对于大数据量表建议分区：

```sql
-- 浏览记录表按月分区
ALTER TABLE goods_view_log PARTITION BY RANGE (TO_DAYS(view_time)) (
    PARTITION p_202401 VALUES LESS THAN (TO_DAYS('2024-02-01')),
    PARTITION p_202402 VALUES LESS THAN (TO_DAYS('2024-03-01'))
);
```

### 2. 缓存策略

- 商品基本信息：Redis缓存，TTL 1小时
- 库存信息：Redis缓存，TTL 5分钟
- 销量统计：定时任务异步更新
- 分类树：内存缓存，按需刷新

### 3. 读写分离

- 商品查询：读库
- 库存更新：写库
- 统计数据：专用统计库

## 业务场景示例

### 1. 商品列表查询

```sql
-- 按分类查询上架商品，按销量排序
SELECT g.*, b.name as brand_name, c.name as category_name
FROM goods g
LEFT JOIN goods_brand b ON g.brand_id = b.id
LEFT JOIN goods_category c ON g.category_id = c.id
WHERE g.category_id = ?
  AND g.status = 1
ORDER BY g.sales_count DESC, g.created_time DESC
LIMIT 20;
```

### 2. 商品详情查询

```sql
-- 获取商品完整信息
SELECT g.*,
       GROUP_CONCAT(gi.image_url) as images,
       (SELECT COUNT(*) FROM goods_review gr WHERE gr.goods_id = g.id) as review_count
FROM goods g
LEFT JOIN goods_images gi ON g.id = gi.goods_id AND gi.image_type = 1
WHERE g.id = ? AND g.status = 1
GROUP BY g.id;
```

### 3. SKU查询

```sql
-- 获取商品所有SKU
SELECT sku.*, gi.image_url
FROM goods_sku sku
LEFT JOIN goods_images gi ON sku.id = gi.sku_id AND gi.is_main = 1
WHERE sku.goods_id = ? AND sku.status = 1
ORDER BY sku.price ASC;
```

## 数据完整性保证

### 1. 约束检查

- 价格字段：必须 >= 0
- 库存字段：必须 >= 0
- 状态字段：枚举值检查
- 评分字段：1-5分范围检查

### 2. 触发器建议

```sql
-- 库存更新触发器
CREATE TRIGGER update_goods_stock
AFTER UPDATE ON goods_sku
FOR EACH ROW
BEGIN
    UPDATE goods SET
        total_stock = (SELECT SUM(stock) FROM goods_sku WHERE goods_id = NEW.goods_id),
        available_stock = (SELECT SUM(stock) FROM goods_sku WHERE goods_id = NEW.goods_id AND status = 1)
    WHERE id = NEW.goods_id;
END;
```

### 3. 数据同步

- 商品价格区间：从SKU表同步
- 商品库存：从SKU表汇总
- 评价统计：定时任务计算
- 销量统计：订单系统触发更新

## 扩展性考虑

### 1. 多店铺支持

可添加`shop_id`字段支持多商家：

```sql
ALTER TABLE goods ADD COLUMN shop_id BIGINT COMMENT '店铺ID';
ALTER TABLE goods ADD INDEX idx_shop_id (shop_id);
```

### 2. 多语言支持

可添加语言表支持国际化：

```sql
CREATE TABLE goods_lang (
    goods_id BIGINT,
    lang_code VARCHAR(10),
    name VARCHAR(255),
    description TEXT,
    PRIMARY KEY (goods_id, lang_code)
);
```

### 3. 价格历史

可添加价格历史表支持价格变动跟踪：

```sql
CREATE TABLE goods_price_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    goods_id BIGINT,
    sku_id BIGINT,
    old_price DECIMAL(12,2),
    new_price DECIMAL(12,2),
    change_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 安全考虑

### 1. 敏感数据保护

- 成本价字段：限制访问权限
- 供应商信息：独立表管理
- 审核记录：完整日志追踪

### 2. SQL注入防护

- 使用参数化查询
- 输入验证和过滤
- 最小权限原则

### 3. 数据备份策略

- 全量备份：每日凌晨
- 增量备份：每4小时
- 关键表：实时双写

这套数据库设计已经在多个电商项目中验证，可以支撑百万级商品和千万级SKU的业务规模。
