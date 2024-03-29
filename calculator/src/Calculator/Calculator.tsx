import React, { useCallback, useRef, useState } from "react";
import "./Calculator.css";
import { Button, Form, Message, Segment, TextArea } from "semantic-ui-react";
import { FileInput } from "../FileInputComponent/FileInputComponent";
import { isNumber, parseInputToCommands } from "../Services/CalculatorService";

type SupportedOperation = "add" | "subtract" | "multiply";

type Operation = {
  op: string;
  value: string | number;
};

type Register = Record<string, Operation[]>;

const VALID_OPERATIONS: SupportedOperation[] = ["add", "subtract", "multiply"];
const VALID_FILE_FORMATS = [".txt"];
const MAX_FILE_SIZE_2MB = 2 * 1024 * 1024;
const MAX_RECURSIVE_DEPTH = 20;

export default function Calculator() {
  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState<number[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputWrapperRef = useRef<HTMLDivElement>(null);

  const clearCalculator = () => {
    setInput("");
    setOutputs([]);
    setLogs([]);
    if (fileInputWrapperRef.current) {
      const input = fileInputWrapperRef.current.querySelector("input");
      if (input) {
        input.value = "";
      }
    }
  };

  const processInput = useCallback(
    (inputValue: string, isFileInput = false) => {
      if (inputValue.trim().length === 0) {
        setLogs(["Please enter an input"]);
        return;
      }
      const lines = parseInputToCommands(inputValue);

      const outputs: number[] = [];
      let registers: Register = {};
      const logs: string[] = [];
      let lineNumber = 1;

      for (let line of lines) {
        if (line.trim().length === 0) {
          logs.push(`Line ${lineNumber} is empty and was ignored.`);
          continue;
        }

        if (!isFileInput && line.trim() === "quit") {
          registers = {};

          if (lineNumber < lines.length) {
            const remainingLines = lines
              .slice(lineNumber)
              .map((l) => (l === "" ? "EMPTY LINE" : l))
              .join(", ");

            logs.push(
              `The following lines after quit will be ignored: ${remainingLines}`
            );
          }
          break;
        }

        const parts = line.split(/\s+/);

        parts[0] === "print"
          ? outputs.push(evaluateRegister(parts[1], registers, logs, 0))
          : handleCalculation(parts, registers, logs, lineNumber);
        lineNumber++;
      }

      setLogs(logs);
      setOutputs(outputs);
    },
    [handleCalculation]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const logError = useCallback((message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }

      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !VALID_FILE_FORMATS.includes("." + fileExtension)) {
        logError(`Unsupported file format: ${fileExtension}`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_2MB) {
        logError(`File size exceeds the limit of 2MB: ${file.name}`);
        return;
      }

      const reader = new FileReader();
      reader.onerror = (error) => {
        logError(`File read error: ${error}`);
      };
      reader.onload = (e) => {
        const text = (e.target as FileReader).result;
        if (typeof text === "string") {
          processInput(text, true);
        }
      };
      reader.readAsText(file);
    },

    [logError, processInput]
  );

  return (
    <Segment raised className="segment">
      <Form>
        <TextArea
          placeholder="Enter calculation: <register> <operation> <value>"
          className="textArea"
          value={input}
          maxLength={200}
          onChange={handleInputChange}
        />
      </Form>
      <Button
        disabled={input === "" ? true : false}
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
      <FileInput
        wrapperRef={fileInputWrapperRef}
        onFileSelected={handleFileChange}
        acceptedFormats={VALID_FILE_FORMATS}
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
  );
}

export function evaluateRegister(
  register: string,
  registers: Register,
  logs: string[],
  depth: number
): number {
  if (depth >= MAX_RECURSIVE_DEPTH) {
    logs.push(
      `Maximum recursive depth (${MAX_RECURSIVE_DEPTH}) for lazy loading reached. Possibly missing a value for a register.`
    );
    return 0;
  }
  if (!registers[register]) {
    logs.push(`Attempted to evaluate undefined register '${register}'.`);
    return 0;
  }

  if (!registers[register] || registers[register].length === 0) {
    return 0;
  }

  depth++;

  return registers[register].reduce((acc, { op, value }) => {
    let operand =
      typeof value === "number"
        ? value
        : evaluateRegister(value, registers, logs, depth);
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
}

export function handleCalculation(
  parts: string[],
  registers: Register,
  logs: string[],
  lineNumber: number
): void {
  if (parts.length !== 3) {
    logs.push(
      `Error: line ${lineNumber} has an incorrect format. Expected format: '<register> <operation> <value>'.`
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
}
