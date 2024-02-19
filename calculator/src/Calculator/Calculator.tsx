import React, { useState } from "react";
import "./Calculator.css";
import {
  Button,
  Container,
  Message,
  Segment,
  TextArea,
} from "semantic-ui-react";

type SupportedOperation = "add" | "subtract" | "multiply";

type Operation = {
  op: string;
  value: string | number;
};

type Register = Record<string, Operation[]>;

export default function Calculator() {
  const [input, setInput] = useState(
    "A add 2 \n print A \nA add 3 \n print A \nB add 9 \nprint B \nquit"
  );
  const [outputs, setOutputs] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const VALID_OPERATIONS: SupportedOperation[] = [
    "add",
    "subtract",
    "multiply",
  ];

  const quit = (registers: Register, logs: string[]) => {
    logs = [];
    registers = {};
    return;
  };

  const isNumber = (str: string) =>
    !isNaN(parseFloat(str)) && isFinite(Number(str));

  const clearCalculator = () => {
    setInput("");
    setOutputs([]);
    setLogs([]);
  };

  const parseInputToCommands = (inputValue: string) => {
    return inputValue
      .toLowerCase()
      .split("\n")
      .map((line) => line.trim());
  };

  const evaluateRegister = (register: string, registers: Register): number => {
    if (!registers[register] || registers[register].length === 0) {
      return 0;
    }

    return registers[register].reduce((acc, { op, value }) => {
      let operand =
        typeof value === "number" ? value : evaluateRegister(value, registers);
      switch (op) {
        case "add":
          return acc + operand;
        case "subtract":
          return acc - operand;
        case "multiply":
          return acc * operand;
        default:
          return acc;
      }
    }, 0);
  };

  const handleCalculation = (
    parts: string[],
    registers: Register,
    logs: string[],
    lineNumber: number
  ) => {
    if (parts.length !== 3) {
      logs.push(
        `Line ${lineNumber} has an incorrect format. Expected format: '<register> <operation> <value>'.`
      );
      return;
    }

    const [register, operation, value] = parts;

    if (!VALID_OPERATIONS.includes(operation as SupportedOperation)) {
      logs.push(
        `Line ${lineNumber}: Unsupported operation '${operation}' was ignored`
      );
      return;
    }

    if (!registers[register]) {
      registers[register] = [];
    }

    registers[register].push({
      op: operation,
      value: isNumber(value) ? Number(value) : value,
    });
  };

  const processInput = (inputValue: string) => {
    if (inputValue.trim().length === 0) {
      setLogs(["Please enter an input"]);
      return;
    }
    const lines = parseInputToCommands(inputValue);

    const outputs: number[] = [];
    const registers: Register = {};
    const logs: string[] = [];
    let lineNumber = 0;

    lines.forEach((line) => {
      lineNumber++;
      if (line.trim().length === 0) {
        logs.push(`Line ${lineNumber} is empty and was ignored.`);
        return;
      }

      if (line.trim() === "quit") {
        quit(registers, logs);
        return;
      }

      const parts = line.split(/\s+/);

      parts[0] === "print"
        ? outputs.push(evaluateRegister(parts[1], registers))
        : handleCalculation(parts, registers, logs, lineNumber);
    });
    setLogs(logs);
    setOutputs(outputs);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  return (
    <Container className="container">
      <Segment className="segment">
        <TextArea
          placeholder="Enter calculation: <register> <operation> <value>"
          className="textArea"
          value={input}
          maxLength={200}
          onChange={handleInputChange}
        />
        <Button
          color="teal"
          content="Calculate"
          icon="calculator"
          labelPosition="right"
          onClick={() => processInput(input)}
          className="calculateButton"
          style={{ marginTop: "10px" }}
        />
        <Button
          color="red"
          icon="delete"
          content="Clear"
          labelPosition="right"
          onClick={clearCalculator}
          style={{ marginTop: "10px" }}
        />
        <Message>
          <Message.Header>Output</Message.Header>
          {outputs.map((output, index) => (
            <p key={index}>{output}</p>
          ))}
        </Message>
        <Message>
          <Message.Header>Logs</Message.Header>
          {logs.length > 0 && <p>Error:</p>}
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </Message>
      </Segment>
    </Container>
  );
}
