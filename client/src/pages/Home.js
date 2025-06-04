import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <p>Loading result...</p>;

  if (!result || result.error) {
    return <p>No result found.</p>;
  }

  return (
    <div>
      <p>{result.lõppenud === 'ei' ? 'hääletus käib' : 'hääletus on lõppenud'}</p>
      <h2>Küsimus:</h2>
      <p>{result.tulemuse_nimi}</p>
      <p><strong>Hääletanute arv:</strong> {result.haaletanute_arv}</p>
      <p><strong>Poolt hääli:</strong> {result.poolt_haali}</p>
      <p><strong>Vastu hääli:</strong> {result.vastu_haali}</p>

      {result.lõppenud === 'ei' && (
        <button onClick={() => navigate('/vote')}>
          Mine hääletama
        </button>
      )}
    </div>
  );
}

export default Home;