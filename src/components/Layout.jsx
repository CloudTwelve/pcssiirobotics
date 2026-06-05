import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { Icon } from './Icon';

export const Layout = ({ content }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const pathname = useRouterState({ select: state => state.location.pathname });
  const primaryNavigation = Array.isArray(content.navigationPrimary)
    ? content.navigationPrimary
    : Array.isArray(content.navigation)
      ? content.navigation.slice(0, 5)
      : [];
  const secondaryNavigation = Array.isArray(content.navigationSecondary)
    ? content.navigationSecondary
    : Array.isArray(content.navigation)
      ? content.navigation.slice(5)
      : [];
  const brandName = content.brand?.name || 'Robotics Team';
  const location = content.brand?.location || '';
  const email = content.brand?.email || '';
  const school = content.brand?.school || '';
  const tagline = content.brand?.tagline || '';

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link to="/" className="brand-lockup" onClick={() => { setMenuOpen(false); setMoreMenuOpen(false); }}>
          <span className="brand-mark">P2</span>
          <span>
            <strong>{brandName}</strong>
            <small>{location}</small>
          </span>
        </Link>

        <button
          className="icon-button nav-toggle"
          type="button"
          onClick={() => setMenuOpen(value => !value)}
          aria-label="Toggle navigation"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? 'x' : 'menu'} />
        </button>

        <nav id="primary-navigation" className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label="Primary navigation">
          {primaryNavigation.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={pathname === item.path ? 'nav-link is-active' : 'nav-link'}
              onClick={() => { setMenuOpen(false); setMoreMenuOpen(false); }}
            >
              {item.label}
            </Link>
          ))}

          {secondaryNavigation.length > 0 && (
            <div className="nav-more-wrapper">
              <button
                className={moreMenuOpen ? 'nav-more-button is-open' : 'nav-more-button'}
                type="button"
                aria-label="Toggle more links"
                aria-expanded={moreMenuOpen}
                onClick={() => setMoreMenuOpen(value => !value)}
              >
                More <span aria-hidden="true">▾</span>
              </button>

              {moreMenuOpen && (
                <div className="nav-more-panel" aria-label="Secondary navigation">
                  {secondaryNavigation.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={pathname === item.path ? 'nav-link is-active' : 'nav-link'}
                      onClick={() => { setMenuOpen(false); setMoreMenuOpen(false); }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <span className="footer-kicker">PCSS II Robotics</span>
          <p>{tagline}</p>
          <div className="footer-social-links" aria-label="Related links">
            {(Array.isArray(content.brand?.social) ? content.brand.social : []).map(link => {
              const isExternal = link.href?.startsWith('http');

              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
        <div className="footer-links">
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {school && <span>{school}</span>}
        </div>
      </footer>
    </div>
  );
};
