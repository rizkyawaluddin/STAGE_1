// import express
const express = require("express");
// import json
const { json } = require("express/lib/response");
const { password } = require("pg/lib/defaults");

// const { registerAsyncHelper } = require("hbs");
const hbs = require('hbs')
const app = express ()

// import package bcrypt
const bcrypt = require('bcrypt');

// import express-session and express-flash
const flash = require('express-flash')
const session = require('express-session')


const port = 5000

app.set('view engine', 'hbs') //set view engine hbs


app.use('/public', express.static(__dirname + '/public')) //set public path/folder 


app.use(express.urlencoded({extended: false}))

app.use(
    session({
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 2
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)

// conect database
const client = require('./conection/db.js')
hbs.registerHelper('isTrue', function(condition, argument){
    return condition === argument
})


let blogs = [
    {
        title: 'Selamat Datang di Personal Web',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
        author: 'Muhammad Rizky awaluddin',
        postAt: '1 April 2022 10:00 WIB'
    }
]


let month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]



app.get('/contact', function(req, res) {
    res.render('contact')
})


app.get('/add-project', function(req, res) {
    res.render('add-project')
})
    

app.get('/blog-detail/:id', function(req, res) {
    console.log(req.params,id);

    let id = req.params.id

    res.render('blog-detail')
})

let isLogin = true

app.get('/', function(req, res) {
    // console.log(blogs)
    client.connect((err, client, done)=>{
        if (err) throw  err

        let selectAllQuery = 'SELECT * FROM tb_blog'
        client.query(selectAllQuery, (err, result) => {
            done()
            if (err) throw err

            const data = result.rows

            data.map(function(isdata){
                let startDate = isdata.start_date
                let endDate = isdata.end_date
                isdata.technologies = JSON.parse(isdata.technologies)
                isdata.duration= getDistanceTime(startDate, endDate)
            })
            res.render('index', {data})

            // console.log(data)
        })

    })   
    

})

app.get('/delet-blog/:id', function(req, res) {
    let id = req.params.id


    client.connect((err, client, done) => {
        if (err) throw err

        let query = `DELETE FROM tb_blog WHERE id=${id}`

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            res.redirect('/')
        })
    })
})



app.post('/add-project', function(req, res) {

    let name = req.body.projectName
    let description = req.body.description
    let start = req.body.startDate
    let end = req.body.endDate
    let nodeJs = req.body.nodeJs
    let reactJs = req.body.reactJs
    let html = req.body.html5
    let css = req.body.css3
    let image = req.body.image

    client.connect((err, client, done)=>{
        if (err) throw new err

        let dataQuery = `INSERT INTO tb_blog(name, start_date, end_date, description, technologies, image) 
        VALUES('${name}', '${start}','${end}','${description}','{"nodeJs":"${nodeJs}", "reactJs":"${reactJs}", "html":"${html}", "css":"${css}"}','${image}')`
        
        client.query(dataQuery, (err, result) => {
            done()
            // Mengecek tampilan error koneksi database
            if (err) throw err

            result = result.rows

            res.redirect('/')
            
        })

    })   
    
})

app.get('/edit-blog/:id', function(req, res) {
    
    let id = req.params.id
    // console.log(id)

    client.connect((err, client, done) => {
        if (err) throw err

        let query = `SELECT * FROM tb_blog WHERE id=${id}`
        client.query(query, (err, result) => {
            done()
            if (err) throw err

            result.rows.map(hasil => {
            
                hasil.technologies = JSON.parse(hasil.technologies)
            })
            // console.log(result)
            res.render('edit-blog', {result: result.rows[0]})
        })
    })
   
    
})

app.post('/edit-blog/:id', function(req, res) {
    // let data = req.body
    let id = req.params.id

    let name = req.body.projectName
    let description = req.body.description
    let start = req.body.startDate
    let end = req.body.endDate
    let nodeJs = req.body.nodeJs
    let reactJs = req.body.reactJs
    let html = req.body.html5
    let css = req.body.css3
    let image = req.body.image

    client.connect((err, client, done)=>{
        if (err) throw new err

    let dataQuery = `UPDATE tb_blog
	SET name='${name}', start_date='${start}', end_date='${end}', description='${description}', image='${image}', technologies='{"nodeJs":"${nodeJs}", "reactJs":"${reactJs}", "html":"${html}", "css":"${css}"}'
	WHERE id=${id}`
    
    client.query(dataQuery, (err, result) => {
        done()
        // Mengecek tampilan error koneksi database
        if (err) throw err


        // console.log(err, results)

        res.redirect('/')

        })
        
    })

})   

    // REGISTER AND LOGIN
app.get('/register', function (req, res) {
        res.render('register')
    })

app.post('/register', function (req, res) {

    const {name, email, password} = req.body

    const hash = bcrypt.hashSync(password, 10);
    // return console.log(password, hash)

    client.connect((err, client, done)=>{
    if(err) throw err

    let query = `INSERT INTO tb_user(name, email, password)
                VALUES('${name}','${email}','${hash}')`

    client.query(query, (err, result) => {
    done()
    if(err) throw err

    res.redirect('/login')
    })

    })
    
})

app.get('/login', function (req, res) {
        res.render('login')
    })

    app.post('/login', function (req, res) {
        const {email, password} = req.body

        client.connect((err, client, done)=>{
            if(err) throw err
        
        let query = `SELECT * FROM tb_user WHERE email='${email}'`

        client.query(query, (err, result) => {
            done()
            if(err) throw err

            if (result.rowCount == 0){
                req.flash('danger', 'account not fount')
                return res.redirect('/login')
            }
            // return console.log(result)

            let isPass = bcrypt.compareSync(password, result.rows[0].password)
            
            if(isPass) {
                res.redirect('/')
            }else{
                res.redirect('/login')
            }

            console.log(isPass)
        })
        })
    })
// -------------------------------------------------------------------------------------------------------------------------
    


app.listen(port, function(){
    console.log(`server listen on port ${port}`)
})


// postAt -----------------------------------------------------------------------------------------------------------

function getFullTime(time) {
    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    if (minutes < 10) {
        minutes = '0' + minutes
    }

    return `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
}

function getDistanceTime(start, end) {
    let startDate = new Date(start)
    let endDate = new Date(end)
  
  let distance = endDate - startDate
  console.log(distance); 
  
  let miliseconds = 1000
  // let secondInMinute = 60
  let secondInHours = 3600
  let hoursInDay = 24 
  let dayInMonth = 31
  let monthInYear = 12
  
  let distanceYear = Math.floor(distance / (miliseconds* secondInHours * hoursInDay * dayInMonth * monthInYear))
  let distanceMonth = Math.floor(distance / (miliseconds * secondInHours * hoursInDay * dayInMonth))
  let distanceDay = Math.floor(distance / (miliseconds * secondInHours * hoursInDay))
  let distanceHours = Math.floor(distance / (miliseconds * 60 * 60))
  let distanceMinutes = Math.floor(distance / (miliseconds * 60))
  let distanceSeconds = Math.floor(distance / miliseconds)
  
  console.log(distanceDay);
  console.log(distanceHours);
  console.log(distanceMinutes);
  
  if (distanceYear > 0) {
      return`${distanceYear} Year`
  } else if (distanceMonth > 0) {
      return`${distanceMonth} Month`
  } else if(distanceDay > 0) {
      return `${distanceDay} day`
  } else if(distanceHours > 0) {
      return `${distanceHours} hours`
  } else if(distanceMinutes > 0) {
      return `${distanceMinutes} minutes`
  } else {
      return `${distanceSeconds} seconds`
  }
  
  
  }
//;