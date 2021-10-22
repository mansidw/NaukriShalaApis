'use strict';
const express = require('express')
const cors = require('cors');
const app = express()
const firebase = require('./db')
const firestore = firebase.firestore();
const request = require('request');
const cheerio = require("cheerio");
const config = require('./config');
const jobRoutes = require('./routes/job-routes');

const state = 'maharashtra'
app.use(express.json());
app.use(cors());

app.use('/api', jobRoutes.routes);

app.get('/getJobs', async (req, res) =>
    request(`https://www.freejobalert.com/${state}-government-jobs/`, function (error, response, body) {
        if (error) {
            res.send(response.statusCode);
        }
        var job = [];
        var $ = cheerio.load(body);
        $('tr[class=lattrbord]').each(async function (index, element) {
            job[index] = {};
            job[index]['postDate'] = $(element).find('td:nth-child(1)').text().trim();
            job[index]['recruitmentBoard'] = $(element).find('td:nth-child(2)').text().trim();
            job[index]['postName'] = $(element).find('td:nth-child(3)').text().trim();
            job[index]['qualification'] = $(element).find('td:nth-child(4)').text().trim();
            job[index]['advtNo'] = $(element).find('td:nth-child(5)').text().trim();
            job[index]['lastDate'] = $(element).find('td:nth-child(6)').text().trim();
            await firestore.collection('jobs').doc().set(job[index]);
        });

        res.json(job);
    })


)

app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))