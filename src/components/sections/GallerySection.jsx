import { Icon } from '../Icon';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const Gallery = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow={section.eyebrow || 'Events'} title={section.title || 'Make the work visible'} body={section.body} />
    <div className="gallery-grid">
      {asArray(section.items).map((item, index) => (
        <article className={`gallery-card gallery-card-${index + 1}`} key={item.title}>
          <h3>{item.title}</h3>
          {item.image ? (
            <div className="gallery-card-media">
              <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
            </div>
          ) : (
            <Icon name={index === 0 ? 'camera' : index === 1 ? 'trophy' : 'handshake'} />
          )}
          {!section.hideItemBody && <p>{item.body}</p>}
        </article>
      ))}
    </div>
  </section>
);
