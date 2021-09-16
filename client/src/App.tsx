import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'Routes';

import { UserContextProvider } from 'global-state';

const App: React.FC = () => (
  <BrowserRouter>
    <div className="flex flex-col h-full min-h-screen relative font-sans">
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </div>
  </BrowserRouter>
);

export default App;
