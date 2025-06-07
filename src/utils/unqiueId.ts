export const getUniqueId = () => {
  return Date.now() + Math.random().toString().split('.')[1].slice(0, 10)
}
