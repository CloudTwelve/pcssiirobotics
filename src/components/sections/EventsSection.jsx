import { SectionIntro } from './SectionIntro';
import { asArray, formatEventDate } from './utils';

export const Events = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Calendar" title="The next moments that matter" />
    <div className="event-list">
      {asArray(section.items).map(event => (
        <article className="event-row" key={`${event.date}-${event.name}`}>
          <time dateTime={event.date}>{formatEventDate(event.date)}</time>
          <div>
            <span>{event.category}</span>
            <h3>{event.name}</h3>
            <p>{event.location}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);
