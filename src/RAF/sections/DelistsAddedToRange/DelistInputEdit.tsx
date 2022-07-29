import React from 'react'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { tableBodyStyle, tableHeaderStyle, useStyles } from './Styles'

const DelistInputEdit = ({
  rowData,
  setImportedData,
  onChangeProductTableFields,
  field,
}: any) => {
  const classes = useStyles()
  return (
    <OutlinedInput
      value={rowData && rowData[field]}
      onChange={(e: any) => {
        setImportedData((prevState: any) => {
          return onChangeProductTableFields(
            prevState,
            field,
            rowData,
            e.target.value
          )
        })
      }}
      className={`${classes.tableTextField} ${classes.tableTextFieldEdited}`}
    />
  )
}

export default DelistInputEdit
