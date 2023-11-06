const appointment = require('../models/Appointment')
const mongoose = require('mongoose')
const AppointmentFactory = require ('../factories/AppointmentFactory')

const Appo = mongoose.model("Appointment", appointment)

class AppointmentService {

    async Create(name, email, description, cpf, date, time){
        let newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false
        })
        try {
            await newAppo.save()
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async GetAll(showFinished){
        if (showFinished) {
            return await Appo.find()
        } else {
            let appos = await Appo.find({'finished': false})

            let appointments =[]

            appos.forEach(appointment => {
                appointments.push(AppointmentFactory.Build(appointment))
            })

            return appointments
        }
    }

    async GetById(id){
        try {
            let event = Appo.findOne({'_id': id})
            return event
        } catch (error) {
            console.log(error)
        }
    }

    async Finish(id){
        try {
            await Appo.findByIdAndUpdate(id, {finished:true})
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async Search(query){
        try {
            let result = await Appo.find().or([{email:query},{cpf:query}])
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }

}

module.exports = new AppointmentService()