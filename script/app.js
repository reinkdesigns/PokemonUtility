let outputVarTeam = [];
let inputBoxTeam = [];

for (let i = 0; i < 6; i++) {
  outputVarTeam[i] = document.getElementById(`outputDivTeammon${i + 1}`);
  inputBoxTeam[i] = document.getElementById(`inputDivTeammon${i + 1}`);
}
const outputVarRaidmonInfo = document.getElementById("selectedRaidOutput");
const outputVarRaidmon = document.getElementById("outputDivRaidmon");
const inputBoxRaidmon = document.getElementById("inputDivRaidmon");

const outputVarTeraHeader = document.getElementById("outputDivHeader");

const outputVarType = document.getElementById("outputDivType");
const outputVarPokemon = document.getElementById("outputDivPokemon");
const clickbtn = document.getElementById("inputBtn");
const raidRadio = document.getElementsByName("raidLevel");
const devLog = 1;
const defaultText = ["Name...", "none", ""];

let raidStar = 5;
let raidPokemon5StarArray = [[]];
let raidPokemon6StarArray = [[]];
let fiveStarName = [];
let sixStarName = [];
let encounterArray = [];
let pokeIndex = [];
let myPokemon = [];
let easy = 0;
let normal = 1;
let hard = 2;
let avoid = 3;
let checkRaid = 0


$(function () {
  $("#nav-placeholder").load("nav/navBar.html");
});

clickbtn.addEventListener("click", function () {
  for (let i = 0; i < 6; i++) {
    outputVarTeam[i].innerHTML = "Enter Pokemon";
  }
  runScript();
});

for (let i = 0; i < 6; i++) {
  inputBoxTeam[i].addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      clickbtn.click();
    }
  });
}
inputBoxRaidmon.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    clickbtn.click();
  }
});

function runScript() {
  pokeIndex = [];
  myPokemon = [];
  teraSuper=[]
  teraNormalEffective=[]
  teraNotEffective=[]
  teraImmune=[]
  encounterArray = [];
  for (let difficulty = 0; difficulty < 4; difficulty++) {
    encounterArray[difficulty] = [];
  }
  //get raid level
  for (let i = 0; i < raidRadio.length; i++) {
    if (raidRadio[i].checked) raidStar = raidRadio[i].value;
  }

  //gets pokemon form input field, validates their name
  //the assignes them to a variable. if unable to validate
  //value will be left blank and user informed
  //that pokemon was unable to be found
  outputVarRaidmon.innerHTML = "Unable to find Pokemon, Please Check Spelling.";
  for (let i = 0; i < 6; i++) {
    //set all reminder texts to unable to find as a guard
    //later will revery and emptys to default text
    outputVarTeam[i].innerHTML ="Unable to find Pokemon, Please Check Spelling.";
    pokeIndex[i] = 0;
    myPokemon[i] = 0;
    if (getPokemonExist(inputBoxTeam[i].value)) {
      pokeIndex[i] = getPokemonExist(inputBoxTeam[i].value);
      myPokemon[i] = pokeName[pokeIndex[i]];
      outputVarTeam[i].innerHTML = "Pokemon Found!";
    }
    if (pokeIndex[i]) {
      getAdvantage({ teamNumber: i });
    }
  }

  if (getPokemonExist(inputBoxRaidmon.value)) {
    checkRaid = 1
    outputVarRaidmon.innerHTML = "Pokemon Found!";
  }



  //returns the empty team reminder text to
  //"Enter Your Pokemon"
  //to close guard clause
  clearEmptyValues();
  //function to remove remove entries from hard encounters
  //that other team members have an easier time with
  popArray();
  reportResults();
}



function reportResults(){
let encounterCount = [];
let holdEncounter = [];
let commaCount = 0 // this variable it here to make sure there arent floating commas
                   // after each pokemon listed to user

teraReport = "Tera Match-ups<br><br>"

//build a list of given type match ups and assiciate
//them with the relevent pokemon
teraReport += "Super Effective Against:<br>"
if(!teraSuper.length) teraReport += "None<br><br>"
for(let i = 0;i<teraSuper.length;i++){
  commaCount=0
  teraReport += `${titleCase(teraSuper[i])} (`
  for (let j = 0; j < 6; j++) {
    if(!pokeIndex[j]) continue
    if(pokeArray.pokemon[pokeIndex[j]].superATK.includes(teraSuper[i])){
      if(commaCount)teraReport += ", "
      commaCount++
      teraReport += `${titleCase(myPokemon[j])}`
    }
  }
  teraReport += `)<br><br>`
}
//same as above
teraReport += `<br>Effective Against:<br>`
if(!teraNormalEffective.length) teraReport += "None<br><br>"
for(let i = 0;i<teraNormalEffective.length;i++){
  teraReport += `${titleCase(teraNormalEffective[i])}<br>`
}
//same as above
teraReport += `<br>Not Effective Against:<br>`
if(!teraNotEffective.length) teraReport += "None<br><br>"
for(let i = 0;i<teraNotEffective.length;i++){
  commaCount=0
  teraReport += `${titleCase(teraNotEffective[i])} (`
  for (let j = 0; j < 6; j++) {
    if(!pokeIndex[j]) continue

    if(pokeArray.pokemon[pokeIndex[j]].resistATK.includes(teraNotEffective[i])){
      if(commaCount)teraReport += ", "
      commaCount++
      teraReport += `${titleCase(myPokemon[j])}`
    }
  }
  teraReport += `)<br><br>`
}
//same as above
teraReport += `<br>Immune Against:<br>`
if(!teraImmune.length) teraReport += "None<br><br>"
for(let i = 0;i<teraImmune.length;i++){
  commaCount=0
  teraReport += `${titleCase(teraImmune[i])} (`
  for (let j = 0; j < 6; j++) {
    if(!pokeIndex[j]) continue
    if(pokeArray.pokemon[pokeIndex[j]].immuneATK.includes(teraImmune[i])){
      if(commaCount)teraReport += ", "
      commaCount++
      teraReport += `${titleCase(myPokemon[j])}`
    }
  }
  teraReport += `)<br><br>`
}

for (let difficulty = 0; difficulty <= avoid; difficulty++) {
  holdEncounter[difficulty] = [];
  encounterCount[difficulty] = 0;
  for (let i = 0; i < encounterArray[difficulty].length; i++) {
    if (difficulty == hard) holdEncounter[difficulty] += `x2 ----`;
    if (difficulty == avoid) holdEncounter[difficulty] += `x4 ----`;

    holdEncounter[difficulty] += `${titleCase(encounterArray[difficulty][i])}`;
    if (raidStar == 5) {
      indexHold = pokeRaid5Name.indexOf(encounterArray[difficulty][i]);
      if (pokeRaid5Warning[indexHold].length) {
        holdEncounter[difficulty] += ` ----- WARNING! Pokemon has the following: ${pokeRaid5Warning[indexHold]}`;
      }
    }
    if (raidStar == 6) {
      indexHold = pokeRaid6Name.indexOf(encounterArray[difficulty][i]);
      if (pokeRaid6Warning[indexHold].length) {
        holdEncounter[difficulty] += ` ----- WARNING! Pokemon has the following: ${pokeRaid6Warning[indexHold]}`;
      }
    }

    holdEncounter[difficulty] += `<br>`;
    encounterCount[difficulty]++;
  }
}

//code to give a result is the user inputs a speciffic raid
if(checkRaid && !(pokeRaid5Name.includes(inputBoxRaidmon.value)) && !(pokeRaid6Name.includes(inputBoxRaidmon.value))){
  checkRaid=0
  outputVarRaidmonInfo.innerHTML = "Entered raid pokemon is not valid"
}

if(checkRaid){
 if(raidStar == 5){
    indexCheckHold = pokeRaid5Name.indexOf(inputBoxRaidmon.value)
    if(pokeRaid5Warning[indexCheckHold].length) {
      outputVarRaidmonInfo.innerHTML = `WARNING! ${titleCase(inputBoxRaidmon.value)} has:<br>${pokeRaid5Warning[indexCheckHold]}<br><br>`;
    }
  }
  
  if(raidStar == 6){
    indexCheckHold = pokeRaid6Name.indexOf(inputBoxRaidmon.value)
    if(pokeRaid6Warning[indexCheckHold].length) {
      outputVarRaidmonInfo.innerHTML = `WARNING! ${titleCase(inputBoxRaidmon.value)} has:<br>${pokeRaid6Warning[indexCheckHold]}<br><br>`;
    }
  }
  for(let i=0;i<6;i++){
    if(pokeIndex[i]){
      outputVarRaidmonInfo.innerHTML += `This should be ${judgeEncounter({raidmon:inputBoxRaidmon.value,party:i})} with ${titleCase(myPokemon[i])}<br><br>`
    }
  }
}

//output displays all raid pokemon under input box
outputVarTeraHeader.innerHTML = teraReport
outputVarType.innerHTML = `Results<br><br>These Pokemon should be very easy with the proper tera type. (${
  encounterCount[easy]
})<br>${
  holdEncounter[easy]
}<br><br>These Pokemon may give a little trouble if tera type has resistance. (${
  encounterCount[normal]
})<br>${holdEncounter[normal]}<br><br>These Pokemon should be AVOIDED! (${
  encounterCount[hard] + encounterCount[avoid]
})<br>${holdEncounter[hard]}<br>${holdEncounter[avoid]}`;
}

function getPokemonExist(name) {
  //compair 2 words with acents to see if they are equivilent
  //this is here because of Flabébé.
  //also used to get the pokemons index via its name
  //if pokemon does not exsist, return 0
  for (i = 0; i < pokeName.length; i++) {
    if (areEquivalent(pokeName[i], name)) {
      return i;
    }
  }
  return 0;
}

function areEquivalent(w1, w2) {
  //compair 2 words with acents to see if they are equivilent
  //this is here because of Flabébé.
  return w1.localeCompare(w2, "en", { sensitivity: "base" }) === 0;
}

function clearEmptyValues() {
  //resets the output for fields that were left blank
  if (defaultText.includes(inputBoxRaidmon.value)) {
  outputVarRaidmon.innerHTML = "Enter Raid Pokemon.";

  }
  for(let i = 0;i<6;i++){
  if (defaultText.includes(inputBoxTeam[i].value)) {
    outputVarTeam[i].innerHTML = "Enter Your Pokemon.";
  }
  }
}

function judgeEncounter({raidmon="",party=""}){

if(raidStar == 5){
  if(pokeArray.pokemon[pokeIndex[party]].raid5PokemonEasy.includes(raidmon)) return "Easy"
  if(pokeArray.pokemon[pokeIndex[party]].raid5PokemonNormal.includes(raidmon)) return "Neutral"
  if(pokeArray.pokemon[pokeIndex[party]].raid5PokemonHard.includes(raidmon)) return "Hard"
  if(pokeArray.pokemon[pokeIndex[party]].raid5PokemonAvoid.includes(raidmon)) return "Near Impossible"
}

if(raidStar == 6){
  if(pokeArray.pokemon[pokeIndex[party]].raid6PokemonEasy.includes(raidmon)) return "Easy"
  if(pokeArray.pokemon[pokeIndex[party]].raid6PokemonNormal.includes(raidmon)) return "Neutral"
  if(pokeArray.pokemon[pokeIndex[party]].raid6PokemonHard.includes(raidmon)) return "Hard"
  if(pokeArray.pokemon[pokeIndex[party]].raid6PokemonAvoid.includes(raidmon)) return "Near Impossible"
}

return "invalid"

}

function getAdvantage({ teamNumber = 0 }) {
  //for loop pokeRaid(raidStar)Name if name is in raid(raidStar)Pokemon(deficulty)>
  //add pokeRaid(raidStar)Name to array(dificulty)
  //after dificulty raid is made pop any pokemon in lower teirs
  //in reverse stack order.


  typeSuperEffective= pokeArray.pokemon[pokeIndex[teamNumber]].superATK
  typeNormalEffective= pokeArray.pokemon[pokeIndex[teamNumber]].normalATK
  typeNotEffective= pokeArray.pokemon[pokeIndex[teamNumber]].resistATK
  typeImmune= pokeArray.pokemon[pokeIndex[teamNumber]].immuneATK

  for(let i =0;i<typeArray.length;i++){
    if(typeSuperEffective.includes(typeArray[i])){
      teraSuper.push(typeArray[i])
    }
    if(typeNormalEffective.includes(typeArray[i])){
      teraNormalEffective.push(typeArray[i])
    }
    if(typeNotEffective.includes(typeArray[i])){
      teraNotEffective.push(typeArray[i])
    }
    if(typeImmune.includes(typeArray[i])){
      teraImmune.push(typeArray[i])
    }
  }

  let raid5 = [];
  let raid6 = [];

  raid5[easy] = pokeArray.pokemon[pokeIndex[teamNumber]].raid5PokemonEasy;
  raid5[normal] = pokeArray.pokemon[pokeIndex[teamNumber]].raid5PokemonNormal;
  raid5[hard] = pokeArray.pokemon[pokeIndex[teamNumber]].raid5PokemonHard;
  raid5[avoid] = pokeArray.pokemon[pokeIndex[teamNumber]].raid5PokemonAvoid;

  raid6[easy] = pokeArray.pokemon[pokeIndex[teamNumber]].raid6PokemonEasy;
  raid6[normal] = pokeArray.pokemon[pokeIndex[teamNumber]].raid6PokemonNormal;
  raid6[hard] = pokeArray.pokemon[pokeIndex[teamNumber]].raid6PokemonHard;
  raid6[avoid] = pokeArray.pokemon[pokeIndex[teamNumber]].raid6PokemonAvoid;

  for (let difficulty = 0; difficulty <= avoid; difficulty++) {
    if (raidStar == 5) {
      for (let i = 0; i < pokeRaid5Name.length; i++) {
        for (let j = 0; j < raid5[difficulty].length; j++) {
          if (raid5[difficulty][j] == pokeRaid5Name[i])
            encounterArray[difficulty].push(pokeRaid5Name[i]);
        }
      }
    }

    //pokeRaid6Name
    if (raidStar == 6) {
      for (let i = 0; i < pokeRaid6Name.length; i++) {
        for (let j = 0; j < raid6[difficulty].length; j++) {
          if (raid6[difficulty][j] == pokeRaid6Name[i])
            encounterArray[difficulty].push(pokeRaid6Name[i]);
        }
      }
    }
  }
  //convert to set and back to array to pop duplicates
  teraSuper= [...new Set(teraSuper)]
  teraNormalEffective= [...new Set(teraNormalEffective)]
  teraNotEffective= [...new Set(teraNotEffective)]
  teraImmune= [...new Set(teraImmune)]
  encounterArray[easy] = [...new Set(encounterArray[easy])];
  encounterArray[normal] = [...new Set(encounterArray[normal])];
  encounterArray[hard] = [...new Set(encounterArray[hard])];
  encounterArray[avoid] = [...new Set(encounterArray[avoid])];

}

function popArray() {
  //this function runs though the difficulyies and pops entries
  //that are otherwise easer with differnt pokemon
  
  //pop Tera Type list if pokemon exist who are
  //super effective against that that type
  for(let i = 0;i<teraSuper.length;i++){
    removeFromArrayByName({
      list: teraNormalEffective,
      entry: teraSuper[i],
    });
  }

  
  for (let i = 0; i < encounterArray[hard].length; i++) {
    removeFromArrayByName({
      list: encounterArray[avoid],
      entry: encounterArray[hard][i],
    });
  }
  for (let i = 0; i < encounterArray[normal].length; i++) {
    removeFromArrayByName({
      list: encounterArray[avoid],
      entry: encounterArray[normal][i],
    });
    removeFromArrayByName({
      list: encounterArray[hard],
      entry: encounterArray[normal][i],
    });
  }
  for (let i = 0; i < encounterArray[easy].length; i++) {
    removeFromArrayByName({
      list: encounterArray[avoid],
      entry: encounterArray[easy][i],
    });
    removeFromArrayByName({
      list: encounterArray[hard],
      entry: encounterArray[easy][i],
    });
    removeFromArrayByName({
      list: encounterArray[normal],
      entry: encounterArray[easy][i],
    });
  }
}

function removeFromArrayByName({ list = 0, entry = 0 }) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] == entry) {
      list.splice(i, 1);
    }
  }
}

function titleCase(str){
  arr = str.toLowerCase().split(" ")
  for(let i=0; i<arr.length; i++){
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ")
}



