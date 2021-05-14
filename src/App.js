import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Movies from './components/Movies';
import ViewMovie from './components/ViewMovie';
import ViewSeries from './components/ViewSeries';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Movies} />
        <Route path="/movie/:imdbID">
          <ViewMovie />
        </Route>
        <Route path="/series/:imdbID">
          <ViewSeries />
        </Route>
      </Router>

      <footer>&copy; Mark Morgan 2021</footer>
    </div>
  );
}

export default App;
