let button = document.getElementById("button1")
let output = document.getElementById("sidebar_list")
let i_title = document.getElementById("i_title").value
//let i_alteration = document.getElementById("i_alteration").value
//let i_path = document.getElementById("i_path").value
let s_alteration = document.getElementById("s_alteration")
let s_path = document.getElementById("s_path")

button.addEventListener("click", do_thing)

const port = 8081
const url = 'http://localhost:'+port+'/'

async function fill_alterations(){
	let alterations = await fetch('http://localhost:8081/alterations')
	alterations = await alterations.json()
	alterations = alterations[0]["values"]
	s_alteration.innerHTML+=`<option value="`+'-1'+`">All</option>	`
	alterations.forEach((alt)=>{
		s_alteration.innerHTML+=`
		<option value="`+alt[0]+`">`+alt[1]+`</option>
		`
	})
}
fill_alterations()

async function fill_paths(){
	let paths = await fetch('http://localhost:8081/paths')
	paths = await paths.json()
	paths = paths[0]["values"]
	console.log(paths)
	s_path.innerHTML+=`<option value="`+'-1'+`">All</option>	`
	paths.forEach((path)=>{
		s_path.innerHTML+=`
		<option value="`+path[0]+`">`+path[1]+`</option>
		`
	})
}
fill_paths()

async function set_character_name(){
	let char_name = document.getElementById("character_name")
	let name = await fetch(url+'character/1/name')
	char_name.innerHTML = name
}
//set_character_name()
async function set_character_level(){
	let char_level = document.getElementById("character_level")
	let level = await fetch(url+'character/1/level')
	char_level.innerHTML = level
}
//set_character_level()
async function set_character_advance_points(){
	let char_advance_points = document.getElementById("character_advance_points")
	let advance_points = await fetch(url+'character/1/advance_points')
	char_advance_points.innerHTML = advance_points
}
//set_character_advance_points()
async function do_thing(){
	
	i_title = document.getElementById("i_title").value

	let si = s_alteration.options.selectedIndex
	let s_alt = s_alteration.options[si]
	console.log(s_alt.value + ' '+ s_alt.innerHTML)

	si = s_path.options.selectedIndex
	let selected_path = s_path.options[si]
	console.log(selected_path.value + ' '+ selected_path.innerHTML)
	
	let statement = ''
	if(i_title==''){
		statement = 'http://localhost:8081/abilities/'+selected_path.innerHTML+'/'+s_alt.innerHTML+''
	}else{
		statement = "http://localhost:8081/ability/"+i_title
	}
	console.log(statement)
	const result = await fetch(statement)
	let data = await result.json()
	data = data[0]["values"]
	console.log(data)
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
			document.getElementById("detail_view").innerHTML += b.parentElement.outerHTML 
			console.log(b.parentElement)
		})
	}
}

function addAbility(a){
	console.log(a)
}
