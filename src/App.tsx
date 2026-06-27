import React, { useState } from 'react';
import Main from './components/Main';
import AuthScreen from './components/AuthScreen';

function App() {
  // Este estado controla si estamos logueados o no
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="w-full min-h-screen">
      {/* Si isLoggedIn es true, muestra Main, si no, muestra AuthScreen */}
      {isLoggedIn ? (
        <Main />
      ) : (
        <AuthScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;