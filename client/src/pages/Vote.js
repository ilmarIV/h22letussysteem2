import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Vote() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [valik, setValik] = useState('');
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

  const handleVote = () => {
  if (!name.trim() || !valik) {
    setMessage("Palun sisesta nimi ja vali otsus.");
    return;
  }

  fetch('http://localhost:8000/getLatestResult.php')
    .then(res => res.json())
    .then(latest => {
      if (latest.lõppenud === 'jah') {
        setMessage("Hääletuse aeg on lõppenud.");
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      fetch('http://localhost:8000/getVotes.php')
        .then(res => res.json())
        .then(voters => {
          const existingVoter = voters.find(
            v => v.ees_perenimi.toLowerCase() === name.trim().toLowerCase()
          );

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
                setTimeout(() => navigate('/'), 1500);
              } else {
                setMessage("Tekkis viga: " + (data.error || 'Tundmatu viga'));
              }
            })
            .catch(err => {
              console.error("Vote error:", err);
              setMessage("Võrguviga.");
            });
        })
        .catch(err => {
          console.error('Error fetching voters:', err);
          setMessage("Võrguviga valijate kontrollimisel.");
        });
    })
    .catch(err => {
      console.error('Error checking vote status:', err);
      setMessage("Viga hääletuse oleku kontrollimisel.");
    });
};
  

  if (loading) return <p>Loading...</p>;
  if (!result || result.error) return <p>No result found.</p>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className='container max-w-md bg-white shadow-md rounded-md p-6'>

        
        <p className="text-center text-2xl font-bold text-blue-700 mb-4">{result.tulemuse_nimi}</p>
        <label className="block text-teal-800 font-semibold mb-1" htmlFor="question">
        Sisesta oma nimi
        </label>
        <input
          type="text"
          placeholder="Sinu nimi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded resize-none mb-20"

        />

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-6 mb-8'>
          <label className='flex items-center gap-2 text-lg text-gray-800'>
            <input
              type="radio"
              value="poolt"
              checked={valik === 'poolt'}
              onChange={() => setValik('poolt')}
              className='accent-green-600 w-5 h-5'
            />
            Poolt
          </label>

          <label className='flex items-center gap-2 text-lg text-gray-800'>
            <input
              type="radio"
              value="vastu"
              checked={valik === 'vastu'}
              onChange={() => setValik('vastu')}
              className='accent-red-600 w-5 h-5'
            />
            Vastu
          </label>
        </div>

        <button onClick={handleVote}
          className='mb-6 w-full bg-teal-500 border border-green-800 px-4 py-2 text-white text-xl py-3 rounded hover:bg-green-700 transition mb-20'> 
          Hääleta</button>
        <p>{message}</p>

        <button onClick={() => navigate('/')}
          className=' w-full bg-gray-700 border border-green-800 px-4 py-2 text-white text-xl py-3 rounded-md shadow hover:bg-blue-700 transition'>
          Tagasi pealehele
        </button>
      </div>
    </div>
  );
}

export default Vote;
