module.exports = {

    dateNow: (req, res, next) => {

        var now = new Date()
        var day = now.getDate()
        var month = now.getMonth() + 1
        var year = now.getFullYear()
        var hour = now.getHours()
        var minutes = now.getMinutes()

        switch (day) {
            case 1:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 2:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 3:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 4:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 5:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 6:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 7:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 8:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 9:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            default:
                day
        }

        switch (month) {
            case 1:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 2:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 3:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 4:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 5:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 6:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 7:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 8:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 9:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            default:
                month
        }



        var date = day + "/" + month + "/" + year

        switch (hour) {
            case 0:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 1:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 2:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 3:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 4:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 5:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 6:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 7:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 8:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            case 9:
                var auxiliar = hour
                hour = "0" + auxiliar
                break;
            default:
                hour
        }

        switch (minutes) {
            case 0:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 1:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 2:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 3:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 4:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 5:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 6:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 7:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 8:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            case 9:
                var auxiliar = minutes
                minutes = "0" + auxiliar
                break;
            default:
                minutes
        }

        var hour = hour + ":" + minutes

        req.date = date
        req.hour = hour

        next()

    },


    lastdays: (req, res, next) => {

        var listaDias = []

        var now = new Date()
        var day = now.getDate()
        var month = now.getMonth() + 1
        var year = now.getFullYear()


        switch (day) {
            case 1:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 2:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 3:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 4:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 5:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 6:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 7:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 8:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            case 9:
                var auxiliar = day
                day = "0" + auxiliar
                break;
            default:
                day
        }

        switch (month) {
            case 1:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 2:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 3:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 4:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 5:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 6:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 7:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 8:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            case 9:
                var auxiliar = month
                month = "0" + auxiliar
                break;
            default:
                month
        }

        var date = day + "/" + month + "/" + year

        listaDias.push(date)

        for(var i = 1; i < 8; i++){


            var newdate = new Date(now);

            newdate.setDate(newdate.getDate() - i);
            var nd = new Date(newdate);

            var day = nd.getDate()
            var month = nd.getMonth() + 1
            var year = nd.getFullYear()

            switch (day) {
                case 1:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                case 2:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                case 3:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                case 4:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                case 5:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                case 6:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                case 7:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                case 8:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                case 9:
                    var auxiliar = day
                    day = "0" + auxiliar
                    break;
                default:
                    day
            }

            switch (month) {
                case 1:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                case 2:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                case 3:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                case 4:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                case 5:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                case 6:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                case 7:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                case 8:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                case 9:
                    var auxiliar = month
                    month = "0" + auxiliar
                    break;
                default:
                    month
            }


            var date2 = day + "/" + month + "/" + year

            listaDias.push(date2)

        }

        req.last7days = listaDias

        next()
    }


}