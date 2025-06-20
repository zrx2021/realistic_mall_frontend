export const getUniqueId = () => {
  return Number(Date.now().toString().substring(0, 13) + Math.floor(Math.random() * 1000000))
}
