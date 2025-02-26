import React, { useEffect, useState } from 'react';

function CurrentUTC() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <small className="mute">{currentTime.toUTCString()}</small>;
}

export default CurrentUTC;
