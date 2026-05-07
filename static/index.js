let button = document.getElementById("button1")
let output = document.getElementById("output")
let input = document.getElementById("input").value

button.addEventListener("click", do_thing)

async function do_thing(){
	const result = await fetch("http://localhost:8081/ability/"+input)
	let data = await result.json()
	data = data[0]["values"]
	let out = ""//data[0][1]+"<br>"+data[0][5]+"<br>"
	for(let i=0; i<data.length; i++){
		out+="<h5>"+data[i][1]+"</h5><br>"
		
		out+=data[i][5]+"<br>"
	}
	output.innerHTML= out
	console.log(data)
}
