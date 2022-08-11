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
import { pendingActionDetails, pendingActionTableHeaders } from './tableHeader'
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
import { allMessages } from '../../../util/Messages'
import DialogHeader from '../../components/DialogHeader/DialogHeader'
import AutocompleteSelect from '../../components/AutoCompleteSelect/AutocompleteSelect'
import { reset_range_grouppendingAction } from '../../../redux/Actions/PendingAction/Action'

const Input = styled('input')({
  display: 'none',
})

function RcmGroupPendingActionsWeek5(props: any) {
  const {
    // reset_mygroupunassignAction,
    eventGroupPendingAction,
    userDetail,
    reset_range_grouppendingAction,
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
                'myGroupWk5Tasks'
              ).then((res: any) => {
                let groupPendingDetails = res.data
                // console.log(
                //   groupPendingDetails.status.filter(
                //     (item: any) => item.details === 'myGroupPendingTasks'
                //   )[0].tasks
                // )
                setMyPendingActions(
                  groupPendingDetails.status.filter(
                    (item: any) => item.details === 'myGroupWk5Tasks'
                  )[0].tasks
                )
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
                'myGroupWk5Tasks'
              ).then((res: any) => {
                let groupPendingDetails = res.data
                // console.log(
                //   groupPendingDetails.status.filter(
                //     (item: any) => item.details === 'myGroupPendingTasks'
                //   )[0].tasks
                // )
                setMyPendingActions(
                  groupPendingDetails.status.filter(
                    (item: any) => item.details === 'myGroupWk5Tasks'
                  )[0].tasks
                )
              })
          }
        })
    } else {
      history.push(`${DEFAULT}${DASHBOARD}`)
    }
  }, [])

  useEffect(() => {
    getAllActiveUsersAPI().then((res: any) => {
      const userDetails = res.data.userdetails.map((val: any) => {
        return {
          email: val.user.emailId,
          label: val.user.middleName
            ? val.user.firstName + val.user.middleName + val.user.lastName
            : val.user.firstName + ' ' + val.user.lastName,
          value: val.user.emailId,
          userId: val.user.userId,
          roles: val.roles.map((role: any) => {
            return {
              roleId: role.roleName,
            }
          }),
        }
      })
      console.log(userDetails)
      setAssigneeUsers(userDetails)
    })
  }, [])

  const claimPayload = userAssigned && {
    requestorDetails: {
      emailId: userAssigned.email,
      requestBy: userAssigned.userId,
      requesterName: userAssigned.label,
      requestType: 'complete',
      requestDate: new Date().toISOString().split('T')[0],
    },
    requestorRoles: userAssigned.roles,
  }

  const handleAssignedUser = (e: any) => {
    if (e) {
      setUserAssigned(e)
      console.log(e)
    } else {
      setUserAssigned('')
    }
  }

  const handleAssignToOtherClose = () => {
    setOpenAssignDialog(false)
    setUserAssigned(null)
  }

  const handleAssignTask = () => {
    if (unassignUser) {
      setOpenAssignDialog(false)
      setIsProgressLoader(true)
      let taskId = unassignUser && unassignUser.taskId
      if (uploadedFile) {
        // setFailureCount(referenceDocData.length)
        // setCheckCount(referenceDocData.length)
        // referenceDocData.map((rf) => {
        const formdata1 = new FormData()
        // formdata1.append('fileIn', referenceDocData.data)
        formdata1.append('fileIn', uploadedFile)
        // formdata1.append('fileIn', rf.data)
        postFileAttachmentRangeResetAPI &&
          postFileAttachmentRangeResetAPI(formdata1, unassignUser.eventId)
            .then((res: any) => {
              console.log(res.data)
              claimEventsCamunda(taskId, claimPayload)
                .then((res: any) => {
                  console.log(res.data)
                  setIsProgressLoader(false)
                  toast.current.show({
                    severity: 'success',
                    summary: taskId,
                    detail: res.data.comments,
                    life: life,
                    className: 'login-toast',
                  })
                })
                .catch((err: any) => {
                  console.log(err)
                  setIsProgressLoader(false)
                  toast.current.show({
                    severity: 'error',
                    summary: 'Error!',
                    //detail: `${err.response.status} from tasklistapi`,
                    detail: err.response.data.errorMessage
                      ? err.response.data.errorMessage
                      : '',
                    life: life,
                    className: 'login-toast',
                  })
                })
            })
            .catch((err: any) => {
              console.log(err)
              toast.current.show({
                severity: 'error',
                summary: 'Error!',
                //detail: `${err.response.status} from tasklistapi`,
                detail: 'Error uploading file',
                life: life,
                className: 'login-toast',
              })
            })
        // })
      } else {
        claimEventsCamunda(taskId, claimPayload)
          .then((res: any) => {
            console.log(res.data)
            setIsProgressLoader(false)
            toast.current.show({
              severity: 'success',
              summary: taskId,
              detail: res.data.comments,
              life: life,
              className: 'login-toast',
            })
          })
          .catch((err: any) => {
            console.log(err)
            setIsProgressLoader(false)
            toast.current.show({
              severity: 'error',
              summary: 'Error!',
              //detail: `${err.response.status} from tasklistapi`,
              detail: err.response.data.errorMessage
                ? err.response.data.errorMessage
                : '',
              life: life,
              className: 'login-toast',
            })
          })
      }
    }
  }
  const handleFileUpload = (event: any) => {
    console.log(event.target.files[0])
    setUploadedFile(event.target.files[0])
  }

  const assignToOtherDialog = (
    <Dialog
      open={openAssignDialog}
      onClose={handleAssignToOtherClose}
      fullWidth
      classes={{
        paperFullWidth: classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? "600px" : "260px",
          // height: "250px",
          border: '3px solid green',
          borderRadius: 5,
          padding: '10px',
        }}
      >
        <DialogHeader
          title="Add placeholder Products"
          onClose={handleAssignToOtherClose}
        />
        {/* <Box sx={{ p: 3 }}> */}
        <Grid container spacing={2} style={{ padding: '10px' }}>
          <Grid item xs={12}>
            {/* <div> */}
            <Typography variant="body2" color="primary">
              Select User
            </Typography>
            <AutocompleteSelect
              value={userAssigned}
              options={assigneeUsers}
              onChange={handleAssignedUser}
              placeholder="Select User"
              // ref={focusResetType}
            />

            {/* </div> */}
          </Grid>
          <Grid item xs={12}>
            {/* <div> */}
            <Typography variant="body2" color="primary">
              Select Reason
              <br />
              {/* </div> */}
              {/* <div> */}
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
              >
                Browse...
              </button>
            </Typography>
            {/* </div> */}
          </Grid>
          <Grid item xs={12}>
            {/* <div> */}
            <Typography variant="body2" color="primary">
              Comments
              <br />
              <textarea
                rows={5}
                className={classes.comments}
                value={comments}
                onChange={(e: any) => setComments(e.target.value)}
              />
            </Typography>
            {/* </div> */}
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              // type="submit"
              variant="contained"
              color="primary"
              className={classes.dialogButton}
              disabled={!userAssigned}
              onClick={handleAssignTask}
            >
              Assign
            </Button>
          </Grid>
        </Grid>
        {/* </Box> */}
      </Box>
    </Dialog>
  )

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
                        Group Task {'>'} Greater Than week 5
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
                      {/* <Column
                        selectionMode="multiple"
                        headerStyle={{
                          width: '3em',
                          backgroundColor: teal[900],
                          color: 'white',
                        }}
                      ></Column> */}
                      {pendingActionTableHeaders.map((column) => {
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
                    {/* ) : (
                    <DataTable
                      value={myPendingActions}
                      rowHover
                      paginator
                      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                      currentPageReportTemplate="{first} - {last} of {totalRecords}"
                      stateStorage="session"
                      stateKey="dt-state-demo-session"
                      rows={10}
                      style={{
                        width: '100%',
                      }}
                      selection={unassignUser}
                      onSelectionChange={(e) => setUnassignUser(e.value)}
                      scrollable
                      scrollHeight="flex"
                      globalFilter={globalFilter}
                      emptyMessage="No users found."
                      showGridlines
                      //loading={manageUserLoading}
                    >
                      <Column
                        selectionMode="multiple"
                        headerStyle={{
                          width: '3em',
                          backgroundColor: teal[900],
                          color: 'white',
                        }}
                      ></Column>
                      {pendingActionTableHeaders.map((column) => {
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
                  )} */}
                  </Box>
                  <Box
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
                      disabled={true}
                    >
                      Assign to Other
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <LoadingComponent showLoader={isProgressLoader} />
            </div>
          </div>
        </div>
      </div>
      {assignToOtherDialog}
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
)(RcmGroupPendingActionsWeek5)
