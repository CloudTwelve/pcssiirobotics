export const SectionIntro = ({ eyebrow, title, body }) => (
  <div className="section-intro">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    {title && <h2>{title}</h2>}
    {body && <p>{body}</p>}
  </div>
);
