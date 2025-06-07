export const getUniqueId = () => {
  return Number(Date.now() + Math.random().toString().split('.')[1].slice(0, 10))
}
