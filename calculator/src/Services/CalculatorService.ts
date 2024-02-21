export function isNumber(str: string) {
  return /^-?\d+(\.\d+)?$/.test(str);
}

export function parseInputToCommands(inputValue: string) {
  return inputValue
    .toLowerCase()
    .split("\n")
    .map((line) => line.trim().replace(/\s+/g, " "));
}
