import React, { Component } from 'react';
import GameRenderer from './components/GameRenderer'
import RootStore from './state/RootStore'
import { Provider } from 'mobx-react'
import history from './shared/history'
import ReactGA from 'react-ga'
import {
  Router,
  Switch,
  Route
} from 'react-router-dom'
import './App.css';

ReactGA.initialize( 'UA-145258978-1' )
ReactGA.pageview( '/game' )

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Provider {...RootStore} >
          <Router history={history} >
            <Switch>
              <Route component={GameRenderer} />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;