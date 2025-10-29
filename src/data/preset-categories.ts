/**
 * 预设商品分类数据
 * 参考京东等主流电商平台的分类结构
 */

export interface PresetCategory {
  name: string
  sortOrder: number
  icon?: string
  description?: string
  children?: PresetCategory[]
}

/**
 * 京东风格的商品分类数据
 */
export const jdStyleCategories: PresetCategory[] = [
  {
    name: '手机、数码、通信',
    sortOrder: 100,
    description: '手机、智能设备、数码配件',
    children: [
      {
        name: '手机通讯',
        sortOrder: 100,
        children: [
          { name: '手机', sortOrder: 100 },
          { name: '游戏手机', sortOrder: 90 },
          { name: '老人机', sortOrder: 80 },
          { name: '对讲机', sortOrder: 70 },
          { name: '手机维修', sortOrder: 60 },
        ],
      },
      {
        name: '运营商',
        sortOrder: 90,
        children: [
          { name: '合约机', sortOrder: 100 },
          { name: '选号中心', sortOrder: 90 },
          { name: '装宽带', sortOrder: 80 },
          { name: '办套餐', sortOrder: 70 },
        ],
      },
      {
        name: '手机配件',
        sortOrder: 80,
        children: [
          { name: '手机壳', sortOrder: 100 },
          { name: '贴膜', sortOrder: 90 },
          { name: '充电器', sortOrder: 80 },
          { name: '数据线', sortOrder: 70 },
          { name: '手机支架', sortOrder: 60 },
          { name: '自拍杆', sortOrder: 50 },
        ],
      },
      {
        name: '摄影摄像',
        sortOrder: 70,
        children: [
          { name: '数码相机', sortOrder: 100 },
          { name: '单反相机', sortOrder: 90 },
          { name: '微单相机', sortOrder: 80 },
          { name: '运动相机', sortOrder: 70 },
          { name: '摄像机', sortOrder: 60 },
          { name: '镜头', sortOrder: 50 },
          { name: '拍立得', sortOrder: 40 },
        ],
      },
      {
        name: '数码配件',
        sortOrder: 60,
        children: [
          { name: '存储卡', sortOrder: 100 },
          { name: '读卡器', sortOrder: 90 },
          { name: '滤镜', sortOrder: 80 },
          { name: '相机包', sortOrder: 70 },
          { name: '三脚架/云台', sortOrder: 60 },
        ],
      },
      {
        name: '智能设备',
        sortOrder: 50,
        children: [
          { name: '智能手环', sortOrder: 100 },
          { name: '智能手表', sortOrder: 90 },
          { name: '智能眼镜', sortOrder: 80 },
          { name: '智能机器人', sortOrder: 70 },
          { name: '无人机', sortOrder: 60 },
        ],
      },
    ],
  },
  {
    name: '电脑、办公',
    sortOrder: 90,
    description: '电脑整机、电脑配件、办公设备',
    children: [
      {
        name: '电脑整机',
        sortOrder: 100,
        children: [
          { name: '笔记本', sortOrder: 100 },
          { name: '游戏本', sortOrder: 90 },
          { name: '平板电脑', sortOrder: 80 },
          { name: '台式机', sortOrder: 70 },
          { name: '一体机', sortOrder: 60 },
          { name: '服务器', sortOrder: 50 },
        ],
      },
      {
        name: '电脑配件',
        sortOrder: 90,
        children: [
          { name: '显示器', sortOrder: 100 },
          { name: '显卡', sortOrder: 90 },
          { name: 'CPU', sortOrder: 80 },
          { name: '主板', sortOrder: 70 },
          { name: '内存', sortOrder: 60 },
          { name: '硬盘', sortOrder: 50 },
          { name: '固态硬盘', sortOrder: 40 },
          { name: '机箱', sortOrder: 30 },
          { name: '电源', sortOrder: 20 },
          { name: '散热器', sortOrder: 10 },
        ],
      },
      {
        name: '外设产品',
        sortOrder: 80,
        children: [
          { name: '鼠标', sortOrder: 100 },
          { name: '键盘', sortOrder: 90 },
          { name: '键鼠套装', sortOrder: 80 },
          { name: 'U盘', sortOrder: 70 },
          { name: '移动硬盘', sortOrder: 60 },
          { name: '鼠标垫', sortOrder: 50 },
        ],
      },
      {
        name: '办公设备',
        sortOrder: 70,
        children: [
          { name: '打印机', sortOrder: 100 },
          { name: '投影仪', sortOrder: 90 },
          { name: '传真机', sortOrder: 80 },
          { name: '复合机', sortOrder: 70 },
          { name: '碎纸机', sortOrder: 60 },
          { name: '扫描仪', sortOrder: 50 },
        ],
      },
      {
        name: '网络产品',
        sortOrder: 60,
        children: [
          { name: '路由器', sortOrder: 100 },
          { name: '网卡', sortOrder: 90 },
          { name: '交换机', sortOrder: 80 },
          { name: '网络机柜', sortOrder: 70 },
        ],
      },
    ],
  },
  {
    name: '家用电器',
    sortOrder: 80,
    description: '大家电、生活电器、厨房电器',
    children: [
      {
        name: '大家电',
        sortOrder: 100,
        children: [
          { name: '平板电视', sortOrder: 100 },
          { name: '空调', sortOrder: 90 },
          { name: '冰箱', sortOrder: 80 },
          { name: '洗衣机', sortOrder: 70 },
          { name: '热水器', sortOrder: 60 },
          { name: '油烟机', sortOrder: 50 },
          { name: '燃气灶', sortOrder: 40 },
        ],
      },
      {
        name: '生活电器',
        sortOrder: 90,
        children: [
          { name: '电风扇', sortOrder: 100 },
          { name: '扫地机器人', sortOrder: 90 },
          { name: '吸尘器', sortOrder: 80 },
          { name: '挂烫机', sortOrder: 70 },
          { name: '空气净化器', sortOrder: 60 },
          { name: '加湿器', sortOrder: 50 },
          { name: '除湿机', sortOrder: 40 },
        ],
      },
      {
        name: '厨房电器',
        sortOrder: 80,
        children: [
          { name: '电饭煲', sortOrder: 100 },
          { name: '微波炉', sortOrder: 90 },
          { name: '电烤箱', sortOrder: 80 },
          { name: '豆浆机', sortOrder: 70 },
          { name: '榨汁机', sortOrder: 60 },
          { name: '料理机', sortOrder: 50 },
          { name: '电磁炉', sortOrder: 40 },
          { name: '电压力锅', sortOrder: 30 },
          { name: '咖啡机', sortOrder: 20 },
        ],
      },
      {
        name: '个护健康',
        sortOrder: 70,
        children: [
          { name: '剃须刀', sortOrder: 100 },
          { name: '电动牙刷', sortOrder: 90 },
          { name: '吹风机', sortOrder: 80 },
          { name: '按摩器', sortOrder: 70 },
          { name: '足浴盆', sortOrder: 60 },
          { name: '体重秤', sortOrder: 50 },
        ],
      },
    ],
  },
  {
    name: '服饰内衣',
    sortOrder: 70,
    description: '男装、女装、童装、内衣',
    children: [
      {
        name: '女装',
        sortOrder: 100,
        children: [
          { name: '连衣裙', sortOrder: 100 },
          { name: 'T恤', sortOrder: 90 },
          { name: '衬衫', sortOrder: 80 },
          { name: '针织衫', sortOrder: 70 },
          { name: '羽绒服', sortOrder: 60 },
          { name: '棉衣', sortOrder: 50 },
          { name: '毛呢外套', sortOrder: 40 },
        ],
      },
      {
        name: '男装',
        sortOrder: 90,
        children: [
          { name: 'T恤', sortOrder: 100 },
          { name: '衬衫', sortOrder: 90 },
          { name: '夹克', sortOrder: 80 },
          { name: '羽绒服', sortOrder: 70 },
          { name: '卫衣', sortOrder: 60 },
          { name: '牛仔裤', sortOrder: 50 },
          { name: '休闲裤', sortOrder: 40 },
        ],
      },
      {
        name: '内衣',
        sortOrder: 80,
        children: [
          { name: '文胸', sortOrder: 100 },
          { name: '男士内裤', sortOrder: 90 },
          { name: '女士内裤', sortOrder: 80 },
          { name: '家居服', sortOrder: 70 },
          { name: '保暖内衣', sortOrder: 60 },
          { name: '打底裤', sortOrder: 50 },
        ],
      },
      {
        name: '童装',
        sortOrder: 70,
        children: [
          { name: '婴儿装', sortOrder: 100 },
          { name: '儿童套装', sortOrder: 90 },
          { name: '儿童裤子', sortOrder: 80 },
          { name: '亲子装', sortOrder: 70 },
        ],
      },
    ],
  },
  {
    name: '运动户外',
    sortOrder: 60,
    description: '运动鞋服、健身器材、户外装备',
    children: [
      {
        name: '运动鞋包',
        sortOrder: 100,
        children: [
          { name: '跑步鞋', sortOrder: 100 },
          { name: '篮球鞋', sortOrder: 90 },
          { name: '板鞋', sortOrder: 80 },
          { name: '帆布鞋', sortOrder: 70 },
          { name: '运动包', sortOrder: 60 },
        ],
      },
      {
        name: '运动服饰',
        sortOrder: 90,
        children: [
          { name: '运动套装', sortOrder: 100 },
          { name: '运动裤', sortOrder: 90 },
          { name: '运动背心', sortOrder: 80 },
          { name: '紧身衣', sortOrder: 70 },
        ],
      },
      {
        name: '健身训练',
        sortOrder: 80,
        children: [
          { name: '跑步机', sortOrder: 100 },
          { name: '动感单车', sortOrder: 90 },
          { name: '哑铃', sortOrder: 80 },
          { name: '瑜伽垫', sortOrder: 70 },
          { name: '拉力器', sortOrder: 60 },
        ],
      },
      {
        name: '户外装备',
        sortOrder: 70,
        children: [
          { name: '帐篷', sortOrder: 100 },
          { name: '睡袋', sortOrder: 90 },
          { name: '登山包', sortOrder: 80 },
          { name: '冲锋衣', sortOrder: 70 },
          { name: '登山杖', sortOrder: 60 },
        ],
      },
    ],
  },
  {
    name: '食品饮料、酒类',
    sortOrder: 50,
    description: '食品、饮料、酒类、生鲜',
    children: [
      {
        name: '休闲食品',
        sortOrder: 100,
        children: [
          { name: '饼干糕点', sortOrder: 100 },
          { name: '坚果炒货', sortOrder: 90 },
          { name: '肉干肉脯', sortOrder: 80 },
          { name: '糖果巧克力', sortOrder: 70 },
          { name: '膨化食品', sortOrder: 60 },
        ],
      },
      {
        name: '饮料冲调',
        sortOrder: 90,
        children: [
          { name: '牛奶乳品', sortOrder: 100 },
          { name: '咖啡', sortOrder: 90 },
          { name: '茶叶', sortOrder: 80 },
          { name: '冲饮谷物', sortOrder: 70 },
          { name: '蜂蜜', sortOrder: 60 },
        ],
      },
      {
        name: '酒类',
        sortOrder: 80,
        children: [
          { name: '白酒', sortOrder: 100 },
          { name: '葡萄酒', sortOrder: 90 },
          { name: '洋酒', sortOrder: 80 },
          { name: '啤酒', sortOrder: 70 },
          { name: '黄酒', sortOrder: 60 },
        ],
      },
      {
        name: '生鲜',
        sortOrder: 70,
        children: [
          { name: '水果', sortOrder: 100 },
          { name: '蔬菜', sortOrder: 90 },
          { name: '肉禽蛋品', sortOrder: 80 },
          { name: '海鲜水产', sortOrder: 70 },
        ],
      },
    ],
  },
  {
    name: '美妆个护、宠物',
    sortOrder: 40,
    description: '美妆护肤、个人护理、宠物用品',
    children: [
      {
        name: '面部护理',
        sortOrder: 100,
        children: [
          { name: '洁面', sortOrder: 100 },
          { name: '面膜', sortOrder: 90 },
          { name: '乳液面霜', sortOrder: 80 },
          { name: '精华', sortOrder: 70 },
          { name: '眼霜', sortOrder: 60 },
        ],
      },
      {
        name: '彩妆',
        sortOrder: 90,
        children: [
          { name: '口红', sortOrder: 100 },
          { name: '粉底', sortOrder: 90 },
          { name: '眼影', sortOrder: 80 },
          { name: '睫毛膏', sortOrder: 70 },
          { name: '眉笔', sortOrder: 60 },
        ],
      },
      {
        name: '个人护理',
        sortOrder: 80,
        children: [
          { name: '洗发水', sortOrder: 100 },
          { name: '护发素', sortOrder: 90 },
          { name: '沐浴露', sortOrder: 80 },
          { name: '牙膏牙刷', sortOrder: 70 },
          { name: '卫生巾', sortOrder: 60 },
        ],
      },
      {
        name: '宠物生活',
        sortOrder: 70,
        children: [
          { name: '狗粮', sortOrder: 100 },
          { name: '猫粮', sortOrder: 90 },
          { name: '宠物零食', sortOrder: 80 },
          { name: '宠物玩具', sortOrder: 70 },
          { name: '宠物用品', sortOrder: 60 },
        ],
      },
    ],
  },
  {
    name: '母婴、玩具乐器',
    sortOrder: 30,
    description: '奶粉辅食、纸尿裤、童车童床、玩具',
    children: [
      {
        name: '奶粉',
        sortOrder: 100,
        children: [
          { name: '婴儿奶粉', sortOrder: 100 },
          { name: '成人奶粉', sortOrder: 90 },
          { name: '孕妈奶粉', sortOrder: 80 },
        ],
      },
      {
        name: '纸尿裤',
        sortOrder: 90,
        children: [
          { name: '婴儿尿裤', sortOrder: 100 },
          { name: '拉拉裤', sortOrder: 90 },
          { name: '湿巾', sortOrder: 80 },
        ],
      },
      {
        name: '玩具',
        sortOrder: 80,
        children: [
          { name: '毛绒玩具', sortOrder: 100 },
          { name: '积木拼插', sortOrder: 90 },
          { name: '遥控玩具', sortOrder: 80 },
          { name: '模型玩具', sortOrder: 70 },
        ],
      },
      {
        name: '乐器',
        sortOrder: 70,
        children: [
          { name: '钢琴', sortOrder: 100 },
          { name: '吉他', sortOrder: 90 },
          { name: '尤克里里', sortOrder: 80 },
          { name: '电子琴', sortOrder: 70 },
        ],
      },
    ],
  },
  {
    name: '图书、音像、电子书',
    sortOrder: 20,
    description: '图书、音像制品、电子书',
    children: [
      {
        name: '图书',
        sortOrder: 100,
        children: [
          { name: '小说', sortOrder: 100 },
          { name: '文学', sortOrder: 90 },
          { name: '励志', sortOrder: 80 },
          { name: '经管', sortOrder: 70 },
          { name: '科技', sortOrder: 60 },
          { name: '教辅教材', sortOrder: 50 },
        ],
      },
      {
        name: '音像',
        sortOrder: 90,
        children: [
          { name: '音乐', sortOrder: 100 },
          { name: '影视', sortOrder: 90 },
        ],
      },
      {
        name: '电子书',
        sortOrder: 80,
        children: [
          { name: '小说', sortOrder: 100 },
          { name: '励志成功', sortOrder: 90 },
        ],
      },
    ],
  },
  {
    name: '家居、家具、家装、厨具',
    sortOrder: 10,
    description: '家具、家纺、厨具、收纳用品',
    children: [
      {
        name: '家具',
        sortOrder: 100,
        children: [
          { name: '沙发', sortOrder: 100 },
          { name: '茶几', sortOrder: 90 },
          { name: '床', sortOrder: 80 },
          { name: '床垫', sortOrder: 70 },
          { name: '衣柜', sortOrder: 60 },
          { name: '电视柜', sortOrder: 50 },
          { name: '书桌书柜', sortOrder: 40 },
        ],
      },
      {
        name: '家纺',
        sortOrder: 90,
        children: [
          { name: '四件套', sortOrder: 100 },
          { name: '被子', sortOrder: 90 },
          { name: '枕头', sortOrder: 80 },
          { name: '蚊帐', sortOrder: 70 },
          { name: '凉席', sortOrder: 60 },
        ],
      },
      {
        name: '厨具',
        sortOrder: 80,
        children: [
          { name: '锅具', sortOrder: 100 },
          { name: '刀剪菜板', sortOrder: 90 },
          { name: '餐具', sortOrder: 80 },
          { name: '水杯', sortOrder: 70 },
          { name: '保温杯', sortOrder: 60 },
        ],
      },
      {
        name: '收纳用品',
        sortOrder: 70,
        children: [
          { name: '收纳箱', sortOrder: 100 },
          { name: '收纳盒', sortOrder: 90 },
          { name: '衣架', sortOrder: 80 },
          { name: '鞋架', sortOrder: 70 },
        ],
      },
    ],
  },
]

