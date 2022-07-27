//use express
const express = require('express')
const app = express()
//use mongodb
const MongoClient = require('mongodb').MongoClient
//use port 2121
const PORT = 2121
require('dotenv').config()

//create db variable
let db,
    //create connection string 
    dbConnectionStr = process.env.DB_STRING,
    //create dbname
    dbName = 'todo'
//connect to mongodb 
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        //console log with name of database
        console.log(`Connected to ${dbName} Database`)
        //use db to call client.db
        db = client.db(dbName)
    })
//set view engine to ejs   
app.set('view engine', 'ejs')
//use express.static to make folder accessible to public
app.use(express.static('public'))
//parse incoming requests
app.use(express.urlencoded({ extended: true }))
//middleware function to parse incoming json requests
app.use(express.json())

//default page
app.get('/',async (request, response)=>{
    //create array from todo
    const todoItems = await db.collection('todos').find().toArray()
    //get count of incomplete items from todo
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //render page with index.ejs
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
//add a new to do
app.post('/addTodo', (request, response) => {
    //add object to database
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //console log added
        console.log('Todo Added')
        //bring back to main page
        response.redirect('/')
    })
    //catch in case of error
    .catch(error => console.error(error))
})
//change status of task
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        //move item to top of list
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //console.log marked complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catch in case of error
    .catch(error => console.error(error))

})
//change status of task
app.put('/markUnComplete', (request, response) => {
    //update request
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        //change to completed to false
        $set: {
            completed: false
          }
    },{
        //move item to top
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        //console.log marked complete
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    //catch in case of error
    .catch(error => console.error(error))

})
//delete item from database
app.delete('/deleteItem', (request, response) => {
    //delete request
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        //console log todo deleted
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    //catch in case of error
    .catch(error => console.error(error))

})
//run on port user port or default 2121
app.listen(process.env.PORT || PORT, ()=>{
    //console log port 
    console.log(`Server running on port ${PORT}`)
})