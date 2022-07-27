const express = require("express");
// const { registerAsyncHelper } = require("hbs");

const app = express ()
const port = 5000

app.set('view engine', 'hbs') //set view engine hbs


app.use('/public', express.static(__dirname + '/public')) //set public path/folder 


app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res) {
    res.render('index')
})

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

app.get('/blog', function(req, res) {
    res.render('blog', {isLogin})

})

app.post('/blog', function(req, res) {
    // res.render('blog')
    // console.log(req.body)
    let title = req.body.projectName
    let content = req.body.description

    console.log(`Data title : ${title}`);
    console.log(`Data content : ${content}`);

})



// app.get('/blog/:id', function (req, res) {
//     let id = req.params.id
//     res.render('blog-detail', { dataId: id })
// })


app.listen(port, function(){
    console.log(`server listen on port ${port}`)
})