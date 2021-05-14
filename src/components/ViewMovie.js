import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

function ViewMovie() {

    const { imdbID } = useParams();
    const [movie, setMovie] = useState([]);

    const loadMovieData = async () => {

        if (Object.keys(movie).length > 0)
            return;

        console.log('get movie data for: ' + imdbID);

        const apiKey = process.env.REACT_APP_OMDBAPI_KEY;  
        let url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

        console.log(url);

        const response = await fetch(url);
        const responseJson = await response.json();

        console.log('Data: ');
        console.log(responseJson);

        setMovie(responseJson);
    };

    useEffect(() => {
        loadMovieData();
    });

    return (
   
   <div id="view-movie-wrapper">


            { Object.keys(movie).length < 1 &&
                <div>... loading data</div>
            }

            { Object.keys(movie).length > 0 &&

                <div className="detail-wrapper">
                    <header>
                    <h1>{movie.Title}</h1>  
                    </header>
                    <main id="movie-details-container" className="detail-view">
                        <section id="movie-details">
                    <h4>Genre: {movie.Genre}</h4>
                    <h5>Year: {movie.Year}</h5>
                    <h5>Type: {movie.Type}</h5>
                    <h5>Cast: {movie.Actors}</h5>
                    <h5>Director: {movie.Director}</h5>
                    <h5>Rated: {movie.Rated}</h5>
                    <h5>Runtime: {movie.Runtime}</h5>
                    <div className="plot">{movie.Plot}</div>
                    </section>
                    <section className="movie-img">
                    <img src={movie.Poster} alt='movie'></img>
                    </section>
                    </main>
                </div>
            }

        </div>
    );
}


export default ViewMovie;