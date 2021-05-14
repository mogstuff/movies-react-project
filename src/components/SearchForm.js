import React, { useEffect, useState } from 'react';
import reactDom from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function SearchForm() {

    const [searchValue, setSearchValue] = useState( localStorage.getItem('lastSearchValue') || '');
    const [omdbType, setOmdbType] = useState('');
    const [searchValueError, setSearchValueError] = useState({});
    const [movies, setMovies] = useState( JSON.parse(localStorage.getItem('movieList')) || []);
    let [pageNumber, setPageNumber] = useState(1);
    const [totalResults, setTotalResults] = useState( localStorage.getItem('totalResults') || 0);
    const [totalPages, setTotalPages] = useState( localStorage.getItem('totalPages') || 0);



    useEffect(() => {
        localStorage.setItem('lastSearchValue', searchValue);      
        localStorage.setItem('movieList', JSON.stringify(movies));
        localStorage.setItem('totalResults', totalResults);
        localStorage.setItem('totalPages', totalPages);

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
        }

    };

    const updateOmdbType = (omdbType) => {       
        setOmdbType(omdbType);
    }

    const previousPage = () => {
       
        if (pageNumber > 1) {
            setPageNumber(pageNumber-=1);
            getMovieRequest();
        }
    }

    const nextPage = () => {

        if (totalResults > 10 && pageNumber <= totalPages) {
         
            setPageNumber(pageNumber+=1);
            getMovieRequest();
        }
    }

    return (

        <div>

            <form onSubmit={handleSubmit}>
                <input type="text" name="search_txt"
                    id="search_txt"
                    placeholder="search movies...."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <div>
                    <p>Filter By Type:</p>
                    <ul>
                        <li>
                            <input type="radio"
                                id="typeMovie"
                                name="type"
                                value="movie"
                                onChange={(e) => updateOmdbType(e.target.value)}
                            /><label htmlFor="typeMovie"> Movie</label>
                        </li>
                        <li>
                            <input type="radio"
                                id="typeSeries"
                                name="type"
                                value="series"
                                onChange={(e) => updateOmdbType(e.target.value)}
                            /><label htmlFor="typeMovie"> Series</label>
                        </li>
                        <li>
                            <input type="radio"
                                id="typeEpisode"
                                name="type"
                                value="episode"
                                onChange={(e) => updateOmdbType(e.target.value)}
                            /><label htmlFor="typeMovie"> Episode</label>
                        </li>
                    </ul>
                </div>

                <input type="submit" value="Submit" />

                <div>
                    {Object.keys(searchValueError).map((key) => {
                        return <div key="{key}" style={{ color: "red" }}>{searchValueError[key]}</div>
                    })}
                </div>

            </form>

            <div>
                <h3>Total Results {totalResults}</h3>
                <h4>Page Number: {pageNumber}</h4>
                <h4>Total Pages: {totalPages}</h4>

                <button onClick={previousPage} style={{ marginLeft: "28%" }}>Previous Page</button>
                <button onClick={nextPage} style={{ marginLeft: "0%" }}>Next Page &gt; &gt;</button>

                { movies.map((movie, index) => (

                    <div key={movie.imdbID} className='movie-wrapper'>                       
                       <Link to={`/movies/${movie.imdbID}`}><h4>Title: {movie.Title}</h4></Link>                        
                 
                        <h5>Year: {movie.Year}</h5>
                        <h5>Type: {movie.Type}</h5>
                        <img src={movie.Poster} alt='movie'></img>
                    </div>
                ))}

            </div>
        </div>
    );


}


export default SearchForm;