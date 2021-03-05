import { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext'

import '../index.css';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup';
import Register from './Register';
import Login from './Login';
import PageNotFound from "./PageNotFound";
import api from '../utils/api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  const initialData = {
    email: '',
    password: ''
  }
  const [data, setData] = useState(initialData);
  const [loggedIn, setLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const history = useHistory();

  const handleLogin = () => {
    this.setState({
      loggedIn: true,
    })
  }

  useEffect(() => {
    api.getUser().then(response => {
      setCurrentUser(response);
    }).catch(error => {
      console.log(`Error: ${error}`);
    })
    api.getCards().then(response => {
      setCards(response);
    }).catch(err => {
      console.log(`Error: ${err}`)
    });
  },[])
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(selectedCard) {
    setIsOpen(true);
    setSelectedCard(selectedCard);
  }
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
    setIsOpen(false);
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item._id === currentUser._id);
    
    api.changeLikeStatus(card._id, !isLiked).then(newCard => {
      const newCards = cards.map(c => c._id === card._id ? newCard : c);
      setCards(newCards);
    }).catch(error => {
      console.log(`Error: ${error}`)
    });
  }
  function handleDeleteCard(card) {
    api.removeCard(card._id).then(() => {
      const newCards = cards.filter(c => {
       return c._id !== card._id;
      })
      setCards(newCards);
    }).catch(error => {
      console.log(`Error: ${error}`)
    })
  }
  function handleUpdateUser(user) {
    api.updateUser(user).then(response => {
      setCurrentUser(response);
      closeAllPopups();
    }).catch(error => {
      console.log(`Error: ${error}`)
    })
  }
  function handleUpdateAvatar(item) {
    api.updateAvatar(item).then(response => {
      setCurrentUser(response)
      closeAllPopups();
    }).catch(error => {
      console.log(`Error: ${error}`)
    })
  }
  function handleAddPlace(item) {
    console.log(item);
    api.addNewCard(item).then(response => {
      setCards([response, ...cards]);
      closeAllPopups();
    }).catch(error => {
      console.log(`Error: ${error}`);
    })
  }
  return (
    <>
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Switch>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          <ProtectedRoute
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteCard}
            cards={cards}
          />
        </Route>
        <Route path="/sign-in">
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          <Login/>
        </Route>
        <Route path="/sign-up">
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up" />}
          <Register/>
        </Route>
        <Route path="*">
          <PageNotFound/>
        </Route>
      </Switch>
      <Footer />
      <AddPlacePopup 
        isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups}
        onAddPlace={handleAddPlace} 
      />
      <EditProfilePopup 
        isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups} 
        onUpdateUser={handleUpdateUser}
      />
      <EditAvatarPopup 
        isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} 
        onUpdateAvatar={handleUpdateAvatar}
      />
      <ImagePopup 
        card={selectedCard} 
        isOpen={isOpen} 
        onClose={closeAllPopups}
      />
    </CurrentUserContext.Provider>
    </>
  );
}