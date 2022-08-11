import {
  Grid,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  styled,
  Dialog,
} from '@material-ui/core'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { teal } from '@material-ui/core/colors'
import { useStyles } from './Styles'
import { Toast } from 'primereact/toast'
import { pendingActionDetails, rejectedTableHeaders } from './tableHeader'
// import { reset_mygroupunassignAction } from '../../../redux/Actions/PendingAction'
import { routes, life } from '../../../util/Constants'
import {
  putClaimTaskAPI,
  getAllActiveUsersAPI,
  claimEventsCamunda,
  postFileAttachmentRangeResetAPI,
  getStatusEventCamundaAPINew,
  getUserGroupAPIWithGroupId,
} from '../../../api/Fetch'
import LoadingComponent from '../../../components/LoadingComponent/LoadingComponent'
import { allMessages } from '../../../util//Messages'
import DialogHeader from '../../components/DialogHeader/DialogHeader'
import AutocompleteSelect from '../../components/AutoCompleteSelect/AutocompleteSelect'
import { reset_range_grouppendingAction } from '../../../redux/Actions/PendingAction/Action'

const Input = styled('input')({
  display: 'none',
})

function RcmGroupTaskMissed(props: any) {
  const {
    // reset_mygroupunassignAction,
    userDetail,
    reset_range_grouppendingAction,
    eventGroupPendingAction,
  } = props
  const { DEFAULT, DASHBOARD } = routes
  const theme = useTheme()
  const active = useMediaQuery(theme.breakpoints.down(700))
  const active1 = useMediaQuery(theme.breakpoints.between(370, 700))
  const classes = useStyles()
  const history = useHistory()
  const [globalFilter, setGlobalFilter] = useState('')
  const [unassignUser, setUnassignUser] = useState<any>([])
  const [checkCount, setCheckCount] = React.useState(1)
  const [failureCount, setFailureCount] = React.useState(0)
  const toast = useRef<any>(null)
  const [myPendingActions, setMyPendingActions] = useState([])
  //
  const [assigneeUsers, setAssigneeUsers] = useState([])
  const [userAssigned, setUserAssigned] = useState<any>()
  const [openAssignDialog, setOpenAssignDialog] = React.useState(false)
  const [isProgressLoader, setIsProgressLoader] = React.useState(false)
  const [uploadedFile, setUploadedFile] = useState<any>()
  const [comments, setComments] = useState('')
  //

  const goBack = () => {
    setUnassignUser([])
    reset_range_grouppendingAction()
    history.goBack()
  }

  useEffect(() => {
    return () => {
      reset_range_grouppendingAction()
    }
  }, [])

  const getProducrHierarchy = (userGroups: any) => {
    let productArray: any = []
    userGroups.forEach((groups: any) => {
      return groups.productHierarchy.forEach((product: any) => {
        productArray.push(product.hierarchyName.split(' > ')[1])
      })
    })
    let productArray1 = productArray.filter(
      (item: any, i: any, ar: any) => ar.indexOf(item) === i
    )
    // return productArray1.join()
    let productArray2 = encodeURIComponent(productArray1.join())
    console.log(productArray2)
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
    if (eventGroupPendingAction) {
      console.log(eventGroupPendingAction[0].tasks)
      // const userGroupId =
      //   userDetail.userdetails &&
      //   userDetail.userdetails[0].usergroups[0].groupId
      // console.log(userGroupId)
      // let userGroup =
      //   userDetail.userdetails &&
      //   userDetail.userdetails[0].usergroups[0].groupName.split('-')
      // console.log(userGroup)
      // let userGroup1 = userGroup[0].trim()
      // console.log(userGroup1)
      // setMyPendingActions(eventGroupPendingAction[0].tasks)
      const wholeGroupId = getGroupId(
        userDetail.userdetails && userDetail.userdetails[0].usergroups
      )
      console.log(wholeGroupId)
      const wholeRoleName = getRoleName(
        userDetail.userdetails && userDetail.userdetails[0].roles
      )
      console.log(wholeRoleName)
      wholeGroupId &&
        getUserGroupAPIWithGroupId &&
        getUserGroupAPIWithGroupId(wholeGroupId).then((res1) => {
          console.log('in')
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
                'myGroupMissedTasks'
              ).then((res: any) => {
                let groupPendingDetails = res.data
                // console.log(
                //   groupPendingDetails.status.filter(
                //     (item: any) => item.details === 'myGroupPendingTasks'
                //   )[0].tasks
                // )
                setMyPendingActions(
                  groupPendingDetails.status.filter(
                    (item: any) => item.details === 'myGroupMissedTasks'
                  )[0].tasks
                )
              })
          } else {
            // wholeTradeGroup &&
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
                'myGroupMissedTasks'
              ).then((res: any) => {
                let groupPendingDetails = res.data
                // console.log(
                //   groupPendingDetails.status.filter(
                //     (item: any) => item.details === 'myGroupPendingTasks'
                //   )[0].tasks
                // )
                setMyPendingActions(
                  groupPendingDetails.status.filter(
                    (item: any) => item.details === 'myGroupMissedTasks'
                  )[0].tasks
                )
              })
          }
        })
    } else {
      history.push(`${DEFAULT}${DASHBOARD}`)
    }
  }, [])

  return (
    <>
      <Toast
        ref={toast}
        position="bottom-left"
        onRemove={() => {
          history.push(`${DEFAULT}${DASHBOARD}`)
        }}
      />
      <div className="manageUser">
        <div className="manageRequest">
          <div className={classes.root}>
            <div className={classes.value}>
              <Grid container className={classes.container}>
                <Grid item sm={12} xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: active ? 'column' : 'row',
                      justifyContent: 'space-between',
                      p: 2,
                      width: '100%',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexGrow: 1,
                      }}
                    >
                      <Typography variant="h6">
                        Group Task {'>'} Missed or Over Due
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: active
                          ? active1
                            ? 'row'
                            : 'column'
                          : 'row',
                        alignItems: 'start',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                        }}
                      >
                        <input
                          type="text"
                          value={globalFilter}
                          onChange={(e) => setGlobalFilter(e.target.value)}
                          placeholder={' Search details here '}
                          style={{
                            width: '200px',
                          }}
                        />
                      </Box>
                      <Box
                        // sx={{
                        //   paddingLeft: 20,
                        // }}
                        sx={{
                          paddingLeft: !active ? 20 : 0,
                          paddingTop: active && !active1 && '10px',
                          width: '100%',
                          textAlign: active1 ? 'end' : 'start',
                        }}
                      >
                        <button
                          //className={classes.backButton}
                          className="backButton"
                          onClick={goBack}
                          type="button"
                        >
                          <svg
                            className="MuiSvgIcon-root"
                            focusable="false"
                            viewBox="0 0 34 34"
                            aria-hidden="true"
                          >
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                          </svg>
                          Back
                        </button>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                    }}
                  >
                    {/* {!active ? ( */}
                    <DataTable
                      value={myPendingActions}
                      rowHover
                      paginator
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                      currentPageReportTemplate="{first} - {last} of {totalRecords}"
                      stateStorage="session"
                      stateKey="dt-state-demo-session-unassignworkflow"
                      rows={10}
                      style={{
                        width: '100%',
                      }}
                      selection={unassignUser}
                      onSelectionChange={(e) => {
                        console.log(e.value)
                        setUnassignUser(e.value)
                      }}
                      scrollable
                      scrollHeight="flex"
                      globalFilter={globalFilter}
                      emptyMessage="No users found."
                      showGridlines
                      //loading={manageUserLoading}
                    >
                      {rejectedTableHeaders.map((column) => {
                        return (
                          <Column
                            key={column.field}
                            field={column.field}
                            header={column.headerName}
                            bodyStyle={{
                              fontSize: '12px',
                              width: column.width,
                              overflowX: 'auto',
                            }}
                            headerStyle={{
                              fontSize: '12px',
                              width: column.width,
                              backgroundColor: teal[900],
                              color: 'white',
                            }}
                            // body={
                            //   column.field === 'requestedId' && requestIdTemplate
                            // }
                            sortable
                          />
                        )
                      })}
                    </DataTable>
                  </Box>
                  {/* <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'right',
                      p: 2,
                      width: '100%',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      // type="submit"
                      // size="small"
                      // onClick={handleAssign}
                      onClick={() => unassignUser && setOpenAssignDialog(true)}
                    >
                      Assign to Other
                    </Button>
                  </Box> */}
                </Grid>
              </Grid>
              <LoadingComponent showLoader={isProgressLoader} />
            </div>
          </div>
        </div>
      </div>
      {/* {assignToOtherDialog} */}
    </>
  )
}
const mapStateToProps = (state: any) => {
  return {
    eventGroupPendingAction: state.pendingActionReducer.eventGroupPendingAction,
    userDetail: state.loginReducer.userDetail,
  }
}
const matchDispatchToProps = (dispatch: any) => {
  return {
    reset_range_grouppendingAction: () =>
      dispatch(reset_range_grouppendingAction()),
  }
}
// export default connect(mapStateToProps, matchDispatchToProps)(RcmPendingActions)
export default connect(
  mapStateToProps,
  matchDispatchToProps
)(RcmGroupTaskMissed)
