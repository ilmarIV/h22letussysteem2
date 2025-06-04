import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Vote() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [valik, setValik] = useState('');
  const [voters, setVoters] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/getLatestResult.php')
      .then(response => response.json())
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching result:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/getVotes.php')
      .then(res => res.json())
      .then(data => setVoters(data))
      .catch(err => console.error('Error fetching votes:', err));
  }, []);

  const handleVote = () => {
    if (!name.trim() || !valik) {
      setMessage("Palun sisesta nimi ja vali otsus.");
      return;
    }

    const existingVoter = voters.find(v => v.ees_perenimi.toLowerCase() === name.trim().toLowerCase());

    const endpoint = existingVoter
      ? 'http://localhost:8000/updateVote.php'
      : 'http://localhost:8000/createVote.php';

    const payload = {
      ees_perenimi: name.trim(),
      otsus: valik
    };

    fetch(endpoint, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage("Hääl salvestatud edukalt.");
        } else {
          setMessage("Tekkis viga: " + (data.error || 'Tundmatu viga'));
        }
      })
      .catch(err => {
        console.error("Vote error:", err);
        setMessage("Võrguviga.");
      });
  };

  if (loading) return <p>Loading...</p>;
  if (!result || result.error) return <p>No result found.</p>;

  return (
    <div>
      <h2>Küsimus:</h2>
      <p>{result.tulemuse_nimi}</p>

      <input
        type="text"
        placeholder="Sinu nimi"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <label>
          <input
            type="radio"
            value="poolt"
            checked={valik === 'poolt'}
            onChange={() => setValik('poolt')}
          />
          Poolt
        </label>

        <label>
          <input
            type="radio"
            value="vastu"
            checked={valik === 'vastu'}
            onChange={() => setValik('vastu')}
          />
          Vastu
        </label>
      </div>

      <button onClick={handleVote}>Hääleta</button>
      <p>{message}</p>

      <button onClick={() => navigate('/')}>Tagasi pealehele</button>
    </div>
  );
}

export default Vote;