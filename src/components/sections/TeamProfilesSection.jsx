import { useState } from 'react';
import { SectionIntro } from './SectionIntro';
import { asArray } from './utils';

const initialsFromName = name => {
  const value = typeof name === 'string' ? name.trim() : '';

  if (!value) {
    return '?';
  }

  const parts = value.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');

  return initials || value.charAt(0).toUpperCase();
};

const DEFAULT_CONNECTOR = {
  enabled: true,
  basePaths: [
    { path: 'M24,18 C41,18 39,46 50,50 C62,54 60,82 76,82', tone: 'primary' },
    { path: 'M76,18 C59,18 61,46 50,50 C38,54 40,82 24,82', tone: 'secondary' }
  ],
  routes: [
    { key: 'alpha', path: 'M22,20 C32,30 40,34 49,50 C57,63 65,70 78,78', pulseX: '26%', pulseY: '30%' },
    { key: 'beta', path: 'M78,22 C66,28 58,34 51,50 C44,64 35,70 20,80', pulseX: '74%', pulseY: '34%' },
    { key: 'gamma', path: 'M20,76 C32,68 38,62 49,50 C58,38 66,30 79,20', pulseX: '28%', pulseY: '68%' },
    { key: 'delta', path: 'M78,76 C66,68 60,62 51,50 C42,38 34,30 21,22', pulseX: '72%', pulseY: '70%' }
  ],
  routeColor: 'rgba(255, 209, 102, 0.86)'
};

const asObject = value => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

const asText = (value, fallback = '') => (typeof value === 'string' && value.trim() ? value : fallback);

const normalizeConnector = value => {
  const candidate = asObject(value);
  const routeSource = asArray(candidate.routes).length > 0 ? asArray(candidate.routes) : DEFAULT_CONNECTOR.routes;
  const basePathSource = asArray(candidate.basePaths).length > 0 ? asArray(candidate.basePaths) : DEFAULT_CONNECTOR.basePaths;

  const routes = routeSource
    .map((route, index) => {
      const routeValue = asObject(route);
      const path = asText(routeValue.path);

      if (!path) {
        return null;
      }

      return {
        key: asText(routeValue.key, `route-${index + 1}`),
        path,
        pulseX: asText(routeValue.pulseX, '50%'),
        pulseY: asText(routeValue.pulseY, '50%')
      };
    })
    .filter(Boolean);

  const basePaths = basePathSource
    .map((entry, index) => {
      const pathValue = asObject(entry);
      const path = asText(pathValue.path);

      if (!path) {
        return null;
      }

      return {
        key: asText(pathValue.key, `base-${index + 1}`),
        tone: asText(pathValue.tone, 'primary'),
        path
      };
    })
    .filter(Boolean);

  return {
    enabled: candidate.enabled !== false,
    routeColor: asText(candidate.routeColor, DEFAULT_CONNECTOR.routeColor),
    routes: routes.length > 0 ? routes : DEFAULT_CONNECTOR.routes,
    basePaths: basePaths.length > 0 ? basePaths : DEFAULT_CONNECTOR.basePaths
  };
};

const TeamMemberCard = ({ member, onActivate, onDeactivate, isActive }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const tags = asArray(member.tags).filter(Boolean);
  const hasImage = typeof member.image === 'string' && member.image.trim() && !imageFailed;
  const cardClassName = `team-member-card ${isActive ? 'is-active' : ''}`;

  return (
    <article
      className={cardClassName}
      tabIndex={0}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
    >
      <header className="team-member-head">
        <div className={`team-avatar ${hasImage ? 'has-image' : ''}`} aria-hidden="true">
          {hasImage ? (
            <img
              src={member.image}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            initialsFromName(member.name)
          )}
        </div>
        <div>
          <h3>{member.name || 'Team member'}</h3>
          {member.role && <p className="team-role">{member.role}</p>}
        </div>
      </header>
      {member.focus && <p className="team-focus">{member.focus}</p>}
      {(member.metricLabel || member.metricValue) && (
        <p className="team-metric">
          <strong>{member.metricValue || 'N/A'}</strong>
          <span>{member.metricLabel || 'Impact'}</span>
        </p>
      )}
      {member.bio && <p className="team-bio">{member.bio}</p>}
      {member.quote && <blockquote>{member.quote}</blockquote>}
      {tags.length > 0 && (
        <div className="team-tag-row" aria-label="Profile highlights">
          {tags.map((tag, index) => (
            <span className="team-tag" key={`${member.name}-${tag}-${index}`}>{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
};

export const TeamProfiles = ({ section }) => {
  const [activeMember, setActiveMember] = useState(null);
  const connector = normalizeConnector(section.connector);
  const tracks = asArray(section.tracks).length > 0
    ? asArray(section.tracks)
    : asArray(section.items);

  const routeIndex = activeMember
    ? Math.abs(((activeMember.lane * 7) + (activeMember.memberIndex * 5)) % connector.routes.length)
    : 0;
  const activeRoute = connector.routes[routeIndex];
  const pulseDelay = activeMember ? `${(routeIndex % 5) * 110}ms` : '0ms';
  const clusterClassName = `team-cluster-grid ${activeMember ? 'has-active-member' : ''}`;
  const clusterStyle = {
    '--pulse-delay': pulseDelay,
    '--pulse-x': activeRoute.pulseX,
    '--pulse-y': activeRoute.pulseY,
    '--route-color': connector.routeColor
  };

  return (
    <section className="content-section team-profiles-section">
      <SectionIntro
        eyebrow={section.eyebrow || 'About the team'}
        title={section.title || 'People behind the robots'}
        body={section.body}
      />
      <div className={clusterClassName} style={clusterStyle}>
        {connector.enabled && (
          <div className="team-connector" aria-hidden="true">
            <svg className="team-connector-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {connector.basePaths.map(basePath => (
                <path
                  className={`connector-path connector-path-${basePath.tone}`}
                  key={basePath.key}
                  d={basePath.path}
                />
              ))}
              {activeMember && <path className="connector-path-route is-active" d={activeRoute.path} />}
            </svg>
            {activeMember && <span className="connector-pulse" />}
          </div>
        )}
        {tracks.map((track, index) => {
          const members = asArray(track.members);
          const laneTone = track.kind === 'mentor' ? 'is-mentor' : 'is-student';

          return (
            <section className={`team-lane ${laneTone}`} key={`${track.title}-${index}`}>
              <header className="team-lane-header">
                <p className="team-lane-label">{track.label || 'Team lane'}</p>
                <h3>{track.title || 'Profiles'}</h3>
                {track.body && <p>{track.body}</p>}
              </header>
                <div className="team-member-grid">
                  {members.map((member, memberIndex) => {
                    const isActive = Boolean(activeMember && activeMember.lane === index && activeMember.memberIndex === memberIndex);

                    return (
                      <TeamMemberCard
                        member={member}
                        key={`${member.name}-${memberIndex}`}
                        isActive={isActive}
                        onActivate={() => setActiveMember({ lane: index, memberIndex })}
                        onDeactivate={() => setActiveMember(current => {
                          if (!current) {
                            return current;
                          }

                          if (current.lane === index && current.memberIndex === memberIndex) {
                            return null;
                          }

                          return current;
                        })}
                      />
                    );
                  })}
                </div>
            </section>
          );
        })}
      </div>
    </section>
  );
};