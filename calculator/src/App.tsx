import logo from "./logo.svg";
import "./App.css";
import Calculator from "./Calculator";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Calculator />
      </header>
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
}

export default App;
