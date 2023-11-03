class AppointmentFactory{

    Build(simpleAppoitment){

        let day = simpleAppoitment.date.getDate()+1
        let month = simpleAppoitment.date.getMonth()
        let year = simpleAppoitment.date.getFullYear()

        let hour = Number.parseInt(simpleAppoitment.time.split(':')[0])
        let minutes = Number.parseInt(simpleAppoitment.time.split(':')[1])

        let startDate = new Date(year, month, day, hour,minutes,0,0)
        startDate.setHours( startDate.getHours() - 3)

        var data = {
            id: simpleAppoitment._id,
            title: simpleAppoitment.name + ' - ' + simpleAppoitment.description,
            start: startDate,
            end: startDate
        }

        return data
    }

}

module.exports = new AppointmentFactory()