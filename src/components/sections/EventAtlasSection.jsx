import { useMemo, useState } from 'react';
import { Icon } from '../Icon';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

const readableDate = value => {
  if (!value) {
    return 'Date TBD';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const eventDateLabel = event => {
  if (event.dateRange) {
    return event.dateRange;
  }

  if (event.startDate && event.endDate) {
    return `${readableDate(event.startDate)} - ${readableDate(event.endDate)}`;
  }

  return readableDate(event.startDate || event.date);
};

const getEventSortTimestamp = event => {
  const rawDate = event.startDate || event.date;

  if (!rawDate) {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = new Date(rawDate);

  if (Number.isNaN(parsed.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return parsed.getTime();
};

const includesLens = (event, activeLens) => {
  if (activeLens === 'All') {
    return true;
  }

  const bucket = [
    event.program,
    event.status,
    ...asArray(event.tags)
  ]
    .filter(Boolean)
    .map(value => String(value).toLowerCase());

  return bucket.some(value => value.includes(activeLens.toLowerCase()));
};

export const EventAtlas = ({ section }) => {
  const clusters = asArray(section.clusters);
  const lenses = ['All', ...asArray(section.lenses)];
  const [activeLens, setActiveLens] = useState('All');

  const renderedClusters = useMemo(() => clusters.map(cluster => {
    const sortedEvents = [...asArray(cluster.events)].sort((left, right) => {
      const leftTime = getEventSortTimestamp(left);
      const rightTime = getEventSortTimestamp(right);

      if (leftTime !== rightTime) {
        return leftTime - rightTime;
      }

      return String(left.name || '').localeCompare(String(right.name || ''));
    });

    return {
      ...cluster,
      events: sortedEvents.filter(event => includesLens(event, activeLens))
    };
  }), [clusters, activeLens]);

  return (
    <section className="content-section event-atlas-section">
      <SectionIntro
        eyebrow={section.eyebrow || 'Event atlas'}
        title={section.title || 'Moments in motion'}
        body={section.body || 'Track upcoming, live, and archived programs in one system.'}
      />

      {lenses.length > 0 && (
        <div className="atlas-controls" aria-label="Event lenses">
          {lenses.map(lens => (
            <button
              className={activeLens === lens ? 'atlas-chip is-active' : 'atlas-chip'}
              key={lens}
              type="button"
              onClick={() => setActiveLens(lens)}
            >
              {lens}
            </button>
          ))}
        </div>
      )}

      <div className="atlas-cluster-grid">
        {renderedClusters.map(cluster => (
          <section className="atlas-lane" key={cluster.label} aria-label={cluster.label}>
            <header className="atlas-lane-header">
              <p className="eyebrow">{cluster.label}</p>
              {cluster.description && <p>{cluster.description}</p>}
            </header>

            <div className="atlas-event-list">
              {asArray(cluster.events).length === 0 && (
                <p className="atlas-empty">No events match this lens yet.</p>
              )}

              {asArray(cluster.events).map(event => (
                <article className={event.spotlight ? 'atlas-event-card is-spotlight' : 'atlas-event-card'} key={`${cluster.label}-${event.name}`}>
                  <div className="atlas-event-meta">
                    <span className="pill atlas-status">{event.status || 'Planned'}</span>
                    {event.program && <span className="atlas-program">{event.program}</span>}
                  </div>

                  <h3>{event.name}</h3>
                  <p className="atlas-date"><Icon name="calendar" size={16} /> {eventDateLabel(event)}</p>
                  <p className="atlas-location"><Icon name="map" size={16} /> {event.location || 'Location TBA'}</p>

                  {event.summary && <p className="atlas-summary">{event.summary}</p>}

                  {asArray(event.tags).length > 0 && (
                    <div className="atlas-tag-row" aria-label="Event tags">
                      {asArray(event.tags).map(tag => <span className="atlas-tag" key={tag}>{tag}</span>)}
                    </div>
                  )}

                  {asArray(event.outcomes).length > 0 && (
                    <ul className="atlas-outcomes">
                      {asArray(event.outcomes).map(outcome => <li key={outcome}>{outcome}</li>)}
                    </ul>
                  )}

                  {event.href && (
                    <a className="atlas-link" href={event.href}>
                      Explore event <Icon name="chevron" size={16} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};
