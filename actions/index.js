import axios from 'axios';
import { AsyncStorage } from 'react-native';

export const ROOT_URL = 'https://for-the-girls.herokuapp.com/api';
export const ActionTypes = {
  // USERS
  // CREATE_USER: 'CREATE_USER',
  FETCH_USER: 'FETCH_USER',
  // UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  USER_GET_POT_MATCHES: 'USER_GET_POT_MATCHES',
  GET_MATCHES: 'GET_MATCHES',

  //AUTH
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',

  //EVENTS
  ADD_EVENT: 'ADD_EVENT',
  RSVP_EVENT: 'RSVP_EVENT',
  UNRSVP_EVENT: 'UNRSVP_EVENT',
  FETCH_EVENT: 'FETCH_EVENT',
  FETCH_EVENTS: 'FETCH_EVENTS',
  FETCH_YOUR_EVENTS: 'FETCH_YOUR_EVENTS',
  FETCH_RSVP_CONNECTIONS: 'FETCH_RSVP_CONNECTIONS',
  SET_EVENT_COUNT: 'SET_EVENT_COUNT',
  GET_EVENT_API: 'GET_EVENT_API',

  //MATCHES
  PAIR_MATCH_TO_USER: 'PAIR_MATCH_TO_USER',
  FETCH_USER_MATCHES: 'FETCH_USER_MATCHES',

  //ERRORS
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',

  //SURVEY
  ADD_BASICINFO: 'ADD_BASICINFO',
  ADD_CS: 'ADD_CS',
  ADD_DEMO: 'ADD_DEMO',
  ADD_EDU: 'ADD_EDU',
  ADD_PERSONAL: 'ADD_PERSONAL',

  //AWARDS
  FETCH_YOUR_AWARDS: 'FETCH_YOUR_AWARDS',
  FETCH_AWARD: 'FETCH_AWARD',
  FETCH_NUM_CONTACTED: 'FETCH_NUM_CONTACTED',
  FETCH_NUM_CHATS: 'FETCH_NUM_CHATS',

  //CHATS
  CHECK_UNREAD_MESSAGES: 'CHECK_UNREAD_MESSAGES',
  SET_TO_READ: 'SET_TO_READ',
  GET_CHATS: 'GET_CHATS',
  CLEAR_CHATS: 'CLEAR_CHATS',
  FETCH_UNREAD_USERS: 'FETCH_UNREAD_USERS',

  //ACTIVITY
  ADD_ACTIVITY: 'ADD_ACTIVITY',

  //BLACKLIST
  REPORT_USER: 'REPORT_USER',
  BLOCK_USER: 'BLOCK_USER',

};

//----------------- ACTIVITY ------------------//

//adds a login to a user's activity log
export function addActivity(fields) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/activity/add/:${fields.id}`, fields)
      .then((response) => {
        dispatch({ type: ActionTypes.ADD_ACTIVITY, payload: response.data });
      }).then(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR, payload: null });
      }).catch((error) => {
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  };
}

//----------------- USERS ------------------//

// retrieves the specified user object from the database
export function getUser(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/users/${id}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_USER, payload: response.data });
      }).then(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR, payload: null });
      }).catch((error) => {
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  };
}

export function editUserVisit(username, id, otherAnswers) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/users/survey/${username}`, otherAnswers).then((res) => {
      axios.get(`${ROOT_URL}/users/${id}`)
      .then((response) => {
        dispatch({ type: ActionTypes.FETCH_USER, payload: response.data });
      }).then(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR, payload: null });
      }).catch((error) => {
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
    }).catch((error) => {
      console.log(error);
    });
  }
}

//----------------- BLACKLIST ------------------//

// retrieves the specified user object from the database
export function blockUser(reporterID, reportedID, username) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/blacklist/block/${reporterID}/${reportedID}`)
      .then((res) => {
          return axios.get(`${ROOT_URL}/matches/${username}`)
          .then((resp) => {
              dispatch({ type: ActionTypes.GET_MATCHES, payload: resp.data });
          })
      })
      .catch((error) => {
          dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  }
}

export function reportUser(reporterID, reportedID, username) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/blacklist/report/${reporterID}/${reportedID}`)
      .then((response) => {
        return axios.get(`${ROOT_URL}/matches/${username}`)
          .then((resp) => {
              dispatch({ type: ActionTypes.GET_MATCHES, payload: resp.data });
          })        
      }).catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  }
}

//---------------------------- AUTH --------------------------------//

//signs the user in based on previously created credentials and saves their information on the phone
export function signinUser({ username, password, navigate }) {
  return (dispatch) => {
    let pushToken = ''
      //https://facebook.github.io/react-native/docs/asyncstorage
    _retrieveData = async () => {
      try {
        pushToken = await AsyncStorage.getItem('pushToken');
        if (pushToken !== null) {
          // We have data!!
          console.log("PUSH TOKEN:");
          console.log(pushToken);
        }
      } catch (error) {
        console.log("IN ERROR");
        // Error retrieving data
      }
    };
    _retrieveData().then((result) => {
      axios.post(`${ROOT_URL}/signin`, { username, password, pushToken: pushToken}).then((response) => {
        dispatch({ type: ActionTypes.AUTH_USER, payload: { username, id: response.data.id } });

        //How to add tokens using react native
        //https://facebook.github.io/react-native/docs/asyncstorage
        _storeData = async () => {
          try {
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('id', response.data.id);
          } catch (error) {
            console.log("error");
          }
        };

        _storeData();
        navigate.navigate("Main");

      }).catch((error) => {
        console.log(error);
        dispatch(authError(`Invalid username or password`));
      });
    });

    };
    // const pushToken = AsyncStorage.getItem('pushToken');
    // console.log("PUSHTOKEN:");
    // console.log(pushToken);
     // in here first check for pushtoken await AsyncStorage.getItem('pushToken');

}

//creates a new user and then signs them in and saves their information on the phone
export function signUpUser(fields, navigate, otherAnswers) {
  return (dispatch) => {
    let pushToken = ''
    //https://facebook.github.io/react-native/docs/asyncstorage
  _retrieveData = async () => {
    try {
      pushToken = await AsyncStorage.getItem('pushToken');
      if (pushToken !== null) {
        // We have data!!
        console.log("PUSH TOKEN:");
        console.log(pushToken);
      }
    } catch (error) {
      console.log("IN ERROR");
      // Error retrieving data
    }
  };
  _retrieveData().then((result) => {
    fields.pushToken = pushToken;
    
        axios.post(`${ROOT_URL}/signup`, fields)
          .then((response) => {
            return axios.put(`${ROOT_URL}/users/survey/${fields.username}`, otherAnswers)
              .then((res) => {
                dispatch({ type: ActionTypes.AUTH_USER, payload: { username: fields.username, id: response.data.id } });
    
                _storeData = async () => {
                  try {
                    await AsyncStorage.setItem('token', response.data.token);
                    await AsyncStorage.setItem('username', fields.username);
                    await AsyncStorage.setItem('id', response.data.id);
                  } catch (error) {
                    console.log("token error setting async");
                  }
                };
    
                _storeData();
    
                navigate.navigate("Main");
              })
              .catch((error) => {
                console.log(error);
              });
          }).catch((error) => {
            console.log(error);
            dispatch(authError(`Sign Up Failed: User Exists with this Information`));
          });
  });
    // const pushToken = AsyncStorage.getItem('pushToken');
    // fields.pushToken = pushToken;
    // console.log(fields);

    // in here first check for pushtoken await AsyncStorage.getItem('pushToken');
  }
}



//adds user information (name, location, etc) to a user on the backend
export function addToSurvey(otherAnswers, username, navigate, navTo) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/users/survey/${username}`, otherAnswers).then((res) => {
      navigate.navigate(navTo);
    }).catch((error) => {
      console.log(error);
    });
  }
}

// deletes token from localstorage and logs a user out
export function signoutUser(navigate) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.DEAUTH_USER });
    const deleteToken = async () => {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('id');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('notification');
      } catch (error) {
        // Error retrieving data
        console.log(error.message);
      }
    }

    //add navigation back to log in screen
    deleteToken();
    navigate.navigate('StartScreen')
  };
}

// trigger to deauth if there is error
// can also use in your error reducer if you have one to display an error message
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}

//----------------- MATCHES ------------------//
//given two users, it creates a match between the users and redirects the matcher to chat
export function pairMatchToUser(user1, user2, prompt, navigation, matchID) {
  return (dispatch) => {
    // console.log("in pairing");
    axios.post(`${ROOT_URL}/matches/pair`, { user1, user2 })
      .then((response) => {
        // console.log("paired");
        return axios.get(`${ROOT_URL}/matches/potential/${user1}`)
          .then((res) => {
            // console.log("Fetching potentials again");
            var award = false;
            if (res.data.length === 1) {
              award = true;
            }
            dispatch({ type: ActionTypes.USER_GET_POT_MATCHES, payload: res.data });
            navigation.navigate('SingleChat', { matchID: matchID, prompt: prompt, username: user2, firstMatchAward: award });
          }).catch((error) => {
            console.log(error);
            dispatch({ type: ActionTypes.SET_ERROR, error });
          });
      }).catch((error) => {
        // console.log("error pairing");
        console.log(error);
      })
  }
}

//    axios.post(`${ROOT_URL}/matches/reject`, { user1, user2 })

export function rejectAMatch(user1, user2) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/matches/reject`, { user1, user2 })
      .then((response) => {
        return axios.get(`${ROOT_URL}/matches/potential/${user1}`)
          .then((res) => {
            var award = false;
            if (res.data.length === 1) {
              award = true;
            }
          dispatch({ type: ActionTypes.USER_GET_POT_MATCHES, payload: res.data });
          }).catch((error) => {
            console.log(error);
            dispatch({ type: ActionTypes.SET_ERROR, error });
          });
      }).catch((error) => {
        console.log(error);
      })
  }
}


//gets all the potential matches for a user based on our algorithm's suggestions
export function getPotentialMatches(username) {
  //matches/potential/:username
  return (dispatch) => {
    axios.get(`${ROOT_URL}/matches/potential/${username}`)
      .then((response) => {
        dispatch({ type: ActionTypes.USER_GET_POT_MATCHES, payload: response.data });
      }).catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  }
}

//gets all the user's previously made matches
export function getMatches(username) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/matches/${username}`)
      .then((response) => {
        dispatch({ type: ActionTypes.GET_MATCHES, payload: response.data });
      }).catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  }
}

//removes a match between two people by finding their match object and removing it
export function deleteMatch(userID, matchID, username) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/matches/getid/${userID}/${matchID}`)
      .then((response) => {
        const matchID = response.data;
        return axios.delete(`${ROOT_URL}/matches/delete/${matchID}`)
          .then((res) => {
            // console.log("deleted match");
            return axios.get(`${ROOT_URL}/matches/${username}`)
              .then((resp) => {
                console.log(resp);
                dispatch({ type: ActionTypes.GET_MATCHES, payload: resp.data });
              }).catch((error) => {
                console.log(error);
                dispatch({ type: ActionTypes.SET_ERROR, error });
              });
          }).catch((error) => {
            dispatch({ type: ActionTypes.SET_ERROR, error });
          });
      }).catch((error) => {
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  }
}

//----------------- EVENTS ------------------//
//creates a new event
export function addEvent(fields, navigation, id) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/events/add`, fields)
      .then((response) => {
        return axios.get(`${ROOT_URL}/events`).then((response) => {
          var count = 0;
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].authorID == id) {
              count = count + 1;
            }
          }
          var firstEventAward = false;
          if (count == 1) {
            firstEventAward = true;
          }
          dispatch({ type: ActionTypes.FETCH_EVENTS, payload: response.data });
          navigation.navigate('Home', { firstEventAward: firstEventAward })
        }).catch((error) => {
          console.log(error);
        });
      }).then(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR, payload: null });
      }).catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  };
}

export function getEventCount(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/events/rsvp/your/${id}`).then((response) => {
      dispatch({ type: ActionTypes.SET_EVENT_COUNT, payload: response.data.length });
    }).catch((error) => {
      console.log(error);
    });
  }
}

//gets all previously created events by any user
export function fetchEvents() {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/events`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_EVENTS,
        payload: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  };
}

//gets all the events the user has RSVP'd to (i.e. is attending)
export function fetchYourEvents(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/events/rsvp/your/${id}`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_YOUR_EVENTS,
        payload: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  };
}

//Gets the information regarding a specific event
export function fetchEvent(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/events/${id}`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_EVENT,
        payload: response.data,
      });
    }).catch((error) => {
    });
  };
}

//Gets the other users who have RSVP'd to a specific event
export function fetchRsvpConnections(userId, eventId) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/events/rsvp/connections/${userId}/${eventId}`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_RSVP_CONNECTIONS, payload: response.data,
      });
    }).catch((error) => {
    });
  };
}

//Enables a user to RSVP to a specific event to say they are attending
export function rsvpEvent(userID, eventID) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/events/rsvp/${eventID}`, { userID: userID })
      .then((response) => {
        return axios.get(`${ROOT_URL}/events/rsvp/your/${userID}`).then((response) => {
          var threeEventAward = false;
          if (response.data.length == 2) {
            threeEventAward = true;
          }


          dispatch({ type: ActionTypes.FETCH_YOUR_EVENTS, payload: response.data });
        }).catch((error) => {
          console.log(error);
        });
      }).then(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR, payload: null });
      }).catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  };
}

//Enables a user to unRSVP from a specific event to say they are no longer attending
export function unrsvpEvent(userID, eventID) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/events/unrsvp/${eventID}`, { userID: userID })
      .then((response) => {
        return axios.get(`${ROOT_URL}/events/rsvp/your/${userID}`).then((response) => {
          dispatch({ type: ActionTypes.FETCH_YOUR_EVENTS, payload: response.data });
        }).catch((error) => {
          console.log(error);
        });
      }).then(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR, payload: null });
      }).catch((error) => {
        console.log(error);
        dispatch({ type: ActionTypes.SET_ERROR, error });
      });
  };
}

//--------------------------------------CHATS----------------------------------------
//Gets user's unread chat count
export function checkUnreadMessages(fields) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/chats/getMyUnreadCount/${fields.id}`).then((response) => {
      dispatch({
        type: ActionTypes.CHECK_UNREAD_MESSAGES,
        payload: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  };
}

export function checkUnreadUsers(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/chats/getMyUnreadWithIds/${id}`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_UNREAD_USERS,
        payload: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  }
}

export function setToRead(fields) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/chats/setToRead`, fields).then((response) => {
      dispatch({
        type: ActionTypes.SET_TO_READ,
        payload: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  };
}

//sends a chat and then re-fetches all the chats and sends that to the chat reducer
export function sendChat(fields, firstID, secondID) {
  return (dispatch) => {
    axios.post(`https://for-the-girls.herokuapp.com/api/chats/add/`, fields)
    .then((response) => {
        axios.get(`https://for-the-girls.herokuapp.com/api/chats/getBetween/${firstID}/${secondID}`)
        .then((response) => {
          dispatch({type: ActionTypes.GET_CHATS, payload: response.data,});
        }).catch((error) => {
          console.log(error);
        });
    }).catch((error) => {
      console.log(error);
    });
  }
}

//gets all the chats between two people
export function getFullChat(firstID, secondID) {
  return (dispatch) => {
    axios.get(`https://for-the-girls.herokuapp.com/api/chats/getBetween/${firstID}/${secondID}`)
      .then((response) => {
        dispatch({type: ActionTypes.GET_CHATS, payload: response.data,});
      }).catch((error) => {
        console.log(error);
      });
  }
}

export function clearChat() {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.CLEAR_CHATS,
      payload: null,
    });
  }
}

//gets the user's total contacted number
export function totalContacted(id) {
  return (dispatch) => {
    axios.get(`https://for-the-girls.herokuapp.com/api/chats/totalContacted/${id}`)
    .then((response) => { //response.data
      dispatch({type: ActionTypes.FETCH_NUM_CONTACTED, payload: response.data});
    }).catch((error) => {
      console.log(error);
    });
  }
}

//gets the user's total chats sent
export function totalChatsSent(id) {
  return (dispatch) => {
    axios.get(`https://for-the-girls.herokuapp.com/api/chats/totalSent/${id}`)
      .then((resp) => { //resp.data
        dispatch({type: ActionTypes.FETCH_NUM_CHATS, payload: resp.data});
      }).catch((error) => {
        console.log(error);
      });
  }
}

//--------------------------------------BADGES----------------------------------------
//Gets all the user's badges (i.e. milestones they've achieved on the app)
export function fetchYourAwards(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/awards/checkAllAwards/${id}`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_YOUR_AWARDS,
        payload: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  };
}

//Gets the status of one award (i.e. if this person has achieved this badge or not)
export function fetchAwardStatus(id, awardTitle) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/awards/checkAward/${id}/${awardTitle}`).then((response) => {
      dispatch({
        type: ActionTypes.FETCH_AWARD,
        payload: response.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  };
}

///------------------ERRORS----------------------------------

//When we store errors in state, resets the errors so they are no longer in state
export function resetErrors() {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.CLEAR_ERROR,
      payload: null,
    });
  }
}

// add action to save push token
