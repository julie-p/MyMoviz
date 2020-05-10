import React, { useState } from "react";
import "../App.css";
import {
  Col,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Badge,
  Button,
  ButtonGroup,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faVideo, faHeart } from "@fortawesome/free-solid-svg-icons";

function Movie(props) {

  const [ watchMovie, setWatchMovie ] = useState(false);
  const [ countWatchMovie, setCountWatchMovie ] = useState(0);
  const [ myRatingMovie, setMyRatingMovie ] = useState(0);
  const [ isRating, setIsRating ] = useState(false);
  const [ rating ] = useState(props.globalRating);
  const [ countRating ] = useState(props.globalCountRating);

  var clickAddToWishlist = (movieName, movieImg) => {
    if (!props.movieSeen) {
      props.handleClickAddMovieParent(movieName, movieImg);
    } else {
      props.handleClickDeleteMovieParent(movieName, movieImg);
    }
  };

  var addWatch = () => {
    setWatchMovie(true);
    setCountWatchMovie(countWatchMovie +1);
  };

  var myRating = (rating) => {
    if (rating < 0) {
      rating = 0;
    }
    if (rating > 10) {
      rating = 10;
    }
    setMyRatingMovie(rating);
    setIsRating(true);
  };

  var scoreTotal = rating * countRating;
  var voteTotal = countRating;

  if (isRating) {
    voteTotal += 1;
    scoreTotal += myRatingMovie;
  }

  var avgTotal = Math.round(scoreTotal / voteTotal);
  
  var tabRating = [];
  for (var i = 0; i < 10; ++i) {
    var color = {};
    if (i < myRatingMovie) {
      color = {color: "#f1c40f"};
    }
    let count = i + 1;
    tabRating.push(<FontAwesomeIcon onClick={() => myRating(count)} style={color} icon={faStar}/>);
  }

  var tabGlobalRating = [];
  for (var i = 0; i < 10; ++i) {
    var color = '';
    if (i < avgTotal) {
      color = {color: '#f1c40f'};
    }
    tabGlobalRating.push(<FontAwesomeIcon style={color} icon={faStar}/>);
  };

  var likeColor = {cursor: 'pointer'};
  if (props.movieSeen) {
    likeColor = {cursor: 'pointer', color: '#e74c3c'};
  };

  var watchColor = {cursor: 'pointer'};
  if (watchMovie) {
    watchColor = {cursor: 'pointer', color: '#e74c3c'};
  };



  return (
    <Col xs="12" lg="6" xl="4">
      <Card style={{marginBottom: 30}}>
        <CardImg top src={props.movieImg} alt={props.movieName} />

        <CardBody>
          <p>
            Like <FontAwesomeIcon icon={faHeart} onClick={() => clickAddToWishlist(props.movieName, props.movieImg)} style={likeColor}/>
          </p>
          <p>
            Nombre de vues <FontAwesomeIcon icon={faVideo} onClick={() => addWatch()} style={watchColor} />
            <Badge>{countWatchMovie}</Badge>
          </p>
          <p>
            Mon avis {tabRating}
            <ButtonGroup size="sm">
              <Button color="secondary" onClick={() => myRating(myRatingMovie -1)}>-</Button>
              <Button color="secondary" onClick={() => myRating(myRatingMovie +1)}>+</Button>
            </ButtonGroup>
          </p>
          <p>
            Moyenne 
            {tabGlobalRating}
            ({voteTotal})
          </p>
          <CardTitle>{props.movieName}</CardTitle>
          <CardText>{props.movieDesc}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
}

export default Movie;
