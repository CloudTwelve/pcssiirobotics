import { useState } from 'react';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

const SponsorLogo = ({ sponsor }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const isCurrentSponsor = (sponsor.tagline || '').toLowerCase().includes('current sponsor');

  const initials = sponsor.name
    .split(' ')
    .map(token => token[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <article className={`sponsor-logo-card${isCurrentSponsor ? ' is-featured' : ''}`}>
      <a href={sponsor.href || '#'} target={sponsor.href ? '_blank' : undefined} rel={sponsor.href ? 'noreferrer' : undefined}>
        <div className="sponsor-logo-frame" aria-label={sponsor.name}>
          {!imageFailed && sponsor.logo ? (
            <img src={sponsor.logo} alt={sponsor.name} loading="lazy" onError={() => setImageFailed(true)} />
          ) : (
            <span className="sponsor-logo-fallback" aria-hidden="true">{initials}</span>
          )}
        </div>
        {isCurrentSponsor && <span className="sponsor-badge">Current sponsor</span>}
        <h4>{sponsor.name}</h4>
        {sponsor.tagline && <p>{sponsor.tagline}</p>}
      </a>
    </article>
  );
};

export const SponsorShowcase = ({ section }) => (
  <section className="content-section sponsor-showcase-section">
    <div className="split-section">
      <div>
        <SectionIntro eyebrow={section.eyebrow || 'Sponsorship'} title={section.title || 'Sponsor the event'} body={section.body} />
        {section.email && (
          <p className="sponsor-contact-copy">Want to sponsor us? Reach out to <a className="email-link" href={`mailto:${section.email}`}>{section.email}</a> for details on sponsorship.</p>
        )}
      </div>

      <div className="sponsor-summary-panel">
        <p className="eyebrow">Community support</p>
        <h3>{section.summaryTitle || 'A race toward impact'}</h3>
        <p>{section.summary || 'Support mentorship, build space, prizes, and student-led innovation.'}</p>
      </div>
    </div>

    {asArray(section.sponsors).length > 0 && (
      <div className="sponsor-wall" aria-label="Sponsor logo wall">
        {section.sponsors.map((sponsor, index) => (
          <SponsorLogo sponsor={sponsor} key={`${sponsor.name}-${index}`} />
        ))}
      </div>
    )}

    <div className="tier-grid">
      {asArray(section.tiers).map((tier, index) => (
        <article className="tier-card" key={`${tier.tier}-${index}`}>
          <div className="tier-heading">
            <p className="eyebrow">{tier.level || 'Tier'}</p>
            <h3>{tier.tier}</h3>
          </div>
          {tier.status && <span className="pill" aria-label="tier status">{tier.status}</span>}
          {tier.description && <p>{tier.description}</p>}
          {asArray(tier.benefits).length > 0 && (
            <ul>
              {tier.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}
            </ul>
          )}
        </article>
      ))}
    </div>
  </section>
);
