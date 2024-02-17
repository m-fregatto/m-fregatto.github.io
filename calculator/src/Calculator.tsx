import React, { useState } from "react";
import { Container, Input, Message, Segment } from "semantic-ui-react";

interface Register {
  [key: string]: number | string; // TODO: check if string is necessary here
}

//TODO maybe swap to no React.FC
const Calculator: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [registers, setRegisters] = useState<Register>({});
  const [logs, setLogs] = useState<string[]>([]);

  const processInput = () => {
    const lines = input
      .split("\n")
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line);

    lines.forEach((line) => {
      // TODO:  Update registers and output
      // TODO: fix setLogs to log invalid commands
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleExecuteClick = () => {
    processInput();
  };

  return (
    <Container>
      <Segment>
        <Input
          action={{
            color: "teal",
            labelPosition: "right",
            icon: "calculator",
            content: "Calculate",
            onchange: handleInputChange,
            onClick: handleExecuteClick,
          }}
          defaultValue="Enter calculation"
        />
        <Message>
          <Message.Header>Output</Message.Header>
          <p>{output}</p>
        </Message>
      </Segment>
      <Segment>
        <Message>
          <Message.Header>Logs</Message.Header>
          <p>{logs.join(", ")}</p>
        </Message>
      </Segment>
    </Container>
  );
};

export default Calculator;
