import { SectionIntro } from './SectionIntro';

export const Story = ({ section }) => (
  <section className="story-band">
    <div className="story-panel">
      <SectionIntro eyebrow={section.eyebrow} title={section.title} body={section.body} />
    </div>
    <div className="principle-stack">
      <span>Prototype</span>
      <span>Test</span>
      <span>Compete</span>
      <span>Reflect</span>
    </div>
  </section>
);
