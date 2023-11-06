const appointment = require('../models/Appointment')
const mongoose = require('mongoose')
const mailer = require('nodemailer')
const AppointmentFactory = require('../factories/AppointmentFactory')

const Appo = mongoose.model("Appointment", appointment)

class AppointmentService {

    async Create(name, email, description, cpf, date, time) {
        let newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        })
        try {
            await newAppo.save()
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async GetAll(showFinished) {
        if (showFinished) {
            return await Appo.find()
        } else {
            let appos = await Appo.find({ 'finished': false })

            let appointments = []

            appos.forEach(appointment => {
                appointments.push(AppointmentFactory.Build(appointment))
            })

            return appointments
        }
    }

    async GetById(id) {
        try {
            let event = Appo.findOne({ '_id': id })
            return event
        } catch (error) {
            console.log(error)
        }
    }

    async Finish(id) {
        try {
            await Appo.findByIdAndUpdate(id, { finished: true })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async Search(query) {
        try {
            let result = await Appo.find().or([{ email: query }, { cpf: query }])
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }

    async SendNotification() {
        let result = await this.GetAll(false)
        let transporter = mailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 465,
            auth: {
                user: '847bc5d6591fce',
                password: 'a3f7a8b836bfdf'
            }
        })
        result.forEach(async item => {
            let date = item.start.getTime()
            let hour = 1000 * 60 * 60 // 1 hora
            let gap = date - Date.now();
            if (gap <= hour) {
                if (!item.notified) {
                    await Appo.findByIdAndUpdate(item.id, { notified: true })
                    transporter.sendMail({
                        from: "Rafael Lemes <rafael@formacaonodejs.com>",
                        to: item.email,
                        subject: "Lembrete de Consulta!",
                        text: "Sua consulta irá acontecer em breve!"
                    }).then(() => {
                        console.log('Notificação enviada')
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        })
    }

}

module.exports = new AppointmentService()