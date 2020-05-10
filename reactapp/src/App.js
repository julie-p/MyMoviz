import React, { useState, useEffect } from "react";
import Movie from './components/Movie';
import "./App.css";
import {
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  Button,
  Popover,
  PopoverBody,
  PopoverHeader,
  ListGroup,
  ListGroupItem,
  ListGroupItemText
} from "reactstrap";

function App() {

  const [ moviesCount, setMoviesCount ] = useState(0);
  const [ moviesWishlist, setMoviesWishlist ] = useState([]);
  const [ moviesList, setMoviesList ] = useState([]);
  const [ popoverOpen, setPopoverOpen ] = useState(false); 
  const toggle = () => setPopoverOpen(!popoverOpen); 

  useEffect( () => {
    async function loadData() {
      const response = await fetch('/new-movies');
      const jResponse = await response.json();
      setMoviesList(jResponse.movies);

      const wishlistResponse = await fetch('/wishlist-movies');
      const jWishlistResponse = await wishlistResponse.json();

      const dbWishlist = jWishlistResponse.movies.map((movie, i) => {
        return {name: movie.name, img: movie.img};
      });
      setMoviesWishlist(dbWishlist);
      setMoviesCount(jWishlistResponse.movies.length);
    };
    loadData();
  }, []);

  var handleClickAddMovie = async (movieName, movieImg) => {
    setMoviesCount(moviesCount + 1);
    setMoviesWishlist([...moviesWishlist, {name: movieName, img: movieImg}]);

    var response = await fetch('/wishlist-movies', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: `name=${movieName}&img=${movieImg}`
    })
  };

  var handleClickDeleteMovie = async (movieName) => {
    setMoviesCount(moviesCount -1);
    setMoviesWishlist(moviesWishlist.filter(object => object.name !== movieName));

    var response = await fetch(`/wishlist-movies/${movieName}`, {
      method: 'DELETE'
    });
  };

  var movieListData = moviesList.map((movie, i) => {
    var result = moviesWishlist.find(element => element.name == movie.title);
    var inWishlist = false;
    if (result !== undefined) {
      inWishlist = true;
    };

    var result = movie.overview;
    if (result.length > 80) {
      result = result.slice(0,80) + '...';
    }

    var url = 'https://image.tmdb.org/t/p/w500/'+movie.backdrop_path;
    if (!movie.backdrop_path) {
      url = '/generique.jpg';
    };

    return <Movie key={i} movieSeen={inWishlist} handleClickAddMovieParent={handleClickAddMovie} handleClickDeleteMovieParent={handleClickDeleteMovie} movieName={movie.title} movieDesc={result} movieImg={url} globalRating={movie.popularity} globalCountRating={movie.vote_count} />
  });

  var moviesInWishlist = moviesWishlist.map((movie, i) => {
    return (
      <ListGroupItem>
        <ListGroupItemText onClick={() => handleClickDeleteMovie(movie.name)}>
        <img width="40%" src={movie.img} alt={movie.overview}/> {movie.name}
        </ListGroupItemText>
      </ListGroupItem>
    )
  });

  return (
    <div style={{backgroundColor: '#222f3e'}}>
      <Container>
        <Row>
          <Nav>
            <span className="navbar-brand">
              <img
                src="./logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="logo"
              />
            </span>
            <NavItem style={{color: '#fff'}}>
              <NavLink>Dernières Sorties</NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                <Button type="button" id="PopoverFocus">{moviesCount} films</Button>
                <Popover placement="bottom" isOpen={popoverOpen} target="PopoverFocus" toggle={toggle}>
                  <PopoverHeader>Whishlist</PopoverHeader>
                    <PopoverBody>
                      <ListGroup>
                        <ListGroupItem>
                          <ListGroupItemText>
                                {moviesInWishlist}
                          </ListGroupItemText>
                        </ListGroupItem>
                      </ListGroup>
                    </PopoverBody>
                  </Popover>
              </NavLink>
            </NavItem>
          </Nav>
        </Row>
        <Row>
          {movieListData}
        </Row>
      </Container>
    </div>
  );
}

export default App;
