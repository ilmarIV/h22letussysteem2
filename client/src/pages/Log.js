import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Log() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/getLogs.php')
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
    <div>
      <button onClick={() => navigate('/admin')}>Tagasi Admin lehele</button>
      <h1>Logs</h1>
      {Array.isArray(logs) && logs.length > 0 ? (
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{JSON.stringify(log)}</li>
          ))}
        </ul>
      ) : (
        <p>No logs found.</p>
      )}
    </div>
  );
}

export default Log;