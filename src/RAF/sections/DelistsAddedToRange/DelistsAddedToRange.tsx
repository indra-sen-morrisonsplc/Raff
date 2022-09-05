import {
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  OutlinedInput,
  Radio,
  RadioGroup,
  Typography,
  InputAdornment,
  Button,
  Dialog,
  Box,
  useTheme,
  useMediaQuery,
  styled,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormHelperText,
  withStyles,
  MenuProps as MenuPropsType,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { teal } from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'
import { FolderOpenRounded, SearchOutlined } from '@material-ui/icons'
import ErrorOutlineTwoToneIcon from '@material-ui/icons/ErrorOutlineTwoTone'
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded'
import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined'
import LightTooltip from '../../../RangeChangeManagement/components/LightToolTip/LightTooltip'

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
// import { RiFileExcel2Fill } from 'react-icons/ri'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone'
import ErrorSharpIcon from '@material-ui/icons/ErrorSharp'
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded'
import ErrorIcon from '@material-ui/icons/Error'
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DatePicker from '@mui/lab/DatePicker';
import DateFnsUtils from '@date-io/date-fns'
import React, { useState, useEffect, useRef } from 'react'
import { tableBodyStyle, tableHeaderStyle, useStyles } from './Styles'
import {
  actionTypes,
  delistAddedToRangeCols,
  delistExistingProductsCols,
  massActions,
  productListCols,
  planogramViewCols,
  salesChannels,
  delistToRangeData,
  placeholderCols,
  lineStatusOptions,
  yesOrNo,
  supplierCodeOptions,
  replacementAssociationCols,
  supplierSearchSiteCode_Site,
  supplierCode_Supplier,
  ingredientList,
  ingredientTableCols,
  rangedStoresTableCols,
  rangedStoresTableData,
  clearancePricingOptions,
  depotStockTableData,
  depotStockUnitTableCols,
  depotStockButtons,
  recipeTableCols,
  pinTableCols,
  pinTableDummyData,
  depotViewResDummy,
  storeViewDummyRes,
  regionsButtonsDummy,
  actionTypeList,
  actionTypeListHovers,
  actionTypeListErrorMessage,
  ct36TableCols,
  clearDepotByOptions,
  bulkActionTypes,
  actionTypeListCT19,
  // supplierCodes
} from './DataConstants'
// import TextFieldWithSearch from './sections/TextFieldWithSearch/TextFieldWithSearch'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import AutocompleteSelect from '../../../RangeChangeManagement/components/AutoCompleteSelect/AutocompleteSelect'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { AutoComplete as AutoCompletePrime } from 'primereact/autocomplete'
import DialogHeader from '../../../RangeChangeManagement/components/DialogHeader/DialogHeader'
import ConfirmCheckSign from '../../../RangeChangeManagement/components/ConfirmCheck/ConfirmCheckSign'
import {
  getConfigType,
  getRangeByRangeResetId,
  putCamundaMileStoneUpdate,
  getProductServiceByItemnumber,
  getProductSupplierServiceByItemnumber,
  getSupplierServiceBySupplierId,
  getProductCompositionServiceByItemnumber,
  getRangeByIdAndMinNumber,
  getSupplierSearchByIdNameSupplierAndSite,
  getLocationsStoreCodeAPI, //location/v2
  getRangeResetEventsStoreDepot,
  patchRangeResetItems,
  postFileAttachmentRangeResetAPI,
  deleteRafItem,
  patchRangeResetPlanogramErrors,
  getRangeResetPlanogramErrors,
  getLocationsServiceByItemnumber,
  deleteRangeResetsPlanogramError,
} from '../../../api/Fetch'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { life, routes } from '../../../util/Constants'
import { allMessages } from '../../../util/Messages'
import LoadingComponent from '../../../components/LoadingComponent/LoadingComponent'
import { Toast } from 'primereact/toast'
import SearchSelect from '../../../RangeChangeManagement/components/SearchSelect/SearchSelect'
import DepotviewButtons from './DepotviewButtons'
import DelistInputEdit from './DelistInputEdit'
import ActionTypeHover from './ActionTypeHover'
import './styles.css'
import { exportExcel } from './ExportExcel'
import ConfirmBox from '../../../components/ConfirmBox/ConfirmBox'
import ConfirmBox1 from '../../components/ConfirmBox1/confirmBox1'
import { InputTextarea } from 'primereact/inputtextarea'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps: Partial<MenuPropsType> = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  variant: 'menu',
}

function DelistsAddedToRange(props: any) {
  const { rafpendingActionDetailsCT06, userDetail } = props
  const { taskName: taskId } = rafpendingActionDetailsCT06 || {}
  const { DEFAULT, DASHBOARD_RANGE_PENDINGACTION, DASHBOARD } = routes
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const small = useMediaQuery(theme.breakpoints.up('md'))
  const radio = <Radio color="primary" />
  const LightTooltip = withStyles((theme: any) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      // color: 'rgba(0, 0, 0, 0.87)',
      color: 'red',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      border: '1px solid red',
    },
    arrow: {
      color: '#FFFFFF',
      // border: '1px solid red',
      '&::before': {
        border: '1px solid red',
      },
    },
  }))(Tooltip)
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
    delistProductMinErrorMessage,
    productDistributionIncreaseMinErrorMessage,
    productDistributionDecreaseMinErrorMessage,
    productShelfSpaceIncreaseErrorMessage,
    productShelfSpaceDecreaseErrorMessage,
  }: any = actionTypeListErrorMessage
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
  console.log(
    'actionTypeList',
    delistProductMin,
    productDistributionIncreaseMin
  )

  const [productType, setProductType] = useState<any>('existingProducts')
  // const [eventDetails, setEventDetails] = useState<any>(delistToRangeData)
  const [eventDetails, setEventDetails] = useState<any>()
  const [actionType, setActionType] = useState<any>()
  const [actionTypeSelected, setActionTypeSelected] = useState<any>()
  const [actionTypeOptions, setActionTypeOptions] = useState<any>([])
  const [min, setMin] = useState<any>('')
  const [existingSearchFields, setExistingSearchFields] = useState<any>()
  const [productId, setProductId] = useState<any>('')
  const [noOfStores, setNoOfStores] = useState<any>('')
  const [storeCode, setStoreCode] = useState<any>([])
  const [selectedStore, setSelectedStore] = useState<any>([])
  const [supplier, setSupplier] = useState<any>('')
  const [supplierSiteNumber, setSupplierSiteNumber] = useState<any>('')
  const [local, setLocal] = useState<any>('yes')
  const [pin, setPin] = useState<any>('')
  const [buyingMinIngredients, setBuyingMinIngredients] = useState<any>('')
  const [openUploadDialog, setOpenUploadDialog] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<any>()
  const [importedData, setImportedData] = useState<any>()
  const [supplierCode, setSupplierCode] = useState<any>()
  const [selectedSalesChannels, setSelectedSalesChannels] = useState<any>()
  const [placeholderCount, setPlaceholderCount] = useState<any>('')
  const [placeholderProducts, setPlaceholderProducts] = useState<any>([])
  const [replacementAssociationProduct, setReplacementAssociationProduct] =
    useState<any>([])
  const [newProductId, setNewProductId] = useState<any>('')
  const [selectedProductListItems, setSelectedProductListItems] = useState<any>(
    []
  )
  const [replacementCheck, setReplacementCheck] = useState(false)
  const [bulkActions, setBulkActions] = useState<any>()
  const [openActionTypeDialog, setOpenActionTypeDialog] = useState(false)

  const [replaceMinOrPin, setReplaceMinOrPin] = useState<any>('')
  const [fromDate, setFromDate] = useState<any>()
  const [toDate, setToDate] = useState<any>()
  const [addStoreCode, setAddStoreCode] = useState<any>('')
  const [comments, setComments] = useState<any>('')
  const [openPlaceholderDialog, setOpenPlaceholderDialog] = useState(false)
  const [openPlaceholderUpload, setOpenPlaceholderUpload] = useState(false)
  const [placeholderFile, setPlaceholderFile] = useState<any>()

  const [selectedPlaceholderData, setSelectedPlaceholderData] = useState<any>(
    []
  )
  const [selectedReplaceAssData, setSelectedReplaceAssData] = useState<any>([])
  const toast = useRef<any>(null)
  const [toastRemove, setToastRemove] = React.useState('')
  const [barCodeDoesnotExists, setBarCodeDoesnotExists] = useState<any>([])
  const [isProgressLoader, setIsProgressLoader] = useState(false)
  const [barCodeExists, setBarCodeExists] = useState<any>([])
  const [replaceError, setReplaceError] = useState<any>(false)
  const [replaceErrorMsg, setReplaceErrorMsg] = useState<any>(false)
  const [ingredientDialog, setIngredientDialog] = useState<any>(false)
  const [ingredientData, setIngredientData] = useState<any>([])
  const [selectedIngredientData, setSelectedIngredientData] = useState<any>([])
  const [rangedStoresDialogOpen, setRangedStoresDialogOpen] =
    useState<any>(false)
  const [rangedStoresData, setRangedStoresData] = useState<any>([])

  const [depotStockDialogOpen, setDepotStockDialogOpen] = useState<any>(false)
  const [depotStockData, setDepotStockData] = useState<any>([])
  const [recipeDialogOpen, setRecipeDialogOpen] = useState<any>(false)
  const [recipeData, setRecipeData] = useState<any>([])
  const [delistPinDateFrom, setDelistPinDateFrom] = useState<any>('')
  const [delistPinDateTo, setDelistPinDateTo] = useState<any>('')
  const [newPinDateFrom, setNewPinDateFrom] = useState<any>('')
  const [newPinDateTo, setNewPinDateTo] = useState<any>('')
  const [newIngredientError, setNewIngredientError] = useState<any>(false)

  const [newIngredient, setNewIngredient] = useState<any>(false)
  const [checkMin, setCheckMin] = useState<any>(false)
  const [checkUpdate, setCheckUpdate] = useState<any>(false)
  const [minCheckError, setMinCheckError] = useState<any>(false)

  const [currentNoOfRangeStores, setCurrentNoOfRangeStores] = useState<any>(0)
  const [currentShelfFill, setCurrentShelfFill] = useState<any>(0)
  const [newShelfFill, setNewShelfFill] = useState<any>(0)
  const [newStoreCount, setNewStoreCount] = useState<any>(0)
  const [storeViewData, setStoreViewData] = useState<any>(0)
  const [storeViewDialogOpen, setStoreViewDialogOpen] = useState<any>(false)
  const [supplierExisting, setSupplierExisting] = useState<any>('')
  const [supplierSiteExisting, setSupplierSiteExisting] = useState<any>('')
  const [supplierNew, setSupplierNew] = useState<any>('')
  const [supplierSiteNew, setSupplierSiteNew] = useState<any>('')
  const [completeConfirm, setCompleteConfirm] = useState(false)
  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [stocksConfirm, setStocksConfirm] = useState(false)
  const [rafLockedConfirm, setRafLockedConfirm] = useState(false)
  const [checkComplete, setCheckComplete] = useState(false)
  const [placeholderMultiSelectCheck, setPlaceholderMultiSelectCheck] =
    useState(false)
  const [placeholderMultiUploadData, setPlaceholderMultiUploadData] =
    useState<any>([])

  const [completeTaskDialogOpen, setCompleteTaskDialogOpen] = useState(false)
  const [inputTextareaValue, setInputTextareaValue] = useState<any>('')
  const [completeTaskUploadedFile, setCompleteTaskUploadedFile] =
    useState<any>()

  const [finalRangeState, setFinalRangeState] = useState<any>(false)
  const [clearDepotBulkActionOpen, setClearDepotBulkActionOpen] =
    useState<any>(false)
  const [clearDepotSelected, setClearDepotSelected] = useState<any>(0)
  const [bulkActionOptions, setBulkActionOptions] = useState<any>()
  const [finalStopOrderBulkActionOpen, setFinalStopOrderBulkActionOpen] =
    useState<any>(false)
  const [finalStopOrderSelected, setFinalStopOrderSelected] =
    useState<any>(null)
  const [deleteBulkActionOpen, setDeleteBulkActionOpen] = useState<any>(false)
  const [cancelBulkActionOpen, setCancelBulkActionOpen] = useState<any>(false)
  const [viewTemplateName, setViewTemplateName] = useState<any>('')

  const [completeTaskPlaceHolderError, setCompleteTaskPlaceholderError] =
    useState<any>('')
  const [storeCodeFetchError, setStoreCodeFetchError] = useState<any>(false)
  const [storeCodeLength, setStoreCodeLength] = useState<any>()
  const [newStoreViewData, setNewStoreViewData] = useState<any>()
  const [stockCountRequestOpen, setStockCountRequestOpen] = useState<any>(false)

  let taskName = 'CT36'

  // const stylesInp = {
  //   container: {
  //     width: '1000px',
  //   },
  //   '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
  //     padding: '0px',
  //   },
  // }3534
  //setEventDetails

  // useEffect(() => {
  //   getRangeByRangeResetId('1304')
  //     .then((res: any) => {
  //       console.log('3400', res.data.items)
  //       // console.log(JSON.stringify(res.data))
  //       const data = res.data
  //       const eventDataApi = {
  //         eventName: data.name,
  //         dueDate: data.appDueDate,
  //         status: data.status,
  //         resetType: data.resetType,
  //         targetDate: data.targetDate,
  //         group: data.tradeGroup,
  //         category: data.category,
  //         department: data.department,
  //         eventId: data.id,
  //         clearancePriceCheck: data.clearancePriceCheck,
  //         orderStopDateCheck: data.orderStopDateCheck,
  //         stopOrder: data.stopOrder,
  //         buyer: data.buyerEmailId,
  //         buyingAssistant: data.buyerAssistantEmailId,
  //         ownBrandManager: data.ownBrandManagerEmailId,
  //         seniorBuyingManager: data.seniorBuyingManagerEmailId,
  //         merchandiser: data.merchandiserEmailId,
  //         rangeResetManager: data.rangeResetManagerEmailId,
  //         categoryDirector: data.categoryDirectorEmailId,
  //         supplyChainSplst: data.supplyChainAnalystEmailId,
  //       }
  //       setEventDetails([eventDataApi])
  //       console.log('setEventDetails', eventDataApi)
  //       // if (res.data.items.length > 0) {
  //       //   const data = res.data.items.map((item: any) => {
  //       //     var minVal = 1000000000000
  //       //     var max = 9999999999999
  //       //     var rand = Math.floor(minVal + Math.random() * (max - minVal))
  //       //     return {
  //       //       _idCheck: rand,
  //       //       actionType: item.type,
  //       //       itemNumber: item.itemNumber,
  //       //       description: item.description,
  //       //       lineStatus: 'Draft',
  //       //       comments: comments,
  //       //       min: item.itemNumber,
  //       //       Local: item.local,
  //       //       onlineCFC: item.onlineCfc,
  //       //       onlineStorePick: item.onlineStorePick,
  //       //       ownBrand: item.ownBrand,
  //       //       wholesale: item.wholesale,
  //       //       supplierCommitment: item.supplierCommitment,
  //       //       existingSupplier: item.existingSupplier,
  //       //       existingSupplierSite: item.existingSupplierSite,
  //       //       forward_forecast_to_launch: item.frwdForecastToLaunch,
  //       //       clearDepotBy: item.depoClearWeek,
  //       //       effectiveDateFrom: item.effectiveFromDate,
  //       //       effectiveDateTo: item.effectiveToDate,
  //       //       includeInClearancePricing: eventDataApi.clearancePriceCheck,
  //       //     }
  //       //   })
  //       //   setImportedData(data)
  //       // }
  //     })
  //     .catch((err: any) => {
  //       console.log(err)
  //     })
  // }, [])

  // useEffect(() => {
  //   if (!rafpendingActionDetailsCT06) {
  //     history.push(`${DEFAULT}${DASHBOARD_RANGE_PENDINGACTION}`)
  //   }
  // }, [
  //   rafpendingActionDetailsCT06,
  //   history,
  //   DEFAULT,
  //   DASHBOARD_RANGE_PENDINGACTION,
  // ])

  const headerName = () => {
    if (rafpendingActionDetailsCT06) {
      let header = ''
      if (
        rafpendingActionDetailsCT06.taskName === 'CT06' ||
        rafpendingActionDetailsCT06.taskName === 'CT6' ||
        rafpendingActionDetailsCT06.taskName === 'CT07' ||
        rafpendingActionDetailsCT06.taskName === 'CT7'
      ) {
        header = 'Delists added to the Range Change Management App'
      } else if (
        rafpendingActionDetailsCT06.taskName === 'CT09' ||
        rafpendingActionDetailsCT06.taskName === 'CT9' ||
        rafpendingActionDetailsCT06.taskName === 'CT11'
      ) {
        header = 'Week 2 - Core Plan builds and Space Recommendation-Sign Off'
      } else {
        header = 'Delists added to the Range Change Management App'
      }
      console.error(header)
      return header
    }
  }

  const rejectDisabled = () => {
    if (rafpendingActionDetailsCT06) {
      if (
        rafpendingActionDetailsCT06.taskName === 'CT01' ||
        rafpendingActionDetailsCT06.taskName === 'CT02' ||
        rafpendingActionDetailsCT06.taskName === 'CT06' ||
        rafpendingActionDetailsCT06.taskName === 'CT08' ||
        rafpendingActionDetailsCT06.taskName === 'CT09' ||
        rafpendingActionDetailsCT06.taskName === 'CT12' ||
        rafpendingActionDetailsCT06.taskName === 'CT14' ||
        rafpendingActionDetailsCT06.taskName === 'CT16' ||
        rafpendingActionDetailsCT06.taskName === 'CT18' ||
        rafpendingActionDetailsCT06.taskName === 'CT21' ||
        rafpendingActionDetailsCT06.taskName === 'CT22' ||
        rafpendingActionDetailsCT06.taskName === 'CT26' ||
        rafpendingActionDetailsCT06.taskName === 'CT29' ||
        rafpendingActionDetailsCT06.taskName === 'CT30'
      ) {
        return true
      } else {
        return false
      }
    }
  }
  useEffect(() => {
    console.log(rafpendingActionDetailsCT06)
    if (!rafpendingActionDetailsCT06) {
      history.push(`${DEFAULT}${DASHBOARD_RANGE_PENDINGACTION}`)
    } else {
      if (rafpendingActionDetailsCT06 && rafpendingActionDetailsCT06.eventId) {
        getRangeByRangeResetId(rafpendingActionDetailsCT06.eventId)
          .then((res: any) => {
            console.log(res.data)
            const data = res.data
            setEventDetails([data])
          })
          .catch((err: any) => {
            console.log(err.response)
          })
      }
    }
  }, [
    rafpendingActionDetailsCT06,
    history,
    DEFAULT,
    DASHBOARD_RANGE_PENDINGACTION,
  ])

  // const refreshAction = () => {
  // getRangeByIdAndMinNumber('3400', '@all')
  // getRangeByIdAndMinNumber('1304', '@all')
  // getRangeByIdAndMinNumber(rafpendingActionDetailsCT06.eventId, '@all')

  const supplerNameBySupplierCode = (
    suppliercode: any,
    minNumber: any,
    initalData: any
  ) => {
    const importData = initalData && [...initalData]
    let index = importData.findIndex((data: any) => data.min === minNumber)
    console.log('suppliercode', suppliercode)
    if (suppliercode === null || suppliercode === undefined) {
      return ''
    }
    let existingSupplier: any = ''
    if (index !== -1) {
      suppliercode &&
        getSupplierServiceBySupplierId(suppliercode)
          .then((res: any) => {
            console.log('LoadSupplierSuccess', res)

            setImportedData((prevState: any) => {
              importData[index].existingSupplier = res.data.supplierName
              importData[index].existingSupplierSite = suppliercode
              return importData
            })

            // existingSupplier = res.data.supplierName
            // return res.data.supplierName
          })
          .catch((err: any) => {
            // existingSupplier = 'NoSupplierFound'

            setImportedData((prevState: any) => {
              importData[index].existingSupplier = ''
              importData[index].existingSupplierSite = suppliercode
              console.log('LoadSupplierError', err)
              //   toast.current.show({
              //   severity: 'error',
              //   summary: 'Error',
              //   detail: suppliercode + ' No Supplier Name Error',
              //   life: life,
              //   className: 'login-toast',
              // })
              return importData
            })

            // console.log('LoadSupplierError', err)
            // toast.current.show({
            //   severity: 'error',
            //   summary: 'Error',
            //   detail: suppliercode + ' No Supplier Name Error',
            //   life: life,
            //   className: 'login-toast',
            // })
            // return existingSupplier
          })
    }
  }

  const initalLoadSummaryGetSupplierNameByCode = (data: any) => {
    console.log('SummaryData', data)
    let supplierName: any = ''
    let updateImportedData = data && [...data]
    updateImportedData &&
      updateImportedData.map((item: any) => {
        if (item && item.primaryOrder && item.primaryOrder.supplierId) {
          // summary
          supplerNameBySupplierCode(
            item.primaryOrder.supplierId,
            item.min,
            updateImportedData
          )
        } else {
          // service
          supplerNameBySupplierCode(
            item.existingSupplierSite,
            item.min,
            updateImportedData
          )
        }
      })
  }

  const initialSummaryCall = () => {
    setDisplayManualErrors(false)
    setFinalRangeState(false)
    setIsProgressLoader(true)
    rafpendingActionDetailsCT06 &&
      getRangeResetEventsStoreDepot(
        rafpendingActionDetailsCT06 && rafpendingActionDetailsCT06.eventId,
        '@all',
        'store'
      )
        .then((res: any) => {
          console.log('1304', res.data)
          console.log('1304', JSON.stringify(res.data))
          const data = res.data
          if (data.length > 0) {
            const data = res.data.map((item: any) => {
              var minVal = 1000000000000
              var max = 9999999999999
              var rand = Math.floor(minVal + Math.random() * (max - minVal))
              var shelfFillVal =
                item.shelfFillNew && item.rangedStoresCurrent
                  ? parseInt(item.rangedStoresCurrent) *
                    parseInt(item.shelfFillNew)
                  : null
              var currentVsNewShelf =
                item.shelfFillCurrent && shelfFillVal
                  ? Math.abs(item.shelfFillCurrent - shelfFillVal)
                  : null
              var currentVsNewShelfPercent =
                item.shelfFillCurrent && currentVsNewShelf
                  ? (currentVsNewShelf / item.shelfFillCurrent) * 100
                  : null
              return {
                _idCheck: rand,
                actionType: item.type,
                lineStatus: item.eventLineStatus,
                // itemNumber: item.itemNumber, //userinput
                min: item.itemNumber, //userinput
                pin: item.pin ? item.pin : null,
                pinArray: [],
                ingredientMin: item.ingredientMin ? item.ingredientMin : null,
                // legacyItemNumbers: item.hasOwnProperty('legacyItemNumbers')
                //   ? item.legacyItemNumbers
                //   : null,
                legacyItemNumbers: item.legacyCode ? item.legacyCode : '',
                man: item.man ? item.man : null,
                description: item.description ? item.description : null,
                replaceMin: item.replaceMin ? item.replaceMin : null,
                replaceMinDescription: item.replaceMinDescription
                  ? item.replaceMinDescription
                  : null,
                unitretailInc: 'NA', //drop2
                unitcost: item.unitCost, //drop2
                unitretailEx: 'NA', //drop2
                casecost: item.caseCost ? item.caseCost : null, //drop2
                packquantity: item.caseSize ? item.caseSize : null, //drop2
                newSupplier: item.newSupplier ? item.newSupplier : null,
                newSupplierSite: item.newSupplierSite
                  ? item.newSupplierSite
                  : null,
                local: item.local ? item.local : null,
                perStorepPerWeek: item.hasOwnProperty('perStorePerWeek')
                  ? item.perStorePerWeek
                  : null,
                onlineCFC: item.rangestatus
                  ? item.rangestatus.online
                    ? item.rangestatus.online[1]
                      ? item.rangestatus.online[1] === 'OnlineCFC'
                        ? 'Y'
                        : 'N'
                      : 'N'
                    : 'N'
                  : 'N',
                onlineStorePick:
                  // item.rangestatus
                  //   ? item.rangestatus.retail
                  //     ? item.rangestatus.retail.join(',')
                  //     : null
                  //   : null,
                  item.rangestatus
                    ? item.rangestatus.online
                      ? item.rangestatus.online[0].toLowerCase() === 'online'
                        ? 'Y'
                        : 'N'
                      : 'N'
                    : 'N',
                wholesale: item.rangestatus
                  ? item.rangestatus.wholesale
                    ? item.rangestatus.wholesale.length > 0
                      ? 'Y'
                      : 'N'
                    : 'N'
                  : 'N',
                currentnoofrangedstores: item.rangedStoresCurrent
                  ? item.rangedStoresCurrent
                  : null,
                // currentnoofrangedstores: 100,
                numberOfRangeStores: item.rangedStoresNew
                  ? item.rangedStoresNew
                  : null,
                currentVersusNewStores: item.currentVsNewStores
                  ? item.currentVsNewStores
                  : null,
                storesRangedCurrentVsProposed: item.rangedStoresPercent
                  ? item.rangedStoresPercent
                  : null,
                currentShelfFill: item.shelfFillCurrent
                  ? item.shelfFillCurrent
                  : null,
                newShelfFill: item.shelfFillNew ? item.shelfFillNew : null,
                newShelfFillMultiplied: shelfFillVal,
                currentshelffill_vs_newfill_percant: item.shelfFillPercent
                  ? item.shelfFillPercent
                  : null,
                currentVsNewShelfFillPercent: currentVsNewShelfPercent,
                currentshelffill_vs_newfill: item.currentVsNewShelfFill,
                currentVsNewShelfFill: currentVsNewShelf,
                ownBrand: item.ownBrand ? item.ownBrand : null,
                includeInClearancePricing: item.clearancePricing
                  ? item.clearancePricing
                  : null,
                includeInStoreWastage: item.wastage ? item.wastage : null,
                clearDepotBy: item.depotClearWeek ? item.depotClearWeek : null,
                supplierCommitment: item.supplierCommitment
                  ? item.supplierCommitment.quantity
                    ? item.supplierCommitment.quantity
                    : null
                  : null,
                finalStopOrderDate: item.gscopdate.date
                  ? item.gscopdate.date.split(' ')[0]
                  : null,
                systemSuggestedStopOrderDate: item.stopPODate
                  ? item.stopPODate.split(' ')[0]
                  : null,
                lastPoDate: item.lastPODate
                  ? item.lastPODate.split(' ')[0]
                  : null,
                depotShelfLifeMinimum: item.depotShelfLife
                  ? item.depotShelfLife
                  : null,
                productShelfLifeInstore: item.productShelfLife
                  ? item.productShelfLife
                  : null,
                shelfLifeatManufacture: item.mfgShelfLife
                  ? item.mfgShelfLife
                  : null,
                // numberOfRangeStores: item.rangedStoresNew
                //   ? item.rangedStoresNew
                //   : null,
                totalstock:
                  item.totalDepotStock && item.totalStoreStock
                    ? item.totalDepotStock + item.totalStoreStock
                    : item.totalDepotStock
                    ? item.totalDepotStock
                    : item.totalStoreStock
                    ? item.totalStoreStock
                    : '', //nokey
                storeStockUnit: item.totalStoreStock
                  ? item.totalStoreStock
                  : null,
                depotStockUnit: item.totalDepotStock
                  ? item.totalDepotStock
                  : null,
                // depotStockUnit: 100,
                openPos: item.totalOpenPurchaseOrders
                  ? item.totalOpenPurchaseOrders
                  : null,
                storeNumbersForspecificStoreRange:
                  item.storeNumbersForspecificStoreRange
                    ? item.storeNumbersForspecificStoreRange
                    : null,
                forward_forecast_to_launch:
                  // item.frwdForecastToLaunch
                  //   ? item.frwdForecastToLaunch
                  //   : null,
                  item.totalSalesForecast ? item.totalSalesForecast : null,
                averageWeeklyVolume: item.total3MonthsPOHistory
                  ? item.total3MonthsPOHistory
                  : null,
                weeksCoveronTotalStockonHandtoResetDate: item.weeksCover
                  ? item.weeksCover
                  : null,
                forcastedWeeksCovertoResetDate: item.forecastWeekCover
                  ? item.forecastWeekCover
                  : null,
                // excessstock: item.excessStock ? item.excessStock : null,
                excessstock: item.totalExcessStocks
                  ? item.totalExcessStocks
                  : null,

                safewaybrandedequivalent: item.safewayBrandedEq
                  ? item.safewayBrandedEq
                  : null,
                effectiveDateFrom: item.effectiveFromDate
                  ? item.effectiveFromDate.split(' ')[0]
                  : null,
                effectiveDateTo: item.effectiveToDate
                  ? item.effectiveToDate.split(' ')[0]
                  : null,
                existingSupplier: item.existingSupplier
                  ? item.existingSupplier
                  : null,
                existingSupplierSite: item.existingSupplierSite
                  ? item.existingSupplierSite
                  : null,
                noOfRecipeMin: item.recipeMin ? item.recipeMin : '',
                // noOfRecipeMin: 100,
                //drop2
                // depotClearbyReservedQtyRetail: item.retailDepotClear
                //   ? item.retailDepotClear
                //   : null,
                // depotClearbyReservedQtyWholesale: item.wholesaleDepotClear
                //   ? item.wholesaleDepotClear
                //   : null,
                // depotClearbyReservedQtyOnline: item.onlineDepotClear
                //   ? item.onlineDepotClear
                //   : null,
                // depotClearbyReservedQtyTotal: item.totalDepotClear
                //   ? item.totalDepotClear
                //   : null,
                //drop 2 upper block should be work
                depotClearbyReservedQtyRetail: null,
                depotClearbyReservedQtyWholesale: null,
                depotClearbyReservedQtyOnline: null,
                depotClearbyReservedQtyTotal: null,
                primaryOrder: item.primaryOrder && item.primaryOrder,
                purchaseOrders: item.purchaseOrders && item.purchaseOrders,
                newAdded: false,

                comments: item.comments ? item.comments : null, //uncomment when deploying
                // min: '500000033',

                //Depot stock Unit View Model data
                // aggregatedStoreStockUnit: item.aggregatedstorestock ? item.aggregatedstorestock : null,
                // totalPurchaseOrdersForecast: item.totalPurchaseOrdersForecast ?item.totalPurchaseOrdersForecast:null,
                // total3MonthsPOHistory: item.total3MonthsPOHistory ? item.total3MonthsPOHistory :null,
                // depotClearDate: item.depotClearDate ?  item.depotClearDate :null,
                // salesForcastToTargetDate: 'NA',
                // systemAdvisedStopOrderDate: 'NA',
                // derangedLocations: item.derangedLocations,
                // rangedStoresCurrent: item.rangedStoresCurrent,
                groupCategoryDepartment: `${
                  eventDetails && eventDetails[0].tradeGroup
                }, ${
                  eventDetails && eventDetails[0].category
                    ? eventDetails[0].category
                    : ''
                }, ${
                  eventDetails && eventDetails[0].department
                    ? eventDetails[0].department
                    : ''
                }`,
              }
            })

            setImportedData(data)
            console.log('setImportedData1304@all', data)
            console.log('ImportedData1304@all', data)
            initalLoadSummaryGetSupplierNameByCode(data)
          }
          setIsProgressLoader(false)
        })
        .catch((err: any) => {
          console.log(err)
          setImportedData(null)
          setIsProgressLoader(false)
        })
  }

  useEffect(() => {
    // getRangeByIdAndMinNumber('3400', '@all')
    // getRangeByIdAndMinNumber('1304', '@all')
    // getRangeByIdAndMinNumber(rafpendingActionDetailsCT06.eventId, '@all')
    // if (rafpendingActionDetailsCT06) {
    //   if (
    //     rafpendingActionDetailsCT06 &&
    //     eventDetails &&
    //     eventDetails[0].tradeGroup
    //   ) {
    //     getRangeResetEventsStoreDepot(
    //       rafpendingActionDetailsCT06.eventId,
    //       '@all',
    //       'store'
    //     )
    //       .then((res: any) => {
    //         console.log('1304', res.data)
    //         console.log('1304', JSON.stringify(res.data))
    //         const data = res.data
    //         if (data.length > 0) {
    //           const data = res.data.map((item: any) => {
    //             var minVal = 1000000000000
    //             var max = 9999999999999
    //             var rand = Math.floor(minVal + Math.random() * (max - minVal))
    //             var shelfFillVal =
    //               item.shelfFillNew && item.rangedStoresCurrent
    //                 ? parseInt(item.rangedStoresCurrent) *
    //                   parseInt(item.shelfFillNew)
    //                 : null
    //             var currentVsNewShelf =
    //               item.shelfFillCurrent && shelfFillVal
    //                 ? Math.abs(item.shelfFillCurrent - shelfFillVal)
    //                 : null
    //             var currentVsNewShelfPercent =
    //               item.shelfFillCurrent && currentVsNewShelf
    //                 ? (currentVsNewShelf / item.shelfFillCurrent) * 100
    //                 : null
    //             return {
    //               _idCheck: rand,
    //               actionType: item.type,
    //               lineStatus: item.eventLineStatus,
    //               // itemNumber: item.itemNumber, //userinput
    //               min: item.itemNumber, //userinput
    //               pin: item.pin ? item.pin : null,
    //               pinArray: null,
    //               ingredientMin: item.ingredientMin ? item.ingredientMin : null,
    //               // legacyItemNumbers: item.hasOwnProperty('legacyItemNumbers')
    //               //   ? item.legacyItemNumbers
    //               //   : null,
    //               legacyItemNumbers: item.legacyCode ? item.legacyCode : '',
    //               man: item.man ? item.man : null,
    //               description: item.description ? item.description : null,
    //               replaceMin: item.replaceMin ? item.replaceMin : null,
    //               replaceMinDescription: item.replaceMinDescription
    //                 ? item.replaceMinDescription
    //                 : null,
    //               unitretailInc: 'NA', //drop2
    //               unitcost: item.unitCost, //drop2
    //               unitretailEx: 'NA', //drop2
    //               casecost: item.caseCost ? item.caseCost : null, //drop2
    //               packquantity: item.caseSize ? item.caseSize : null, //drop2
    //               newSupplier: item.newSupplier ? item.newSupplier : null,
    //               newSupplierSite: item.newSupplierSite
    //                 ? item.newSupplierSite
    //                 : null,
    //               local: item.local ? item.local : null,
    //               perStorepPerWeek: item.hasOwnProperty('perStorePerWeek')
    //                 ? item.perStorePerWeek
    //                 : null,
    //               onlineCFC:
    //                 // item.rangestatus
    //                 //   ? item.rangestatus.online
    //                 //     ? item.rangestatus.online[0].toLowerCase() === 'Online'
    //                 //       ? 'Y'
    //                 //       : 'N'
    //                 //     : null
    //                 //   : null,
    //                 item.rangestatus
    //                   ? item.rangestatus.online
    //                     ? item.rangestatus.online[1]
    //                       ? item.rangestatus.online[1] === 'OnlineCFC'
    //                         ? 'Y'
    //                         : 'N'
    //                       : 'N'
    //                     : 'N'
    //                   : 'N',
    //               onlineStorePick:
    //                 // item.rangestatus
    //                 //   ? item.rangestatus.retail
    //                 //     ? item.rangestatus.retail.join(',')
    //                 //     : null
    //                 //   : null,
    //                 item.rangestatus
    //                   ? item.rangestatus.online
    //                     ? item.rangestatus.online[0].toLowerCase() === 'online'
    //                       ? 'Y'
    //                       : 'N'
    //                     : 'N'
    //                   : 'N',
    //               wholesale: item.rangestatus
    //                 ? item.rangestatus.wholesale
    //                   ? item.rangestatus.wholesale.length > 0
    //                     ? 'Y'
    //                     : 'N'
    //                   : 'N'
    //                 : 'N',
    //               currentnoofrangedstores: item.rangedStoresCurrent
    //                 ? item.rangedStoresCurrent
    //                 : null,
    //               // currentnoofrangedstores: 100,
    //               numberOfRangeStores: item.rangedStoresNew
    //                 ? item.rangedStoresNew
    //                 : null,
    //               currentVersusNewStores: item.currentVsNewStores
    //                 ? item.currentVsNewStores
    //                 : null,
    //               storesRangedCurrentVsProposed: item.rangedStoresPercent
    //                 ? item.rangedStoresPercent
    //                 : null,
    //               currentShelfFill: item.shelfFillCurrent
    //                 ? item.shelfFillCurrent
    //                 : null,
    //               newShelfFill: item.shelfFillNew ? item.shelfFillNew : null,
    //               newShelfFillMultiplied: shelfFillVal,
    //               currentshelffill_vs_newfill_percant: item.shelfFillPercent
    //                 ? item.shelfFillPercent
    //                 : null,
    //               currentVsNewShelfFillPercent: currentVsNewShelfPercent,
    //               currentshelffill_vs_newfill: item.currentVsNewShelfFill,
    //               currentVsNewShelfFill: currentVsNewShelf,
    //               ownBrand: item.ownBrand ? item.ownBrand : null,
    //               includeInClearancePricing: item.clearancePricing
    //                 ? item.clearancePricing
    //                 : null,
    //               includeInStoreWastage: item.wastage ? item.wastage : null,
    //               clearDepotBy: item.depotClearWeek
    //                 ? item.depotClearWeek
    //                 : null,
    //               supplierCommitment: item.supplierCommitment
    //                 ? item.supplierCommitment.quantity
    //                   ? item.supplierCommitment.quantity
    //                   : null
    //                 : null,
    //               finalStopOrderDate: item.gscopdate.date
    //                 ? item.gscopdate.date.split(' ')[0]
    //                 : null,
    //               systemSuggestedStopOrderDate: item.stopPODate
    //                 ? item.stopPODate.split(' ')[0]
    //                 : null,
    //               lastPoDate: item.lastPODate
    //                 ? item.lastPODate.split(' ')[0]
    //                 : null,
    //               depotShelfLifeMinimum: item.depotShelfLife
    //                 ? item.depotShelfLife
    //                 : null,
    //               productShelfLifeInstore: item.productShelfLife
    //                 ? item.productShelfLife
    //                 : null,
    //               shelfLifeatManufacture: item.mfgShelfLife
    //                 ? item.mfgShelfLife
    //                 : null,
    //               // numberOfRangeStores: item.rangedStoresNew
    //               //   ? item.rangedStoresNew
    //               //   : null,
    //               totalstock:
    //                 item.totalDepotStock && item.totalStoreStock
    //                   ? item.totalDepotStock + item.totalStoreStock
    //                   : item.totalDepotStock
    //                   ? item.totalDepotStock
    //                   : item.totalStoreStock
    //                   ? item.totalStoreStock
    //                   : '',
    //               storeStockUnit: item.totalStoreStock
    //                 ? item.totalStoreStock
    //                 : null,
    //               depotStockUnit: item.totalDepotStock
    //                 ? item.totalDepotStock
    //                 : null,
    //               // depotStockUnit: 100,
    //               openPos: item.totalOpenPurchaseOrders
    //                 ? item.totalOpenPurchaseOrders
    //                 : null,
    //               storeNumbersForspecificStoreRange:
    //                 item.storeNumbersForspecificStoreRange
    //                   ? item.storeNumbersForspecificStoreRange
    //                   : null,
    //               forward_forecast_to_launch:
    //                 // item.frwdForecastToLaunch
    //                 //   ? item.frwdForecastToLaunch
    //                 //   : null,
    //                 item.totalSalesForecast ? item.totalSalesForecast : null,
    //               averageWeeklyVolume: item.total3MonthsPOHistory
    //                 ? item.total3MonthsPOHistory
    //                 : null,
    //               weeksCoveronTotalStockonHandtoResetDate: item.weeksCover
    //                 ? item.weeksCover
    //                 : null,
    //               forcastedWeeksCovertoResetDate: item.forecastWeekCover
    //                 ? item.forecastWeekCover
    //                 : null,
    //               // excessstock: item.excessStock ? item.excessStock : null,
    //               excessstock: item.totalExcessStocks
    //                 ? item.totalExcessStocks
    //                 : null,
    //               safewaybrandedequivalent: item.safewayBrandedEq
    //                 ? item.safewayBrandedEq
    //                 : null,
    //               effectiveDateFrom: item.effectiveFromDate
    //                 ? item.effectiveFromDate.split(' ')[0]
    //                 : null,
    //               effectiveDateTo: item.effectiveToDate
    //                 ? item.effectiveToDate.split(' ')[0]
    //                 : null,
    //               existingSupplier: item.existingSupplier
    //                 ? item.existingSupplier
    //                 : null,
    //               existingSupplierSite: item.existingSupplierSite
    //                 ? item.existingSupplierSite
    //                 : null,
    //               noOfRecipeMin: item.recipeMin ? item.recipeMin : '',
    //               // noOfRecipeMin: 100,
    //               //drop2
    //               // depotClearbyReservedQtyRetail: item.retailDepotClear
    //               //   ? item.retailDepotClear
    //               //   : null,
    //               // depotClearbyReservedQtyWholesale: item.wholesaleDepotClear
    //               //   ? item.wholesaleDepotClear
    //               //   : null,
    //               // depotClearbyReservedQtyOnline: item.onlineDepotClear
    //               //   ? item.onlineDepotClear
    //               //   : null,
    //               // depotClearbyReservedQtyTotal: item.totalDepotClear
    //               //   ? item.totalDepotClear
    //               //   : null,
    //               // drop 2 upper block
    //               depotClearbyReservedQtyRetail: null,
    //               depotClearbyReservedQtyWholesale: null,
    //               depotClearbyReservedQtyOnline: null,
    //               depotClearbyReservedQtyTotal: null,
    //               comments: item.comments ? item.comments : null, //uncomment when deploying
    //               // min: '500000033',

    //               //Depot stock Unit View Model data
    //               // aggregatedStoreStockUnit: item.aggregatedstorestock ? item.aggregatedstorestock : null,
    //               // totalPurchaseOrdersForecast: item.totalPurchaseOrdersForecast ?item.totalPurchaseOrdersForecast:null,
    //               // total3MonthsPOHistory: item.total3MonthsPOHistory ? item.total3MonthsPOHistory :null,
    //               // depotClearDate: item.depotClearDate ?  item.depotClearDate :null,
    //               // salesForcastToTargetDate: 'NA',
    //               // systemAdvisedStopOrderDate: 'NA',
    //               // derangedLocations: item.derangedLocations,
    //               // rangedStoresCurrent: item.rangedStoresCurrent,
    //               groupCategoryDepartment: `${eventDetails[0].tradeGroup}, ${
    //                 eventDetails && eventDetails[0].category
    //                   ? eventDetails[0].category
    //                   : ''
    //               }, ${
    //                 eventDetails && eventDetails[0].department
    //                   ? eventDetails[0].department
    //                   : ''
    //               }`,
    //             }
    //           })

    //           setImportedData(data)
    //           console.log('setImportedData1304@all', data)
    //           console.log('ImportedData1304@all', data)
    //           setCheckComplete(false)
    //         }
    //       })
    //       .catch((err: any) => {
    //         console.log(err)
    //       })
    //   }
    // }
    initialSummaryCall()
  }, [eventDetails])

  useEffect(() => {
    getConfigType('Item Bulk Action')
      .then((res: any) => {
        let options = res.data.map((op: any) => {
          return {
            value: op.configValue,
            label: op.configValue,
          }
        })
        setBulkActionOptions(options)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])

  // const onPageLoadStoreCode = () => {
  //   setIsProgressLoader(true)
  //   getLocationsStoreCodeAPI()
  //     .then((res: any) => {
  //       console.log('getLocationsStoreCodeAPI', res)
  //       setIsProgressLoader(false)
  //       const stores = res.data.stores
  //       // const storeCodes = stores.map((val: any) => {
  //       //   return {
  //       //     label: val.name,
  //       //     text: val.name,
  //       //   }
  //       // })
  //       const storeCodes = stores.map((val: any) => {
  //         return val.name
  //       })
  //       setStoreCode(storeCodes)
  //     })
  //     .catch((err: any) => {
  //       console.log('getLocationsStoreCodeAPIError', err)
  //       setIsProgressLoader(false)
  //     })
  // }

  const storeCodeFetch = (minVal: any) => {
    setIsProgressLoader(true)
    if (actionType.value === productDistributionIncreaseMin) {
      Promise.allSettled([
        getLocationsServiceByItemnumber(minVal && minVal),
        getLocationsStoreCodeAPI(),
      ])
        .then((res: any) => {
          setIsProgressLoader(false)
          if (
            res &&
            res[0].status === 'fulfilled' &&
            res[1].status === 'fulfilled'
          ) {
            let storecodes1 = res[0].value.data.range.map((data: any) =>
              data.locationId.toString()
            )
            let storecodes2 = res[1].value.data.stores.map((data: any) =>
              data.name.toString()
            )
            console.log('storecodes', storecodes1, storecodes2)
            let difference = storecodes2.filter(
              (x: any) => !storecodes1.includes(x)
            )
            difference.sort((x: any, y: any) =>
              x.localeCompare(y, 'en', { numeric: true })
            )
            console.log('storecodes2', difference)
            setStoreCode(difference)
            setStoreCodeLength((prevState: any) => {
              let newEntry = {
                storeMin: minVal,
                storeLength: storecodes1.length,
              }
              if (prevState && prevState.length > 0) {
                let index = prevState.findIndex(
                  (item: any) => item.storeMin === minVal
                )
                if (index !== -1) {
                  let newData = [...prevState]
                  newData[index] = newEntry
                  return newData
                } else {
                  return [...prevState, newEntry]
                }
              } else {
                return [newEntry]
              }
            })
            setStoreCodeFetchError(false)
          } else {
            setStoreCodeFetchError(true)
          }
        })
        .catch((err: any) => {
          setIsProgressLoader(false)
        })
    } else {
      getLocationsServiceByItemnumber(minVal && minVal)
        .then((res: any) => {
          setIsProgressLoader(false)
          const stores = res.data.range
          const storeCodes = stores.map((val: any) => {
            return val.locationId.toString()
          })
          setStoreCode(storeCodes)
          // setStoreCodeLength(storeCodes.length)
          setStoreCodeLength((prevState: any) => {
            let newEntry = {
              storeMin: minVal,
              storeLength: storeCodes.length,
            }
            if (prevState && prevState.length > 0) {
              return [...prevState, newEntry]
            } else {
              return [newEntry]
            }
          })
          setStoreCodeFetchError(false)
        })
        .catch((err: any) => {
          console.log('getLocationsStoreCodeAPIError', err)
          setIsProgressLoader(false)
          setStoreCodeFetchError(true)
        })
    }
  }

  // useEffect(() => {
  //   // onPageLoadStoreCode()
  //   storeCodeFetch()
  // }, [])

  useEffect(() => {
    setExistingSearchFields([
      {
        productId: productId,
        storeCode: storeCode,
        supplier: supplier,
        supplierSiteNumber: supplierSiteNumber,
        local: local,
        pin: pin,
        buyingMinIngredients: buyingMinIngredients,
      },
    ])
  }, [
    productId,
    storeCode,
    supplier,
    supplierSiteNumber,
    local,
    pin,
    buyingMinIngredients,
  ])

  const Input = styled('input')({
    display: 'none',
  })

  const handleProductTypeChange = (e: any) => {
    setProductType(e.target.value)
  }

  // const productIdTemplate = (rowData: any) => {
  //     return <TextFieldWithSearch value={productId} onChangeFn={setProductId} onSearch={console.log} />
  // }

  // const storeCodeTemplate = () => {
  //     return <TextFieldWithSearch value={storeCode} onChangeFn={setStoreCode} onSearch={console.log} />
  // }

  // const supplierTemplate = () => {
  //     return <TextFieldWithSearch value={supplier} onChangeFn={setSupplier} onSearch={console.log} />
  // }

  // const supplierSiteNumberTemplate = () => {
  //     return <TextFieldWithSearch value={supplierSiteNumber} onChangeFn={setSupplierSiteNumber} onSearch={console.log} />
  // }
  const onChangeProductTableFields = (
    prevState: any,
    field: any,
    rowDataSelected: any,
    eventValue: any
  ) => {
    return prevState.map((obj: any) =>
      obj._idCheck === rowDataSelected._idCheck
        ? Object.assign(obj, { [field]: eventValue })
        : obj
    )
  }

  const localTemplate = (rowData: any) => {
    if (
      rowData &&
      (rowData.actionType === placeholderMin ||
        rowData.actionType === delistOutercaseCode ||
        rowData.actionType === newOutercaseCode ||
        rowData.actionType === supplyChange)
    ) {
      return <>NA</>
    } else {
      if (rowData && rowData.local !== '') {
        let data
        if (rowData.local === 'true' || rowData.local === 'Y') {
          data = 'Y'
        } else if (rowData.local === 'false' || rowData.local === 'N') {
          data = 'N'
        }
        return (
          // <Select
          //   value={rowData && (rowData.local ? rowData.local : null)}
          //   // onChange={(e) => eventHandleDetailsSOT(e)}
          //   onChange={(e: any) => {
          //     if (e.target.value !== null) {
          //       setImportedData((prevState: any) => {
          //         return onChangeProductTableFields(
          //           prevState,
          //           'local',
          //           rowData,
          //           e.target.value
          //         )
          //       })
          //     }
          //   }}
          //   input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
          // >
          //   {yesOrNo.map((type: any) => {
          //     return (
          //       <MenuItem
          //         value={type.name}
          //         key={type.name}
          //         className={classes.muiSelect}
          //       >
          //         {type.text}
          //       </MenuItem>
          //     )
          //   })}
          // </Select>
          <>{data}</>
        )
      } else {
        return <>NA</>
      }
    }
  }
  const onlineCFCTemplate = (rowData: any) => {
    if (
      rowData.actionType === newIngredientMin ||
      rowData.actionType === placeholderMin ||
      rowData.actionType === delistIngredientMin ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else {
      if (
        rowData &&
        rowData.hasOwnProperty('onlineCFC') &&
        rowData.onlineCFC !== ''
      ) {
        let data
        if (rowData.onlineCFC === 'true' || rowData.onlineCFC === 'Y') {
          data = 'Y'
        } else if (rowData.onlineCFC === 'false' || rowData.onlineCFC === 'N') {
          data = 'N'
        }
        return (
          // <Select
          //   value={rowData && (rowData.onlineCFC ? rowData.onlineCFC : null)}
          //   // onChange={(e) => eventHandleDetailsSOT(e)}
          //   onChange={(e: any) => {
          //     if (e.target.value !== null) {
          //       setImportedData((prevState: any) => {
          //         return onChangeProductTableFields(
          //           prevState,
          //           'onlineCFC',
          //           rowData,
          //           e.target.value
          //         )
          //       })
          //     }
          //   }}
          //   input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
          // >
          //   {yesOrNo.map((type: any) => {
          //     return (
          //       <MenuItem
          //         value={type.name}
          //         key={type.name}
          //         className={classes.muiSelect}
          //       >
          //         {type.text}
          //       </MenuItem>
          //     )
          //   })}
          // </Select>
          <>{data}</>
        )
      } else {
        return <></>
      }
    }
  }
  const onlineStorePickTemplate = (rowData: any) => {
    if (
      rowData.actionType === newIngredientMin ||
      rowData.actionType === placeholderMin ||
      rowData.actionType === delistIngredientMin ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else {
      if (
        rowData &&
        rowData.hasOwnProperty('onlineStorePick') &&
        rowData.onlineStorePick !== ''
      ) {
        let data
        if (
          rowData.onlineStorePick === 'true' ||
          rowData.onlineStorePick === 'Y'
        ) {
          data = 'Y'
        } else if (
          rowData.onlineStorePick === 'false' ||
          rowData.onlineStorePick === 'N'
        ) {
          data = 'N'
        }
        return (
          // <Select
          //   value={
          //     rowData &&
          //     (rowData.onlineStorePick ? rowData.onlineStorePick : null)
          //   }
          //   // onChange={(e) => eventHandleDetailsSOT(e)}
          //   onChange={(e: any) => {
          //     if (e.target.value !== null) {
          //       setImportedData((prevState: any) => {
          //         return onChangeProductTableFields(
          //           prevState,
          //           'onlineStorePick',
          //           rowData,
          //           e.target.value
          //         )
          //       })
          //     }
          //   }}
          //   input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
          // >
          //   {yesOrNo.map((type: any) => {
          //     return (
          //       <MenuItem
          //         value={type.name}
          //         key={type.name}
          //         className={classes.muiSelect}
          //       >
          //         {type.text}
          //       </MenuItem>
          //     )
          //   })}
          // </Select>
          <>{data}</>
        )
      } else {
        return <></>
      }
    }
  }
  const wholesaleTemplate = (rowData: any) => {
    if (
      rowData.actionType === newIngredientMin ||
      rowData.actionType === placeholderMin ||
      rowData.actionType === delistIngredientMin ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else {
      if (
        rowData &&
        rowData.hasOwnProperty('wholesale') &&
        rowData.wholesale !== ''
      ) {
        let data
        if (rowData.wholesale === 'true' || rowData.wholesale === 'Y') {
          data = 'Y'
        } else if (rowData.wholesale === 'false' || rowData.wholesale === 'N') {
          data = 'N'
        }
        return (
          // <span>{rowData && (rowData.wholesale ? rowData.wholesale : null)}</span>
          //   <Select
          //     value={rowData && (rowData.wholesale ? rowData.wholesale : null)}
          //     // onChange={(e) => eventHandleDetailsSOT(e)}
          //     onChange={(e: any) => {
          //       if (e.target.value !== null) {
          //         setImportedData((prevState: any) => {
          //           return onChangeProductTableFields(
          //             prevState,
          //             'wholesale',
          //             rowData,
          //             e.target.value
          //           )
          //         })
          //       }
          //     }}
          //     input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
          //   >
          //     {yesOrNo.map((type: any) => {
          //       return (
          //         <MenuItem
          //           value={type.name}
          //           key={type.name}
          //           className={classes.muiSelect}
          //         >
          //           {type.text}
          //         </MenuItem>
          //       )
          //     })}
          //   </Select>
          <>{data}</>
        )
      } else {
        return <></>
      }
    }
  }
  // const pinTemplate = () => {
  //     return <TextFieldWithSearch value={pin} onChangeFn={setPin} onSearch={console.log} />
  // }

  // const buyingMinIngredientsTemplate = () => {
  //     return <TextFieldWithSearch value={buyingMinIngredients} onChangeFn={setBuyingMinIngredients} onSearch={console.log} />
  // }

  const [xlslPlanogramimportedData, setXlslPlanogramimportedData] =
    useState<any>([])

  const onChangeProductTableFieldsPlano = (
    prevState: any,
    field: any,
    rowDataSelected: any,
    eventValue: any,
    fieldError: any
  ) => {
    let newArr = [...xlslPlanogramimportedData]
    let index = newArr.findIndex(
      (data: any) => data.min === rowDataSelected.min
    )
    if (index !== -1) {
      if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === delistProductMin &&
        rowDataSelected.newnoofrangestoresPlanogram > 0
      ) {
        newArr[index].actionTypePlanogram = eventValue
        newArr[index].showError = true
      } else if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === productDistributionIncreaseMin &&
        rowDataSelected.newnoofrangestoresPlanogram <
          newArr[index].currentnoofrangedstores
      ) {
        newArr[index].actionTypePlanogram = eventValue
        newArr[index].showError = true
      } else if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === productDistributionDecreaseMin &&
        rowDataSelected.newnoofrangestoresPlanogram >
          newArr[index].currentnoofrangedstores
      ) {
        newArr[index].actionTypePlanogram = eventValue
        newArr[index].showError = true
      } else if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === productShelfSpaceIncrease &&
        rowDataSelected.newShelfFillPlanogram < newArr[index].currentShelfFill
      ) {
        newArr[index].actionTypePlanogram = eventValue
        newArr[index].showError = true
      } else if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === productShelfSpaceDecrease &&
        rowDataSelected.newShelfFillPlanogram > newArr[index].currentShelfFill
      ) {
        newArr[index].actionTypePlanogram = eventValue
        newArr[index].showError = true
      } else {
        newArr[index].actionTypePlanogram = eventValue
        newArr[index].showError = false
      }
    }
    setXlslPlanogramimportedData(newArr)
    console.log('planoData onChangeProductTableFieldsPlano', newArr)
  }

  const actionTypePlanogramTemplate = (rowData: any) => {
    const check = selectedPlanogramItems.filter(
      (val: any) => rowData.min === val.min
    )

    if (editPlanoClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <Select
          value={rowData && rowData.actionTypePlanogram}
          onChange={(e: any) => {
            setXlslPlanogramimportedData((prevState: any) => {
              return onChangeProductTableFieldsPlano(
                prevState,
                'actionTypePlanogram',
                rowData,
                e.target.value,
                'showError'
              )
            })
          }}
          input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
        >
          {actionTypeOptions.map((type: any) => {
            if (
              type.value !== 'Multiple Selection' &&
              type.value !== supplyChange &&
              type.value !== newOutercaseCode &&
              type.value !== delistOutercaseCode &&
              type.value !== newIngredientMin &&
              type.value !== delistIngredientMin &&
              type.value !== placeholderMin
            ) {
              return (
                <MenuItem
                  value={type.value}
                  key={type.label}
                  className={classes.muiSelect}
                >
                  {type.value}
                  {/* { } */}
                  {/* <span></span> */}
                </MenuItem>
              )
            }
          })}
        </Select>
      )
    } else {
      return (
        <span>
          {rowData.actionTypePlanogram}{' '}
          {rowData.showError && (
            <>
              {finalRangeState &&
                (rowData.actionTypePlanogram === delistProductMin ||
                  rowData.actionTypePlanogram ===
                    productDistributionIncreaseMin ||
                  rowData.actionTypePlanogram ===
                    productDistributionDecreaseMin ||
                  rowData.actionTypePlanogram === productShelfSpaceIncrease ||
                  rowData.actionTypePlanogram ===
                    productShelfSpaceDecrease) && (
                  <LightTooltip
                    arrow
                    placement="right-start"
                    // className={classes.tooltipError}
                    style={{ color: 'white' }}
                    title={
                      <Typography variant="caption">
                        {rowData.actionTypePlanogram === delistProductMin &&
                          delistProductMinErrorMessage}
                        {rowData.actionTypePlanogram ===
                          productDistributionIncreaseMin && //productDistributionIncreaseMin
                          productDistributionIncreaseMinErrorMessage}
                        {rowData.actionTypePlanogram ===
                          productDistributionDecreaseMin &&
                          productDistributionDecreaseMinErrorMessage}
                        {rowData.actionTypePlanogram ===
                          productShelfSpaceIncrease &&
                          productShelfSpaceIncreaseErrorMessage}
                        {rowData.actionTypePlanogram ===
                          productShelfSpaceDecrease &&
                          productShelfSpaceDecreaseErrorMessage}
                      </Typography>
                    }
                  >
                    {/* <span className={classes.excli_mark_error}>!</span>
                     */}
                    <span>
                      <ErrorOutlinedIcon
                        className={classes.errorOutlinedIconErrorTableGrid}
                      />
                      {/* className={classes.errorOutlinedIconError} */}
                    </span>
                  </LightTooltip>
                )}
            </>
          )}
        </span>
      )
    }
  }

  const onChangeProductTableFieldsProductMain = (
    prevState: any,
    field: any,
    rowDataSelected: any,
    eventValue: any
  ) => {
    let newArr = [...importedData]
    let index = newArr.findIndex(
      (data: any) => data.min === rowDataSelected.min
    )
    if (index !== -1) {
      if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === delistProductMin &&
        rowDataSelected.numberOfRangeStores > 0
      ) {
        newArr[index].actionType = eventValue
        newArr[index].showErrorProduct = true
      } else if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === productDistributionIncreaseMin &&
        rowDataSelected.numberOfRangeStores <
          newArr[index].currentnoofrangedstores
      ) {
        newArr[index].actionType = eventValue
        newArr[index].showErrorProduct = true
      } else if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === productDistributionDecreaseMin &&
        rowDataSelected.numberOfRangeStores >
          newArr[index].currentnoofrangedstores
      ) {
        newArr[index].actionType = eventValue
        newArr[index].showErrorProduct = true
      } else if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === productShelfSpaceIncrease &&
        rowDataSelected.newShelfFill < newArr[index].currentShelfFill
      ) {
        newArr[index].actionType = eventValue
        newArr[index].showErrorProduct = true
      } else if (
        rowDataSelected.min == newArr[index].min &&
        eventValue === productShelfSpaceDecrease &&
        rowDataSelected.newShelfFill > newArr[index].currentShelfFill
      ) {
        newArr[index].actionType = eventValue
        newArr[index].showErrorProduct = true
      } else {
        newArr[index].actionType = eventValue
        newArr[index].showErrorProduct = false
      }
    }
    setImportedData(newArr)
    console.log('setImportedData newArr', newArr)
  }

  const actionTypeTemplate = (rowData: any) => {
    const check: any = supplierSelected.filter(
      (val: any) => rowData.min === val.min
    )
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      if (
        rafpendingActionDetailsCT06 &&
        rafpendingActionDetailsCT06.taskName.toLowerCase() === 'ct19' &&
        rowData.actionType === placeholderMin
      ) {
        return (
          <Select
            value={rowData && rowData.actionType}
            onChange={(e: any) => {
              // console.log('place change', rowData.min, rowData.min.charAt(0))
              // if (rowData.min.charAt(0) === '5' || rowData.min === '') {
              //   toast.current.show({
              //     severity: 'error',
              //     summary: 'Error',
              //     detail: 'Cannot change type of Item',
              //     life: life,
              //     className: 'login-toast',
              //   })
              //   return
              // } else {
              setImportedData((prevState: any) => {
                // return onChangeProductTableFields(
                //   prevState,
                //   'actionType',
                //   rowData,
                //   e.target.value
                // )
                if (showErrorAboveCT26()) {
                  return onChangeProductTableFieldsProductMain(
                    prevState,
                    'actionType',
                    rowData,
                    e.target.value
                  )
                } else {
                  return onChangeProductTableFields(
                    prevState,
                    'actionType',
                    rowData,
                    e.target.value
                  )
                }
              })
              // }
            }}
            input={
              <OutlinedInput margin="dense" className={classes.muiSelect} />
            }
          >
            {actionTypeListCT19 &&
              actionTypeListCT19.map((type: any) => {
                if (type.value !== 'Multiple Selection') {
                  return (
                    <MenuItem
                      value={type.value}
                      key={type.label}
                      className={classes.muiSelect}
                    >
                      {type.value}
                    </MenuItem>
                  )
                }
              })}
          </Select>
        )
      } else {
        return (
          <Select
            value={rowData && rowData.actionType}
            onChange={(e: any) => {
              // console.log('place change', rowData.min, rowData.min.charAt(0))
              // if (rowData.min.charAt(0) === '5' || rowData.min === '') {
              //   toast.current.show({
              //     severity: 'error',
              //     summary: 'Error',
              //     detail: 'Cannot change type of Item',
              //     life: life,
              //     className: 'login-toast',
              //   })
              //   return
              // } else {
              setImportedData((prevState: any) => {
                // return onChangeProductTableFields(
                //   prevState,
                //   'actionType',
                //   rowData,
                //   e.target.value
                // )
                if (showErrorAboveCT26()) {
                  return onChangeProductTableFieldsProductMain(
                    prevState,
                    'actionType',
                    rowData,
                    e.target.value
                  )
                } else {
                  return onChangeProductTableFields(
                    prevState,
                    'actionType',
                    rowData,
                    e.target.value
                  )
                }
              })
              // }
            }}
            input={
              <OutlinedInput margin="dense" className={classes.muiSelect} />
            }
          >
            {actionTypeOptions &&
              actionTypeOptions.map((type: any) => {
                // if (type.value !== 'Multiple Selection') {
                return (
                  <MenuItem
                    value={type.value}
                    key={type.label}
                    className={classes.muiSelect}
                  >
                    {type.value}
                  </MenuItem>
                )
                // }
              })}
          </Select>
        )
      }
    } else {
      return (
        <span>
          {rowData.actionType}{' '}
          {rowData.newAdded && (
            <>
              {/* {finalRangeState && <span className={classes.excli_mark}>!</span>} */}
              {newlyAddedTitle && (
                // <ErrorRoundedIcon
                //   className={classes.errorRoundedIconTableGrid}
                // />
                <ErrorTwoToneIcon
                  className={classes.errorRoundedIconTableGrid}
                />
              )}
            </>
          )}
          {rowData.showErrorProduct && (
            <>
              {/* {finalRangeState && */}
              {true &&
                (rowData.actionType === delistProductMin ||
                  rowData.actionType === productDistributionIncreaseMin ||
                  rowData.actionType === productDistributionDecreaseMin ||
                  rowData.actionType === productShelfSpaceIncrease ||
                  rowData.actionType === productShelfSpaceDecrease) && (
                  <LightTooltip
                    arrow
                    placement="right-start"
                    // className={classes.tooltipError}
                    style={{ color: 'white' }}
                    title={
                      <Typography variant="caption">
                        {rowData.actionType === delistProductMin &&
                          delistProductMinErrorMessage}
                        {rowData.actionType ===
                          productDistributionIncreaseMin && //productDistributionIncreaseMin
                          productDistributionIncreaseMinErrorMessage}
                        {rowData.actionType ===
                          productDistributionDecreaseMin &&
                          productDistributionDecreaseMinErrorMessage}
                        {rowData.actionType === productShelfSpaceIncrease &&
                          productShelfSpaceIncreaseErrorMessage}
                        {rowData.actionType === productShelfSpaceDecrease &&
                          productShelfSpaceDecreaseErrorMessage}
                      </Typography>
                    }
                  >
                    {/* <span className={classes.excli_mark_error}>!</span>
                     */}
                    <span>
                      <ErrorOutlinedIcon
                        className={classes.errorOutlinedIconErrorTableGrid}
                      />
                      {/* className={classes.errorOutlinedIconError} */}
                    </span>
                  </LightTooltip>
                )}
            </>
          )}
        </span>
      )
    }
  }

  const lineStatusTemplate = (rowData: any) => {
    return (
      <Select
        value={rowData && (rowData.lineStatus ? rowData.lineStatus : null)}
        onChange={(e: any) =>
          setImportedData((prevState: any) =>
            onChangeProductTableFields(
              prevState,
              'lineStatus',
              rowData,
              e.target.value
            )
          )
        }
        input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
      >
        {lineStatusOptions.map((type) => {
          if (
            rowData.actionType === delistProductMin ||
            rowData.actionType === productDistributionDecreaseMin
          ) {
            if (
              rowData.lineStatus === 'Request For Stock Count' ||
              rowData.lineStatus === bulkActionTypes.confirmedAction
            ) {
              return (
                <MenuItem value={type.value} key={type.value}>
                  {type.label}
                </MenuItem>
              )
            } else {
              if (type.value === bulkActionTypes.cancelAction) {
                return (
                  <MenuItem value={type.value} key={type.value} disabled>
                    {type.label}
                  </MenuItem>
                )
              } else {
                return (
                  <MenuItem value={type.value} key={type.value}>
                    {type.label}
                  </MenuItem>
                )
              }
            }
          } else {
            if (type.value === 'Request For Stock Count') {
              return (
                <MenuItem value={type.value} key={type.value} disabled>
                  {type.label}
                </MenuItem>
              )
            } else {
              return (
                <MenuItem value={type.value} key={type.value}>
                  {type.label}
                </MenuItem>
              )
            }
          }
        })}
      </Select>
    )
  }
  const descriptionImportedTemplate = (rowData: any) => {
    // if (actionType.value === 'CT18') {
    // }

    // const check = supplierSelected.filter((val: any) => rowData.min === val.min)

    // if (editClick && check.length > 0 && check[0].min === rowData.min) {
    //   return (
    //     <DelistInputEdit
    //       rowData={rowData}
    //       setImportedData={setImportedData}
    //       onChangeProductTableFields={onChangeProductTableFields}
    //       field={'description'}
    //     />
    //   )
    // } else {
    //   return <>{rowData && rowData.description}</>
    // }
    return <>{rowData && rowData.description}</>
  }

  const legacyItemNumbersImportedTemplate = (rowData: any) => {
    // const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    // if (editClick && check.length > 0 && check[0].min === rowData.min) {
    //   return (
    //     // <OutlinedInput
    //     //   value={rowData && rowData.legacyItemNumbers}
    //     //   onChange={(e: any) => {
    //     //     setImportedData((prevState: any) => {
    //     //       return onChangeProductTableFields(
    //     //         prevState,
    //     //         'legacyItemNumbers',
    //     //         rowData,
    //     //         e.target.value
    //     //       )
    //     //     })
    //     //   }}
    //     //   className={classes.tableTextField}
    //     // />
    //     <DelistInputEdit
    //       rowData={rowData}
    //       setImportedData={setImportedData}
    //       onChangeProductTableFields={onChangeProductTableFields}
    //       field={'legacyItemNumbers'}
    //     />
    //   )
    // } else {
    //   return <>{rowData && rowData.legacyItemNumbers}</>
    // }
    // let legacyArray=''
    // if(rowData.length>0){
    //    legacyArray = rowData && rowData.legacyItemNumbers.join()
    //   console.log(legacyArray)
    // }
    // else{
    //   legacyArray = rowData && rowData.legacyItemNumbers
    // }
    // if (
    //   rowData &&
    //   rowData.actionType !== placeholderMin &&
    //   rowData.actionType !== supplyChange
    // ) {
    //   return <>{rowData && rowData.legacyItemNumbers}</>
    // } else
    if (
      rowData.actionType === placeholderMin ||
      rowData.actionType === supplyChange ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode
    ) {
      return <>NA</>
    } else {
      return <>{rowData && rowData.legacyItemNumbers}</>
    }
  }
  const manImportedTemplate = (rowData: any) => {
    // if (rowData && rowData.hasOwnProperty('man') && rowData.man) {
    //   if (
    //     rowData.actionType !== placeholderMin &&
    //     rowData.actionType !== supplyChange
    //   ) {
    //     return <>{rowData && rowData.man}</>
    //   } else {
    //     return <>NA</>
    //   }
    // } else {
    // }
    if (
      rowData.actionType === placeholderMin ||
      rowData.actionType === supplyChange ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode
    ) {
      return <>NA</>
    } else {
      return <>{rowData && rowData.man}</>
    }
  }
  const caseCostImportedTemplate = (rowData: any) => {
    // const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    // if (editClick && check.length > 0 && check[0].min === rowData.min) {
    //   return (
    //     <DelistInputEdit
    //       rowData={rowData}
    //       setImportedData={setImportedData}
    //       onChangeProductTableFields={onChangeProductTableFields}
    //       field={'casecost'}
    //     />
    //   )
    // } else {
    //   return <>{rowData && rowData.casecost}</>
    // }
    console.log(rowData)
    if (
      rowData.actionType === supplyChange ||
      rowData.actionType === placeholderMin
    ) {
      return <>NA</>
    } else {
      return <>{rowData && rowData.casecost}</>
    }
  }
  const packQuantityImportedTemplate = (rowData: any) => {
    // const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    // if (editClick && check.length > 0 && check[0].min === rowData.min) {
    //   return (
    //     <DelistInputEdit
    //       rowData={rowData}
    //       setImportedData={setImportedData}
    //       onChangeProductTableFields={onChangeProductTableFields}
    //       field={'packquantity'}
    //     />
    //   )
    // } else {
    //   return <>{rowData && rowData.packquantity}</>
    // }
    if (rowData.actionType === supplyChange) {
      return <>NA</>
    } else {
      return <>{rowData && rowData.packquantity}</>
    }
  }
  const replaceMinDescriptionImportedTemplate = (rowData: any) => {
    // const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    // if (editClick && check.length > 0 && check[0].min === rowData.min) {
    //   return (
    //     <DelistInputEdit
    //       rowData={rowData}
    //       setImportedData={setImportedData}
    //       onChangeProductTableFields={onChangeProductTableFields}
    //       field={'replaceMinDescription'}
    //     />
    //   )
    // } else {
    //   return <>{rowData && rowData.replaceMinDescription}</>
    // }

    if (
      rowData.actionType === delistProductMin ||
      rowData.actionType === delistIngredientMin ||
      rowData.actionType === delistOutercaseCode
    ) {
      return <>{rowData && rowData.replaceMinDescription}</>
    } else {
      return <>NA</>
    }

    // return <>{rowData && rowData.replaceMinDescription}</>
  }
  const replaceMinImportedTemplate = (rowData: any) => {
    // const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    // if (editClick && check.length > 0 && check[0].min === rowData.min) {
    //   return (
    //     <DelistInputEdit
    //       rowData={rowData}
    //       setImportedData={setImportedData}
    //       onChangeProductTableFields={onChangeProductTableFields}
    //       field={'replaceMinDescription'}
    //     />
    //   )
    // } else {
    //   return <>{rowData && rowData.replaceMinDescription}</>
    // }
    if (
      rowData &&
      (rowData.actionType === newIngredientMin ||
        rowData.actionType === productShelfSpaceDecrease ||
        rowData.actionType === productShelfSpaceIncrease ||
        rowData.actionType === placeholderMin ||
        rowData.actionType === newOutercaseCode ||
        rowData.actionType === newProductMin ||
        rowData.actionType === productDistributionDecreaseMin ||
        rowData.actionType === supplyChange)
    ) {
      return <>NA</>
    } else {
      return <>{rowData && rowData.replaceMin}</>
    }
  }

  const handleRangeStoresDialogOpen = (rowData: any, view: any) => {
    setRangedStoresDialogOpen(true)
    // setRangedStoresData(rowData)
    // setRangedStoresData(rowData)
    getStoreDepot(rowData, 'store')
    setViewTemplateName(view)
    //setRangedStoresData(storeViewDummyRes.storeView)
    // getRangeByIdAndMinNumber("rangerestId", "Minnumber")
    // .then((res:any) => {
    //   console.log("success view")
    //   if(res.hasOwnProperty("storeView")){
    //     setStoreViewApi(res.storeView)
    //   } else {
    //     setStoreViewApi([])
    //   }
    // }).catch((err:any) => {
    //   console.log("error store view")
    // })
  }

  const currentshelffill_vs_newfillTemplate = (rowData: any) => {
    if (
      rowData &&
      (rowData.actionType === productShelfSpaceDecrease ||
        rowData.actionType === productShelfSpaceIncrease ||
        rowData.actionType === productDistributionDecreaseMin ||
        rowData.actionType === productDistributionIncreaseMin)
    ) {
      if (rowData.currentVsNewShelfFill) {
        return (
          <>
            <div
              className={classes.tableLinks}
              onClick={() =>
                handleRangeStoresDialogOpen(
                  rowData,
                  'Current Shelf Fill Vs New Fill'
                )
              }
            >
              {rowData && rowData.currentVsNewShelfFill}
            </div>
          </>
        )
      } else {
        return <></>
      }
    } else {
      return <></>
    }
  }

  const currentshelffill_vs_newfill_percantTemplate = (rowData: any) => {
    // const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    // if (editClick && check.length > 0 && check[0].min === rowData.min) {
    //   return (
    //     <DelistInputEdit
    //       rowData={rowData}
    //       setImportedData={setImportedData}
    //       onChangeProductTableFields={onChangeProductTableFields}
    //       field={'replaceMinDescription'}
    //     />
    //   )
    // } else {
    //   return <>{rowData && rowData.replaceMinDescription}</>
    // }
    // console.log(rowData.actionType)
    if (
      rowData &&
      (rowData.actionType === productShelfSpaceDecrease ||
        rowData.actionType === productShelfSpaceIncrease ||
        rowData.actionType === productDistributionDecreaseMin ||
        rowData.actionType === productDistributionIncreaseMin)
    ) {
      if (rowData.currentVsNewShelfFillPercent) {
        return <>{rowData && rowData.currentVsNewShelfFillPercent}</>
      } else {
        return <></>
      }
    } else {
      return <></>
    }
  }

  const currentShelfFillTemplate = (rowData: any) => {
    if (
      rowData &&
      (rowData.actionType === productShelfSpaceDecrease ||
        rowData.actionType === productShelfSpaceIncrease ||
        rowData.actionType === productDistributionDecreaseMin ||
        rowData.actionType === productDistributionIncreaseMin ||
        rowData.actionType === delistProductMin)
    ) {
      if (rowData.currentShelfFill) {
        return (
          <div
            className={classes.tableLinks}
            onClick={() =>
              handleRangeStoresDialogOpen(rowData, 'Current Shelf Fill (Units)')
            }
          >
            {rowData && rowData.currentShelfFill}
          </div>
        )
      } else {
        return <></>
      }
    } else {
      return <>NA</>
    }
  }

  const unitretailIncImportedTemplate = (rowData: any) => {
    if (
      (rowData && rowData.actionType === placeholderMin) ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else {
      return <></>
    }
  }
  const unitretailExImportedTemplate = (rowData: any) => {
    if (
      (rowData && rowData.actionType === placeholderMin) ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else {
      return <></>
    }
  }

  const unitCostImportedTemplate = (rowData: any) => {
    if (
      rowData.actionType === supplyChange ||
      rowData.actionType === placeholderMin
    ) {
      return <>NA</>
    } else {
      return <>{rowData && rowData.unitcost}</>
    }
  }
  const perStorepPerWeekImportedTemplate = (rowData: any) => {
    // if (rowData.actionType !== placeholderMin) {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <OutlinedInput
          value={rowData && rowData.perStorepPerWeek}
          onChange={(e: any) => {
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'perStorepPerWeek',
                rowData,
                e.target.value
              )
            })
          }}
          className={classes.tableTextField}
        />
      )
    } else {
      return <>{rowData && rowData.perStorepPerWeek}</>
    }
    // }
    // else {
    //   //return <>NA</>
    //   return <>{rowData && rowData.perStorepPerWeek}</>
    // }
  }

  const includeInClearancePricingTemplate = (rowData: any) => {
    // if (rowData && rowData.includeInClearancePricing === 'Y') {
    // if (rowData.actionType === 'Delist Product (MIN)') {
    // return (
    //   <Select
    //     value={rowData && rowData.includeInClearancePricing}
    //     onChange={(e: any) =>
    //       setImportedData((prevState: any) =>
    //         onChangeProductTableFields(
    //           prevState,
    //           'includeInClearancePricing',
    //           rowData,
    //           e.target.value
    //         )
    //       )
    //     }
    //     input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
    //   >
    //     {clearancePricingOptions.map((type) => {
    //       return (
    //         <MenuItem value={type.value} key={type.value}>
    //           {type.label}
    //         </MenuItem>
    //       )
    //     })}
    //   </Select>
    // )
    if (
      rowData.actionType === placeholderMin ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === delistIngredientMin ||
      rowData.actionType === productShelfSpaceDecrease ||
      rowData.actionType === newIngredientMin ||
      rowData.actionType === productShelfSpaceIncrease ||
      rowData.actionType === productDistributionIncreaseMin ||
      rowData.actionType === supplyChange ||
      rowData.actionType === newProductMin
    ) {
      return <></>
    } else {
      return <>{rowData && rowData.includeInClearancePricing}</>
    }

    // } else {
    //   return <>{rowData.includeInClearancePricing}</>
    // }
    // } else {
    //   return <></>
    // }
  }
  const clearDepotByTemplate = (rowData: any) => {
    if (
      rowData &&
      (rowData.actionType === placeholderMin ||
        rowData.actionType === newOutercaseCode ||
        rowData.actionType === productShelfSpaceDecrease ||
        rowData.actionType === newIngredientMin ||
        rowData.actionType === productShelfSpaceIncrease ||
        rowData.actionType === newProductMin ||
        rowData.actionType === productDistributionIncreaseMin ||
        rowData.actionType === productDistributionDecreaseMin ||
        rowData.actionType === supplyChange)
    ) {
      return <></>
    } else {
      return (
        <Select
          value={rowData && rowData.clearDepotBy}
          // onChange={(e) => eventHandleDetailsSOT(e)}
          onChange={(e: any) => {
            if (e.target.value !== null) {
              setImportedData((prevState: any) => {
                return onChangeProductTableFields(
                  prevState,
                  'clearDepotBy',
                  rowData,
                  e.target.value
                )
              })
            }
          }}
          placeholder="Select a value"
          // input={
          //   <OutlinedInput
          //     margin="dense"
          //     className={classes.muiSelect}
          //     placeholder="Select a value"
          //   />
          // }
        >
          {/* <MenuItem
            value={'Week-4'}
            // key={type.name}
            className={classes.muiSelect}
          >
            Week - 4
          </MenuItem>

          <MenuItem
            value={'Week-5'}
            // key={type.name}
            className={classes.muiSelect}
          >
            Week - 5
          </MenuItem> */}
          {clearDepotByOptions.map((op: any) => {
            return (
              <MenuItem
                value={op.value}
                key={op.value}
                className={classes.muiSelect}
              >
                {op.label}
              </MenuItem>
            )
          })}
        </Select>
      )
    }
  }

  // useEffect(() => {
  //   const systemDate = new Date().toISOString().split('T')[0]
  //   const systemDate1 = new Date()
  //   console.log(systemDate)
  //   console.log(systemDate1)
  //   console.log(systemDate1.getMonth() + 1)
  //   const systemDate2 = `${systemDate1.getDate() + 1}-${
  //     systemDate1.getMonth() + 1
  //   }-${systemDate1.getFullYear()}`
  //   console.log(systemDate2)
  // })

  const effectiveDateFromProductTableTemplate = (rowData: any) => {
    const systemDate = new Date()

    const systemDate1 = systemDate.setDate(systemDate.getDate() + 1)

    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DatePicker
          format="dd/MM/yy"
          value={
            rowData &&
            (rowData['effectiveDateFrom'] ? rowData['effectiveDateFrom'] : null)
          }
          onChange={(date: any) => {
            let newDate = date.toISOString().split('T')[0]
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'effectiveDateFrom',
                rowData,
                newDate
              )
            })
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'effectiveDateTo',
                rowData,
                null
              )
            })
          }}
          TextFieldComponent={(props: any) => (
            <OutlinedInput
              margin="dense"
              onClick={props.onClick}
              value={props.value}
              onChange={props.onChange}
              // className={classes.dateFields}
            />
          )}
          maxDate={
            rafpendingActionDetailsCT06 &&
            eventDetails &&
            eventDetails[0].targetDate.split(' ')
          }
          minDate={systemDate1}
        />
      )
    } else {
      return (
        <>
          {/* {rowData &&
            rowData.effectiveDateFrom.split(' ')[0].replaceAll('-', '/')} */}
          {rowData &&
            rowData.effectiveDateFrom &&
            rowData.effectiveDateFrom.split(' ')[0].replaceAll('-', '/')}
        </>
      )
    }

    // } else {
    //   return <>NA</>
    // }
  }
  const effectiveDateToProductTableTemplate = (rowData: any) => {
    let systemDate1 = null
    if (rowData && rowData['effectiveDateFrom']) {
      const systemDate = new Date(rowData['effectiveDateFrom'].split(' '))
      systemDate1 = systemDate.setDate(systemDate.getDate() + 1)
    }
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DatePicker
          format="dd/MM/yy"
          value={
            rowData &&
            (rowData['effectiveDateTo'] ? rowData['effectiveDateTo'] : null)
          }
          onChange={(date: any) => {
            let newDate = date.toISOString().split('T')[0]
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'effectiveDateTo',
                rowData,
                newDate
              )
            })
          }}
          TextFieldComponent={(props: any) => (
            <OutlinedInput
              margin="dense"
              onClick={props.onClick}
              value={props.value}
              onChange={props.onChange}
              // className={classes.dateFields}
            />
          )}
          disabled={rowData && rowData['effectiveDateFrom'] ? false : true}
          minDate={
            // rowData &&
            // rowData['effectiveDateFrom'] &&
            systemDate1 && systemDate1
            // rowData['effectiveDateFrom'].split(' ')
          }
        />
      )
    } else {
      return (
        <>
          {rowData &&
            rowData.effectiveDateTo &&
            rowData.effectiveDateTo.split(' ')[0].replaceAll('-', '/')}
        </>
      )
    }
  }
  const finalStopOrderDateTemplate = (rowData: any) => {
    // if (
    //   rowData &&
    //   rowData.hasOwnProperty('finalStopOrderDate') &&
    //   rowData.finalStopOrderDate !== ''
    // ) {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DatePicker
          format="dd/MM/yy"
          value={
            rowData &&
            (rowData['finalStopOrderDate']
              ? rowData['finalStopOrderDate']
              : null)
          }
          onChange={(date: any) => {
            let newDate = date.toISOString().split('T')[0]
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'finalStopOrderDate',
                rowData,
                newDate
              )
            })
          }}
          TextFieldComponent={(props: any) => (
            <OutlinedInput
              margin="dense"
              onClick={props.onClick}
              value={props.value}
              onChange={props.onChange}
              // className={classes.dateFields}
            />
          )}
        />
      )
    } else {
      return <>{rowData && rowData.finalStopOrderDate}</>
    }

    // } else {
    //   return <>NA</>
    // }
  }
  const systemGeneratedStopOrderDateTemplate = (rowData: any) => {
    if (
      rowData &&
      // rowData.actionType === delistProductMin &&
      rowData.hasOwnProperty('systemSuggestedStopOrderDate') &&
      rowData.systemSuggestedStopOrderDate !== '' &&
      (rowData.actionType === delistProductMin ||
        rowData.actionType === delistOutercaseCode ||
        rowData.actionType === delistIngredientMin)
    ) {
      return (
        <DatePicker
          format="dd/MM/yy"
          value={
            rowData &&
            (rowData['systemSuggestedStopOrderDate']
              ? rowData['systemSuggestedStopOrderDate']
              : null)
          }
          onChange={(date: any) => {
            let newDate = date.toISOString().split('T')[0]
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'systemSuggestedStopOrderDate',
                rowData,
                newDate
              )
            })
          }}
          TextFieldComponent={(props: any) => (
            <OutlinedInput
              margin="dense"
              onClick={props.onClick}
              value={props.value}
              onChange={props.onChange}
              // className={classes.dateFields}
            />
          )}
        />
      )
    } else if (rowData.actionType === supplyChange) {
      return <></>
    } else {
      return <>NA</>
    }
  }

  const weeksCoveronTotalStockTemplate = (rowData: any) => {
    if (
      rowData.actionType === newProductMin ||
      rowData.actionType === newIngredientMin ||
      rowData.actionType === placeholderMin ||
      rowData.actionType === supplyChange
    ) {
      return <></>
    } else if (
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode
    ) {
      return <>NA</>
    } else {
      return <>{rowData.weeksCoveronTotalStockonHandtoResetDate}</>
    }
  }

  const forcastedWeeksCovertoResetDateTemplate = (rowData: any) => {
    if (
      rowData &&
      (rowData.actionType === placeholderMin ||
        rowData.actionType === newOutercaseCode ||
        rowData.actionType === delistOutercaseCode ||
        rowData.actionType === supplyChange)
    ) {
      return <>NA</>
    } else if (
      rowData.actionType === newProductMin ||
      rowData.actionType === newIngredientMin
    ) {
      return <></>
    } else {
      return <>{rowData.forcastedWeeksCovertoResetDate}</>
    }
  }

  const excessStockTemplate = (rowData: any) => {
    if (
      rowData.actionType === placeholderMin ||
      rowData.actionType === newProductMin ||
      rowData.actionType === newIngredientMin
    ) {
      return <></>
    } else if (
      rowData.actionType === supplyChange ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === newOutercaseCode
    ) {
      return <>NA</>
    } else {
      return <>{rowData.excessstock}</>
    }
  }
  const averageWeeklyVolumeTemplate = (rowData: any) => {
    if (
      rowData.actionType === placeholderMin ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else if (
      rowData.actionType === newIngredientMin ||
      rowData.actionType === newProductMin
    ) {
      return <></>
    } else {
      return <>{rowData.averageWeeklyVolume}</>
    }
  }

  const forwardForecastToLaunchTemplate = (rowData: any) => {
    if (
      rowData.actionType === placeholderMin ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else if (
      rowData.actionType === newProductMin ||
      rowData.actionType === newIngredientMin
    ) {
      return <></>
    } else {
      return <>{rowData.averageWeeklyVolume}</>
    }
  }

  const storeStockUnitTemplate = (rowData: any) => {
    if (
      rowData &&
      (rowData.actionType === placeholderMin ||
        rowData.actionType === newOutercaseCode ||
        rowData.actionType === delistOutercaseCode ||
        rowData.actionType === supplyChange)
    ) {
      return <>NA</>
    } else if (
      rowData.actionType === newProductMin ||
      rowData.actionType === newIngredientMin
    ) {
      return <></>
    } else {
      return <>{rowData.storeStockUnit}</>
    }
  }
  const totalstockTemplate = (rowData: any) => {
    if (
      (rowData && rowData.actionType === placeholderMin) ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else if (
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === newProductMin ||
      rowData.actionType === newIngredientMin
    ) {
      return <></>
    } else {
      return <>{rowData.totalstock}</>
    }
  }

  const ownBrandTemplate = (rowData: any) => {
    if (rowData && rowData.actionType === placeholderMin) {
      return <></>
    } else if (
      rowData &&
      (rowData.actionType === newOutercaseCode ||
        rowData.actionType === supplyChange)
      // rowData.actionType === delistOutercaseCode)
    ) {
      return <>NA</>
    } else {
      return <>{rowData.ownBrand}</>
    }
  }
  const openPosTemplate = (rowData: any) => {
    if (rowData && rowData.actionType === placeholderMin) {
      return <>NA</>
    } else if (rowData && rowData.actionType === newIngredientMin) {
      return <></>
    } else {
      return <>{rowData.openPos}</>
    }
  }
  const shelfLifeatManufactureTemplate = (rowData: any) => {
    if (rowData && rowData.actionType === supplyChange) {
      return <>NA</>
    } else if (
      rowData &&
      (rowData.actionType === newIngredientMin ||
        rowData.actionType === newOutercaseCode ||
        rowData.actionType === newProductMin ||
        rowData.actionType === placeholderMin)
    ) {
      return <></>
    } else {
      return <>{rowData.shelfLifeatManufacture}</>
    }
  }
  const safewaybrandedequivalentTemplate = (rowData: any) => {
    if (
      rowData &&
      (rowData.actionType === supplyChange ||
        rowData.actionType === newOutercaseCode ||
        rowData.actionType === delistOutercaseCode)
    ) {
      return <>NA</>
    } else if (rowData && rowData.actionType === placeholderMin) {
      return <></>
    } else {
      return <>{rowData.safewaybrandedequivalent}</>
    }
  }

  const depotShelfLifeImportedTemplate = (rowData: any) => {
    if (rowData.actionType === supplyChange) {
      return <>NA</>
    } else {
      return <>{rowData.depotShelfLifeMinimum}</>
    }
  }

  const productShelfLifeImportedTemplate = (rowData: any) => {
    if (
      rowData.actionType === supplyChange ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === newOutercaseCode
    ) {
      return <>NA</>
    } else {
      return <>{rowData.productShelfLifeInstore}</>
    }
  }

  const lastPoDateTemplate = (rowData: any) => {
    if (
      rowData &&
      rowData.hasOwnProperty('lastPoDate') &&
      rowData.actionType === delistProductMin
    ) {
      // if (rowData.actionType === delistProductMin) {
      // return (
      //   <DatePicker
      //     format="dd/MM/yy"
      //     value={
      //       rowData && (rowData['lastPoDate'] ? rowData['lastPoDate'] : null)
      //     }
      //     onChange={(date: any) => {
      //       let newDate = date.toISOString().split('T')[0]
      //       setImportedData((prevState: any) => {
      //         return onChangeProductTableFields(
      //           prevState,
      //           'lastPoDate',
      //           rowData,
      //           newDate
      //         )
      //       })
      //     }}
      //     TextFieldComponent={(props: any) => (
      //       <OutlinedInput
      //         margin="dense"
      //         onClick={props.onClick}
      //         value={props.value}
      //         onChange={props.onChange}
      //         // className={classes.dateFields}
      //       />
      //     )}
      //   />
      // )
      // } else {
      //   return <>{rowData.lastPoDate}</>
      // }
      return <>{rowData.lastPoDate}</>
    } else if (rowData.actionType === placeholderMin) {
      return <>NA</>
    } else {
      return <></>
    }
  }
  // const includeInStoreWastageTemplate = (rowData: any) => {
  //   if (
  //     rowData &&
  //     rowData.hasOwnProperty('includeInStoreWastage') &&
  //     rowData.includeInStoreWastage
  //   ) {
  //     // if (rowData.actionType === delistProductMin) {
  //     return (
  //       <Checkbox
  //         className={classes.disabled_color}
  //         disabled
  //         checked={rowData.includeInStoreWastage}
  //         color="primary"
  //         onChange={(e: any) => {
  //           setImportedData((prevState: any) =>
  //             onChangeProductTableFields(
  //               prevState,
  //               'includeInStoreWastage',
  //               rowData,
  //               e.target.checked
  //             )
  //           )
  //         }}
  //         inputProps={{ 'aria-label': 'primary checkbox' }}
  //       />
  //     )
  //     // } else {
  //     //   return <>{rowData.includeInStoreWastage}</>
  //     // }
  //   } else {
  //     return <></>
  //   }
  // }
  const includeInStoreWastageTemplate = (rowData: any) => {
    // if (
    //   rowData &&
    //   rowData.includeInStoreWastage
    // ) {
    //   // if (rowData.actionType === delistProductMin) {
    //   return (
    //     <Checkbox
    //       className={classes.disabled_color}
    //       disabled
    //       checked={rowData.includeInStoreWastage}
    //       color="primary"
    //       onChange={(e: any) => {
    //         setImportedData((prevState: any) =>
    //           onChangeProductTableFields(
    //             prevState,
    //             'includeInStoreWastage',
    //             rowData,
    //             e.target.checked
    //           )
    //         )
    //       }}
    //       inputProps={{ 'aria-label': 'primary checkbox' }}
    //     />
    //   )
    // } else {

    if (
      rowData.actionType === placeholderMin ||
      rowData.actionType === newOutercaseCode ||
      rowData.actionType === delistOutercaseCode ||
      rowData.actionType === delistIngredientMin ||
      rowData.actionType === productShelfSpaceDecrease ||
      rowData.actionType === newIngredientMin ||
      rowData.actionType === productShelfSpaceIncrease ||
      rowData.actionType === productDistributionIncreaseMin ||
      rowData.actionType === supplyChange ||
      rowData.actionType === newProductMin
    ) {
      return <></>
    } else {
      return <>{rowData && rowData.includeInStoreWastage}</>
    }
    // }
    // } else {
    //   return <></>
    // }
  }
  const CT36IncludeInStoreWastageTemplate = (rowData: any) => {
    if (
      rowData &&
      rowData.hasOwnProperty('includeInStoreWastage') &&
      rowData.includeInStoreWastage
    ) {
      // if (rowData.actionType === delistProductMin) {
      return (
        <Checkbox
          className={classes.disabled_color}
          disabled={
            rafpendingActionDetailsCT06 &&
            rafpendingActionDetailsCT06.taskName.toLowerCase() !== 'ct36'
          }
          checked={rowData.includeInStoreWastage === 'Y'}
          color="primary"
          onChange={(e: any) => {
            setImportedData((prevState: any) =>
              onChangeProductTableFields(
                prevState,
                'includeInStoreWastage',
                rowData,
                e.target.checked ? 'Y' : 'N'
              )
            )
          }}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      )
    }
  }
  const supplierCommitmentTemplate = (rowData: any) => {
    // if (rowData && rowData.actionType !== placeholderMin) {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        // <OutlinedInput
        //   value={rowData && rowData.supplierCommitment}
        //   onChange={(e: any) => {
        //     setImportedData((prevState: any) => {
        //       return onChangeProductTableFields(
        //         prevState,
        //         'supplierCommitment',
        //         rowData,
        //         e.target.value
        //       )
        //     })
        //   }}
        //   className={classes.tableTextField}
        // />
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'supplierCommitment'}
        />
      )
    } else {
      return <>{rowData.supplierCommitment}</>
    }
    // }
    // else {
    //   return <>NA</>
    // }
  }
  const convertedTargetDateTemplate = (rowData: any) => {
    if (rowData.targetDate) {
      const date = new Date(rowData.targetDate)
      const formattedDate = date
        .toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        .replace(/ /g, '-')
      return formattedDate
    } else {
      return 'NA'
    }
  }
  const convertedAppDueDateTemplate = (rowData: any) => {
    if (rowData.appDueDate) {
      const date = new Date(rowData.appDueDate)
      const formattedDate = date
        .toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        .replace(/ /g, '-')
      // if (rowData.status === 'Error') {
      //   return <div style={{ color: 'red' }}>{formattedDate}</div>
      // } else {
      return formattedDate
      // }
    } else {
      return 'NA'
    }
  }
  const goBack = () => {
    history.goBack()
  }

  const [pinOpenDialog, setPinOpenDialog] = useState<any>(false)
  const [pinData, setPinData] = useState<any>()
  const [selectedPinData, setSelectedPinData] = useState<any>([])
  const [pinNumberSet, setPinNumberSet] = useState<any>()

  const handlePinDialogClose = () => {
    setPinOpenDialog(false)
    // setSelectedPinData([])
  }

  const handlePinDialogOpen = (rowData: any) => {
    console.log(rowData)
    setPinOpenDialog(true)
    setPinData([rowData])
    // setPinData(rowData.pinArray)
    setPinNumberSet(rowData.min)
  }
  const handleUpdatePin = (min: any) => {
    console.log('selectedPinMIN', min)
    console.log('selectedPinData', selectedPinData)
    console.log('IMPORTED', importedData)
    const data: any = []
    importedData.map((val: any) => {
      if (val.min === pinNumberSet) {
        val.pin = selectedPinData.packNumber
        val.packquantity = selectedPinData.packQuantity
        data.push(val)
      } else {
        data.push(val)
      }
    })
    setImportedData(data)
    setPinOpenDialog(false)
  }

  const pinProductListTemplate = (rowData: any) => {
    if (
      rowData &&
      rowData.actionType !== supplyChange &&
      rowData.actionType !== delistOutercaseCode &&
      rowData.actionType !== newOutercaseCode &&
      rowData.actionType !== placeholderMin
    ) {
      return (
        <>
          {rowData.pin ? (
            <div
              onClick={() => handlePinDialogOpen(rowData)}
              className={classes.tableLinks}
            >
              {rowData.pin !== '' ? rowData.pin : ''}
            </div>
          ) : (
            <div
              onClick={() => handlePinDialogOpen(rowData)}
              className={classes.tableLinks}
            >
              {rowData.pinArray && rowData.pinArray.length > 0
                ? rowData.pinArray[0].packNumber
                : ''}
            </div>
            // 'NA'
          )}

          {/* (
          'NA'
        )} */}
        </>
      )
    } else {
      return <>NA</>
    }
    // return (
    //   <>
    //     {true ? (
    //       <div
    //         onClick={() => handlePinDialogOpen(rowData)}
    //         className={classes.tableLinks}
    //       >
    //         100003047
    //       </div>
    //     ) : (
    //       'NA'
    //     )}
    //   </>
    // )
  }

  const pinDialogBox = (
    <Dialog open={pinOpenDialog} onClose={handlePinDialogClose} fullWidth>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader title={` PIN View`} onClose={handlePinDialogClose} />
        <Box
          sx={{
            p: 3,
          }}
        >
          <strong>{'MIN Number : ' + pinNumberSet}</strong>
          <DataTable
            // value={ingredientList}
            value={pinData}
            // value={pinTableDummyData}
            showGridlines
            className="p-datatable-sm"
            selectionMode="checkbox"
            selection={selectedPinData}
            onSelectionChange={(e: any) => {
              setSelectedPinData(e.value)
            }}
          >
            <Column
              selectionMode="single"
              headerStyle={{
                width: '50px',
                color: 'white',
                backgroundColor: teal[900],
              }}
            ></Column>
            {pinTableCols.map((col: any) => {
              return (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  bodyStyle={tableBodyStyle(col.width)}
                  headerStyle={tableHeaderStyle(
                    col.width,
                    theme.palette.primary.main
                  )}
                />
              )
            })}
          </DataTable>
        </Box>
        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        >
          <Button
            color="primary"
            variant="contained"
            // onClick={handleDelistIngredientMin}
            onClick={() => handleUpdatePin(pinNumberSet)}
            disabled={true}
          >
            Add Pin
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
  const [storeViewApi, setStoreViewApi] = useState<any>()
  const [storePopupHeader, setStorePopupHeader] = useState<any>('')
  const [depotRegions, setDepotRegions] = useState<any>([])

  useEffect(() => {
    console.log('depotRegions', depotRegions)
  }, [depotRegions])
  useEffect(() => {
    console.log('rafpendingActionDetailsCT06', rafpendingActionDetailsCT06)
    console.log('taskId', taskId)
  }, [rafpendingActionDetailsCT06])

  const getStoreDepot = (rowData: any, store: any) => {
    setIsProgressLoader(true)
    return (
      getRangeResetEventsStoreDepot(
        rafpendingActionDetailsCT06.eventId,
        rowData.min,
        store
      )
        // return getRangeResetEventsStoreDepot('1304', '100122267', store)
        .then((res: any) => {
          console.log('success view')

          if (res.data.hasOwnProperty('storeView') && store === 'store') {
            setStoreViewApi(res.data.storeView)
            setStorePopupHeader(res.data)
          } else {
            setStoreViewApi([])
            setStorePopupHeader('')
          }
          if (res.data.hasOwnProperty('depotView') && store === 'depot') {
            setDepotStockData(res.data.depotView)
            setDepotRegions(res.data.regions)
          } else {
            setDepotStockData([])
            setDepotRegions([])
          }
          if (res.data.hasOwnProperty('newStoreView') && store === 'store') {
            setNewStoreViewData(res.data.newStoreView)
            setStorePopupHeader(res.data)
          } else {
            setNewStoreViewData([])
            setStorePopupHeader('')
          }
          setIsProgressLoader(false)
        })
        .catch((err: any) => {
          setIsProgressLoader(false)
          console.log('error store view')
        })
    )
  }

  useEffect(() => {
    if (selectedProductListItems.length > 0) {
      for (let i = 0; i < selectedProductListItems.length; i++) {
        if (
          selectedProductListItems[i].actionType === delistProductMin ||
          selectedProductListItems[i].actionType === delistOutercaseCode ||
          selectedProductListItems[i].actionType === delistIngredientMin
        ) {
          console.log('goooooo')
          setReplacementCheck(false)
        } else {
          console.log('passss')
          setReplacementCheck(true)
          break
        }
      }
    }
  }, [selectedProductListItems])

  useEffect(() => {
    console.log('storeViewApi', storeViewApi)
  }, [storeViewApi])
  const handleRangeStoresDialogClose = () => {
    setRangedStoresDialogOpen(false)
    setRangedStoresData([])
    setStoreViewApi([])
    setStorePopupHeader('')
    setViewTemplateName('')
  }

  const rangeStoresDialog = (
    <Dialog
      open={rangedStoresDialogOpen}
      onClose={handleRangeStoresDialogClose}
      fullWidth
      classes={{
        paperFullWidth:
          // depotStockData && depotStockData.length > 0
          storeViewApi
            ? classes.rangeStoreDialogBox
            : classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          // title={`Current No. of Ranged Stores`}
          title={viewTemplateName && viewTemplateName}
          onClose={handleRangeStoresDialogClose}
        />
        <Box
          sx={{
            p: 2,
          }}
        >
          <table className={classes.tableMain}>
            <tr className={classes.table_th}>
              <th className={classes.table_tr_th}>Action/Type</th>
              <th className={classes.table_tr_th}>MIN</th>
              <th className={classes.table_tr_th}>Description</th>
            </tr>
            <tr>
              <td className={classes.table_tr_th}>
                {storePopupHeader && storePopupHeader.type}
              </td>
              <td className={classes.table_tr_th}>
                {storePopupHeader && storePopupHeader.itemNumber}
              </td>
              <td className={classes.table_tr_th}>
                {storePopupHeader && storePopupHeader.description}
              </td>
            </tr>
          </table>
        </Box>
        <Box
          sx={{
            p: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              // p: 1,
              justifyContent: 'space-between',
            }}
          >
            <span className="">
              <Button disabled className={classes.planview}>
                Plan View
              </Button>
              <Button className={classes.storeview}>Store View</Button>
            </span>
            <button
              className="backButton"
              // onClick={() =>
              //   exportExcel(storeViewApi, rangedStoresTableCols, 'StoresData')
              // }
              onClick={() =>
                viewTemplateName === 'New Number of Ranged Stores'
                  ? exportExcel(
                      newStoreViewData,
                      rangedStoresTableCols,
                      'StoresData'
                    )
                  : exportExcel(
                      storeViewApi,
                      rangedStoresTableCols,
                      'StoresData'
                    )
              }
            >
              Download
            </button>
          </Box>
          <DataTable
            // value={rangedStoresTableData}
            // value={rangedStoresData}
            value={
              viewTemplateName === 'New Number of Ranged Stores'
                ? newStoreViewData
                : storeViewApi
            }
            showGridlines
            className="p-datatable-sm"
            scrollable
            scrollHeight="400px"
          >
            {rangedStoresTableCols.map((col: any) => {
              return (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  bodyStyle={tableBodyStyle(col.width)}
                  headerStyle={tableHeaderStyle(
                    col.width,
                    theme.palette.primary.main
                  )}
                />
              )
            })}
          </DataTable>
        </Box>
      </Box>
    </Dialog>
  )

  useEffect(() => {
    console.log('new store view', newStoreViewData)
  }, [newStoreViewData])

  useEffect(() => {
    console.log('store view', storeViewApi)
  }, [storeViewApi])

  const currentNoOfRangeStoresTemplate = (rowData: any) => {
    //storeViewDummyRes
    if (
      rowData.actionType === delistProductMin ||
      rowData.actionType === productDistributionDecreaseMin ||
      rowData.actionType === productDistributionIncreaseMin ||
      rowData.actionType === productShelfSpaceDecrease ||
      rowData.actionType === productShelfSpaceIncrease
    ) {
      if (
        rowData &&
        rowData.hasOwnProperty('currentnoofrangedstores') &&
        rowData.currentnoofrangedstores !== 0
      ) {
        return (
          //  <Typography color="primary">
          <div
            className={classes.tableLinks}
            onClick={() =>
              handleRangeStoresDialogOpen(
                rowData,
                'Current No. of Ranged Stores'
              )
            }
          >
            {rowData.currentnoofrangedstores}
          </div>
          // </Typography>
        )
      } else {
        return <>0</>
        // return <>NA</>
      }
    } else {
      return <>NA</>
    }
  }

  const newNoOfRangeStoresTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'numberOfRangeStores'}
        />
      )
    } else {
      return (
        <div
          className={classes.tableLinks}
          onClick={() =>
            handleRangeStoresDialogOpen(rowData, 'New Number of Ranged Stores')
          }
        >
          {rowData.numberOfRangeStores}
        </div>
      )
    }
  }

  const storesRangedCurrentVsProposedTemplate = (rowData: any) => {
    if (
      rowData.actionType === delistProductMin ||
      rowData.actionType === productDistributionDecreaseMin ||
      rowData.actionType === productDistributionIncreaseMin ||
      rowData.actionType === productShelfSpaceDecrease ||
      rowData.actionType === productShelfSpaceIncrease
    ) {
      return <>{rowData.storesRangedCurrentVsProposed}</>
    } else {
      return <></>
    }
  }

  const currentVsNewStoresImportedTemplate = (rowData: any) => {
    if (
      rowData.actionType === delistProductMin ||
      rowData.actionType === productDistributionDecreaseMin ||
      rowData.actionType === productDistributionIncreaseMin ||
      rowData.actionType === productShelfSpaceDecrease ||
      rowData.actionType === productShelfSpaceIncrease
    ) {
      return <>{rowData.currentVersusNewStores}</>
    } else {
      return <></>
    }
  }

  const newNoOfRangeStoresPlanogramTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'newnoofrangestoresPlanogram'}
        />
      )
    } else {
      return <>{rowData.newnoofrangestoresPlanogram}</>
    }
  }
  const newShelfFillPlanogramTemplate = (rowData: any) => {
    const check: any = supplierSelected.filter(
      (val: any) => rowData.min === val.min
    )
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'newShelfFillPlanogram'}
        />
      )
    } else {
      return <>{rowData.newShelfFillPlanogram}</>
    }
  }

  const newShelfFillImportedTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          // field={'newShelfFill'}
          field={'newShelfFillMultiplied'}
        />
      )
    } else {
      return (
        <div
          className={classes.tableLinks}
          onClick={() =>
            handleRangeStoresDialogOpen(rowData, 'New Shelf Fill (Units)')
          }
        >
          {/* {rowData.newShelfFill} */}
          {rowData.newShelfFillMultiplied}
        </div>
      )
    }
  }
  const depotClearReservedQtyRetailImportedTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'depotClearbyReservedQtyRetail'}
        />
      )
    } else {
      return <>{rowData.depotClearbyReservedQtyRetail}</>
    }
  }

  useEffect(() => {
    console.log(viewTemplateName)
  }, [viewTemplateName])
  const depotClearReservedQtyWholesaleImportedTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'depotClearbyReservedQtyWholesale'}
        />
      )
    } else {
      return <>{rowData.depotClearbyReservedQtyWholesale}</>
    }
  }
  const depotClearReservedQtyOnlineImportedTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'depotClearbyReservedQtyOnline'}
        />
      )
    } else {
      return <>{rowData.depotClearbyReservedQtyOnline}</>
    }
  }
  const newSupplierImportedTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (
      editClick &&
      check.length > 0 &&
      check[0].min === rowData.min
      // &&
      // (rowData.actionType === placeholderMin ||
      //   rowData.actionType === supplyChange)
    ) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'newSupplier'}
        />
      )
    }
    // else if (
    //   rowData.actionType === newProductMin ||
    //   rowData.actionType === supplyChange
    // ) {
    //   return <>{rowData.newSupplier}</>
    // }
    else {
      return <>{rowData.newSupplier}</>
    }
  }
  const newSupplierSiteImportedTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (
      editClick &&
      check.length > 0 &&
      check[0].min === rowData.min
      // &&
      // (rowData.actionType === placeholderMin ||
      //   rowData.actionType === supplyChange)
    ) {
      return (
        <DelistInputEdit
          rowData={rowData}
          setImportedData={setImportedData}
          onChangeProductTableFields={onChangeProductTableFields}
          field={'newSupplierSite'}
        />
      )
    }
    // else if (
    //   rowData.actionType === newProductMin ||
    //   rowData.actionType === supplyChange
    // )
    // {
    //   return <>{rowData.newSupplierSite}</>
    // }
    else {
      return <>{rowData.newSupplierSite}</>
    }
  }
  const commentsTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <InputTextarea
          cols={20}
          autoResize
          maxLength={500}
          value={rowData && rowData.comments}
          onChange={(e: any) => {
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'comments',
                rowData,
                e.target.value
              )
            })
          }}
          className={classes.tableTextField}
        />
      )
    } else {
      return <>{rowData && rowData.comments}</>
    }
  }
  const existingSupplierProductListTemplate = (rowData: any) => {
    if (rowData.actionType === placeholderMin) {
      return <>NA</>
    } else {
      return <span>{rowData && rowData.existingSupplier}</span>
    }
  }

  const [onChangeSupplierState, setOnChangeSupplierState] = useState<any>(false)
  const [supplierChangeValue, setSupplierChangeValue] = useState<any>('')

  const supplierOnchange = (e: any, rowData: any) => {
    setIsProgressLoader(true)
    const { min } = rowData

    getSupplierServiceBySupplierId(e)
      .then((res: any) => {
        setImportedData((prevState: any) => {
          let dataSupplier = [...importedData]
          let index = dataSupplier.findIndex((data: any) => data.min === min)
          dataSupplier[index].existingSupplier = res.data.supplierName
          return dataSupplier
        })
        setIsProgressLoader(false)
        setSupplierChangeValue(res.data.supplierName)
      })
      .catch((err: any) => {
        setImportedData((prevState: any) => {
          let dataSupplier = [...importedData]
          let index = dataSupplier.findIndex((data: any) => data.min === min)
          dataSupplier[index].existingSupplier = ''
          return dataSupplier
        })
        setIsProgressLoader(false)
        setSupplierChangeValue('')
        // toast.current.show({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: e + ' No Supplier Name Error',
        //   life: life,
        //   className: 'login-toast',
        // })
      })
  }

  const onChangeProductTableFieldsProductSupplier: any = (
    prevState: any,
    existingSupplier: any,
    existingSupplierCode: any,
    rowDataSelected: any,
    eventValue: any
    // supplierName: any
  ) => {
    return prevState.map((obj: any) =>
      obj._idCheck === rowDataSelected._idCheck
        ? Object.assign(obj, {
            [existingSupplierCode]: eventValue,
            [existingSupplier]: supplierChangeValue,
          })
        : obj
    )
  }

  const existingSupplierSiteProductListTemplate = (rowData: any) => {
    let primayOrder: any =
      rowData && rowData.primaryOrder && rowData.primaryOrder.supplierId // On open show default -->1->2
    // let supplierService_3: any = rowData && rowData.existingSupplierSite // supplier service -->3
    let purchaseLocation: any =
      rowData && rowData.purchaseOrders && rowData.purchaseOrders.locations // open -->1 historyorder-->2
    // let newArr: any = ['2192', '2954', '2194', '2199']

    let optionsSupplierId: any = []
    let openOrder: any = []
    let historyOrder: any = []
    purchaseLocation &&
      purchaseLocation.map((item: any) => {
        item.history &&
          item.history.orders.length > 0 &&
          item.history.orders.map((order: any) => {
            if (order && historyOrder.indexOf(order.supplierId) === -1) {
              historyOrder.push(order.supplierId)
            }
          })
        item.open &&
          item.open.orders.length > 0 &&
          item.open.orders.map((order: any) => {
            if (order && openOrder.indexOf(order.supplierId) === -1) {
              openOrder.push(order.supplierId)
            }
          })
      })
    if (openOrder.length > 0) {
      optionsSupplierId = openOrder
    } else if (historyOrder.length > 0) {
      optionsSupplierId = historyOrder
    } else {
      optionsSupplierId.push(rowData && rowData.existingSupplierSite)
    }
    if (rowData.actionType === placeholderMin) {
      return <>NA</>
    } else {
      console.log('existing', rowData)
      // let valueDefault: any = ''
      // if (onChangeSupplierState) {
      //   valueDefault = rowData && rowData.existingSupplierSite
      // } else if (primayOrder) {
      //   valueDefault = primayOrder
      // } else {
      //   valueDefault = rowData && rowData.existingSupplierSite
      // }
      // supplierOnchange(rowData && rowData.existingSupplierSite, rowData)
      return (
        <Select
          // value={onChangeSupplierState ? supplierService_3 : primay}
          // value={valueDefault}
          value={rowData && rowData.existingSupplierSite}
          onChange={(e: any) => {
            setImportedData((prevState: any) => {
              supplierOnchange(e.target.value, rowData)
              setOnChangeSupplierState(true)
              return onChangeProductTableFieldsProductSupplier(
                prevState,
                'existingSupplier',
                'existingSupplierSite',
                rowData,
                e.target.value
                // supplierChangeValue
              )
            })
          }}
          input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
        >
          {optionsSupplierId.map((supplierId: any) => {
            // {newArr.map((supplierId: any) => {
            return (
              <MenuItem
                value={supplierId}
                key={supplierId}
                className={classes.muiSelect}
              >
                {supplierId}
              </MenuItem>
            )
          })}
        </Select>
      )
    }
  }
  const handleIngredientDialogOpen = (minVal: any) => {
    if (minVal != '') {
      setIsProgressLoader(true)
      setIngredientDialog(true)
      getProductCompositionServiceByItemnumber(minVal)
        // getProductCompositionServiceByItemnumber('112056236')
        .then((res: any) => {
          if (res.data.ItemDetails[0].hasOwnProperty('ingredientDetails')) {
            setIngredientData(res.data.ItemDetails[0].ingredientDetails)
          }
          setIsProgressLoader(false)
        })
        .catch((err: any) => {
          console.log(err)
          setIsProgressLoader(false)
        })
    }

    // console.log('details', rowData.ingredientDetails)
  }

  const handleIngredientDialogClose = () => {
    setIngredientDialog(false)
    setIngredientData([])
    setSelectedIngredientData([])
  }
  const handleDelistIngredientMin = () => {
    if (selectedIngredientData && selectedIngredientData.length > 0) {
      selectedIngredientData.map((ingredient: any) => {
        getAndCheckItemNumber([
          ingredient.ingredientMin,
          // '100001499',
          delistIngredientMin,
          '',
          '',
          'NA',
          'NA',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ])
      })
    }
    handleIngredientDialogClose()
  }
  const ingredientsDialog = (
    <Dialog
      open={ingredientDialog}
      onClose={handleIngredientDialogClose}
      fullWidth
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={`Unique Ingredient MIN View`}
          onClose={handleIngredientDialogClose}
        />
        <Box
          sx={{
            p: 3,
          }}
        >
          <DataTable
            // value={ingredientList}
            value={ingredientData}
            showGridlines
            className="p-datatable-sm"
            selectionMode="checkbox"
            selection={selectedIngredientData}
            onSelectionChange={(e: any) => {
              setSelectedIngredientData(e.value)
            }}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{
                width: '50px',
                color: 'white',
                backgroundColor: teal[900],
              }}
            ></Column>
            {ingredientTableCols.map((col: any) => {
              return (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  bodyStyle={tableBodyStyle(col.width)}
                  headerStyle={tableHeaderStyle(
                    col.width,
                    theme.palette.primary.main
                  )}
                />
              )
            })}
          </DataTable>
        </Box>
        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleDelistIngredientMin}
          >
            Add To Delist Ingredient MIN
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
  const ingredientMinTemplate = (rowData: any) => {
    // console.log('ingredientMinTemplate', rowData)
    if (
      rowData &&
      rowData.actionType !== delistOutercaseCode &&
      rowData.actionType !== placeholderMin &&
      rowData.actionType !== newOutercaseCode &&
      rowData.actionType !== supplyChange &&
      rowData.actionType !== newIngredientMin &&
      rowData.actionType !== delistIngredientMin
    ) {
      return (
        <>
          {rowData.ingredientMin ? (
            <div
              onClick={() => handleIngredientDialogOpen(rowData.min)}
              className={classes.tableLinks}
            >
              {rowData.ingredientMin !== '' && rowData.ingredientMin !== 'NA'
                ? rowData.ingredientMin
                : ''}
            </div>
          ) : (
            ''
          )}
        </>
      )
    } else {
      return (
        // <>{rowData && rowData.ingredientMin ? rowData.ingredientMin : ''}</>
        <>NA</>
      )
    }
  }
  const handleRecipeDialogOpen = (minVal: any) => {
    if (minVal != '') {
      setIsProgressLoader(true)
      setRecipeDialogOpen(true)
      getProductCompositionServiceByItemnumber(minVal)
        // getProductCompositionServiceByItemnumber('112056236')
        .then((res: any) => {
          if (res.data.ItemDetails) {
            setRecipeData(res.data.ItemDetails)
          }
          setIsProgressLoader(false)
        })
        .catch((err: any) => {
          console.log(err)
          setIsProgressLoader(false)
        })
    }
  }

  const handleRecipeDialogClose = (rowData: any) => {
    setRecipeDialogOpen(false)
    setRecipeData([])
  }
  const recipeDialog = (
    <Dialog open={recipeDialogOpen} onClose={handleRecipeDialogClose} fullWidth>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={`No. of Recipe MIN View`}
          onClose={handleRecipeDialogClose}
        />
        <Box
          sx={{
            p: 3,
          }}
        >
          <DataTable
            // value={ingredientList}
            value={recipeData}
            showGridlines
            className="p-datatable-sm"
          >
            {recipeTableCols.map((col: any) => {
              return (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  bodyStyle={tableBodyStyle(col.width)}
                  headerStyle={tableHeaderStyle(
                    col.width,
                    theme.palette.primary.main
                  )}
                />
              )
            })}
          </DataTable>
        </Box>
      </Box>
    </Dialog>
  )
  const recipeMinTemplate = (rowData: any) => {
    // console.log('ingredientMinTemplate', rowData)
    if (
      rowData &&
      (rowData.actionType === placeholderMin ||
        rowData.actionType === newOutercaseCode ||
        rowData.actionType === delistOutercaseCode ||
        rowData.actionType === supplyChange)
    ) {
      return (
        // <>{rowData && rowData.noOfRecipeMin ? rowData.noOfRecipeMin : 'NA'}</>
        <>NA</>
      )
    } else if (rowData.actionType === newIngredientMin) {
      return <></>
    } else if (
      rowData &&
      (rowData.actionType !== delistOutercaseCode ||
        rowData.actionType !== newOutercaseCode ||
        rowData.actionType !== supplyChange)
    ) {
      return (
        <>
          {rowData.noOfRecipeMin ? (
            <div
              onClick={() => handleRecipeDialogOpen(rowData.min)}
              className={classes.tableLinks}
            >
              {rowData.noOfRecipeMin}
            </div>
          ) : (
            ''
          )}
        </>
      )
    } else {
      return (
        // <>{rowData && rowData.noOfRecipeMin ? rowData.noOfRecipeMin : 'NA'}</>
        <>NA</>
      )
    }
  }
  const handleDepotStockDialogOpen = (rowData: any) => {
    setDepotStockDialogOpen(true)
    console.log('handleDepotStockDialogOpen', rowData)
    // setDepotStockData([rowData])
    // setDepotStockData(depotViewResDummy.depotView)
    getStoreDepot(rowData, 'depot')

    //make an api call here
  }

  const handleDepotStockDialogClose = (rowData: any) => {
    setDepotStockDialogOpen(false)
    setDepotStockData([])
    setDepotRegions([])
    setStorePopupHeader('')
    setDepotRegLoc('')
  }

  //NOrth popup
  // const [depotClick, setDepotClick] = useState<any>('')
  const [depotButtonsDialog, setDepotButtonsDialog] = useState<any>(false)
  const [depotRegLoc, setDepotRegLoc] = useState<any>()

  const depotButtons = (props: any) => {
    setIsProgressLoader(true)
    console.log('depotButtons', props)
    setDepotRegLoc(props)
    setDepotButtonsDialog(true)
    setIsProgressLoader(false)
  }
  const handleDepotButtonDialogClose = () => {
    setDepotButtonsDialog(false)
  }
  const depotStockUnitViewButtonsDialog = (
    <Dialog
      open={depotButtonsDialog}
      onClose={handleDepotButtonDialogClose}
      fullWidth
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
        }}
      >
        <DialogHeader
          title={depotRegLoc && depotRegLoc.regionName}
          // title={`North East`}
          onClose={handleDepotButtonDialogClose}
        />
        <Box
          sx={{
            p: 3,
          }}
        ></Box>
        <Grid container style={{ alignItems: 'start' }}>
          <Grid item xs={4}>
            <div className="gridBorderGreen">
              <p className="headBgGreen">Ranged Stores</p>
              <ul className="childRange">
                {depotRegLoc &&
                  depotRegLoc.rangeLocations &&
                  depotRegLoc.rangeLocations.map((val: any) => (
                    <DepotviewButtons locations={val} />
                  ))}
              </ul>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="gridBorderGreen">
              <p className="headBgGreen">Stores selected for Derange</p>
              <ul className="childRange">
                {depotRegLoc &&
                  depotRegLoc.derangeLocations &&
                  depotRegLoc.derangeLocations.map((val: any) => (
                    <DepotviewButtons locations={val} />
                  ))}
              </ul>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="gridBorderGreen">
              <p className="headBgGreen">New Ranged Stores</p>
              <ul className="childRange">
                {depotRegLoc &&
                  depotRegLoc.newRangeLocations &&
                  depotRegLoc.newRangeLocations.map((val: any) => (
                    <DepotviewButtons locations={val} />
                  ))}
              </ul>
            </div>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        ></Box>
      </Box>
    </Dialog>
  )
  const depotStockDialog = (
    <Dialog
      open={depotStockDialogOpen}
      onClose={handleDepotStockDialogClose}
      fullWidth
      classes={{
        paperFullWidth:
          // depotStockData && depotStockData.length > 0
          depotStockTableData
            ? classes.placeholderDialogFull
            : classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={`Depot Stock Unit View`}
          onClose={handleDepotStockDialogClose}
        />
        <Box
          sx={{
            p: 2,
            overflow: 'scroll',
          }}
        >
          <DataTable
            value={depotStockData}
            // value={depotStockTableData}
            // value={depotStockData}
            showGridlines
            className="p-datatable-sm"
          >
            {depotStockUnitTableCols.map((col: any) => {
              return (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.header}
                  bodyStyle={tableBodyStyle(col.width)}
                  headerStyle={tableHeaderStyle(
                    col.width,
                    theme.palette.primary.main
                  )}
                />
              )
            })}
          </DataTable>
        </Box>
        <Grid
          container
          spacing={2}
          style={{
            justifyContent: 'left',
            padding: '20px',
          }}
        >
          {/* {depotStockButtons.map((button: any) => { */}
          {depotRegions &&
            depotRegions.map((button: any, index: any) => {
              return (
                <Grid
                  key={index}
                  item
                  sm={2}
                  style={{
                    // cursor: 'pointer',
                    backgroundColor: 'orange',
                    margin: '10px',
                    textAlign: 'center',
                  }}
                >
                  <button
                    className={classes.tableLinks}
                    onClick={() => depotButtons(button)}
                  >
                    {button.regionName}
                  </button>
                </Grid>
              )
            })}
        </Grid>
      </Box>
    </Dialog>
  )
  const depotStockTemplate = (rowData: any) => {
    //depotViewResDummy
    console.log('depotStockTemplate', rowData)
    if (
      rowData &&
      (rowData.actionType === newIngredientMin ||
        rowData.actionType === newProductMin)
    ) {
      return <></>
    } else if (
      rowData &&
      (rowData.actionType === placeholderMin ||
        rowData.actionType === supplyChange)
    ) {
      return <>NA</>
    } else if (
      rowData &&
      rowData.hasOwnProperty('depotStockUnit') &&
      rowData.depotStockUnit &&
      rowData.actionType !== placeholderMin
    ) {
      return (
        <div
          onClick={() => handleDepotStockDialogOpen(rowData)}
          className={classes.tableLinks}
        >
          {rowData.depotStockUnit}
          {/* click */}
        </div>
      )
    } else {
      return <></>
    }
  }
  useEffect(() => {
    setActionTypeOptions([])
    getConfigType('Action Type')
      .then((res: any) => {
        const actionOptions = res.data.map((actionType: any) => {
          if (actionType.configValue !== placeholderMin) {
            return {
              // label: actionType.configValue,
              label: <ActionTypeHover title={actionType.configValue} />,
              value: actionType.configValue,
            }
          } else {
            return {
              label: actionType.configValue,
              value: actionType.configValue,
              color: 'red',
              isDisabled: true,
            }
          }
          // return actionType.configValue
        })
        console.log(actionOptions)
        // setActionTypeOptions(actionOptions])
        setActionTypeOptions((prevState: any) => [
          ...prevState,
          {
            label: 'Multiple Selection',
            value: 'Multiple Selection',
          },
          ...actionOptions,
        ])
      })
      .catch((err: any) => {
        console.log('ERROR')
      })
  }, [actionType])

  const handleActionType = (e: any) => {
    if (e) {
      setActionType(e)
      setActionTypeSelected(e.value)
      console.log('ACTION TYPE', e)
    } else {
      setActionType('')
    }
  }

  const handleBulkActions = (e: any) => {
    if (e && selectedProductListItems && selectedProductListItems.length > 0) {
      setBulkActions(e)
    } else {
      setBulkActions('')
    }
  }
  const handleClearDepotBulkActionDialogOpen = () => {
    setClearDepotBulkActionOpen(true)
  }
  const handleClearDepotBulkActionDialogClose = () => {
    setClearDepotBulkActionOpen(false)
    setClearDepotSelected(0)
    setBulkActions(null)
  }
  const applyClearDepot = () => {
    if (
      clearDepotSelected &&
      clearDepotSelected !== '' &&
      clearDepotSelected !== 0
    ) {
      selectedProductListItems.map((rowData: any) => {
        if (
          rowData.actionType === delistProductMin ||
          rowData.actionType === productDistributionDecreaseMin ||
          // rowData.actionType === productShelfSpaceDecrease ||
          rowData.actionType === delistIngredientMin ||
          rowData.actionType === delistOutercaseCode
          // rowData.actionType === supplyChange
        ) {
          setImportedData((prevState: any) => {
            return onChangeProductTableFields(
              prevState,
              'clearDepotBy',
              rowData,
              clearDepotSelected
            )
          })
        }
      })
      handleClearDepotBulkActionDialogClose()
      setBulkActions(null)
    }
  }

  const clearDepotBulkActionDialog = (
    <Dialog
      open={clearDepotBulkActionOpen}
      onClose={handleClearDepotBulkActionDialogClose}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={`Clear Depot By`}
          onClose={handleClearDepotBulkActionDialogClose}
        />

        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="primary">
            Clear Depot By
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', p: 2 }}>
            <Select
              value={clearDepotSelected}
              // onChange={(e) => eventHandleDetailsSOT(e)}
              onChange={(e: any) => {
                if (e.target.value !== null && e.target.value !== '') {
                  setClearDepotSelected(e.target.value)
                }
              }}
              // placeholder="Select Clear Depot Week"
              // variant="outlined"
              input={
                <OutlinedInput
                  margin="dense"
                  className={classes.muiSelect}
                  placeholder="Clear Depot By"
                  value="Select Depot Clear Week"
                />
              }
            >
              <MenuItem
                value={0}
                className={classes.muiSelect}
                // selected
                disabled
              >
                Select Depot Clear Week
              </MenuItem>
              {clearDepotByOptions.map((op: any) => {
                return (
                  <MenuItem
                    value={op.value}
                    key={op.value}
                    className={classes.muiSelect}
                  >
                    {op.label}
                  </MenuItem>
                )
              })}
            </Select>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        >
          <Button
            //   className={classes.submitButtons}
            variant="contained"
            color="primary"
            onClick={applyClearDepot}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Dialog>
  )

  const handleFinalStopOrderBulkActionDialogOpen = () => {
    setFinalStopOrderBulkActionOpen(true)
  }
  const handleFinalStopOrderBulkActionDialogClose = () => {
    setFinalStopOrderBulkActionOpen(false)
    setFinalStopOrderSelected(null)
    setBulkActions(null)
  }

  const applyFinalStopOrder = () => {
    if (finalStopOrderSelected && finalStopOrderSelected != '') {
      selectedProductListItems.map((rowData: any) => {
        if (
          rowData.actionType === delistProductMin ||
          rowData.actionType === productDistributionDecreaseMin ||
          // rowData.actionType === productShelfSpaceDecrease ||
          rowData.actionType === delistIngredientMin ||
          rowData.actionType === delistOutercaseCode
          // rowData.actionType === supplyChange
        ) {
          setImportedData((prevState: any) => {
            return onChangeProductTableFields(
              prevState,
              'finalStopOrderDate',
              rowData,
              finalStopOrderSelected
            )
          })
        }
      })
      handleFinalStopOrderBulkActionDialogClose()
      setBulkActions(null)
    }
  }

  const finalStopOrderBulkActionDialog = (
    <Dialog
      open={finalStopOrderBulkActionOpen}
      onClose={handleFinalStopOrderBulkActionDialogClose}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={`Final Stop Order Date`}
          onClose={handleFinalStopOrderBulkActionDialogClose}
        />

        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="primary">
            Final Stop Order Date
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', p: 2 }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                format="dd/MM/yy"
                value={finalStopOrderSelected && finalStopOrderSelected}
                onChange={(date: any) => {
                  let newDate = date.toISOString().split('T')[0]
                  setFinalStopOrderSelected(newDate)
                }}
                maxDate={eventDetails && eventDetails[0].targetDate}
                TextFieldComponent={(props: any) => (
                  <OutlinedInput
                    margin="dense"
                    onClick={props.onClick}
                    value={props.value}
                    onChange={props.onChange}
                    className={classes.inputFields}
                    placeholder={'DD/MM/YYYY'}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        >
          <Button
            //   className={classes.submitButtons}
            variant="contained"
            color="primary"
            onClick={applyFinalStopOrder}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Dialog>
  )

  const handleBulkActionDelete = () => {
    let draftData = selectedProductListItems.filter(
      (data: any) => data.lineStatus === bulkActionTypes.draftAction
    )
    console.log('selected delete', draftData)
    let deleteSuccess: any = []
    let deleteError = 0
    let _tasks: any = []

    let requests = draftData.map((item: any) => {
      return deleteRafItem(eventDetails && eventDetails[0].id, item.min).then(
        (res: any) => {
          return [res, item.min]
        }
      )
    })
    Promise.allSettled(requests).then((responses: any) => {
      console.log('delete 1', responses)
      responses.map((item: any) => {
        if (item.status === 'fulfilled') {
          deleteSuccess.push(item.value && item.value[1])
        } else {
          deleteError += 1
        }
      })
      if (deleteSuccess.length === draftData.length) {
        _tasks.push(
          ...importedData.filter(
            (value: any) =>
              // value.lineStatus === bulkActionTypes.draftAction &&
              !draftData.includes(value)
          )
        )
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: `Selected Items Deleted`,
          life: life,
          className: 'login-toast',
        })
      } else {
        _tasks.push(
          ...importedData.filter(
            (value: any) =>
              // value.lineStatus === bulkActionTypes.draftAction &&
              !deleteSuccess.includes(value.min)
          )
        )
        // let successString = deleteSuccess.toString()
        // let errorString = deleteError.toString()
        // toast.current.show({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: `${successString} Deleted`,
        //   life: life,
        //   className: 'login-toast',
        // })
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: `${deleteError} item(s) not Deleted, ${
            draftData.length - deleteError
          } item(s) Deleted`,
          life: life,
          className: 'login-toast',
        })
      }
      console.log('delete', _tasks)
      setImportedData(_tasks)
    })

    setSelectedProductListItems([])
    setBulkActions(null)
  }

  const confirmBulkActionDelete = (
    <ConfirmBox
      cancelOpen={deleteBulkActionOpen}
      handleCancel={() => {
        setDeleteBulkActionOpen(false)
        setBulkActions(null)
      }}
      handleProceed={handleBulkActionDelete}
      label1="Confirm 'Delete'"
      label2={
        "Are you sure you want to delete the selected record(s)? Only 'Draft' records will be deleted"
      }
    />
  )

  const handleBulkActionCancel = () => {
    let filtered = selectedProductListItems.filter(
      (rowData: any) =>
        rowData.lineStatus === 'Request For Stock Count' ||
        rowData.lineStatus === bulkActionTypes.confirmedAction
    )
    console.log('filtered importeddata', filtered)
    filtered.map((rowData: any) => {
      // if (
      // rowData.lineStatus === 'Request For Stock Count' ||
      //   rowData.lineStatus === bulkActionTypes.confirmedAction
      // ) {
      setImportedData((prevState: any) => {
        return onChangeProductTableFields(
          prevState,
          'lineStatus',
          rowData,
          'Cancelled'
        )
      })
      // }
    })
    setBulkActions(null)
  }

  const confirmBulkActionCancel = (
    <ConfirmBox
      cancelOpen={cancelBulkActionOpen}
      handleCancel={() => {
        setCancelBulkActionOpen(false)
        setBulkActions(null)
      }}
      handleProceed={handleBulkActionCancel}
      label1="Confirm 'Cancel'"
      label2={
        "Are you sure you want to Cancel the selected record(s)? Only 'Request for Stock Count' & 'Confirmed' items will be cancelled"
      }
    />
  )

  const handleBulkStockCountRequest = () => {
    let filtered = selectedProductListItems.filter(
      (rowData: any) =>
        rowData.actionType === delistProductMin ||
        rowData.actionType === productDistributionDecreaseMin
    )
    filtered.map((rowData: any) => {
      setImportedData((prevState: any) => {
        return onChangeProductTableFields(
          prevState,
          'lineStatus',
          rowData,
          'Request For Stock Count'
        )
      })
    })
    setBulkActions(null)
  }

  const confirmBulkStockCountRequestDialog = (
    <ConfirmBox
      cancelOpen={stockCountRequestOpen}
      handleCancel={() => {
        setStockCountRequestOpen(false)
        setBulkActions(null)
      }}
      handleProceed={handleBulkStockCountRequest}
      label1="Confirm 'Stock Count Requested'"
      label2={
        "Are you sure you want to change status to 'Stock Count Requested'? Only 'Delist MIN' and 'Product Distribution Decrease' can be changed"
      }
    />
  )

  useEffect(() => {
    if (
      selectedProductListItems &&
      selectedProductListItems.length > 0 &&
      bulkActions &&
      bulkActions !== ''
    ) {
      console.log('imported bulk action', bulkActions.value)
      if (bulkActions.value === bulkActionTypes.confirmedAction) {
        selectedProductListItems.map((rowData: any) => {
          setImportedData((prevState: any) => {
            return onChangeProductTableFields(
              prevState,
              'lineStatus',
              rowData,
              bulkActionTypes.confirmedAction
            )
          })
        })
        setBulkActions(null)
      } else if (bulkActions.value === bulkActionTypes.clearDepotAction) {
        handleClearDepotBulkActionDialogOpen()
      } else if (bulkActions.value === bulkActionTypes.finalStopOrderAction) {
        handleFinalStopOrderBulkActionDialogOpen()
      } else if (bulkActions.value === bulkActionTypes.draftAction) {
        selectedProductListItems.map((rowData: any) => {
          setImportedData((prevState: any) => {
            return onChangeProductTableFields(
              prevState,
              'lineStatus',
              rowData,
              bulkActionTypes.draftAction
            )
          })
        })
        setBulkActions(null)
      } else if (
        bulkActions.value === bulkActionTypes.stockCountRequestAction
      ) {
        setStockCountRequestOpen(true)
        // selectedProductListItems.map((rowData: any) => {
        //   setImportedData((prevState: any) => {
        //     return onChangeProductTableFields(
        //       prevState,
        //       'lineStatus',
        //       rowData,
        //       'Request For Stock Count'
        //     )
        //   })
        // })
        // setBulkActions(null)
      } else if (bulkActions.value === 'Cancelled') {
        setCancelBulkActionOpen(true)
      } else if (bulkActions.value === bulkActionTypes.deleteAction) {
        setDeleteBulkActionOpen(true)
      } else if (
        bulkActions.value === bulkActionTypes.excludeFromMarkdownAction
      ) {
        selectedProductListItems.map((rowData: any) => {
          if (
            rowData.actionType === delistProductMin ||
            rowData.actionType === productDistributionDecreaseMin
            // ||
            // rowData.actionType === productShelfSpaceDecrease ||
            // rowData.actionType === delistIngredientMin ||
            // rowData.actionType === supplyChange
          ) {
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'includeInClearancePricing',
                rowData,
                'N'
              )
            })
          }
        })
        setBulkActions(null)
      } else if (
        bulkActions.value === bulkActionTypes.includeInMarkdownAction
      ) {
        selectedProductListItems.map((rowData: any) => {
          if (
            rowData.actionType === delistProductMin ||
            rowData.actionType === productDistributionDecreaseMin
            // ||
            // rowData.actionType === productShelfSpaceDecrease ||
            // rowData.actionType === delistIngredientMin ||
            // rowData.actionType === supplyChange
          ) {
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'includeInClearancePricing',
                rowData,
                'Y'
              )
            })
          }
        })
        setBulkActions(null)
      } else if (bulkActions.value === bulkActionTypes.downloadAction) {
        setIsProgressLoader(true)
        let downloadData = selectedProductListItems.map((item: any) => {
          return {
            actionType: item.actionType,
            lineStatus: item.lineStatus,
            min: item.min, //userinput
            pin: item.pin ? item.pin : null,
            ingredientMin: item.ingredientMin ? item.ingredientMin : null,
            legacyItemNumbers: item.legacyItemNumbers
              ? item.legacyItemNumbers
              : '',
            man: item.man ? item.man : null,
            description: item.description ? item.description : null,
            replaceMin: item.replaceMin ? item.replaceMin : null,
            replaceMinDescription: item.replaceMinDescription
              ? item.replaceMinDescription
              : null,
            unitretailInc: 'NA', //drop2
            unitretailEx: 'NA', //drop2
            unitcost: item.unitcost, //drop2
            casecost: item.casecost ? item.casecost : null, //drop2
            packquantity: item.packquantity ? item.packquantity : null, //drop2
            existingSupplier: item.existingSupplier
              ? item.existingSupplier
              : null,
            existingSupplierSite: item.existingSupplierSite
              ? item.existingSupplierSite
              : null,
            local: item.local ? item.local : '',
            perStorepPerWeek: item.perStorepPerWeek
              ? item.perStorepPerWeek
              : null,
            onlineCFC: item.onlineCFC ? item.onlineCFC : '',
            onlineStorePick: item.onlineStorePick ? item.onlineStorePick : '',
            wholesale: item.wholesale ? item.wholesale : '',
            currentnoofrangedstores: item.currentnoofrangedstores
              ? item.currentnoofrangedstores
              : null,
            numberOfRangeStores: item.numberOfRangeStores
              ? item.numberOfRangeStores
              : null,
            currentVersusNewStores: item.currentVersusNewStores
              ? item.currentVersusNewStores
              : null,
            storesRangedCurrentVsProposed: item.storesRangedCurrentVsProposed
              ? item.storesRangedCurrentVsProposed
              : null,
            currentShelfFill: item.currentShelfFill
              ? item.currentShelfFill
              : null,
            newShelfFill: item.newShelfFill ? item.newShelfFill : null,
            currentshelffill_vs_newfill: item.currentshelffill_vs_newfill,
            currentshelffill_vs_newfill_percant:
              item.currentshelffill_vs_newfill_percant
                ? item.currentshelffill_vs_newfill_percant
                : null,

            ownBrand: item.ownBrand ? item.ownBrand : null,
            includeInClearancePricing: item.includeInClearancePricing
              ? item.includeInClearancePricing
              : null,
            includeInStoreWastage: item.includeInStoreWastage
              ? item.includeInStoreWastage
              : null,
            clearDepotBy: item.clearDepotBy ? item.clearDepotBy : null,
            supplierCommitment: item.supplierCommitment
              ? item.supplierCommitment
              : null,
            finalStopOrderDate: item.finalStopOrderDate
              ? item.finalStopOrderDate
              : null,
            systemSuggestedStopOrderDate: item.systemSuggestedStopOrderDate
              ? item.systemSuggestedStopOrderDate
              : null,
            lastPoDate: item.lastPoDate ? item.lastPoDate : null,
            depotShelfLifeMinimum: item.depotShelfLifeMinimum
              ? item.depotShelfLifeMinimum
              : null,
            productShelfLifeInstore: item.productShelfLifeInstore
              ? item.productShelfLifeInstore
              : null,
            shelfLifeatManufacture: item.shelfLifeatManufacture
              ? item.shelfLifeatManufacture
              : null,
            totalstock: item.totalstock ? item.totalstock : '',
            storeStockUnit: item.storeStockUnit ? item.storeStockUnit : null,
            depotStockUnit: item.depotStockUnit ? item.depotStockUnit : null,
            openPos: item.openPos ? item.openPos : null,
            forward_forecast_to_launch: item.forward_forecast_to_launch
              ? item.forward_forecast_to_launch
              : null,
            averageWeeklyVolume: item.averageWeeklyVolume
              ? item.averageWeeklyVolume
              : null,
            weeksCoveronTotalStockonHandtoResetDate:
              item.weeksCoveronTotalStockonHandtoResetDate
                ? item.weeksCoveronTotalStockonHandtoResetDate
                : null,
            forcastedWeeksCovertoResetDate: item.forcastedWeeksCovertoResetDate
              ? item.forcastedWeeksCovertoResetDate
              : null,
            excessstock: item.excessstock ? item.excessstock : null,

            safewaybrandedequivalent: item.safewaybrandedequivalent
              ? item.safewaybrandedequivalent
              : null,
            effectiveDateFrom: item.effectiveDateFrom
              ? item.effectiveDateFrom
              : null,
            effectiveDateTo: item.effectiveDateTo ? item.effectiveDateTo : null,
            newSupplier: item.newSupplier ? item.newSupplier : null,
            newSupplierSite: item.newSupplierSite ? item.newSupplierSite : null,
            noOfRecipeMin: item.noOfRecipeMin ? item.noOfRecipeMin : '',

            depotClearbyReservedQtyRetail: item.depotClearbyReservedQtyRetail
              ? item.depotClearbyReservedQtyRetail
              : null,
            depotClearbyReservedQtyWholesale:
              item.depotClearbyReservedQtyWholesale
                ? item.depotClearbyReservedQtyWholesale
                : null,
            depotClearbyReservedQtyOnline: item.depotClearbyReservedQtyOnline
              ? item.depotClearbyReservedQtyOnline
              : null,
            depotClearbyReservedQtyTotal: item.depotClearbyReservedQtyTotal
              ? item.depotClearbyReservedQtyTotal
              : null,

            comments: item.comments ? item.comments : null,
          }
        })
        console.log('downData', downloadData)
        let newDate = new Date().toISOString().split('T')[0]
        let fileName = `${eventDetails[0].name}_${newDate}`
        exportExcel(downloadData, productListCols, fileName)
        setIsProgressLoader(false)
        setBulkActions(null)
      }
    }
  }, [bulkActions])
  const [selectedSupplierSite, setSelectedSupplierSite] = useState<any>([])
  const [selectedSupplierSiteNew, setSelectedSupplierSiteNew] = useState<any>(
    []
  )
  const handleSupplierSite = (e: any) => {
    if (e) {
      setSelectedSupplierSite(e)
      console.log(e)
      setSupplierSiteExisting(e.value)
      getSupplierServiceBySupplierId(e.value)
        .then((res: any) => {
          setSupplierExisting(res.data.supplierName)
        })
        .catch((err: any) => {
          setSupplierExisting('')
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Supplier site service error',
            life: life,
            className: 'login-toast',
          })
        })
    } else {
      setSelectedSupplierSite([])
      // setSupplierSiteExisting('')
      setSupplierSiteExisting('')
    }
  }

  const handleSupplierSiteNew = (e: any) => {
    if (e) {
      setSelectedSupplierSiteNew(e)
      console.log(e)
      setSupplierSiteNew(e.value)
      getSupplierServiceBySupplierId(e.value)
        .then((res: any) => {
          setSupplierNew(res.data.supplierName)
        })
        .catch((err: any) => {
          setSupplierNew('')
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Supplier site service error',
            life: life,
            className: 'login-toast',
          })
        })
    } else {
      setSelectedSupplierSite([])
      setSupplierSiteNew('')
      //  setSupplierNew('')
    }
  }

  const [xlslItemNotFoundPlanogram, setXlslItemNotFoundPlanogram] =
    useState<any>([])
  const handleUploadDialogOpen = (click: any) => {
    // setDisplayManualErrors(false)
    setUpdateImported([])
    setNewImportedData([])
    if (click === 'finalRangeUploadFile') {
      setFinalRangeState(true)
      setUploadFileClick(false)
      // setUploadedFile({name:'Upload Final Range Distribution'})
      // setActionType({value:'Upload Final Range Distribution'})
      setActionType('Multiple Selection')
      setOpenUploadDialog(true)
      // setXlslPlanogramimportedData([]) // call get endpoint
      setXlslItemNotFoundPlanogram([])
    } else if (click === 'uploadFile') {
      // setFinalRangeState(false)
      setUploadFileClick(true)
      actionType && setOpenUploadDialog(true)
    }
    // setOpenUploadDialog(true)
  }

  const handleUploadDialogClose = () => {
    setOpenUploadDialog(false)
    setUploadedFile(null)
    setActionType('')
    // setFinalRangeState(false)
  }

  const handleFileUpload = (event: any) => {
    setUploadedFile(event.target.files[0])
  }
  const [exceelErrors, setExceelErrors] = useState<any>([])
  const [displayManualErrors, setDisplayManualErrors] = useState<any>(false)
  const [uploadFileClick, setUploadFileClick] = useState<any>(false)

  useEffect(() => {
    console.log('xlslPlanogramimportedData', xlslPlanogramimportedData)
  }, [xlslPlanogramimportedData])
  useEffect(() => {
    console.log('xlslItemNotFoundPlanogram', xlslItemNotFoundPlanogram)
  }, [xlslItemNotFoundPlanogram])

  const uploadFinaleRangeDistribution = (xlData: any) => {
    // setFinalRangeState(false)
    // setFinalRangeState(true)
    setIsProgressLoader(true)
    console.log('xlData', xlData)
    xlData.map((d: any, index: any) => {
      const {
        MIN,
        NewShelfFillUnits: shelfFillNew,
        StoreCode: storecodeNewMin,
      } = d
      let storeString =
        storecodeNewMin && storecodeNewMin !== '' && storecodeNewMin.toString()
      let storeArray =
        storeString && storeString != ''
          ? storeString.split(',').map((item: any) => {
              return item.trim()
            })
          : ''
      const checkingImportedData: any = importedData.filter((val: any) => {
        if (d.MIN) {
          return val.min === d.MIN.toString()
        } else {
          return val.min === d.MINPIN.toString()
        }
      })
      let updateFlad = 0
      const checkIfExist = xlslPlanogramimportedData.some((item: any) => {
        if (d.MIN) {
          return item.min === d.MIN.toString()
        } else {
          return item.min === d.MINPIN.toString()
        }
      })
      console.log('checkIfExist', checkIfExist)
      console.log('checkingImportedData', checkingImportedData)
      let onlyXl: any = [...xlslPlanogramimportedData]
      if (checkingImportedData.length > 0) {
        // setXlslPlanogramimportedData((prevState: any) => {
        //   return [...prevState, ...checkingImportedData]
        // })
        // setXlslPlanogramimportedData((prevState: any) => {

        let newData: any = [...importedData]
        let index = newData.findIndex(
          (data: any) => data.min === checkingImportedData[0].min
        )
        let indexXlPlano = xlslPlanogramimportedData.findIndex((data: any) => {
          if (d.MIN) {
            return data.min === d.MIN.toString()
          } else {
            return data.min === d.MINPIN.toString()
          }
        })
        console.log('indexXlPlano', indexXlPlano)
        if (index !== -1) {
          updateFlad = 1
          if (
            newData[index].actionType === delistProductMin &&
            newData[index].min === checkingImportedData[0].min &&
            // storecodeNewMin &&
            // // storecodeNewMin.split(',').length > 0
            // storecodeNewMin.split(',').length > 0
            storeArray &&
            storeArray.length > 0
          ) {
            newData[index].showError = true
            newData[index].newnoofrangestoresPlanogram = storeArray.length
            // storecodeNewMin !== 'NA'
            //   ? storecodeNewMin && storecodeNewMin.split(',').length
            //   : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].actionTypePlanogram = newData[index].actionType
            newData[index].storeCodeExpands = storeArray // storecodeNewMin
            // return newData
            if (indexXlPlano !== -1) {
              onlyXl[indexXlPlano] = newData[index]
              // setXlslPlanogramimportedData(onlyXl)
            } else {
              // onlyXl.push(newData[index])
              // newData[index]
            }
          } else if (
            newData[index].actionType === productDistributionIncreaseMin &&
            newData[index].min === checkingImportedData[0].min &&
            // storecodeNewMin &&
            // storecodeNewMin.split(',').length <
            storeArray.length < newData[index].currentnoofrangedstores
          ) {
            newData[index].showError = true
            newData[index].newnoofrangestoresPlanogram = storeArray.length
            // storecodeNewMin && storecodeNewMin.split(',').length

            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].actionTypePlanogram = newData[index].actionType
            newData[index].storeCodeExpands = storeArray // storecodeNewMin
            // return newData
            // onlyXl.push(newData[index])
            if (indexXlPlano !== -1) {
              onlyXl[indexXlPlano] = newData[index]
            } else {
              // onlyXl.push(newData[index])
              // newData[index]
            }
          } else if (
            newData[index].actionType === productDistributionDecreaseMin &&
            newData[index].min === checkingImportedData[0].min &&
            // storecodeNewMin &&
            // storecodeNewMin.split(',').length >
            storeArray.length > newData[index].currentnoofrangedstores
          ) {
            newData[index].showError = true
            newData[index].newnoofrangestoresPlanogram = storeArray.length
            // storecodeNewMin !== 'NA'
            //   ? storecodeNewMin && storecodeNewMin.split(',').length
            //   : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storeArray // storecodeNewMin
            newData[index].actionTypePlanogram = newData[index].actionType
            // return newData
            // onlyXl.push(newData[index])
            if (indexXlPlano !== -1) {
              onlyXl[indexXlPlano] = newData[index]
            } else {
              // onlyXl.push(newData[index])
              // newData[index]
            }
          } else if (
            newData[index].actionType === productShelfSpaceIncrease &&
            newData[index].min === checkingImportedData[0].min &&
            shelfFillNew &&
            shelfFillNew < newData[index].currentShelfFill
          ) {
            newData[index].showError = true
            newData[index].newnoofrangestoresPlanogram = storeArray.length
            // storecodeNewMin !== 'NA'
            //   ? storecodeNewMin && storecodeNewMin.split(',').length
            //   : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storeArray //storecodeNewMin
            newData[index].actionTypePlanogram = newData[index].actionType
            // return newData
            // onlyXl.push(newData[index])
            if (indexXlPlano !== -1) {
              onlyXl[indexXlPlano] = newData[index]
            } else {
              // onlyXl.push(newData[index])
              // newData[index]
            }
          } else if (
            newData[index].actionType === productShelfSpaceDecrease &&
            newData[index].min === checkingImportedData[0].min &&
            shelfFillNew &&
            shelfFillNew > newData[index].currentShelfFill
          ) {
            newData[index].showError = true
            newData[index].newnoofrangestoresPlanogram = storeArray.length
            // storecodeNewMin !== 'NA'
            //   ? storecodeNewMin && storecodeNewMin.split(',').length
            //   : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storeArray //storecodeNewMin
            newData[index].actionTypePlanogram = newData[index].actionType
            // onlyXl.push(newData[index])
            if (indexXlPlano !== -1) {
              onlyXl[indexXlPlano] = newData[index]
            } else {
              // onlyXl.push(newData[index])
              // newData[index]
            }
            // return newData
          } else {
            newData[index].newnoofrangestoresPlanogram =
              storecodeNewMin !== 'NA'
                ? // ? storecodeNewMin && storecodeNewMin.split(',').length
                  storeArray.length
                : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storeArray // storecodeNewMin
            newData[index].actionTypePlanogram = newData[index].actionType
            newData[index].showError = false
            // return newData
            // onlyXl.push(newData[index])
            if (indexXlPlano !== -1) {
              onlyXl[indexXlPlano] = newData[index]
            } else {
              // onlyXl.push(newData[index])
              // newData[index]
            }
          }
        }
        setXlslPlanogramimportedData((prevState: any) => {
          console.log('planoData onlyXl', [...prevState, ...onlyXl])
          if (indexXlPlano !== -1) {
            prevState[indexXlPlano] = newData[index]
            return [...prevState]
          } else {
            return [...prevState, newData[index]]
          }
          // return [...prevState, ...onlyXl]
        })
      } else {
        // if (updateFlad === 0) {
        setXlslItemNotFoundPlanogram((prevState: any) => {
          return [...prevState, d.MIN.toString()]
        })
      }

      // setXlslPlanogramimportedData((prevState: any) => {
      //   return [...prevState, ...onlyXl]
      // })
    })

    console.log('setFinalRangeState', finalRangeState)
    setDisplayManualErrors(true)
    setPanogramErrorDialogShow(true)
    setIsProgressLoader(false)
    return console.log('Sridhar')
  }
  const [finalApiErrorOp, setFinalApiErrorOp] = useState<any>([])
  useEffect(() => {}, [finalApiErrorOp])

  const updatingErrorsWithValues = () => {
    finalApiErrorOp.map((d: any, index: any) => {
      const {
        actionType,
        itemNumber,
        newShelfFill: shelfFillNew,
        storeNumber: storecodeNewMin,
        uploadStatus,
      } = d
      console.log('importedDatafinal', importedData)
      const finalApi: any = importedData.filter((val: any) => {
        return val.min == d.itemNumber
      })
      let onlyXlFinalApi: any = []
      let checkExists = xlslPlanogramimportedData.some(
        (m: any) => m.min == itemNumber
      )
      if (finalApi.length > 0 && checkExists === false) {
        let newData: any = importedData
        let index = newData.findIndex((data: any) => data.min == itemNumber)
        if (index !== -1) {
          if (
            actionType === delistProductMin &&
            newData[index].min == itemNumber &&
            storecodeNewMin &&
            // storecodeNewMin.split(',').length > 0
            storecodeNewMin.length > 0
          ) {
            newData[index].actionTypePlanogram = actionType
            newData[index].showError = uploadStatus === 'ERROR' ? true : false
            newData[index].newnoofrangestoresPlanogram =
              storecodeNewMin !== 'NA'
                ? storecodeNewMin && storecodeNewMin.length
                : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storecodeNewMin
            // return newData
            onlyXlFinalApi.push(newData[index])
          } else if (
            actionType === productDistributionIncreaseMin &&
            newData[index].min == itemNumber &&
            storecodeNewMin &&
            storecodeNewMin.length < newData[index].currentnoofrangedstores
          ) {
            newData[index].actionTypePlanogram = actionType
            newData[index].showError = uploadStatus === 'ERROR' ? true : false
            newData[index].newnoofrangestoresPlanogram =
              storecodeNewMin && storecodeNewMin.length

            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storecodeNewMin
            // return newData
            onlyXlFinalApi.push(newData[index])
          } else if (
            actionType === productDistributionDecreaseMin &&
            newData[index].min == itemNumber &&
            storecodeNewMin &&
            storecodeNewMin.length > newData[index].currentnoofrangedstores
          ) {
            newData[index].actionTypePlanogram = actionType
            newData[index].showError = uploadStatus === 'ERROR' ? true : false
            newData[index].newnoofrangestoresPlanogram =
              storecodeNewMin !== 'NA'
                ? storecodeNewMin && storecodeNewMin.length
                : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storecodeNewMin
            // return newData
            onlyXlFinalApi.push(newData[index])
          } else if (
            actionType === productShelfSpaceIncrease &&
            newData[index].min == itemNumber &&
            shelfFillNew &&
            shelfFillNew < newData[index].currentShelfFill
          ) {
            newData[index].actionTypePlanogram = actionType
            newData[index].showError = uploadStatus === 'ERROR' ? true : false
            newData[index].newnoofrangestoresPlanogram =
              storecodeNewMin !== 'NA'
                ? storecodeNewMin && storecodeNewMin.length
                : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storecodeNewMin
            // return newData
            onlyXlFinalApi.push(newData[index])
          } else if (
            actionType === productShelfSpaceDecrease &&
            newData[index].min == itemNumber &&
            shelfFillNew &&
            shelfFillNew > newData[index].currentShelfFill
          ) {
            newData[index].actionTypePlanogram = actionType
            newData[index].showError = uploadStatus === 'ERROR' ? true : false
            newData[index].newnoofrangestoresPlanogram =
              storecodeNewMin !== 'NA'
                ? storecodeNewMin && storecodeNewMin.length
                : ''
            newData[index].newShelfFillPlanogram = shelfFillNew
            newData[index].storeCodeExpands = storecodeNewMin
            onlyXlFinalApi.push(newData[index])
            // return newData
          }
          // return newData
        }
        // return newData
        // return newData
        // })
      }
      setXlslPlanogramimportedData((prevState: any) => {
        console.log('planoData onlyXl', [...prevState, ...onlyXlFinalApi])
        return [...prevState, ...onlyXlFinalApi]
      })
    })
  }

  const excelDatetoDate = (eDate: any) => {
    if (!isNaN(eDate)) {
      let date1 = Math.round((eDate - (25568 + 1)) * 86400 * 1000)
      console.log(date1)
      if (!isNaN(date1)) {
        console.log(date1)
        let date = new Date(Math.round((eDate - (25568 + 1)) * 86400 * 1000))
          .toISOString()
          .split('T')[0]
        return date
      } else {
        console.log(null)
        return ''
      }
    } else {
      return ''
    }
  }

  const handleUpload = (e: any) => {
    // e.preventDefault();
    handleUploadDialogClose()
    setExceelErrors([])
    if (
      uploadedFile &&
      (uploadedFile.type === 'text/csv' ||
        uploadedFile.type === 'application/vnd.ms-excel' ||
        uploadedFile.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ) {
      console.log(uploadedFile)
      import('xlsx').then((xlsx) => {
        const reader = new FileReader()
        reader.onload = (event: any) => {
          const wb = xlsx.read(event.target.result, { type: 'array' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const data = xlsx.utils.sheet_to_json(ws) //dateNF:'yyyy-mm-dd'}

          const data1 = xlsx.utils.sheet_to_json(ws, { header: 1 })
          const cols: any = data1[0]

          const json = JSON.parse(
            // JSON.stringify(data).replace(/ /g, '_')
            JSON.stringify(data).replace(/"\s+|\s+"/g, '"')
          )

          const convert = (obj: any) => {
            const result: any = {}

            Object.keys(obj).forEach(function (key: any) {
              result[key.replace(/ /g, '').replace(/[()|/]/g, '')] = obj[key]
            })
            return result
          }

          var result = json.map(function (o: any) {
            return convert(o)
          })
          console.log('trimSpace', result)
          if (finalRangeState) {
            return uploadFinaleRangeDistribution(result)
          }

          result.map((d: any, index: any) => {
            let storeString =
              d.StoreCode && d.StoreCode !== '' && d.StoreCode.toString()
            let storeArray =
              storeString && storeString != ''
                ? storeString.split(',').map((item: any) => {
                    return item.trim()
                  })
                : ''

            var effectiveDateFrom = d.EffectiveDateFrom
              ? excelDatetoDate(d.EffectiveDateFrom) !== ''
                ? excelDatetoDate(d.EffectiveDateFrom)?.toString()
                : null
              : null

            var effectiveDateTo = d.EffectiveDateTo
              ? excelDatetoDate(d.EffectiveDateTo) !== ''
                ? excelDatetoDate(d.EffectiveDateTo)?.toString()
                : null
              : null
            var minValue = d.MIN
              ? d.MIN.toString()
              : d.MINPIN && d.MINPIN.toString()

            console.log('props date', effectiveDateFrom, effectiveDateTo)

            console.log('props data', d)
            if (
              d.ActionType &&
              d.ActionType === delistProductMin &&
              (actionType.value === delistProductMin ||
                actionType.value === 'Multiple Selection') && //for multipe excel files upload remove actionType.value in all types
              // actionType.includes(delistProductMin)
              d.MINPIN !== undefined //for multipe excel files upload remove actionType.value in all types
              // || actionType === undefined
            ) {
              getAndCheckItemNumber([
                minValue,
                delistProductMin,
                index + 1,
                d.Comments, //optional
                'NA',
                'NA',
                'NA',
                'NA',
                'NA',
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === newProductMin &&
              (actionType.value === newProductMin ||
                actionType.value === 'Multiple Selection') &&
              d.MINPIN !== undefined
            ) {
              getAndCheckItemNumber([
                minValue,
                newProductMin,
                index + 1,
                d.Comments, //optional
                // d.NewNumberofRangeStores, //optional
                d.IndicativeNoofStores,
                // d.StoreCode, //optional
                storeArray,
                'NA',
                'NA',
                'NA',
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === delistIngredientMin &&
              (actionType.value === delistIngredientMin ||
                actionType.value === 'Multiple Selection')
            ) {
              getAndCheckItemNumber([
                minValue,
                delistIngredientMin,
                index + 1,
                d.Comments, //optional
                'NA',
                'NA',
                'NA',
                'NA',
                'NA',
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === newIngredientMin &&
              (actionType.value === newIngredientMin ||
                actionType.value === 'Multiple Selection')
            ) {
              getAndCheckItemNumber([
                minValue,
                newIngredientMin,
                index + 1,
                d.Comments, //optional
                'NA',
                'NA',
                'NA',
                'NA',
                'NA',
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === delistOutercaseCode &&
              (actionType.value === delistOutercaseCode ||
                actionType.value === 'Multiple Selection')
            ) {
              getAndCheckItemNumber([
                d.MINPIN,
                delistOutercaseCode,
                index + 1,
                d.Comments, //optional
                'NA',
                'NA',
                effectiveDateFrom, //optional
                effectiveDateTo, //optional
                'NA',
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === newOutercaseCode &&
              (actionType.value === newOutercaseCode ||
                actionType.value === 'Multiple Selection')
            ) {
              getAndCheckItemNumber([
                d.MINPIN,
                newOutercaseCode,
                index + 1,
                d.Comments, //optional
                'NA',
                'NA',
                effectiveDateFrom, //optional
                effectiveDateTo, //optional
                'NA',
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === productShelfSpaceIncrease &&
              (actionType.value === productShelfSpaceIncrease ||
                actionType.value === 'Multiple Selection')
            ) {
              getAndCheckItemNumber([
                minValue, // Mandatory
                productShelfSpaceIncrease,
                index + 1,
                d.Comments,
                'NA',
                'NA',
                'NA',
                'NA',
                d.NewShelfFillUnits, // Mandatory //replace field name
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === productShelfSpaceDecrease &&
              (actionType.value === productShelfSpaceDecrease ||
                actionType.value === 'Multiple Selection')
            ) {
              getAndCheckItemNumber([
                minValue, // Mandatory
                productShelfSpaceDecrease,
                index + 1,
                d.Comments,
                'NA',
                'NA',
                'NA',
                'NA',
                d.NewShelfFillUnits, // Mandatory //replace field name
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === supplyChange &&
              (actionType.value === supplyChange ||
                actionType.value === 'Multiple Selection')
            ) {
              getAndCheckItemNumber([
                minValue, // Mandatory
                supplyChange,
                index + 1,
                d.Comments, //optional
                d.IndicativeNoofStores
                  ? d.IndicativeNoofStores
                  : storeArray != ''
                  ? storeArray.length
                  : null,
                storeArray,
                effectiveDateFrom, // Mandatory
                effectiveDateTo, //optional
                'NA',
                d.SupplierCode, // Mandatory
                d.SupplierSiteCode, //optional
                d.NewSupplier, // Mandatory
                d.NewSupplierSite, //optional
              ])
            } else if (
              d.ActionType &&
              d.ActionType === productDistributionDecreaseMin &&
              // actionType.includes(productDistributionDecreaseMin) &&
              (actionType.value === productDistributionDecreaseMin ||
                actionType.value === 'Multiple Selection') &&
              d.NewNumberofStoresRestrictions !== undefined
            ) {
              getAndCheckItemNumber([
                minValue, // Mandatory
                productDistributionDecreaseMin,
                index + 1,
                d.Comments, //optional
                // d.NewNumberofRangeStores, // Mandatory
                // d.NewNumberofStoresRestrictions, // Mandatory // when deploy
                // d.IndicativeNoofStores,
                storeCodeLength - storeArray.length,
                // d.StoreCode, //optional
                storeArray,
                'NA',
                'NA',
                'NA',
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === productDistributionIncreaseMin &&
              (actionType.value === productDistributionIncreaseMin ||
                actionType.value === 'Multiple Selection')
            ) {
              getAndCheckItemNumber([
                minValue, //Mandatory
                productDistributionIncreaseMin,
                index + 1,
                d.Comments, //optional
                // d.NewNumberofRangeStores, //optional
                //d.IndicativeNoofStores,
                storeArray.length + storeCodeLength,
                // d.StoreCode, //optional
                storeArray,
                'NA',
                'NA',
                'NA',
                '',
                '',
                '',
                '',
              ])
            } else if (
              d.ActionType &&
              d.ActionType === placeholderMin &&
              (actionType.value === placeholderMin ||
                actionType.value === 'Multiple Selection')
            ) {
              //placeholder do here for bulk upload
              console.log('inside placeholder', d)
              if (d.hasOwnProperty('Barcode') && d.Barcode != '') {
                console.log('inside barcode')
                getProductServiceByItemnumber(d.Barcode)
                  .then((res: any) => {
                    console.log('myResponse', res.data)
                    toast.current.show({
                      severity: 'error',
                      summary: 'Error',
                      detail: `${d.Barcode} already exists`,
                      life: life,
                      className: 'login-toast',
                    })
                    setExceelErrors((prevState: any) => {
                      return [...prevState, d]
                    })
                  })
                  .catch((err: any) => {
                    console.log('sss', err)
                    let newData: any = []
                    var minVal = 1000000000000
                    var max = 9999999999999
                    var rand = Math.floor(
                      minVal + Math.random() * (max - minVal)
                    )

                    newData.push({
                      _idCheck: rand,
                      actionType: placeholderMin,
                      min: '',
                      comments: '',
                      lineStatus: 'Draft',
                      man: '',
                      ingredientMin: '',
                      pin: '',
                      description: d.MINPINDescription,
                      replaceMin: '',
                      replaceMinDescription: '',
                      existingSupplier: '',
                      existingSupplierSite: '',
                      numberOfRangeStores: '',
                      storeCode: '',
                      ownBrand: d.OWNBrand,
                      // barcode: i === 0 ? '5010228012933' : '501022801293' + i,
                      barcode: d.Barcode,
                      packquantity: '',
                      local: 'Y',
                      onlineCFC: 'Y',
                      onlineStorePick: 'Y',
                      wholesale: 'Y',
                    })
                    if (importedData && importedData.length > 0) {
                      console.log('setting importedData')
                      setImportedData((prevState: any) => {
                        return [...prevState, ...newData]
                      })
                    } else {
                      setImportedData(newData)
                    }
                    toast.current.show({
                      severity: 'success',
                      summary: 'Success',
                      detail: `Placeholder added`,
                      life: life,
                      className: 'login-toast',
                    })
                  })
              } else {
                console.log('inside else')

                let newData: any = []
                var minVal = 1000000000000
                var max = 9999999999999
                var rand = Math.floor(minVal + Math.random() * (max - minVal))

                newData.push({
                  _idCheck: rand,
                  actionType: placeholderMin,
                  min: '',
                  comments: '',
                  lineStatus: 'Draft',
                  man: '',
                  ingredientMin: '',
                  pin: '',
                  description: d.MINPINDescription,
                  replaceMin: '',
                  replaceMinDescription: '',
                  existingSupplier: '',
                  existingSupplierSite: '',
                  numberOfRangeStores: '',
                  storeCode: '',
                  ownBrand: d.OWNBrand,
                  // barcode: i === 0 ? '5010228012933' : '501022801293' + i,
                  barcode: d.Barcode ? d.Barcode : '',
                  packquantity: '',
                  local: 'Y',
                  onlineCFC: 'Y',
                  onlineStorePick: 'Y',
                  wholesale: 'Y',
                })
                if (importedData && importedData.length > 0) {
                  console.log('setting importedData')
                  setImportedData((prevState: any) => {
                    return [...prevState, ...newData]
                  })
                } else {
                  setImportedData(newData)
                }
                toast.current.show({
                  severity: 'success',
                  summary: 'Success',
                  detail: `Placeholder added`,
                  life: life,
                  className: 'login-toast',
                })
              }
            } else {
              console.log(d.MINPIN + 'Error')
              setExceelErrors((prevState: any) => {
                return [...prevState, d]
              })
              // toast.current.show({
              //   severity: 'error',
              //   summary: 'Error',
              //   detail: `Barcode field is empty`,
              //   life: life,
              //   className: 'login-toast',
              // })
            }
          })

          // console.log(newData)
          // if (importedData && importedData.length > 0) {
          //   setImportedData((prevState: any) => {
          //     return [...prevState, ...newData]
          //   })
          // } else {
          //   setImportedData([...newData])
          // }
        }
        setActionType('')
        reader.readAsArrayBuffer(uploadedFile)
      })
    } else {
      alert('Upload correct file')
      setUploadedFile(null)
    }
  }

  useEffect(() => {
    console.log('exceelErrors', exceelErrors)
  }, [exceelErrors])

  const showExceelErrors = () => {
    return exceelErrors.map((err: any) => {
      if (err.MINPIN) {
        return (
          <span style={{ color: 'red' }}>
            For "{err.ActionType}" & "{err.MINPIN}" all mandatory fields are
            required***{' '}
          </span>
        )
      } else {
        return (
          <span style={{ color: 'red' }}>
            For "{err.ActionType}" & "{err.MIN}" all mandatory fields are
            required***{' '}
          </span>
        )
      }
    })
  }
  // const exceelErrors = (data: any) =>
  //   data ? (
  //     <span>{data.MINPIN} Please fill the required fields and upload </span>
  //   ) : (
  //     ''
  //   )

  const uploadDialog = (
    <Dialog open={openUploadDialog} onClose={handleUploadDialogClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={
            finalRangeState
              ? 'Upload Final Range Distribution'
              : `Upload ${actionType && actionType.value}`
          }
          onClose={handleUploadDialogClose}
        />

        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="primary">
            Upload {actionType && actionType.value}
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <input
              type="text"
              value={uploadedFile ? uploadedFile.name : ''}
              onClick={() => document.getElementById('selectedFile')!.click()}
              className={classes.uploadTextfield}
              placeholder="No file selected"
              readOnly
            />
            <Input
              type="file"
              id="selectedFile"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileUpload}
              required
            />
            <button
              type="button"
              onClick={() => document.getElementById('selectedFile')!.click()}
              className={classes.uploadButton}
              style={{ width: '60%' }}
            >
              Browse...
            </button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            p: 2,
            justifyContent: 'right',
          }}
        >
          <Box>
            <Typography color="primary">
              Supported file type in MS Excel
              <i className="pi pi-file-excel" style={{ fontSize: '18px' }}></i>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        >
          <Button
            //   className={classes.submitButtons}
            variant="contained"
            color="primary"
            onClick={handleUpload}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Dialog>
  )

  const [singleTypeError, setSingleTypeError] = useState<any>('')

  const handleActionTypeDialogOpen = () => {
    actionType && setOpenActionTypeDialog(true)
    // if (actionType === 'New Product (MIN)') {
    //   onPageLoadStoreCode()
    // }
    // onPageLoadStoreCode()
  }
  const [supplierOptions, setSupplierOptions] = useState<any>([])
  const handleActionTypeDialogClose = () => {
    setOpenActionTypeDialog(false)
    // setSupplierOptions([])
    setMin('')
    setComments('')
    setNoOfStores('')
    setStoreCode([])
    setSupplierOptions([])
    setNewIngredientError(false)
    setNewShelfFill(0)
    setNewStoreCount(0)
    setSelectedStore([])
  }

  const handleFromDate = (date: any) => {
    // const newDate = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear()
    const newDate =
      parseInt(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      '-' +
      date.getFullYear()
    console.log(newDate)
    setFromDate(newDate)
  }

  const handleToDate = (date: any) => {
    // const newDate = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear()
    const newDate =
      parseInt(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      '-' +
      date.getFullYear()
    console.log(newDate)
    setToDate(newDate)
  }

  const handleAddProduct = (e: any) => {
    e.preventDefault()
    if (
      min ||
      replaceMinOrPin ||
      fromDate ||
      toDate ||
      addStoreCode ||
      comments
    ) {
      if (actionType && actionType.value !== 'Derange MIN') {
        let addData = {
          'action/type': actionType && actionType,
          'min/pin': min && min,
          description: 'NA',
          'replaceMin/pin': replaceMinOrPin ? replaceMinOrPin : 'NA',
          fromDate: fromDate ? fromDate : 'NA',
          toDate: toDate ? toDate : 'NA',
          lineStatus: 'Request For',
          clearancePricing: 'Include in',
          clearDepotBy: 'Week-4',
        }
        console.log(addData)
        if (importedData) {
          setImportedData((prevState: any) => {
            let newData = [...prevState]
            newData.push(addData)
            return newData
          })
        } else {
          setImportedData([addData])
        }
        // let newData = importedData ? [...importedData]: []
        // newData.push(addData)
        // console.log(newData);
        handleActionTypeDialogClose()
      }
    }
  }
  // console.log('minValue', minValue)
  // getProductServiceByItemnumber &&
  //   getProductServiceByItemnumber(minValue)
  //     .then((res: any) => {
  //       console.log('Item res 100001498', res)
  //     })
  //     .catch((err: any) => {
  //       console.log('Item err 100001498', err)
  //     })
  const [newImportedData, setNewImportedData] = useState<any>([])
  const [updateImported, setUpdateImported] = useState<any>([])
  const renderApiCall = (props: any) => {
    const [
      values,
      supplierV1,
      minValue,
      type,
      comment,
      newnoofrangestoreNewMin,
      storecodeNewMin,
      delistPin_effectiveDate_From,
      delistPin_effectiveDate_To,
      shelfFillNew,
      supplierExisting_x,
      supplierSiteExisting_x,
      supplierNew_x,
      supplierSiteNew_x,
    ] = props
    console.log('proooops1', props)
    let updateFlag = 0
    var minVal = 1000000000000
    var max = 9999999999999
    var rand = Math.floor(minVal + Math.random() * (max - minVal))
    console.log('render id check', rand)
    const formData: any = {
      _idCheck: rand,
      actionType: type,
      lineStatus:
        actionTypeSelected === delistProductMin || type === delistProductMin
          ? 'Request For Stock Count'
          : 'Draft',
      min: min ? min : minValue ? minValue : '',
      pin: '',
      ingredientMin: '',
      ingredientDetails: '',
      legacyItemNumbers: '',
      man: '',
      description: '',
      replaceMin: '',
      replaceMinDescription: '',
      unitretailInc: '',
      unitretailEx: '',
      unitcost: '',
      casecost: '',
      packquantity: '',
      supplierId: '',
      supplierSiteNameCode: '',
      local: type === supplyChange || type === placeholderMin ? '' : 'Y',
      perStorepPerWeek: '',
      onlineCFC: 'Y',
      onlineStorePick: 'Y',
      wholesale: 'Y',
      currentnoofrangedstores: 0,
      numberOfRangeStores: 0, //current
      // numberOfRangeStores:"",
      currentVersusNewStores:
        type === delistProductMin ||
        type === productDistributionDecreaseMin ||
        type === productDistributionIncreaseMin ||
        type === productShelfSpaceIncrease ||
        type === productShelfSpaceDecrease
          ? 0
          : null,
      storesRangedCurrentVsProposed:
        type === delistProductMin ||
        type === productDistributionDecreaseMin ||
        type === productDistributionIncreaseMin ||
        type === productShelfSpaceIncrease ||
        type === productShelfSpaceDecrease
          ? 0
          : null,
      currentShelfFill: 0,
      newShelfFill: 0,
      currentshelffill_vs_newfill:
        type === productDistributionDecreaseMin ||
        type === productDistributionIncreaseMin ||
        type === productShelfSpaceIncrease ||
        type === productShelfSpaceDecrease
          ? 0
          : null,
      currentshelffill_vs_newfill_percant:
        type === productDistributionDecreaseMin ||
        type === productDistributionIncreaseMin ||
        type === productShelfSpaceIncrease ||
        type === productShelfSpaceDecrease
          ? 0
          : null,
      ownBrand: 'Y',
      includeInClearancePricing: '',
      includeInStoreWastage: '',
      clearDepotBy: '',
      supplierCommitment: '',
      finalStopOrderDate: '',
      systemSuggestedStopOrderDate: '',
      lastPoDate: '',
      depotShelfLifeMinimum: '',
      productShelfLifeInstore: '',
      shelfLifeatManufacture: '',
      totalstock: '',
      storeStockUnit: '',
      depotStockUnit: '',
      openPos: '',
      forward_forecast_to_launch: '',
      averageWeeklyVolume: '',
      weeksCoveronTotalStockonHandtoResetDate: '',
      forcastedWeeksCovertoResetDate: '',
      excessstock: '',
      safewaybrandedequivalent: '',
      effectiveDateFrom: '',
      effectiveDateTo: '',
      existingSupplier: '',
      existingSupplierSite: '',
      noOfRecipeMin: '',
      depotClearbyReservedQtyRetail: '',
      depotClearbyReservedQtyWholesale: '',
      depotClearbyReservedQtyOnline: '',
      depotClearbyReservedQtyTotal: '',
      comments: comments,
      //Additional below keys:
      storeCode: '',
      pinArray: '',
      purchaseOrderIfExistsInSummary: '',
      storeNumbersForspecificStoreRange: '',
    }
    console.log('values-promise.allSettled', values)
    values.map((val: any) => {
      if (val.status === 'rejected') {
        setIsProgressLoader(false)
        return
      } else {
        console.log('FULLFILLED', val.statu)
      }
    })
    // console.log('JSON_VALUE1', JSON.stringify(values[1].value.data))
    const productServieResponse1 = values[0]

    if (productServieResponse1.status !== 'rejected') {
      // formData.pin = productServieResponse1.value.data.packs[0].packNumber //pin
      formData.pin = productServieResponse1.value.data.packs
        ? productServieResponse1.value.data.packs.length > 0
          ? productServieResponse1.value.data.packs[0].packNumber
          : ''
        : '' //pin
      formData.packquantity = productServieResponse1.value.data.packs
        ? productServieResponse1.value.data.packs.length > 0
          ? parseInt(productServieResponse1.value.data.packs[0].packQuantity)
          : ''
        : '' // Packquantity
      formData.pinArray = productServieResponse1.value.data.packs //total packs array
      formData.man = productServieResponse1.value.data.parentItemNumber // parentItemNumber
      // formData.packquantity = parseInt(
      //   productServieResponse1.value.data.packs[0].packQuantity
      // ) // Packquantity
      formData.description = productServieResponse1.value.data.itemDescription // itemDescription
      // formData.legacyItemNumbers =
      //   productServieResponse1.value.data.legacyItemNumbers //legacyItemNumbers
      formData.legacyItemNumbers = productServieResponse1.value.data
        .legacyItemNumbers
        ? productServieResponse1.value.data.legacyItemNumbers.join()
        : '' //legacyItemNumbers
      formData.depotShelfLifeMinimum =
        productServieResponse1.value.data.hasOwnProperty('productLife') &&
        (type === delistProductMin ||
          type === delistOutercaseCode ||
          type === delistIngredientMin ||
          type === productShelfSpaceDecrease ||
          type === productShelfSpaceIncrease ||
          type === productDistributionIncreaseMin ||
          type === productDistributionDecreaseMin)
          ? productServieResponse1.value.data.productLife
              .minimumAcceptableProductLifedays
          : null
      formData.productShelfLifeInstore =
        productServieResponse1.value.data.hasOwnProperty('productLife') &&
        (type === delistProductMin ||
          type === delistOutercaseCode ||
          type === delistIngredientMin ||
          type === productShelfSpaceDecrease ||
          type === productShelfSpaceIncrease ||
          type === productDistributionIncreaseMin ||
          type === productDistributionDecreaseMin)
          ? productServieResponse1.value.data.productLife.productExpirationDays
          : null
      formData.shelfLifeatManufacture =
        productServieResponse1.value.data.hasOwnProperty('productLife')
          ? productServieResponse1.value.data.productLife
              .productLifeAtTimeOfManufacture
          : null
      if (type === delistOutercaseCode) {
        formData.effectiveDateFrom = delistPin_effectiveDate_From
        formData.effectiveDateTo = delistPin_effectiveDate_To
        formData.comments = comments === '' ? comment : comments
      }
      if (type === newOutercaseCode) {
        formData.effectiveDateFrom = delistPin_effectiveDate_From
        formData.effectiveDateTo = delistPin_effectiveDate_To
        formData.comments = comments === '' ? comment : comments
      }
      if (type === supplyChange) {
        // supplierExisting_x,
        // supplierSiteExisting_x,
        // supplierNew_x,
        // supplierSiteNew_x,
        formData.numberOfRangeStores = newnoofrangestoreNewMin
        formData.existingSupplier = supplierExisting_x
        formData.existingSupplierSite = supplierSiteExisting_x
        formData.newSupplier = supplierNew_x
        formData.newSupplierSite = supplierSiteNew_x
        formData.effectiveDateFrom = delistPin_effectiveDate_From
        formData.effectiveDateTo = delistPin_effectiveDate_To
        formData.comments = comments === '' ? comment : comments
      }
    }
    // formData.supplierId = supplierV1.supplierName;
    // formData.supplierSiteNameCode = supplierV1.supplierSiteNameCode;
    // formData.existingSupplier = supplierV1.supplierName
    // formData.existingSupplierSite = supplierV1.supplierSiteNameCode
    //sridhar
    if (values[1].status !== 'rejected') {
      const summaryData = values[1].value.data
      formData.existingSupplierSite = summaryData.primaryOrder.supplierId
      formData.existingSupplier = ''
      supplerNameBySupplierCode(
        summaryData.primaryOrder.supplierId,
        min,
        importedData
      )

      //setCheckExistingSupplier(false)
    } else if (supplierV1) {
      // formData.existingSupplier = 'Sridhar'
      formData.existingSupplier = supplierV1.supplierName
      formData.existingSupplierSite = supplierV1.supplierSiteNameCode
      // setCheckExistingSupplier(true)
    } else {
      formData.existingSupplier = 'No data in summary and service'
      formData.existingSupplierSite = ''
    }
    if (values[1].value) {
      const rangeIdMinV1 = values[1].value.data //
      formData.lastPoDate = rangeIdMinV1.lastPODate //rangeresetIdMinService
      formData.openPos = rangeIdMinV1.totalOpenPurchaseOrders //rangeresetIdMinService
      formData.clearDepotBy = rangeIdMinV1.depotClearWeek //rangeresetIdMinService
      formData.includeInClearancePricing = rangeIdMinV1.clearancePriceCheck //rangeresetId
      formData.includeInStoreWastage = rangeIdMinV1.clearancePriceCheck //rangeresetId
      // formData.storeNumbersForspecificStoreRange = '' // need to work for delist
      if (
        rangeIdMinV1.purchaseOrders !== null &&
        rangeIdMinV1.purchaseOrders.locations.length > 0
      ) {
        formData.pin = '' // no pin num in purchase order.
        formData.packquantity =
          rangeIdMinV1.purchaseOrders.locations[0].history.orders[0].qty
        // formData.purchaseOrderIfExistsInSummary =
      } else if (
        productServieResponse1.status !== 'rejected' &&
        rangeIdMinV1.purchaseOrders.locations.length === 0
      ) {
        formData.pin = productServieResponse1.value.data.packs
          ? productServieResponse1.value.data.packs.length > 0
            ? productServieResponse1.value.data.packs[0].packNumber
            : ''
          : '' //pin
        formData.packquantity = productServieResponse1.value.data.packs
          ? productServieResponse1.value.data.packs.length > 0
            ? parseInt(productServieResponse1.value.data.packs[0].packQuantity)
            : ''
          : '' // Packquantity
      }
    }

    if (
      type === delistProductMin ||
      type === newProductMin ||
      type === productDistributionIncreaseMin ||
      type === productDistributionDecreaseMin ||
      type === productShelfSpaceIncrease ||
      type === productShelfSpaceDecrease
    ) {
      formData.comments = comments === '' ? comment : comments
      if (productServieResponse1.status !== 'rejected') {
        // formData.ingredientMin = parseInt(
        //   productServieResponse1.value.data.ingredients.length
        // )
      }
      if (values[3].value) {
        if (
          values[3].value.data.ItemDetails[0].hasOwnProperty(
            'ingredientDetails'
          )
        ) {
          formData.ingredientDetails =
            values[3].value.data.ItemDetails[0].ingredientDetails
          formData.ingredientMin =
            values[3] &&
            values[3].value.data.ItemDetails[0].ingredientDetails.length
        }
        if (values[3].value.data.ItemDetails) {
          formData.noOfRecipeMin = values[3].value.data.ItemDetails.length
          formData.recipeDetails = values[3].value.data.ItemDetails
        }
      }
    }

    if (
      type !== placeholderMin ||
      type !== delistOutercaseCode ||
      type !== newOutercaseCode ||
      type !== supplyChange
    ) {
      if (productServieResponse1.status !== 'rejected') {
        // formData.ingredientMin = parseInt(
        //   productServieResponse1.value.data.ingredients.length
        // )
        if (values[3].value) {
          if (values[3].value.data.ItemDetails) {
            formData.noOfRecipeMin = values[3].value.data.ItemDetails.length
            formData.recipeDetails = values[3].value.data.ItemDetails
          }
        }
      }
    }

    if (
      type === newProductMin ||
      type === productDistributionDecreaseMin ||
      type === productDistributionIncreaseMin
    ) {
      // formData.storeCode = storecodeNewMin ? storecodeNewMin.join(',') : ''
      // formData.storeCode =
      //   typeof storecodeNewMin === 'string'
      //     ? storecodeNewMin
      //     : storecodeNewMin
      //     ? storecodeNewMin.join(',')
      //     : ''
      console.log('storecode select', storecodeNewMin)
      formData.storeCode = storecodeNewMin ? storecodeNewMin : ''
      formData.numberOfRangeStores = newnoofrangestoreNewMin
      formData.comments = comments === '' ? comment : comments
    }
    if (type === delistIngredientMin) {
      formData.comments = comments === '' ? comment : comments
    }
    if (type === newIngredientMin) {
      formData.comments = comments === '' ? comment : comments
    }
    if (type === productShelfSpaceIncrease) {
      formData.newShelfFill = shelfFillNew === '' ? 'NA' : shelfFillNew
      formData.comments = comments === '' ? comment : comments
    }
    if (type === productShelfSpaceDecrease) {
      formData.newShelfFill = shelfFillNew
      formData.comments = comments === '' ? comment : comments
    }
    // formData.newShelfFill = shelfFillNew
    formData.showErrorProduct = false

    if (importedData && importedData.length > 0) {
      // if (finalRangeState) {
      // let minCheck = importedData.findIndex(
      //   (data: any) => data.min === formData.min
      // )
      // let newData = [...importedData]
      // if (minCheck !== -1) {
      //   updateFlag = 1
      //   newData[minCheck].storeCode = storecodeNewMin ? storecodeNewMin : ''
      //   newData[minCheck].newShelfFill = shelfFillNew
      //   // newData[minCheck]['newAdded'] = true
      //   setUpdateImported(newData)
      // } else {
      //   formData.storeCode = storecodeNewMin ? storecodeNewMin : ''
      //   formData.actionType = newProductMin
      //   formData.newShelfFill = shelfFillNew
      //   // formData.lineStatus = 'Draft'
      //   formData.newAdded = true
      //   setNewImportedData([formData])
      // }
      // } else {
      //importedsetting
      setImportedData((prevState: any) => {
        let newData: any = [...prevState]
        let index = newData.findIndex((data: any) => data.min === formData.min)
        if (index !== -1) {
          updateFlag = 1
          console.log('imported 1')
          if (
            formData.actionType === delistProductMin &&
            formData.storeCode &&
            formData.storeCode.length > 0
          ) {
            // newData[index].showErrorProduct = true
            newData[index].actionType = formData.actionType
          } else if (
            formData.actionType === productDistributionIncreaseMin &&
            formData.numberOfRangeStores &&
            formData.numberOfRangeStores <
              newData[index].currentnoofrangedstores
          ) {
            // newData[index].showErrorProduct = true
            newData[index].actionType = formData.actionType
            newData[index].numberOfRangeStores =
              formData.numberOfRangeStores && formData.numberOfRangeStores
            newData[index].storeCode = formData.storeCode && formData.storeCode
          } else if (
            formData.actionType === productDistributionDecreaseMin &&
            formData.storeCode &&
            formData.numberOfRangeStores &&
            formData.numberOfRangeStores >
              newData[index].currentnoofrangedstores
          ) {
            // newData[index].showErrorProduct = true
            newData[index].actionType = formData.actionType
            newData[index].numberOfRangeStores =
              formData.numberOfRangeStores && formData.numberOfRangeStores
            newData[index].storeCode = formData.storeCode && formData.storeCode
          } else if (
            formData.actionType === productShelfSpaceIncrease &&
            formData.newShelfFill &&
            formData.newShelfFill < newData[index].currentShelfFill
          ) {
            // newData[index].showErrorProduct = true
            newData[index].actionType = formData.actionType
            newData[index].newShelfFill =
              formData.newShelfFill && formData.newShelfFill
          } else if (
            formData.actionType === productShelfSpaceIncrease &&
            formData.newShelfFill &&
            formData.newShelfFill > newData[index].currentShelfFill
          ) {
            // newData[index].showErrorProduct = true
            newData[index].actionType = formData.actionType
            newData[index].newShelfFill =
              formData.newShelfFill && formData.newShelfFill
          } else {
            // newData[index].showErrorProduct = false
            newData[index].actionType = formData.actionType
            newData[index].numberOfRangeStores =
              formData.numberOfRangeStores && formData.numberOfRangeStores
            newData[index].storeCode = formData.storeCode && formData.storeCode
            newData[index].newShelfFill =
              formData.newShelfFill && formData.newShelfFill
          }
          // newData[index] = formData
          return newData
        } else {
          console.log('imported 2')
          // newData.append([formData])
          return [...prevState, formData]
        }
      })
      // // return newData
      // // return [...prevState, formData]
      // }
    } else {
      console.log('imported 3')
      setImportedData((prevState: any) => {
        if (prevState) {
          return [...prevState, formData]
        } else {
          return [formData]
        }
      })
    }
    // let existingData = [...importedData]
    // if (existingData && existingData.length > 0) {
    //   let minCheck = existingData.findIndex(
    //     (data: any) => data.min === formData.min
    //   )
    //   let newData = existingData
    //   if (minCheck !== -1) {
    //     updateFlag = 1
    //     newData[minCheck].storeCode =
    //       storecodeNewMin !== 'NA' ? storecodeNewMin : ''
    //     newData[minCheck].newShelfFill = shelfFillNew
    //     formData.newAdded = true
    //   } else {
    //     formData.storeCode = storecodeNewMin
    //     formData.actionType = newProductMin //"Sridhar "+minCheck
    //     formData.newShelfFill = shelfFillNew
    //     // formData.lineStatus = 'Draft'
    //     formData.newAdded = true
    //     setNewImportedData([formData])
    //   }
    // } else {
    //   setImportedData([formData])
    // }

    // if (importedData && importedData.length > 0) {
    //   // let newData: any = importedData
    //   // importedData.map((data: any, index: any) => {
    //   //   let placeholderCheck = formData.actionType === placeholderMin
    //   //   let minCheck = data.min === formData.min
    //   //   console.log('placeCheck', formData.actionType)
    //   //   console.log(data.min, formData.min)
    //   //   if (!placeholderCheck && minCheck) {
    //   //     let singleData = formData
    //   //     singleData._idCheck = data._idCheck
    //   //     newData[index] = singleData
    //   //   } else {
    //   //     newData.push(formData)
    //   //   }
    //   // })
    //   let minCheck = importedData.findIndex(
    //     (data: any) => data.min === formData.min
    //   )
    //   console.log('mincheck1', minCheck)
    //   if (minCheck !== -1) {
    //     updateFlag = 1
    //     let newData = importedData
    //     let idCheck = importedData[minCheck]._idCheck
    //     formData._idCheck = idCheck
    //     newData[minCheck] = formData
    //     setImportedData(newData)
    //   } else {
    //     setImportedData((prevState: any) => {
    //       return [...prevState, formData]
    //     })
    //   }
    // } else {
    //   setImportedData([formData])
    // }
    console.log('formData', formData)
    if (updateFlag === 1) {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        // detail: `${minValue} ${allMessages.success.itemIdUpdate}`,
        detail: `${minValue} Updated`,
        life: life,
        className: 'login-toast',
      })
    } else {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: `${minValue} ${allMessages.success.itemIdSuccess}`,
        life: life,
        className: 'login-toast',
      })
    }
    setIsProgressLoader(false)
    setActionType('')
    setUploadFileClick(false)
    // setFinalRangeState(false)
  }

  useEffect(() => {
    console.log('importedData', newImportedData, updateImported)
    if (updateImported.length > 0 || newImportedData.length > 0) {
      setImportedData([...newImportedData, ...updateImported])
    }
  }, [updateImported, newImportedData])

  // useEffect(() => {
  //   if (newImportedData.length > 0) {
  //     setImportedData([...newImportedData, ...updateImported])
  //   }
  // }, [newImportedData])

  // useEffect(() => {
  //   if (newImportedData.length > 0) {
  //     setImportedData([...updateImported, ...newImportedData])
  //   } else if (newImportedData.length === 0) {
  //     setImportedData(updateImported)
  //   }
  // }, [newImportedData])

  const checkProductCompositionService = (minVal: any) => {
    setIsProgressLoader(true)
    getProductCompositionServiceByItemnumber(minVal)
      // getProductCompositionServiceByItemnumber('112056236')
      .then((res: any) => {
        setNewIngredientError(false)
        setNewIngredient(true)
        setIsProgressLoader(false)
      })
      .catch((err: any) => {
        setNewIngredientError(true)
        setNewIngredient(false)
        setIsProgressLoader(false)
      })
  }

  const [valuesRes, setValuesRes] = useState<any>()

  const getAndCheckItemNumber = (props: any) => {
    let [
      minValue,
      type,
      index,
      comment,
      newnoofrangestoreNewMin,
      storecodeNewMin,
      delistPin_effectiveDate_From,
      delistPin_effectiveDate_To,
      shelfFillNew,
      supplierExisting_x,
      supplierSiteExisting_x,
      supplierNew_x,
      supplierSiteNew_x,
    ] = props
    setIsProgressLoader(true)
    console.log('props', props)
    Promise.allSettled([
      //Dont change sequence order below api calls
      getProductServiceByItemnumber(minValue),
      // getRangeByRangeResetId('3400'),
      // getRangeByIdAndMinNumber('3400', '500000033'),
      // getRangeByIdAndMinNumber(rafpendingActionDetailsCT06.eventId, minValue),
      getRangeResetEventsStoreDepot(
        rafpendingActionDetailsCT06.eventId,
        minValue,
        'store'
      ), //summary
      getProductSupplierServiceByItemnumber(minValue),
      // getProductCompositionServiceByItemnumber()
      // getProductCompositionServiceByItemnumber('112056236'),
      getProductCompositionServiceByItemnumber(minValue),
    ])
      .then((values: any) => {
        console.log('promise1, promise2', 'promise3', values)
        console.log(eventDetails[0].tradeGroup)
        if (values[0].status === 'rejected') {
          console.log('getProductServiceByItemnumber', 'Item not found')
          setIsProgressLoader(false)
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: `${minValue} ${values[0].reason.response.data.errorMessage}`,
            life: life,
            className: 'login-toast',
          })
          return
        }

        // if (
        //   eventDetails &&
        //   eventDetails[0].tradeGroup !==
        //     values[0].value.data.reportingHierarchy.groupName
        // ) {
        //   setIsProgressLoader(false)
        //   toast.current.show({
        //     severity: 'error',
        //     summary: 'Error',
        //     detail: allMessages.error.RafTradingGroupError,
        //     life: life,
        //     className: 'login-toast',
        //   })
        //   return
        // }
        // if (
        //   eventDetails &&
        //   eventDetails[0].categoryId &&
        //   eventDetails[0].categoryId.toString() !==
        //     values[0].value.data.reportingHierarchy.category
        // ) {
        //   setIsProgressLoader(false)
        //   toast.current.show({
        //     severity: 'error',
        //     summary: 'Error',
        //     detail: allMessages.error.RafCategoryError,
        //     life: life,
        //     className: 'login-toast',
        //   })
        //   return
        // }

        // if (
        //   eventDetails &&
        //   eventDetails[0].departmentId &&
        //   eventDetails[0].departmentId.toString() !==
        //     values[0].value.data.reportingHierarchy.department
        // ) {
        //   setIsProgressLoader(false)
        //   toast.current.show({
        //     severity: 'error',
        //     summary: 'Error',
        //     detail: allMessages.error.RafDepartmentError,
        //     life: life,
        //     className: 'login-toast',
        //   })
        //   return
        // }

        if (
          (actionType.value === delistProductMin ||
            actionType.value === productDistributionIncreaseMin ||
            actionType.value === productDistributionDecreaseMin ||
            actionType.value === productShelfSpaceIncrease ||
            actionType.value === productShelfSpaceDecrease ||
            actionType.value === newProductMin ||
            actionType.value === newIngredientMin ||
            actionType.value === delistIngredientMin ||
            actionType.value === supplyChange ||
            actionType.value === placeholderMin) &&
          values[0].value.data.productType !== 'ITEM'
        ) {
          setIsProgressLoader(false)
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: `${minValue} is not a min.`,
            life: life,
            className: 'login-toast',
          })
          return
        }
        if (
          (actionType.value === newOutercaseCode ||
            actionType.value === delistOutercaseCode) &&
          values[0].value.data.productType !== 'PACK'
        ) {
          setIsProgressLoader(false)
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: `${minValue} is not a pin.`,
            life: life,
            className: 'login-toast',
          })
          return
        }

        let values3Supplier = []
        if (values[2].status !== 'rejected') {
          values3Supplier = values[2].value.data.itemSuppliers.filter(
            (val: any) => val.primaryInd === true
          )
        }
        values3Supplier =
          values3Supplier.length === 0 ? 0 : values3Supplier[0].supplierId
        // values3Supplier && values3Supplier.itemSuppliers.filter((val:any) => val.primaryInd === true)
        getSupplierServiceBySupplierId(
          // values3Supplier.itemSuppliers[0].supplierId
          values3Supplier //supplier site id
        )
          .then((res: any) => {
            console.log('Nested APi Success ', res)
            let supplierV1 = {
              supplierName: res.data.supplierName,
              supplierSiteNameCode: res.data.ebsSupplierId,
            }

            renderApiCall([
              values,
              supplierV1,
              minValue,
              type,
              comment,
              newnoofrangestoreNewMin,
              storecodeNewMin,
              delistPin_effectiveDate_From,
              delistPin_effectiveDate_To,
              shelfFillNew,
              supplierExisting_x,
              supplierSiteExisting_x,
              supplierNew_x,
              supplierSiteNew_x,
            ])
          })
          .catch((err: any) => {
            setIsProgressLoader(false)
            renderApiCall([
              values,
              'NA',
              minValue,
              type,
              comment,
              newnoofrangestoreNewMin,
              storecodeNewMin,
              delistPin_effectiveDate_From,
              delistPin_effectiveDate_To,
              shelfFillNew,
              supplierExisting_x,
              supplierSiteExisting_x,
              supplierNew_x,
              supplierSiteNew_x,
            ])
            console.log('Nested APi Error', err)
          })
      })
      .catch((err: any) => {
        setIsProgressLoader(false)
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          // detail: `${minValue} ${allMessages.error.itemIdError}`,
          detail: `${minValue} ${allMessages.error.itemIdError}`,
          life: life,
          className: 'login-toast',
        })
        console.error('promise1, ERRor', err)
      })
  }

  const checkingToUpdate = () => {
    if (importedData && importedData.length > 0) {
      let checkingMin = importedData.findIndex((data: any) => data.min === min)
      if (checkingMin !== -1) {
        setCheckMin(true)
        handleActionTypeDialogOpen()
      } else {
        setCheckMin(false)
        setCheckUpdate(true)
        handleManualRAF()
      }
    }
  }

  const handleManualRAF = () => {
    // onPageLoadStoreCode()
    setIsProgressLoader(false)
    setUpdateImported([])
    setNewImportedData([])
    if (min === '') {
      handleActionTypeDialogOpen()
      return
    }
    console.log('clicked')

    // return
    if (actionType.value === delistProductMin) {
      if (min !== '') {
        console.log('hello')
        getAndCheckItemNumber([
          min,
          delistProductMin,
          '',
          comments,
          'NA',
          'NA',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ])
      }
      handleActionTypeDialogClose()
    } else if (actionType.value === newProductMin) {
      // handleActionTypeDialogClose()
      if (min !== '') {
        console.log('hello')
        getAndCheckItemNumber([
          min,
          newProductMin,
          '',
          comments,
          noOfStores,
          selectedStore,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ])
      }
      handleActionTypeDialogClose()
    } else if (actionType.value === delistIngredientMin) {
      // handleActionTypeDialogClose()

      // getProductCompositionServiceByItemnumber('112056236')
      getProductCompositionServiceByItemnumber(min)
        .then((res: any) => {
          handleActionTypeDialogClose()
          setIsProgressLoader(true)
          setNewIngredient(true)
          setNewIngredientError(false)

          getAndCheckItemNumber([
            min,
            delistIngredientMin,
            '',
            comments,
            'NA',
            'NA',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ])
          // setIsProgressLoader(false)
        })
        .catch((err: any) => {
          setNewIngredient(false)
          setNewIngredientError(true)

          setIsProgressLoader(false)
        })
    } else if (actionType.value === newIngredientMin) {
      // checkProductCompositionService(min)
      // handleActionTypeDialogClose()
      // getProductCompositionServiceByItemnumber('112056236')
      getProductCompositionServiceByItemnumber(min)
        .then((res: any) => {
          handleActionTypeDialogClose()
          setIsProgressLoader(true)
          setNewIngredient(true)
          setNewIngredientError(false)

          getAndCheckItemNumber([
            min,
            newIngredientMin,
            '',
            comments,
            noOfStores,
            selectedStore,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
          ])
          // setIsProgressLoader(false)
        })
        .catch((err: any) => {
          setNewIngredient(false)
          setNewIngredientError(true)

          setIsProgressLoader(false)
        })
    } else if (actionType.value === delistOutercaseCode) {
      // handleActionTypeDialogClose()
      getAndCheckItemNumber([
        min,
        delistOutercaseCode,
        '',
        comments,
        'NA',
        'NA',
        delistPinDateFrom,
        delistPinDateTo,
        '',
        '',
        '',
        '',
        '',
      ])
      handleActionTypeDialogClose()
    } else if (actionType.value === newOutercaseCode) {
      // handleActionTypeDialogClose()
      getAndCheckItemNumber([
        min,
        newOutercaseCode,
        '',
        comments,
        'NA',
        'NA',
        newPinDateFrom,
        newPinDateTo,
        '',
        '',
        '',
        '',
        '',
      ])
      handleActionTypeDialogClose()
    } else if (actionType.value === productDistributionIncreaseMin) {
      let newNumberOfRangeStores = null

      let storeCodeArray =
        storeCodeLength &&
        storeCodeLength.filter((item1: any) => item1.storeMin === min)
      if (storeCodeArray.length > -1) {
        newNumberOfRangeStores = newStoreCount
          ? actionType.value === productDistributionDecreaseMin
            ? storeCodeArray[0].storeLength - newStoreCount
            : actionType.value === productDistributionIncreaseMin
            ? storeCodeArray[0].storeLength + newStoreCount
            : newStoreCount
          : null
      }
      getAndCheckItemNumber([
        min,
        productDistributionIncreaseMin,
        '',
        comments,
        //newStoreCount,
        newNumberOfRangeStores,

        selectedStore,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ])
      handleActionTypeDialogClose()
    } else if (actionType.value === productDistributionDecreaseMin) {
      let newNumberOfRangeStores = null

      let storeCodeArray =
        storeCodeLength &&
        storeCodeLength.filter((item1: any) => item1.storeMin === min)
      if (storeCodeArray.length > -1) {
        newNumberOfRangeStores = newStoreCount
          ? actionType.value === productDistributionDecreaseMin
            ? storeCodeArray[0].storeLength - newStoreCount
            : actionType.value === productDistributionIncreaseMin
            ? storeCodeArray[0].storeLength + newStoreCount
            : newStoreCount
          : null
      }
      getAndCheckItemNumber([
        min,
        productDistributionDecreaseMin,
        '',
        comments,
        // newStoreCount,
        newNumberOfRangeStores,
        selectedStore,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ])
      handleActionTypeDialogClose()
    } else if (actionType.value === productShelfSpaceIncrease) {
      // getRangeByIdAndMinNumber('1304', min)
      //   .then((res: any) => {
      //     setMinCheckError(false)
      //     console.log('checking min', res.data)
      //     let shelfFillCurrent = res.data.shelfFillCurrent
      //       ? res.data.shelfFillCurrent
      //       : 0
      //     setCurrentShelfFill(shelfFillCurrent)
      //     let rangedStoresCurrent = res.data.rangedStoresCurrent
      //       ? res.data.rangedStoresCurrent
      //       : 0
      //     setCurrentNoOfRangeStores(rangedStoresCurrent)
      //     setMinCheck(true)
      //   })
      //   .catch((err: any) => {
      //     setMinCheck(false)
      //     setMinCheckError(true)
      //   })

      // minCheck &&
      // handleActionTypeDialogClose()
      // minCheck &&
      getAndCheckItemNumber([
        min,
        productShelfSpaceIncrease,
        '',
        comments,
        'NA',
        'NA',
        '',
        '',
        newShelfFill,
        '',
        '',
        '',
        '',
      ])
      handleActionTypeDialogClose()
    } else if (actionType.value === productShelfSpaceDecrease) {
      // getRangeByIdAndMinNumber('1304', min)
      //   .then((res: any) => {
      //     setMinCheckError(false)
      //     console.log('checking min', res.data)
      //     let shelfFillCurrent = res.data.shelfFillCurrent
      //       ? res.data.shelfFillCurrent
      //       : 0
      //     setCurrentShelfFill(shelfFillCurrent)
      //     let rangedStoresCurrent = res.data.rangedStoresCurrent
      //       ? res.data.rangedStoresCurrent
      //       : 0
      //     setCurrentNoOfRangeStores(rangedStoresCurrent)
      //     setMinCheck(true)
      //   })
      //   .catch((err: any) => {
      //     setMinCheck(false)
      //     setMinCheckError(true)
      //   })

      // minCheck &&
      // handleActionTypeDialogClose()
      // minCheck &&
      getAndCheckItemNumber([
        min,
        productShelfSpaceDecrease,
        '',
        comments,
        'NA',
        'NA',
        '',
        '',
        newShelfFill,
        '',
        '',
        '',
        '',
      ])
      handleActionTypeDialogClose()
    } else if (actionType.value === supplyChange) {
      // handleActionTypeDialogClose()
      getAndCheckItemNumber([
        min,
        'Supplier Change',
        '',
        comments,
        'NA',
        'NA',
        newPinDateFrom,
        newPinDateTo,
        // '',
        '',
        supplierExisting,
        supplierSiteExisting,
        supplierNew,
        supplierSiteNew,
      ])
      handleActionTypeDialogClose()
    }
    setMin('')
    setComments('')
    setNoOfStores('')
    setStoreCode([])
    setNewIngredientError(false)
    setNewShelfFill(0)
    setCheckUpdate(false)
  }

  useEffect(() => {
    console.log('selected store', selectedStore)
  }, [selectedStore])

  const handleCancelUpdate = () => {
    setCheckMin(false)
    setCheckUpdate(false)
  }

  const handleConfirmUpdate = () => {
    setCheckMin(false)
    setCheckUpdate(true)
    handleManualRAF()
  }
  const confirmUpdateDialog = (
    <ConfirmBox
      cancelOpen={checkMin}
      handleCancel={handleCancelUpdate}
      // handleCancel={handleCompleteTask}
      handleProceed={handleConfirmUpdate}
      label1="Confirm 'Update'"
      label2="You are updating existing Item ,data will be overwritten.
      Do you want to Continue?"
    />
  )

  const [productListCompleteAlertError, setProductListCompleteAlertError] =
    useState<any>(false)
  const checkingErrorsOnSave = () => {
    let newArr = [...importedData]
    // let index = newArr.findIndex(
    //   (data: any) => data.min === rowDataSelected.min
    // )
    // if (index !== -1) {
    let checkTrueExists: any = []
    const importData: any = newArr.map((item: any) => {
      if (
        item.actionType === delistProductMin &&
        item.numberOfRangeStores > 0
      ) {
        item.showErrorProduct = true
        checkTrueExists.push(true)
        return item
      } else if (
        item.actionType === productDistributionIncreaseMin &&
        item.numberOfRangeStores < item.currentnoofrangedstores
      ) {
        item.showErrorProduct = true
        checkTrueExists.push(true)
        return item
      } else if (
        item.actionType === productDistributionDecreaseMin &&
        item.numberOfRangeStores > item.currentnoofrangedstores
      ) {
        item.showErrorProduct = true
        checkTrueExists.push(true)
        return item
      } else if (
        item === productShelfSpaceIncrease &&
        item < item.currentShelfFill
      ) {
        item.showErrorProduct = true
        checkTrueExists.push(true)
        return item
      } else if (
        item === productShelfSpaceDecrease &&
        item > item.currentShelfFill
      ) {
        item.showErrorProduct = true
        checkTrueExists.push(true)
        return item
      } else {
        item.showErrorProduct = false
        checkTrueExists.push(false)
        return item
      }
    })

    // }
    setImportedData(importData)
    // console.log('importData', importData)
    let check = checkTrueExists.includes(true)
    setProductListCompleteAlertError(check)
    return check
  }

  const hideCT36 = () => {
    if (
      rafpendingActionDetailsCT06 &&
      rafpendingActionDetailsCT06.taskName === 'CT36'
    ) {
      return false
    } else {
      return true
    }
  }
  const showErrorAboveCT26 = () => {
    if (rafpendingActionDetailsCT06) {
      if (
        // rafpendingActionDetailsCT06.taskName === 'CT18' ||
        rafpendingActionDetailsCT06.taskName === 'CT27' ||
        rafpendingActionDetailsCT06.taskName === 'CT26' ||
        rafpendingActionDetailsCT06.taskName === 'CT29' ||
        rafpendingActionDetailsCT06.taskName === 'CT30'
        // ||
        // rafpendingActionDetailsCT06.taskName === 'CT36'
      ) {
        return true
      } else {
        return false
      }
    }
  }
  const showErrorbelowCT26 = () => {
    if (rafpendingActionDetailsCT06) {
      if (
        rafpendingActionDetailsCT06.taskName === 'CT26' ||
        rafpendingActionDetailsCT06.taskName === 'CT27' ||
        rafpendingActionDetailsCT06.taskName === 'CT29' ||
        rafpendingActionDetailsCT06.taskName === 'CT30'
        // ||
        // rafpendingActionDetailsCT06.taskName === 'CT36'
      ) {
        return true
      } else {
        return false
      }
    }
  }
  const [showErrorIcon, setShowErrorIcon] = useState<any>(false)
  const handleProductListSave = () => {
    if (showErrorAboveCT26()) {
      if (checkingErrorsOnSave()) {
        setShowErrorIcon(true)
        return console.log('handleProductListSave', 'ErrorExist')
      } else {
        setShowErrorIcon(false)
        console.log('handleProductListSave', 'NOErrorExist')
      }
    }
    // patchApiErrors()

    // return
    console.log('handleProductListSave', importedData)
    const formdata = importedData &&
      eventDetails && {
        items: importedData.map((item: any) => {
          // let newNumberOfRangeStores =
          //   item.numberOfRangeStores !== 'NA'
          //     ? item.actionType === productDistributionDecreaseMin
          //       ? storeCodeLength - parseInt(item.numberOfRangeStores)
          //       : item.actionType === productDistributionIncreaseMin
          //       ? storeCodeLength + parseInt(item.numberOfRangeStores)
          //       : item.numberOfRangeStores
          //     : null
          // console.log('new storecodes', newNumberOfRangeStores)
          return {
            itemNumber: item.min !== 'NA' ? item.min : null,
            description: item.description,
            department: eventDetails[0].department
              ? eventDetails[0].department
              : null,
            departmentId: eventDetails[0].departmentId
              ? eventDetails[0].departmentId
              : null,
            category: eventDetails[0].category
              ? eventDetails[0].category
              : null,
            categoryId: eventDetails[0].categoryId
              ? eventDetails[0].categoryId
              : null,
            status: eventDetails[0].status ? eventDetails[0].status : null,
            targetDate: eventDetails[0].targetDate
              ? eventDetails[0].targetDate
              : null,
            type: item.actionType,
            autoclear: item.autoclear ? item.autoclear : null,
            depoClearWeek: item.clearDepotBy,
            gscopDate: item.finalStopOrderDate
              ? `${item.finalStopOrderDate} ${'00:00:00.00'}`
              : '',
            stopPODate: item.systemSuggestedStopOrderDate
              ? `${item.systemSuggestedStopOrderDate} ${'00:00:00.00'}`
              : null,
            supplierCommitment: item.supplierCommitment,
            wastage:
              // item.includeInStoreWastage !== 'NA'
              //   ? item.includeInStoreWastage
              //   : '',
              eventDetails[0].wastageRange ? 'Y' : '',
            wastageRange: eventDetails[0].wastageRange
              ? eventDetails[0].wastageRange
              : null,
            eventLineStatus: item.lineStatus,
            man: item.man !== 'NA' ? item.man : null,
            ingredientMin:
              item.ingredientMin !== 'NA' ? item.ingredientMin : null,
            recipeMin: item.noOfRecipeMin ? item.noOfRecipeMin : null,
            pin: item.pin !== 'NA' ? item.pin : null,
            replaceMinDescription:
              item.replaceMinDescription !== 'NA'
                ? item.replaceMinDescription
                : '',
            existingSupplier: item.existingSupplier,
            existingSupplierSite: item.existingSupplierSite,
            rangedStoresCurrent: item.currentnoofrangedstores,
            rangedStoresNew: item.numberOfRangeStores,
            currentVsNewStores: item.currentVersusNewStores,
            rangedStoresPercent: item.storesRangedCurrentVsProposed,
            shelfFillCurrent:
              item.currentShelfFill === 0 ? null : item.currentShelfFill,
            shelfFillNew: item.newShelfFill === 0 ? null : item.newShelfFill,
            currentVsNewShelfFill:
              item.currentshelffill_vs_newfill === 0
                ? null
                : item.currentshelffill_vs_newfill,
            shelfFillPercent:
              item.currentshelffill_vs_newfill_percant === 0
                ? null
                : item.currentshelffill_vs_newfill_percant,
            unitCost: item.unitcost,
            caseCost: item.casecost,
            caseSize: item.packquantity ? item.packquantity : null,
            itemLocal: item.local,
            legacyCode: item.legacyItemNumbers ? item.legacyItemNumbers : '',
            onlineCfc: item.onlineCFC,
            onlineStorePick: item.onlineStorePick,
            wholesale: item.wholesale,
            ownBrand: item.ownBrand,
            clearancePricing:
              item.includeInClearancePricing && item.includeInClearancePricing
                ? item.includeInClearancePricing
                : eventDetails[0].clearancePriceCheck
                ? eventDetails[0].clearancePriceCheck
                : '',
            storeStockUnit: item.storeStockUnit,
            depotStockUnit: item.depotStockUnit,
            frwdForecastToLaunch: item.forward_forecast_to_launch,
            excessStock: item.excessstock,
            weeksCover: item.weeksCoveronTotalStockonHandtoResetDate,
            forecastWeekCover: item.forcastedWeeksCovertoResetDate,
            suppCommFixedBuysSeasonal: item.suppCommFixedBuysSeasonal
              ? item.suppCommFixedBuysSeasonal
              : null,
            depotShelfLife: item.depotShelfLifeMinimum,
            productShelfLife: item.productShelfLifeInstore,
            mfgShelfLife: item.shelfLifeatManufacture,
            safewayBrandedEq: item.safewaybrandedequivalent,
            comments: item.comments ? item.comments : null,
            newSupplier: item.newSupplier ? item.newSupplier : null,
            newSupplierSite: item.newSupplierSite ? item.newSupplierSite : null,
            replaceMin: item.replaceMin !== 'NA' ? item.replaceMin : null,
            effectiveFromDate: item.effectiveDateFrom
              ? `${item.effectiveDateFrom} ${'00:00:00.00'}`
              : '',
            // : eventDetails[0].targetDate,
            effectiveToDate: item.effectiveDateTo
              ? `${item.effectiveDateTo} ${'00:00:00.00'}`
              : '',
            // derangedLocations: item.storeNumbersForspecificStoreRange
            //   ? item.storeNumbersForspecificStoreRange
            //   : null,
            derangedLocations: item.storeCode ? item.storeCode : null,
            perStorePerWeek: item.perStorepPerWeek ? item.perStorepPerWeek : '',
            retailDepotClear: item.depotClearbyReservedQtyRetail
              ? item.depotClearbyReservedQtyRetail
              : '',
            wholesaleDepotClear: item.depotClearbyReservedQtyWholesale
              ? item.depotClearbyReservedQtyWholesale
              : '',
            onlineDepotClear: item.depotClearbyReservedQtyOnline
              ? item.depotClearbyReservedQtyOnline
              : '',
            // totalDepotClear: item.depotClearbyReservedQtyTotal
            //   ? item.depotClearbyReservedQtyTotal
            //   : '',
            totalDepotClear: null,
          }
        }),
      }
    console.log(formdata)
    patchRangeResetItems &&
      patchRangeResetItems(rafpendingActionDetailsCT06.eventId, formdata)
        .then((res: any) => {
          console.log(res.data)
          toast.current.show([
            {
              severity: 'success',
              summary: 'Success!',
              detail: 'Data saved successfully',
              life: life,
              className: 'login-toast',
            },
          ])
        })
        .catch((err: any) => {
          console.log(err)
          toast.current.show([
            {
              severity: 'error',
              summary: 'Error!',
              detail: 'Service error',
              life: life,
              className: 'login-toast',
            },
          ])
        })
    setSelectedProductListItems([])
    setEditClick(false)
    setEditButtonSupply(true)
  }
  const [storeValue, setStoreValue] = useState<any>(null)

  const handleChangeStore = (event: any) => {
    const {
      target: { value },
    } = event
    setStoreValue(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  const isAllSelected =
    storeCode.length > 0 && selectedStore.length === storeCode.length

  const handleChange = (event: any) => {
    const value = event.target.value
    if (value[value.length - 1] === 'all') {
      setSelectedStore(
        selectedStore.length === storeCode.length ? [] : storeCode
      )

      return
    }
    setSelectedStore(value)
    setNoOfStores(value.length)
    setNewStoreCount(value.length)
  }

  const storeCodePopup = () => {
    return (
      <FormControl className={classes.formControl}>
        <Select
          labelId="mutiple-select-label"
          multiple
          value={selectedStore}
          onChange={handleChange}
          renderValue={(selectedStore: any) => selectedStore.join(', ')}
          MenuProps={MenuProps}
          input={
            <OutlinedInput margin="dense" className={classes.inputFields} />
          }
          disabled={storeCode ? (storeCode === [] ? true : false) : true}
        >
          {storeCode.map((option: string) => (
            <MenuItem key={option} value={option}>
              <ListItemIcon>
                <Checkbox
                  className="selectdrop"
                  checked={selectedStore.indexOf(option) > -1}
                />
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      // <Select
      //   value={storeValue}
      //   onChange={handleChangeStore}
      //   input={<OutlinedInput margin="dense" className={classes.inputFields} />}
      // >
      //   {storeCode.map((type: any) => {
      //     return (
      //       <MenuItem
      //         className={classes.muiSelect}
      //         value={type.value}
      //         key={type.value}
      //       >
      //         {type.label}
      //       </MenuItem>
      //     )
      //   })}
      // </Select>
    )
  }
  useEffect(() => {
    console.log(selectedStore)
    if (selectedStore) {
      console.log(selectedStore.join())
    }
  }, [selectedStore])
  const actionTypeSelectRender = () => {
    return (
      <FormControl className={classes.formControl}>
        <Select
          labelId="mutiple-select-label"
          multiple
          value={selectedStore}
          onChange={handleChange}
          renderValue={(selectedStore: any) => selectedStore.join(', ')}
          MenuProps={MenuProps}
          input={
            <OutlinedInput margin="dense" className={classes.inputFields} />
          }
        >
          {/* <MenuItem value="" disabled>
            Placeholder
          </MenuItem> */}

          {storeCode.map((option: string) => (
            <MenuItem key={option} value={option}>
              <ListItemIcon>
                <Checkbox
                  className="selectdrop"
                  checked={selectedStore.indexOf(option) > -1}
                />
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      // <Select
      //   value={storeValue}
      //   onChange={handleChangeStore}
      //   input={<OutlinedInput margin="dense" className={classes.inputFields} />}
      // >
      //   {storeCode.map((type: any) => {
      //     return (
      //       <MenuItem
      //         className={classes.muiSelect}
      //         value={type.value}
      //         key={type.value}
      //       >
      //         {type.label}
      //       </MenuItem>
      //     )
      //   })}
      // </Select>
    )
  }

  const delistPinEffectiveDateFrom = () => {
    const systemDate = new Date()
    // console.log(systemDate.getMonth() + 1)
    // const systemDate1 = `${systemDate.getFullYear()}-${
    //   systemDate.getMonth() + 1
    // }-${systemDate.getDate() + 1}`
    // console.log(systemDate1)
    const systemDate1 = systemDate.setDate(systemDate.getDate() + 1)
    return (
      <DatePicker
        format="dd/MM/yy"
        value={delistPinDateFrom !== '' ? delistPinDateFrom : null}
        onChange={(date: any) => {
          let newDate = date.toISOString().split('T')[0]
          setDelistPinDateFrom(newDate)
          setDelistPinDateTo('')
        }}
        TextFieldComponent={(props: any) => (
          <OutlinedInput
            margin="dense"
            onClick={props.onClick}
            value={props.value}
            onChange={props.onChange}
            className={classes.inputFields}
          />
        )}
        minDate={systemDate1}
        maxDate={
          rafpendingActionDetailsCT06 &&
          eventDetails &&
          eventDetails[0].targetDate.split(' ')
        }
      />
    )
  }

  const delistPinEffectiveDateTo = () => {
    let systemDate1 = null
    if (delistPinDateFrom) {
      const systemDate = new Date(delistPinDateFrom)
      console.log(systemDate)
      systemDate1 = systemDate.setDate(systemDate.getDate() + 1)
    }
    return (
      <DatePicker
        format="dd/MM/yy"
        value={delistPinDateTo !== '' ? delistPinDateTo : null}
        onChange={(date: any) => {
          let newDate = date.toISOString().split('T')[0]
          setDelistPinDateTo(newDate)
        }}
        TextFieldComponent={(props: any) => (
          <OutlinedInput
            margin="dense"
            onClick={props.onClick}
            value={props.value}
            onChange={props.onChange}
            className={classes.inputFields}
          />
        )}
        disabled={delistPinDateFrom ? false : true}
        minDate={systemDate1 && systemDate1}
      />
    )
  }

  const newPinEffectiveDateFrom = () => {
    const systemDate = new Date()
    // console.log(systemDate.getMonth() + 1)
    // const systemDate1 = `${systemDate.getFullYear()}-${
    //   systemDate.getMonth() + 1
    // }-${systemDate.getDate() + 1}`
    // console.log(systemDate1)
    const systemDate1 = systemDate.setDate(systemDate.getDate() + 1)
    return (
      <DatePicker
        format="dd/MM/yy"
        value={newPinDateFrom !== '' ? newPinDateFrom : null}
        onChange={(date: any) => {
          let newDate = date.toISOString().split('T')[0]
          setNewPinDateFrom(newDate)
          setNewPinDateTo('')
        }}
        TextFieldComponent={(props: any) => (
          <OutlinedInput
            margin="dense"
            onClick={props.onClick}
            value={props.value}
            onChange={props.onChange}
            className={classes.inputFields}
          />
        )}
        minDate={systemDate1}
        maxDate={
          rafpendingActionDetailsCT06 &&
          eventDetails &&
          eventDetails[0].targetDate.split(' ')
        }
      />
    )
  }

  const newPinEffectiveDateTo = () => {
    let systemDate1 = null
    if (newPinDateFrom) {
      const systemDate = new Date(newPinDateFrom)
      console.log(systemDate)
      // systemDate1 = `${systemDate.getFullYear()}-${systemDate.getMonth() + 1}-${
      //   systemDate.getDate() + 1
      // }`
      // console.log(systemDate1)
      systemDate1 = systemDate.setDate(systemDate.getDate() + 1)
    }
    return (
      <DatePicker
        format="dd/MM/yy"
        value={newPinDateTo !== '' ? newPinDateTo : null}
        onChange={(date: any) => {
          let newDate = date.toISOString().split('T')[0]
          setNewPinDateTo(newDate)
        }}
        TextFieldComponent={(props: any) => (
          <OutlinedInput
            margin="dense"
            onClick={props.onClick}
            value={props.value}
            onChange={props.onChange}
            className={classes.inputFields}
          />
        )}
        disabled={newPinDateFrom ? false : true}
        minDate={systemDate1 && systemDate1}
      />
    )
  }

  const handleGetStoreDetails = () => {
    setIsProgressLoader(true)
    getRangeResetEventsStoreDepot(
      rafpendingActionDetailsCT06 && rafpendingActionDetailsCT06.eventId,
      min,
      'store'
    )
      .then((res: any) => {
        setIsProgressLoader(false)
        if (
          actionType.value === 'Product Distribution Increase (MIN)' ||
          actionType.value === 'Product Distribution Decrease (MIN)' ||
          actionType.value === 'Supplier Change' ||
          actionType.value === 'Product Shelf Space Increase' ||
          actionType.value === 'Product Shelf Space Decrease'
        ) {
          let rangedStoresCurrent = res.data.rangedStoresCurrent
            ? res.data.rangedStoresCurrent
            : 0
          console.log('responsedata', res.data)
          setCurrentNoOfRangeStores(rangedStoresCurrent)
          setCurrentShelfFill(res.data.shelfFillCurrent)
          if (res.data.hasOwnProperty('storeView')) {
            setStoreViewData(res.data.storeView)
          }

          console.log('existing', res.data.existingSupplier)
          setSupplierExisting(res.data.existingSupplier)
          setSupplierSiteExisting(res.data.existingSupplierSite)
          // else {
          //   setStoreViewApi([])
          //   setStorePopupHeader('')
          // }
        }
      })
      .catch((err: any) => {
        setIsProgressLoader(false)
        setCurrentNoOfRangeStores(0)
        setCurrentShelfFill(0)
        setSupplierExisting('')
        setSupplierSiteExisting('')
      })
  }

  const handleGetSupplierDetails = () => {
    setIsProgressLoader(true)
    getProductServiceByItemnumber(min)
      .then((res: any) => {
        setIsProgressLoader(false)
        getProductSupplierServiceByItemnumber(min)
          .then((res1: any) => {
            const supplierValues = res1.data.itemSuppliers.map((item: any) => {
              return {
                label: item.supplierId,
                value: item.supplierId,
              }
            })
            console.log(supplierValues)
            setSupplierOptions(supplierValues)
          })
          .catch((err1: any) => {
            setIsProgressLoader(false)
            toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Supplier service error',
              life: life,
              className: 'login-toast',
            })
          })
      })
      .catch((err: any) => {
        setIsProgressLoader(false)
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Product service error',
          life: life,
          className: 'login-toast',
        })
      })
  }

  const handleStoreViewDialogOpen = () => {
    setStoreViewDialogOpen(true)
  }
  const handleStoreViewDialogClose = () => {
    setStoreViewDialogOpen(false)
  }
  const storeViewDialog = (
    <Dialog
      open={storeViewDialogOpen}
      onClose={handleStoreViewDialogClose}
      fullWidth
      classes={{ paperFullWidth: classes.placeholderDialog }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          //   width: small ? '500px' : '260px',
          // height: "250px",
          //border: '3px solid green',
          borderRadius: 5,
          padding: '10px',
        }}
      >
        <DialogHeader
          title={`Add ${actionType && actionType.value}`}
          onClose={handleStoreViewDialogClose}
        />

        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 1, display: 'flex', flexDirection: 'row' }}>
            <Box>
              <Typography color="primary" variant="subtitle2">
                Store View
              </Typography>
            </Box>
          </Box>
          <DataTable
            value={storeViewData}
            showGridlines
            scrollable
            scrollHeight="400px"
          >
            {rangedStoresTableCols.map((col: any) => {
              return (
                <Column
                  key={col.field}
                  header={col.header}
                  field={col.field}
                  bodyStyle={tableBodyStyle(col.width)}
                  headerStyle={tableHeaderStyle(
                    col.width,
                    theme.palette.primary.main
                  )}
                />
              )
            })}
          </DataTable>
        </Box>
      </Box>
    </Dialog>
  )

  const actionTypeDialog = (
    <Dialog
      open={openActionTypeDialog}
      onClose={handleActionTypeDialogClose}
      fullWidth
      classes={{ paperFullWidth: classes.placeholderDialog }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          //   width: small ? '500px' : '260px',
          // height: "250px",
          //border: '3px solid green',
          borderRadius: 5,
          padding: '10px',
        }}
      >
        {/* <Box
          sx={{
            display: 'flex',
            height: 30,
            flexDirection: 'row',
            borderRadius: 10,
          }}
          //   className={classes.dialogTitle}
        >
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle1">Add {actionType}</Typography>
          </Box>
          <Box
            sx={{
              paddingRight: 2,
            }}
          >
            <button
              style={{
                border: 0,
                padding: 0,
                height: 22,
                width: 22,
              }}
              //   className={classes.dialogCloseButton}
              onClick={handleActionTypeDialogClose}
            >
              <b>X</b>
            </button>
          </Box>
        </Box> */}
        <DialogHeader
          title={`Add ${actionType && actionType.value}`}
          onClose={handleActionTypeDialogClose}
        />

        {/* <Box sx={{ p: 1 }}>
          <Typography variant="body2">Add {actionType}</Typography>
        </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <table cellPadding={'10px'}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <thead
                  style={{
                    fontSize: '12px',
                    textAlign: 'left',
                  }}
                >
                  <tr>
                    <th>{actionType}</th>
                    <th>
                      <TextField
                        variant="outlined"
                        // className={classes.addActionFields}
                        size="small"
                        value={min}
                        onChange={(e: any) => setMinOrPin(e.target.value)}
                        required
                      />
                    </th>
                  </tr>
                  <tr>
                    <th>Replace MIN/PIN</th>
                    <th>
                      <TextField
                        variant="outlined"
                        // className={classes.addActionFields}
                        size="small"
                        value={replaceMinOrPin}
                        onChange={(e: any) =>
                          setReplaceMinOrPin(e.target.value)
                        }
                      />
                    </th>
                  </tr>

                  <tr>
                    <th>Effective Date(from)</th>
                    <th>
                      <KeyboardDatePicker
                        format="dd/MM/yyyy"
                        inputVariant="outlined"
                        value={fromDate}
                        onChange={handleFromDate}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        style={{
                          height: '35px',
                        }}
                        size="small"
                      />
                      
                    </th>
                  </tr>

                  <tr>
                    <th>Effective Date(to)</th>
                    <th>
                      <KeyboardDatePicker
                        format="dd/MM/yyyy"
                        inputVariant="outlined"
                        value={toDate}
                        onChange={handleToDate}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        style={{
                          height: '35px',
                        }}
                        size="small"
                      />
                      
                    </th>
                  </tr>

                  {actionType === 'Derange MIN' && (
                    <tr>
                      <th>Store Code</th>
                      <th>
                        <TextField
                          variant="outlined"
                          //   className={classes.addActionFields}
                          size="small"
                          value={addStoreCode}
                          onChange={(e: any) => setAddStoreCode(e.target.value)}
                          required
                        />
                      </th>
                    </tr>
                  )}

                  <tr>
                    <th>Comments</th>
                    <th>
                      <TextField
                        variant="outlined"
                        // className={classes.addActionFields}
                        size="small"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      />
                    </th>
                  </tr>
                </thead>
              </MuiPickersUtilsProvider>

            </table>
          </Box>

          <Box
            sx={{
              display: 'flex',
              p: 3,
              justifyContent: 'right',
            }}
          >
            <Button
              // className={classes.submitButtons}
              type="submit"
            >
              Add
            </Button>
          </Box> */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" color="primary">
              {`Add ${actionType && actionType.value}`}
            </Typography>
          </Box>
          {newIngredientError && (
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
              <Box>
                <Typography variant="body2" color="error">
                  {min} is not an Ingredient MIN.
                </Typography>
              </Box>
            </Box>
          )}
          {minCheckError && (
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'row' }}>
              <Box>
                <Typography variant="body2" color="error">
                  {min} is not an valid MIN.
                </Typography>
              </Box>
            </Box>
          )}
          {storeCodeFetchError && (
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'row' }}>
              <Box>
                <Typography variant="body2" color="error">
                  Fetching Store Codes failed, Try Again
                </Typography>
              </Box>
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              p: 1,
              width: '100%',
            }}
          >
            {actionType && actionType.value === delistProductMin && (
              <>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // flexGrow: '1',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* Delist Product (MIN) */}
                      {delistProductMin}
                      <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // flexGrow: '1',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Comments
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      /> */}
                      <InputTextarea
                        cols={20}
                        autoResize
                        maxLength={500}
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {actionType && actionType.value === newProductMin && (
              <>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* New Product (MIN) */}
                      {newProductMin}
                      <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                      {/* <OutlinedInput
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                        className={classes.inputFields}
                      /> */}

                      <SearchSelect
                        value={min}
                        onChange={(e: any) => {
                          setMin(e.target.value)
                          setStoreCodeFetchError(false)
                        }}
                        placeholder="Min"
                        onClick={() => {
                          if (min && min !== '') {
                            storeCodeFetch(min)
                          }
                        }}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Store Code
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <select
                        placeholder="--Select--"
                        value={storeCode}
                        onChange={(e: any) => setStoreCode(e.target.value)}
                        style={{ width: '160px' }}
                      >
                        <option value="001">Store-001</option>
                      </select> */}
                      {storeCodePopup()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Delta no. of Range Stores
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={noOfStores}
                        onChange={(e: any) => setNoOfStores(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={noOfStores}
                        // onChange={() => setNoOfStores(selectedStore && selectedStore.length)}
                        className={classes.inputFields}
                        disabled
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Comments
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      /> */}
                      <InputTextarea
                        cols={20}
                        autoResize
                        maxLength={500}
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {actionType && actionType.value === delistIngredientMin && (
              <>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // flexGrow: '1',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* Delist Ingredient (MIN) */}
                      {delistIngredientMin}
                      <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // flexGrow: '1',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Comments
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      /> */}
                      <InputTextarea
                        cols={20}
                        autoResize
                        maxLength={500}
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {actionType && actionType.value === newIngredientMin && (
              <>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* New Ingredient (MIN) */}
                      {newIngredientMin}
                      <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                      {/* <OutlinedInput
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                        className={classes.inputFields}
                      /> */}

                      <SearchSelect
                        value={min}
                        onChange={(e: any) => {
                          setMin(e.target.value)
                          setStoreCodeFetchError(false)
                        }}
                        placeholder="Min"
                        onClick={() => {
                          if (min && min !== '') {
                            storeCodeFetch(min)
                          }
                        }}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Store Code
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <select
                        placeholder="--Select--"
                        value={storeCode}
                        onChange={(e: any) => setStoreCode(e.target.value)}
                        style={{ width: '160px' }}
                      >
                        <option value="001">Store-001</option>
                      </select> */}
                      {storeCodePopup()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Delta no. of Range Stores
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={noOfStores}
                        onChange={(e: any) => setNoOfStores(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={noOfStores}
                        // onChange={() => setNoOfStores(selectedStore && selectedStore.length)}
                        className={classes.inputFields}
                        disabled
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Comments
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                      type="text"
                      value={comments}
                      onChange={(e: any) => setComments(e.target.value)}
                    /> */}
                      <InputTextarea
                        cols={20}
                        autoResize
                        maxLength={500}
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {actionType && actionType.value === delistOutercaseCode && (
              <>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Delist PIN
                        <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        <OutlinedInput
                          value={min}
                          onChange={(e: any) => setMin(e.target.value)}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Effective Date(From)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {delistPinEffectiveDateFrom()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Effective Date(To)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {delistPinEffectiveDateTo()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Comments
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      /> */}
                        <InputTextarea
                          cols={20}
                          autoResize
                          maxLength={500}
                          value={comments}
                          onChange={(e: any) => setComments(e.target.value)}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </MuiPickersUtilsProvider>
              </>
            )}
            {actionType && actionType.value === newOutercaseCode && (
              <>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        New PIN
                        <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        <OutlinedInput
                          value={min}
                          onChange={(e: any) => setMin(e.target.value)}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Effective Date(From)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {newPinEffectiveDateFrom()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Effective Date(To)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {newPinEffectiveDateTo()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Comments
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      /> */}
                        <InputTextarea
                          cols={20}
                          autoResize
                          maxLength={500}
                          value={comments}
                          onChange={(e: any) => setComments(e.target.value)}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </MuiPickersUtilsProvider>
              </>
            )}
            {actionType &&
              actionType.value === 'Product Distribution Increase (MIN)' && (
                <>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        MIN
                        <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        {/* <OutlinedInput
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                        className={classes.inputFields}
                      /> */}

                        <SearchSelect
                          value={min}
                          onChange={(e: any) => {
                            setMin(e.target.value)
                            setStoreCodeFetchError(false)
                          }}
                          placeholder="Min"
                          onClick={() => {
                            if (min && min !== '') {
                              storeCodeFetch(min)
                            }
                          }}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Store Code
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <select
                        placeholder="--Select--"
                        value={storeCode}
                        onChange={(e: any) => setStoreCode(e.target.value)}
                        style={{ width: '160px' }}
                      >
                        <option value="001">Store-001</option>
                      </select> */}
                        {storeCodePopup()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Delta no. of Range Stores
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={noOfStores}
                        onChange={(e: any) => setNoOfStores(e.target.value)}
                      /> */}
                        <OutlinedInput
                          value={noOfStores}
                          // onChange={() => setNoOfStores(selectedStore && selectedStore.length)}
                          className={classes.inputFields}
                          disabled
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Comments
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                      type="text"
                      value={comments}
                      onChange={(e: any) => setComments(e.target.value)}
                    /> */}
                        <InputTextarea
                          cols={20}
                          autoResize
                          maxLength={500}
                          value={comments}
                          onChange={(e: any) => setComments(e.target.value)}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            {actionType &&
              actionType.value === 'Product Distribution Decrease (MIN)' && (
                <>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        MIN
                        <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        {/* <OutlinedInput
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                        className={classes.inputFields}
                      /> */}

                        <SearchSelect
                          value={min}
                          onChange={(e: any) => {
                            setMin(e.target.value)
                            setStoreCodeFetchError(false)
                          }}
                          placeholder="Min"
                          onClick={() => {
                            if (min && min !== '') {
                              storeCodeFetch(min)
                            }
                          }}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Store Code
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <select
                        placeholder="--Select--"
                        value={storeCode}
                        onChange={(e: any) => setStoreCode(e.target.value)}
                        style={{ width: '160px' }}
                      >
                        <option value="001">Store-001</option>
                      </select> */}
                        {storeCodePopup()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Delta no. of Range Stores
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={noOfStores}
                        onChange={(e: any) => setNoOfStores(e.target.value)}
                      /> */}
                        <OutlinedInput
                          value={noOfStores}
                          // onChange={() => setNoOfStores(selectedStore && selectedStore.length)}
                          className={classes.inputFields}
                          disabled
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Comments
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                      type="text"
                      value={comments}
                      onChange={(e: any) => setComments(e.target.value)}
                    /> */}
                        <InputTextarea
                          cols={20}
                          autoResize
                          maxLength={500}
                          value={comments}
                          onChange={(e: any) => setComments(e.target.value)}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            {actionType && actionType.value === productShelfSpaceIncrease && (
              <>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      MIN
                      <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      <OutlinedInput
                        value={min}
                        onChange={(e: any) => {
                          // setMinCheckError(false)
                          setMin(e.target.value)
                          setMin(e.target.value)
                          setCurrentNoOfRangeStores(0)
                          setCurrentShelfFill(0)
                        }}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                {/* <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Current no. of Range Stores
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className={classes.blueText}
                    >
                      {currentNoOfRangeStores && storeViewData ? (
                        <button
                          onClick={handleStoreViewDialogOpen}
                          className={classes.blueTextButton}
                        >
                          {currentNoOfRangeStores && currentNoOfRangeStores}
                        </button>
                      ) : (
                        <>0</>
                      )}
                    </Typography>
                  </Box>
                </Box> */}
                {/* <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Current Shelf Fill (Units)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className={classes.blueText}
                    >
                      {currentShelfFill && currentShelfFill}
                    </Typography>
                  </Box>
                </Box> */}
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      New Shelf Fill (Units)
                      <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                      type="text"
                      value={comments}
                      onChange={(e: any) => setComments(e.target.value)}
                    /> */}
                      <OutlinedInput
                        type="number"
                        value={newShelfFill}
                        onChange={(e: any) => {
                          if (e.target.value >= 0) {
                            setNewShelfFill(e.target.value)
                          }
                        }}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Comments
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                      type="text"
                      value={comments}
                      onChange={(e: any) => setComments(e.target.value)}
                    /> */}
                      <InputTextarea
                        cols={20}
                        autoResize
                        maxLength={500}
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {actionType && actionType.value === productShelfSpaceDecrease && (
              <>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      MIN
                      <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      <OutlinedInput
                        value={min}
                        onChange={(e: any) => {
                          setMin(e.target.value)
                          setCurrentNoOfRangeStores(0)
                          setCurrentShelfFill(0)
                        }}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                {/* <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Current no. of Range Stores
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className={classes.blueText}
                    >
                      {currentNoOfRangeStores && storeViewData ? (
                        <button
                          onClick={handleStoreViewDialogOpen}
                          className={classes.blueTextButton}
                        >
                          {currentNoOfRangeStores && currentNoOfRangeStores}
                        </button>
                      ) : (
                        <>0</>
                      )}
                    </Typography>
                  </Box>
                </Box> */}
                {/* <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Current Shelf Fill (Units)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      className={classes.blueText}
                    >
                      {currentShelfFill && currentShelfFill}
                    </Typography>
                  </Box>
                </Box> */}
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      New Shelf Fill (Units)
                      <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                      type="text"
                      value={comments}
                      onChange={(e: any) => setComments(e.target.value)}
                    /> */}
                      <OutlinedInput
                        type="number"
                        value={newShelfFill}
                        onChange={(e: any) => {
                          if (e.target.value >= 0) {
                            setNewShelfFill(e.target.value)
                          }
                        }}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Comments
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                      type="text"
                      value={comments}
                      onChange={(e: any) => setComments(e.target.value)}
                    /> */}
                      <InputTextarea
                        cols={20}
                        autoResize
                        maxLength={500}
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
            {actionType && actionType.value === 'Supplier Change' && (
              <>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Delist MIN/PIN
                        <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        <OutlinedInput
                          value={min}
                          onChange={(e: any) => {
                            setMin(e.target.value)
                            setSupplierExisting('')
                            setSupplierSiteExisting('')
                            setSelectedSupplierSite([])
                            setSelectedSupplierSiteNew([])
                            setSupplierOptions([])
                            setSupplierSiteNew('')
                            setSupplierNew('')
                          }}
                          className={classes.inputFields}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleGetSupplierDetails}
                                edge="end"
                              >
                                <SearchOutlined />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Supplier Site (Existing)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        {/* <OutlinedInput
                          value={supplierSiteExisting}
                          disabled
                          // onChange={(e: any) =>
                          //   setSupplierSiteExisting(e.target.value)
                          // }
                          className={classes.inputFields}
                        /> */}
                        <AutocompleteSelect
                          // isMulti={true}
                          value={selectedSupplierSite}
                          options={supplierOptions} //multipesri
                          onChange={handleSupplierSite}
                          placeholder=""
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Supplier (Existing)
                        <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        <OutlinedInput
                          value={supplierExisting}
                          // onChange={(e: any) =>
                          //   setSupplierExisting(e.target.value)
                          // }
                          disabled
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Supplier Site (New)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        {/* <OutlinedInput
                          value={supplierSiteNew}
                          onChange={(e: any) =>
                            setSupplierSiteNew(e.target.value)
                          }
                          className={classes.inputFields}
                        /> */}
                        <AutocompleteSelect
                          // isMulti={true}
                          value={selectedSupplierSiteNew}
                          options={supplierOptions} //multipesri
                          onChange={handleSupplierSiteNew}
                          placeholder=""
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Supplier (New)
                        <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                        <OutlinedInput
                          value={supplierNew}
                          // onChange={(e: any) => setSupplierNew(e.target.value)}
                          disabled
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Effective Date(From)
                        <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {newPinEffectiveDateFrom()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Effective Date(To)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {newPinEffectiveDateTo()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      // flexGrow: '1',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Comments
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {/* <input
                        type="text"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      /> */}
                        <InputTextarea
                          cols={20}
                          autoResize
                          maxLength={500}
                          value={comments}
                          onChange={(e: any) => setComments(e.target.value)}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                </MuiPickersUtilsProvider>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Box sx={{ p: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  importedData && importedData.length > 0
                    ? checkingToUpdate
                    : handleManualRAF
                } //De-list save
                // onClick={checkingToUpdate}
                // onClick={handleManualRAF}
              >
                Save
              </Button>
            </Box>
            {/* {actionType &&
              (actionType.value === 'Product Shelf Space Decrease' ||
                actionType.value === 'Product Shelf Space Increase' ||
                actionType.value === 'Product Distribution Increase (MIN)' ||
                actionType.value === 'Supplier Change' ||
                actionType.value === 'Product Distribution Decrease (MIN)') && (
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      actionType.value === 'Supplier Change'
                        ? handleGetSupplierDetails
                        : handleGetStoreDetails
                    } //De-list save
                  >
                    Get MIN Details
                  </Button>
                </Box>
              )} */}
          </Box>
        </Box>
      </Box>
    </Dialog>
  )

  const existingProducts = (
    <form style={{ width: '100%' }}>
      <Grid
        item
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        style={{ alignItems: 'center' }}
      >
        <Grid item container xl={8} lg={8} md={8} sm={12} xs={12}>
          <DataTable
            value={existingSearchFields}
            scrollable
            showGridlines
            style={{
              height: '100%',
              width: '100%',
            }}
            className="p-datatable-sm"
          >
            {delistExistingProductsCols.map((col: any, index: any) => {
              return (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  // style={{
                  //   width: col.width,
                  //   fontSize: '0.9rem',
                  //   padding: '0.5rem',
                  // }}
                  // headerStyle={{
                  //   backgroundColor: teal[900],
                  //   color: 'white',
                  //   width: col.width,
                  //   fontSize: '0.9rem',
                  //   padding: '0.5rem',
                  // }}
                  bodyStyle={tableBodyStyle(col.width)}
                  headerStyle={tableHeaderStyle(
                    col.width,
                    theme.palette.primary.main
                  )}
                  body={
                    // (col.field === "productId" && productIdTemplate)
                    // ||
                    // (col.field === "storeCode" && storeCodeTemplate)
                    // ||
                    // (col.field === "supplier" && supplierTemplate)
                    // ||
                    // (col.field === "supplierSiteNumber" && supplierSiteNumberTemplate)
                    // ||
                    col.field === 'local' && localTemplate
                    // ||
                    // (col.field === "pin" && pinTemplate)
                    // ||
                    // (col.field === "buyingMinIngredients" && buyingMinIngredientsTemplate)
                  }
                />
              )
            })}
          </DataTable>
        </Grid>
        <Grid
          item
          container
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}
          style={{ textAlign: 'center' }}
          spacing={2}
        >
          <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
            <Button variant="contained" color="primary" type="submit">
              ADD
            </Button>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
            OR
          </Grid>
          <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUploadDialogOpen('')}
            >
              Upload File
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )

  const submitNewProduct = (e: any) => {
    e.preventDefault()
    if (newProductId) {
      var minVal = 1000000000000
      var max = 9999999999999
      var rand = Math.floor(minVal + Math.random() * (max - minVal))
      let newProductData: any = {
        _idCheck: rand,
        productId: newProductId,
        description: '',
        'department/Category': 'Household & Pet Food/Pet Foods',
        lineStatus: 'Draft',
        type: 'New',
        clearancePricing: 'NA',
        clearDepotBy: 'NA',
      }
      if (importedData) {
        setImportedData((prevState: any) => {
          let newData = [...prevState]
          newData.push(newProductData)
          console.log(newData)
          return newData
        })
      } else {
        setImportedData([newProductData])
      }
    }
  }

  const newProducts = (
    <form style={{ width: '100%' }} onSubmit={submitNewProduct}>
      <Grid
        item
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        style={{ alignItems: 'end' }}
        spacing={2}
      >
        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
          New Products
          <br />
          <input
            type="text"
            required
            // className={classes.placeholderCountStyle}
            style={{
              width: small ? '88%' : '100%',
            }}
            value={newProductId}
            onChange={(e: any) => setNewProductId(e.target.value)}
          />
        </Grid>
        <Grid
          item
          xl={2}
          lg={2}
          md={2}
          sm={6}
          xs={12}
          style={{ textAlign: 'center' }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ width: '80px' }}
          >
            ADD
          </Button>
        </Grid>
      </Grid>
    </form>
  )

  const submitPlaceholderProducts = (e: any) => {
    e.preventDefault()
    if (placeholderCount && supplierCode && salesChannels.length > 0) {
      let placeholderData: any = []
      for (var i = 0; i < placeholderCount; i++) {
        placeholderData.push({
          productId: `rand${Math.floor(100 + Math.random() * 900)}`,
          description: '',
          'department/Category': 'Household & Pet Food/Pet Foods',
          lineStatus: 'Draft',
          type: 'Placeholder',
          clearancePricing: 'NA',
          clearDepotBy: 'NA',
        })
      }
      console.log(placeholderData)
      if (importedData) {
        setImportedData((prevState: any) => {
          let newData = [...prevState]
          placeholderData.map((d: any) => {
            newData.push(d)
          })
          return newData
        })
      } else {
        setImportedData(placeholderData)
      }
    }
  }

  useEffect(() => {
    console.log('importedData', importedData)
    console.log('productListCols Length', productListCols)
  }, [importedData])

  //   const placeholderProducts = (
  //     <Grid
  //       item
  //       container
  //       xl={12}
  //       lg={12}
  //       md={12}
  //       sm={12}
  //       xs={12}
  //       style={{
  //         alignItems: 'center',
  //         padding: '10px',
  //       }}
  //       spacing={2}
  //     >
  //       <Grid item container md={7} sm={12} xs={12}>
  //         <Grid item xs={8}>
  //           <Typography variant="subtitle2" color="primary">
  //             How many new lines do you wish to enter?
  //             <br />
  //             <input
  //               type="text"
  //               required
  //               // className={classes.placeholderCountStyle}
  //               style={{
  //                 width: small ? '88%' : '100%',
  //               }}
  //               value={placeholderCount}
  //               onChange={(e: any) => setPlaceholderCount(e.target.value)}
  //             />
  //           </Typography>
  //         </Grid>
  //         <Grid
  //           item
  //           //   xl={2}
  //           //   lg={2}
  //           //   md={2}
  //           //   sm={6}
  //           xs={4}
  //           style={{ textAlign: 'center' }}
  //         >
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             type="submit"
  //             style={{ width: '80px' }}
  //           >
  //             ADD
  //           </Button>
  //         </Grid>
  //       </Grid>

  //       <Grid item sm={1} xs={12}>
  //         <Typography variant="subtitle2" color="primary">
  //           OR
  //         </Typography>
  //       </Grid>
  //       <Grid item md={3} sm={12} xs={12}>
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           // type="submit"
  //           // style={{ width: '80px' }}
  //         >
  //           Upload File
  //         </Button>
  //       </Grid>
  //     </Grid>
  //   )

  // const handleTableStatusChange = (rowData: any, e: any) => {
  //   let newData: any = []
  //   importedData.map((d: any) => {
  //     if (d._idCheck === rowData._idCheck) {
  //       let selectValue = d
  //       selectValue.lineStatus = e.target.value
  //       newData.push(selectValue)
  //     } else {
  //       newData.push(d)
  //     }
  //   })
  //   console.log(newData)
  //   setImportedData(newData)
  // }

  useEffect(() => {
    console.log('selected product list', selectedProductListItems)
  }, [selectedProductListItems])

  useEffect(() => {
    console.log('replacement list', replacementAssociationProduct)
  }, [replacementAssociationProduct])
  const [supplierSelected, setSupplierSelected] = useState<any>([])
  const [editButtonSupply, setEditButtonSupply] = useState<any>(true)
  const [editClick, setEditClick] = useState<any>(false)

  useEffect(() => {
    // console.log('supplierSelected', supplierSelected)
    if (supplierSelected.length > 0) {
      setEditButtonSupply(false)
    } else {
      setEditButtonSupply(true)
      setEditClick(false)
    }
  }, [supplierSelected])

  const handleProductListEdit = () => {
    setEditClick(true)
    console.log('handleProductListEdit')
  }

  const handleProductTableSelect = (e: any) => {
    let selectedData = e.value

    let replacementData = selectedData.filter((selected: any) => {
      return (
        selected.actionType !== 'New Product (MIN)' &&
        selected.actionType !== 'New MIN' &&
        selected.actionType !== 'New Product (MIN) Placeholder' &&
        selected.actionType !== 'Placeholder MIN'
      )
    })
    console.log('replaced', replacementData)

    setSelectedProductListItems(selectedData)

    setReplacementAssociationProduct(replacementData)
    setSupplierSelected(selectedData)
  }
  const refreshPage = () => {
    initialSummaryCall()
    setFinalRangeState(false)
    setNewlyAddedTitle(false)
    setShowErrorIcon(false)
    // setIsProgressLoader(true)
    // setRefreshClick(!refreshClick)
    // setIsProgressLoader(false)
  }
  useEffect(() => {
    console.log('importedData', importedData)
    // const errors =
    //   importedData &&
    //   importedData.filter((val: any, index: any) => {
    //     return val.showError === true && importedData.splice(index, 1)
    //   })
    // setimportedDataPlanogram(errors)
    // updatingErrorsWithValues()
    if (importedData && importedData.length > 0) {
      setImportedDataHaving(true)
    }
  }, [importedData])

  const [importedDataPlanogram, setimportedDataPlanogram] = useState<any>([])
  const [planogramErrorDialogShow, setPanogramErrorDialogShow] =
    useState<any>(false)
  const handlePanogramErrorDialogClose = () => {
    setPanogramErrorDialogShow(false)
    setFinalRangeState(false)
  }

  const patchApiErrors = () => {
    let eventId = rafpendingActionDetailsCT06.eventId
    let payload: any = {}
    let itemArray: any = []
    xlslPlanogramimportedData.map((val: any) => {
      const {
        min,
        actionTypePlanogram,
        showError,
        newShelfFillPlanogram,
        newnoofrangestoresPlanogram,
        storeCodeExpands,
      } = val

      if (Array.isArray(storeCodeExpands)) {
        storeCodeExpands &&
          storeCodeExpands.map((currentStoreNum: any) => {
            itemArray.push({
              itemNumber: min,
              actionType: actionTypePlanogram,
              uploadStatus: showError ? 'ERROR' : 'SUCCESS',
              storeNumber: currentStoreNum,
              newShelfFill: newShelfFillPlanogram,
            })
          })
      } else {
        storeCodeExpands &&
          storeCodeExpands.split(',').map((currentStoreNum: any) => {
            itemArray.push({
              itemNumber: min,
              actionType: actionTypePlanogram,
              uploadStatus: showError ? 'ERROR' : 'SUCCESS',
              storeNumber: currentStoreNum,
              newShelfFill: newShelfFillPlanogram,
            })
          })
      }
    })
    payload = {
      events: [
        {
          rangeResetId: eventId,
          items: itemArray,
        },
      ],
    }
    console.log('patchApiErrors', payload)
    // return

    itemArray.length > 0 &&
      patchRangeResetPlanogramErrors(eventId, '@all', payload)
        .then((res: any) => {
          console.log('SUCCESS', 'patchRangeResetPlanogramErrors', res)
        })
        .catch((err: any) => {
          console.log('ERROR', 'patchRangeResetPlanogramErrors', err)
        })
  }
  const [getErrorsFromApiPlano, setGetErrorsFromApiPlano] = useState<any>()

  useEffect(() => {
    rafpendingActionDetailsCT06 &&
      getRangeResetPlanogramErrors(rafpendingActionDetailsCT06.eventId, '@all')
        .then((res: any) => {
          console.log('getRangeResetPlanogramErrors', res)
          setGetErrorsFromApiPlano(res)
        })
        .catch((err: any) => console.log('getRangeResetPlanogramErrors', err))
  }, [])
  const handlePlanogramClick = () => {
    setIsProgressLoader(true)
    setPanogramErrorDialogShow(true)
    setFinalRangeState(true)
    setFinalApiErrorOp([])
    getErrorsShow()
    // updatingErrorsWithValues()
    setIsProgressLoader(false)
  }

  const getErrorsShow = () => {
    let data: any = []
    if (getErrorsFromApiPlano) {
      data = getErrorsFromApiPlano.data.events[0].items
      console.log(
        'getErrorsFromApiPlano',
        getErrorsFromApiPlano.data.events[0].items
      )
      let output: any = []
      data.forEach(function (item: any) {
        let existing = output.filter(function (v: any, i: any) {
          return v.itemNumber == item.itemNumber
        })
        if (existing.length) {
          var existingIndex = output.indexOf(existing[0])
          output[existingIndex].storeNumber = output[
            existingIndex
          ].storeNumber.concat(item.storeNumber)
        } else {
          if (typeof item.storeNumber == 'string')
            item.storeNumber = [item.storeNumber]
          output.push(item)
        }
      })
      console.log('output', output)
      setFinalApiErrorOp(output)
    }
  }
  const [importedDataHaving, setImportedDataHaving] = useState<any>(false)

  useEffect(() => {
    updatingErrorsWithValues()
  }, [importedDataHaving])
  useEffect(() => {
    getErrorsShow()
    // updatingErrorsWithValues()
  }, [getErrorsFromApiPlano])

  const handlePlanogramSave = () => {
    console.log('handlePlanogramSave', 'handlePlanogramSave')
    let impData: any = [...importedData]
    let planoData: any = [...xlslPlanogramimportedData]
    let firstShowImport: any = []

    const data = impData.map((main: any, indexImp: any) => {
      let indexPlano = planoData.findIndex((data: any) => data.min === main.min)
      if (indexPlano !== -1 && planoData[indexPlano].showError === false) {
        impData[indexImp].newShelfFill =
          planoData[indexPlano].newShelfFillPlanogram
        impData[indexImp].actionType = planoData[indexPlano].actionTypePlanogram
        impData[indexImp].numberOfRangeStores =
          planoData[indexPlano].newnoofrangestoresPlanogram
        impData[indexImp].newAdded = true
        planoData.splice(indexPlano, 1)
        // planoData = planoData.filter(
        //   (item: any) => item.min !== impData[indexImp].min
        // )
        // return impData[indexImp]
      } else {
        // patchApiErrors(rafpendingActionDetailsCT06.eventId, newData[index])
        // return impData[indexImp]
        return
      }
    })
    // impData.reverse()
    // const impDataSort = impData.map((item: any) => {
    //   if (item.newAdded === true) {
    //     return impData.unshift()
    //   } else {
    //     return item
    //   }
    // })
    console.log('firstShowImport', firstShowImport)

    let showFirstNewlyAdded: any = []
    let showLast: any = []

    impData.map((val: any) => {
      if (val.newAdded) {
        showFirstNewlyAdded.push(val)
      } else {
        showLast.push(val)
      }
    })
    let mainData = [...showFirstNewlyAdded, ...showLast]
    setImportedData(mainData)
    // setImportedData(impData)
    setXlslPlanogramimportedData(planoData)
    console.log('planoData patchApiErrors', planoData)
    setXlslItemNotFoundPlanogram([])
    let checkError = xlslPlanogramimportedData.some(
      (m: any) => m.showError === true
    )
    checkError
      ? setPanogramErrorDialogShow(true)
      : setPanogramErrorDialogShow(false)
    patchApiErrors() // patch call
    setNewlyAddedTitle(true)
  }
  const [selectedPlanogramItems, setSelectedPlanogramItems] = useState<any>([])
  const handlePlanogramDelete = () => {
    console.log('selectedPlanogramItems', selectedPlanogramItems)
    let _tasks = xlslPlanogramimportedData.filter(
      (value: any) => !selectedPlanogramItems.includes(value)
    )
    let deleteTask = xlslPlanogramimportedData.filter((value: any) =>
      selectedPlanogramItems.includes(value)
    )
    deleteTask.length > 0 &&
      deleteTask.map((deleteItem: any) => {
        deleteRangeResetsPlanogramError(
          rafpendingActionDetailsCT06.eventId,
          deleteItem.min
        )
          .then((res: any) => {
            console.log('Success', res)
          })
          .catch((err: any) => {
            console.log('deleteError', err)
          })
      })

    setXlslPlanogramimportedData(_tasks)
    setSelectedPlanogramItems([])
  }
  const [editPlanoButton, setEditPlanoButton] = useState<any>(true)
  const [editPlanoClick, setEditPlanoClick] = useState<any>(false)

  useEffect(() => {
    if (selectedPlanogramItems.length > 0) {
      setEditPlanoButton(false)
    } else {
      setEditPlanoButton(true)
      setEditPlanoClick(false)
    }
  }, [selectedPlanogramItems])

  const handlePlanogramEdit = () => {
    setEditPlanoClick(true)
    console.log('handlePlanogramEdit', handlePlanogramEdit)
  }

  const planogramShowErrorsDialog = (
    <Dialog
      open={planogramErrorDialogShow}
      onClose={handlePanogramErrorDialogClose}
      fullWidth
      classes={{
        paperFullWidth: classes.placeholderDialogFull,
        // depotStockTableData
        //   ? classes.placeholderDialogFull
        //   : classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={'View Planogram Comparison Detail'}
          // title={`North East`}
          onClose={handlePanogramErrorDialogClose}
        />
        <Box
          sx={{
            p: 3,
          }}
        >
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Typography variant="subtitle1" color="primary">
              View Planogram Comparison Detail
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DataTable
                value={xlslPlanogramimportedData && xlslPlanogramimportedData}
                className="p-datatable-sm"
                selectionMode="checkbox"
                selection={selectedPlanogramItems}
                onSelectionChange={(e: any) => {
                  setSelectedPlanogramItems(e.value)
                }}
                showGridlines
                scrollable
                rowHover
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{
                    width: '50px',
                    color: 'white',
                    backgroundColor: teal[900],
                  }}
                ></Column>
                {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
                {planogramViewCols.map((col: any, index: any) => {
                  return (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={
                        (col.field === 'actionTypePlanogram' &&
                          actionTypePlanogramTemplate) ||
                        (col.field === 'description' &&
                          descriptionImportedTemplate) ||
                        (col.field === 'currentnoofrangedstores' &&
                          currentNoOfRangeStoresTemplate) ||
                        (col.field === 'numberOfRangeStores' &&
                          newNoOfRangeStoresPlanogramTemplate) ||
                        (col.field === 'newShelfFillPlanogram' &&
                          newShelfFillPlanogramTemplate)
                      }
                      // style={{
                      //   width: col.width,
                      //   fontSize: '0.8rem',
                      //   padding: '8px',
                      // }}
                      // headerStyle={{
                      //   color: 'white',
                      //   backgroundColor: teal[900],
                      //   width: col.width,
                      //   fontSize: '0.9rem',
                      //   padding: '8px',
                      // }}
                      bodyStyle={tableBodyStyle(col.width)}
                      headerStyle={tableHeaderStyle(
                        col.width,
                        theme.palette.primary.main
                      )}
                    />
                  )
                })}
              </DataTable>
            </MuiPickersUtilsProvider>
            {/* {exceelErrors && showExceelErrors()} */}
          </Grid>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            {/* {xlslItemNotFoundPlanogram && xlslItemNotFoundPlanogram.join(', ') + "There is no matching MIN available in RCM App detail"} */}
            <Typography color="primary">
              Total <strong> {xlslPlanogramimportedData.length} </strong>{' '}
              records
            </Typography>

            {xlslItemNotFoundPlanogram.length > 0 && (
              <Typography color="error" variant="subtitle1">
                {`There is no matching ${xlslItemNotFoundPlanogram.join(
                  ', '
                )} ${
                  xlslItemNotFoundPlanogram.length > 1 ? "MIN's" : 'MIN'
                } available in RCM App detail.`}
              </Typography>
            )}
          </Grid>
          <Grid item container xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid item xl={8} lg={8} md={8} sm={12} xs={12}></Grid>
            <Grid
              item
              container
              xl={4}
              lg={4}
              md={4}
              sm={12}
              xs={12}
              style={{ textAlign: 'center' }}
              spacing={1}
            >
              <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlanogramDelete}
                >
                  Delete
                </Button>
              </Grid>
              <Grid item xl={2} lg={2} md={2} sm={6} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlanogramEdit}
                  disabled={editPlanoButton}
                >
                  Edit
                </Button>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlanogramSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            p: 3,
            pb: 0,
            justifyContent: 'right',
          }}
        ></Box>
      </Box>
    </Dialog>
  )

  const [errorAlertForPlano, setErrorAlertForPlano] = useState<any>(false)
  const errorPlanoDialogClose = () => {
    setErrorAlertForPlano(false)
  }
  const errorPlanoDialog = (
    <Dialog
      open={errorAlertForPlano}
      onClose={errorPlanoDialogClose}
      fullWidth
      classes={{
        paperFullWidth: '50%',
        // depotStockTableData
        //   ? classes.placeholderDialogFull
        //   : classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={'Alert'}
          // title={`North East`}
          onClose={errorPlanoDialogClose}
        />
        <Box
          sx={{
            display: 'flex',
            p: 3,
            // pb: 0,
            justifyContent: 'right',
          }}
        >
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <>
              <Typography variant="h6" style={{ fontWeight: '900' }}>
                Alert!
              </Typography>
              <Typography style={{ fontSize: '17px' }}>
                <strong style={{ fontWeight: '900' }}>
                  Planogram comparison{' '}
                </strong>{' '}
                error is still exist, resolve all the errors to complete the
                task.
              </Typography>
            </>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  )

  const [newlyAddedTitle, setNewlyAddedTitle] = useState<any>(false)
  const productListTable = (
    <Grid
      item
      container
      xl={12}
      lg={12}
      md={12}
      sm={12}
      xs={12}
      style={{ alignItems: 'center', paddingTop: '20px' }}
      spacing={2}
    >
      <Grid item xl={7} lg={7} md={7} sm={5} xs={12}>
        <Typography variant="subtitle1" color="primary">
          Product List
        </Typography>
      </Grid>
      <Grid item container xl={5} lg={5} md={5} sm={5} xs={12} spacing={2}>
        {hideCT36() && (
          <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
            <Button
              color="primary"
              disabled={xlslPlanogramimportedData.length === 0}
              onClick={handlePlanogramClick}
            >
              Planogram Errors{' '}
              <span style={{ color: 'red' }}>
                {' '}
                ({xlslPlanogramimportedData.length})
              </span>
            </Button>
          </Grid>
        )}
        <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
          {/* <FormControl
            variant="outlined"
            style={{
              width: '90%',
            }}
          > */}
          {/* {!bulkActions && (
              <InputLabel
                id="demo-simple-select-outlined-label"
                style={{
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                BULK ACTIONS
              </InputLabel>
            )} */}
          {/* <InputLabel>Bulk Actions</InputLabel>

            <Select
              value={bulkActions}
              // displayEmpty
              // inputProps={{ 'aria-label': 'Without label' }}
              onChange={(e: any) => setBulkActions(e.target.value)}
              className={classes.bulkActionSelect}
              // input={
              //   <OutlinedInput
              //     margin="dense"
              //     className={classes.bulkActionSelect}
              //     placeholder="BULK ACTIONS"
              //   />
              // }
            >
              
              {massActions.map((action: any) => {
                return (
                  <MenuItem value={action.value} key={action.value}>
                    {action.label}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl> */}
          <Typography color="primary">
            <AutocompleteSelect
              value={bulkActions}
              options={bulkActionOptions && bulkActionOptions}
              onChange={handleBulkActions}
              placeholder="Bulk Actions"
            />
          </Typography>
        </Grid>
        <Grid item xl={4} lg={4} md={4} sm={4} xs={5}>
          <Button variant="contained" color="primary" onClick={refreshPage}>
            Refresh
          </Button>
        </Grid>
      </Grid>

      {rafpendingActionDetailsCT06 &&
      rafpendingActionDetailsCT06.taskName.toLowerCase() === 'ct36' ? (
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <DataTable
            value={importedData}
            selectionMode="checkbox"
            selection={selectedProductListItems}
            onSelectionChange={(e: any) => {
              setSelectedProductListItems(e.value)
            }}
            showGridlines
            scrollable
            scrollHeight="300px"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{
                width: '50px',
                color: 'white',
                backgroundColor: teal[900],
              }}
            ></Column>
            {ct36TableCols.map((col: any, index: any) => {
              return (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  bodyStyle={tableBodyStyle('auto')}
                  headerStyle={tableHeaderStyle(
                    'auto',
                    theme.palette.primary.main
                  )}
                  body={
                    col.field === 'includeInStoreWastage' &&
                    CT36IncludeInStoreWastageTemplate
                  }
                  sortable
                />
              )
            })}
          </DataTable>
        </Grid>
      ) : (
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DataTable
              value={importedData && importedData}
              // className="p-datatable-sm"
              // paginator
              // rows={10}
              // alwaysShowPaginator={false}
              // editMode="cell"
              selectionMode="checkbox"
              selection={selectedProductListItems}
              onSelectionChange={(e: any) => {
                // setSelectedProductListItems(e.value)
                // setReplacementAssociationProduct(e.value)
                // setSupplierSelected(e.value)
                handleProductTableSelect(e)
              }}
              showGridlines
              scrollable
              scrollHeight="300px"
              //rowHover
            >
              <Column
                selectionMode="multiple"
                headerStyle={{
                  width: '50px',
                  color: 'white',
                  backgroundColor: teal[900],
                }}
              ></Column>
              {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
              {productListCols.map((col: any, index: any) => {
                return (
                  <Column
                    key={index}
                    field={col.field}
                    header={col.header}
                    body={
                      (col.field === 'actionType' && actionTypeTemplate) ||
                      (col.field === 'lineStatus' && lineStatusTemplate) ||
                      (col.field === 'pin' && pinProductListTemplate) ||
                      (col.field === 'ingredientMin' &&
                        ingredientMinTemplate) ||
                      (col.field === 'legacyItemNumbers' &&
                        legacyItemNumbersImportedTemplate) ||
                      //edit fields
                      (col.field === 'man' && manImportedTemplate) ||
                      (col.field === 'description' &&
                        descriptionImportedTemplate) ||
                      (col.field === 'replaceMin' &&
                        replaceMinImportedTemplate) ||
                      (col.field === 'replaceMinDescription' &&
                        replaceMinDescriptionImportedTemplate) ||
                      (col.field === 'unitretailInc' &&
                        unitretailIncImportedTemplate) ||
                      (col.field === 'unitretailEx' &&
                        unitretailExImportedTemplate) ||
                      (col.field === 'unitcost' && unitCostImportedTemplate) ||
                      (col.field === 'casecost' && caseCostImportedTemplate) ||
                      (col.field === 'packquantity' &&
                        packQuantityImportedTemplate) ||
                      // (col.field === 'supplierId' &&
                      //   supplierIdImportedTemplate) ||
                      // (col.field === 'supplierSiteNameCode' &&
                      //   supplierSiteNameCodeImportedTemplate) ||
                      (col.field === 'local' && localTemplate) ||
                      (col.field === 'perStorepPerWeek' &&
                        perStorepPerWeekImportedTemplate) ||
                      (col.field === 'onlineCFC' && onlineCFCTemplate) ||
                      (col.field === 'wholesale' && wholesaleTemplate) ||
                      (col.field === 'onlineStorePick' &&
                        onlineStorePickTemplate) ||
                      (col.field === 'currentnoofrangedstores' &&
                        currentNoOfRangeStoresTemplate) ||
                      (col.field === 'includeInClearancePricing' &&
                        includeInClearancePricingTemplate) ||
                      (col.field === 'includeInStoreWastage' &&
                        includeInStoreWastageTemplate) ||
                      (col.field === 'clearDepotBy' && clearDepotByTemplate) ||
                      (col.field === 'supplierCommitment' &&
                        supplierCommitmentTemplate) ||
                      //edit fields

                      (col.field === 'noOfRecipeMin' && recipeMinTemplate) ||
                      (col.field === 'existingSupplier' &&
                        existingSupplierProductListTemplate) ||
                      (col.field === 'existingSupplierSite' &&
                        existingSupplierSiteProductListTemplate) ||
                      (col.field === 'effectiveDateFrom' &&
                        effectiveDateFromProductTableTemplate) ||
                      (col.field === 'effectiveDateTo' &&
                        effectiveDateToProductTableTemplate) ||
                      (col.field === 'finalStopOrderDate' &&
                        finalStopOrderDateTemplate) ||
                      (col.field === 'systemSuggestedStopOrderDate' &&
                        systemGeneratedStopOrderDateTemplate) ||
                      (col.field === 'lastPoDate' && lastPoDateTemplate) ||
                      (col.field === 'numberOfRangeStores' &&
                        newNoOfRangeStoresTemplate) ||
                      // (col.field === 'newShelfFill' &&
                      //   newShelfFillImportedTemplate) ||
                      (col.field === 'newShelfFillMultiplied' &&
                        newShelfFillImportedTemplate) ||
                      (col.field === 'depotStockUnit' && depotStockTemplate) ||
                      (col.field === 'depotClearbyReservedQtyRetail' &&
                        depotClearReservedQtyRetailImportedTemplate) ||
                      (col.field === 'depotClearbyReservedQtyWholesale' &&
                        depotClearReservedQtyWholesaleImportedTemplate) ||
                      (col.field === 'depotClearbyReservedQtyOnline' &&
                        depotClearReservedQtyOnlineImportedTemplate) ||
                      (col.field === 'newSupplier' &&
                        newSupplierImportedTemplate) ||
                      (col.field === 'newSupplierSite' &&
                        newSupplierSiteImportedTemplate) ||
                      (col.field === 'comments' && commentsTemplate) ||
                      (col.field === 'currentVsNewShelfFill' &&
                        currentshelffill_vs_newfillTemplate) ||
                      (col.field === 'currentVsNewShelfFillPercent' &&
                        currentshelffill_vs_newfill_percantTemplate) ||
                      (col.field === 'currentShelfFill' &&
                        currentShelfFillTemplate) ||
                      (col.field === 'depotShelfLifeMinimum' &&
                        depotShelfLifeImportedTemplate) ||
                      (col.field === 'productShelfLifeInstore' &&
                        productShelfLifeImportedTemplate) ||
                      (col.field === 'currentVersusNewStores' &&
                        currentVsNewStoresImportedTemplate) ||
                      (col.field === 'storesRangedCurrentVsProposed' &&
                        storesRangedCurrentVsProposedTemplate) ||
                      (col.field ===
                        'weeksCoveronTotalStockonHandtoResetDate' &&
                        weeksCoveronTotalStockTemplate) ||
                      (col.field === 'excessstock' && excessStockTemplate) ||
                      (col.field === 'averageWeeklyVolume' &&
                        averageWeeklyVolumeTemplate) ||
                      (col.field === 'forward_forecast_to_launch' &&
                        forwardForecastToLaunchTemplate) ||
                      (col.field === 'storeStockUnit' &&
                        storeStockUnitTemplate) ||
                      (col.field === 'totalstock' && totalstockTemplate) ||
                      (col.field === 'ownBrand' && ownBrandTemplate) ||
                      (col.field === 'openPos' && openPosTemplate) ||
                      (col.field === 'shelfLifeatManufacture' &&
                        shelfLifeatManufactureTemplate) ||
                      (col.field === 'safewaybrandedequivalent' &&
                        safewaybrandedequivalentTemplate) ||
                      (col.field === 'forcastedWeeksCovertoResetDate' &&
                        forcastedWeeksCovertoResetDateTemplate)
                    }
                    // style={{
                    //   width: col.width,
                    //   fontSize: '0.8rem',
                    //   padding: '8px',
                    // }}
                    // headerStyle={{
                    //   color: 'white',
                    //   backgroundColor: teal[900],
                    //   width: col.width,
                    //   fontSize: '0.9rem',
                    //   padding: '8px',
                    // }}
                    bodyStyle={tableBodyStyle(col.width)}
                    headerStyle={tableHeaderStyle(
                      col.width,
                      theme.palette.primary.main
                    )}
                    sortable
                  />
                )
              })}
            </DataTable>
          </MuiPickersUtilsProvider>
          {/* {exceelErrors && showExceelErrors()} */}
        </Grid>
      )}
      {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <button
        //  className={classes.backButton}
        >
          <Typography variant="subtitle1">View More Columns</Typography>
        </button>
      </Grid> */}
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12} spacing={2}>
        <Typography variant="subtitle1">
          {/* {finalRangeState && displayManualErrors && ( */}
          {newlyAddedTitle && (
            // {true && (
            <>
              <span className={classes.errorRoundedIcon}>
                {' '}
                <ErrorTwoToneIcon
                  className={classes.errorRoundedIconTableGrid}
                />
                <>Newly added records</>
              </span>
            </>
          )}
          {showErrorIcon && (
            // {true && (
            <>
              <span className={classes.errorRoundedIcon}>
                {' '}
                <ErrorOutlinedIcon
                  className={classes.errorOutlinedIconErrorTableGrid}
                />
                <> Error</>
              </span>
            </>
          )}
        </Typography>
        <Typography variant="subtitle1" color="error">
          {completeTaskPlaceHolderError !== ''
            ? completeTaskPlaceHolderError
            : ''}
        </Typography>
      </Grid>
    </Grid>
  )

  const handlePlaceholderDialogOpen = () => {
    setOpenPlaceholderDialog(true)
  }
  const handlePlaceholderDialogClose = () => {
    setOpenPlaceholderDialog(false)
  }

  const [openReplacementAssDialog, setOpenReplacementAssDialog] =
    useState(false)

  const handleReplacemantAssociationDialogOpen = () => {
    setOpenReplacementAssDialog(true)
  }
  const handleReplacemantAssociationDialogClose = () => {
    setOpenReplacementAssDialog(false)
  }

  console.log('placeholderProducts CHeck', placeholderProducts)

  const handlePlaceholderAdd = (count: any) => {
    if (count != 0) {
      console.log('adding ', count)
      const newData: any = []
      for (var i = 0; i < count; i++) {
        var minVal = 1000000000000
        var max = 9999999999999
        var rand = Math.floor(minVal + Math.random() * (max - minVal))

        newData.push({
          _idCheck: rand,
          actionType: placeholderMin,
          min: '',
          comments: '',
          lineStatus: 'Draft',
          man: '',
          ingredientMin: '',
          pin: '',
          description: '',
          replaceMin: '',
          replaceMinDescription: '',
          newSupplier: '',
          newSupplierSite: '',
          numberOfRangeStores: '',
          storeCode: '',
          ownBrand: 'Y',
          // barcode: i === 0 ? '5010228012933' : '501022801293' + i,
          barcode: null,
          packquantity: '',
          local: 'Y',
          onlineCFC: 'Y',
          onlineStorePick: 'Y',
          wholesale: 'Y',
        })
      }

      console.log(newData)
      if (placeholderProducts && placeholderProducts.length > 0) {
        setPlaceholderProducts((prevState: any) => {
          return [...prevState, ...newData]
        })
      } else {
        setPlaceholderProducts(newData)
      }
    }
  }
  const handleReplacementAssAdd = (count: any) => {
    if (count != 0) {
      console.log('adding ', count)
      const newData: any = []
      for (var i = 0; i < count; i++) {
        var minVal = 1000000000000
        var max = 9999999999999
        var rand = Math.floor(minVal + Math.random() * (max - minVal))

        newData.push({
          _idCheck: rand,
          delist_min_pin: '111913101',
          replace_min_pin: '148759650',
          effectiveDateFrom: null,
          effectiveDateTo: null,
          comments: '',
        })
      }

      console.log(newData)
      if (
        replacementAssociationProduct &&
        replacementAssociationProduct.length > 0
      ) {
        setReplacementAssociationProduct((prevState: any) => {
          return [...prevState, ...newData]
        })
      } else {
        setReplacementAssociationProduct(newData)
      }
    }
  }

  // const removeReplaceAssociate = () => {
  //   let _tasks = replacementAssociationProduct.filter(
  //     (value: any) => !selectedReplaceAssData.includes(value)
  //   )
  //   console.log(_tasks)
  //   setReplacementAssociationProduct(_tasks)
  //   setSelectedReplaceAssData(null)
  // }

  useEffect(() => {
    console.log('selectedReplaceAssData', selectedReplaceAssData)
  }, [selectedReplaceAssData])

  const removePlaceholder = () => {
    if (
      selectedPlaceholderData.length < 1 ||
      selectedPlaceholderData === null
    ) {
      return
    }

    setIsProgressLoader(true)
    let _tasks = placeholderProducts.filter(
      (value: any) => !selectedPlaceholderData.includes(value)
    )

    // let _bar = barCodeExists.map((val: any) => {
    //   return selectedPlaceholderData.filter((fil: any) => {
    //     return val.barcode !== fil.barcode
    //   })
    // })
    // if (_bar && _bar.length > 0 && _bar[0].length === 0) {
    //   setBarCodeExists([])
    // }

    let barExistsUniq = barCodeExists.filter((array: any) => {
      return selectedPlaceholderData.some((filter: any) => {
        return array.barcode != filter.barcode
      })
    })

    console.log(_tasks)
    console.log(barExistsUniq)
    setBarCodeExists(barExistsUniq)
    // setBarCodeDoesnotExists(_bar)
    setPlaceholderProducts(_tasks)
    setSelectedPlaceholderData(null)
    setTimeout(() => {
      setIsProgressLoader(false)
    }, 1000)
  }

  useEffect(() => {
    console.log('barCodeExists', barCodeExists)
    console.log('barCodeDoesnotExists', barCodeDoesnotExists)
  }, [barCodeExists, barCodeDoesnotExists])

  const [countBarCount, setCountBarCout] = useState<any>(null)
  const [countBarCountCheck, setCountBarCoutCheck] = useState<any>(null)
  useEffect(() => {
    console.log('countBarCountCheck', countBarCountCheck)
  }, [barCodeDoesnotExists])

  const [booleanState, setBooleanState] = useState<any>([])

  const [awaitRes, setAwaitRes] = useState<any>([])

  useEffect(() => {
    setIsProgressLoader(false)

    console.log('awaitRes', awaitRes)
    // if (awaitRes.length > 0) {
    //   handlePlaceholderDialogOpen()
    // } else {
    //   handlePlaceholderDialogClose()
    // }
  }, [awaitRes])

  const handlePlaceholderSave = async () => {
    setAwaitRes([])
    setIsProgressLoader(true)
    let arrEmpty: any = []
    setBarCodeExists(arrEmpty)
    setBarCodeDoesnotExists(arrEmpty)
    // const checkDes = placeholderProducts.filter((val: any) => {
    //   return val.description === ''
    // })

    // if (checkDes.length > 0) {
    //   console.log('Description is mandatory')
    //   setPlaceDescError('For all rows description is mandatory**')
    //   setIsProgressLoader(false)
    //   return
    // } else {
    //   setPlaceDescError('')
    // }

    // const dataPlc = placeholderProducts.map(async (val: any) => {
    //   // const res = await Promise.all([
    //   //   getProductServiceByItemnumber(val.barcode),
    //   // ])
    //   // console.log('placeholderAsync', res.data)
    //   // return data
    //   try {
    //     let response = await getProductServiceByItemnumber(val.barcode)
    //     let success = response.data
    //     return setAwaitRes((prevState: any) => {
    //       // return [
    //       //   ...prevState,
    //       //   {
    //       //     success,
    //       //   },
    //       // ]
    //       return [
    //         ...prevState,
    //         {
    //           ...val,
    //           success: true,
    //         },
    //       ]
    //     })
    //   } catch (err: any) {
    //     let error = val.barcode
    //     const dataa = awaitRes.map((exits: any) => {
    //       if (exits._idCheck === val._idCheck) {
    //         console.log('barcode', val.barcode)
    //         delete exits.success
    //       }

    //       return exits
    //     })
    //     console.log(dataa)
    //     // setAwaitRes(dataa)
    //     console.error(err)
    //     // Handle errors here
    //   }
    // })

    // console.log('dataPlc', dataPlc)

    // try {
    //   placeholderProducts.map(async (val: any) => {
    //     const res = await Promise.all([
    //       getProductServiceByItemnumber(val.barcode),
    //     ])
    //     const data = await res
    //     console.log('placeholderAsync', data)
    //   })
    // } catch {
    //   throw Error('Promise failed')
    // }

    const success: any = []
    const error: any = []
    placeholderProducts.map((rowData: any) => {
      getProductServiceByItemnumber(rowData.barcode)
        .then((res: any) => {
          // Remove when gtins.length is empty when updated
          // if (res.data.gtins.length === 0) {
          //   return
          // }
          success.push(res)
          //5010228012933
          console.log('Success barcode', res)
          console.log('Success barcode', success)
          setBarCodeExists((prevState: any) => {
            return [
              ...prevState,
              {
                barcode:
                  res.data.gtins.length !== 0
                    ? res.data.gtins[0].id
                    : rowData.barcode,
                // barcode: res.data.gtins[0].id,
                minNum: res.data.itemNumber,
                success: true,
                id: rowData._idCheck,
              },
            ]
          })
        })
        .catch((err: any) => {
          error.push(err)
          console.log('ERror barcode', err)
          console.log('ERror barcode', error)
          setBarCodeDoesnotExists((prevState: any) => {
            return [
              ...prevState,
              {
                barcode: rowData.barcode,
              },
            ]
          })

          // const barExits = barCodeExists.map((val: any) => {
          //   if (val._idCheck === rowData.id) {
          //     console.log('barExits', val)
          //   }
          // })

          //     const status = statusCheck.map((val: any) => {
          //   if (val._idCheck === rowdata._idCheck) {
          //     val.barcode = event
          //     delete val.success
          //     delete val.minNum
          //   }
          //   return val
          // })
        })
    })

    // console.log('dataPlaceApi', success, error)
    // if (barCodeExists.length > 0) {
    //   let checkKeyPresenceInArray = (key: any) =>
    //     barCodeExists.some((obj: any) => Object.keys(obj).includes(key))
    //   var isKeyPresent = checkKeyPresenceInArray('barcode')
    // // }

    // console.log('isKeyPresent', isKeyPresent)
    // setTimeout(() => {
    //   setIsProgressLoader(false)
    //   if (barCodeDoesnotExists.length === placeholderProducts.length) {
    //     // if (!isKeyPresent) {
    //     handlePlaceholderDialogClose()
    //     setBooleanState([])
    //     setPlaceholderCount('')
    //     setPlaceholderProducts([])
    //     // setBarCodeExists(arrEmpty)
    //     // setBarCodeDoesnotExists(arrEmpty)
    //     if (importedData && importedData.length > 0) {
    //       let newData = [...importedData, ...placeholderProducts]
    //       console.log(newData)
    //       setImportedData(newData)
    //     } else {
    //       setImportedData(placeholderProducts)
    //     }
    //   }
    // }, 1000)
  }
  const [placeholderErrorDisplay, setPlaceholderErrorDisplay] = useState<any>(
    []
  )
  const checkingPlaceSave = () => {
    setIsProgressLoader(true)
    const checkDes = placeholderProducts.filter((val: any) => {
      return val.description === ''
    })

    if (checkDes.length > 0) {
      console.log('Description is mandatory')
      setPlaceDescError('For all rows description is mandatory**')
      setIsProgressLoader(false)
      return
    } else {
      setPlaceDescError('')
    }
    //

    let requests = placeholderProducts.map((row: any) => {
      return getProductServiceByItemnumber(row.barcode).then((res: any) => {
        return res
      })
    })
    Promise.allSettled(requests).then((responses: any) => {
      // responses.forEach((response: any) => {
      //   if (response.status === 'fulfilled') {
      //     console.log('checkingPlaceSave', response)
      //   }
      // })

      const fullFilled = responses.filter((val: any) => {
        return val.status === 'fulfilled'
      })
      setIsProgressLoader(false)
      if (fullFilled.length > 0) {
        setPlaceholderErrorDisplay(fullFilled)
      } else if (fullFilled.length === 0) {
        handlePlaceholderDialogClose()
        setPlaceholderErrorDisplay([])
        setPlaceholderCount('')
        setPlaceholderProducts([])
        if (importedData && importedData.length > 0) {
          let newData = [...importedData, ...placeholderProducts]
          console.log(newData)
          setImportedData(newData)
        } else {
          setImportedData(placeholderProducts)
        }
      }

      console.log('checkingPlaceSave', fullFilled)
    })
    // console.log('checkingPlaceSave', requests)
  }

  const checkingPlaceDelete = () => {
    let _tasks = placeholderProducts.filter(
      (value: any) => !selectedPlaceholderData.includes(value)
    )
    setPlaceholderProducts(_tasks)
    const check = selectedPlaceholderData.map((val: any) => {
      const check2 = placeholderErrorDisplay.filter((fil: any) => {
        let compare = val.barcode === fil.value.data.gtins[0].id
        if (compare) {
          const splice = placeholderErrorDisplay.splice(fil, 1)
          return splice
        }
      })
      return check2
    })
    setSelectedPlaceholderData([])
  }

  useEffect(() => {
    console.log('placeholderErrorDisplay', placeholderErrorDisplay)
  }, [placeholderErrorDisplay])

  const handlePlaceholderUploadOpen = () => {
    setOpenPlaceholderUpload(true)
  }
  const handlePlaceholderUploadClose = () => {
    setOpenPlaceholderUpload(false)
    setPlaceholderFile('')
  }

  const handlePlaceholderUpload = (event: any) => {
    setPlaceholderFile(event.target.files[0])
  }
  const handlePlaceholderFileUpload = () => {
    console.log('handlePlaceholderFileUpload', 'Clicked')
    if (
      placeholderFile &&
      (placeholderFile.type === 'text/csv' ||
        placeholderFile.type === 'application/vnd.ms-excel' ||
        placeholderFile.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ) {
      console.log(placeholderFile)
      import('xlsx').then((xlsx) => {
        const reader = new FileReader()
        reader.onload = (event: any) => {
          const wb = xlsx.read(event.target.result, { type: 'array' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const data = xlsx.utils.sheet_to_json(ws)
          console.log(data)
          const data1 = xlsx.utils.sheet_to_json(ws, { header: 1 })
          const cols: any = data1[0]

          const json = JSON.parse(
            JSON.stringify(data).replace(/"\s+|\s+"/g, '"')
          )

          const convert = (obj: any) => {
            const result: any = {}

            Object.keys(obj).forEach(function (key: any) {
              result[key.replace(/ /g, '').replace(/[()|/]/g, '')] = obj[key]
            })
            return result
          }
          var result = json.map(function (o: any) {
            return convert(o)
          })

          // const validate = result.forEach((val: any) => {
          //   if (
          //     val.hasOwnProperty('Description') &&
          //     val.hasOwnProperty('OwnBrand')
          //   ) {
          //     return val
          //   }
          // })

          const validate = result.filter((val: any) => {
            return (
              val.hasOwnProperty('MINPINDescription') &&
              val.hasOwnProperty('OWNBrand')
              // &&
              // val.hasOwnProperty('ActionType') &&
              // val.ActionType === placeholderMin
            )
          })

          let newData = validate.map((d: any) => {
            var minVal = 1000000000000
            var max = 9999999999999
            var rand = Math.floor(minVal + Math.random() * (max - minVal))
            return {
              _idCheck: rand,
              actionType: placeholderMin,
              description: d.MINPINDescription ? d.MINPINDescription : '',
              ownBrand: d.OWNBrand ? d.OWNBrand : '',
              barcode: d.Barcode ? d.Barcode : null,
              newSupplier: d.SupplierCode ? d.SupplierCode : '', // supplier site field
              newSupplierSite: d.SupplierSiteCode ? d.SupplierSiteCode : '', // supplier site code
              packquantity: d.CasePack ? d.CasePack : '',
              numberOfRangeStores: d.NewNumberofRangeStores
                ? d.NewNumberofRangeStores
                : '',
              storeCode: d.StoreCode ? d.StoreCode : '',
              local: d.Local ? d.Local : '',
              onlineCFC: d.OnlineCFC ? d.OnlineCFC : '',
              onlineStorePick: d.OnlineStorePick ? d.OnlineStorePick : '',
              wholesale: d.Wholesale ? d.Wholesale : '',
              comments: d.Comments ? d.Comments : '',
              lineStatus: 'Draft',
              man: '',
              ingredientMin: '',
              pin: '',
              replaceMin: '',
              replaceMinDescription: '',
            }
          })
          console.log('newData', newData)

          // let newData = validate.map((d: any, index: any) => {
          //   var minVal = 1000000000000
          //   var max = 9999999999999
          //   var rand = Math.floor(minVal + Math.random() * (max - minVal))

          //   return {
          //     _idCheck: rand,
          //     actionType: placeholderMin,
          //     min: `0${index}00${index}`,
          //     comments: d[cols[12]] ? d[cols[12]] : '',
          //     lineStatus: 'Draft',
          //     man: 'NA',
          //     ingredientMin: 'NA',
          //     pin: 'NA    ',
          //     description: d[cols[0]] ? d[cols[0]] : '',
          //     replaceMin: 'NA',
          //     replaceMinDescription: 'NA',
          //     existingSupplier: d[cols[3]] ? d[cols[3]] : '',
          //     existingSupplierSite: d[cols[4]] ? d[cols[4]] : '',
          //     numberOfRangeStores: d[cols[6]] ? d[cols[6]] : '',
          //     storeCode: d[cols[7]] ? d[cols[7]] : '',
          //     ownBrand: d[cols[1]] ? d[cols[1]] : '',
          //     barcode: d[cols[2]] ? d[cols[2]] : '',
          //     packquantity: d[cols[5]] ? d[cols[5]] : '',
          //     local: d[cols[8]] ? d[cols[8]] : '',
          //     onlineCFC: d[cols[9]] ? d[cols[9]] : '',
          //     onlineStorePick: d[cols[10]] ? d[cols[10]] : '',
          //     wholesale: d[cols[11]] ? d[cols[11]] : '',
          //   }
          // })

          newData.map((rowdata: any) => {
            return barcodetemplateCheck(rowdata, rowdata.barcode)
          })
          console.log('handlePlaceholderFileUpload', newData)
          if (placeholderProducts && placeholderProducts.length > 0) {
            setPlaceholderProducts((prevState: any) => {
              return [...prevState, ...newData]
            })
          } else {
            setPlaceholderProducts([...newData])
          }
        }

        reader.readAsArrayBuffer(placeholderFile)
      })
      handlePlaceholderUploadClose()
    } else {
      alert('Upload correct file')
      setPlaceholderFile(null)
    }
  }

  const uploadPlaceholderDialog = (
    <Dialog open={openPlaceholderUpload} onClose={handlePlaceholderUploadClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: small ? '400px' : '260px',
          // height: "250px",
          // border: '3px solid green',
          borderRadius: 5,
          p: 1,
        }}
      >
        <DialogHeader
          title={`Upload Placeholder Products`}
          onClose={handlePlaceholderUploadClose}
        />

        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="primary">
            Upload Placeholder Products
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <input
              type="text"
              value={placeholderFile ? placeholderFile.name : ''}
              onClick={() =>
                document.getElementById('placeholderFile')!.click()
              }
              className={classes.uploadTextfield}
              placeholder="No file selected"
              readOnly
            />
            <Input
              type="file"
              id="placeholderFile"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handlePlaceholderUpload}
              required
            />
            <button
              type="button"
              onClick={() =>
                document.getElementById('placeholderFile')!.click()
              }
              className={classes.uploadButton}
              style={{ width: '60%' }}
            >
              Browse...
            </button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            p: 2,
            justifyContent: 'right',
          }}
        >
          <Box>
            <Typography color="primary">
              Supported file type in MS Excel
              <i className="pi pi-file-excel" style={{ fontSize: '18px' }}></i>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        >
          <Button
            //   className={classes.submitButtons}
            variant="contained"
            color="primary"
            onClick={handlePlaceholderFileUpload}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Dialog>
  )

  const onEditorValueChange = (props: any, value: any) => {
    let updatedProducts = [...props.value]
    updatedProducts[props.rowIndex][props.field] = value
    setPlaceholderProducts(updatedProducts)
  }

  const inputTextEditor = (props: any, field: any) => {
    return (
      <input
        type="text"
        value={props.rowData[field]}
        onChange={(e: any) => onEditorValueChange(props, e.target.value)}
      />
    )
  }

  useEffect(() => {
    console.log('placeholderProducts', placeholderProducts)
  }, [placeholderProducts])

  const onChangePlaceHolderFields = (
    prevState: any,
    field: any,
    rowDataSelected: any,
    eventValue: any
  ) => {
    return prevState.map((obj: any) =>
      obj._idCheck === rowDataSelected._idCheck
        ? Object.assign(obj, { [field]: eventValue })
        : obj
    )
  }

  const ownBrandPlaceholderTemplate = (rowData: any) => {
    console.log('ownBrandPlaceholderTemplate', rowData)
    return (
      <Select
        value={rowData && rowData.ownBrand}
        // onChange={(e) => eventHandleDetailsSOT(e)}
        onChange={(e: any) => {
          setPlaceholderProducts((prevState: any) => {
            return onChangeProductTableFields(
              prevState,
              'ownBrand',
              rowData,
              e.target.value
            )
          })
          // setPlaceholderProducts((prevState: any) => {
          //   return prevState.map((obj: any) =>
          //     obj.min === rowData.min
          //       ? Object.assign(obj, { ownBrand: e.target.value })
          //       : obj
          //   )
          // })
        }}
        input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
      >
        {yesOrNo.map((type: any) => {
          return (
            <MenuItem
              value={type.name}
              key={type.name}
              className={classes.muiSelect}
            >
              {type.text}
            </MenuItem>
          )
        })}
      </Select>
    )
  }
  const [checkBar, setCheckBar] = useState<any>([])
  const [statusCheck, setStatusCheck] = useState<any>([])

  const barcodetemplateCheck = async (rowdata: any, event: any) => {
    console.log('barcodetemplateCheckrowdata', rowdata)
    console.log('barcodetemplateCheckrowevent', event)
    //5010228012933
    try {
      const main = await getProductServiceByItemnumber(event)
      const response = await main.data
      console.log('response', response)
      // setCheckBar((prevState: any) => [
      //   ...prevState,
      //   {
      //     exits: response.gtins,
      //     rowdata: event,
      //     _idCheck: rowdata._idCheck,
      //     success: true,
      //   },
      // ])
      setPlaceholderMultiSelectCheck(true)
      setStatusCheck((prevState: any) => [
        ...prevState,
        {
          ...rowdata,
          success: true,
          barcode: event,
          minNum: response.itemNumber,
        },
      ])
    } catch (err: any) {
      const status = statusCheck.map((val: any) => {
        if (val._idCheck === rowdata._idCheck) {
          val.barcode = event
          delete val.success
          delete val.minNum
        }
        return val
      })
      console.log(status)
      setPlaceholderMultiSelectCheck(false)
      setStatusCheck(status)
      // const check = checkBar.filter((val: any) => {
      //   return val._idCheck !== rowdata._idCheck
      // })
      // setCheckBar(check)
      // console.log('err', rowdata._idCheck)
      // console.log('err', check)
    }
    console.log('TryCatch', statusCheck)
  } //

  useEffect(() => {
    // hPHS()
    console.log('statusCheckUseEffect', statusCheck)
  }, [statusCheck])
  const [placeDescError, setPlaceDescError] = useState<any>('')
  const [placeHolderSaveError, setPlaceholderSaveError] = useState<any>(false)
  const [errorBarcodeDisplay, setErrorBarcodeDisplay] = useState<any>([])
  const hPHS = () => {
    const checkDes = placeholderProducts.filter((val: any) => {
      return val.description === ''
    })
    // if (checkDes.length > 0) {
    //   console.log('Description is mandatory')
    //   setPlaceDescError('For all rows description field is mandatory**')
    //   setIsProgressLoader(false)
    //   return
    // } else {
    //   setPlaceDescError('')
    // }
    setIsProgressLoader(true)
    let checkKeyPresenceInArray = (key: any) =>
      statusCheck.some((obj: any) => Object.keys(obj).includes(key))
    var isKeyPresent = checkKeyPresenceInArray('success')

    console.log('isKeyPresent', isKeyPresent)
    console.log('statusCheck', statusCheck)
    if (!isKeyPresent) {
      setIsProgressLoader(false)
      handlePlaceholderDialogClose()
      setPlaceholderSaveError(isKeyPresent)
      setErrorBarcodeDisplay([])
      setPlaceholderCount('')
      setPlaceholderProducts([])
      if (importedData && importedData.length > 0) {
        let newData = [...importedData, ...placeholderProducts]
        console.log(newData)
        setImportedData(newData)
      } else {
        setImportedData(placeholderProducts)
      }
    } else {
      setPlaceholderSaveError(isKeyPresent)
      // setErrorBarcodeDisplay(statusCheck)
      setStatusCheck(statusCheck)
      setIsProgressLoader(false)
    }
  }

  const deletePlace = () => {
    //5010228012933
    let _tasks = placeholderProducts.filter(
      (value: any) => !selectedPlaceholderData.includes(value)
    )
    setPlaceholderProducts(_tasks)

    let deletePlaceH = statusCheck.filter((array: any) => {
      return selectedPlaceholderData.some((filter: any) => {
        return array.barcode != filter.barcode
      })
    })
    setStatusCheck(deletePlaceH)
    console.log('deletePlaceH', _tasks)
    setSelectedPlaceholderData([])

    // setErrorBarcodeDisplay(deletePlaceH)
    // setStatusCheck(deletePlaceH)
    // setErrorBarcodeDisplay(deletePlaceH)
  }

  const barCodePlaceholderTemplate = (rowData: any) => {
    return (
      <OutlinedInput
        margin="dense"
        className={classes.muiSelect}
        value={rowData && rowData.barcode}
        onChange={(e) => {
          if (e.target.value !== null) {
            if (e.target.value === '') {
              setPlaceholderProducts((prevState: any) => {
                return onChangeProductTableFields(
                  prevState,
                  'barcode',
                  rowData,
                  null
                )
              })
            } else {
              setPlaceholderProducts((prevState: any) => {
                return onChangeProductTableFields(
                  prevState,
                  'barcode',
                  rowData,
                  e.target.value
                )
              })
            }
          }
          // barcodetemplateCheck(rowData, e.target.value)
        }}
      />
    )
  }

  const descriptionPlaceholderTemplate = (rowData: any) => {
    return (
      <OutlinedInput
        margin="dense"
        className={classes.muiSelect}
        value={rowData && rowData.description}
        onChange={(e) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'description',
                rowData,
                e.target.value
              )
            })
          }
        }}
      />
    )
  }

  const [supplierOption, setSupplierOption] = useState<any>([])
  const [siteOption, setSiteOption] = useState<any>([])

  // const [filteredCountries, setFilteredCountries] = useState<any>(null)
  // const [filteredCountries2, setFilteredCountries2] = useState<any>(null)

  const searchCountry = (e: any, type: any) => {
    let event = e
    setTimeout(() => {
      if (type === 'Site') {
        getSupplierSearchByIdNameSupplierAndSite(event.query, type)
          .then((res: any) => {
            if (res.data.SiteInfo.length !== 0) {
              let supplierData = res.data.SiteInfo.map((val: any) => {
                return val.siteName
              })
              setSiteOption(supplierData)
            } else {
              let siteNoData = () => {
                return ['No result found']
              }
              setSiteOption(siteNoData)
            }
          })
          .catch((err: any) => {
            console.log('Err')
            setSiteOption([])
          })
      } else {
        getSupplierSearchByIdNameSupplierAndSite(event.query, type)
          .then((res: any) => {
            if (res.data.SupplierInfo.length !== 0) {
              let supplierData = res.data.SupplierInfo.map((val: any) => {
                return val.supplierName
              })
              setSupplierOption(supplierData)
            } else {
              let supplierNoData = () => {
                return ['No result found']
              }
              setSupplierOption(supplierNoData)
            }
          })
          .catch((err: any) => {
            console.log('Err')
            setSupplierOption([])
          })
      }
    }, 250)
  }
  const supplierCodePlaceholderTemplate = (rowData: any) => {
    return (
      <div className="card primeCardPlacholder">
        <AutoCompletePrime
          value={rowData.newSupplier}
          suggestions={supplierOption}
          className="p-inputtext-sm p-d-block p-mb-2 autoCompletePrimeInput"
          completeMethod={(e: any) => searchCountry(e, 'Supplier')}
          field=""
          placeholder="Search"
          onChange={(e: any) =>
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'newSupplier',
                rowData,
                // value ? value.label : ''
                e.target.value
              )
            })
          }
        />
        <span className="searcIcon">
          <i className="pi pi-search"></i>
        </span>
      </div>
    )
  }

  //supplierSiteCodePlaceholderTemplate
  const supplierSiteCodePlaceholderTemplate = (rowData: any) => {
    // if (rowData.actionType === placeholderMin) {
    //   return <>NA</>
    // } else {
    return (
      <div className="card primeCardPlacholder">
        <AutoCompletePrime
          value={rowData.newSupplierSite}
          suggestions={siteOption}
          completeMethod={(e: any) => searchCountry(e, 'Site')}
          className="p-inputtext-sm p-d-block p-mb-2 autoCompletePrimeInput"
          field=""
          placeholder="Search"
          onChange={(e: any) =>
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'newSupplierSite',
                rowData,
                // value ? value.label : ''
                e.target.value
              )
            })
          }
        />
        <span className="searcIcon">
          <i className="pi pi-search"></i>
        </span>
      </div>
    )
    // }
  }

  const casePackPlaceholderTemplate = (rowData: any) => {
    return (
      <OutlinedInput
        margin="dense"
        className={classes.muiSelect}
        value={rowData && rowData.packquantity}
        onChange={(e) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'packquantity',
                rowData,
                e.target.value
              )
            })
          }
        }}
      />
    )
  }
  const newNoOfRangeStorePlaceholderTemplate = (rowData: any) => {
    return (
      <OutlinedInput
        margin="dense"
        className={classes.muiSelect}
        value={rowData && rowData.numberOfRangeStores}
        onChange={(e) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'numberOfRangeStores',
                rowData,
                e.target.value
              )
            })
          }
        }}
      />
    )
  }

  const localPlaceholderTemplate = (rowData: any) => {
    return (
      <Select
        value={rowData && rowData.local}
        // onChange={(e) => eventHandleDetailsSOT(e)}
        onChange={(e: any) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'local',
                rowData,
                e.target.value
              )
            })
          }
        }}
        input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
      >
        {yesOrNo.map((type: any) => {
          return (
            <MenuItem
              value={type.name}
              key={type.name}
              className={classes.muiSelect}
            >
              {type.text}
            </MenuItem>
          )
        })}
      </Select>
    )
  }
  const onlineCFCPlaceholderTemplate = (rowData: any) => {
    return (
      <Select
        value={rowData && rowData.onlineCFC}
        // onChange={(e) => eventHandleDetailsSOT(e)}
        onChange={(e: any) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'onlineCFC',
                rowData,
                e.target.value
              )
            })
          }
        }}
        input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
      >
        {yesOrNo.map((type: any) => {
          return (
            <MenuItem
              value={type.name}
              key={type.name}
              className={classes.muiSelect}
            >
              {type.text}
            </MenuItem>
          )
        })}
      </Select>
    )
  }
  const onlineStorePickPlaceholderTemplate = (rowData: any) => {
    return (
      <Select
        value={rowData && rowData.onlineStorePick}
        // onChange={(e) => eventHandleDetailsSOT(e)}
        onChange={(e: any) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'onlineStorePick',
                rowData,
                e.target.value
              )
            })
          }
        }}
        input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
      >
        {yesOrNo.map((type: any) => {
          return (
            <MenuItem
              value={type.name}
              key={type.name}
              className={classes.muiSelect}
            >
              {type.text}
            </MenuItem>
          )
        })}
      </Select>
    )
  }
  const wholeSalePlaceHolderTemplate = (rowData: any) => {
    return (
      <Select
        value={rowData && rowData.wholesale}
        // onChange={(e) => eventHandleDetailsSOT(e)}
        onChange={(e: any) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'wholesale',
                rowData,
                e.target.value
              )
            })
          }
        }}
        input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
      >
        {yesOrNo.map((type: any) => {
          return (
            <MenuItem
              value={type.name}
              key={type.name}
              className={classes.muiSelect}
            >
              {type.text}
            </MenuItem>
          )
        })}
      </Select>
    )
  }

  const commentsPlaceHolderTemplate = (rowData: any) => {
    return (
      <OutlinedInput
        margin="dense"
        className={classes.muiSelect}
        value={rowData && rowData.comments}
        onChange={(e) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'comments',
                rowData,
                e.target.value
              )
            })
          }
        }}
      />
    )
  }

  const placeholderDialog = (
    <Dialog
      open={openPlaceholderDialog}
      onClose={handlePlaceholderDialogClose}
      fullWidth
      classes={{
        paperFullWidth:
          placeholderProducts && placeholderProducts.length > 0
            ? classes.placeholderDialogFull
            : classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? "600px" : "260px",
          // height: "250px",
          //border: '3px solid green',
          borderRadius: 5,
          padding: '10px',
        }}
      >
        <DialogHeader
          title="Add placeholder Products"
          onClose={handlePlaceholderDialogClose}
        />

        {/* {barCodeExists &&
          barCodeExists.map((val: any) => (
            <Alert
              className={classes.alertMsg}
              style={{ color: '#000' }}
              severity="error"
            >
              <b>• {'\u00A0'}</b> BAR Code <b> '{val.barcode}' </b> is belongs
              to MIN <b> '{val.minNum}' </b>
            </Alert>
          ))} */}
        {placeholderErrorDisplay &&
          placeholderErrorDisplay.map((val: any) => (
            <Alert
              className={classes.alertMsg}
              style={{ color: '#000' }}
              severity="error"
            >
              <b>• {'\u00A0'}</b> BAR Code{' '}
              <b>
                {' '}
                '
                {val.value &&
                val.value.data &&
                val.value.data.gtins &&
                val.value.data.gtins.length > 0
                  ? val.value.data.gtins[0].id
                  : ''}
                '{' '}
              </b>{' '}
              is belongs to MIN <b> '{val.value.data.itemNumber}' </b>
            </Alert>
          ))}

        {/* {renderAlert()} */}

        <Grid
          item
          container
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          style={{
            textAlign: 'center',
            padding: '10px',
          }}
          spacing={2}
        >
          <Grid item md={7} sm={12} xs={12}>
            <Typography variant="subtitle2" color="primary">
              How many new lines do you wish to enter?
            </Typography>
          </Grid>
          <Grid item container md={7} sm={12} xs={12}>
            {/* <Grid item container xs={12}> */}

            <Grid item xs={12} sm={8}>
              <Typography variant="subtitle2" color="primary">
                {/* <input
                  type="text"
                  required
                  // className={classes.placeholderCountStyle}
                  style={{
                    width: small ? '88%' : '100%',
                  }}
                  value={placeholderCount}
                  onChange={(e: any) => setPlaceholderCount(e.target.value)}
                /> */}
                <OutlinedInput
                  type="number"
                  required
                  // className={classes.placeholderCountStyle}
                  style={{
                    width: small ? '88%' : '100%',
                    height: '40px',
                  }}
                  value={placeholderCount}
                  onChange={(e: any) => {
                    if (e.target.value && e.target.value >= 0) {
                      setPlaceholderCount(e.target.value)
                    }
                  }}
                />
              </Typography>
            </Grid>
            <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: '80px' }}
                onClick={() =>
                  handlePlaceholderAdd(placeholderCount ? placeholderCount : 0)
                }
              >
                ADD
              </Button>
            </Grid>
            {/* </Grid> */}
          </Grid>

          <Grid item md={1} sm={12} xs={12}>
            <Typography variant="subtitle2" color="primary">
              OR
            </Typography>
          </Grid>
          <Grid item md={3} sm={12} xs={12}>
            <Button
              variant="contained"
              color="primary"
              // type="submit"
              // style={{ width: '80px' }}
              onClick={handlePlaceholderUploadOpen}
            >
              Upload File
            </Button>
          </Grid>
          {placeholderProducts && placeholderProducts.length > 0 && (
            <Grid
              item
              container
              xs={12}
              style={{
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '20px',
              }}
            >
              <Grid
                item
                xs={10}
                style={{ textAlign: 'left', paddingBottom: '5px' }}
              >
                <Typography variant="body2" color="primary">
                  Product List {/* placeholder  */}
                </Typography>
              </Grid>
              <Grid item xs={2} style={{ paddingBottom: '5px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePlaceholderAdd(1)}
                >
                  Add Row
                </Button>
              </Grid>
              <Grid item xs={12}>
                <DataTable
                  value={placeholderProducts && placeholderProducts}
                  selectionMode={
                    placeholderProducts > 0 ? 'single' : 'checkbox'
                  }
                  selection={selectedPlaceholderData}
                  onSelectionChange={(e) => setSelectedPlaceholderData(e.value)}
                  // globalFilter={globalFilter}
                  className="p-datatable-sm"
                  //   stateStorage="session"
                  //   stateKey="dt-state-demo-session-eventmanage"
                  showGridlines
                  scrollable
                  scrollHeight="300px"
                  // editMode="cell"
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{
                      width: '50px',
                      color: 'white',

                      backgroundColor: theme.palette.primary.main,
                    }}
                    // frozen
                  ></Column>
                  {placeholderCols.map((col: any, index: any) => {
                    return (
                      <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        body={
                          (col.field === 'ownBrand' &&
                            ownBrandPlaceholderTemplate) ||
                          (col.field === 'barcode' &&
                            barCodePlaceholderTemplate) ||
                          (col.field === 'description' &&
                            descriptionPlaceholderTemplate) ||
                          (col.field === 'newSupplier' &&
                            supplierCodePlaceholderTemplate) ||
                          (col.field === 'packquantity' &&
                            casePackPlaceholderTemplate) ||
                          (col.field === 'numberOfRangeStores' &&
                            newNoOfRangeStorePlaceholderTemplate) ||
                          (col.field === 'local' && localPlaceholderTemplate) ||
                          (col.field === 'onlineCFC' &&
                            onlineCFCPlaceholderTemplate) ||
                          (col.field === 'onlineStorePick' &&
                            onlineStorePickPlaceholderTemplate) ||
                          (col.field === 'wholesale' &&
                            wholeSalePlaceHolderTemplate) ||
                          (col.field === 'comments' &&
                            commentsPlaceHolderTemplate) ||
                          (col.field === 'newSupplierSite' &&
                            supplierSiteCodePlaceholderTemplate)
                        }
                        bodyStyle={tableBodyStyle(col.width)}
                        headerStyle={tableHeaderStyle(
                          col.width,
                          theme.palette.primary.main
                        )}

                        // editor={(props: any) =>
                        //   inputTextEditor(props, 'description')
                        // }
                      />
                    )
                  })}
                </DataTable>
                {placeDescError && (
                  <h6 style={{ color: 'red', fontSize: 'large' }}>
                    {placeDescError}
                  </h6>
                )}
              </Grid>
              <Grid item xs={8}></Grid>
              <Grid item xs={2} style={{ paddingTop: '5px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={removePlaceholder}
                  // onClick={deletePlace}
                  onClick={checkingPlaceDelete}
                >
                  Delete
                </Button>
              </Grid>
              <Grid item xs={2} style={{ paddingTop: '5px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={handlePlaceholderSave}
                  // onClick={hPHS}
                  onClick={checkingPlaceSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Dialog>
  )

  const delistminpinTemplate = (rowData: any) => {
    return <span>{rowData ? rowData.min : ''}</span>
  }
  const replaceminpinTemplate = (rowData: any) => {
    return <span>{rowData ? rowData.min : ''}</span>
  }

  // Uncomment for Replacement Association

  const [replacePopupData, setReplacePopupData] = useState<any>({
    replaceMin: '',
    effectiveDateFrom: '',
    effectiveDateTo: '',
  })

  useEffect(() => {
    console.log('replacePopupData', replacePopupData)
  }, [replacePopupData])

  //const [replaceError, setReplaceError] = useState<any>(false)

  // const checkReplaceMinClick = () => {
  //   console.log('checkReplaceMinClick', checkReplaceMinClick)
  //   getProductServiceByItemnumber(replacePopupData.replaceMin)
  //     .then((res: any) => {
  //       console.log('Success')
  //       setReplaceError(true)
  //     })
  //     .catch((err: any) => {
  //       setReplaceError(false)
  //       console.log('Error')
  //     })
  // }
  const checkReplaceMinClick = (rowData: any) => {
    console.log('checkReplaceMinClick', checkReplaceMinClick)
    getProductServiceByItemnumber(rowData.replaceMin)
      .then((res: any) => {
        console.log('Success')
        setReplacementAssociationProduct((prevState: any) => {
          return onChangeProductTableFields(
            prevState,
            'replaceMinDescription',
            rowData,
            res.data.itemDescription
          )
        })
        setReplacementAssociationProduct((prevState: any) => {
          // return prevState.map((state: any) => {
          //   if (state._idCheck === rowData._idCheck) {
          //     return {
          //       ...state,
          //       replaceError: true,
          //     }
          //   } else {
          //     return state
          //   }
          // })

          return onChangeProductTableFields(
            prevState,
            'replaceError',
            rowData,
            true
          )
        })
      })
      .catch((err: any) => {
        console.log('Error')
        setReplaceError(true)
        setReplaceErrorMsg(`Invalid Replacement MIN - ${rowData.replaceMin}`)
        setReplacementAssociationProduct((prevState: any) => {
          // return prevState.map((state: any) => {
          //   if (state._idCheck === rowData._idCheck) {
          //     return {
          //       ...state,
          //       replaceError: false,
          //     }
          //   } else {
          //     return state
          //   }
          // })
          return onChangeProductTableFields(
            prevState,
            'replaceError',
            rowData,
            true
          )
        })
      })
  }

  const replaceMin_Pin_Association_Template = (rowData: any) => {
    return (
      <div style={{ display: 'flex' }}>
        <SearchSelect
          value={rowData && rowData.replaceMin}
          // onChange={handleBuyer}
          className={classes.muiSelect}
          onChange={(e: any) => {
            setReplaceError(false)
            setReplacementAssociationProduct((prevState: any) => {
              return prevState.map((state: any) => {
                if (state._idCheck === rowData._idCheck) {
                  return {
                    ...state,
                    replaceMin: e.target.value,
                    replaceError: false,
                  }
                } else {
                  return state
                }
              })
            })
          }}
          // onClick={() => checkReplaceMinClick()}
          onClick={() => checkReplaceMinClick(rowData)}
          styles={{
            fontSize: '12px',
          }}
        />
        <span style={{ marginLeft: '5px', marginTop: '5px' }}>
          <ConfirmCheckSign confirmValue={rowData.replaceError} />
        </span>
      </div>
    )
  }

  const replaceEffectiveDateToTemplate = (rowData: any) => {
    return (
      <DatePicker
        format="dd/MM/yy"
        value={
          rowData &&
          (rowData['effectiveDateTo'] ? rowData['effectiveDateTo'] : null)
        }
        onChange={(date: any) => {
          let newDate = date.toISOString().split('T')[0]
          console.log('new Date', newDate)
          console.log('min', rowData.min)
          console.log(rowData)
          setReplacementAssociationProduct((prevState: any) => {
            // return prevState.map((state: any) => {
            //   if (state._idCheck === rowData._idCheck) {
            //     return {
            //       ...state,
            //       effectiveDateTo: newDate,
            //     }
            //   } else {
            //     return state
            //   }
            // })
            return onChangeProductTableFields(
              prevState,
              'effectiveDateTo',
              rowData,
              newDate
            )
          })
        }}
        TextFieldComponent={(props: any) => (
          <OutlinedInput
            margin="dense"
            onClick={props.onClick}
            value={props.value}
            onChange={props.onChange}
            // className={classes.dateFields}
          />
        )}
        // maxDate={rowData['targetDate']}
        // maxDateMessage={allMessages.error.rafDateError}
        // minDate={new Date()}
      />
    )
  }
  const [selectedDate, setSelectedDate] = React.useState(
    new Date('2022-05-18T21:11:54')
  )

  const replaceEffectiveDateFromTemplate = (rowData: any) => {
    return (
      <DatePicker
        format="dd/MM/yy"
        value={
          rowData &&
          (rowData['effectiveDateFrom']
            ? rowData['effectiveDateFrom']
            : eventDetails[0].targetDate)
        }
        onChange={(date: any) => {
          let newDate = date.toISOString().split('T')[0]
          console.log('new Date', newDate)
          console.log('min', rowData.min)
          console.log(rowData)
          setReplacementAssociationProduct((prevState: any) => {
            // return prevState.map((state: any) => {
            //   if (state._idCheck === rowData._idCheck) {
            //     return {
            //       ...state,
            //       effectiveDateFrom: newDate,
            //     }
            //   } else {
            //     return state
            //   }
            // })
            return onChangeProductTableFields(
              prevState,
              'effectiveDateFrom',
              rowData,
              newDate
            )
          })
        }}
        TextFieldComponent={(props: any) => (
          <OutlinedInput
            margin="dense"
            onClick={props.onClick}
            value={props.value}
            onChange={props.onChange}
            // className={classes.dateFields}
          />
        )}
        // maxDate={rowData['targetDate']}
        // maxDateMessage={allMessages.error.rafDateError}
        // minDate={new Date()}
      />
    )
  }
  const replacementCommentsTemplate = (rowData: any) => {
    return (
      <TextField
        value={rowData && rowData.comments}
        onChange={(e: any) => {
          setReplacementAssociationProduct((prevState: any) => {
            // return prevState.map((state: any) => {
            //   if (state._idCheck === rowData._idCheck) {
            //     return {
            //       ...state,
            //       comments: e.target.value,
            //     }
            //   } else {
            //     return state
            //   }
            // })
            return onChangeProductTableFields(
              prevState,
              'comments',
              rowData,
              e.target.value
            )
          })
        }}
      />
    )
  }

  const removeReplacements = () => {
    let replacements = replacementAssociationProduct.filter(
      (value: any) => !selectedReplaceAssData.includes(value)
    )
    console.log(replacements)
    setReplacementAssociationProduct(replacements)
    setSelectedReplaceAssData([])
  }

  // const handleReplacementSave = () => {
  //   console.log('handleReplacementSave', importedData)
  //   if (replaceError) {
  //     const data = importedData.map((singleTask: any) => {

  //       let a = replacementAssociationProduct.filter(
  //         (t: any) => t.min !== singleTask.min
  //       )
  //       let b = singleTask
  //       b.replaceMin = replacePopupData.replaceMin
  //       a.push(b)
  //       a.sort((x: any, y: any) => (x.min > y.min ? 1 : y.min > x.min ? -1 : 0))
  //       setImportedData(a)
  //     })
  //   }
  //   setReplaceError(false)
  //   setOpenReplacementAssDialog(false)
  // }

  const handleReplacementSave = () => {
    console.log('handleReplacementSave', importedData)
    let proceedSave = true
    for (var i = 0; i < replacementAssociationProduct.length; i++) {
      if (!replacementAssociationProduct[i].replaceError) {
        proceedSave = false
        break
      }
    }
    if (proceedSave) {
      setImportedData((prevState: any) => {
        return prevState.map((state: any) => {
          let singleData = replacementAssociationProduct.filter(
            (prod: any) => prod._idCheck === state._idCheck
          )
          if (singleData && singleData.length === 1) {
            if (!singleData[0].effectiveDateFrom) {
              singleData[0].effectiveDateFrom = eventDetails[0].targetDate
            }
            console.log('singleData', singleData, state._idCheck)
            if (state._idCheck === singleData[0]._idCheck) {
              return {
                ...state,
                ...singleData[0],
              }
            } else {
              return state
            }
          } else {
            return state
          }
        })
      })
      setReplacementAssociationProduct([])
      setSelectedProductListItems([])
      setOpenReplacementAssDialog(false)
    } else {
      setReplaceError(true)
      setReplaceErrorMsg('Enter a Replacement MIN and Press the Search icon')
    }
  }

  useEffect(() => {
    console.log('handleReplacementSave', importedData)
  }, [importedData])

  const replacementAssociationDialog = (
    <Dialog
      open={openReplacementAssDialog}
      onClose={handleReplacemantAssociationDialogClose}
      fullWidth
      classes={{
        paperFullWidth:
          replacementAssociationProduct &&
          replacementAssociationProduct.length > 0
            ? classes.placeholderDialogFull
            : classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // border: '3px solid green',
          borderRadius: 5,
          padding: '10px',
        }}
      >
        <DialogHeader
          title="Add Replacement Association"
          onClose={handleReplacemantAssociationDialogClose}
        />
        <Grid
          item
          container
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          style={{
            textAlign: 'center',
            padding: '10px',
          }}
          spacing={2}
        >
          <Grid
            item
            container
            xs={12}
            style={{
              paddingLeft: '10px',
              paddingRight: '10px',
              paddingTop: '20px',
            }}
          >
            <Grid
              item
              xs={10}
              style={{ textAlign: 'left', paddingBottom: '5px' }}
            >
              <Typography variant="body1" color="primary">
                Add Replacement Association
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ paddingBottom: '5px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleReplacementAssAdd(1)}
              >
                Add Row
              </Button>
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DataTable
                  value={
                    replacementAssociationProduct &&
                    replacementAssociationProduct
                  }
                  selectionMode={
                    replacementAssociationProduct > 0 ? 'single' : 'checkbox'
                  }
                  selection={selectedReplaceAssData}
                  onSelectionChange={(e) => setSelectedReplaceAssData(e.value)}
                  // globalFilter={globalFilter}
                  className="p-datatable-sm"
                  //   stateStorage="session"
                  //   stateKey="dt-state-demo-session-eventmanage"
                  showGridlines
                  scrollable
                  scrollHeight="300px"
                  // editMode="cell"
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{
                      width: '50px',
                      color: 'white',

                      backgroundColor: theme.palette.primary.main,
                    }}
                  ></Column>
                  {replacementAssociationCols.map((col: any, index: any) => {
                    return (
                      <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        body={
                          (col.field === 'delist_min_pin' &&
                            delistminpinTemplate) ||
                          (col.field === 'replaceMin' &&
                            replaceMin_Pin_Association_Template) ||
                          (col.field === 'effectiveDateTo' &&
                            replaceEffectiveDateToTemplate) ||
                          (col.field === 'effectiveDateFrom' &&
                            replaceEffectiveDateFromTemplate) ||
                          (col.field === 'comments' &&
                            replacementCommentsTemplate)
                        }
                        bodyStyle={tableBodyStyle(col.width)}
                        headerStyle={tableHeaderStyle(
                          col.width,
                          theme.palette.primary.main
                        )}
                      />
                    )
                  })}
                </DataTable>
              </MuiPickersUtilsProvider>
            </Grid>
            {replaceError && (
              <Grid item xs={12}>
                <Typography color="error">{replaceErrorMsg}</Typography>
              </Grid>
            )}
            <Grid item xs={8}></Grid>
            <Grid item xs={2} style={{ paddingTop: '5px' }}>
              <Button
                variant="contained"
                color="primary"
                // onClick={removeReplaceAssociate}
                onClick={removeReplacements}
                disabled={selectedReplaceAssData.length > 0 ? false : true}
              >
                Delete
              </Button>
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '5px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReplacementSave}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  )

  const handleCompleteTaskDialogOpen = () => {
    setCompleteTaskDialogOpen(true)
  }

  const handleCompleteTaskDialogClose = () => {
    setCompleteTaskDialogOpen(false)
    setInputTextareaValue('')
    setCompleteTaskUploadedFile(null)
  }

  const completeTaskWithRefDoc = () => {
    if (rafpendingActionDetailsCT06) {
      const completePayload = {
        reviewDecision: 'CompleteTask',
        requester: {
          persona: rafpendingActionDetailsCT06.assigneeRole,
          details: {
            emailId: userDetail && userDetail.userdetails[0].user.emailId,
            userId: userDetail && userDetail.userdetails[0].user.userId,
            name:
              userDetail &&
              userDetail.userdetails[0].user.middleName &&
              userDetail.userdetails[0].user.middleName !== ''
                ? `${userDetail.userdetails[0].user.firstName} ${userDetail.userdetails[0].user.middleName} ${userDetail.userdetails[0].user.lastName}`
                : `${userDetail.userdetails[0].user.firstName} ${userDetail.userdetails[0].user.lastName}`,
          },
          roles:
            userDetail &&
            userDetail.userdetails[0].roles.map((role: any) => {
              return {
                // roleId: role.roleId,
                roleId: role.roleName,
              }
            }),
          usergroups:
            userDetail &&
            userDetail.userdetails[0].usergroups.map((group: any) => {
              return {
                groupId: group.groupId,
                status: group.status,
              }
            }),
        },
        eventStatus: 'Published',
        eventId: rafpendingActionDetailsCT06.eventId,
        milestones: [
          {
            action: '',
            status: rafpendingActionDetailsCT06.status,
            visibility: rafpendingActionDetailsCT06.visibility,
            activeTaskId: rafpendingActionDetailsCT06.activeTaskId,
            milestoneTaskId: rafpendingActionDetailsCT06.milestoneTaskId,
            taskName: rafpendingActionDetailsCT06.taskName,
            taskDescription: rafpendingActionDetailsCT06.taskDescription,
            tradingGroup: rafpendingActionDetailsCT06.tradingGroup,
            weeksPrior: rafpendingActionDetailsCT06.weeksPrior,
            dueDate: rafpendingActionDetailsCT06.dueDate,
            notifyDate: rafpendingActionDetailsCT06.notifyDate,
            slaDate: rafpendingActionDetailsCT06.slaDate,
            healthcheckDate: rafpendingActionDetailsCT06.healthcheckDate,
            assigneeDetails: {
              emailId: rafpendingActionDetailsCT06.assigneeEmailId,
              userId: rafpendingActionDetailsCT06.assigneeUserId,
              name: rafpendingActionDetailsCT06.assigneeName,
            },
            // assigneeRole: userAssigned.roles,
            assigneeRole: rafpendingActionDetailsCT06.assigneeRole,
          },
        ],
        logging: {
          comments: '',
          //updated: res.data.attachmentUrl,
          uploadRef: '',
        },
      }

      if (completeTaskUploadedFile) {
        const formdata1 = new FormData()
        // formdata1.append('fileIn', referenceDocData.data)
        formdata1.append('fileIn', completeTaskUploadedFile)
        // formdata1.append('fileIn', rf.data)
        postFileAttachmentRangeResetAPI &&
          postFileAttachmentRangeResetAPI(formdata1, eventDetails[0].id)
            .then((res: any) => {
              console.log('1')
              console.log('attachment', res.data.attachmentUrl)
              completePayload.logging.uploadRef = res.data.attachmentUrl
            })
            .catch((err: any) => {
              //setFileAttachmentConfirmed(true)
              console.log('2')
              toast.current.show([
                {
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'File Upload Error',
                  life: life,
                  className: 'login-toast',
                },
              ])
            })
      }

      putCamundaMileStoneUpdate(
        rafpendingActionDetailsCT06.eventId,
        completePayload
      )
        .then((res: any) => {
          console.log(res.data)
          toast.current.show([
            {
              severity: 'success',
              summary: 'Success!',
              detail: 'Task completed successfully',
              life: life,
              className: 'login-toast',
            },
          ])
        })
        .catch((err: any) => {
          console.log(err.response)
          toast.current.show([
            {
              severity: 'error',
              summary: 'Error!',
              detail: 'Service Error',
              life: life,
              className: 'login-toast',
            },
          ])
        })
    }
  }

  const completeTaskCT36Dialog = (
    <Dialog
      open={completeTaskDialogOpen}
      onClose={handleCompleteTaskDialogClose}
    >
      <Box
        sx={{
          height: 450,
          // width: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        // className={classes.classDialog}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DialogHeader
            title="Confirm ‘Review Store Wastage’"
            onClose={handleCompleteTaskDialogClose}
          />
          <Box
            sx={{
              alignItems: 'flex-start',
              marginTop: '30px',
            }}
          >
            <strong>Comments</strong> <br />
            <InputTextarea
              maxLength={500}
              value={inputTextareaValue}
              onChange={(e) => setInputTextareaValue(e.target.value)}
              rows={3}
              cols={43}
              autoResize
            />
            <br />
            <strong>Upload Reference Document</strong>
            <input
              type="text"
              value={
                completeTaskUploadedFile ? completeTaskUploadedFile.name : ''
              }
              onClick={() =>
                document.getElementById('completeTaskFile')!.click()
              }
              className={classes.uploadTextfield}
              placeholder="Upload relevant reference document"
              readOnly
            />
            <Input
              type="file"
              id="completeTaskFile"
              // accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e: any) =>
                setCompleteTaskUploadedFile(e.target.files[0])
              }
              required
            />
            <button
              type="button"
              onClick={() =>
                document.getElementById('completeTaskFile')!.click()
              }
              className={classes.uploadButton}
            >
              Browse...
            </button>
            {/* {wrongExtn && (
              <span className={classes.errorMessageColor}>
                {wrongExtnError}
              </span>
            )} */}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button
            // type="submit"
            variant="contained"
            color="primary"
            // className={classes.buttons}
            // onClick={handleClassConfirm}
            onClick={completeTaskWithRefDoc}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Dialog>
  )

  const completeTaskFormData = () => {
    const completePayload = {
      reviewDecision: 'CompleteTask',
      requester: {
        persona: rafpendingActionDetailsCT06.assigneeRole,
        details: {
          emailId: userDetail && userDetail.userdetails[0].user.emailId,
          userId: userDetail && userDetail.userdetails[0].user.userId,
          name:
            userDetail &&
            userDetail.userdetails[0].user.middleName &&
            userDetail.userdetails[0].user.middleName !== ''
              ? `${userDetail.userdetails[0].user.firstName} ${userDetail.userdetails[0].user.middleName} ${userDetail.userdetails[0].user.lastName}`
              : `${userDetail.userdetails[0].user.firstName} ${userDetail.userdetails[0].user.lastName}`,
        },
        roles:
          userDetail &&
          userDetail.userdetails[0].roles.map((role: any) => {
            return {
              // roleId: role.roleId,
              roleId: role.roleName,
            }
          }),
        usergroups:
          userDetail &&
          userDetail.userdetails[0].usergroups.map((group: any) => {
            return {
              groupId: group.groupId,
              status: group.status,
            }
          }),
      },
      eventStatus: 'Published',
      eventId: rafpendingActionDetailsCT06.eventId,
      milestones: [
        {
          action: '',
          status: rafpendingActionDetailsCT06.status,
          visibility: rafpendingActionDetailsCT06.visibility,
          activeTaskId: rafpendingActionDetailsCT06.activeTaskId,
          milestoneTaskId: rafpendingActionDetailsCT06.milestoneTaskId,
          taskName: rafpendingActionDetailsCT06.taskName,
          taskDescription: rafpendingActionDetailsCT06.taskDescription,
          tradingGroup: rafpendingActionDetailsCT06.tradingGroup,
          weeksPrior: rafpendingActionDetailsCT06.weeksPrior,
          dueDate: rafpendingActionDetailsCT06.dueDate,
          notifyDate: rafpendingActionDetailsCT06.notifyDate,
          slaDate: rafpendingActionDetailsCT06.slaDate,
          healthcheckDate: rafpendingActionDetailsCT06.healthcheckDate,
          assigneeDetails: {
            emailId: rafpendingActionDetailsCT06.assigneeEmailId,
            userId: rafpendingActionDetailsCT06.assigneeUserId,
            name: rafpendingActionDetailsCT06.assigneeName,
          },
          // assigneeRole: userAssigned.roles,
          assigneeRole: rafpendingActionDetailsCT06.assigneeRole,
        },
      ],
      logging: {
        comments: '',
        //updated: res.data.attachmentUrl,
        updated: '',
      },
    }
    return completePayload
  }

  const handleCompleteTask = () => {
    const finalRangeLength = [...xlslPlanogramimportedData]
    if (finalRangeLength.length > 0 || productListCompleteAlertError) {
      setErrorAlertForPlano(true)
      return
    } else {
      setErrorAlertForPlano(false)
    }
    const checkPlaceHolderMin: any = importedData.filter((val: any) => {
      return val.actionType === placeholderMin
    })

    if (
      checkPlaceHolderMin.length > 0 &&
      rafpendingActionDetailsCT06.taskName === 'CT19'
    ) {
      setCompleteTaskPlaceholderError(
        '**There are some items with placeholder MIN, please replace it with ' +
          newProductMin
      )
      return console.log('Placeholder Exist', 'Placeholder Exist')
    } else {
      setCompleteTaskPlaceholderError('')
    }
    // setCompleteTaskPlaceholderError('Complete Task')
    // return console.log('handleCompleteTask', 'handleCompleteTask')
    if (rafpendingActionDetailsCT06) {
      setToastRemove('complete')
      // const completePayload = {
      //   reviewDecision: 'CompleteTask',
      //   requester: {
      //     persona: rafpendingActionDetailsCT06.assigneeRole,
      //     details: {
      //       emailId: userDetail && userDetail.userdetails[0].user.emailId,
      //       userId: userDetail && userDetail.userdetails[0].user.userId,
      //       name:
      //         userDetail &&
      //         userDetail.userdetails[0].user.middleName &&
      //         userDetail.userdetails[0].user.middleName !== ''
      //           ? `${userDetail.userdetails[0].user.firstName} ${userDetail.userdetails[0].user.middleName} ${userDetail.userdetails[0].user.lastName}`
      //           : `${userDetail.userdetails[0].user.firstName} ${userDetail.userdetails[0].user.lastName}`,
      //     },
      //     roles:
      //       userDetail &&
      //       userDetail.userdetails[0].roles.map((role: any) => {
      //         return {
      //           // roleId: role.roleId,
      //           roleId: role.roleName,
      //         }
      //       }),
      //     usergroups:
      //       userDetail &&
      //       userDetail.userdetails[0].usergroups.map((group: any) => {
      //         return {
      //           groupId: group.groupId,
      //           status: group.status,
      //         }
      //       }),
      //   },
      //   eventStatus: 'Published',
      //   eventId: rafpendingActionDetailsCT06.eventId,
      //   milestones: [
      //     {
      //       action: '',
      //       status: rafpendingActionDetailsCT06.status,
      //       visibility: rafpendingActionDetailsCT06.visibility,
      //       activeTaskId: rafpendingActionDetailsCT06.activeTaskId,
      //       milestoneTaskId: rafpendingActionDetailsCT06.milestoneTaskId,
      //       taskName: rafpendingActionDetailsCT06.taskName,
      //       taskDescription: rafpendingActionDetailsCT06.taskDescription,
      //       tradingGroup: rafpendingActionDetailsCT06.tradingGroup,
      //       weeksPrior: rafpendingActionDetailsCT06.weeksPrior,
      //       dueDate: rafpendingActionDetailsCT06.dueDate,
      //       notifyDate: rafpendingActionDetailsCT06.notifyDate,
      //       slaDate: rafpendingActionDetailsCT06.slaDate,
      //       healthcheckDate: rafpendingActionDetailsCT06.healthcheckDate,
      //       assigneeDetails: {
      //         emailId: rafpendingActionDetailsCT06.assigneeEmailId,
      //         userId: rafpendingActionDetailsCT06.assigneeUserId,
      //         name: rafpendingActionDetailsCT06.assigneeName,
      //       },
      //       // assigneeRole: userAssigned.roles,
      //       assigneeRole: rafpendingActionDetailsCT06.assigneeRole,
      //     },
      //   ],
      //   logging: {
      //     comments: '',
      //     //updated: res.data.attachmentUrl,
      //     updated: '',
      //   },
      // }
      const completePayload = completeTaskFormData()
      putCamundaMileStoneUpdate(
        rafpendingActionDetailsCT06.eventId,
        completePayload
      )
        .then((res: any) => {
          setCheckComplete(false)
          console.log(res.data)
          toast.current.show([
            {
              severity: 'success',
              summary: 'Success!',
              detail: 'Task completed successfully',
              life: life,
              className: 'login-toast',
            },
          ])
        })
        .catch((err: any) => {
          setCheckComplete(false)
          console.log(err.response)
          toast.current.show([
            {
              severity: 'error',
              summary: 'Error!',
              detail: 'Service Error',
              life: life,
              className: 'login-toast',
            },
          ])
        })
    }
  }

  const handleComplteTaskCT07WithStocks = () => {
    setStocksConfirm(false)
    setToastRemove('complete')
    const completePayload = completeTaskFormData()
    putCamundaMileStoneUpdate(
      rafpendingActionDetailsCT06.eventId,
      completePayload
    )
      .then((res: any) => {
        setCheckComplete(false)
        console.log(res.data)
        const formdata = importedData &&
          eventDetails && {
            items: importedData.map((item: any) => {
              // let newNumberOfRangeStores =
              //   item.numberOfRangeStores !== 'NA'
              //     ? item.actionType === productDistributionDecreaseMin
              //       ? storeCodeLength - parseInt(item.numberOfRangeStores)
              //       : item.actionType === productDistributionIncreaseMin
              //       ? storeCodeLength + parseInt(item.numberOfRangeStores)
              //       : item.numberOfRangeStores
              //     : null
              // console.log('new storecodes', newNumberOfRangeStores)
              return {
                itemNumber: item.min !== 'NA' ? item.min : null,
                description: item.description,
                department: eventDetails[0].department
                  ? eventDetails[0].department
                  : null,
                departmentId: eventDetails[0].departmentId
                  ? eventDetails[0].departmentId
                  : null,
                category: eventDetails[0].category
                  ? eventDetails[0].category
                  : null,
                categoryId: eventDetails[0].categoryId
                  ? eventDetails[0].categoryId
                  : null,
                status: eventDetails[0].status ? eventDetails[0].status : null,
                targetDate: eventDetails[0].targetDate
                  ? eventDetails[0].targetDate
                  : null,
                type: item.actionType,
                autoclear: item.autoclear ? item.autoclear : null,
                depoClearWeek: item.clearDepotBy,
                gscopDate: item.finalStopOrderDate
                  ? `${item.finalStopOrderDate} ${'00:00:00.00'}`
                  : '',
                stopPODate: item.systemSuggestedStopOrderDate
                  ? `${item.systemSuggestedStopOrderDate} ${'00:00:00.00'}`
                  : null,
                supplierCommitment: item.supplierCommitment,
                wastage:
                  // item.includeInStoreWastage !== 'NA'
                  //   ? item.includeInStoreWastage
                  //   : '',
                  eventDetails[0].wastageRange ? 'Y' : '',
                wastageRange: eventDetails[0].wastageRange
                  ? eventDetails[0].wastageRange
                  : null,
                eventLineStatus: item.lineStatus,
                man: item.man !== 'NA' ? item.man : null,
                ingredientMin:
                  item.ingredientMin !== 'NA' ? item.ingredientMin : null,
                recipeMin: item.noOfRecipeMin ? item.noOfRecipeMin : null,
                pin: item.pin !== 'NA' ? item.pin : null,
                replaceMinDescription:
                  item.replaceMinDescription !== 'NA'
                    ? item.replaceMinDescription
                    : '',
                existingSupplier: item.existingSupplier,
                existingSupplierSite: item.existingSupplierSite,
                rangedStoresCurrent: item.currentnoofrangedstores,
                rangedStoresNew: item.numberOfRangeStores,
                currentVsNewStores: item.currentVersusNewStores,
                rangedStoresPercent: item.storesRangedCurrentVsProposed,
                shelfFillCurrent:
                  item.currentShelfFill === 0 ? null : item.currentShelfFill,
                shelfFillNew:
                  item.newShelfFill === 0 ? null : item.newShelfFill,
                currentVsNewShelfFill:
                  item.currentshelffill_vs_newfill === 0
                    ? null
                    : item.currentshelffill_vs_newfill,
                shelfFillPercent:
                  item.currentshelffill_vs_newfill_percant === 0
                    ? null
                    : item.currentshelffill_vs_newfill_percant,
                unitCost: item.unitcost,
                caseCost: item.casecost,
                caseSize: item.packquantity ? item.packquantity : null,
                itemLocal: item.local,
                legacyCode: item.legacyItemNumbers
                  ? item.legacyItemNumbers
                  : '',
                onlineCfc: item.onlineCFC,
                onlineStorePick: item.onlineStorePick,
                wholesale: item.wholesale,
                ownBrand: item.ownBrand,
                clearancePricing:
                  item.includeInClearancePricing &&
                  item.includeInClearancePricing
                    ? item.includeInClearancePricing
                    : eventDetails[0].clearancePriceCheck
                    ? eventDetails[0].clearancePriceCheck
                    : '',
                storeStockUnit: item.storeStockUnit,
                depotStockUnit: item.depotStockUnit,
                frwdForecastToLaunch: item.forward_forecast_to_launch,
                excessStock: item.excessstock,
                weeksCover: item.weeksCoveronTotalStockonHandtoResetDate,
                forecastWeekCover: item.forcastedWeeksCovertoResetDate,
                suppCommFixedBuysSeasonal: item.suppCommFixedBuysSeasonal
                  ? item.suppCommFixedBuysSeasonal
                  : null,
                depotShelfLife: item.depotShelfLifeMinimum,
                productShelfLife: item.productShelfLifeInstore,
                mfgShelfLife: item.shelfLifeatManufacture,
                safewayBrandedEq: item.safewaybrandedequivalent,
                comments: item.comments ? item.comments : null,
                newSupplier: item.newSupplier ? item.newSupplier : null,
                newSupplierSite: item.newSupplierSite
                  ? item.newSupplierSite
                  : null,
                replaceMin: item.replaceMin !== 'NA' ? item.replaceMin : null,
                effectiveFromDate: item.effectiveDateFrom
                  ? `${item.effectiveDateFrom} ${'00:00:00.00'}`
                  : '',
                // : eventDetails[0].targetDate,
                effectiveToDate: item.effectiveDateTo
                  ? `${item.effectiveDateTo} ${'00:00:00.00'}`
                  : '',
                // derangedLocations: item.storeNumbersForspecificStoreRange
                //   ? item.storeNumbersForspecificStoreRange
                //   : null,
                derangedLocations: item.storeCode ? item.storeCode : null,
                perStorePerWeek: item.perStorepPerWeek
                  ? item.perStorepPerWeek
                  : '',
                retailDepotClear: item.depotClearbyReservedQtyRetail
                  ? item.depotClearbyReservedQtyRetail
                  : '',
                wholesaleDepotClear: item.depotClearbyReservedQtyWholesale
                  ? item.depotClearbyReservedQtyWholesale
                  : '',
                onlineDepotClear: item.depotClearbyReservedQtyOnline
                  ? item.depotClearbyReservedQtyOnline
                  : '',
                // totalDepotClear: item.depotClearbyReservedQtyTotal
                //   ? item.depotClearbyReservedQtyTotal
                //   : '',
                totalDepotClear: null,
              }
            }),
          }
        console.log(formdata)
        patchRangeResetItems &&
          patchRangeResetItems(rafpendingActionDetailsCT06.eventId, formdata)
            .then((res: any) => {
              console.log(res.data)
              toast.current.show([
                {
                  severity: 'success',
                  summary: 'Success!',
                  detail: 'Task Completed succesfully with stock count request',
                  life: life,
                  className: 'login-toast',
                },
              ])
            })
            .catch((err: any) => {
              console.log(err)
              toast.current.show([
                {
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'Stock count service error',
                  life: life,
                  className: 'login-toast',
                },
              ])
            })
        setSelectedProductListItems([])
        setEditClick(false)
        setEditButtonSupply(true)
      })
      .catch((err: any) => {
        setCheckComplete(false)
        console.log(err.response)
        toast.current.show([
          {
            severity: 'error',
            summary: 'Error!',
            detail: 'Service Error',
            life: life,
            className: 'login-toast',
          },
        ])
      })
  }

  const handleComplteTaskCT07WithOutStocks = () => {
    setStocksConfirm(false)
    setToastRemove('complete')
    const completePayload = completeTaskFormData()
    putCamundaMileStoneUpdate(
      rafpendingActionDetailsCT06.eventId,
      completePayload
    )
      .then((res: any) => {
        setCheckComplete(false)
        console.log(res.data)
        const formdata = importedData &&
          eventDetails && {
            items: importedData.map((item: any) => {
              let newNumberOfRangeStores =
                item.numberOfRangeStores !== 'NA'
                  ? item.actionType === productDistributionDecreaseMin
                    ? storeCodeLength - parseInt(item.numberOfRangeStores)
                    : item.actionType === productDistributionIncreaseMin
                    ? storeCodeLength + parseInt(item.numberOfRangeStores)
                    : item.numberOfRangeStores
                  : null
              console.log('new storecodes', newNumberOfRangeStores)
              return {
                itemNumber: item.min !== 'NA' ? item.min : null,
                description: item.description,
                department: eventDetails[0].department
                  ? eventDetails[0].department
                  : null,
                departmentId: eventDetails[0].departmentId
                  ? eventDetails[0].departmentId
                  : null,
                category: eventDetails[0].category
                  ? eventDetails[0].category
                  : null,
                categoryId: eventDetails[0].categoryId
                  ? eventDetails[0].categoryId
                  : null,
                status: eventDetails[0].status ? eventDetails[0].status : null,
                targetDate: eventDetails[0].targetDate
                  ? eventDetails[0].targetDate
                  : null,
                type: item.actionType,
                autoclear: item.autoclear ? item.autoclear : null,
                depoClearWeek: item.clearDepotBy,
                gscopDate: item.finalStopOrderDate
                  ? `${item.finalStopOrderDate} ${'00:00:00.00'}`
                  : '',
                stopPODate: item.systemSuggestedStopOrderDate
                  ? `${item.systemSuggestedStopOrderDate} ${'00:00:00.00'}`
                  : null,
                supplierCommitment: item.supplierCommitment,
                wastage:
                  // item.includeInStoreWastage !== 'NA'
                  //   ? item.includeInStoreWastage
                  //   : '',
                  eventDetails[0].wastageRange ? 'Y' : '',
                wastageRange: eventDetails[0].wastageRange
                  ? eventDetails[0].wastageRange
                  : null,
                eventLineStatus: 'Draft',
                man: item.man !== 'NA' ? item.man : null,
                ingredientMin:
                  item.ingredientMin !== 'NA' ? item.ingredientMin : null,
                recipeMin: item.noOfRecipeMin ? item.noOfRecipeMin : null,
                pin: item.pin !== 'NA' ? item.pin : null,
                replaceMinDescription:
                  item.replaceMinDescription !== 'NA'
                    ? item.replaceMinDescription
                    : '',
                existingSupplier: item.existingSupplier,
                existingSupplierSite: item.existingSupplierSite,
                rangedStoresCurrent: item.currentnoofrangedstores,
                rangedStoresNew: newNumberOfRangeStores,
                currentVsNewStores: item.currentVersusNewStores,
                rangedStoresPercent: item.storesRangedCurrentVsProposed,
                shelfFillCurrent:
                  item.currentShelfFill === 0 ? null : item.currentShelfFill,
                shelfFillNew:
                  item.newShelfFill === 0 ? null : item.newShelfFill,
                currentVsNewShelfFill:
                  item.currentshelffill_vs_newfill === 0
                    ? null
                    : item.currentshelffill_vs_newfill,
                shelfFillPercent:
                  item.currentshelffill_vs_newfill_percant === 0
                    ? null
                    : item.currentshelffill_vs_newfill_percant,
                unitCost: item.unitcost,
                caseCost: item.casecost,
                caseSize: item.packquantity ? item.packquantity : null,
                itemLocal: item.local,
                legacyCode: item.legacyItemNumbers
                  ? item.legacyItemNumbers
                  : '',
                onlineCfc: item.onlineCFC,
                onlineStorePick: item.onlineStorePick,
                wholesale: item.wholesale,
                ownBrand: item.ownBrand,
                clearancePricing:
                  item.includeInClearancePricing &&
                  item.includeInClearancePricing
                    ? item.includeInClearancePricing
                    : eventDetails[0].clearancePriceCheck
                    ? eventDetails[0].clearancePriceCheck
                    : '',
                storeStockUnit: item.storeStockUnit,
                depotStockUnit: item.depotStockUnit,
                frwdForecastToLaunch: item.forward_forecast_to_launch,
                excessStock: item.excessstock,
                weeksCover: item.weeksCoveronTotalStockonHandtoResetDate,
                forecastWeekCover: item.forcastedWeeksCovertoResetDate,
                suppCommFixedBuysSeasonal: item.suppCommFixedBuysSeasonal
                  ? item.suppCommFixedBuysSeasonal
                  : null,
                depotShelfLife: item.depotShelfLifeMinimum,
                productShelfLife: item.productShelfLifeInstore,
                mfgShelfLife: item.shelfLifeatManufacture,
                safewayBrandedEq: item.safewaybrandedequivalent,
                comments: item.comments ? item.comments : null,
                newSupplier: item.newSupplier ? item.newSupplier : null,
                newSupplierSite: item.newSupplierSite
                  ? item.newSupplierSite
                  : null,
                replaceMin: item.replaceMin !== 'NA' ? item.replaceMin : null,
                effectiveFromDate: item.effectiveDateFrom
                  ? `${item.effectiveDateFrom} ${'00:00:00.00'}`
                  : '',
                // : eventDetails[0].targetDate,
                effectiveToDate: item.effectiveDateTo
                  ? `${item.effectiveDateTo} ${'00:00:00.00'}`
                  : '',
                // derangedLocations: item.storeNumbersForspecificStoreRange
                //   ? item.storeNumbersForspecificStoreRange
                //   : null,
                derangedLocations: item.storeCode ? item.storeCode : null,
                perStorePerWeek: item.perStorepPerWeek
                  ? item.perStorepPerWeek
                  : '',
                retailDepotClear: item.depotClearbyReservedQtyRetail
                  ? item.depotClearbyReservedQtyRetail
                  : '',
                wholesaleDepotClear: item.depotClearbyReservedQtyWholesale
                  ? item.depotClearbyReservedQtyWholesale
                  : '',
                onlineDepotClear: item.depotClearbyReservedQtyOnline
                  ? item.depotClearbyReservedQtyOnline
                  : '',
                // totalDepotClear: item.depotClearbyReservedQtyTotal
                //   ? item.depotClearbyReservedQtyTotal
                //   : '',
                totalDepotClear: null,
              }
            }),
          }
        console.log(formdata)
        patchRangeResetItems &&
          patchRangeResetItems(rafpendingActionDetailsCT06.eventId, formdata)
            .then((res: any) => {
              console.log(res.data)
              toast.current.show([
                {
                  severity: 'success',
                  summary: 'Success!',
                  detail:
                    'Task Completed succesfully without stock count request',
                  life: life,
                  className: 'login-toast',
                },
              ])
            })
            .catch((err: any) => {
              console.log(err)
              toast.current.show([
                {
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'Stock count service error',
                  life: life,
                  className: 'login-toast',
                },
              ])
            })
        setSelectedProductListItems([])
        setEditClick(false)
        setEditButtonSupply(true)
      })
      .catch((err: any) => {
        setCheckComplete(false)
        console.log(err.response)
        toast.current.show([
          {
            severity: 'error',
            summary: 'Error!',
            detail: 'Service Error',
            life: life,
            className: 'login-toast',
          },
        ])
      })
  }

  const handleRejectTask = () => {
    if (rafpendingActionDetailsCT06) {
      setToastRemove('reject')
      const completePayload = {
        reviewDecision: 'CompleteTask',
        requester: {
          persona: rafpendingActionDetailsCT06.assigneeRole,
          details: {
            emailId: userDetail && userDetail.userdetails[0].user.emailId,
            userId: userDetail && userDetail.userdetails[0].user.userId,
            name:
              userDetail &&
              userDetail.userdetails[0].user.middleName &&
              userDetail.userdetails[0].user.middleName !== ''
                ? `${userDetail.userdetails[0].user.firstName} ${userDetail.userdetails[0].user.middleName} ${userDetail.userdetails[0].user.lastName}`
                : `${userDetail.userdetails[0].user.firstName} ${userDetail.userdetails[0].user.lastName}`,
          },
          roles:
            userDetail &&
            userDetail.userdetails[0].roles.map((role: any) => {
              return {
                // roleId: role.roleId,
                roleId: role.roleName,
              }
            }),
          usergroups:
            userDetail &&
            userDetail.userdetails[0].usergroups.map((group: any) => {
              return {
                groupId: group.groupId,
                status: group.status,
              }
            }),
        },
        eventStatus: 'Published',
        eventId: rafpendingActionDetailsCT06.eventId,
        milestones: [
          {
            action: 'Rejected',
            status: rafpendingActionDetailsCT06.status,
            visibility: rafpendingActionDetailsCT06.visibility,
            activeTaskId: rafpendingActionDetailsCT06.activeTaskId,
            milestoneTaskId: rafpendingActionDetailsCT06.milestoneTaskId,
            taskName: rafpendingActionDetailsCT06.taskName,
            taskDescription: rafpendingActionDetailsCT06.taskDescription,
            tradingGroup: rafpendingActionDetailsCT06.tradingGroup,
            weeksPrior: rafpendingActionDetailsCT06.weeksPrior,
            dueDate: rafpendingActionDetailsCT06.dueDate,
            notifyDate: rafpendingActionDetailsCT06.notifyDate,
            slaDate: rafpendingActionDetailsCT06.slaDate,
            healthcheckDate: rafpendingActionDetailsCT06.healthcheckDate,
            assigneeDetails: {
              emailId: rafpendingActionDetailsCT06.assigneeEmailId,
              userId: rafpendingActionDetailsCT06.assigneeUserId,
              name: rafpendingActionDetailsCT06.assigneeName,
            },
            // assigneeRole: userAssigned.roles,
            assigneeRole: rafpendingActionDetailsCT06.assigneeRole,
          },
        ],
        logging: {
          comments: '',
          //updated: res.data.attachmentUrl,
          updated: '',
        },
      }
      putCamundaMileStoneUpdate(
        rafpendingActionDetailsCT06.eventId,
        completePayload
      )
        .then((res: any) => {
          setCheckComplete(false)
          console.log(res.data)
          toast.current.show([
            {
              severity: 'success',
              summary: 'Success!',
              detail: 'Task Rejected successfully',
              life: life,
              className: 'login-toast',
            },
          ])
        })
        .catch((err: any) => {
          setCheckComplete(false)
          console.log(err.response)
          toast.current.show([
            {
              severity: 'error',
              summary: 'Error!',
              detail: 'Service Error',
              life: life,
              className: 'login-toast',
            },
          ])
        })
    }
  }

  useEffect(() => {
    if (importedData) {
      setCheckComplete(true)
    }
  }, [importedData])
  useEffect(() => {
    console.log(checkComplete)
  }, [checkComplete])

  const confirmStocksDialog = (
    <ConfirmBox1
      cancelOpen={stocksConfirm}
      //handleCancel={() => setStocksConfirm(false)}
      handleCancel={handleComplteTaskCT07WithOutStocks}
      handleProceed={handleComplteTaskCT07WithStocks}
      label1="Confirm 'Stock Count Request'"
      label2="'Stock Count Request' for delist MIN will be sent to the store(s).Are you sure to mark this task as 'Complete'?"
    />
  )
  // const confirmStocksDialog = (
  //   <ConfirmBox
  //     cancelOpen={stocksConfirm}
  //     handleCancel={() => setStocksConfirm(false)}
  //     // handleCancel={handleCompleteTask}
  //     handleProceed={handleCompleteTask}
  //     label1="Confirm 'Stock Count Request'"
  //     label2="'Stock Count Request' for delist MIN will be sent to the store(s).Are you sure to mark this task as 'Complete'?"
  //   />
  // )

  const confirmRafLockedDialog = (
    <ConfirmBox
      cancelOpen={rafLockedConfirm}
      handleCancel={() => setRafLockedConfirm(false)}
      // handleCancel={handleCompleteTask}
      handleProceed={handleCompleteTask}
      label1="Confirm 'Complete Task'"
      label2="'RCM App' will be 'LOCKED' post this task.Are you sure to mark this task as 'Complete'?"
    />
  )

  const confirmCompleteDialog =
    rafpendingActionDetailsCT06 &&
    rafpendingActionDetailsCT06.taskName &&
    (rafpendingActionDetailsCT06.taskName === 'CT07' ? (
      checkComplete ? (
        <ConfirmBox
          cancelOpen={completeConfirm}
          handleCancel={() => setCompleteConfirm(false)}
          // handleProceed={() => handlePublishEvent('Confirmed')}
          handleProceed={() => setStocksConfirm(true)}
          label1="Please save the data before completing"
          label2="Are you sure you want to complete the task?"
        />
      ) : (
        <ConfirmBox
          cancelOpen={completeConfirm}
          handleCancel={() => setCompleteConfirm(false)}
          // handleProceed={() => handlePublishEvent('Confirmed')}
          handleProceed={() => setStocksConfirm(true)}
          label1="Confirm 'Complete'"
          label2="Are you sure you want to complete the task?"
        />
      )
    ) : rafpendingActionDetailsCT06 &&
      rafpendingActionDetailsCT06.taskName &&
      rafpendingActionDetailsCT06.taskName === 'CT19' ? (
      checkComplete ? (
        <ConfirmBox
          cancelOpen={completeConfirm}
          handleCancel={() => setCompleteConfirm(false)}
          // handleProceed={() => handlePublishEvent('Confirmed')}
          handleProceed={() => setRafLockedConfirm(true)}
          label1="Please save the data before completing"
          label2="Are you sure you want to complete the task?"
        />
      ) : (
        <ConfirmBox
          cancelOpen={completeConfirm}
          handleCancel={() => setCompleteConfirm(false)}
          // handleProceed={() => handlePublishEvent('Confirmed')}
          handleProceed={() => setRafLockedConfirm(true)}
          label1="Confirm 'Complete'"
          label2="Are you sure you want to complete the task?"
        />
      )
    ) : checkComplete ? (
      <ConfirmBox
        cancelOpen={completeConfirm}
        handleCancel={() => setCompleteConfirm(false)}
        // handleProceed={() => handlePublishEvent('Confirmed')}
        handleProceed={handleCompleteTask}
        label1="Please save the data before completing"
        label2="Are you sure you want to complete the task?"
      />
    ) : (
      <ConfirmBox
        cancelOpen={completeConfirm}
        handleCancel={() => setCompleteConfirm(false)}
        // handleProceed={() => handlePublishEvent('Confirmed')}
        handleProceed={handleCompleteTask}
        label1="Confirm 'Complete'"
        label2="Are you sure you want to complete the task?"
      />
    ))
  const confirmRejectDialog = (
    <ConfirmBox
      cancelOpen={rejectConfirm}
      handleCancel={() => setRejectConfirm(false)}
      // handleProceed={() => handlePublishEvent('Confirmed')}
      handleProceed={handleRejectTask}
      label1="Confirm 'Reject'"
      label2="Are you sure you want to reject the task?"
    />
  )
  const handleToaster = () => {
    if (toastRemove === 'complete' || toastRemove === 'reject') {
      // history.push(`${DEFAULT}${DASHBOARD_RANGE_PENDINGACTION}`)
      history.goBack()
    }
  }

  useEffect(() => {
    console.log('actionType', actionType)
  }, [actionType])

  return (
    <>
      <Toast
        ref={toast}
        position="bottom-left"
        // onRemove={() => {
        //   history.push(`${DEFAULT}${RANGEAMEND_MANAGE}`)
        // }}
        onRemove={handleToaster}
      />
      <LoadingComponent showLoader={isProgressLoader} />
      <Grid container spacing={2} style={{ padding: '20px' }}>
        <Grid
          container
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          spacing={2}
          style={{ paddingBottom: '20px' }}
        >
          <Grid item xl={9} lg={9} md={9} sm={12} xs={12}>
            <Typography variant="h6" color="primary">
              {/* Pending Action -{' '} */}
              {/* <b>Delists added to the Range Change Management App</b> */}
              <b>{headerName()}</b>
            </Typography>
          </Grid>

          <Grid item xl={2} lg={2} md={2} sm={3} xs={5}>
            <button
              // className={classes.backButton}
              className="backButton"
            >
              {/* <Typography variant="subtitle1" color="primary"> */}
              View Log
              {/* </Typography> */}
            </button>
          </Grid>

          <Grid item xl={1} lg={1} md={1} sm={3} xs={3}>
            <button
              // className={classes.backButton}
              className="backButton"
              onClick={goBack}
              type="button"
            >
              {/* <Typography variant="subtitle1" color="primary"> */}
              <svg
                className="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 34 34"
                aria-hidden="true"
              >
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
              </svg>
              Back
              {/* </Typography> */}
            </button>
          </Grid>
        </Grid>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <DataTable
            value={eventDetails}
            scrollable
            showGridlines
            style={{
              height: '100%',
            }}
            className="p-datatable-sm"
          >
            {delistAddedToRangeCols.map((col: any, index: any) => {
              return (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  style={{
                    width: col.width,
                    fontSize: '0.9rem',
                    padding: '0.5rem',
                  }}
                  headerStyle={{
                    backgroundColor: teal[900],
                    color: 'white',
                    width: col.width,
                    fontSize: '0.9rem',
                    padding: '0.5rem',
                  }}
                  body={
                    (col.field === 'targetDate' &&
                      convertedTargetDateTemplate) ||
                    (col.field === 'appDueDate' && convertedAppDueDateTemplate)
                  }
                />
              )
            })}
          </DataTable>
        </Grid>
        {hideCT36() && (
          <Grid
            item
            container
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            spacing={2}
            style={{
              alignItems: 'center',
            }}
          >
            <Grid
              item
              container
              md={6}
              sm={12}
              xs={12}
              spacing={2}
              style={{ textAlign: 'center' }}
            >
              <Grid item xs={10} sm={5} style={{ textAlign: 'left' }}>
                <Typography color="primary">
                  <AutocompleteSelect
                    // isMulti={true}
                    value={actionType}
                    options={actionTypeOptions} //multipesri
                    onChange={handleActionType}
                    placeholder="--- Action Type ---"
                  />
                  {/* {storeCodePopup()} */}
                  {/* {actionTypeSelectRender()} */}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2}>
                <Tooltip
                  title={
                    actionType ? (
                      ''
                    ) : (
                      <Typography variant="caption">
                        {"Please select the 'Action Type'."}
                      </Typography>
                    )
                  }
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleActionTypeDialogOpen}
                    disabled={
                      actionType && actionType.value === 'Multiple Selection'
                        ? true
                        : false
                    }
                  >
                    Add
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item xl={1} lg={1} md={1} sm={1} xs={12}>
                OR
              </Grid>
              <Grid item sm={3} xs={12}>
                <Tooltip
                  title={
                    actionType ? (
                      ''
                    ) : (
                      <Typography variant="caption">
                        {"Please select the 'Action Type'."}
                      </Typography>
                    )
                  }
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUploadDialogOpen('uploadFile')}
                  >
                    Upload File
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid
              item
              container
              md={6}
              sm={12}
              xs={12}
              spacing={1}
              style={{ textAlign: 'center' }}
            >
              <Grid item sm={3} xs={12}>
                <Button
                  // className="backButton"
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handlePlaceholderDialogOpen}
                  disabled={showErrorbelowCT26()}
                >
                  <Typography variant="body2">
                    Add Placeholder MIN/PIN
                  </Typography>
                </Button>
              </Grid>
              <Grid item sm={3} xs={12}>
                <Tooltip
                  title={
                    <Typography variant="caption">
                      {`Replacement is not applicable for`}
                      <br />
                      {`New Product (MIN) & New Product (MIN) Placeholder`}
                    </Typography>
                  }
                >
                  <Button
                    // className="backButton"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleReplacemantAssociationDialogOpen}
                    disabled={
                      // taskId === 'CT06'
                      //   ? true
                      //   :
                      selectedProductListItems.length > 0
                        ? replacementCheck
                        : true
                    }
                  >
                    <Typography variant="body2">
                      Replacement Association
                    </Typography>
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item sm={3} xs={12}>
                <Button variant="contained" color="primary">
                  <Typography variant="body2">Issue Delist Letter</Typography>
                </Button>
              </Grid>
              <Grid item sm={3} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUploadDialogOpen('finalRangeUploadFile')}
                  disabled={!showErrorAboveCT26()}
                >
                  <Typography variant="body2">
                    Upload Final Range Distribution
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* <Grid item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                >

                    <FormControl>
                        <RadioGroup
                            name="delistAddedToRange"
                            value={productType}
                            onChange={handleProductTypeChange}
                            style={{ display: "inline" }}>

                            <FormControlLabel value="existingProducts" control={radio} label="Existing Products" />
                            <FormControlLabel value="newProducts" control={radio} label="New Products" />
                            <FormControlLabel value="placeholderProducts" control={radio} label="Placeholder Products" />
                        </RadioGroup>
                    </FormControl>

                </Grid>
                <Grid item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    {
                        productType &&
                            productType === "existingProducts" ?
                            existingProducts
                            :
                            productType === "newProducts" ?
                                newProducts
                                :
                                productType === "placeholderProducts" &&
                                placeholderProducts
                    }
                </Grid> */}

        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          {importedData && productListTable}
        </Grid>

        {importedData && (
          <Grid item container xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}></Grid>
            <Grid
              item
              container
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              style={{ textAlign: 'center' }}
              spacing={2}
            >
              {hideCT36() && (
                <Grid item xl={2} lg={2} md={2} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProductListEdit}
                    disabled={editButtonSupply}
                    // disabled={selectedProductListItems.length > 0 ? false : true}
                  >
                    Edit
                  </Button>
                </Grid>
              )}
              {hideCT36() && (
                <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setRejectConfirm(true)}
                    disabled={rejectDisabled()}
                  >
                    Reject
                  </Button>
                </Grid>
              )}
              <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleProductListSave}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    rafpendingActionDetailsCT06 &&
                    rafpendingActionDetailsCT06.taskName.toLowerCase() !==
                      'ct36'
                      ? () => setCompleteConfirm(true)
                      : handleCompleteTaskDialogOpen
                  }
                  // disabled={
                  //   rafpendingActionDetailsCT06 &&
                  //   rafpendingActionDetailsCT06.status === 'Active'
                  //     ? false
                  //     : true
                  // }
                >
                  Complete Task
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      {uploadDialog}
      {actionTypeDialog}
      {placeholderDialog}
      {replacementAssociationDialog}
      {/* Uncomment for Replacement Association  */}
      {uploadPlaceholderDialog}
      {ingredientsDialog}
      {rangeStoresDialog}
      {depotStockDialog}
      {recipeDialog}
      {depotStockUnitViewButtonsDialog}
      {pinDialogBox}
      {storeViewDialog}
      {confirmCompleteDialog}
      {confirmRejectDialog}
      {confirmStocksDialog}
      {confirmRafLockedDialog}
      {clearDepotBulkActionDialog}
      {finalStopOrderBulkActionDialog}
      {confirmBulkActionDelete}
      {confirmBulkActionCancel}
      {confirmUpdateDialog}
      {planogramShowErrorsDialog}
      {errorPlanoDialog}
      {completeTaskCT36Dialog}
      {confirmBulkStockCountRequestDialog}
    </>
  )
}
const mapStateToProps = (state: any) => {
  return {
    rafpendingActionDetailsCT06:
      state.pendingActionReducer.rafpendingActionDetailsCT06,
    userDetail: state.loginReducer.userDetail,
  }
}

export default connect(mapStateToProps, null)(DelistsAddedToRange)
