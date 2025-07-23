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

  // 如果是电梯导航组件
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

  // 其他类型组件处理...
  // TODO: 添加其他类型组件的转换逻辑

  // 对于未知类型，尝试安全地返回数据
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
  // 文本组件
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

  // 电梯导航组件
  if (componentType === 2) {
    return transformElevatorToBackend(componentData as Elevator)
  }

  // 其他类型组件处理...
  // TODO: 添加其他类型组件的转换逻辑

  // 确保返回的是对象格式
  if (typeof componentData === 'string') {
    return {
      content: componentData,
      id,
      componentId,
      deleted: 0,
    }
  }

  // 将其他类型组件转换为Record<string, unknown>
  const result = JSON.parse(JSON.stringify(componentData)) as Record<string, unknown>

  // 确保每个组件都有deleted字段
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
