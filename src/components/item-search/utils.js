const itemStringToArray = (itemString) => {
  return itemString
    .trim()
    .split("\n")
    .map((a) => a.trim())
    .filter((a) => a !== "--------");
};

export const getMaxLink = (itemString) => {
  const itemArray = itemStringToArray(itemString);

  const a = itemArray.find((a) => a.startsWith("Sockets:"));

  if (!a) {
    return 0;
  }
  const b = a.replace("Sockets: ", "").split(" ");
  console.log("b", b);
};
