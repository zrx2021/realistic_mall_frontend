import type { Wrapper } from '@/types/content/content'

export interface saveRequestDTO {
  id: number
  name: string
  status: number
  description: string
  backgroundColor: string
  templateId: number
  components: Wrapper[]
}

interface requestWrapper {
  id: number
  typeId: number
  name: string
  objData: requestElevator | string
}

// 弃用
interface requestElevator {
  id: number
  pageId: number
  sortOrder: number
  type: string
  position: string
  fillType: string
  fillShape: string
  borderRadius: number
  borderSize: number
  // 是否开启自定义边距，0:否, 1: 是
  customStyle: number
  marginHorizontal: number
  marginVertical: number
  paddingHorizontal: number
  paddingVertical: number
  activeColor: string
  inactiveColor: string
  activeBgColor: string
  inactiveBgColor: string
  labels: requestElevatorLabel[]
}

// 弃用
interface requestElevatorLabel {
  id: number
  navId: number
  name: string
  sortOrder: number
  jumpUrl: string
  imageUrl: string
}
