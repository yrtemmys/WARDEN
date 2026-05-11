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

	const result = db.exec('select * from abilities_readable where title like "%'+title+'%" or parent like "%'+title+'%"')
	res.send(result)
}

export async function select_alterations(req, res){
	const result = db.exec('select * from alterations')
	res.send(result)
}
export async function select_paths(req, res){
	const result = db.exec('select * from paths')
	res.send(result)
}
export async function select_by_path_alteration(req, res){
	let path = req.params.path
	let alteration = req.params.alteration

	if(path=='All') {
		path = '%'
	}
	if(alteration=='All'){
		alteration = '%'
	}

	const result = db.exec('select * from abilities_readable where path like "'+path+'" and alteration like "'+alteration+'"')
	res.send(result)
}

export async function select_character(req, res){
	let id = req.params.id
	let result = {}

	result.meta = db.exec(`select * from character ch where ch.character_id=`+id)[0]
	result.abilities = db.exec(`select ability_id from character_has_ability where character_id=`+id)[0]
	result.resources = db.exec(`
		select title, value from character_has_resource chr
			join resources r on r.resource_id=chr.resource_id 
		where character_id=`+id)[0]
	result.ranks = db.exec(`select title, value from character_has_rank chr join paths on chr.path_id=paths.path_id where character_id=`+id)[0]
	result.origin = db.exec(`select title from character_has_origin cho join origins o on cho.origin_id=o.origin_id where character_id=`+id)[0]
	result.skill = db.exec(`select title from character_has_skill chs join skills on chs.skill_id = skills.skill_id where character_id=`+id)[0]
	
	for(let x in result){
		result[x]=sql_to_json(result[x])
	}

	res.send(result)
}

function sql_to_json(sql){
	if (sql == undefined) return;
	let columns = {}
	sql.columns.forEach((column)=>{
		columns[column]= ''
	})
	let con_row = []
	sql.values.forEach((row)=>{
		//let len = columns.length
		let i = 0
		for(let x in columns){
			columns[x] = row[i]
			i++
		}
		con_row.push(JSON.parse(JSON.stringify(columns)))

	})

	return(con_row)
}
