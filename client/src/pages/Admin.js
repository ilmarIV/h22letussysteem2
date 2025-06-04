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
    <div>
      <h1>Sisesta hääletusele pandav küsimus</h1>
      <p>Peale vajutust nupule Alusta hääletamisega kuvatakse esilehel küsimus ja käivitub 
          5 minutit vastamiseks.</p>
      <input
        type="text"
        value={resultName}
        onChange={(e) => setResultName(e.target.value)}
        placeholder="Sisesta küsimus"
      />
      <br />
      <button onClick={handleCreate}>Alusta hääletamisega</button>
      <br />
      <button onClick={() => navigate('/log')}>Vaata logi</button>
    </div>
  );
}

export default Admin;