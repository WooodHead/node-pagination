var express = require('express')
var ejs = require('ejs')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var mainRoutes = require('./routes/main')
var helpers = require('node-view-helpers')

var path = require('path');


var app = express()
mongoose.connect('mongodb://localhost:27017/article')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(helpers('pagination')) // make sure you declare this middleware after `connect-flash` and `express.session` middlewares and before `express.router`.

app.use(function (req, res, next) {
    res.locals.createPagination2 = function (pages, current) {
        var str = ''

        if (current == 1) {
            // str += '<li class="disabled"><a>First</a></li>'
            str += '<li class="disabled"><a>1</a></li>'
        } else {
            // str += '<li><a href="/products/1">First</a></li>'
            str += '<li><a href="/products/1">1</a></li>'
        }

        var i = (Number(current) > 5 ? Number(current) - 4 + 1 : 2)
        if (i !== 2) {
            str += '<li class="disabled"><a>...</a></li>'
        }
        for (; i <= (Number(current) + 4) && i < pages; i++) {
            if (i == current) {
                str = str + '<li class="active"><a>' + i + '</a></li>'
            } else {
                str = str + '<li><a href="/products/' + i + ' ">' + i + '</a></li>'
            }
            if (i == Number(current) + 4 && i < pages) {
                str = str + '<li class="disabled"><a>...</a></li>'
            }
        }

        if (current == pages) {
            str += '<li class="disabled"><a>' + pages + '</a></li>'
            // str += '<li class="disabled"><a>Last</a></li>'
        } else {
            str += '<li><a href="/products/' + pages + '">' + pages + '</a></li>'
            // str += '<li><a href="/products/' + pages + '">Last</a></li>'
        }

        return str
    }

    next()
})
app.use(mainRoutes)

app.listen(8080, function () {
    console.log('Node.js listening on port ' + 8080)
})