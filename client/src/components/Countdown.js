import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Countdown({ redirectOnEnd = false, refreshOnEnd = false }) {
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [hasEnded, setHasEnded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/getLatestResult.php')
      .then(res => res.json())
      .then(data => {
        if (!data.h_alguse_aeg) return;

        if (data.lõppenud === 'jah') {
          if (redirectOnEnd) {
            alert("Hääletuse aeg on lõppenud.");
            navigate('/');
          } else if (refreshOnEnd && !sessionStorage.getItem("refreshDone")) {
            sessionStorage.setItem("refreshDone", "true");
            window.location.reload();
          }
          return;
        }

        const start = new Date(data.h_alguse_aeg);
        const end = new Date(start.getTime() + 5 * 60 * 1000);
        const now = new Date();
        const diff = Math.floor((end - now) / 1000);

        setSecondsLeft(Math.max(diff, 0));
      })
      .catch(err => console.error("Error loading countdown:", err));
  }, [navigate, redirectOnEnd, refreshOnEnd]);

  useEffect(() => {
    if (secondsLeft === null || hasEnded) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setHasEnded(true);

          fetch('http://localhost:8000/updateEndVoting.php', {
            method: 'POST'
          }).catch(err => console.error("Error ending vote:", err));

          if (redirectOnEnd) {
            alert("Hääletuse aeg on lõppenud.");
            navigate('/');
          } else if (refreshOnEnd && !sessionStorage.getItem("refreshDone")) {
            sessionStorage.setItem("refreshDone", "true");
            window.location.reload();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, hasEnded, redirectOnEnd, refreshOnEnd, navigate]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (secondsLeft === null) return null;

  return (
    <>
      <h3>
        {secondsLeft > 0
          ? `Aega jäänud hääletuse lõpuni: ${formatTime(secondsLeft)}`
          : ''}
      </h3>
    </>
  );
}

export default Countdown;