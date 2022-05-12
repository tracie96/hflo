const express = require('express')
const PeriodTrackerController = require('../controller/period_controller')

const router = express.Router()



// router.route('/ovulation-info').get(PeriodTrackerController.getOvulationTrackerInfo)
router.route('/cycle-info').get(PeriodTrackerController.getCycleInfo)

module.exports = router
