export const exportExcel = (dataValues, headerValues, fileName) => {
  let headers = headerValues.map((col) => col.header)
  console.log('header', headers)
  import('xlsx').then((XLSX) => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet([])
    XLSX.utils.sheet_add_aoa(ws, [headers])

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, dataValues, {
      origin: 'A2',
      skipHeader: true,
    })

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    XLSX.writeFile(wb, `${fileName}.xlsx`)
  })
}
