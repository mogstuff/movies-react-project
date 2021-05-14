import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

function ViewSeries() {

    const { imdbID } = useParams();
    const [series, setSeries] = useState([]);

    const loadSeriesData = async () => {

        if (Object.keys(series).length > 0)
            return;

        const apiKey = process.env.REACT_APP_OMDBAPI_KEY;
        let url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

        const response = await fetch(url);
        const responseData = await response.json();

        setSeries(responseData);

    }

    useEffect(() => {
        loadSeriesData();
    });


    return (

        <div id="view-series-wrapper">

            { Object.keys(series).length < 1 &&
                <div>... loading data</div>
            }

            { Object.keys(series).length > 0 &&
                <div className="detail-wrapper">
                    <header>
                    <h1>{series.Title}</h1>
                    </header>
                    <main id="series-details-container" className="detail-view">
                        <section id="series-details">
                    <h2>Total Seasons :{series.totalSeasons}</h2>                   
                    <div>Year {series.Year}</div>
                    <div>Rated {series.Rated}</div>
                    <div>Runtime {series.Runtime}</div>
                    <div>Genre {series.Genre}</div>
                    <div>Cast {series.Actors}</div>
                    <div  className="plot">
                        <h3>Plot</h3>
                        {series.Plot}
                    </div>
                    </section>
                    <section className="movie-img">
                    <img src={series.Poster} alt='movie'></img>
                    </section>
                    </main>
                </div>
            }

        </div>

    );

}


export default ViewSeries;