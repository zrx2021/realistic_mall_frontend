import type { ComponentVO } from '@/api/content/page'
import type { Elevator, Goods, Article } from '@/types/content/content'

/**
 * 转换后端组件数据为前端使用的格式
 * @param component 后端返回的组件数据
 * @returns 转换后的前端组件数据
 */
export const transformComponentData = (
  component: ComponentVO,
): string | Elevator | Goods | Article => {
  const { typeId, objData } = component

  // 如果是文本组件
  if (typeId === 1) {
    return objData as string
  }

  // 如果是电梯导航组件
  if (typeId === 2) {
    const data = objData as Record<string, unknown>

    // 构造电梯导航组件数据
    const elevatorData: Elevator = {
      id: component.id,
      templateStyle: (data.type as string) || 'words',
      labels: ((data.labels as Array<Record<string, unknown>>) || []).map((label) => ({
        id: label.id as number,
        name: label.name as string,
        jumpUrl: label.jumpUrl as string,
        imageUrl: label.imageUrl as string,
      })),
      position: (data.position as 'top' | 'left') || 'top',
      colorSetting: [
        {
          name: 'activeColor',
          label: '选中文字颜色',
          value: (data.activeColor as string) || '#1890FF',
        },
        {
          name: 'inactiveColor',
          label: '未选中文字颜色',
          value: (data.inactiveColor as string) || '#595959',
        },
        {
          name: 'activeBgColor',
          label: '选中背景颜色',
          value: (data.activeBgColor as string) || '#E6F7FF',
        },
        {
          name: 'inactiveBgColor',
          label: '未选中背景颜色',
          value: (data.inactiveBgColor as string) || '#FFFFFF',
        },
        {
          name: 'navBgColor',
          label: '导航背景颜色',
          value: (data.navBgColor as string) || '#FFFFFF',
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
    }

    return elevatorData
  }

  // 其他类型组件处理...
  // TODO: 添加其他类型组件的转换逻辑

  return objData as string
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
    id: component.id,
    type: component.templateStyle,
    sortOrder: 1, // 默认排序顺序，可根据实际情况调整
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
      navId: null,
      sortOrder: index + 1,
      name: label.name,
      jumpUrl: label.jumpUrl,
      imageUrl: label.imageUrl,
      deleted: 0,
    })),
  }
}

/**
 * 将前端组件数据转换为后端格式
 * @param componentType 组件类型ID
 * @param componentData 前端组件数据
 * @returns 转换后的后端格式数据
 */
export const transformComponentToBackend = (
  componentType: number,
  componentData: string | Elevator | Goods | Article,
): Record<string, unknown> | string => {
  // 文本组件直接返回字符串
  if (componentType === 1) {
    return componentData as string
  }

  // 电梯导航组件
  if (componentType === 2) {
    return transformElevatorToBackend(componentData as Elevator)
  }

  // 其他类型组件处理...
  // TODO: 添加其他类型组件的转换逻辑

  // 将其他类型组件转换为Record<string, unknown>
  return JSON.parse(JSON.stringify(componentData)) as Record<string, unknown>
}

/**
 * 转换整个组件列表为后端格式
 * @param components 前端组件列表
 * @returns 转换后的后端组件列表
 */
export const transformComponentListToBackend = (
  components: Array<{
    id: number
    type: number
    name: string
    objData: string | Elevator | Goods | Article
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
    objData: transformComponentToBackend(component.type, component.objData),
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
    type: number
    name: string
    objData: string | Elevator | Goods | Article
  }>,
) => {
  return components.map((component, index) => ({
    id: component.id,
    name: component.name,
    typeId: component.type,
    pageOrder: index + 1,
    objData: transformComponentToBackend(component.type, component.objData),
  }))
}
