import Register from "./components/register/Register";
import { Route, Switch } from "react-router-dom";
import Login from "./components/login/Login";
import Products from "./components/products/Products";
import Checkout from "./components/checkout/Checkout";
import Thanks from "./components/thanks/Thanks";

export const config = {
  endpoint: `https://qkart2-frontend.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/thanks" component={Thanks} />
        <Route path="/" component={Products} />
      </Switch>
    </div>
  );
}

export default App;
