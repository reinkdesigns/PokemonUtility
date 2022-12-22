const outputVar = document.getElementById("outputDiv");
const clickbtn = document.getElementById("inputBtn");
const inputBox = document.getElementById("inputDiv");
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
  myPokemon = inputBox.value;
  if (!pokeName.includes(myPokemon)) {
    outputVar.innerHTML = "Unable to find Pokemon, Please Check Spelling.";
    return
  }
  outputVar.innerHTML = "Pokemon Found!";
  raidStar = 5;
  getPokemon = pokeName.indexOf(myPokemon.toLowerCase());
  getRaidResults({ attackingPokemon: getPokemon });
  say(`You Pokemon ${myPokemon}`);
  say(raidPokemon5StarArray);
  say(raidPokemon6StarArray);
  say(raidStar);

}




function getRaidResults({ attackingPokemon = "ditto" }) {
  let raidPokemonList = "";
  let myTeamPokemon = pokeType[attackingPokemon];
  let teraType = "normal";
  let damage = 0;
  if (raidStar == 5) {
    raidPokemonList = pokeRaid5Type;
    pokeRaidName = pokeRaid5Name;
  }
  if (raidStar == 6) {
    raidPokemonList = pokeRaid6Type;
    pokeRaidName = pokeRaid6Name;
  }

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



  //take pokemon
  //compair aginst every raid encounter + tera type
  //return results

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

      count++;
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
    // pokeLength = pokeRaid5Name.length;
    // let raidPokemonList = pokeRaid5Type;
    pokeRaidName = pokeRaid5Name;
    raidPokemon5StarArray[damageIndex][indexPokemon] = {
      name: pokeRaidName[indexPokemon],
      damage: damage,
    };
    return;
  }
  if (star == 6) {
    // pokeLength = pokeRaid6Name.length;
    // let raidPokemonList = pokeRaid6Type;
    pokeRaidName = pokeRaid6Name;
    raidPokemon6StarArray[damageIndex][indexPokemon] = {
      name: pokeRaidName[indexPokemon],
      damage: damage,
    };
    return;
  }
}