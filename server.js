import express from 'express'
import http from 'http'
import db from './backend/database.js'
import {select, ability_by_title} from './backend/db_routes.js'

let app = express()
let port = 8081
app.use(express.static('./static'))

app.set('view engine', 'html')
app.set('views','./public')

app.get('/', (req, res)=>{
	res.sendFile('./static/index.html')
})

app.all('/select/', select)
app.all('/ability/:title', ability_by_title)

app.listen(port, ()=>{
	console.log('Running on port: '+port)
})
