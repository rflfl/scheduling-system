const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const appointmentService = require('./services/AppointmentService')
const AppointmentService = require('./services/AppointmentService')

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

mongoose.connect("mongodb://localhost:27017/scheduling")

app.get("/", (req, res)=>{
    res.render('index')
})

app.get('/cadastro', (req,res)=>{
    res.render('create');
})

app.post('/create', async (req,res)=>{
    let status = await appointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.cpf,
        req.body.date,
        req.body.time
        )

        if (status) {
            res.redirect("/")
        } else {
            res.send("Ocorreu um problema para cadsatrar")
        }
})

app.get("/getcalendar", async (req,res)=>{
    let result = await AppointmentService.GetAll(false)
    res.json(result)
})

app.get('/event/:id', async (req, res) => {
    let appointment = await AppointmentService.GetById(req.params.id)
    res.render('event',{appo: appointment})
})

app.post("/finish", async (req,res)=>{
    let id = req.body.id
    let result = await AppointmentService.Finish(id)
    res.redirect("/")
})

app.get('/list', async (req,res)=>{
    let result = await AppointmentService.GetAll(true)
    res.render('list',{result})
})

app.get("/search", async (req,res)=>{
    let query = req.query.search
    let result = await AppointmentService.Search(query)
    res.render('list',{result})
})

let pollTime = 5000

setInterval(async ()=>{

    await AppointmentService.SendNotification()

}, pollTime)

app.listen(8000, () => { })
