import { Icon } from '../Icon';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

const getLinkIcon = item => item.icon || 'sparkles';

export const Links = ({ section }) => (
  <section className="content-section links-section">
    <SectionIntro eyebrow={section.eyebrow || 'Resources'} title={section.title || 'Useful links'} body={section.body} />
    <div className="link-list">
      {asArray(section.items).map((item, index) => (
        <a
          className="link-card"
          href={item.href}
          key={`${item.title}-${index}`}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
        >
          <div className="link-card-header">
            <span className={`card-icon${item.logo ? ' has-logo' : ''}`}>
              {item.logo ? <img className="card-icon-logo" src={item.logo} alt={`${item.title} logo`} loading="lazy" /> : <Icon name={getLinkIcon(item)} />}
            </span>
            <div>
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
            </div>
          </div>
          {item.meta && <span className="link-meta">{item.meta}</span>}
        </a>
      ))}
    </div>
  </section>
);
