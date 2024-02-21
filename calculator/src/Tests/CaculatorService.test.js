import { isNumber, parseInputToCommands } from "../Services/CalculatorService";

describe("isNumber", () => {
  it("should return true for valid numbers", () => {
    expect(isNumber("123")).toBeTruthy();
    expect(isNumber("4.56")).toBeTruthy();
    expect(isNumber("-78.9")).toBeTruthy();
    expect(isNumber("0")).toBeTruthy();
  });

  it("should return false for non-numeric strings", () => {
    expect(isNumber("abc")).toBeFalsy();
    expect(isNumber("123abc")).toBeFalsy();
    expect(isNumber("")).toBeFalsy();
    expect(isNumber(" ")).toBeFalsy();
  });

  it("should return false for strings with numeric format but non-numeric characters", () => {
    expect(isNumber("1e2")).toBeFalsy();
    expect(isNumber("Infinity")).toBeFalsy();
    expect(isNumber("NaN")).toBeFalsy();
  });

  it("should return false for hexadecimal and binary notations", () => {
    expect(isNumber("0xFF")).toBeFalsy();
    expect(isNumber("0b1010")).toBeFalsy();
  });

  it("should return false for very large and very small numbers", () => {
    expect(isNumber("1e+50")).toBeFalsy();
    expect(isNumber("-1e-50")).toBeFalsy();
  });
});

describe("parseInputToCommands", () => {
  it("should split input into lines and trim whitespace", () => {
    const input = "ADD 5\nSubtract 3 \n Multiply 2";
    const expected = ["add 5", "subtract 3", "multiply 2"];
    expect(parseInputToCommands(input)).toEqual(expected);
  });

  it("should convert mixed case commands to lowercase", () => {
    const input = "AdD 5\nSuBtrAct 3";
    const expected = ["add 5", "subtract 3"];
    expect(parseInputToCommands(input)).toEqual(expected);
  });

  it("should handle empty lines gracefully", () => {
    const input = "\nADD 10\n\nSubtract 2\n";
    const expected = ["", "add 10", "", "subtract 2", ""];
    expect(parseInputToCommands(input)).toEqual(expected);
  });

  it("should convert all characters to lowercase", () => {
    const input = "Add 10\nSubtract 5\nMULTIPLY 3";
    const expected = ["add 10", "subtract 5", "multiply 3"];
    expect(parseInputToCommands(input)).toEqual(expected);
  });

  it("should return an empty array for an empty string input", () => {
    const input = "";
    const expected = [""];
    expect(parseInputToCommands(input)).toEqual(expected);
  });

  it("should trim extra spaces between commands and arguments", () => {
    const input = "add     10\n  subtract   2  ";
    const expected = ["add 10", "subtract 2"];
    expect(parseInputToCommands(input)).toEqual(expected);
  });

  it("should include special characters in commands", () => {
    const input = "add! 10\nsubtract# 2";
    const expected = ["add! 10", "subtract# 2"];
    expect(parseInputToCommands(input)).toEqual(expected);
  });

  it("should handle unicode characters in input", () => {
    const input = "加 10\n减去 2";
    const expected = ["加 10", "减去 2"];
    expect(parseInputToCommands(input)).toEqual(expected);
  });
});
