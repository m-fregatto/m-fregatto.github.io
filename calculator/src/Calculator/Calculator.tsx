import React, { useState } from "react";
import "./Calculator.css";
import {
  Button,
  Container,
  Message,
  Segment,
  TextArea,
} from "semantic-ui-react";

enum OperationType {
  Add = "add",
  Subtract = "subtract",
  Multiply = "multiply",
}

export default function Calculator() {
  const [input, setInput] = useState(
    "A add 2 \n print A \nA add 3 \n print A \nB add 9 \nprint B \nquit"
  );
  const [outputs, setOutputs] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const quit = (registers: Record<string, number>, logs: string[]) => {
    logs = [];
    registers = {};
    return;
  };

  const isNumeric = (str: string) =>
    !isNaN(parseFloat(str)) && isFinite(Number(str));

  const isAlphanumeric = (str: string) => /^[a-z0-9]+$/i.test(str);

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

  function isNumber(value?: string | number): boolean {
    return value != null && value !== "" && !isNaN(Number(value.toString()));
  }

  const getValue = (input: string, registers: Record<string, number>) => {
    if (isNumber(input)) {
      return Number(input);
    }
    if (!registers.hasOwnProperty(input)) {
      registers[input] = 0;
    }
    return registers[input];
  };

  const handleCalculation = (
    parts: string[],
    registers: Record<string, number>,
    logs: string[]
  ) => {
    if (parts.length !== 3) {
      logs.push("Wrong amount of parts");
    }
    if (!registers.hasOwnProperty(parts[0])) {
      registers[parts[0]] = 0;
    }
    const operation = parts[1];
    switch (operation) {
      case "add":
        registers[parts[0]] += getValue(parts[2], registers);
        break;
      case "subtract":
        registers[parts[0]] -= getValue(parts[2], registers);
        break;
      case "multiply":
        registers[parts[0]] *= getValue(parts[2], registers);
        break;
    }
  };

  const processInput = (inputValue: string) => {
    const lines = parseInputToCommands(inputValue);

    const outputs: number[] = [];
    const registers: Record<string, number> = {};
    const logs: string[] = [];

    lines.forEach((line) => {
      if (line === "quit") {
        quit(registers, logs);
        return;
      }
      const parts = line.split(/\s+/);

      parts[0] === "print"
        ? outputs.push(registers[parts[1]])
        : handleCalculation(parts, registers, logs);
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
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </Message>
      </Segment>
    </Container>
  );
}
