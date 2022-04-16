const { JSDOM } = require("jsdom");
const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve, _reject) => {
    setTimeout(() => resolve(ms));
  });
}

function getTableForHeading(nodeList, heading) {
  const nodeTextContents = [...nodeList].map((a) => a.textContent);

  const headingIndex = nodeTextContents.indexOf(
    (a) => a.toLowerCase() === heading.toLowerCase()
  );

  return [...nodeList][headingIndex + 1];
}

function parseTable(tbody) {
  console.log("tbody", tbody);
  console.log("tbody.childNodes", [...tbody.childNodes].length);
}

async function getMonsterTypes() {
  return [
    "Ape",
    "Bandit",
    // "Beast",
    "Birdman",
    "Blackguard",
    "Cannibal",
    "Carrion",
    "Chimeral",
    "Construct",
    "Devourer",
    "Elemental",
    "Experimenter",
    "Goatman",
    "Ghost",
    "Hellion",
    "Maw",
    "Miscreation",
    "Necromancer",
    "Plummeting Ursa",
    "Rhoa",
    "Ribbon",
    "Rock Golem",
    "Shield Crab",
    "Siren's Daughter",
    "Skeleton",
    "Snake",
    "Spider",
    "Spiker",
    "Spitter",
    "Statue",
    // "Totem",
    "Undying",
    "Voidbearer",
    "Watcher",
    "Zombie",
  ];
}

async function getMonsterSubTypes() {
  const monsterTypes = await getMonsterTypes();

  const monsterSubTypes = [];

  for (const monsterType of monsterTypes) {
    console.log(`fetching ${monsterType}`);
    const dom = await JSDOM.fromURL(
      `https://www.poewiki.net/wiki/${monsterType}`
    );

    const tempSubTypes = [
      ...dom.window.document.querySelectorAll(
        'td:first-child a[href^="/wiki/"]'
      ),
    ];

    tempSubTypes.forEach((a) => {
      if (a.textContent) {
        const monsterLink = a.getAttribute("href");
        monsterSubTypes.push(
          monsterLink.replace("/wiki/", "").replace("edit/", "")
        );
      }
    });

    console.log(`${monsterType}: ${tempSubTypes.length}`);
  }

  return monsterSubTypes;
}

async function getMonsterDetails(monster) {
  const poedbMonsterName = monster.replace(/[%\d]/g, "");
  const url = `https://poedb.tw/us/${poedbMonsterName}`;

  if (
    [
      "https://poedb.tw/us/Ash,_Frost_and_Storm",
      "https://poedb.tw/us/Elemental_Focus_(passive_skill)",
      "https://poedb.tw/us/Weapon_Elemental_Damage,_Status_Ailment_Chance",
      "https://poedb.tw/us/Elemental_Damage_(passive_skill)",
      "https://poedb.tw/us/Minion_Damage,_Aura_Effect",
      "https://poedb.tw/us/Minion_Damage,_Cast_Speed",
      "https://poedb.tw/us/Minion_Damage,_Mana",
      "https://poedb.tw/us/Minion_Damage,_Skill_Duration",
      "https://poedb.tw/us/Version_..b",
      "https://poedb.tw/us/Version_..",
      "https://poedb.tw/us/Staff",
      "https://poedb.tw/us/Skill",
      "https://poedb.tw/us/Power_Charge",
      "https://poedb.tw/us/Shield",
      "https://poedb.tw/us/Accuracy_Rating",
      "https://poedb.tw/us/Critical_Strike",
      "https://poedb.tw/us/Elemental_Resistance",
      "https://poedb.tw/us/Evasion_Rating",
      "https://poedb.tw/us/Grand_Spectrum_(Viridian_Jewel)",
      "https://poedb.tw/us/Frenzy_Charge",
      "https://poedb.tw/us/Endurance_Charge",
      "https://poedb.tw/us/Lucky",
    ].includes("url")
  ) {
    return [];
  }

  try {
    const dom = await JSDOM.fromURL(url);

    const allDivs = [...dom.window.document.querySelectorAll("div.border")];
    const lifeDivs = allDivs.filter((a) => a.textContent.includes("%Life"));
    const lifePercents = lifeDivs.map((a) =>
      a.textContent.replace("%Life", "")
    );

    return lifePercents.map((a) => {
      return {
        life: parseInt(a, 10),
        url: url,
      };
    });
  } catch (e) {
    console.log("url", url);
    return [];
  }
}

async function main() {
  console.time("whole thing");

  const monsterSubTypes = (await getMonsterSubTypes()).filter(
    (a) => !["Staff"].includes(a)
  );

  const monsterDetails = [];

  let counter = 0;
  for (const monsterSubType of monsterSubTypes) {
    const details = await getMonsterDetails(monsterSubType);
    monsterDetails.push(...details);

    if (counter % 50 === 0) {
      console.log(`${counter++}/${monsterSubTypes.length}`);
      fs.writeFileSync(
        "./desecrate-data.json",
        JSON.stringify(monsterDetails, null, " ")
      );
    }
  }

  const sortedMonsterDetails = [...monsterDetails].sort(
    (a, b) => a.life - b.life
  );
  fs.writeFileSync(
    "./desecrate-data.json",
    JSON.stringify(sortedMonsterDetails, null, " ")
  );
}

main();
