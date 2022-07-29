import { Divider, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import RcmMyTaskMissed from '../../sections/RcmMyTaskMissed/RcmMyTaskMissed'
import RcmMyTaskRejected from '../../sections/RcmMyTaskRejected/RcmMyTaskRejected'
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

function RangeChangeMyTaskMissed() {
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
        <RcmMyTaskMissed />
      </div>
    </div>
  )
}
export default RangeChangeMyTaskMissed
