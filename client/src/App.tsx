import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'Routes';

const App: React.FC = () => (
  <BrowserRouter>
    <div className="flex flex-col h-full min-h-screen relative font-sans">
      <Routes />
    </div>
  </BrowserRouter>
);

export default App;
