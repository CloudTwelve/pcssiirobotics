import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const Speakers = ({ section }) => (
  <section className="content-section speaker-section">
    <SectionIntro eyebrow={section.eyebrow || 'Speakers'} title={section.title || 'Speakers'} body={section.body} />
    <div className="speaker-grid">
      {asArray(section.items).map((item, index) => (
        <article className="speaker-card" key={`${item.name}-${index}`}>
          <div className="speaker-avatar" aria-hidden="true">{item.name.charAt(0)}</div>
          <div className="speaker-details">
            <h3>{item.name}</h3>
            {item.role && <p className="speaker-role">{item.role}</p>}
            {item.bio && <p className="speaker-bio">{item.bio}</p>}
          </div>
        </article>
      ))}
    </div>
  </section>
);
