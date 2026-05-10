export const arrayToString = (arr: string[]) => {
  return arr.toSorted().join("&")
}
export const stringToArray = (str: string) => {
  if(str === "") return []
  return str.split("&")
}