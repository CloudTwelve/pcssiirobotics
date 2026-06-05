import { Icon } from '../Icon';
import { SectionIntro } from './SectionIntro';
import { asArray, iconNames } from './utils';

export const FeatureGrid = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow={section.eyebrow} title={section.title} body={section.body} />
    <div className="feature-grid">
      {asArray(section.items).map((item, index) => (
        <article className="feature-card" key={item.title}>
          <span className="card-icon"><Icon name={iconNames[index % iconNames.length]} /></span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  </section>
);
