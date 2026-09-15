import { SectionRenderer, Hero } from './Sections';

export const HomePage = ({ content }) => (
  <>
    <Hero hero={content.home.hero} brand={content.brand} />
    {(Array.isArray(content.home.sections) ? content.home.sections : []).map((section, index) => (
      <SectionRenderer section={section} key={`${section.type}-${section.title}-${index}`} />
    ))}
  </>
);

export const GenericPage = ({ page }) => (
  <>
    <section className="page-hero">
      <p className="eyebrow">PCSS II Robotics</p>
      <h1>{page.title}</h1>
      <p>{page.summary}</p>
    </section>
    {(Array.isArray(page.sections) ? page.sections : []).map((section, index) => (
      <SectionRenderer section={section} key={`${page.slug}-${section.type}-${index}`} />
    ))}
  </>
);

export const NotFoundPage = ({ content }) => (
  <section className="page-hero not-found">
    <p className="eyebrow">{content.brand.name}</p>
    <h1>Page not found</h1>
    <p>This page is not in the current editable content model.</p>
    <a className="button primary" href="/">Return home</a>
  </section>
);
