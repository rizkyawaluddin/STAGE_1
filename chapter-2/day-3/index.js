const express = require("express");
// const { registerAsyncHelper } = require("hbs");

const app = express ()


const port = 5000

app.set('view engine', 'hbs') //set view engine hbs


app.use('/public', express.static(__dirname + '/public')) //set public path/folder 


app.use(express.urlencoded({extended: false}))


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
    console.log(req.params);

    let id = req.params.id

    res.render('blog-detail', {
        blog: { 
        id: id,
        title: 'Selamat Datang di Personal Web',
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. At neque, eos incidunt ducimus iusto doloremque molestias corrupti reiciendis quasi asperiores nostrum odio ullam assumenda a nobis? Architecto placeat nemo dolorem doloremque cumque commodi corporis sint voluptates at itaque! Qui eligendi dolor eaque quisquam cupiditate error laudantium expedita numquam possimus ipsa nihil ipsum, aut modi earum. Officia tenetur aliquid quia sit voluptatem, in debitis error laborum minima quas quos itaque! Atque amet quidem, officia, commodi voluptatum natus aliquid dolor temporibus blanditiis aliquam animi quod aut harum ex voluptatibus sequi distinctio ipsa consequatur consequuntur. Quos vero ad harum eveniet accusantium vitae omnis?',
        author: 'Muhammad Rizky awaluddin',
        postAt: '1 April 2022 10:00 WIB'

        }
    })
})

let isLogin = true

app.get('/', function(req, res) {
    console.log(blogs)
   

    blogs.map(function(data) {
        return {
            ...data,
            isLogin: isLogin
        }
    })
    // console.log(dataBlogs)
    res.render('index', {blogs})

})

app.get('/delet-blog/:id', function(req, res) {
    let id = req.params.id
    blogs.splice(id, 1)
    // console.log(id)
    res.redirect('/')
})

app.get('/edit-blog/:id', function(req, res) {
    let id = req.params.id
   
    let blog = blogs[id]
    console.log(blog)
    res.render('edit-blog', {dataId: id, blog})
    
})

app.post('/add-project', function(req, res) {
    // res.render('blog')
    // console.log(req.body)
    let title = req.body.projectName
    let content = req.body.description
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let node = req.body.nodeJs
    let react = req.body.reactJs
    let next = req.body.nextJs
    let typescript = req.body.typescript
    let date = new Date()

    let blog = {
        projectName : title,
        description : content,
        author : 'Muhammad Rizky awaluddin',
        postAt : getDistanceTime(startDate,endDate),
        technologies : {
            node,
            react,
            next,
            typescript
        },
        newDate : getFullTime(date)
       
    }

    console.log(blog)
    // console.log(`Data title : ${title}`);
    // console.log(`Data content : ${content}`);
    blogs.push(blog)
    // console.log(blogs)
    res.redirect('/')
})

app.post('/edit-blog/:id', function(req, res) {
    // res.render('blog')
    // console.log(req.body)
    let title = req.body.projectName
    let content = req.body.description
    let startDate = req.body.startDate
    let endDate = req.body.endDate
    let node = req.body.nodeJs
    let react = req.body.reactJs
    let next = req.body.nextJs
    let typescript = req.body.typescript
    let date = new Date()
    let id = req.params.id

    console.log('ini id', id)
    console.log('ini blogs', blogs[id])
    
    blogs[id]= {
        projectName : title,
        description : content,
        author : 'Muhammad Rizky awaluddin',
        postAt : getDistanceTime(startDate,endDate),
        technologies : {
            node,
            react,
            next,
            typescript
        },
        newDate : getFullTime(date)
    } 
    res.redirect('/')
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