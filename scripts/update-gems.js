const { JSDOM } = require("jsdom");
const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve, _reject) => {
    setTimeout(() => resolve(ms));
  });
}

async function getGemUrls() {
  const dom = await JSDOM.fromURL("https://poedb.tw/us/Gem");

  const nodeList = [
    ...dom.window.document.querySelectorAll(
      "a.gem_red, a.gem_green, a.gem_blue"
    ),
  ];

  return nodeList.map((n) => n.getAttribute("href"));
}

async function getGemInfo(gemUrl) {
  const url = `https://poedb.tw${gemUrl}`;
  const dom = await JSDOM.fromURL(url);
  const gem = gemUrl.replace("/us/", "");

  const nodeList = [
    ...dom.window.document.querySelectorAll("div[id^=GemQuest] table tr"),
  ];
  const tableContents = nodeList.map((tableRow) => {
    const tableCells = tableRow.childNodes;
    return [...tableCells].map((a) => a.textContent);
  });

  const [_headingRow, ...data] = tableContents;

  return data.map((row) => {
    if (row[2] === "Quest Reward") {
      return {
        gem,
        type: "reward",
        act: row[0],
        quest: row[1],
        classes: row[3].split(" ").filter((a) => a),
      };
    }

    return {
      gem,
      type: "vendor",
      act: row[0],
      quest: row[1],
      classes: row[3].split(" ").filter((a) => a),
    };
  });
}

async function main() {
  console.time("whole thing");
  const urls = await getGemUrls();

  const gemInfo = [];

  let count = 0;
  for (const url of urls) {
    count++;
    console.log("requesting from ", url, count, "/", urls.length);
    if (
      url.toLowerCase().includes("vaal") ||
      url.toLowerCase().includes("awakened")
    ) {
      continue;
    }
    console.time(url);
    const a = await getGemInfo(url);
    console.timeEnd(url);
    gemInfo.push(...a);
    sleep(300);
  }

  fs.writeFileSync("./gem-data.json", JSON.stringify(gemInfo, null, " "));
  console.timeEnd("whole thing");
}

main();
