import express from 'express'
import http from 'http'
import db from './backend/database.js'
//import {select, ability_by_title, select_alterations, select_paths,select_by_path_alteration, select_character, save_character, save_character} from './backend/db_routes.js'
import * as route from './backend/db_routes.js'

let app = express()
let port = 8081
app.use(express.static('./static'))
//app.use(express.urlencoded())

app.use(express.json())

app.set('view engine', 'html')
app.set('views','./public')

app.get('/', (req, res)=>{
	res.sendFile('./static/index.html')
})

app.all('/select/', route.select)
app.all('/ability/:title', route.ability_by_title)
app.all('/alterations', route.select_alterations)
app.all('/paths', route.select_paths)
app.all('/abilities/:path/:alteration', route.select_by_path_alteration)
app.all('/character/:id', route.select_character)
app.all('/next_id', route.next_character_id)
app.post('/save', route.save_character)


app.listen(port, ()=>{
	console.log('Running on port: '+port)
})
