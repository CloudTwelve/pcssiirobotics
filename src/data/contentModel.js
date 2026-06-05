const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

const asString = (value, fallback = '') => typeof value === 'string' ? value : fallback;

const asArray = value => Array.isArray(value) ? value : [];

const sanitizeSlug = (value, fallback) => {
  const candidate = asString(value, fallback)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

  return candidate || fallback;
};

const normalizeHref = (value, fallback) => {
  const href = asString(value, fallback).trim();

  if (!href) {
    return fallback;
  }

  if (href.startsWith('/') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return href;
  }

  return `/${href.replace(/^\/+/, '')}`;
};

const normalizeSection = (section, index) => {
  if (!isObject(section)) {
    return {
      type: 'featureGrid',
      title: 'Section',
      items: []
    };
  }

  return {
    ...section,
    type: asString(section.type, 'featureGrid'),
    title: asString(section.title, ''),
    eyebrow: asString(section.eyebrow, ''),
    body: asString(section.body, ''),
    items: asArray(section.items),
    _id: asString(section._id, `section-${index}`)
  };
};

const normalizePage = (page, index) => {
  const fallbackSlug = `page-${index + 1}`;

  if (!isObject(page)) {
    return {
      slug: fallbackSlug,
      title: 'Untitled Page',
      summary: '',
      sections: []
    };
  }

  return {
    ...page,
    slug: sanitizeSlug(page.slug, fallbackSlug),
    title: asString(page.title, 'Untitled Page'),
    summary: asString(page.summary, ''),
    sections: asArray(page.sections).map((section, sectionIndex) => normalizeSection(section, sectionIndex))
  };
};

const normalizeNavigation = (navigation, pages) => {
  const normalizedNavigation = asArray(navigation)
    .map((item, index) => {
      if (!isObject(item)) {
        return null;
      }

      const label = asString(item.label, `Page ${index + 1}`);
      const path = normalizeHref(item.path, '/');

      return { ...item, label, path };
    })
    .filter(Boolean);

  const hasHome = normalizedNavigation.some(item => item.path === '/');

  const knownPaths = new Set(normalizedNavigation.map(item => item.path));
  const pagePaths = pages.map(page => `/${page.slug}`).filter(path => !knownPaths.has(path));

  const fallbackHome = hasHome ? [] : [{ label: 'Home', path: '/' }];
  const fallbackPages = pagePaths.map(path => ({ label: path.replace('/', '') || 'Home', path }));

  return [...fallbackHome, ...normalizedNavigation, ...fallbackPages];
};

export const normalizeContent = (rawContent, fallbackContent = {}) => {
  const raw = isObject(rawContent) ? rawContent : {};
  const fallback = isObject(fallbackContent) ? fallbackContent : {};

  const mergedBrand = {
    ...(isObject(fallback.brand) ? fallback.brand : {}),
    ...(isObject(raw.brand) ? raw.brand : {})
  };

  const pagesSource = asArray(raw.pages).length > 0 ? raw.pages : asArray(fallback.pages);
  const pages = pagesSource.map((page, index) => normalizePage(page, index));

  const homeSource = isObject(raw.home) ? raw.home : isObject(fallback.home) ? fallback.home : {};
  const homeHero = isObject(homeSource.hero) ? homeSource.hero : {};

  return {
    ...fallback,
    ...raw,
    brand: {
      ...mergedBrand,
      name: asString(mergedBrand.name, 'PCSS II Robotics'),
      shortName: asString(mergedBrand.shortName, 'PCSS II'),
      tagline: asString(mergedBrand.tagline, ''),
      location: asString(mergedBrand.location, ''),
      email: asString(mergedBrand.email, ''),
      school: asString(mergedBrand.school, ''),
      social: asArray(mergedBrand.social)
    },
    home: {
      ...homeSource,
      hero: {
        ...homeHero,
        eyebrow: asString(homeHero.eyebrow, ''),
        title: asString(homeHero.title, ''),
        body: asString(homeHero.body, ''),
        primaryCta: {
          label: asString(homeHero.primaryCta?.label, 'Learn more'),
          href: normalizeHref(homeHero.primaryCta?.href, '/join')
        },
        secondaryCta: {
          label: asString(homeHero.secondaryCta?.label, 'Contact'),
          href: normalizeHref(homeHero.secondaryCta?.href, '/contact')
        },
        stats: asArray(homeHero.stats)
      },
      sections: asArray(homeSource.sections).map((section, index) => normalizeSection(section, index))
    },
    pages,
    navigation: normalizeNavigation(raw.navigation ?? fallback.navigation, pages)
  };
};
