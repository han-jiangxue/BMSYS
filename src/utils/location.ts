import { regionData } from "element-china-area-data"

/**
 * @description 获取拼接后的地区
 * @param data 地区联级组件选择返回的数组
 */
export const getLocation = (data: []) => {
  const getLocationLabel = (code: number, data: any) => {
    const item = data.find((item: any) => item.value === code)
    return item ? item.label : ""
  }
  if (data?.length) {
    const [provinceCode, cityCode, districtCode] = data.slice(0, 3)
    const provinceLabel = getLocationLabel(provinceCode, regionData)
    const province = regionData.find((item) => item.value === provinceCode)
    const cityLabel = cityCode ? getLocationLabel(cityCode, province?.children || []) : ""
    const city = province?.children?.find((item) => item.value === cityCode)
    const districtLabel = districtCode ? getLocationLabel(districtCode, city?.children || []) : ""
    const location = [provinceLabel, cityLabel, districtLabel].filter((label) => label).join(" ")
    return location
  }
}

/**
 * @description 处理首次获取的地区数据，将其转换为位置数组
 * @param location 地区eg："河北省 秦皇岛市 北戴河区"
 * @param data 导入的regionData
 */
export const getPositionArray = (location: any, data: any) => {
  const locationArray = location.split(" ")
  const result = []

  let currentData = data
  for (let i = 0; i < locationArray.length; i++) {
    const label = locationArray[i]
    const item = currentData.find((item: any) => item.label === label)

    if (item) {
      result.push(item.value)
      currentData = item.children || []
    } else {
      break
    }
  }

  return result
}
