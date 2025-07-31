export const getImageUrl = (
  targetPath: string,
  icon: string,
  isHover: boolean,
  fileType: string,
) => {
  const url = `${baseAssetsPath}${targetPath}${icon}${isHover ? '-hover' : ''}.${fileType}`
  return new URL(url, import.meta.url).href
}

// 商品图片加载函数
export const getGoodsImageUrl = (imageName: string) => {
  try {
    const url = `../assets/content/page/goods/${imageName}`
    return new URL(url, import.meta.url).href
  } catch (error) {
    console.warn(`Failed to load image: ${imageName}`, error)
    return ''
  }
}

const baseAssetsPath = '../assets'
