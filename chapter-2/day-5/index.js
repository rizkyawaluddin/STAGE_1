const express = require("express");
const { json } = require("express/lib/response");
// const { registerAsyncHelper } = require("hbs");

const app = express ()


const port = 5000

app.set('view engine', 'hbs') //set view engine hbs


app.use('/public', express.static(__dirname + '/public')) //set public path/folder 


app.use(express.urlencoded({extended: false}))

// conect database
const client = require('./conection/db')


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
        if (err) throw new err

        let selectAllQuery = 'SELECT * FROM tb_blog'
        client.query(selectAllQuery, (err, results) => {
            done()
            if (err) throw new err

            const data = results.rows

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

    // blogs.map(function(data) {
    //     return {
    //         ...data,
    //         isLogin: isLogin
    //     }
    // })
    // console.log(dataBlogs)
    

})

app.get('/delet-blog/:id', function(req, res) {
    let id = req.params.id

    const query = `DELETE FROM public.tb_blog WHERE id=${id};`
    client.connect(function (err, client, done) {
         // Kondisi untuk menampilkan error koneksi database
        if (err) throw err

        client.query(query, function (err, result) {
            // Kondisi untuk menampilkan error query
            if (err) throw err 
            done();
        })

        res.redirect('/')
    })
    res.redirect('/')
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
        VALUES('${name}', '${start}',' ${end}', '${description}', '{"nodeJs":"${nodeJs}", "reactJs":"${reactJs}", "html":"${html}", "css":"${css}"}', '${image}')`
        
        client.query(dataQuery, (err, results) => {
            done()
            // Mengecek tampilan error koneksi database
            // if (err) throw new err

            // const data = results.rows

            // data.map(function(isdata){
            //     let startDate = isdata.start_date
            //     let endDate = isdata.end_date
            //     isdata.duration= getDistanceTime(startDate, endDate)
            // })
            // res.render('index', {data})
            // console.log(err, results)
            res.redirect('/')
            
        })

    })   
    // res.render('blog')
    // console.log(req.body)
    // let title = req.body.projectName
    // let content = req.body.description
    // let startDate = req.body.startDate
    // let endDate = req.body.endDate
    // let node = req.body.nodeJs
    // let react = req.body.reactJs
    // let next = req.body.nextJs
    // let typescript = req.body.typescript
    // let date = new Date()

    // let blog = {
    //     projectName : title,
    //     description : content,
    //     author : 'Muhammad Rizky awaluddin',
    //     postAt : getDistanceTime(startDate,endDate),
    //     technologies : {
    //         node,
    //         react,
    //         next,
    //         typescript
    //     },
    //     newDate : getFullTime(date)
       
    // }

    // console.log(blog)
    // // console.log(`Data title : ${title}`);
    // // console.log(`Data content : ${content}`);
    // blogs.push(blog)
    // // console.log(blogs)
})

app.get('/edit-blog/:id', function(req, res) {
    let id = req.params.id

    // client.connect((err, client, done)=>{
    //     if (err) throw new err

    // let dataQuery = `SELECT id FROM tb_blog WHERE id=${id}`
    
    // client.query(dataQuery, (err, results) => {
    //     done()
    //     if (err) throw new err

    //     const data = result.rows

    //     console.log(err, results)
        res.render('edit-project')
        // res.redirect('/')

    //     })
        
    // })
   
    
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
	SET name='${name}', start_date='${start}', end_date='${end}', description='${description}', image='${image}', technologies=''{"nodeJs":"${nodeJs}", "reactJs":"${reactJs}", "html":"${html}", "css":"${css}"}
	WHERE id='${id}'`
    
    client.query(dataQuery, (err, results) => {
        done()
        // if (err) throw new err

        // const data = result.rows

        // console.log(err, results)

        res.redirect('/')

        })
        
    })

})   

    // res.render('blog')
    // console.log(req.body)
    // let title = req.body.projectName
    // let content = req.body.description
    // let startDate = req.body.startDate
    // let endDate = req.body.endDate
    // let node = req.body.nodeJs
    // let react = req.body.reactJs
    // let next = req.body.nextJs
    // let typescript = req.body.typescript
    // let date = new Date()
    // let id = req.params.id

    // console.log('ini id', id)
    // console.log('ini blogs', blogs[id])
    
    // blogs[id]= {
    //     projectName : title,
    //     description : content,
    //     author : 'Muhammad Rizky awaluddin',
    //     postAt : getDistanceTime(startDate,endDate),
    //     technologies : {
    //         node,
    //         react,
    //         next,
    //         typescript
    //     },
    //     newDate : getFullTime(date)
    // } 
    // res.redirect('/')
app.get('/register', function (req, res) {
        res.render('register')
    })

app.post('/register', function (req, res) {
    
    })

app.get('/login', function (req, res) {
        res.render('login')
    })


    


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