import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('ic3.cookies');
    if (!consent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const acceptAll = () => {
    const prefs = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('ic3.cookies', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const prefs = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('ic3.cookies', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
  };

  const openSettings = () => {
    setShowSettings(true);
    setShowBanner(false);
  };

  const saveSettings = () => {
    localStorage.setItem('ic3.cookies', JSON.stringify(preferences));
    setShowSettings(false);
  };

  const togglePreference = (key) => {
    if (key === 'necessary') return; // Can't disable necessary
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {showBanner && (
        <div className={`cookie-banner show`}>
          <div className="container">
            <span>Vi använder cookies för att förbättra din upplevelse. Välj vad som passar dig.</span>
            <div>
              <button className="primary" onClick={acceptAll}>Acceptera alla</button>
              <button onClick={acceptNecessary}>Endast nödvändiga</button>
              <button className="ghost" onClick={openSettings}>Inställningar</button>
            </div>
          </div>
        </div>
      )}
      {showSettings && (
        <div className={`cookie-settings show`}>
          <div className="modal">
            <h2>Cookieinställningar</h2>
            <div className="category">
              <label>
                <input type="checkbox" checked={preferences.necessary} disabled /> Nödvändiga cookies
              </label>
              <p>Nödvändiga för att webbplatsen ska fungera.</p>
            </div>
            <div className="category">
              <label>
                <input type="checkbox" checked={preferences.analytics} onChange={() => togglePreference('analytics')} /> Analyscookies
              </label>
              <p>Hjälper oss att förstå hur besökare använder webbplatsen.</p>
            </div>
            <div className="category">
              <label>
                <input type="checkbox" checked={preferences.marketing} onChange={() => togglePreference('marketing')} /> Marknadsföringscookies
              </label>
              <p>Används för att visa relevanta annonser.</p>
            </div>
            <button onClick={saveSettings}>Spara inställningar</button>
          </div>
        </div>
      )}
    </>
  );
}
