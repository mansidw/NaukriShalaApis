'use strict';

const firebase = require('../db');
const Job = require('../models/job');
const firestore = firebase.firestore();

// const clearDatabase = async(req,res,next) =>{
//     try{
        
//     }catch(error){
//         res.status(400).send(error.message);
//     }
// }

const addJob = async (req, res, next) => {
    try {
        const data = req.body;
        const doc = await firestore.collection('jobs').add(data);
        await res.send('Record saved successfuly with doc id :'+doc.id);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await firestore.collection('jobs');
        const data = await jobs.get();
        const jobArray = [];
        if(data.empty) {
            res.status(404).send('No jobs found');
        }else {
            data.forEach(doc => {
                const job = new Job(
                    doc.data().postDate,
                    doc.data().recruitmentBoard,
                    doc.data().postName,
                    doc.data().qualification,
                    doc.data().advtNo,
                    doc.data().lastDate
                );
                jobArray.push(job);
            });
            res.send(jobArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getJob = async (req, res, next) => {
    try {
        const postName = req.params.postName;
        const jobArray = [];
        const db = firestore.collection('jobs');
        const job = await db.where('postName', '==', postName).get();
        if (job.empty) {
            console.log('No matching documents.');
            res.status(404).send('Job with given name not found '+ postName);
        }  
        else{
            job.forEach(doc => {
                const job = new Job(
                    doc.data().postDate,
                    doc.data().recruitmentBoard,
                    doc.data().postName,
                    doc.data().qualification,
                    doc.data().advtNo,
                    doc.data().lastDate
                );
                jobArray.push(job);
            });
            res.send(jobArray);
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateJob = async (req, res, next) => {
    try {
        const data = req.body;
        const idArray = []
        const postName = req.params.postName;
        const db = firestore.collection('jobs');
        const job = await db.where('postName', '==', postName).get();
        if (job.empty) {
            console.log('No matching documents.');
            res.status(404).send('Job with given name not found '+ postName);
        }  
        else{
            job.forEach(doc => {
                idArray.push(doc.id);
            });
        }
        const upJob = await firestore.collection('jobs').doc(idArray[0])
        await firestore.runTransaction(async (t) => {
        t.update(upJob, data);
        });
        res.send('Record updated successfuly');
      } catch (e) {
        res.status(400).send(e.message);
      }
}

const deleteJob = async (req, res, next) => {
    try {
        const date = req.params.date;
        const idArray = [];
        const db = firestore.collection('jobs');
        const job = await db.where('lastDate', '==', date).get();
        if (job.empty) {
            console.log('No matching documents.');
            res.status(404).send('Job with given last date not found '+ date);
        }  
        else{
            job.forEach(doc => {
                idArray.push(doc.id)
            });
        }
        
        await firestore.collection('jobs').doc(idArray[0]).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addJob,
    getAllJobs,
    getJob,
    updateJob,
    deleteJob
}