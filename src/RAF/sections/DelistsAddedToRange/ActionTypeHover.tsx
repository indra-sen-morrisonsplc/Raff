import React from 'react'
import { Tooltip } from '@material-ui/core'
import { actionTypeList, actionTypeListHovers } from './DataConstants'
const {
  delistProductMin,
  productDistributionIncreaseMin,
  productDistributionDecreaseMin,
  productShelfSpaceIncrease,
  productShelfSpaceDecrease,
  newProductMin,
  newOutercaseCode,
  delistOutercaseCode,
  newIngredientMin,
  delistIngredientMin,
  supplyChange,
  placeholderMin,
}: any = actionTypeList
const {
  delistMinHover,
  productDistributionIncreaseMinHover,
  productDistributionDecreaseMinHover,
  productShelfSpaceIncreaseHover,
  productShelfSpaceDecreaseHover,
  newProductMinHover,
  newOutercaseCodeHover,
  delistOutercaseCodeHover,
  newIngredientMinHover,
  delistIngredientMinHover,
  supplyChangeHover,
  placeholderMinHover,
}: any = actionTypeListHovers
const ActionTypeHover = ({ title }: any) => {
  let setHover = ''
  switch (title) {
    case delistProductMin:
      setHover = delistMinHover
      break
    case productDistributionIncreaseMin:
      setHover = productDistributionIncreaseMinHover
      break
    case productDistributionDecreaseMin:
      setHover = productDistributionDecreaseMinHover
      break
    case productShelfSpaceIncrease:
      setHover = productShelfSpaceIncreaseHover
      break
    case productShelfSpaceDecrease:
      setHover = productShelfSpaceDecreaseHover
      break
    case newProductMin:
      setHover = newProductMinHover
      break
    case newOutercaseCode:
      setHover = newOutercaseCodeHover
      break
    case delistOutercaseCode:
      setHover = delistOutercaseCodeHover
      break
    case newIngredientMin:
      setHover = newIngredientMinHover
      break
    case delistIngredientMin:
      setHover = delistIngredientMinHover
      break
    case supplyChange:
      setHover = supplyChangeHover
      break
    case placeholderMin:
      setHover = placeholderMinHover
      break
    default:
      console.log('No hover')
  }
  return (
    <Tooltip
      placement="right"
      title={<span style={{ fontSize: '13px' }}>{setHover}</span>}
      arrow
    >
      <span>{title}</span>
    </Tooltip>
  )
}

export default ActionTypeHover
