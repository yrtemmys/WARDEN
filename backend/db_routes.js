import db from './database.js'

export async function select(req, res){
	let table = req.params.table
	
	let statement = "select * from abilities_readable"

	const result = db.exec(statement)
	res.send(result)
}

export async function ability_by_title(req, res){
	let title = req.params.title
	let feat = req.params.feat

	const result = db.exec('select * from abilities_readable where title="'+title+'" or parent="'+title+'"')
	res.send(result)
}
