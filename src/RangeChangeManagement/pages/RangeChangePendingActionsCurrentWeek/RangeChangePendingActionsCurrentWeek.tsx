import { Divider, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import RcmPendingActions from '../../sections/RcmPendingActions/RcmPendingActions'
import RcmPendingActionsCurrentWeek from '../../sections/RcmPendingActionsCurrentWeek/RcmPendingActionsCurrentWeek'
import RcmPendingActionsNextWeek from '../../sections/RcmPendingActionsNextWeek/RcmPendingActionsNextWeek'
import RcmPendingActionsWeek2toWeek5 from '../../sections/RcmPendingActionsWeek2toWeek5/RcmPendingActionsWeek2toWeek5'
import RcmPendingActionsWeek5 from '../../sections/RcmPendingActionsWeek5/RcmPendingActionsWeek5'
// import UnassignWorkflow from '../../sections/UnassignWorkflow/UnassignWorkflow'
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
  },
  value: {
    flex: 1,
  },
  container: {
    height: '100%',
  },
  tabHead: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    marginLeft: theme.spacing(2),
  },
}))

function RangeChangePendingActionsCurrentWeek() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div>
        <Typography variant="h6" color="primary" align="center">
          Commercial Web Application - Range Change Management
        </Typography>
        <Divider />
      </div>
      <div className={classes.value}>
        {/* <UnassignWorkflow /> */}
        <RcmPendingActionsCurrentWeek />
      </div>
    </div>
  )
}
export default RangeChangePendingActionsCurrentWeek
