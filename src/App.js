import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Movies from './components/Movies';
import ViewMovie from './components/ViewMovie';


function App() {
  return (
    <div className="App">
        <header><h1>Movies App</h1></header>
      <main>
       <section id="intro">
         <p>Search for Movies, Series and Episodes</p>
       </section>
       <section id="searchMoviesForm">

       <Router>
       <Route exact path="/" component={Movies}/>

       <Route path="/movies/:imdbID">
          <ViewMovie />
        </Route>
</Router>

       </section>
      </main>
    <footer>&copy; Mark Morgan 2021</footer>
    </div>
  );
}

export default App;
