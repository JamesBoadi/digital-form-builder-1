import React, { useState } from "react";
import SimpleEditor from "react-simple-code-editor";
import core from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

const Editor = (props) => {
  const [value, setValue] = useState(props.value || "");
  const [name, setName] = useState("");

  const setState = (state, callback) => {
    props.setState(state, callback);
    if (state.value && props.valueCallback) {
      props.valueCallback(state.value);
    }
  };
  return (
    <SimpleEditor
      textareaId={props.id}
      name={name}
      className="editor"
      value={value}
      required={props.required}
      highlight={(code) => core.highlight(code, core.languages.js)}
      onValueChange={(value) => setState({ value })}
      padding={5}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        border: "2px solid #0b0c0c",
        fontSize: 16,
      }}
    />
  );
};

export default Editor;