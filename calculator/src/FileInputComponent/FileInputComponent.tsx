import React from "react";
import { Input, Label, Message } from "semantic-ui-react";

interface IProps {
  onFileSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  acceptedFormats: string[];
  wrapperRef: React.RefObject<HTMLDivElement>;
}

export const FileInput: React.FunctionComponent<IProps> = (props) => {
  const acceptString = props.acceptedFormats.join(",");

  return (
    <Message>
      <Label
        size="large"
        pointing="below"
        color="blue"
        content="Upload a txt file to calculate"
      />
      <div ref={props.wrapperRef}>
        <Input
          icon="upload"
          iconPosition="left"
          type="file"
          id="fileInput"
          onChange={props.onFileSelected}
          accept={acceptString}
        />
      </div>
    </Message>
  );
};
