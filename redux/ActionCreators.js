import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

// leaders
export const fetchLeaders = () => (dispatch) => {
  dispatch(leadersLoading());
  return fetch(baseUrl + 'leaders')
    .then((response) => {
      if (!response.ok) throw Error('Error ' + response.status + ': ' + response.statusText);
      else return response.json();
    })
    .then((leaders) => dispatch(addLeaders(leaders)))
    .catch((error) => dispatch(leadersFailed(error.message)));
};
const leadersLoading = () => ({
  type: ActionTypes.LEADERS_LOADING
});
const leadersFailed = (errmess) => ({
  type: ActionTypes.LEADERS_FAILED,
  payload: errmess
});
const addLeaders = (leaders) => ({
  type: ActionTypes.ADD_LEADERS,
  payload: leaders
});
// dishes
export const fetchDishes = () => (dispatch) => {
  dispatch(dishesLoading());
  return fetch(baseUrl + 'dishes')
    .then((response) => {
      if (!response.ok) throw Error('Error ' + response.status + ': ' + response.statusText);
      else return response.json();
    })
    .then((dishes) => dispatch(addDishes(dishes)))
    .catch((error) => dispatch(dishesFailed(error.message)));
};
const dishesLoading = () => ({
  type: ActionTypes.DISHES_LOADING
});
const dishesFailed = (errmess) => ({
  type: ActionTypes.DISHES_FAILED,
  payload: errmess
});
const addDishes = (dishes) => ({
  type: ActionTypes.ADD_DISHES,
  payload: dishes
});

// comments
export const fetchComments = () => (dispatch) => {
  return fetch(baseUrl + 'comments')
    .then((response) => {
      if (!response.ok) throw Error('Error ' + response.status + ': ' + response.statusText);
      else return response.json();
    })
    .then((comments) => dispatch(addComments(comments)))
    .catch((error) => dispatch(commentsFailed(error.message)));
};
const commentsFailed = (errmess) => ({
  type: ActionTypes.COMMENTS_FAILED,
  payload: errmess
});
const addComments = (comments) => ({
  type: ActionTypes.ADD_COMMENTS,
  payload: comments
});

export const postComment = (id, dishId, author, comment, rating, date) => (dispatch) => {
  setTimeout(() => {
    dispatch(addComment(id, dishId, author, comment, rating, date));
  }, 2000);
};

export const addComment = (id, dishId, author, comment, rating, date) => ({
  type: ActionTypes.ADD_COMMENT,
  payload: {
    id: id,
    dishId: dishId, 
    author: author, 
    comment: comment,
    rating: rating, 
    date: date
  }
});
// promotions
export const fetchPromos = () => (dispatch) => {
  dispatch(promosLoading());
  return fetch(baseUrl + 'promotions')
    .then((response) => {
      if (!response.ok) throw Error('Error ' + response.status + ': ' + response.statusText);
      else return response.json();
    })
    .then((promos) => dispatch(addPromos(promos)))
    .catch((error) => dispatch(promosFailed(error.message)));
};
const promosLoading = () => ({
  type: ActionTypes.PROMOS_LOADING
});
const promosFailed = (errmess) => ({
  type: ActionTypes.PROMOS_FAILED,
  payload: errmess
});
const addPromos = (promos) => ({
  type: ActionTypes.ADD_PROMOS,
  payload: promos
});
// favorites
export const postFavorite = (dishId) => (dispatch) => {
  dispatch(addFavorite(dishId));
};
const addFavorite = (dishId) => ({
  type: ActionTypes.ADD_FAVORITE,
  payload: dishId
});


