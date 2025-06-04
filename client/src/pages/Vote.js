import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Vote() {
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

  if (loading) return <p>Loading...</p>;

  if (!result || result.error) {
    return <p>No result found.</p>;
  }

  return (
    <div>
      <h2>Küsimus:</h2>
      <p>{result.tulemuse_nimi}</p>

      <button onClick={() => navigate('/')}>Tagasi pealehele</button>
    </div>
  );
}

export default Vote;