const outputVar = document.getElementById("outputDiv")
const clickbtn = document.getElementById("inputBtn")
const say= console.log
outputVar.innerHTML = "test"
let pokeJson
fetchJson()



clickbtn.addEventListener("click",function(){
    say(pokeJson)
    runScript()
});




function fetchJson(){
    fetch("/json/pokemon.json")
    .then(response => response.json())
    .then(text => {
        console.log(text)
        pokeJson = text.pokemon
        return pokeJson
    })
}


function runScript(){
    outputVar.innerHTML = "Submit"
}