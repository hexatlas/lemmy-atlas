import React from 'react';

function BasedClientDetector(isMobile) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  const isLinux = navigator.platform.toLowerCase().indexOf('linux') > -1;

  // ToDo: Add Adblock detection

  return (
    <div className="based-client-detector">
      {isFirefox && isLinux && <p>Based Check Passed 🫡</p>}
      {!isFirefox && (
        <p>
          You&apos;re not running{' '}
          <a
            href="https://www.mozilla.org/en-US/firefox/browsers/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox
          </a>
          .
        </p>
      )}
      {!isLinux && !isMobile && <p>⚠️ ⚠️ ⚠️ Why are you not using linux 😡</p>}
    </div>
  );
}

export default BasedClientDetector;
