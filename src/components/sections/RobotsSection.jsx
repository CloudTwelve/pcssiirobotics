import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const Robots = ({ section }) => (
  <section className="content-section">
    <SectionIntro eyebrow="Robot archive" title="Every robot should teach the next one" />
    <div className="robot-grid">
      {asArray(section.items).map(robot => (
        <article className="robot-card" key={`${robot.season}-${robot.name}`}>
          <div className="robot-season">{robot.season}</div>
          <div>
            <span className="pill">{robot.status}</span>
            <h3>{robot.name}</h3>
            <p>{robot.summary}</p>
            <ul>
              {asArray(robot.highlights).map(highlight => <li key={highlight}>{highlight}</li>)}
            </ul>
          </div>
        </article>
      ))}
    </div>
  </section>
);
