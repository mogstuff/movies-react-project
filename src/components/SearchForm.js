import React, { useEffect, useState } from 'react';
import reactDom from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function SearchForm() {

    const [searchValue, setSearchValue] = useState(localStorage.getItem('lastSearchValue') || '');
    const [omdbType, setOmdbType] = useState(localStorage.getItem('omdbType') || '');
    const [searchValueError, setSearchValueError] = useState({});
    const [movies, setMovies] = useState(JSON.parse(localStorage.getItem('movieList')) || []);
    let [pageNumber, setPageNumber] = useState(1);
    const [totalResults, setTotalResults] = useState(localStorage.getItem('totalResults') || 0);
    const [totalPages, setTotalPages] = useState(localStorage.getItem('totalPages') || 0);

    useEffect(() => {
        localStorage.setItem('lastSearchValue', searchValue);
        localStorage.setItem('movieList', JSON.stringify(movies));
        localStorage.setItem('totalResults', totalResults);
        localStorage.setItem('totalPages', totalPages);
        localStorage.setItem('omdbType', omdbType);

    }, [searchValue, movies]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (isValid) {
            getMovieRequest(searchValue);
        }

    };

    const validateForm = () => {

        const searchValueError = {};
        let isValid = true;

        if (searchValue.trim().length < 5) {
            searchValueError.emptyError = "search term is too short";
            isValid = false;
        }

        setSearchValueError(searchValueError);

        return isValid;
    }

    const getMovieRequest = async () => {

        const apiKey = process.env.REACT_APP_OMDBAPI_KEY;

        let url = `http://www.omdbapi.com/?s=${searchValue}&apikey=${apiKey}`;


        if (omdbType.length > 0) {
            url += '&type=' + omdbType;
        }

        if (pageNumber > 1) {
            url += `&page=${pageNumber}`;
        }

        const response = await fetch(url);
        const responseJson = await response.json();

        if (responseJson.Search) {

            setMovies(responseJson.Search);
            setTotalResults(responseJson.totalResults);

            if (responseJson.totalResults > 10) {
                let numberOfPages = Math.round(responseJson.totalResults / 10);
                setTotalPages(numberOfPages);
            }

            document.getElementById('results-wrapper').scrollIntoView({ behavior: "smooth" });
        }

    };

    const updateOmdbType = (omdbType) => {
        setOmdbType(omdbType);
    }

    const previousPage = () => {

        if (pageNumber > 1) {
            setPageNumber(pageNumber -= 1);
            getMovieRequest();
        }
    }

    const nextPage = () => {

        if (totalResults > 10 && pageNumber <= totalPages) {

            setPageNumber(pageNumber += 1);
            getMovieRequest();
        }
    }

    return (

        <div id="search-form-container">

            <form id="search-form" onSubmit={handleSubmit}>

                <input type="text" name="search_txt"
                    id="search_txt"
                    placeholder="search movies...."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <div id="type-filter-wrapper">
                    <div id="filter-text">Filter By Type:</div>
                    
                    <div id="radio-btn-movie">
                            <input type="radio"
                                className="radio-btn"
                                id="typeMovie"
                                name="type"
                                value="movie"
                                onChange={(e) => updateOmdbType(e.target.value)}
                                checked={omdbType === "movie"}

                            /><label htmlFor="typeMovie"> Movie</label>
                      </div>

                      <div id="radio-btn-series">
                            <input type="radio"
                                className="radio-btn"
                                id="typeSeries"
                                name="type"
                                value="series"
                                checked={omdbType === "series"}

                                onChange={(e) => updateOmdbType(e.target.value)}
                            /><label htmlFor="typeMovie"> Series</label>
                            </div>
                       
                </div>

                <input className="submit-btn" type="submit" value="Submit" />

                <div id="error-wrapper">
                    {Object.keys(searchValueError).map((key) => {
                        return <div key="{key}" style={{ color: "red" }}>{searchValueError[key]}</div>
                    })}
                </div>

            </form>

            <div id="results-wrapper">


                {movies.length > 0 &&
                    <div className="results-headers">
                        <div>Total Results: {totalResults}</div>
                        <div>Page Number: {pageNumber}</div>
                        <div>Total Pages: {totalPages}</div>
                    </div>
                }

                {movies.length > 0 &&
                    <div id="paging-wrapper">
                        <button className="page-btn" onClick={previousPage} style={{ marginLeft: "28%" }}>Previous Page</button>
                        <button className="page-btn" onClick={nextPage} style={{ marginLeft: "0%" }}>Next Page &gt; &gt;</button>
                    </div>
                }


                <div id="results-data-container">
                    {movies.map((movie, index) => (

                        <div key={movie.imdbID} className='movie-wrapper'>
                            <Link to={`/${movie.Type}/${movie.imdbID}`}><h4>Title: {movie.Title}</h4></Link>

                            <h5>Year: {movie.Year}</h5>
                            <h5>Type: {movie.Type}</h5>
                            <img src={movie.Poster} alt='movie' className="movie-poster-small"></img>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}


export default SearchForm;