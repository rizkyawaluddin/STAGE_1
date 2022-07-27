const express = require("express");
// const { registerAsyncHelper } = require("hbs");

const app = express ()
const port = 5000

// app.set('view engine', 'hbs') //set view engine hbs

// app.use('/public', express.static(__dirname + '/public'))

// app.use(express.urlencoded({extended: false}))

// app.get('/', function(req, res) {
//     res.render('index')
// })

app.listen(port, function(){
    console.log(`server listen on port ${port}`)
})