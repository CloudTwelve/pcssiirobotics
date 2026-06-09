import { useEffect, useMemo, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Puck, usePuck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { Hero, SectionRenderer } from '../components/Sections';
import { useContent } from '../data/ContentContext';
import {
  applyPuckDataToContent,
  createPuckDataForSlug,
  getSectionTypeOptions,
  slugFromPathname,
  types
} from './puckAdapter';

const toTitleCase = value => value
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, char => char.toUpperCase());

const parseJsonWithoutThrowing = value => {
  if (!value || !String(value).trim()) {
    return {};
  }

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const parseArrayWithoutThrowing = value => {
  if (!value || !String(value).trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toTemplateJson = value => JSON.stringify(value, null, 2);

const TEAM_PROFILES_CONNECTOR_TEMPLATE = toTemplateJson({
  connector: {
    enabled: true,
    routeColor: 'rgba(255, 209, 102, 0.86)',
    basePaths: [
      { path: 'M24,18 C41,18 39,46 50,50 C62,54 60,82 76,82', tone: 'primary' },
      { path: 'M76,18 C59,18 61,46 50,50 C38,54 40,82 24,82', tone: 'secondary' }
    ],
    routes: [
      { key: 'alpha', path: 'M22,20 C32,30 40,34 49,50 C57,63 65,70 78,78', pulseX: '26%', pulseY: '30%' },
      { key: 'beta', path: 'M78,22 C66,28 58,34 51,50 C44,64 35,70 20,80', pulseX: '74%', pulseY: '34%' }
    ]
  }
});

const TEAM_PROFILES_TRACKS_TEMPLATE = toTemplateJson({
  tracks: [
    {
      kind: 'mentor',
      label: 'Mentors & teachers',
      title: 'Guides',
      body: 'How this lane contributes.',
      members: [
        {
          name: 'Mentor name',
          role: 'Mentor role',
          image: '/homecards/JPL.webp',
          focus: 'What they coach.',
          metricValue: '12',
          metricLabel: 'teams coached',
          bio: 'Short bio.',
          quote: 'Optional quote.',
          tags: ['Tag one', 'Tag two']
        }
      ]
    },
    {
      kind: 'student',
      label: 'Students & team members',
      title: 'Builders',
      body: 'How this lane contributes.',
      members: [
        {
          name: 'Student name',
          role: 'Student role',
          image: '/homecards/Scrapyard.webp',
          focus: 'What they own.',
          metricValue: '31%',
          metricLabel: 'improvement metric',
          bio: 'Short bio.',
          quote: 'Optional quote.',
          tags: ['Tag one', 'Tag two']
        }
      ]
    }
  ]
});

const GENERIC_FEATURE_GRID_TEMPLATE = toTemplateJson({
  items: [
    { title: 'Card title', body: 'Card description.' },
    { title: 'Card title', body: 'Card description.' }
  ]
});

const createPuckConfig = (brand, sectionTypes) => {
  const sectionTypeOptions = sectionTypes.map(type => ({ label: toTitleCase(type), value: type }));

  return {
    components: {
      [types.HOME_HERO_TYPE]: {
        label: 'Home Hero',
        fields: {
          eyebrow: { type: 'text', label: 'Eyebrow' },
          title: { type: 'text', label: 'Title' },
          body: { type: 'textarea', label: 'Body' },
          primaryLabel: { type: 'text', label: 'Primary CTA Label' },
          primaryHref: { type: 'text', label: 'Primary CTA Href' },
          secondaryLabel: { type: 'text', label: 'Secondary CTA Label' },
          secondaryHref: { type: 'text', label: 'Secondary CTA Href' },
          statsJson: { type: 'textarea', label: 'Stats JSON (array)' },
          extrasJson: { type: 'textarea', label: 'Advanced Hero JSON' }
        },
        defaultProps: {
          eyebrow: '',
          title: '',
          body: '',
          primaryLabel: '',
          primaryHref: '/',
          secondaryLabel: '',
          secondaryHref: '/',
          statsJson: '[]',
          extrasJson: '{}'
        },
        render: props => {
          const hero = {
            ...parseJsonWithoutThrowing(props.extrasJson),
            eyebrow: props.eyebrow || '',
            title: props.title || '',
            body: props.body || '',
            primaryCta: {
              label: props.primaryLabel || '',
              href: props.primaryHref || '/'
            },
            secondaryCta: {
              label: props.secondaryLabel || '',
              href: props.secondaryHref || '/'
            },
            stats: parseArrayWithoutThrowing(props.statsJson)
          };

          return <Hero hero={hero} brand={brand} />;
        }
      },
      [types.PAGE_HEADER_TYPE]: {
        label: 'Page Header',
        fields: {
          title: { type: 'text', label: 'Title' },
          summary: { type: 'textarea', label: 'Summary' }
        },
        defaultProps: {
          title: 'Untitled Page',
          summary: ''
        },
        render: props => (
          <section className="page-hero">
            <p className="eyebrow">PCSS II Robotics</p>
            <h1>{props.title}</h1>
            <p>{props.summary}</p>
          </section>
        )
      },
      [types.SECTION_BLOCK_TYPE]: {
        label: 'Section',
        fields: {
          sectionType: {
            type: 'select',
            label: 'Section Type',
            options: sectionTypeOptions
          },
          eyebrow: { type: 'text', label: 'Eyebrow' },
          title: { type: 'text', label: 'Title' },
          body: { type: 'textarea', label: 'Body' },
          extrasJson: { type: 'textarea', label: 'Advanced Section JSON (templates below)' }
        },
        defaultProps: {
          sectionType: 'featureGrid',
          eyebrow: '',
          title: 'Section',
          body: '',
          extrasJson: '{}'
        },
        render: props => {
          const section = {
            ...parseJsonWithoutThrowing(props.extrasJson),
            type: props.sectionType || 'featureGrid',
            eyebrow: props.eyebrow || '',
            title: props.title || '',
            body: props.body || ''
          };

          return <SectionRenderer section={section} />;
        }
      }
    }
  };
};

const EditorToolbarPreviewButton = () => {
  const { dispatch } = usePuck();
  const [preview, setPreview] = useState(false);

  return (
    <button
      type="button"
      className="button ghost dark"
      onClick={() => {
        const nextPreview = !preview;
        setPreview(nextPreview);
        dispatch({
          type: 'setUi',
          ui: nextPreview
            ? {
                previewMode: 'interactive',
                leftSideBarVisible: false,
                rightSideBarVisible: false
              }
            : {
                previewMode: 'edit',
                leftSideBarVisible: true,
                rightSideBarVisible: true
              }
        });
      }}
    >
      {preview ? 'Exit Preview' : 'Preview'}
    </button>
  );
};

export const AdminEditorPage = () => {
  const { content, save } = useContent();
  const pathname = useRouterState({ select: state => state.location.pathname });
  const slug = useMemo(() => slugFromPathname(pathname), [pathname]);
  const sectionTypes = useMemo(() => getSectionTypeOptions(content), [content]);
  const config = useMemo(() => createPuckConfig(content.brand, sectionTypes), [content.brand, sectionTypes]);

  const [data, setData] = useState(() => createPuckDataForSlug(content, slug));
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setData(createPuckDataForSlug(content, slug));
    setSaveError('');
  }, [content, slug]);

  const viewPath = slug === types.HOME_SLUG ? '/' : `/${slug}`;

  return (
    <section className="admin-page admin-editor-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Editing {slug === types.HOME_SLUG ? 'home' : slug}</h1>
          <p>Every page can be managed in the Puck editor. Use advanced JSON fields for section-specific data models.</p>
        </div>
        <div className="admin-actions">
          <Link className="button ghost dark" to="/admin">All Pages</Link>
          <a className="button ghost dark" href={viewPath} target="_blank" rel="noreferrer">View Live</a>
        </div>
      </div>

      {saveError && <p className="json-error">Save blocked: {saveError}</p>}

      <details className="admin-json-templates" open>
        <summary>JSON Templates For Advanced Section JSON</summary>
        <p>Copy one snippet into Advanced Section JSON, then modify values. Team Profiles accepts both connector and tracks snippets together.</p>
        <label>
          Team Profiles connector preset
          <textarea readOnly value={TEAM_PROFILES_CONNECTOR_TEMPLATE} />
        </label>
        <label>
          Team Profiles tracks preset
          <textarea readOnly value={TEAM_PROFILES_TRACKS_TEMPLATE} />
        </label>
        <label>
          Generic feature grid preset
          <textarea readOnly value={GENERIC_FEATURE_GRID_TEMPLATE} />
        </label>
      </details>

      <div className="admin-panel puck-admin-panel">
        <Puck
          key={slug}
          config={config}
          data={data}
          onPublish={nextData => {
            const result = applyPuckDataToContent(content, slug, nextData);

            if (result.errors.length > 0) {
              setSaveError(result.errors.join(' '));
              return;
            }

            setSaveError('');
            save(result.content);
            setData(nextData);
          }}
          overrides={{
            headerActions: ({ children }) => (
              <>
                <EditorToolbarPreviewButton />
                {children}
              </>
            )
          }}
        />
      </div>
    </section>
  );
};
