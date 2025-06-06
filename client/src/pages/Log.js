import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config'

function Log() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/getLogs.php`)
      .then(response => response.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching logs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading logs...</p>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className='container max-w-3xl bg-white shadow-md rounded-md p-6'>
        <button onClick={() => navigate('/admin')}
            className='mb-6 w-full bg-gray-700 border border-green-800 px-4 py-2 text-white text-xl py-3 rounded-md shadow hover:bg-teal-700 transition'> 
          Tagasi Admin lehele
        </button>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          Logid
        </h1>
        {Array.isArray(logs) && logs.length > 0 ? (
          <ul className='space-y-3 text-sm text-gray-700 max-h[500px] overflow-y-auto'>
            {logs.map((log, index) => (
              <li 
              key={index}
              className='bg-gray-50 border border-gray-300 rounded p-3 font-mono break-all'>{JSON.stringify(log)}</li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500 italic'>Logisid ei leitud</p>
        )}
      </div>
    </div>
  );
}

export default Log;