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
    if (state.currentOperand == null && state.previousOperand == null) {
      return state;
    }

    if (state.previousOperand == null) {
      return {
        ...state,
        operation: action.payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: null,
      };
    }
    return {
      ...state,
      previousOperand: evaluate(state),
      operation: action.payload.operation,
      currentOperand: null,
    };
  }

  if (action.type === ACTIONS.CLEAR) {
    return {};
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

function App() {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const clearScreen = () => {
    dispatch({ type: ACTIONS.CLEAR });
  };

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {state.previousOperand} {state.operation}
        </div>
        <div className="current-operand">{state.currentOperand}</div>
      </div>
      <button className="span-two" onClick={clearScreen}>
        AC
      </button>
      <button>DEL</button>
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
      <button className="span-two">=</button>
    </div>
  );
}

export default App;
