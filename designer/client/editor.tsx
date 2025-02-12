import React, { Component } from "react";
import SimpleEditor from "react-simple-code-editor";
import core from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

interface Props {
  id?: string;
  value: string;
  name?: string;
  required?: boolean;
  valueCallback: any;
}

export default class Editor extends Component<Props, { value: any }> {
  state = { value: this.props.value || "" };

  setState(state, callback) {
    super.setState(state, callback);
    if (state.value && this.props.valueCallback) {
      this.props.valueCallback(state.value);
    }
  }

  render() {
    return (
      <SimpleEditor
        textareaId={this.props.id}
        name={this.props.name}
        className="editor"
        value={this.state.value}
        required={this.props.required}
        highlight={(code) => core.highlight(code, core.languages.js)}
        onValueChange={(value) => this.setState({ value })}
        padding={5}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          border: "2px solid #0b0c0c",
          fontSize: 16,
        }}
      />
    );
  }
}