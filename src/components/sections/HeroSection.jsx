import { Icon } from '../Icon';
import { asArray } from './utils';

export const Hero = ({ hero, brand }) => (
  <section className="hero">
    <div className="hero-media" />
    <div className="hero-overlay" />
    <div className="hero-content">
      <p className="eyebrow">{hero?.eyebrow}</p>
      <h1>{hero?.title}</h1>
      <p className="hero-copy">{hero?.body}</p>
      <div className="hero-actions">
        <a className="button primary" href={hero?.primaryCta?.href || '/join'}>{hero?.primaryCta?.label || 'Join'}<Icon name="chevron" size={18} /></a>
        <a className="button ghost" href={hero?.secondaryCta?.href || '/contact'}>{hero?.secondaryCta?.label || 'Contact'}</a>
      </div>
      <div className="hero-stats" aria-label={`${brand?.shortName || 'Team'} quick facts`}>
        {asArray(hero?.stats).map(stat => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
