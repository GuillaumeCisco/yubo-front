import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import UsersList from "./routes/users/list";
import UsersDetail from "./routes/users/detail";

function App() {
  return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <UsersList />
            </Route>
            <Route path="/users/:id">
              <UsersDetail />
            </Route>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
