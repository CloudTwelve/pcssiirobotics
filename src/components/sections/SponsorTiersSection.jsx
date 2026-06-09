import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const SponsorTiers = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Fuel the season" title="Give students the parts, tools, and access to do real engineering" />
    <div className="tier-grid">
      {asArray(section.items).map(tier => (
        <article className="tier-card" key={tier.tier}>
          <span>{tier.amount}</span>
          <h3>{tier.tier}</h3>
          <ul>{asArray(tier.benefits).map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
        </article>
      ))}
    </div>
  </section>
);
