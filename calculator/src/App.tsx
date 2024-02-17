import logo from "./logo.svg";
import "./App.css";
import Calculator from "./Calculator/Calculator";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <header className="App-header">
        <Calculator />
      </header>
    </div>
  );
}

export default App;
