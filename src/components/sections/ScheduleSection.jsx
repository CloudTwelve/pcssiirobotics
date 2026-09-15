import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

export const Schedule = ({ section }) => {
  const dayGroups = asArray(section.days);

  if (dayGroups.length === 0) {
    dayGroups.push({
      label: section.label || 'Schedule',
      items: asArray(section.items)
    });
  }

  return (
    <section className="content-section schedule-section">
      <SectionIntro eyebrow={section.eyebrow || 'Schedule'} title={section.title || 'Event flow'} body={section.body} />
      <div className="schedule-grid">
        {dayGroups.map((day, dayIndex) => (
          <article className="schedule-board" key={`${day.label}-${dayIndex}`}>
            <div className="schedule-header">
              <p className="eyebrow">{day.label}</p>
              {day.summary && <p>{day.summary}</p>}
            </div>
            <div className="schedule-list">
              {asArray(day.items).map((item, itemIndex) => (
                <div className="schedule-row" key={`${item.time}-${item.label}-${itemIndex}`}>
                  <div className="schedule-meta">
                    <span className="schedule-time">{item.time}</span>
                    {item.tag && <span className="pill schedule-tag">{item.tag}</span>}
                  </div>
                  <div className="schedule-copy">
                    <h3>{item.label}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
