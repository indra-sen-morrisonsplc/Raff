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
  MenuProps as MenuPropsType,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { teal } from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'
import { SearchOutlined } from '@material-ui/icons'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
// import { RiFileExcel2Fill } from 'react-icons/ri'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
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
  ct36TableCols,
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
  const [minCheck, setMinCheck] = useState<any>(false)
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
  const [placeholderMultiSelectCheck, setPlaceholderMultiSelectCheck] =
    useState(false)
  const [placeholderMultiUploadData, setPlaceholderMultiUploadData] =
    useState<any>([])

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

  const refreshAction = () => {
    // getRangeByIdAndMinNumber('3400', '@all')
    // getRangeByIdAndMinNumber('1304', '@all')
    // getRangeByIdAndMinNumber(rafpendingActionDetailsCT06.eventId, '@all')
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
            return {
              _idCheck: rand,
              actionType: item.type,
              lineStatus: item.eventLineStatus,
              // itemNumber: item.itemNumber, //userinput
              min: item.itemNumber, //userinput
              pin: item.pin ? item.pin : null,
              pinArray: null,
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
              perStorepPerWeek: item.hasOwnProperty('perStorepPerWeek')
                ? item.perStorepPerWeek
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
              onlineStorePick: item.rangestatus
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
              newnoofrangestores: item.rangedStoresNew
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
              currentshelffill_vs_newfill_percant: item.shelfFillPercent
                ? item.shelfFillPercent
                : null,
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
              finalStopOrderDate: item.gscopdate ? item.gscopdate.date : null,
              systemSuggestedStopOrderDate: item.stopPODates
                ? item.stopPODates
                : null,
              lastPoDate: item.lastPODate ? item.lastPODate : null,
              depotShelfLifeMinimum: item.depotShelfLife
                ? item.depotShelfLife
                : null,
              productShelfLifeInstore: item.productShelfLife
                ? item.productShelfLife
                : null,
              shelfLifeatManufacture: item.mfgShelfLife
                ? item.mfgShelfLife
                : null,
              // newnoofrangestores: item.rangedStoresNew
              //   ? item.rangedStoresNew
              //   : null,
              totalstock: null, //nokey
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
              excessstock: item.totalExcessStocks
                ? item.totalExcessStocks
                : null,
              safewaybrandedequivalent: item.safewayBrandedEq
                ? item.safewayBrandedEq
                : null,
              effectiveDateFrom: item.effectiveFromDate
                ? item.effectiveFromDate
                : null,
              effectiveDateTo: item.effectiveToDate
                ? item.effectiveToDate
                : null,
              existingSupplier: item.existingSupplier
                ? item.existingSupplier
                : null,
              existingSupplierSite: item.existingSupplierSite
                ? item.existingSupplierSite
                : null,
              noOfRecipeMin: item.recipeMin ? item.recipeMin : '',
              // noOfRecipeMin: 100,
              depotClearbyReservedQtyRetail: null,
              depotClearbyReservedQtyWholesale: null,
              depotClearbyReservedQtyOnline: null,
              depotClearbyReservedQtyTotal: null,
              //
              // comments: item.comments ? item.comments : null, //uncomment when deploying
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
            }
          })

          setImportedData(data)
          console.log('setImportedData1304@all', data)
          console.log('ImportedData1304@all', data)
        }
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  useEffect(() => {
    // getRangeByIdAndMinNumber('3400', '@all')
    // getRangeByIdAndMinNumber('1304', '@all')
    // getRangeByIdAndMinNumber(rafpendingActionDetailsCT06.eventId, '@all')
    if (rafpendingActionDetailsCT06) {
      getRangeResetEventsStoreDepot(
        rafpendingActionDetailsCT06.eventId,
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
              return {
                _idCheck: rand,
                actionType: item.type,
                lineStatus: item.eventLineStatus,
                // itemNumber: item.itemNumber, //userinput
                min: item.itemNumber, //userinput
                pin: item.pin ? item.pin : null,
                pinArray: null,
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
                perStorepPerWeek: item.hasOwnProperty('perStorepPerWeek')
                  ? item.perStorepPerWeek
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
                onlineStorePick: item.rangestatus
                  ? item.rangestatus.online
                    ? item.rangestatus.online[0].toLowerCase() === '0nline'
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
                newnoofrangestores: item.rangedStoresNew
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
                currentshelffill_vs_newfill_percant: item.shelfFillPercent
                  ? item.shelfFillPercent
                  : null,
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
                finalStopOrderDate: item.gscopdate ? item.gscopdate.date : null,
                systemSuggestedStopOrderDate: item.stopPODates
                  ? item.stopPODates
                  : null,
                lastPoDate: item.lastPODate ? item.lastPODate : null,
                depotShelfLifeMinimum: item.depotShelfLife
                  ? item.depotShelfLife
                  : null,
                productShelfLifeInstore: item.productShelfLife
                  ? item.productShelfLife
                  : null,
                shelfLifeatManufacture: item.mfgShelfLife
                  ? item.mfgShelfLife
                  : null,
                // newnoofrangestores: item.rangedStoresNew
                //   ? item.rangedStoresNew
                //   : null,
                totalstock: null, //nokey
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
                excessstock: item.totalExcessStocks
                  ? item.totalExcessStocks
                  : null,
                safewaybrandedequivalent: item.safewayBrandedEq
                  ? item.safewayBrandedEq
                  : null,
                effectiveDateFrom: item.effectiveFromDate
                  ? item.effectiveFromDate
                  : null,
                effectiveDateTo: item.effectiveToDate
                  ? item.effectiveToDate
                  : null,
                existingSupplier: item.existingSupplier
                  ? item.existingSupplier
                  : null,
                existingSupplierSite: item.existingSupplierSite
                  ? item.existingSupplierSite
                  : null,
                noOfRecipeMin: item.recipeMin ? item.recipeMin : '',
                // noOfRecipeMin: 100,
                depotClearbyReservedQtyRetail: null,
                depotClearbyReservedQtyWholesale: null,
                depotClearbyReservedQtyOnline: null,
                depotClearbyReservedQtyTotal: null,
                //
                // comments: item.comments ? item.comments : null, //uncomment when deploying
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
              }
            })

            setImportedData(data)
            console.log('setImportedData1304@all', data)
            console.log('ImportedData1304@all', data)
          }
        })
        .catch((err: any) => {
          console.log(err)
        })
    }
  }, [])

  const onPageLoadStoreCode = () => {
    setIsProgressLoader(true)
    getLocationsStoreCodeAPI()
      .then((res: any) => {
        console.log('getLocationsStoreCodeAPI', res)
        setIsProgressLoader(false)
        const stores = res.data.stores
        // const storeCodes = stores.map((val: any) => {
        //   return {
        //     label: val.name,
        //     text: val.name,
        //   }
        // })
        const storeCodes = stores.map((val: any) => {
          return val.name
        })
        setStoreCode(storeCodes)
      })
      .catch((err: any) => {
        console.log('getLocationsStoreCodeAPIError', err)
        setIsProgressLoader(false)
      })
  }

  useEffect(() => {
    onPageLoadStoreCode()
  }, [])

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
      return <></>
    }
  }
  const onlineCFCTemplate = (rowData: any) => {
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
  const onlineStorePickTemplate = (rowData: any) => {
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
  const wholesaleTemplate = (rowData: any) => {
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
  // const pinTemplate = () => {
  //     return <TextFieldWithSearch value={pin} onChangeFn={setPin} onSearch={console.log} />
  // }

  // const buyingMinIngredientsTemplate = () => {
  //     return <TextFieldWithSearch value={buyingMinIngredients} onChangeFn={setBuyingMinIngredients} onSearch={console.log} />
  // }

  const actionTypeTemplate = (rowData: any) => {
    const check = supplierSelected.filter((val: any) => rowData.min === val.min)
    if (editClick && check.length > 0 && check[0].min === rowData.min) {
      return (
        <Select
          value={rowData && rowData.actionType}
          onChange={(e: any) => {
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'actionType',
                rowData,
                e.target.value
              )
            })
          }}
          input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
        >
          {actionTypeOptions.map((type: any) => {
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
      return <span>{rowData.actionType}</span>
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
          return (
            <MenuItem value={type.value} key={type.value}>
              {type.label}
            </MenuItem>
          )
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

    if (
      rowData &&
      rowData.actionType !== placeholderMin &&
      rowData.actionType !== supplyChange
    ) {
      return <>{rowData && rowData.legacyItemNumbers}</>
    } else if (
      rowData.actionType === placeholderMin ||
      rowData.actionType === supplyChange
    ) {
      return <>NA</>
    } else {
      return <></>
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
      rowData.actionType !== placeholderMin &&
      rowData.actionType !== supplyChange
    ) {
      return <>{rowData && rowData.man}</>
    } else {
      return <>NA</>
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
    if (
      rowData.actionType !== supplyChange ||
      rowData.actionType !== placeholderMin
    ) {
      return <>{rowData && rowData.casecost}</>
    } else {
      return <>NA</>
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
    if (rowData.actionType !== supplyChange) {
      return <>{rowData && rowData.packquantity}</>
    } else {
      return <>NA</>
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
    return <>{rowData && rowData.replaceMinDescription}</>
  }

  const unitretailIncImportedTemplate = (rowData: any) => {
    return <>NA</>
  }
  const unitretailExImportedTemplate = (rowData: any) => {
    return <>NA</>
  }

  const unitCostImportedTemplate = (rowData: any) => {
    if (
      rowData.actionType !== supplyChange &&
      rowData.actionType !== placeholderMin
    ) {
      return <>{rowData && rowData.unitcost}</>
    } else {
      return <>NA</>
    }
  }
  const perStorepPerWeekImportedTemplate = (rowData: any) => {
    if (rowData.actionType !== placeholderMin) {
      const check = supplierSelected.filter(
        (val: any) => rowData.min === val.min
      )
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
    } else {
      return <>NA</>
    }
  }

  const includeInClearancePricingTemplate = (rowData: any) => {
    if (
      rowData &&
      rowData.hasOwnProperty('includeInClearancePricing') &&
      rowData.includeInClearancePricing
    ) {
      // if (rowData.actionType === 'Delist Product (MIN)') {
      return (
        <Select
          value={rowData && rowData.includeInClearancePricing}
          onChange={(e: any) =>
            setImportedData((prevState: any) =>
              onChangeProductTableFields(
                prevState,
                'includeInClearancePricing',
                rowData,
                e.target.value
              )
            )
          }
          input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
        >
          {clearancePricingOptions.map((type) => {
            return (
              <MenuItem value={type.value} key={type.value}>
                {type.label}
              </MenuItem>
            )
          })}
        </Select>
      )
      // } else {
      //   return <>{rowData.includeInClearancePricing}</>
      // }
    } else {
      return <></>
    }
  }
  const clearDepotByTemplate = (rowData: any) => {
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
        input={<OutlinedInput margin="dense" className={classes.muiSelect} />}
      >
        <MenuItem
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
        </MenuItem>
      </Select>
    )
  }

  const effectiveDateFromProductTableTemplate = (rowData: any) => {
    // if (
    //   rowData &&
    //   rowData.hasOwnProperty('effectiveDateFrom') &&
    //   rowData.effectiveDateFrom !== ''
    // ) {
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
    // if (
    //   rowData &&
    //   rowData.hasOwnProperty('effectiveDateTo') &&
    //   rowData.effectiveDateTo !== ''
    // ) {
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
        />
      )
    } else {
      {
        rowData &&
          rowData.effectiveDateTo &&
          rowData.effectiveDateTo.split(' ')[0].replaceAll('-', '/')
      }
    }

    // } else {
    //   return <>NA</>
    // }
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
      (rowData &&
        // rowData.actionType === delistProductMin &&
        rowData.hasOwnProperty('systemSuggestedStopOrderDate') &&
        rowData.systemSuggestedStopOrderDate !== '' &&
        rowData.actionType === delistProductMin) ||
      rowData.actionType === delistOutercaseCode
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
    } else if (
      rowData.actionType === newProductMin ||
      rowData.actionType === placeholderMin
    ) {
      return <>NA</>
    } else {
      return <></>
    }
  }
  const lastPoDateTemplate = (rowData: any) => {
    if (
      rowData &&
      rowData.hasOwnProperty('lastPoDate') &&
      rowData.actionType !== placeholderMin
    ) {
      // if (rowData.actionType === delistProductMin) {
      return (
        <DatePicker
          format="dd/MM/yy"
          value={
            rowData && (rowData['lastPoDate'] ? rowData['lastPoDate'] : null)
          }
          onChange={(date: any) => {
            let newDate = date.toISOString().split('T')[0]
            setImportedData((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'lastPoDate',
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
      // } else {
      //   return <>{rowData.lastPoDate}</>
      // }
    } else if (rowData.actionType === placeholderMin) {
      return <>NA</>
    } else {
      return <></>
    }
  }
  const includeInStoreWastageTemplate = (rowData: any) => {
    if (
      rowData &&
      rowData.hasOwnProperty('includeInStoreWastage') &&
      rowData.includeInStoreWastage
    ) {
      // if (rowData.actionType === delistProductMin) {
      return (
        <Checkbox
          className={classes.disabled_color}
          disabled
          checked={rowData.includeInStoreWastage}
          color="primary"
          onChange={(e: any) => {
            setImportedData((prevState: any) =>
              onChangeProductTableFields(
                prevState,
                'includeInStoreWastage',
                rowData,
                e.target.checked
              )
            )
          }}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      )
      // } else {
      //   return <>{rowData.includeInStoreWastage}</>
      // }
    } else {
      return <></>
    }
  }
  const supplierCommitmentTemplate = (rowData: any) => {
    if (rowData && rowData.actionType !== placeholderMin) {
      const check = supplierSelected.filter(
        (val: any) => rowData.min === val.min
      )
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
    } else {
      return <>NA</>
    }
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
    setPinOpenDialog(true)
    setPinData(rowData)
    setPinData(rowData.pinArray)
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
    } else if (rowData.actionType === placeholderMin) {
      return <>NA</>
    } else {
      // return <>{rowData && rowData.pin ? rowData.pin : 'NA'}</>
      return <>{rowData && rowData.pin}</>
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
          setIsProgressLoader(false)
        })
        .catch((err: any) => {
          setIsProgressLoader(false)
          console.log('error store view')
        })
    )
  }
  const handleRangeStoresDialogOpen = (rowData: any) => {
    setRangedStoresDialogOpen(true)
    // setRangedStoresData(rowData)
    // setRangedStoresData(rowData)
    getStoreDepot(rowData, 'store')
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

  useEffect(() => {
    if (selectedProductListItems.length > 0) {
      for (let i = 0; i < selectedProductListItems.length; i++) {
        if (selectedProductListItems[i].actionType === 'Delist Product (MIN)') {
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
          title={`Current No. of Ranged Stores`}
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
              onClick={() =>
                exportExcel(storeViewApi, rangedStoresTableCols, 'StoresData')
              }
            >
              Download
            </button>
          </Box>
          <DataTable
            // value={rangedStoresTableData}
            // value={rangedStoresData}
            value={storeViewApi}
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

  const currentNoOfRangeStoresTemplate = (rowData: any) => {
    //storeViewDummyRes
    if (
      rowData &&
      rowData.hasOwnProperty('currentnoofrangedstores') &&
      rowData.currentnoofrangedstores !== 0
    ) {
      return (
        //  <Typography color="primary">
        <div
          className={classes.tableLinks}
          onClick={() => handleRangeStoresDialogOpen(rowData)}
        >
          {rowData.currentnoofrangedstores}
        </div>
        // </Typography>
      )
    } else {
      return <>0</>
      // return <>NA</>
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
          field={'newnoofrangestores'}
        />
      )
    } else {
      return <>{rowData.newnoofrangestores}</>
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
          field={'newShelfFill'}
        />
      )
    } else {
      return <>{rowData.newShelfFill}</>
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
      //  &&
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
        <OutlinedInput
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
    return <span>{rowData && rowData.existingSupplier}</span>
  }
  const handleIngredientDialogOpen = (rowData: any) => {
    setIngredientDialog(true)
    setIngredientData(rowData)
    setIngredientData(rowData.ingredientDetails)
    console.log('details', rowData.ingredientDetails)
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
              onClick={() => handleIngredientDialogOpen(rowData)}
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
  const handleRecipeDialogOpen = (rowData: any) => {
    setRecipeDialogOpen(true)
    setRecipeData(rowData.recipeDetails)
    console.log('details', rowData.recipeDetails)
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
      (rowData.actionType !== delistOutercaseCode ||
        rowData.actionType !== newOutercaseCode ||
        rowData.actionType !== supplyChange)
    ) {
      return (
        <>
          {rowData.noOfRecipeMin ? (
            <div
              onClick={() => handleRecipeDialogOpen(rowData)}
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
        <Grid container>
          <Grid item xs={6}>
            <div className="gridBorderGreen">
              <p className="headBgGreen">Ranged Stores</p>
              <ul className="childRange">
                {depotRegLoc &&
                  depotRegLoc.locations.map((val: any) => (
                    <DepotviewButtons locations={val} />
                  ))}
              </ul>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="gridBorderGreen">
              <p className="headBgGreen">Stores selected for Derange</p>
              <ul className="childRange">
                {depotRegLoc &&
                  depotRegLoc.locations.map((val: any) => (
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
          {depotRegions.map((button: any, index: any) => {
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
      return <>0</>
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
    if (e) {
      setBulkActions(e)
    } else {
      setBulkActions('')
    }
  }

  const handleUploadDialogOpen = () => {
    actionType && setOpenUploadDialog(true)
    // setOpenUploadDialog(true)
  }

  const handleUploadDialogClose = () => {
    setOpenUploadDialog(false)
    setUploadedFile(null)
  }

  const handleFileUpload = (event: any) => {
    setUploadedFile(event.target.files[0])
  }
  const [exceelErrors, setExceelErrors] = useState<any>([])
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
          const data = xlsx.utils.sheet_to_json(ws, { raw: false }) //dateNF:'yyyy-mm-dd'}
          console.log(data)
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

          result.map((d: any, index: any) => {})

          result.map((d: any, index: any) => {
            if (
              d.ActionType &&
              d.ActionType === delistProductMin &&
              (actionType.value === delistProductMin ||
                actionType.value === 'Multiple Selection') && //for multipe excel files upload remove actionType.value in all types
              // actionType.includes(delistProductMin)
              (d.MINPIN !== undefined || d.MIN !== undefined) //for multipe excel files upload remove actionType.value in all types
              // || actionType === undefined
            ) {
              getAndCheckItemNumber([
                d.MIN ? d.MIN : d.MINPIN,
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
                actionType.value === 'Multiple Selection')
              //   &&
              // d.MINPIN !== undefined
            ) {
              getAndCheckItemNumber([
                d.MIN ? d.MIN : d.MINPIN,
                newProductMin,
                index + 1,
                d.Comments, //optional
                d.NewNumberofRangeStores, //optional
                d.StoreCode, //optional
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
                d.MIN ? d.MIN : d.MINPIN,
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
                d.MIN ? d.MIN : d.MINPIN,
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
                d.EffectiveDateFrom, //optional
                d.EffectiveDateTo, //optional
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
                d.EffectiveDateFrom, //optional
                d.EffectiveDateTo, //optional
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
                d.MIN ? d.MIN : d.MINPIN, // Mandatory
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
                d.MIN ? d.MIN : d.MINPIN, // Mandatory
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
                d.MIN ? d.MIN : d.MINPIN, // Mandatory
                supplyChange,
                index + 1,
                d.Comments, //optional
                'NA',
                'NA',
                d.EffectiveDateFrom, // Mandatory
                d.EffectiveDateTo, //optional
                'NA',
                d.NewNumberofRangeStores,
                d.SupplierExisting, // Mandatory
                d.SupplierSiteExisting, //optional
                d.SupplierNew, // Mandatory
                d.SupplierSiteNew, //optional
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
                d.MIN ? d.MIN : d.MINPIN, // Mandatory
                productDistributionDecreaseMin,
                index + 1,
                d.Comments, //optional
                // d.NewNumberofRangeStores, // Mandatory
                d.NewNumberofStoresRestrictions, // Mandatory // when deploy
                d.StoreCode, //optional
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
                d.MIN ? d.MIN : d.MINPIN, //Mandatory
                productDistributionIncreaseMin,
                index + 1,
                d.Comments, //optional
                d.NewNumberofRangeStores, //optional
                d.StoreCode, //optional
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
              if (d.hasOwnProperty('Barcode')) {
                console.log('inside barcode')
                getProductServiceByItemnumber(d.Barcode)
                  .then((res: any) => {
                    console.log('myResponse', res.data)
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
                      newnoofrangestores: '',
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
                  })
              }
            } else {
              console.log(d.MINPIN + 'Error')
              // setExceelErrors((prevState: any) => {
              //   return [...prevState, ...d]
              // })
              setExceelErrors((prevState: any) => {
                return [
                  ...prevState,
                  {
                    ...d,
                  },
                ]
              })
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
          title={`Upload ${actionType && actionType.value}`}
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

  const handleActionTypeDialogOpen = () => {
    actionType && setOpenActionTypeDialog(true)
    // if (actionType === 'New Product (MIN)') {
    //   onPageLoadStoreCode()
    // }
    setSelectedStore([])
    onPageLoadStoreCode()
  }

  const handleActionTypeDialogClose = () => {
    setOpenActionTypeDialog(false)
    setMin('')
    setComments('')
    setNoOfStores('')
    setStoreCode([])
    setNewIngredientError(false)
    setNewShelfFill(0)
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
      local: 'Y',
      perStorepPerWeek: '',
      onlineCFC: 'Y',
      onlineStorePick: 'Y',
      wholesale: 'Y',
      currentnoofrangedstores: 0,
      newnoofrangestores: 0, //current
      // newnoofrangestores:"",
      currentVersusNewStores: 0,
      storesRangedCurrentVsProposed: 0,
      currentShelfFill: 0,
      newShelfFill: 0,
      currentshelffill_vs_newfill: 0,
      currentshelffill_vs_newfill_percant: 0,
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
      formData.legacyItemNumbers =
        productServieResponse1.value.data.legacyItemNumbers //legacyItemNumbers
      formData.depotShelfLifeMinimum =
        productServieResponse1.value.data.hasOwnProperty('productLife')
          ? productServieResponse1.value.data.productLife
              .minimumAcceptableProductLifedays
          : null
      formData.productShelfLifeInstore =
        productServieResponse1.value.data.hasOwnProperty('productLife')
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
        formData.existingSupplier = supplierExisting_x
        formData.existingSupplierSite = supplierSiteExisting_x
        formData.newSupplier = supplierNew_x
        formData.newSupplierSite = supplierSiteNew_x
      }
    }
    // formData.supplierId = supplierV1.supplierName;
    // formData.supplierSiteNameCode = supplierV1.supplierSiteNameCode;
    formData.existingSupplier = supplierV1.supplierName
    formData.existingSupplierSite = supplierV1.supplierSiteNameCode
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

    if (type === delistProductMin) {
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
      type === newProductMin ||
      type === 'Product Distribution Decrease (MIN)' ||
      type === 'Product Distribution Increase (MIN)'
    ) {
      // formData.storeCode = storecodeNewMin ? storecodeNewMin.join(',') : ''
      formData.storeCode =
        typeof storecodeNewMin === 'string'
          ? storecodeNewMin
          : storecodeNewMin
          ? storecodeNewMin.join(',')
          : ''
      formData.newnoofrangestores = newnoofrangestoreNewMin
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

    if (importedData && importedData.length > 0) {
      // let newData: any = importedData
      // importedData.map((data: any, index: any) => {
      //   let placeholderCheck = formData.actionType === placeholderMin
      //   let minCheck = data.min === formData.min
      //   console.log('placeCheck', formData.actionType)
      //   console.log(data.min, formData.min)
      //   if (!placeholderCheck && minCheck) {
      //     let singleData = formData
      //     singleData._idCheck = data._idCheck
      //     newData[index] = singleData
      //   } else {
      //     newData.push(formData)
      //   }
      // })
      let minCheck = importedData.findIndex(
        (data: any) => data.min === formData.min
      )
      console.log('mincheck1', minCheck)
      if (minCheck !== -1) {
        updateFlag = 1
        let newData = importedData
        let idCheck = importedData[minCheck]._idCheck
        formData._idCheck = idCheck
        newData[minCheck] = formData
        setImportedData(newData)
      } else {
        setImportedData((prevState: any) => {
          return [...prevState, formData]
        })
      }
    } else {
      setImportedData([formData])
    }
    console.log('formData', formData)
    if (updateFlag === 1) {
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: `${minValue} ${allMessages.success.itemIdUpdate}`,
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
  }
  const checkProductCompositionService = (minVal: any) => {
    setIsProgressLoader(true)
    getProductCompositionServiceByItemnumber(minVal)
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

  const handleManualRAF = () => {
    // onPageLoadStoreCode()
    if (min === '') {
      handleActionTypeDialogOpen()
      return
    }
    console.log('clicked')

    // return
    if (actionType.value === delistProductMin) {
      handleActionTypeDialogClose()
      if (min !== '') {
        console.log('hello')
        getAndCheckItemNumber([
          min,
          delistProductMin,
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
      }
    } else if (actionType.value === newProductMin) {
      handleActionTypeDialogClose()
      if (min !== '') {
        console.log('hello')
        getAndCheckItemNumber([
          min,
          newProductMin,
          '',
          '',
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
    } else if (actionType.value === delistIngredientMin) {
      handleActionTypeDialogClose()
      getAndCheckItemNumber([
        min,
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
    } else if (actionType.value === newIngredientMin) {
      checkProductCompositionService(min)
      newIngredient && handleActionTypeDialogClose()
      newIngredient &&
        getAndCheckItemNumber([
          min,
          newIngredientMin,
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
    } else if (actionType.value === delistOutercaseCode) {
      handleActionTypeDialogClose()
      getAndCheckItemNumber([
        min,
        delistOutercaseCode,
        '',
        '',
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
    } else if (actionType.value === newOutercaseCode) {
      handleActionTypeDialogClose()
      getAndCheckItemNumber([
        min,
        newOutercaseCode,
        '',
        '',
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
    } else if (actionType.value === productDistributionIncreaseMin) {
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
      handleActionTypeDialogClose()
      // minCheck &&
      getAndCheckItemNumber([
        min,
        productDistributionIncreaseMin,
        '',
        comments,
        newStoreCount,
        'NA',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ])
    } else if (actionType.value === productDistributionDecreaseMin) {
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
      handleActionTypeDialogClose()
      // minCheck &&
      getAndCheckItemNumber([
        min,
        productDistributionDecreaseMin,
        '',
        comments,
        newStoreCount,
        'NA',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ])
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
      handleActionTypeDialogClose()
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
      handleActionTypeDialogClose()
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
    } else if (actionType.value === 'Supplier Change') {
      handleActionTypeDialogClose()
      getAndCheckItemNumber([
        min,
        'Supplier Change',
        '',
        comments,
        'NA',
        'NA',
        newPinDateFrom,
        newPinDateTo,
        '',
        '',
        supplierExisting,
        supplierSiteExisting,
        supplierNew,
        supplierSiteNew,
      ])
    }
  }

  const handleProductListSave = () => {
    console.log('handleProductListSave', importedData)
    const formdata = importedData &&
      eventDetails && {
        items: importedData.map((item: any) => {
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
            gscopDate: item.finalStopOrderDate,
            supplierCommitment: item.supplierCommitment,
            wastage:
              item.includeInStoreWastage !== 'NA'
                ? item.includeInStoreWastage
                : '',
            wastageRange: eventDetails[0].wastageRange
              ? eventDetails[0].wastageRange
              : null,
            eventLineStatus: item.lineStatus,
            man: item.man !== 'NA' ? item.man : null,
            ingredientMin:
              item.ingredientMin !== 'NA' ? item.ingredientMin : null,
            pin: item.pin !== 'NA' ? item.pin : null,
            replaceMinDescription:
              item.replaceMinDescription !== 'NA'
                ? item.replaceMinDescription
                : '',
            existingSupplier: item.existingSupplier,
            existingSupplierSite: item.existingSupplierSite,
            rangedStoresCurrent: item.currentnoofrangedstores,
            rangedStoresNew:
              item.newnoofrangestores !== 'NA' ? item.newnoofrangestores : null,
            currentVsNewStores: item.currentVersusNewStores,
            rangedStoresPercent: item.storesRangedCurrentVsProposed,
            shelfFillCurrent: item.currentShelfFill,
            shelfFillNew: item.newShelfFill,
            currentVsNewShelfFill: item.currentshelffill_vs_newfill,
            shelfFillPercent: item.currentshelffill_vs_newfill_percant,
            unitCost: item.unitcost,
            caseCost: item.casecost,
            caseSize: item.packquantity ? item.packquantity : null,
            local: item.local,
            onlineCfc: item.onlineCFC,
            onlineStorePick: item.onlineStorePick,
            wholesale: item.wholesale,
            ownBrand: item.ownBrand,
            clearancePricing:
              item.includeInClearancePricing !== 'NA'
                ? item.includeInClearancePricing
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
            comments: item.comments,
            newSupplier: item.newSupplier ? item.newSupplier : null,
            newSupplierSite: item.newSupplierSite ? item.newSupplierSite : null,
            replaceMin: item.replaceMin !== 'NA' ? item.replaceMin : null,
            effectiveFromDate: item.effectiveDateFrom
              ? item.effectiveDateFrom
              : '',
            // : eventDetails[0].targetDate,
            effectiveToDate: item.effectiveDateTo ? item.effectiveDateTo : '',
            derangedLocations: item.storeNumbersForspecificStoreRange
              ? item.storeNumbersForspecificStoreRange
              : null,
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
    return (
      <DatePicker
        format="dd/MM/yy"
        value={delistPinDateFrom !== '' ? delistPinDateFrom : null}
        onChange={(date: any) => {
          let newDate = date.toISOString().split('T')[0]
          setDelistPinDateFrom(newDate)
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
      />
    )
  }

  const delistPinEffectiveDateTo = () => {
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
      />
    )
  }

  const newPinEffectiveDateFrom = () => {
    return (
      <DatePicker
        format="dd/MM/yy"
        value={newPinDateFrom !== '' ? newPinDateFrom : null}
        onChange={(date: any) => {
          let newDate = date.toISOString().split('T')[0]
          setNewPinDateFrom(newDate)
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
      />
    )
  }

  const newPinEffectiveDateTo = () => {
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
      />
    )
  }
  const handleGetStoreDetails = () => {
    setIsProgressLoader(true)
    getRangeResetEventsStoreDepot('3901', min, 'store')
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
                      <OutlinedInput
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
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      New no. of Range Stores
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
                        onChange={(e: any) => setNoOfStores(e.target.value)}
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
                      <OutlinedInput
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
                      <OutlinedInput
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
                      <OutlinedInput
                        value={min}
                        onChange={(e: any) => {
                          setMin(e.target.value)
                          setNewIngredientError(false)
                        }}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      New no. of Range Stores
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
                        onChange={(e: any) => setNoOfStores(e.target.value)}
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
                      <OutlinedInput
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
                        <OutlinedInput
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
                        <OutlinedInput
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
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        <OutlinedInput
                          value={min}
                          onChange={(e: any) => {
                            setCurrentNoOfRangeStores(0)
                            setMin(e.target.value)
                          }}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
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
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        New no.of Range Stores
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
                          value={newStoreCount}
                          onChange={(e: any) => {
                            if (e.target.value >= 0) {
                              setNewStoreCount(e.target.value)
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
                        <OutlinedInput
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
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        <OutlinedInput
                          value={min}
                          onChange={(e: any) => {
                            setCurrentNoOfRangeStores(0)
                            setMin(e.target.value)
                          }}
                          className={classes.inputFields}
                        />
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
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
                  </Box>
                  <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        New no.of Range Stores
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
                          value={newStoreCount}
                          onChange={(e: any) => {
                            if (e.target.value >= 0) {
                              setNewStoreCount(e.target.value)
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
                        <OutlinedInput
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
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
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
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
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
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      New Shelf Fill (Units)
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
                      <OutlinedInput
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
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
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
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
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
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      New Shelf Fill (Units)
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
                      <OutlinedInput
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
                          }}
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
                        Supplier (Existing)
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
                        <OutlinedInput
                          value={supplierSiteExisting}
                          disabled
                          // onChange={(e: any) =>
                          //   setSupplierSiteExisting(e.target.value)
                          // }
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
                        Supplier (New)
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
                          onChange={(e: any) => setSupplierNew(e.target.value)}
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
                        <OutlinedInput
                          value={supplierSiteNew}
                          onChange={(e: any) =>
                            setSupplierSiteNew(e.target.value)
                          }
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
                        <OutlinedInput
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
                onClick={handleManualRAF} //De-list save
              >
                Save
              </Button>
            </Box>
            {actionType &&
              (actionType.value === 'Product Shelf Space Decrease' ||
                actionType.value === 'Product Shelf Space Increase' ||
                actionType.value === 'Product Distribution Increase (MIN)' ||
                actionType.value === 'Supplier Change' ||
                actionType.value === 'Product Distribution Decrease (MIN)') && (
                <Box sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGetStoreDetails} //De-list save
                  >
                    Get MIN Details
                  </Button>
                </Box>
              )}
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
              onClick={handleUploadDialogOpen}
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
  // const refreshPage = () => {
  //   setIsProgressLoader(true)
  //   setRefreshClick(!refreshClick)
  //   setIsProgressLoader(false)
  // }
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
        <Grid item xl={8} lg={8} md={8} sm={8} xs={7}>
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
              options={massActions}
              onChange={handleBulkActions}
              placeholder="Bulk Actions"
            />
          </Typography>
        </Grid>
        <Grid item xl={4} lg={4} md={4} sm={4} xs={5}>
          <Button variant="contained" color="primary" onClick={refreshAction}>
            Refresh
          </Button>
        </Grid>
      </Grid>

      {rafpendingActionDetailsCT06 &&
      rafpendingActionDetailsCT06.taskName.toLowerCase() === 'ct36' ? (
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <DataTable value={importedData} showGridlines>
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
                      // (col.field === 'ownBrand' && ownBrandImportedTemplate) ||
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
                      (col.field === 'effectiveDateFrom' &&
                        effectiveDateFromProductTableTemplate) ||
                      (col.field === 'effectiveDateTo' &&
                        effectiveDateToProductTableTemplate) ||
                      (col.field === 'finalStopOrderDate' &&
                        finalStopOrderDateTemplate) ||
                      (col.field === 'systemSuggestedStopOrderDate' &&
                        systemGeneratedStopOrderDateTemplate) ||
                      (col.field === 'lastPoDate' && lastPoDateTemplate) ||
                      (col.field === 'newnoofrangestores' &&
                        newNoOfRangeStoresTemplate) ||
                      (col.field === 'newShelfFill' &&
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
                      (col.field === 'comments' && commentsTemplate)
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
      )}
      {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <button
        //  className={classes.backButton}
        >
          <Typography variant="subtitle1">View More Columns</Typography>
        </button>
      </Grid> */}
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
          existingSupplier: '',
          existingSupplierSite: '',
          newnoofrangestores: '',
          storeCode: '',
          ownBrand: 'Y',
          // barcode: i === 0 ? '5010228012933' : '501022801293' + i,
          barcode: '',
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
      }

      if (fullFilled.length === 0) {
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
              val.hasOwnProperty('Description') &&
              val.hasOwnProperty('OwnBrand')
            )
          })

          let newData = validate.map((d: any) => {
            var minVal = 1000000000000
            var max = 9999999999999
            var rand = Math.floor(minVal + Math.random() * (max - minVal))
            return {
              _idCheck: rand,
              actionType: placeholderMin,
              description: d.Description ? d.Description : '',
              ownBrand: d.OwnBrand ? d.OwnBrand : '',
              barcode: d.BarCode ? d.BarCode : '',
              existingSupplier: d.SupplierCode ? d.SupplierCode : '', // supplier site field
              existingSupplierSite: d.SupplierSiteCode
                ? d.SupplierSiteCode
                : '', // supplier site code
              packquantity: d.CasePack ? d.CasePack : '',
              newnoofrangestores: d.NewNumberofRangeStores
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
          //     newnoofrangestores: d[cols[6]] ? d[cols[6]] : '',
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
    <Dialog
      open={openPlaceholderUpload}
      onClose={handlePlaceholderUploadClose}
      fullWidth
      classes={{
        paperFullWidth: classes.placeholderDialog,
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

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'barcode',
                rowData,
                e.target.value
              )
            })
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
          value={rowData.existingSupplier}
          suggestions={supplierOption}
          className="p-inputtext-sm p-d-block p-mb-2 autoCompletePrimeInput"
          completeMethod={(e: any) => searchCountry(e, 'Supplier')}
          field=""
          placeholder="Search"
          onChange={(e: any) =>
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'existingSupplier',
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
    return (
      <div className="card primeCardPlacholder">
        <AutoCompletePrime
          value={rowData.existingSupplierSite}
          suggestions={siteOption}
          completeMethod={(e: any) => searchCountry(e, 'Site')}
          className="p-inputtext-sm p-d-block p-mb-2 autoCompletePrimeInput"
          field=""
          placeholder="Search"
          onChange={(e: any) =>
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'existingSupplierSite',
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
        value={rowData && rowData.newnoofrangestores}
        onChange={(e) => {
          if (e.target.value !== null) {
            setPlaceholderProducts((prevState: any) => {
              return onChangeProductTableFields(
                prevState,
                'newnoofrangestores',
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
                {val.value.data.gtins.length > 0
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
                <input
                  type="text"
                  required
                  // className={classes.placeholderCountStyle}
                  style={{
                    width: small ? '88%' : '100%',
                  }}
                  value={placeholderCount}
                  onChange={(e: any) => setPlaceholderCount(e.target.value)}
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
                          (col.field === 'existingSupplier' &&
                            supplierCodePlaceholderTemplate) ||
                          (col.field === 'packquantity' &&
                            casePackPlaceholderTemplate) ||
                          (col.field === 'newnoofrangestores' &&
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
                          (col.field === 'existingSupplierSite' &&
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

  const handleCompleteTask = () => {
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
          updated: '',
        },
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
        // onRemove={handleToaster}
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
              Pending Action -{' '}
              <b>Delists added to the Range Change Management App</b>
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
        {
          // taskName.toLowerCase() !== 'ct36' && (
          rafpendingActionDetailsCT06 &&
            rafpendingActionDetailsCT06.taskName.toLowerCase() !== 'ct36' && (
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
                          actionType &&
                          actionType.value === 'Multiple Selection'
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
                  <Grid item sm={4} xs={12}>
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
                        onClick={handleUploadDialogOpen}
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
                  spacing={2}
                  style={{ textAlign: 'center' }}
                >
                  <Grid item sm={4} xs={12}>
                    <Button
                      // className="backButton"
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handlePlaceholderDialogOpen}
                    >
                      <Typography variant="body2">
                        Add Placeholder MIN/PIN
                      </Typography>
                    </Button>
                  </Grid>
                  <Grid item sm={4} xs={12}>
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
                  <Grid item sm={4} xs={12}>
                    <Button
                      // className="backButton"
                      // onClick={handlePlaceholderDialogOpen}
                      variant="contained"
                      color="primary"
                    >
                      <Typography variant="body2">
                        Issue Delist Letter
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )
        }

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
              <Grid item xl={2} lg={2} md={2} sm={6} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleProductListEdit}
                  disabled={editButtonSupply}
                >
                  Edit
                </Button>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  //onClick={handleProductListSave}
                  disabled={
                    rafpendingActionDetailsCT06 &&
                    rafpendingActionDetailsCT06.taskName === 'CT06'
                      ? true
                      : false
                  }
                >
                  Reject
                </Button>
              </Grid>
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
                  onClick={handleCompleteTask}
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
