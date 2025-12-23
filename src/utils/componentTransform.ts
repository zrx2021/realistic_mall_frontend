import type { ComponentVO } from '@/api/content/page'
import type { Elevator, Goods, Article, TextComponent } from '@/types/content/content'

/**
 * 转换后端组件数据为前端使用的格式
 * @param component 后端返回的组件数据
 * @returns 转换后的前端组件数据
 */
export const transformComponentData = (
  component: ComponentVO,
): TextComponent | Elevator | Goods | Article => {
  const { typeId, objData } = component

  // 如果是文本组件
  if (typeId === 1) {
    const data = objData as Record<string, unknown>
    // 返回包含id和componentId的TextComponent对象
    return {
      titleContent: data.titleContent as string,
      componentId: data.componentId as number,
      id: data.id as number, // 添加id属性以保持id的一致性
    } as TextComponent
  }

  // 如果是电梯导航组件 (type 2)
  if (typeId === 2) {
    const data = objData as Record<string, unknown>

    // 获取colorSetting数组
    const colorSettingArray =
      (data.colorSetting as Array<{ name: string; label: string; value: string }>) || []

    // 通过查找数组中的name来获取对应颜色值
    const getColorValue = (name: string, defaultValue: string): string => {
      const colorItem = colorSettingArray.find((item) => item.name === name)
      return colorItem?.value || defaultValue
    }

    // 构造电梯导航组件数据
    const elevatorData: Elevator = {
      id: data.id as number, // 组件页面关联关系表的主键id
      componentId: data.componentId as number, // 组件在自己表中的ID
      templateStyle: (data.templateStyle as string) || 'words',
      labels: ((data.labels as Array<Record<string, unknown>>) || []).map((label) => ({
        id: label.id as number,
        componentId: label.componentId as number, // 标签自己的组件ID
        name: label.name as string,
        jumpUrl: label.jumpUrl as string,
        imageUrl: label.imageUrl as string,
      })),
      position: (data.position as 'top' | 'left') || 'top',
      colorSetting: [
        {
          name: 'activeColor',
          label: '选中文字颜色',
          value: getColorValue('activeColor', '#1890FF'),
        },
        {
          name: 'inactiveColor',
          label: '未选中文字颜色',
          value: getColorValue('inactiveColor', '#595959'),
        },
        {
          name: 'activeBgColor',
          label: '选中背景颜色',
          value: getColorValue('activeBgColor', '#E6F7FF'),
        },
        {
          name: 'inactiveBgColor',
          label: '未选中背景颜色',
          value: getColorValue('inactiveBgColor', '#FFFFFF'),
        },
        {
          name: 'navBgColor',
          label: '导航背景颜色',
          value: getColorValue('navBgColor', '#FFFFFF'),
        },
      ],
      fillType: (data.fillType as string) || 'underline',
      fillShape: (data.fillShape as string) || 'none',
      borderRadius: Number(data.borderRadius) || 8,
      borderSize: Number(data.borderSize) || 1,
      customStyle: Number(data.customStyle) || 0,
      paddingVertical: Number(data.paddingVertical) || 8,
      paddingHorizontal: Number(data.paddingHorizontal) || 16,
      marginVertical: Number(data.marginVertical) || 0,
      marginHorizontal: Number(data.marginHorizontal) || 8,
      deleted: Number(data.deleted) || 0,
    }

    return elevatorData
  }

  // 如果是商品组件 (type 4)
  if (typeId === 4) {
    const data = objData as Record<string, unknown>
    // 注意：后端返回的 goodsList 可能是 ID 数组，需要前端根据 ID 拉取完整商品信息
    // 这里先返回基础结构，实际商品数据需要在页面加载时通过 ID 获取
    const goodsListData = data.goodsList
    // 如果 goodsList 是 ID 数组，先转换为空数组，后续需要根据 ID 拉取完整商品信息
    const goodsList =
      Array.isArray(goodsListData) &&
      goodsListData.length > 0 &&
      typeof goodsListData[0] === 'number'
        ? [] // ID 数组，需要后续根据 ID 拉取完整商品信息
        : (goodsListData as Goods['goodsList']) || []

    return {
      id: data.id as number,
      componentId: data.componentId as number,
      goodsId: data.goodsId as number,
      templateStyle: (data.templateStyle as string) || 'oneMainTwoSub',
      goodsList, // 如果是 ID 数组则先为空，后续需要根据 ID 拉取完整商品信息
      groupData: (data.groupData as Goods['groupData']) || [],
      displayStyle: (data.displayStyle as string) || 'noBorderWhite',
      showPrice: (data.showPrice as boolean) ?? true,
      showCart: (data.showCart as boolean) ?? true,
      showRating: (data.showRating as boolean) ?? true,
      showSales: (data.showSales as boolean) ?? true,
      showTags: (data.showTags as boolean) ?? true,
      enableSeckill: (data.enableSeckill as boolean) ?? false,
      enableGroup: (data.enableGroup as boolean) ?? false,
    } as Goods
  }

  // 其他类型组件（type 5-19）：图片、富文本、搜索、辅助分割、视频、公告、
  // 优惠券、限时折扣、秒杀、拼团、满减、积分、轮播图、分类导航、会员卡
  // 使用通用转换逻辑
  if (
    typeId === 5 || // 图片
    typeId === 6 || // 富文本
    typeId === 7 || // 搜索
    typeId === 8 || // 辅助分割
    typeId === 9 || // 视频
    typeId === 10 || // 公告
    typeId === 11 || // 优惠券
    typeId === 12 || // 限时折扣
    typeId === 13 || // 秒杀
    typeId === 14 || // 拼团
    typeId === 15 || // 满减
    typeId === 16 || // 积分
    typeId === 17 || // 轮播图
    typeId === 18 || // 分类导航
    typeId === 19 // 会员卡
  ) {
    // 对于这些类型，直接返回后端数据（转换为前端格式）
    if (typeof objData === 'string') {
      return { titleContent: objData } as TextComponent
    }
    return objData as unknown as Article
  }

  // 未知类型的安全处理
  if (typeof objData === 'string') {
    return { titleContent: objData } as TextComponent
  }

  // 对于对象类型，直接返回
  return objData as unknown as Article
}

/**
 * 将文本组件数据转换为后端格式
 * @param text 前端文本组件数据
 * @param id 组件页面关联关系表的主键ID
 * @param componentId 组件在自己表中的ID
 * @returns 转换后的后端格式数据
 * @deprecated 已被直接实现在transformComponentToBackend中
 */
export const transformTextToBackend = (
  text: string,
  id?: number,
  componentId?: number,
): Record<string, unknown> => {
  return {
    id,
    componentId,
    titleContent: text, // 使用后端期望的属性名
  }
}

/**
 * 将前端组件数据转换为后端格式
 * @param componentType 组件类型ID
 * @param componentData 前端组件数据
 * @param id 组件页面关联关系表的主键ID
 * @param componentId 组件在自己表中的ID
 * @returns 转换后的后端格式数据
 */
export const transformComponentToBackend = (
  componentType: number,
  componentData: string | Elevator | Goods | Article | TextComponent,
  id?: number,
  componentId?: number,
): Record<string, unknown> => {
  // 文本组件 (type 1)
  if (componentType === 1) {
    // 检查componentData是否为字符串，如果是字符串则使用旧的方式处理
    if (typeof componentData === 'string') {
      return {
        id: id, // 组件页面关联关系表的主键id
        componentId, // 组件在自己表中的ID
        titleContent: componentData,
        deleted: 0, // 默认未删除
        pageOrder: null,
      }
    } else {
      // 如果是TextComponent对象，使用其中的数据
      const textData = componentData as TextComponent
      return {
        id: id, // 组件页面关联关系表的主键id
        componentId: textData.componentId || componentId, // 优先使用对象中的componentId
        titleContent: textData.titleContent,
        deleted: 0, // 默认未删除
        pageOrder: null,
      }
    }
  }

  // 电梯导航组件 (type 2)
  if (componentType === 2) {
    return transformElevatorToBackend(componentData as Elevator)
  }

  // 商品组件 (type 4) - 仅保存商品ID数组
  if (componentType === 4) {
    return transformGoodsToBackend(componentData as Goods, id, componentId)
  }

  // 基础组件：图片 (type 5)、富文本 (type 6)、搜索 (type 7)、辅助分割 (type 8)、视频 (type 9)、公告 (type 10)
  // 营销组件：优惠券 (type 11)、限时折扣 (type 12)、秒杀 (type 13)、拼团 (type 14)、满减 (type 15)、积分 (type 16)
  // 高级组件：轮播图 (type 17)、分类导航 (type 18)、会员卡 (type 19)
  // 这些类型使用通用转换逻辑
  if (
    componentType === 5 || // 图片
    componentType === 6 || // 富文本
    componentType === 7 || // 搜索
    componentType === 8 || // 辅助分割
    componentType === 9 || // 视频
    componentType === 10 || // 公告
    componentType === 11 || // 优惠券
    componentType === 12 || // 限时折扣
    componentType === 13 || // 秒杀
    componentType === 14 || // 拼团
    componentType === 15 || // 满减
    componentType === 16 || // 积分
    componentType === 17 || // 轮播图
    componentType === 18 || // 分类导航
    componentType === 19 // 会员卡
  ) {
    return transformGenericComponentToBackend(componentData, id, componentId)
  }

  // 未知类型使用通用转换逻辑
  return transformGenericComponentToBackend(componentData, id, componentId)
}

/**
 * 通用组件转换函数，用于处理未特殊处理的组件类型
 * @param componentData 前端组件数据
 * @param id 组件页面关联关系表的主键ID
 * @param componentId 组件在自己表中的ID
 * @returns 转换后的后端格式数据
 */
const transformGenericComponentToBackend = (
  componentData: string | Elevator | Goods | Article | TextComponent,
  id?: number,
  componentId?: number,
): Record<string, unknown> => {
  // 如果是字符串类型，转换为对象格式
  if (typeof componentData === 'string') {
    return {
      content: componentData,
      id,
      componentId,
      deleted: 0,
    }
  }

  // 将组件数据转换为Record<string, unknown>
  const result = JSON.parse(JSON.stringify(componentData)) as Record<string, unknown>

  // 确保每个组件都有基础字段
  if (result.id === undefined && id !== undefined) {
    result.id = id
  }
  if (result.componentId === undefined && componentId !== undefined) {
    result.componentId = componentId
  }
  if (result.deleted === undefined) {
    result.deleted = 0
  }

  return result
}

/**
 * 将前端电梯导航组件数据转换为后端格式
 * @param component 前端电梯导航组件数据
 * @returns 转换后的后端格式数据
 */
export const transformElevatorToBackend = (component: Elevator): Record<string, unknown> => {
  const activeColor =
    component.colorSetting.find((item) => item.name === 'activeColor')?.value || '#1890FF'
  const inactiveColor =
    component.colorSetting.find((item) => item.name === 'inactiveColor')?.value || '#595959'
  const activeBgColor =
    component.colorSetting.find((item) => item.name === 'activeBgColor')?.value || '#E6F7FF'
  const inactiveBgColor =
    component.colorSetting.find((item) => item.name === 'inactiveBgColor')?.value || '#FFFFFF'
  const navBgColor =
    component.colorSetting.find((item) => item.name === 'navBgColor')?.value || '#FFFFFF'

  return {
    id: component.id, // 组件页面关联关系表的主键ID
    componentId: component.componentId, // 组件在自己表中的ID
    templateStyle: component.templateStyle,
    position: component.position,
    fillType: component.fillType,
    fillShape: component.fillShape,
    borderRadius: component.borderRadius,
    borderSize: component.borderSize,
    customStyle: component.customStyle,
    marginHorizontal: component.marginHorizontal,
    marginVertical: component.marginVertical,
    paddingHorizontal: component.paddingHorizontal,
    paddingVertical: component.paddingVertical,
    activeColor,
    inactiveColor,
    activeBgColor,
    inactiveBgColor,
    navBgColor,
    deleted: 0,
    labels: component.labels.map((label, index) => ({
      id: label.id,
      navId: component.id, // 父组件ID
      componentId: label.componentId || -1, // 新标签使用-1
      sortOrder: index + 1,
      name: label.name,
      jumpUrl: label.jumpUrl,
      imageUrl: label.imageUrl,
      deleted: label.deleted || 0, // 使用标签自己的删除状态
    })),
  }
}

/**
 * 将前端商品组件数据转换为后端格式（仅保留商品ID数组）
 */
export const transformGoodsToBackend = (
  component: Goods,
  id?: number,
  componentId?: number,
): Record<string, unknown> => {
  const goodsIds = (component.goodsList || []).map((item) => item.id)

  return {
    id: component.id ?? id,
    componentId: component.componentId ?? componentId,
    goodsId: component.goodsId,
    templateStyle: component.templateStyle,
    goodsList: goodsIds, // 仅传递商品ID数组
    groupData: component.groupData || [],
    displayStyle: component.displayStyle,
    showPrice: component.showPrice,
    showCart: component.showCart,
    showRating: component.showRating,
    showSales: component.showSales,
    showTags: component.showTags,
    enableSeckill: component.enableSeckill,
    enableGroup: component.enableGroup,
    deleted: 0,
  }
}

/**
 * 转换整个组件列表为后端格式
 * @param components 前端组件列表
 * @returns 转换后的后端组件列表
 */
export const transformComponentListToBackend = (
  components: Array<{
    id: number
    componentId?: number
    type: number
    name: string
    objData: string | Elevator | Goods | Article | TextComponent
  }>,
): Array<{
  id: number
  name: string | null
  typeId: number
  pageOrder: number
  objData: Record<string, unknown> | string
}> => {
  return components.map((component, index) => ({
    id: component.id,
    name: component.name,
    typeId: component.type,
    pageOrder: index + 1,
    objData: transformComponentToBackend(
      component.type,
      component.objData,
      component.id,
      component.componentId,
    ),
  }))
}

/**
 * 转换整个组件列表为后端格式用于保存
 * @param components 前端组件列表
 * @returns 转换后的后端格式数据
 */
export const transformComponentsForSave = (
  components: Array<{
    id: number
    componentId?: number
    type: number
    name: string
    objData: string | Elevator | Goods | Article | TextComponent
  }>,
) => {
  return components.map((component, index) => ({
    id: component.id,
    name: component.name,
    typeId: component.type,
    pageOrder: index + 1,
    objData: transformComponentToBackend(
      component.type,
      component.objData,
      component.id,
      component.componentId,
    ),
  }))
}
