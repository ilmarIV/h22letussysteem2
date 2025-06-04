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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className='container max-w-md bg-white shadow-md rounded-md p-6'>
      <p
        className={`mb-6 text-center text-2xl font-semibold ${
        result.lõppenud === 'ei' ? 'text-green-600' : 'text-red-600'
          }`}
        >
        {result.lõppenud === 'ei' ? 'Hääletus on avatud' : 'Hääletus on lõppenud'}
      </p>
        <div className='max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6 text-gray-800'>
          <p className="text-center text-2xl font-bold text-blue-700 mb-4"><strong>{result.tulemuse_nimi}</strong>
          </p>
          <div className='space-y-2 text-lg'>
            <p><span className='font-semibold text-gray-700'>Hääletanute arv:</span> {' '}{result.haaletanute_arv}</p>
            <p><span className="font-semibold text-green-700">Poolt hääli:</span> {' '}{result.poolt_haali}</p>
            <p><span className="font-semibold text-red-700">Vastu hääli:</span>{' '} {result.vastu_haali}</p>
          </div>
        </div>

        {result.lõppenud === 'ei' && (
          <button onClick={() => navigate('/vote')}
            className='mb-6 w-full bg-teal-500 border border-green-800 px-4 py-2 text-white text-xl py-3 rounded hover:bg-blue-700 transition'> 
            Mine hääletama
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;