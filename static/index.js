let sidebar = document.getElementById("sidebar_list")
let i_title = document.getElementById("i_title").value
//let i_alteration = document.getElementById("i_alteration").value
//let i_path = document.getElementById("i_path").value
let s_alteration = document.getElementById("s_alteration")
let s_path = document.getElementById("s_path")
let detail_view = document.getElementById("detail_view")


const port = 8081
const url = 'http://localhost:'+port+'/'

async function fill_alterations(){
	let alterations = await fetch(url+'alterations')
	alterations = await alterations.json()

	s_alteration.innerHTML+=`<option value="`+'-1'+`">All</option>	`
	for(let alt in alterations){
		alt = alterations[alt]
		s_alteration.innerHTML+=`
		<option value="`+alt.alteration_id+`">`+alt.title+`</option>
		`
	}
}
fill_alterations()

async function fill_paths(){
	let paths = await fetch(url+'paths')
	paths = await paths.json()

	s_path.innerHTML+=`<option value="`+'-1'+`">All</option>	`
	for(let p in paths){
		p=paths[p]
		s_path.innerHTML+=`
		<option value="`+p.path_id+`">`+p.title+`</option>
		`
	}
}
fill_paths()

async function load_character_to_doc(id){
	let c  = await fetch(url+'character/'+id)
	document.character = await c.json()
}
load_character_to_doc(1)

document.getElementById('get_character').addEventListener('click', get_character)
async function get_character(){
	character = document.character
	
	let char_name = document.getElementById("character_name")
	let char_level = document.getElementById("character_level")
	let char_advance_points = document.getElementById("character_advance_points")

	char_name.value=character.meta[0].name
	char_level.innerHTML=character.meta[0].level
	char_advance_points.innerHTML=character.meta[0].advance_points

	load_abilities_from_doc(document.character.abilities, detail_view)

}

let button = document.getElementById("button1")
button.addEventListener("click", search_and_add)
async function search_and_add(){
	await search()
	load_abilities_from_doc(document.warden_search_results, sidebar)
}

async function search(){
	i_title = document.getElementById("i_title").value
	let result
	if(i_title!=''){
		result = await fetch(url+'ability/'+i_title)
	}else{
		let index = 0
		index = s_alteration.options.selectedIndex
		let alt = s_alteration.options[index].innerHTML
		index = s_path.options.selectedIndex
		let path = s_path.options[index].innerHTML

		result = await fetch(url+'abilities/'+path+'/'+alt)
	}
	if(result==undefined) return;
	result = await result.json()

	document.warden_search_results = result 

	//return result
}

document.getElementById('save_character').addEventListener("click", save_character)
async function save_character(){
	await fetch(url+'save', {
		method: 'POST',
		headers:{"Content-Type":'application/json'},
		body: JSON.stringify(document.character)
	})
}

//function add_abilities_to_character_doc(result){
//	for(let ability in result){
//		ability=result[ability]
//		let html = ability_to_html(ability,true)
//		output.innerHTML += html
//	}
//}

function ability_to_html(ability,button){
	let html = `
		<div class='ability'>
			<div class='ability_title'>`+ability.title+` </div>
			<div class='ability_description'>`+ability.description+`</div>
	`
	for(let feat in ability.feats){
		feat = ability.feats[feat]
		html +=`
			<div class='feat'>
				<div class='feat_title'>
					<input type='checkbox'>
					<label>`+feat.title+`<label>
				</div>
				<div class='feat_description'>`+feat.description+`</div>
			</div>
		`
	}
	if(button) html+=add_to_character_button()
	html +=`
		<div class='hidden json'>`+JSON.stringify(ability)+`</div>
		</div>
	`
	return html
}
function add_to_character_button(){
	return `
		<div class='add_ability_to_charcter'>
			<input type='button' class='add_ability_to_character_button' value='Add'/>
		</div>
	`
}
function load_abilities_from_doc(source, destination){
	destination.innerHTML=''
	let button = false
	if(destination==sidebar) button=true
	for(let ability in source){
		ability= source[ability]
		destination.innerHTML+= ability_to_html(ability,button)
	}
	if(button){
		add_add_button_functionality()
	}
}
function add_add_button_functionality(){
	const add_buttons = document.getElementsByClassName("add_ability_to_character_button");
	for(let i = 0; i<add_buttons.length; i++){
		let b = add_buttons.item(i)
		b.addEventListener("click", ()=>{
			let html = b.parentElement.parentElement.outerHTML
			html = html.substring(html.search('hidden json'))
			html = html.substring(html.search('{'),html.search('</div>'))
			let json = JSON.parse(html)
			document.character.abilities.push(json)
			load_abilities_from_doc(document.character.abilities, detail_view)
		})
	}
}


















async function do_thing(){
	
	i_title = document.getElementById("i_title").value

	let si = s_alteration.options.selectedIndex
	let s_alt = s_alteration.options[si]
	//console.log(s_alt.value + ' '+ s_alt.innerHTML)

	si = s_path.options.selectedIndex
	let selected_path = s_path.options[si]
	//console.log(selected_path.value + ' '+ selected_path.innerHTML)
	
	let statement = ''
	if(i_title==''){
		statement = 'http://localhost:8081/abilities/'+selected_path.innerHTML+'/'+s_alt.innerHTML+''
	}else{
		statement = "http://localhost:8081/ability/"+i_title
	}
	const result = await fetch(statement)
	let data = await result.json()
	data = data[0]["values"]
	let out = ''    //"<div class='ability'>"
	for(let i=0; i<data.length; i++){
		if(data[i][0]!=null){
			let parent = data[i][0]
		}
		if(data[i][0]==null){
			if(i>1){
				out+=`
					<br>
					<input type="button" class="add_me" value="Add">
					</div>
				`
			}
			out+='<div class="ability">'
			//title ability
			out+="<div class='ability_title'>"+data[i][1]+"</div><br>"
		}else{
			//title feat
			out+=`
				<div class='feat_title'>
					<input type="checkbox">
					<label>`+data[i][1]+`<label>
				</div><br>
			`
		}
		//description
		out+=data[i][5]+"<br>"
	}
	out+=`
		<br>
		<input type="button" class="add_me" value="Add">
		</div>
	`
	output.innerHTML= out

	const add_buttons = document.getElementsByClassName("add_me");
	for(let i = 0; i<add_buttons.length; i++){
		let b = add_buttons.item(i)
		b.addEventListener("click", ()=>{
			detail_view.innerHTML += b.parentElement.outerHTML 
		})
	}
}

