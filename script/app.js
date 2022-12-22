const outputVar = document.getElementById("outputDiv");
const outputVarType = document.getElementById("outputDivType");
const outputVarPokemon = document.getElementById("outputDivPokemon");
const clickbtn = document.getElementById("inputBtn");
const inputBox = document.getElementById("inputDiv");
const raidRadio = document.getElementsByName('raidLevel')
const pokeName = pokeArray.pokemon.map((x) => x.name.toLowerCase());
const pokeType = pokeArray.pokemon.map((x) => x.type);
const pokeRaid5Name = raidPokemon5.pokemon.map((x) => x.name.toLowerCase());
const pokeRaid5Type = raidPokemon5.pokemon.map((x) => x.type);
const pokeRaid6Name = raidPokemon6.pokemon.map((x) => x.name.toLowerCase());
const pokeRaid6Type = raidPokemon6.pokemon.map((x) => x.type);
const talk = console.log;
const devLog = 1;

let count = 0;
let raidDamage = 1;
let myDamage = 1;
let myPokemon = "iron hands";
let raidStar = 5;
let raidPokemon5StarArray = [[]];
let raidPokemon6StarArray = [[]];

clickbtn.addEventListener("click", function () {
  runScript();
});

inputBox.addEventListener("keyup", function(event) {
  // event.preventDefault();
  if (event.key === 'Enter') {
    clickbtn.click();
  }
});


function runScript() {
  raidDamage = 1;
  myDamage = 1;
  for(i = 0; i < raidRadio.length; i++) {
    if(raidRadio[i].checked) raidStar = raidRadio[i].value;
  }



  
  myPokemon = inputBox.value.toLowerCase();
  if (!pokeName.includes(myPokemon)) {
    outputVar.innerHTML = "Unable to find Pokemon, Please Check Spelling.";
    return
  }
  outputVar.innerHTML = "Pokemon Found!";
  let teraEasy =""
  let teraHard =""
  let holdingEasy =""
  let holdingMedium =""
  let holdingHard =""

  getPokemon = pokeName.indexOf(myPokemon);
  getRaidResults({ attackingPokemon: getPokemon });
  say(`You Pokemon ${myPokemon}`);

  for(let i=0;i<raidPokemon5StarArray[0].length;i++){
    if(raidPokemon5StarArray[0][i].damage>1) teraEasy +=`<br>${raidPokemon5StarArray[0][i].name}`
    if(raidPokemon5StarArray[0][i].damage<=.5) teraHard +=`<br>${raidPokemon5StarArray[0][i].name}`
  }

  if(raidStar == 5){
  for(let i=0;i<raidPokemon5StarArray[1].length;i++){
    if(raidPokemon5StarArray[1][i].damage<1) holdingEasy +=`<br>${raidPokemon5StarArray[1][i].name}`
    if(raidPokemon5StarArray[1][i].damage==1) holdingMedium +=`<br>${raidPokemon5StarArray[1][i].name}`
    if(raidPokemon5StarArray[1][i].damage>1) holdingHard +=`<br>${raidPokemon5StarArray[1][i].name} ----------  Damage: x${raidPokemon5StarArray[1][i].damage}`
  }
  }

  if(raidStar == 6){
    for(let i=0;i<raidPokemon6StarArray[1].length;i++){   
      if(raidPokemon6StarArray[1][i].damage<1) {
        holdingEasy += `<br>${raidPokemon6StarArray[1][i].name}`
        say(raidPokemon6StarArray[1][i].name)
      }
      if(raidPokemon6StarArray[1][i].damage==1) holdingMedium += `<br>${raidPokemon6StarArray[1][i].name}`
      if(raidPokemon6StarArray[1][i].damage>1) holdingHard += `<br>${raidPokemon6StarArray[1][i].name} ----------  Damage: x${raidPokemon6StarArray[1][i].damage}`
    }

    }
    outputVarType.innerHTML=`Results<br><br>These are the Tera Types you should be looking for.${teraEasy}<br><br>These are the Tera Types you should avoid.${teraHard}<br><br>These Pokemon should be very easy with the proper tera type.${holdingEasy}<br><br>These Pokemon may give a little trouble if tera type has resistance.${holdingMedium}<br><br>These Pokemon should be AVOIDED!${holdingHard}`
    // outputVarType.innerHTML=holdingVar

    say("Raid Star Level 5");
    say(raidPokemon5StarArray);
    say("Raid Star Level 6");
    say(raidPokemon6StarArray);

}




function getRaidResults({ attackingPokemon = "ditto" }) {
  let myTeamPokemon = pokeType[attackingPokemon];
  let teraType = "normal";
  let damage = 0;

  for (let i = 0; i < 2; i++) {
    raidPokemon5StarArray[i] = [];
    raidPokemon6StarArray[i] = [];
  }

  for (let i = 0; i < typeArray.length; i++) {
    teraType = typeArray[i];

    damage = myAttack({
      attacker: myTeamPokemon,
      defender: teraType,
    });
    writeRaidData({
      tera: i,
      damage,
    });
  }

  for (let i = 0; i < pokeRaid5Type.length; i++) {
    damage = raidAttack({
      attacker: pokeRaid5Type[i],
      defender: myTeamPokemon,
    });
    writeRaidData({
      indexPokemon: i,
      damageIndex: 1,
      damage,
      star:5,
    });
  }

  for (let i = 0; i < pokeRaid6Type.length; i++) {
    damage = raidAttack({
      attacker: pokeRaid6Type[i],
      defender: myTeamPokemon,
    });

    writeRaidData({
      indexPokemon: i,
      damageIndex: 1,
      damage,
      star:6,
    });
  }

  return;
}

function raidAttack({ attacker = pokeType[""], defender = pokeType[""] }) {
  if (attacker[0] == "ditto") return 0;
  let damage = [];

  for (let i = 0; i < attacker.length; i++) {
    damage[i] = 1;
    for (let j = 0; j < defender.length; j++) {
      typeHolder = attacker[i];
      result = getHit({ type: typeHolder, compair: defender[j] });
      damage[i] *= result;
    }
  }
  return Math.max(...damage);
}

function myAttack({ attacker = pokeType[""], defender = "" }) {
  let damage = [0, 0];
  for (i = 0; i < attacker.length; i++) {
    result = getHit({ type: attacker[i], compair: defender });
    damage[i] = result;
  }
  return Math.max(...damage);
}

function getHit({ type, compair }) {
  if (this[type.toLowerCase() + "Strong"].includes(compair)) {

    return 2;
  }
  if (this[type.toLowerCase() + "Weak"].includes(compair)) {
    return 0.5;
  }
  if (this[type.toLowerCase() + "Immune"].includes(compair)) {

    return 0;
  }
  return 1;
}

function say(text) {
  if (devLog) console.log(text);
}

function writeRaidData({
  tera = -1,
  indexPokemon = 0,
  damageIndex = 0,
  damage = 0,
  star = 5,
}) {

  if (tera > -1) {
    raidPokemon5StarArray[damageIndex][tera] = {
      name: typeArray[tera],
      damage: damage,
    };
    raidPokemon6StarArray[damageIndex][tera] = {
      name: typeArray[tera],
      damage: damage,
    };
    return;
  }

  if (star == 5) {
    pokeRaidName = pokeRaid5Name;
    raidPokemon5StarArray[damageIndex][indexPokemon] = {
      name: pokeRaidName[indexPokemon],
      damage: damage,
    };
    return;
  }
  if (star == 6) {
    pokeRaidName = pokeRaid6Name;
    raidPokemon6StarArray[damageIndex][indexPokemon] = {
      name: pokeRaidName[indexPokemon],
      damage: damage,
    };
    return;
  }
}
