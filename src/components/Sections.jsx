import { Contact } from './sections/ContactSection';
import { Countdown } from './sections/CountdownSection';
import { EventAtlas } from './sections/EventAtlasSection';
import { Events } from './sections/EventsSection';
import { FeatureGrid } from './sections/FeatureGridSection';
import { Gallery } from './sections/GallerySection';
import { Hero } from './sections/HeroSection';
import { Join } from './sections/JoinSection';
import { Links } from './sections/LinksSection';
import { Programs } from './sections/ProgramsSection';
import { Robots } from './sections/RobotsSection';
import { Schedule } from './sections/ScheduleSection';
import { Speakers } from './sections/SpeakerSection';
import { SponsorShowcase } from './sections/SponsorShowcaseSection';
import { SponsorTiers } from './sections/SponsorTiersSection';
import { Story } from './sections/StorySection';
import { TeamProfiles } from './sections/TeamProfilesSection';
import { Timeline } from './sections/TimelineSection';

export { Hero };

export const Values = ({ section }) => <FeatureGrid section={section} />;

export const SectionRenderer = ({ section }) => {
  const components = {
    featureGrid: FeatureGrid,
    timeline: Timeline,
    story: Story,
    values: Values,
    programs: Programs,
    robots: Robots,
    sponsorTiers: SponsorTiers,
    sponsorShowcase: SponsorShowcase,
    events: Events,
    eventAtlas: EventAtlas,
    gallery: Gallery,
    contact: Contact,
    join: Join,
    countdown: Countdown,
    schedule: Schedule,
    speakers: Speakers,
    links: Links,
    teamProfiles: TeamProfiles
  };
  const Component = components[section.type] || FeatureGrid;
  return <Component section={section} />;
};
