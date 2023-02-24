import { useContext } from 'react';
import ServerContext from '../contexts/ServerContext.js';

const useServer = () => useContext(ServerContext);

export default useServer;
