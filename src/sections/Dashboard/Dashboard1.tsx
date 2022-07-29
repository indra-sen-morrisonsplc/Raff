import {
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  CardHeader,
  IconButton,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box,
  Tabs,
  Tab,
  Button,
} from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
// import { pendingStatusDetails } from './DataConstant'
import {
  myFirstTableCols,
  mySecondTableCols,
  pendingTaskDetails,
  userTaskDashboard,
} from './DataConstant1'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { ProgressBar } from 'primereact/progressbar'
import { admins } from '../../util/Constants'
import {
  set_mygrouppendingAction,
  set_mygroupunassignAction,
  set_myinprogressAction,
  set_mypendingAction,
  set_range_pendingAction,
  set_range_grouppendingAction,
  reset_all,
} from '../../redux/Actions/PendingAction/Action'
import {
  getStatusCamundaAPI,
  getStatusEventCamundaAPI,
  getStatusNewCamundaAPI,
  getStatusEventCamundaAPINew,
  getUserGroupAPIWithGroupId,
} from '../../api/Fetch'
import { ServiceResponse } from '../../pages/Login/Messages'
import { TabView, TabPanel } from 'primereact/tabview'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { routes } from '../../util/Constants'

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
    // minHeight: '422px',
  },
  spacing: {
    margin: theme.spacing(2),
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  wide: {
    [theme.breakpoints.up(900)]: {
      maxWidth: 600,
      fontSize: '14px',
    },
    [theme.breakpoints.down(900)]: {
      maxWidth: 400,
      fontSize: '14px',
    },
    [theme.breakpoints.down(750)]: {
      maxWidth: 400,
      fontSize: '14px',
    },
    [theme.breakpoints.down(500)]: {
      width: 300,
      fontSize: '12px',
    },
    [theme.breakpoints.down(400)]: {
      width: 200,
      fontSize: '12px',
    },
    [theme.breakpoints.down(300)]: {
      width: 200,
      fontSize: '12px',
    },
  },
  color90: {
    color: theme.palette.primary.main,
  },
  color80: {
    color: '#FFBF00',
  },
  color60: {
    color: 'red',
  },
  tool: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
  tabHead: {
    color: theme.palette.primary.main,
    // fontWeight: 'bold',
    marginLeft: theme.spacing(2),
  },
  progressBar: {
    backgroundColor: 'white',
    border: '0.5px solid black',
    height: '10px',
    width: '100%',
  },
  rootTab: {
    // 'min-width': '120px',
    'font-size': '14px',
    'font-weight': 'bold',
  },
  rejectEror: {
    fontSize: '12px',
    padding: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  rejectSuccess: {
    // 'min-width': '120px',
    fontSize: '12px',
    padding: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.error.main,
    cursor: 'pointer',
  },
  weekEror: {
    fontSize: '12px',
    padding: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  weekSuccess: {
    fontSize: '12px',
    padding: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
  tabButton: {
    width: '100%',
  },
}))

function Dashboard1(props: any) {
  const history = useHistory()
  const {
    DEFAULT,
    DASHBOARD_RANGE_PENDINGACTION,
    DASHBOARD_RANGE_MYGROUPPENDINGTASKS,
    DASHBOARD_RANGE_MYTASKREJECTED,
    DASHBOARD_RANGE_MYGROUPTASKREJECTED,
    DASHBOARD_RANGE_PENDINGACTION_WEEK5,
    DASHBOARD_RANGE_PENDINGACTION_WEEK2_TO_WEEK5,
    DASHBOARD_RANGE_PENDINGACTION_NEXT_WEEK,
    DASHBOARD_RANGE_PENDINGACTION_CURRENT_WEEK,
    DASHBOARD_RANGE_MISSED,
    DASHBOARD_RANGE_MYGROUPTASK_MISSED,
    DASHBOARD_RANGE_MYGROUP_WEEK5,
    DASHBOARD_RANGE_MYGROUP_WEEK2_TO_WEEK5,
    DASHBOARD_RANGE_MYGROUP_NEXT_WEEK,
    DASHBOARD_RANGE_MYGROUP_CURRENT_WEEK,
  } = routes
  const [newMap, setNewMap] = useState<Array<any>>([])
  const theme = useTheme()
  const active = useMediaQuery(theme.breakpoints.down('sm'))
  const [isProgressLoader, setIsProgressLoader] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [table1Data, setTable1Data] = useState<any>()
  const [table2Data, setTable2Data] = useState<any>()
  const [ontimeCompletion, setOntimeCompletion] = useState<any>(0)
  // const [ontimeCompletion2, setOntimeCompletion2] = useState<any>(0)
  const [eventDashData, setEventDashData] = React.useState<any>()
  // let newMap1: Array<any> = []

  const {
    mypendingAction,
    myinprogressTasks,
    mygroupPendingAction,
    mygroupUnassignTasks,
    eventPendingAction,
    eventGroupPendingAction,
    set_mypendingAction,
    set_myinprogressAction,
    set_mygrouppendingAction,
    set_mygroupunassignAction,
    set_range_pendingAction,
    set_range_grouppendingAction,
    reset_all,
    userDetail,
  } = props
  const classes = useStyles()

  const getProducrHierarchy = (userGroups: any) => {
    let productArray: any = []
    // let productNullArray: any = ''
    userGroups.forEach((groups: any) => {
      return groups.productHierarchy.forEach((product: any) => {
        productArray.push(product.hierarchyName.split(' > ')[1])
      })
    })
    console.log(productArray)
    let check1 = ''
    let check2 = encodeURIComponent(check1)
    console.log(check2)
    let productArray1 = productArray.filter(
      (item: any, i: any, ar: any) => ar.indexOf(item) === i
    )
    console.log(productArray1)
    // if (productArray1.length > 0) {
    //   console.log('in')
    let productArray2 = encodeURIComponent(productArray1.join())
    console.log(productArray2)
    // return productArray1.join()
    // } else {
    //   console.log('out')
    //   console.log(productArray1.join())
    //   return productNullArray
    // }
    return productArray2
  }

  const getGroupId = (userGroups: any) => {
    let productArray: any = []
    userGroups.forEach((groups: any) => {
      // return groups.productHierarchy.forEach((product: any) => {
      productArray.push(groups.groupId)
      // })
    })
    return productArray.join()
  }

  const getRoleName = (userRoles: any) => {
    let productArray: any = []
    userRoles.forEach((roles: any) => {
      // return groups.productHierarchy.forEach((product: any) => {
      productArray.push(roles.roleName)
      // })
    })
    return productArray.join()
  }

  useEffect(() => {
    const wholeGroupId = getGroupId(
      userDetail.userdetails && userDetail.userdetails[0].usergroups
    )
    console.log(wholeGroupId)
    const wholeRoleName = getRoleName(
      userDetail.userdetails && userDetail.userdetails[0].roles
    )
    console.log(wholeRoleName)
    // const userGroupId =
    //   userDetail.userdetails && userDetail.userdetails[0].usergroups[0].groupId
    // console.log(userGroupId)
    // console.log('out')
    // let userGroup =
    //   userDetail.userdetails &&
    //   userDetail.userdetails[0].usergroups[0].groupName.split('-')
    // console.log(userGroup)
    // let userGroup1 = userGroup[0].trim()
    // console.log(userGroup1)
    setIsProgressLoader(true)
    let pendingTasks: Array<any> = []
    let inprogressTasks: Array<any> = []
    let mygroupPendingTasks: Array<any> = []
    let mygroupUnassignTasks: Array<any> = []
    let rangePendingTasks: Array<any> = []
    let rangeGroupPendingTasks: Array<any> = []
    setNewMap([...userTaskDashboard])
    getStatusNewCamundaAPI &&
      getStatusNewCamundaAPI(
        userDetail &&
          userDetail.userdetails &&
          userDetail.userdetails[0].user.userId,
        'summary'
      )
        .then((res) => {
          const pendingStatusDetails = res.data

          setIsProgressLoader(false)
          if (pendingStatusDetails && pendingStatusDetails.status) {
            pendingTasks =
              pendingStatusDetails &&
              pendingStatusDetails.status &&
              pendingStatusDetails.status.filter(
                (item: any) => item.details.toLowerCase() === 'mypendingtasks'
              )

            inprogressTasks =
              pendingStatusDetails &&
              pendingStatusDetails.status &&
              pendingStatusDetails.status.filter(
                (item: any) => item.details.toLowerCase() === 'myrequestedtasks'
              )
            mygroupPendingTasks =
              pendingStatusDetails &&
              pendingStatusDetails.status &&
              pendingStatusDetails.status.filter(
                (item: any) =>
                  item.details.toLowerCase() === 'mygrouppendingtasks'
              )
            mygroupUnassignTasks =
              pendingStatusDetails &&
              pendingStatusDetails.status &&
              pendingStatusDetails.status.filter(
                (item: any) =>
                  item.details.toLowerCase() === 'mygroupunnassignedtasks'
              )

            // console.log(pendingTasks)
            // console.log(inprogressTasks)
            // console.log(mygroupPendingTasks)
            // console.log(mygroupUnassignTasks)
            set_mypendingAction(pendingTasks)
            set_myinprogressAction(inprogressTasks)
            set_mygrouppendingAction(mygroupPendingTasks)
            set_mygroupunassignAction(mygroupUnassignTasks)
          }
        })
        .catch((error) => {
          setIsProgressLoader(false)
          set_mypendingAction([])
          set_myinprogressAction([])
          set_mygrouppendingAction([])
          set_mygroupunassignAction([])
        })
    // }, [pendingStatusDetails])
    wholeGroupId &&
      getUserGroupAPIWithGroupId &&
      getUserGroupAPIWithGroupId(wholeGroupId).then((res1) => {
        let userGroupdata = res1.data
        // console.log(
        //   userGroupdata.usergroups[0].productHierarchy[0].hierarchyName
        // )
        // let userGroupData1 =
        //   userGroupdata.usergroups[0].productHierarchy[0].hierarchyName.split(
        //     ' > '
        //   )
        // console.log(userGroupData1)
        // let userGroupData2 = userGroupData1[1] ? userGroupData1[1] : ''
        // console.log(userGroupData2)
        //  })
        const wholeTradeGroup = getProducrHierarchy(userGroupdata.usergroups)
        console.log(wholeTradeGroup)
        if (wholeTradeGroup) {
          wholeTradeGroup &&
            wholeRoleName &&
            getStatusEventCamundaAPINew &&
            getStatusEventCamundaAPINew(
              userDetail &&
                userDetail.userdetails &&
                userDetail.userdetails[0].user.userId,
              // userDetail &&
              //   userDetail.userdetails &&
              //   userDetail.userdetails[0].roles[0].roleName,
              wholeRoleName,
              wholeTradeGroup,
              'summary'
            )
              // getStatusEventCamundaAPI &&
              //   getStatusEventCamundaAPI()
              .then((res) => {
                const pendingTaskDetails = res.data
                setEventDashData(pendingTaskDetails)
                console.log(
                  parseInt(
                    pendingTaskDetails.status.filter(
                      (item: any) => item.details === 'myPendingTasks'
                    )[0].count
                  )
                )
                setIsProgressLoader(false)
                // setOntimeCompletion(pendingTaskDetails.myOTC.ontimeCompletion)
                // setOntimeCompletion2(pendingTaskDetails.ontimeCompletion)
                if (pendingTaskDetails && pendingTaskDetails.status) {
                  rangePendingTasks =
                    pendingTaskDetails &&
                    pendingTaskDetails.status &&
                    pendingTaskDetails.status.filter(
                      (item: any) =>
                        item.details.toLowerCase() === 'mypendingtasks'
                      // (item: any) =>
                      //   item.details.toLowerCase() === 'mygrouppendingtasks'
                    )
                  rangeGroupPendingTasks =
                    pendingTaskDetails &&
                    pendingTaskDetails.status &&
                    pendingTaskDetails.status.filter(
                      (item: any) =>
                        item.details.toLowerCase() === 'mygrouppendingtasks'
                    )
                  set_range_pendingAction(rangePendingTasks)
                  // set_myinprogressAction(inprogressTasks)
                  set_range_grouppendingAction(rangeGroupPendingTasks)
                  //set_mygroupunassignAction(mygroupUnassignTasks)
                }
              })
              .catch((error) => {
                setIsProgressLoader(false)
                set_range_pendingAction([])
                // set_myinprogressAction([])
                set_range_grouppendingAction([])
                // set_mygroupunassignAction([])
              })
        } else {
          //  wholeTradeGroup &&
          wholeRoleName &&
            getStatusEventCamundaAPINew &&
            getStatusEventCamundaAPINew(
              userDetail &&
                userDetail.userdetails &&
                userDetail.userdetails[0].user.userId,
              // userDetail &&
              //   userDetail.userdetails &&
              //   userDetail.userdetails[0].roles[0].roleName,
              wholeRoleName,
              wholeTradeGroup,
              'summary'
            )
              // getStatusEventCamundaAPI &&
              //   getStatusEventCamundaAPI()
              .then((res) => {
                const pendingTaskDetails = res.data
                setEventDashData(pendingTaskDetails)
                console.log(
                  parseInt(
                    pendingTaskDetails.status.filter(
                      (item: any) => item.details === 'myPendingTasks'
                    )[0].count
                  )
                )
                setIsProgressLoader(false)
                // setOntimeCompletion(pendingTaskDetails.myOTC.ontimeCompletion)
                // setOntimeCompletion2(
                //   pendingTaskDetails.groupOTC.ontimeCompletion
                // )
                if (pendingTaskDetails && pendingTaskDetails.status) {
                  rangePendingTasks =
                    pendingTaskDetails &&
                    pendingTaskDetails.status &&
                    pendingTaskDetails.status.filter(
                      (item: any) =>
                        item.details.toLowerCase() === 'mypendingtasks'
                      // (item: any) =>
                      //   item.details.toLowerCase() === 'mygrouppendingtasks'
                    )
                  rangeGroupPendingTasks =
                    pendingTaskDetails &&
                    pendingTaskDetails.status &&
                    pendingTaskDetails.status.filter(
                      (item: any) =>
                        item.details.toLowerCase() === 'mygrouppendingtasks'
                    )
                  set_range_pendingAction(rangePendingTasks)
                  // set_myinprogressAction(inprogressTasks)
                  set_range_grouppendingAction(rangeGroupPendingTasks)
                  //set_mygroupunassignAction(mygroupUnassignTasks)
                }
              })
              .catch((error) => {
                setIsProgressLoader(false)
                set_range_pendingAction([])
                // set_myinprogressAction([])
                set_range_grouppendingAction([])
                // set_mygroupunassignAction([])
              })
        }
      })

    return reset_all()
  }, [])
  // }, [pendingTaskDetails])
  useEffect(() => {
    if (eventDashData) {
      console.log(
        parseInt(
          eventDashData.status.filter(
            (item: any) => item.details === 'myPendingTasks'
          )[0].count
        )
      )
    }

    console.log(eventDashData)
  }, [eventDashData])

  useEffect(() => {
    console.log(tabValue)
    if (eventDashData) {
      if (tabValue === 1) {
        setOntimeCompletion(eventDashData.groupOTC.ontimeCompletion)
        console.log(tabValue)
      } else {
        setOntimeCompletion(eventDashData.myOTC.ontimeCompletion)
        console.log(tabValue)
      }
    }
  }, [eventDashData, tabValue])

  useEffect(() => {
    // console.log(mypendingAction)
    // console.log(myinprogressTasks)
    // console.log(mygroupPendingAction)
    // console.log(mygroupUnassignTasks)
    if (
      mypendingAction &&
      myinprogressTasks &&
      mygroupPendingAction &&
      mygroupUnassignTasks &&
      eventPendingAction &&
      eventGroupPendingAction &&
      userDetail &&
      eventDashData
    ) {
      const rolelist =
        userDetail &&
        userDetail.userdetails &&
        userDetail.userdetails[0].roles.map((rl: any) => rl.roleId)
      let adminqn = false
      let eventAccess = false
      for (let ad = 0; ad < admins.length; ad++) {
        if (rolelist.includes(admins[ad])) {
          adminqn = true
          break
        }
      }
      for (let accEvent = 0; accEvent < rolelist.length; accEvent++) {
        if (
          rolelist.includes('RRMNGR') ||
          rolelist.includes('BUYER') ||
          rolelist.includes('SRBYM') ||
          rolelist.includes('CTDIR')
        ) {
          eventAccess = true
          break
        }
      }
      const newMap1 =
        userDetail &&
        userTaskDashboard.map((item) => {
          if (item.value.toLowerCase() === 'usermanagement') {
            // item.my.pendingActions =
            //   mypendingAction.length > 0 && mypendingAction[0].tasks.length > 0
            //     ? mypendingAction[0].tasks.length
            //     : 0
            item.my.pendingActions =
              mypendingAction.length > 0
                ? parseInt(mypendingAction[0].count)
                : 0
            // item.my.inProgressTask =
            //   myinprogressTasks.length > 0 &&
            //   myinprogressTasks[0].tasks.length > 0
            //     ? myinprogressTasks[0].tasks.length
            //     : 0
            item.my.inProgressTask =
              myinprogressTasks.length > 0
                ? parseInt(myinprogressTasks[0].count)
                : 0
            // item.myGroup.pendingActions =
            //   adminqn &&
            //   mygroupPendingAction.length > 0 &&
            //   mygroupPendingAction[0].tasks.length > 0
            //     ? mygroupPendingAction[0].tasks.length
            //     : 0
            item.myGroup.pendingActions =
              adminqn && mygroupPendingAction.length > 0
                ? parseInt(mygroupPendingAction[0].count)
                : 0
            // item.myGroup.inProgressTask =
            //   adminqn &&
            //   mygroupUnassignTasks.length > 0 &&
            //   mygroupUnassignTasks[0].tasks.length > 0
            //     ? mygroupUnassignTasks[0].tasks.length
            //     : 0
            item.myGroup.inProgressTask =
              adminqn && mygroupUnassignTasks.length > 0
                ? parseInt(mygroupUnassignTasks[0].count)
                : 0
          } else if (item.value.toLowerCase() === 'rangechangemanagement') {
            item.my.total =
              // eventPendingAction.length > 0 &&
              // eventPendingAction[0].tasks.length > 0
              //   ? eventPendingAction[0].tasks.length
              //   : 0
              eventDashData && eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myPendingTasks'
                    )[0].count
                  )
                : 0
            item.my.weekMoreThanFive =
              // eventPendingAction.length > 0 &&
              // eventPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === '> Week 5'
              // ).length > 0
              //   ? eventPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === '> Week 5'
              //     ).length
              //   : 0
              eventDashData && eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myWk5Tasks'
                    )[0].count
                  )
                : 0
            item.my.weekTwoToFive =
              // eventPendingAction.length > 0 &&
              // eventPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Week 2 to Week 5'
              // ).length > 0
              //   ? eventPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Week 2 to Week 5'
              //     ).length
              //   : 0
              eventDashData && eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myWk25Tasks'
                    )[0].count
                  )
                : 0
            item.my.nextWeek =
              // eventPendingAction.length > 0 &&
              // eventPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Next Week'
              // ).length > 0
              //   ? eventPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Next Week'
              //     ).length
              //   : 0
              eventDashData && eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myWk1Tasks'
                    )[0].count
                  )
                : 0
            item.my.currentWeek =
              // eventPendingAction.length > 0 &&
              // eventPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Current Week'
              // ).length > 0
              //   ? eventPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Current Week'
              //     ).length
              //   : 0
              eventDashData && eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myWk0Tasks'
                    )[0].count
                  )
                : 0
            item.my.rejected =
              // eventPendingAction.length > 0 &&
              // eventPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Rejected'
              // ).length > 0
              //   ? eventPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Rejected'
              //     ).length
              //   : 0
              eventDashData && eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myRejectedTasks'
                    )[0].count
                  )
                : 0
            item.my.missedOrOverdue =
              // eventPendingAction.length > 0 &&
              // eventPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Missed'
              // ).length > 0
              //   ? eventPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Missed'
              //     ).length
              //   : 0
              eventDashData && eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myMissedTasks'
                    )[0].count
                  )
                : 0
            item.myGroup.total =
              // adminqn &&
              eventAccess &&
              // eventGroupPendingAction.length > 0 &&
              // eventGroupPendingAction[0].tasks.length > 0
              //   ? eventGroupPendingAction[0].tasks.length
              //   : 0
              eventDashData &&
              eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myGroupPendingTasks'
                    )[0].count
                  )
                : 0
            item.myGroup.weekMoreThanFive =
              eventAccess &&
              // eventGroupPendingAction.length > 0 &&
              // eventGroupPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === '> Week 5'
              // ).length > 0
              //   ? eventGroupPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === '> Week 5'
              //     ).length
              //   : 0
              eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myGroupWk5Tasks'
                    )[0].count
                  )
                : 0
            item.myGroup.weekTwoToFive =
              eventAccess &&
              // eventGroupPendingAction.length > 0 &&
              // eventGroupPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Week 2 to Week 5'
              // ).length > 0
              //   ? eventGroupPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Week 2 to Week 5'
              //     ).length
              //   : 0
              eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myGroupWk25Tasks'
                    )[0].count
                  )
                : 0
            item.myGroup.nextWeek =
              eventAccess &&
              // eventGroupPendingAction.length > 0 &&
              // eventGroupPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Next Week'
              // ).length > 0
              //   ? eventGroupPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Next Week'
              //     ).length
              //   : 0
              eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myGroupWk1Tasks'
                    )[0].count
                  )
                : 0
            item.myGroup.currentWeek =
              eventAccess &&
              // eventGroupPendingAction.length > 0 &&
              // eventGroupPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Current Week'
              // ).length > 0
              //   ? eventGroupPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Current Week'
              //     ).length
              //   : 0
              eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myGroupWk0Tasks'
                    )[0].count
                  )
                : 0
            item.myGroup.rejected =
              eventAccess &&
              // eventGroupPendingAction.length > 0 &&
              // eventGroupPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Rejected'
              // ).length > 0
              //   ? eventGroupPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Rejected'
              //     ).length
              //   : 0
              eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myGroupRejectedTasks'
                    )[0].count
                  )
                : 0
            item.myGroup.missedOrOverdue =
              eventAccess &&
              // eventGroupPendingAction.length > 0 &&
              // eventGroupPendingAction[0].tasks.filter(
              //   (item: any) => item.timeFilter === 'Missed'
              // ).length > 0
              //   ? eventGroupPendingAction[0].tasks.filter(
              //       (item: any) => item.timeFilter === 'Missed'
              //     ).length
              //   : 0
              eventDashData.status
                ? parseInt(
                    eventDashData.status.filter(
                      (item: any) => item.details === 'myGroupMissedTasks'
                    )[0].count
                  )
                : 0
          }

          return item
        })
      console.log(newMap)
      setNewMap([...newMap1])
    }
  }, [
    userDetail,
    mypendingAction,
    myinprogressTasks,
    mygroupPendingAction,
    mygroupUnassignTasks,
    eventPendingAction,
    eventGroupPendingAction,
  ])

  useEffect(() => {
    if (
      Array.isArray(newMap) &&
      newMap.length > 0 &&
      mypendingAction &&
      myinprogressTasks &&
      mygroupPendingAction &&
      mygroupUnassignTasks &&
      eventPendingAction &&
      eventGroupPendingAction &&
      userDetail
    ) {
      let rcmData = newMap.filter(
        (dash: any) => dash.value === 'rangechangemanagement'
      )
      if (rcmData && rcmData[0].my && rcmData[0].myGroup) {
        console.log(rcmData)
        setTable1Data([rcmData[0].my])
        setTable2Data([rcmData[0].myGroup])
      }
    }
  }, [
    userDetail,
    mypendingAction,
    myinprogressTasks,
    mygroupPendingAction,
    mygroupUnassignTasks,
    eventPendingAction,
    eventGroupPendingAction,
  ])

  const missedTemplate = (rowData: any) => {
    console.log(rowData)
    if (rowData.missedOrOverdue === 0) {
      return <div className={classes.rejectEror}>{rowData.missedOrOverdue}</div>
    } else {
      return (
        <div
          className={classes.rejectSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MISSED}`)
          }}
        >
          {rowData.missedOrOverdue}
        </div>
      )
    }
  }

  const rejectedTemplate = (rowData: any) => {
    if (rowData.rejected === 0) {
      return <div className={classes.rejectEror}>{rowData.rejected}</div>
    } else {
      return (
        <div
          className={classes.rejectSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MYTASKREJECTED}`)
          }}
        >
          {rowData.rejected}
        </div>
      )
    }
  }
  const currentWeekTemplate = (rowData: any) => {
    if (rowData.currentWeek === 0) {
      return <div className={classes.weekEror}>{rowData.currentWeek}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(
              `${DEFAULT}${DASHBOARD_RANGE_PENDINGACTION_CURRENT_WEEK}`
            )
          }}
        >
          {rowData.currentWeek}
        </div>
      )
    }
  }
  const nextWeekTemplate = (rowData: any) => {
    if (rowData.nextWeek === 0) {
      return <div className={classes.weekEror}>{rowData.nextWeek}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_PENDINGACTION_NEXT_WEEK}`)
          }}
        >
          {rowData.nextWeek}
        </div>
      )
    }
  }
  const weekTwoToFiveTemplate = (rowData: any) => {
    if (rowData.weekTwoToFive === 0) {
      return <div className={classes.weekEror}>{rowData.weekTwoToFive}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(
              `${DEFAULT}${DASHBOARD_RANGE_PENDINGACTION_WEEK2_TO_WEEK5}`
            )
          }}
        >
          {rowData.weekTwoToFive}
        </div>
      )
    }
  }

  const weekMoreThanFiveTemplate = (rowData: any) => {
    if (rowData.weekMoreThanFive === 0) {
      return <div className={classes.weekEror}>{rowData.weekMoreThanFive}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_PENDINGACTION_WEEK5}`)
          }}
        >
          {rowData.weekMoreThanFive}
        </div>
      )
    }
  }

  const totalTemplate = (rowData: any) => {
    if (rowData.total === 0) {
      return <div className={classes.weekEror}>{rowData.total}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_PENDINGACTION}`)
          }}
        >
          {rowData.total}
        </div>
      )
    }
  }

  const missedTemplate1 = (rowData: any) => {
    console.log(rowData)
    if (rowData.missedOrOverdue === 0) {
      return <div className={classes.rejectEror}>{rowData.missedOrOverdue}</div>
    } else {
      return (
        <div
          className={classes.rejectSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MYGROUPTASK_MISSED}`)
          }}
        >
          {rowData.missedOrOverdue}
        </div>
      )
    }
  }

  const rejectedTemplate1 = (rowData: any) => {
    if (rowData.rejected === 0) {
      return <div className={classes.rejectEror}>{rowData.rejected}</div>
    } else {
      return (
        <div
          className={classes.rejectSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MYGROUPTASKREJECTED}`)
          }}
        >
          {rowData.rejected}
        </div>
      )
    }
  }
  const currentWeekTemplate1 = (rowData: any) => {
    if (rowData.currentWeek === 0) {
      return <div className={classes.weekEror}>{rowData.currentWeek}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MYGROUP_CURRENT_WEEK}`)
          }}
        >
          {rowData.currentWeek}
        </div>
      )
    }
  }
  const nextWeekTemplate1 = (rowData: any) => {
    if (rowData.nextWeek === 0) {
      return <div className={classes.weekEror}>{rowData.nextWeek}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MYGROUP_NEXT_WEEK}`)
          }}
        >
          {rowData.nextWeek}
        </div>
      )
    }
  }
  const weekTwoToFiveTemplate1 = (rowData: any) => {
    if (rowData.weekTwoToFive === 0) {
      return <div className={classes.weekEror}>{rowData.weekTwoToFive}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MYGROUP_WEEK2_TO_WEEK5}`)
          }}
        >
          {rowData.weekTwoToFive}
        </div>
      )
    }
  }

  const weekMoreThanFiveTemplate1 = (rowData: any) => {
    if (rowData.weekMoreThanFive === 0) {
      return <div className={classes.weekEror}>{rowData.weekMoreThanFive}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MYGROUP_WEEK5}`)
          }}
        >
          {rowData.weekMoreThanFive}
        </div>
      )
    }
  }

  const totalTemplate1 = (rowData: any) => {
    if (rowData.total === 0) {
      return <div className={classes.weekEror}>{rowData.total}</div>
    } else {
      return (
        <div
          className={classes.weekSuccess}
          onClick={() => {
            history.push(`${DEFAULT}${DASHBOARD_RANGE_MYGROUPPENDINGTASKS}`)
          }}
        >
          {rowData.total}
        </div>
      )
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* <LoadingComponent showLoader={isProgressLoader} /> */}
      <Typography variant="h6" color="primary" className={classes.tabHead}>
        Task Dashboard{' '}
        <Tooltip
          title={ServiceResponse.getMessage('dashboard', 'task')}
          classes={{ tooltip: classes.wide }}
          placement={!active ? 'right-start' : 'bottom'}
        >
          <IconButton>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <Grid container>
        {newMap &&
          newMap.length > 0 &&
          newMap.map((dash, index) => {
            if (dash.value !== 'rangechangemanagement') {
              return (
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12} key={index}>
                  <Card className={classes.card}>
                    <CardHeader
                      className="dashbordHeading"
                      title={dash.title}
                      //className={classes.header}
                      titleTypographyProps={{ variant: 'body1' }}
                    />
                    <CardContent style={{ height: !active ? '424px' : '100%' }}>
                      <Grid
                        container
                        spacing={2}
                        style={{ height: '100%', alignItems: 'normal' }}
                      >
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <table
                            cellSpacing={5}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              height: '100%',
                            }}
                          >
                            <tbody>
                              <tr>
                                <th>
                                  <Typography variant="body1" color="primary">
                                    My Task{' '}
                                    <span className="rightArrow">{'⭆'}</span>
                                  </Typography>
                                </th>
                              </tr>
                              <tr>
                                <td>
                                  <Typography variant="body2" color="primary">
                                    &#8226; Pending
                                  </Typography>
                                </td>

                                <td>
                                  <Typography
                                    variant="body2"
                                    color={
                                      dash.my.pendingActions > 0
                                        ? 'primary'
                                        : 'secondary'
                                    }
                                  >
                                    <Link
                                      to={
                                        dash.my.pendingActions > 0
                                          ? dash.my.pendingActionURL
                                          : '#'
                                      }
                                    >
                                      {' '}
                                      {dash.my.pendingActions}
                                    </Link>
                                  </Typography>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <Typography variant="body2" color="primary">
                                    &#8226; Requested
                                  </Typography>
                                </td>

                                <td>
                                  <Typography
                                    variant="body2"
                                    color={
                                      dash.my.inProgressTask > 0
                                        ? 'primary'
                                        : 'secondary'
                                    }
                                  >
                                    <Link
                                      to={
                                        dash.my.inProgressTask > 0
                                          ? dash.my.inProgressTaskURL
                                          : '#'
                                      }
                                    >
                                      {dash.my.inProgressTask}
                                    </Link>
                                  </Typography>
                                </td>
                              </tr>

                              <tr>
                                <td colSpan={2}>
                                  <Divider />
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <Typography variant="body1" color="primary">
                                    Group Task{' '}
                                    <span className="rightArrow">{'⭆'}</span>
                                  </Typography>
                                </th>
                              </tr>

                              <tr>
                                <td>
                                  <Typography variant="body2" color="primary">
                                    &#8226; Pending
                                  </Typography>
                                </td>

                                <td>
                                  <Typography
                                    variant="body2"
                                    color={
                                      dash.myGroup.pendingActions > 0
                                        ? 'primary'
                                        : 'secondary'
                                    }
                                  >
                                    <Link
                                      to={
                                        dash.myGroup.pendingActions > 0
                                          ? dash.myGroup.myGrouppendingActionURL
                                          : '#'
                                      }
                                    >
                                      {dash.myGroup.pendingActions}
                                    </Link>
                                  </Typography>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <Typography variant="body2" color="primary">
                                    &#8226; Unassigned
                                  </Typography>
                                </td>

                                <td>
                                  <Typography
                                    variant="body2"
                                    color={
                                      dash.myGroup.inProgressTask > 0
                                        ? 'primary'
                                        : 'secondary'
                                    }
                                  >
                                    <Link
                                      to={
                                        dash.myGroup.inProgressTask > 0
                                          ? dash.myGroup
                                              .myGroupInprogressTaskURL
                                          : '#'
                                      }
                                    >
                                      {dash.myGroup.inProgressTask}
                                    </Link>
                                  </Typography>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )
            } else {
              return (
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12} key={index}>
                  <Card className={classes.card}>
                    <CardHeader
                      className="dashbordHeading"
                      title={dash.title}
                      //className={classes.header}
                      titleTypographyProps={{ variant: 'body1' }}
                    />
                    <CardContent style={{ height: !active ? '424px' : '100%' }}>
                      <Grid
                        container
                        spacing={2}
                        style={{ height: '100%', alignItems: 'normal' }}
                      >
                        <Grid
                          item
                          container
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          spacing={1}
                        >
                          <Grid item xs={4} />
                          <Grid item xs={7} style={{ textAlign: 'center' }}>
                            <Typography color="primary" variant="body2">
                              <b>Last 3 Months</b>
                            </Typography>
                          </Grid>
                          <Grid item xs={1} />
                          <Grid item xs={4}>
                            <Typography color="primary" variant="body2">
                              Ontime Completion
                            </Typography>
                          </Grid>
                          <Grid item xs={7}>
                            <ProgressBar
                              // value={parseInt(dash.statuscompleteval)}
                              value={ontimeCompletion}
                              showValue={false}
                              className={classes.progressBar}
                              // color={
                              //   parseInt(dash.statuscompleteval) < 90
                              //     ? parseInt(dash.statuscompleteval) >= 60
                              //       ? theme.palette.warning.main
                              //       : theme.palette.error.main
                              //     : theme.palette.primary.main
                              // }
                              color={
                                ontimeCompletion < 90
                                  ? ontimeCompletion >= 60
                                    ? theme.palette.warning.main
                                    : theme.palette.error.main
                                  : theme.palette.primary.main
                              }
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <Typography color="primary" variant="body2">
                              {ontimeCompletion}%
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          spacing={2}
                        >
                          <Divider />
                        </Grid>
                        <Grid
                          item
                          container
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          spacing={2}
                        >
                          {/* <Grid
                            item
                            container
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            spacing={2}
                          >
                            <Grid item xs={2}>
                              <button
                                style={{
                                  backgroundColor:
                                    tabValue === 0
                                      ? theme.palette.primary.main
                                      : 'lightgrey',
                                  color: tabValue === 0 ? 'white' : 'inherit',
                                  padding: '10px',
                                }}
                                onClick={() => setTabValue(0)}
                              >
                                My Tasks
                              </button>
                            </Grid>
                            <Grid item xs={3}>
                              <button
                                style={{
                                  backgroundColor:
                                    tabValue === 1
                                      ? theme.palette.primary.main
                                      : 'lightgrey',
                                  color: tabValue === 1 ? 'white' : 'inherit',
                                  padding: '10px',
                                }}
                                onClick={() => setTabValue(1)}
                              >
                                Group Tasks
                              </button>
                            </Grid>

                            <Grid item xs={7}></Grid>
                          </Grid> */}
                          {/* <Divider
                            style={{ color: 'primary' }}
                            variant="fullWidth"
                          /> */}
                          <Tabs
                            value={tabValue}
                            textColor="primary"
                            indicatorColor="primary"
                            onChange={(event, newValue) => {
                              setTabValue(newValue)
                            }}
                            variant="fullWidth"
                            // style={{ width: '100%' }}
                            scrollButtons="auto"
                          >
                            <Tab
                              // label="My Task"
                              label={
                                <Button
                                  variant={
                                    tabValue === 0 ? 'contained' : 'text'
                                  }
                                  color="primary"
                                  className={classes.tabButton}
                                >
                                  My Tasks
                                </Button>
                              }
                              value={0}
                              wrapped
                              classes={{ root: classes.rootTab }}
                            />
                            <Tab
                              // label="Group Tasks"
                              label={
                                <Button
                                  variant={
                                    tabValue === 1 ? 'contained' : 'text'
                                  }
                                  color="primary"
                                  className={classes.tabButton}
                                >
                                  Group Tasks
                                </Button>
                              }
                              value={1}
                              wrapped
                              classes={{ root: classes.rootTab }}
                            />
                          </Tabs>
                          {tabValue === 0 && (
                            <Box sx={{ p: 2 }}>
                              <Typography color="primary" variant="body2">
                                Pending Due Date
                              </Typography>
                              <DataTable
                                value={table1Data}
                                showGridlines
                                // scrollable
                                scrollHeight="flex"
                                //overflow="hidden"
                              >
                                {myFirstTableCols.map(
                                  (col: any, index: any) => {
                                    return (
                                      <Column
                                        key={index}
                                        field={col.field}
                                        header={col.header}
                                        body={
                                          (col.field === 'missedOrOverdue' &&
                                            missedTemplate) ||
                                          (col.field === 'rejected' &&
                                            rejectedTemplate)
                                        }
                                        bodyStyle={{
                                          fontSize: '12px',
                                          padding: '8px',
                                          // height: '43px',
                                          overflowX: 'auto',
                                          color: theme.palette.error.main,
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                        }}
                                        headerStyle={{
                                          color: 'white',
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          // fontSize: '0.9rem',
                                          fontSize: '12px',
                                          padding: '8px',
                                          height: 'auto',
                                          textAlign: 'center',
                                        }}
                                      />
                                    )
                                  }
                                )}
                              </DataTable>

                              <DataTable
                                value={table1Data}
                                showGridlines
                                //scrollable
                                scrollHeight="flex"
                                emptyMessage="No Events found."
                                className="p-datatable-sm"
                                //overflow="hidden"
                              >
                                {mySecondTableCols.map(
                                  (col: any, index: any) => {
                                    return (
                                      <Column
                                        key={index}
                                        field={col.field}
                                        header={col.header}
                                        body={
                                          (col.field === 'currentWeek' &&
                                            currentWeekTemplate) ||
                                          (col.field === 'nextWeek' &&
                                            nextWeekTemplate) ||
                                          (col.field === 'weekTwoToFive' &&
                                            weekTwoToFiveTemplate) ||
                                          (col.field === 'weekMoreThanFive' &&
                                            weekMoreThanFiveTemplate) ||
                                          (col.field === 'total' &&
                                            totalTemplate)
                                        }
                                        bodyStyle={{
                                          fontSize: '12px',
                                          padding: '8px',
                                          overflowX: 'auto',
                                          // color: theme.palette.error.main,
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                          // width: col.width,
                                        }}
                                        // style={{ width: col.minWidth }}
                                        headerStyle={{
                                          color: 'white',
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          // fontSize: '0.9rem',
                                          // width: col.width,
                                          fontSize: '12px',
                                          padding: '8px',
                                          height: 'auto',
                                          textAlign: 'center',
                                        }}
                                      />
                                    )
                                  }
                                )}
                              </DataTable>
                            </Box>
                          )}
                          {tabValue === 1 && (
                            <Box sx={{ p: 2 }}>
                              <Typography color="primary" variant="body2">
                                Pending Due Date
                              </Typography>
                              <DataTable
                                value={table2Data}
                                showGridlines
                                // scrollable
                                scrollHeight="flex"
                                //overflow="hidden"
                              >
                                {myFirstTableCols.map(
                                  (col: any, index: any) => {
                                    return (
                                      <Column
                                        key={index}
                                        field={col.field}
                                        header={col.header}
                                        body={
                                          (col.field === 'missedOrOverdue' &&
                                            missedTemplate1) ||
                                          (col.field === 'rejected' &&
                                            rejectedTemplate1)
                                        }
                                        bodyStyle={{
                                          fontSize: '12px',
                                          padding: '8px',
                                          // height: '43px',
                                          overflowX: 'auto',
                                          color: theme.palette.error.main,
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                          // width: col.minWidth,
                                        }}
                                        headerStyle={{
                                          color: 'white',
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          // fontSize: '0.9rem',
                                          fontSize: '12px',
                                          padding: '8px',
                                          height: 'auto',
                                          textAlign: 'center',
                                          // width: col.minWidth,
                                        }}
                                      />
                                    )
                                  }
                                )}
                              </DataTable>

                              <DataTable
                                value={table2Data}
                                showGridlines
                                // scrollable
                                scrollHeight="flex"
                                emptyMessage="No Events found."
                                className="p-datatable-sm"
                              >
                                {mySecondTableCols.map(
                                  (col: any, index: any) => {
                                    return (
                                      <Column
                                        key={index}
                                        field={col.field}
                                        header={col.header}
                                        body={
                                          (col.field === 'currentWeek' &&
                                            currentWeekTemplate1) ||
                                          (col.field === 'nextWeek' &&
                                            nextWeekTemplate1) ||
                                          (col.field === 'weekTwoToFive' &&
                                            weekTwoToFiveTemplate1) ||
                                          (col.field === 'weekMoreThanFive' &&
                                            weekMoreThanFiveTemplate1) ||
                                          (col.field === 'total' &&
                                            totalTemplate1)
                                        }
                                        bodyStyle={{
                                          fontSize: '12px',
                                          padding: '8px',
                                          // height: '43px',
                                          overflowX: 'auto',
                                          // color: theme.palette.error.main,
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                          // width: col.width,
                                        }}
                                        headerStyle={{
                                          color: 'white',
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          // fontSize: '0.9rem',
                                          fontSize: '12px',
                                          padding: '8px',
                                          height: 'auto',
                                          textAlign: 'center',
                                          // width: col.width,
                                        }}
                                      />
                                    )
                                  }
                                )}
                              </DataTable>
                            </Box>
                          )}

                          {/* <TabView activeIndex={0} style={{ width: '100%' }}>
                            <TabPanel
                              header="My Task"
                              // headerTemplate={headerTemplate}
                              headerStyle={{
                                color: 'primary',
                                borderColor: 'primary',
                              }}
                            >
                              <Typography color="primary" variant="body2">
                                Pending Due Date
                              </Typography>
                              <DataTable value={table1Data} showGridlines>
                                {myFirstTableCols.map(
                                  (col: any, index: any) => {
                                    return (
                                      <Column
                                        key={index}
                                        field={col.field}
                                        header={col.header}
                                        // body={
                                        //   (col.field === 'missedOrOverdue' &&
                                        //     missedTemplate) ||
                                        //   (col.field === 'rejected' &&
                                        //     rejectedTemplate)
                                        // }
                                        bodyStyle={{
                                          fontSize: '12px',
                                          padding: '8px',
                                          // height: '43px',
                                          overflowX: 'auto',
                                          color: theme.palette.error.main,
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                        }}
                                        headerStyle={{
                                          color: 'white',
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          // fontSize: '0.9rem',
                                          fontSize: '12px',
                                          padding: '8px',
                                          height: 'auto',
                                          textAlign: 'center',
                                        }}
                                      />
                                    )
                                  }
                                )}
                              </DataTable>

                              <DataTable value={table1Data} showGridlines>
                                {mySecondTableCols.map(
                                  (col: any, index: any) => {
                                    return (
                                      <Column
                                        key={index}
                                        field={col.field}
                                        header={col.header}
                                        // body={
                                        //   (col.field === 'missedOrOverdue' &&
                                        //     missedTemplate) ||
                                        //   (col.field === 'rejected' &&
                                        //     rejectedTemplate)
                                        // }
                                        bodyStyle={{
                                          fontSize: '12px',
                                          padding: '8px',
                                          // height: '43px',
                                          overflowX: 'auto',
                                          // color: theme.palette.error.main,
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                        }}
                                        headerStyle={{
                                          color: 'white',
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          // fontSize: '0.9rem',
                                          fontSize: '12px',
                                          padding: '8px',
                                          height: 'auto',
                                          textAlign: 'center',
                                        }}
                                      />
                                    )
                                  }
                                )}
                              </DataTable>
                            </TabPanel>

                            <TabPanel
                              header="Group Task"
                              headerStyle={{
                                color: 'primary',
                                borderColor: 'primary',
                              }}
                            >
                              <Typography color="primary" variant="body2">
                                Group Tasks
                              </Typography>
                              <DataTable value={table2Data} showGridlines>
                                {myFirstTableCols.map(
                                  (col: any, index: any) => {
                                    return (
                                      <Column
                                        key={index}
                                        field={col.field}
                                        header={col.header}
                                        // body={
                                        //   (col.field === 'missedOrOverdue' &&
                                        //     missedTemplate) ||
                                        //   (col.field === 'rejected' &&
                                        //     rejectedTemplate)
                                        // }
                                        bodyStyle={{
                                          fontSize: '12px',
                                          padding: '8px',
                                          // height: '43px',
                                          overflowX: 'auto',
                                          color: theme.palette.error.main,
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                        }}
                                        headerStyle={{
                                          color: 'white',
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          // fontSize: '0.9rem',
                                          fontSize: '12px',
                                          padding: '8px',
                                          height: 'auto',
                                          textAlign: 'center',
                                        }}
                                      />
                                    )
                                  }
                                )}
                              </DataTable>

                              <DataTable value={table2Data} showGridlines>
                                {mySecondTableCols.map(
                                  (col: any, index: any) => {
                                    return (
                                      <Column
                                        key={index}
                                        field={col.field}
                                        header={col.header}
                                        // body={
                                        //   (col.field === 'missedOrOverdue' &&
                                        //     missedTemplate) ||
                                        //   (col.field === 'rejected' &&
                                        //     rejectedTemplate)
                                        // }
                                        bodyStyle={{
                                          fontSize: '12px',
                                          padding: '8px',
                                          // height: '43px',
                                          overflowX: 'auto',
                                          // color: theme.palette.error.main,
                                          textAlign: 'center',
                                          fontWeight: 'bold',
                                        }}
                                        headerStyle={{
                                          color: 'white',
                                          backgroundColor:
                                            theme.palette.primary.main,
                                          // fontSize: '0.9rem',
                                          fontSize: '12px',
                                          padding: '8px',
                                          height: 'auto',
                                          textAlign: 'center',
                                        }}
                                      />
                                    )
                                  }
                                )}
                              </DataTable>
                            </TabPanel>
                          </TabView> */}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )
            }
          })}
      </Grid>
      <div>V-1.0.25</div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    mypendingAction: state.pendingActionReducer.mypendingAction,
    myinprogressTasks: state.pendingActionReducer.myinprogressTasks,
    mygroupPendingAction: state.pendingActionReducer.mygroupPendingAction,
    mygroupUnassignTasks: state.pendingActionReducer.mygroupUnassignTasks,
    eventPendingAction: state.pendingActionReducer.eventPendingAction,
    eventGroupPendingAction: state.pendingActionReducer.eventGroupPendingAction,
    userDetail: state.loginReducer.userDetail,
  }
}

const matchDispatchToProps = (dispatch: any) => {
  return {
    set_mypendingAction: (pendingTasks: any) =>
      dispatch(set_mypendingAction(pendingTasks)),
    set_myinprogressAction: (inprogressTasks: any) =>
      dispatch(set_myinprogressAction(inprogressTasks)),
    set_mygrouppendingAction: (mygroupPendingTasks: any) =>
      dispatch(set_mygrouppendingAction(mygroupPendingTasks)),
    set_mygroupunassignAction: (mygroupUnassignTasks: any) =>
      dispatch(set_mygroupunassignAction(mygroupUnassignTasks)),
    set_range_pendingAction: (rangePendingTasks: any) =>
      dispatch(set_range_pendingAction(rangePendingTasks)),
    set_range_grouppendingAction: (rangeGroupPendingTasks: any) =>
      dispatch(set_range_grouppendingAction(rangeGroupPendingTasks)),
    reset_all: () => dispatch(reset_all()),
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(Dashboard1)
