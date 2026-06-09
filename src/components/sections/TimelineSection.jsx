import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const Timeline = ({ section }) => (
  <section className="content-section split-section">
    <SectionIntro eyebrow={section.eyebrow} title={section.title} body={section.body} />
    <div className="timeline">
      {asArray(section.items).map(item => (
        <article key={item.title} className="timeline-item">
          <time>{item.date}</time>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);
