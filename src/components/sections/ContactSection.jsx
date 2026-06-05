import { Icon } from '../Icon';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const Contact = ({ section }) => (
  <section className="content-section contact-band">
    <SectionIntro eyebrow="Contact" title="Bring your question, idea, or support" />
    <div className="contact-grid">
      {section.email ? <a href={`mailto:${section.email}`}><Icon name="mail" />{section.email}</a> : <span><Icon name="mail" />Email unavailable</span>}
      <span><Icon name="map" />{section.address || 'Address unavailable'}</span>
      {asArray(section.items).map(item => (
        <article key={item.label}>
          <h3>{item.label}</h3>
          <p>{item.value}</p>
        </article>
      ))}
    </div>
  </section>
);
