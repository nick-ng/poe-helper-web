import React, { createContext, useContext, useState } from "react";

const GemChoiceContext = createContext();

const useGemChoice = () => {
  const context = useContext(GemChoiceContext);

  if (!context) {
    console.error("useGemChoice must be useed within a GemChoiceProvider");
  }

  return context;
};

const GemChoiceProvider = (props) => {
  const [count, setCount] = useState(0);
};
