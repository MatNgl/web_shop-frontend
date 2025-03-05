import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const token = localStorage.getItem('token');
  let user = null;
  if (token) {
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {token ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Connexion réussie !</h2>
          {user && (
            <div className="mb-4">
              <p>Nom : {user.name}</p>
              <p>Email : {user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Se déconnecter
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Vous n'êtes pas connecté.</h2>
          <div className="space-x-4">
            <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Se connecter
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                S'inscrire
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
