import {createContext} from 'react';
const userData = {
  id: '',
  admin: false,
  username: 'goofy'
}

const userContext = createContext({userData});

export {userContext}
