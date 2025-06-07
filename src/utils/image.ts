export const getImageUrl = (
  targetPath: string,
  icon: string,
  isHover: boolean,
  fileType: string,
) => {
  const url = `${baseAssetsPath}${targetPath}${icon}${isHover ? '-hover' : ''}.${fileType}`
  return new URL(url, import.meta.url).href
}

const baseAssetsPath = '../assets'
