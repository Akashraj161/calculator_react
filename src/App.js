import "./index.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

const defaultState = {
  currentOperand: "",
  previousOperand: "",
  operation: "",
};

export const ACTIONS = {
  ADD_DIGIT: "ADD_DIGIT",
  CHOOSE_OPERATION: "CHOOSE_OPERATION",
  CLEAR: "CLEAR",
  DELETE_DIGIIT: "DELETE_DIGIT",
  EVALUATE: "EVALUATE",
};

const reducer = (state, action) => {
  if (action.type === ACTIONS.ADD_DIGIT) {
    if (state.overwrite) {
      return {
        ...state,
        currentOperand: action.payload.digit,
        overwrite: false,
      };
    }
    if (action.payload.digit === "0" && state.currentOperand === "0")
      return state;
    if (action.payload.digit === "." && state.currentOperand.includes("."))
      return state;
    return {
      ...state,
      currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
    };
  }

  if (action.type === ACTIONS.CHOOSE_OPERATION) {
    if (state.currentOperand === "" && state.previousOperand === "") {
      return state;
    }

    if (state.previousOperand === "") {
      return {
        ...state,
        operation: action.payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: "",
      };
    }

    if (state.currentOperand === "") {
      return {
        ...state,
        operation: action.payload.operation,
      };
    }

    return {
      ...state,
      previousOperand: evaluate(state),
      operation: action.payload.operation,
      currentOperand: "",
    };
  }

  if (action.type === ACTIONS.EVALUATE) {
    if (
      state.previousOperand === "" ||
      state.currentOperand === "" ||
      state.operation === ""
    ) {
      return state;
    }
    return {
      ...state,
      overwrite: true,
      currentOperand: evaluate(state),
      previousOperand: "",
      operation: "",
    };
  }

  if (action.type === ACTIONS.DELETE_DIGIIT) {
    if (state.currentOperand === "") {
      return state;
    }
    if (state.currentOperand.length === 1) {
      return {
        ...state,
        currentOperand: "",
      };
    }
    if (state.overwrite) {
      return {
        ...state,
        overwrite: false,
        currentOperand: "",
      };
    }

    return {
      ...state,
      currentOperand: state.currentOperand.slice(0, -1),
    };
  }

  if (action.type === ACTIONS.CLEAR) {
    return {
      currentOperand: "",
      previousOperand: "",
      operation: "",
    };
  }
};

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) {
    return "";
  }
  let computation = "";
  switch (operation) {
    case "/":
      computation = prev / curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    default:
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formateOperand(operand) {
  if (operand === "") return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const evaluateNum = () => {
    dispatch({ type: ACTIONS.EVALUATE });
  };

  const deleteDigit = () => {
    dispatch({ type: ACTIONS.DELETE_DIGIIT });
  };

  const clearScreen = () => {
    dispatch({ type: ACTIONS.CLEAR });
  };

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formateOperand(state.previousOperand)} {state.operation}
        </div>
        <div className="current-operand">
          {formateOperand(state.currentOperand)}
        </div>
      </div>
      <button className="span-two" onClick={clearScreen}>
        AC
      </button>
      <button onClick={deleteDigit}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={evaluateNum}>
        =
      </button>
    </div>
  );
}

export default App;
