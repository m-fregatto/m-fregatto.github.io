import { evaluateRegister } from "../Calculator/Calculator";

describe("evaluateRegister_add", () => {
  it("should return 11", () => {
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
});

describe("evaluateRegister_endless_recursion", () => {
  it("should return a", () => {
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
});
