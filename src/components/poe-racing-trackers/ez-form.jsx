import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Form = styled.form`
  label {
    display: block;
  }
`;

export default function EZForm({ label, submitHandler }) {
  const [value, setValue] = useState("");

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setValue(submitHandler(value));
      }}
    >
      <label>{label}</label>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </Form>
  );
}
