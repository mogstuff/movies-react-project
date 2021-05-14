import React from 'react';
import SearchForm from './SearchForm';

function Movies() {
    return (
        <div id="movies-wrapper">

            <header id="movies-header">
                <h1>Movies</h1>
            </header>
            <main id="form-container">
                <section id="intro">
                    <p>Search for Movies, Series and Episodes</p>
                </section>
                <section id="search-form-wrapper">
                    <SearchForm />
                </section>
            </main>
        </div>
    );
}

export default Movies;