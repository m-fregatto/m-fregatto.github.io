import React, { useCallback, useState } from "react";
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

interface Operation {
  type: OperationType;
  value: number | string;
}

interface Register {
  value: number;
  operations: Operation[];
}

const Calculator: React.FC = () => {
  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [registers, setRegisters] = useState<Record<string, Register>>({});
  const [printCommands, setPrintCommands] = useState<string[]>([]);

  const isNumeric = (str: string) =>
    !isNaN(parseFloat(str)) && isFinite(Number(str));

  const isAlphanumeric = (str: string) => /^[a-z0-9]+$/i.test(str);

  const clearVariables = () => {
    setOutputs([]);
    setLogs([]);
    setRegisters({});
    setPrintCommands([]);
  };

  const clearCalculator = () => {
    setInput("");
    clearVariables();
  };

  const processInput = () => {
    if (input === "") {
      logError(`Empty input. Nothing to calculate.`);
      return;
    }

    const lines = input
      .toLowerCase()
      .split("\n")
      .map((line) => line.trim());

    lines.forEach((line) => {
      const parts = line.split(/\s+/);

      if (line === "quit") {
        setOutputs([]);
        printCommands.forEach((registerName) => {
          const result = evaluate(registerName, { ...registers });
          setOutputs((prevOutputs) => [...prevOutputs, result]);
        });
        return;
      }

      if (parts[0] === "print" && parts.length === 2) {
        const registerName = parts[1];
        setPrintCommands((printCommands) => [...printCommands, registerName]);
        console.log("my_prints:", printCommands);
      } else if (parts.length === 3) {
        const [registerName, command, operand] = parts;
        if (Object.values(OperationType).includes(command as OperationType)) {
          if (!isNumeric(operand) && !isAlphanumeric(operand)) {
            logError(`Invalid operand: ${line}`);
            return;
          }
          handleOperation(registerName, command as OperationType, operand);
        } else {
          logError(`Invalid operation: ${line}`);
        }
      } else {
        logError(`Invalid command format: ${line}`);
      }
    });
  };

  const handleOperation = (
    registerName: string,
    operation: OperationType,
    operand: string
  ) => {
    if (!registers[registerName]) {
      registers[registerName] = { value: 0, operations: [] };
    }

    const value = isNumeric(operand) ? Number(operand) : operand;
    registers[registerName].operations.push({ type: operation, value });
  };

  const evaluate = (
    registerName: string,
    localRegisters: Record<string, Register>
  ): number => {
    const register = localRegisters[registerName];

    if (!register) {
      logError(`Register ${registerName} not found.`);
      return 0;
    }

    return register.operations.reduce((acc, operation) => {
      const operandValue =
        typeof operation.value === "string"
          ? evaluate(operation.value, localRegisters)
          : operation.value;
      switch (operation.type) {
        case OperationType.Add:
          return acc + operandValue;
        case OperationType.Subtract:
          return acc - operandValue;
        case OperationType.Multiply:
          return acc * operandValue;
        default:
          return acc;
      }
    }, register.value);
  };

  const logError = (message: string) => {
    console.error(message);
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  // TODO: check if this imput change is correct
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleCalculate = useCallback(() => {
    clearVariables();
    processInput();
  }, []);

  return (
    <Container className="container">
      <Segment className="segment">
        <TextArea
          placeholder="Enter calculation"
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
          onClick={handleCalculate}
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
          <p>{logs.join(", ")}</p>
        </Message>
      </Segment>
    </Container>
  );
};

export default Calculator;
