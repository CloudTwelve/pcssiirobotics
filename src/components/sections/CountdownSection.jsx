import { useEffect, useState } from 'react';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

const parseTarget = value => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getCountdownParts = targetDate => {
  if (!targetDate) {
    return null;
  }

  const difference = targetDate.getTime() - Date.now();
  const totalSeconds = Math.max(Math.floor(difference / 1000), 0);

  return {
    days: Math.floor(totalSeconds / (60 * 60 * 24)),
    hours: Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60)),
    minutes: Math.floor((totalSeconds % (60 * 60)) / 60),
    seconds: totalSeconds % 60
  };
};

export const Countdown = ({ section }) => {
  const [timeLeft, setTimeLeft] = useState(() => getCountdownParts(parseTarget(section.targetDate || section.date)));

  useEffect(() => {
    const target = parseTarget(section.targetDate || section.date);

    if (!target) {
      setTimeLeft(null);
      return undefined;
    }

    const updateCountdown = () => {
      setTimeLeft(getCountdownParts(target));
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [section.date, section.targetDate]);

  const statusLabel = section.status || 'Live event';
  const location = section.location || 'Location announced';
  const startTime = section.time || 'TBD';
  const dateLabel = section.dateLabel || section.date || 'Date TBD';
  const timedStats = [
    { label: 'Days', value: String((timeLeft?.days ?? 0) || 0).padStart(2, '0') },
    { label: 'Hours', value: String((timeLeft?.hours ?? 0) || 0).padStart(2, '0') },
    { label: 'Minutes', value: String((timeLeft?.minutes ?? 0) || 0).padStart(2, '0') },
    { label: 'Seconds', value: String((timeLeft?.seconds ?? 0) || 0).padStart(2, '0') }
  ];

  return (
    <section className="content-section countdown-section">
      <SectionIntro eyebrow={section.eyebrow || 'Countdown'} title={section.title || 'Event countdown'} body={section.body} />
      <div className="countdown-shell">
        <div className="countdown-stage">
          <div className="countdown-chip-row">
            <span className="pill countdown-pill">{statusLabel}</span>
            <span className="pill countdown-pill">{dateLabel}</span>
          </div>
          <div className="countdown-grid" aria-label="Countdown timer">
            {timedStats.map((item, index) => (
              <div className="countdown-cell" key={`${item.label}-${index}`}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <p className="countdown-note">{section.note || 'Keep checking back for schedule updates and event reminders.'}</p>
        </div>

        <aside className="countdown-meta">
          <div className="countdown-meta-card">
            <p className="eyebrow">When & where</p>
            <h3>{location}</h3>
            <p>{dateLabel}</p>
            <p>{startTime}</p>
          </div>

          {(asArray(section.highlights)).length > 0 && (
            <div className="countdown-meta-card">
              <p className="eyebrow">Highlights</p>
              <ul className="countdown-highlight-list">
                {asArray(section.highlights).map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
