import { evaluateRegister, handleCalculation } from "../Calculator/Calculator";

describe("evaluateRegister", () => {
  it("should return evaluate add operation correctly", () => {
    const registers = {
      a: [{ op: "add", value: 10 }],
      b: [
        { op: "add", value: "a" },
        { op: "add", value: 1 },
      ],
    };
    const logs = [];
    const result = evaluateRegister("b", registers, logs, 0);
    expect(result).toBe(11);
    expect(logs).toEqual([]);
  });

  it("should evaluate multiply operation correctly", () => {
    const registers = {
      a: [
        { op: "add", value: 20 },
        { op: "multiply", value: 2 },
      ],
    };
    const logs = [];
    const result = evaluateRegister("a", registers, logs, 0);
    expect(result).toBe(40);
    expect(logs).toEqual([]);
  });

  it("should return 0 to avoid endless recursion", () => {
    const registers = {
      a: [{ op: "add", value: "b" }],
      b: [{ op: "add", value: "a" }],
    };
    const logs = [];
    const result = evaluateRegister("b", registers, logs, 0);
    expect(result).toBe(0);
    expect(logs).toEqual([
      "Maximum recursive depth (20) for lazy loading reached. Possibly missing a value for a register.",
    ]);
  });

  it("should return 0 to deal with registers as values", () => {
    const registers = {
      result: [
        { op: "add", value: "revenue" },
        { op: "subtract", value: "costs" },
      ],
      revenue: [{ op: "add", value: 200 }],
      costs: [
        { op: "add", value: "salaries" },
        { op: "add", value: 10 },
      ],
      salaries: [
        { op: "add", value: 20 },
        { op: "multiply", value: 5 },
      ],
    };
    const logs = [];
    const result = evaluateRegister("result", registers, logs, 0);
    expect(result).toBe(90);
    expect(logs).toEqual([]);
  });
});

describe("handleCalculation", () => {
  it("should log an error for incorrect input format", () => {
    const logs = [];
    const registers = {};
    const parts = ["register", "add"];

    handleCalculation(parts, registers, logs, 1);

    expect(logs).toContainEqual(
      `Error: line 1 has an incorrect format. Expected format: '<register> <operation> <value>'.`
    );
  });

  it("should handle valid operations and update registers", () => {
    const logs = [];
    const registers = {};
    const parts = ["register1", "add", "10"];

    handleCalculation(parts, registers, logs, 2);

    expect(registers["register1"]).toEqual([{ op: "add", value: 10 }]);
    expect(logs).toHaveLength(0);
  });

  it("should log an error for unsupported operations", () => {
    const logs = [];
    const registers = {};
    const parts = ["register2", "exponentiation", "5"];

    handleCalculation(parts, registers, logs, 3);

    expect(logs).toContainEqual(
      `Line 3: Unsupported operation 'exponentiation' was ignored`
    );
    expect(registers).not.toHaveProperty("register2");
  });
});
