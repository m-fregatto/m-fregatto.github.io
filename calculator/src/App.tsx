import logo from "./logo.svg";
import "./App.css";
import Calculator from "./Calculator/Calculator";
import { Grid } from "semantic-ui-react";

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Grid padded className="grid" centered columns={1}>
        <header className="App-header">
          <Calculator />
        </header>
      </Grid>
    </div>
  );
}

export default App;
