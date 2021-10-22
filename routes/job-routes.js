const express = require('express');
const {addJob, 
       getAllJobs, 
       getJob,
       updateJob,
       deleteJob
      } = require('../controllers/jobController');

const router = express.Router();

router.post('/job', addJob);
router.get('/jobs', getAllJobs);
router.get('/job/:postName', getJob);
router.put('/job/:postName', updateJob);
router.delete('/job/:date', deleteJob);


module.exports = {
    routes: router
}