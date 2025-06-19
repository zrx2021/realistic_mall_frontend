export const getUniqueId = () => {
  return (Math.random() * 1000000).toString().split('.')[0] + Date.now()
}
