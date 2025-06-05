import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [resultName, setResultName] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!resultName.trim()) {
      alert("Please enter a result name.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/createResult.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tulemuse_nimi: resultName })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Result created with ID: ${data.inserted_id}`);
        setResultName('');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Request failed", error);
      alert("Failed to create result. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className='container max-w-md bg-white shadow-md rounded-md p-6'>
      <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
        Sisesta oma küsimus hääletusele.
      </h1>
        <p className="font-bold text-gray-800 mb-8 text-center">
          Peale vajutust nupule 'Alusta hääletus' kuvatakse esilehel küsimus ja hääletamine kestab 5 minutit.
        </p>
        <label className="block text-teal-800 font-semibold mb-1" htmlFor="question">
        Sisesta oma küsimus 
        </label>
        <input
          type="text"
          value={resultName}
          onChange={(e) => setResultName(e.target.value)}
          placeholder="Sisesta küsimus"
          className="w-full px-3 py-2 border border-gray-300 rounded resize-none mb-20"
        />
        <br />
        <div className='space-y-4'>
          <button onClick={handleCreate}
            className='w-full bg-green-600 border border-green-800 px-4 py-2 text-white text-xl py-3 rounded-md shadow hover:bg-blue-700 transition'> 
            Alusta hääletust
          </button>
            <br />
          <button onClick={() => navigate('/log')}
            className=' w-full bg-gray-700 border border-green-800 px-4 py-2 text-white text-xl py-3 rounded-md shadow hover:bg-teal-700 transition'> 
            Vaata logi
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;