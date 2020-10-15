
import React from 'react';
import Login from './containers/Login/Login';
import Signup from './containers/Signup/Signup';
import { Switch, Route, Redirect } from 'react-router-dom';

const App = () => {
    return (
        <React.Fragment>
            <Switch>
                <Route path="/login">
                    <Login></Login>
                </Route>
                <Route path="/signup">
                    <Signup></Signup>
                </Route>
                <Redirect from="/" to="/login"></Redirect>
            </Switch>
        </React.Fragment>
    );
}

export default App;