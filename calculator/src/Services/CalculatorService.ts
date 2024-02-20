export function isNumber(str: string) {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
}

export function parseInputToCommands(inputValue: string) {
  return inputValue
    .toLowerCase()
    .split("\n")
    .map((line) => line.trim());
}
