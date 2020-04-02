import React, { useEffect } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { fetchState } from '../middlewares/Chat';
import * as selectors from '../selectors';
import Messages from '../components/Messages';
import UserName from '../components/User/UserName';
import ChatInput from '../components/ChatInput';
import GameStatusCodes from '../config/gameStatusCodes';
import 'emoji-mart/css/emoji-mart.css';


const ChatWidget = () => {
  //  shallowEqual нужен?
  const users = useSelector(state => selectors.chatUsersSelector(state), shallowEqual);
  const messages = useSelector(state => selectors.chatMessagesSelector(state), shallowEqual);
  // const currentUser = useSelector(state => selectors.currentChatUserSelector(state)); потерялся
  const isStoredGame = useSelector(state => (
    selectors.gameStatusSelector(state).status === GameStatusCodes.stored), shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isStoredGame) {
      dispatch(fetchState());
    }
  }, []);

  const listOfUsers = _.uniqBy(users, 'id');
  return (
    <div className="d-flex shadow-sm h-100">
      <div className="col-12 col-sm-8 p-0 bg-white rounded-left h-100 position-relative">
        <Messages messages={messages} />
        {!isStoredGame && <ChatInput />}
      </div>
      <div className="col-4 d-none d-sm-block p-0 border-left bg-white rounded-right">
        <div className="d-flex flex-direction-column flex-wrap justify-content-between">
          <div className="px-3 pt-3 pb-2 w-100">
            <p className="mb-1">{`Online users: ${users.length}`}</p>
            <div className="overflow-auto" style={{ height: '175px' }}>
              {listOfUsers.map(user => (
                <div key={user.id} className="my-2">
                  <UserName user={user} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
