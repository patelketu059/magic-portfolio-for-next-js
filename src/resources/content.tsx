import { About, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Ketu",
  lastName: "Patel",
  name: `Ketu Patel`,
  role: "AI/ML Engineer",
  avatar: "/images/avatar.jpg",
  email: "patel.ketu.059@gmail.com",
  location: "America/New_York", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Hindi", "Gujarati"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "http://github.com/patelketu059",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/ketu-patel/",
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/ketu__p?igsh=MTdvZ2d0dnVuZ3hmeg==",
  },
  // {
  //   name: "Threads",
  //   icon: "threads",
  //   link: "https://www.threads.com/@once_ui",
  // },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building bridges between curiosity and learning</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/AI-image-generation",
  },
  subline: (
    <>
      I'm Ketu, an AI/ML Engineer who builds AI projects to explore and exploit the newest cutting edge learning models. 
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
      I’m a Software & Machine Learning Engineer with 4+ years of experience designing, building, and deploying data-driven systems end-to-end.
      I sit at the intersection of ML research and production engineering: I love taking messy real-world problems, turning them into well-posed 
      modeling tasks, and shipping reliable solutions that users actually touch.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "General Motors",
        timeframe: "October 2023  - April 2025",
        role: "Software Engineer",
        achievements: [
          <>
            Led cross-functional teams encompassing software developers, system architects, and quality engineers to define,
document, and release software requirements and specifications.
          </>,
          <>
            Orchestrated regular meetings with internal stakeholders and external suppliers to monitor project progress, mitigate
risks, and address issues, ensuring adherence to project timelines and objectives.
          </>,
          <>
          Oversaw the end-to-end software release process, from initial design to validation and verification, ensuring strict
compliance with automotive industry standards and regulations.
          </>,
          <>
          Conducted comprehensive reviews of software deliverables, swiftly identifying and rectifying defects and inconsistencies
to uphold superior standards of quality and reliability.
          </>,
          <>
          Developed and meticulously maintained documentation, including release notes, change logs, and technical
specifications, furnishing stakeholders and end-users with clear and exhaustive guidance.
          </>
        ],
        images: [],
      },
      {
        company: "General Motors",
        timeframe: "February 2023 - October 2023",
        role: "Global Product Development Data Analyst",
        achievements: [
          <>
            Implemented an AutoML pipeline using PyTorch and Scikit-learn to predict the Head Impact Score, transitioning testing to a virtual
environment and reducing costs and time by 99%. Performed extensive validation and hyperparameter tuning, achieving an R2 score of over
0.97, significantly enhancing predictive accuracy and reducing the need for costly physical testing.

          </>,
          <>
            Developed a forecasting model using Python and time-series analysis to predict Speak Up for Safety trends for the upcoming year. The model
accounted for seasonality, growth, and shifts due to COVID-19 and the return to office, achieving over 95% predictive accuracy. This facilitated
proactive safety planning and resource allocation, significantly improving workplace safety initiatives.
          </>,

        ],
        images: [],
      },
      {
        company: "General Motors",
        timeframe: "July 2022 - February 2023",
        role: "AI/ML Scientist",
        achievements: [
          <>
            Implemented large-scale High-Speed Vehicle Telemetry (HSVT) embeddings generation from raw HSVT data fetched using PySpark based on different levels of geohashes over the entire country. Optimized fetching data to increase time
efficiency resulting to 95%-time reduction, significantly improving the pace of image generation downstream. 
          </>,
          <>
            Extracted features at Intersections by mapping inference points to road edges from Aerial Imagery to improve the transition between road and lane edges at Intersections. 
          </>,
          <>
           Created a Network graph connecting all edges along level-4 geohashes to filter adjoining edges for feature extraction and optimize map matching for sporadic and overlapping HSVT and Aerial images.
          </>,
          <>
          Generated lane center, lane and road edges by correcting Road Network Topology (RNT) and finding number of lanes based on HSVT. Improved map accuracy by supporting map fusion between all 3 data sources. 
          </>
        ],
        images: [],
      },
      {
        company: "General Motors",
        timeframe: "January 2022 - July 2022",
        role: "EV Battery Data Analytics Engineer",
        achievements: [
          <>
            Created Machine Learning models to develop new driver profiles based on the latest field data and constantly evolve the life model algorithm to extrapolate battery life based on different models and packs. 
          </>,
          <>
            Conducted in-depth analysis of temperature profiles and developed predictive models in Python for Electric Vehicle range and battery capacity, leading to a reduction in warranty claims and a decrease in production costs through actionable insights for all downstream impacted teams.
          </>,
          <>
          Created insightful reports for Customers and Manufacturers to reduce warranty and production costs.
          </>
        ],
        images: [],
      },
      {
        company: "General Motors",
        timeframe: "June 2021 - January 2022",
        role: "Embedded Software Engineer ",
        achievements: [
          <>
            Built the Communication protocols for update services that allowed data transaction between the back office and the
cloud adapter present on upcoming vehicles released in MY2024.
          </>,
          <>
            Refactored Over-The-Air services for the vehicles to provide the said updates through any Wireless and LTE networks
and eliminating the need to go to car dealerships for feature updates after verifying authentication for all requests.
          </>,
          <>
          Connected the new communication interface with all existing services depending on the state of the vehicle.
          </>
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Georgia Institute of Technology",
          degree: "Masters of Science",
          specialization: "Artificial Intelligence",
      },
      {
        name: "Rutgers University",
          degree: "Bachelors of Science",
          specialization: "Electrical and Computer Engineering",
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: (
          <>Able to prototype in Figma with Once UI with unnatural speed.</>
        ),
        tags: [
          {
            name: "Figma",
            icon: "figma",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Next.js",
        description: (
          <>Building next gen apps with Next.js + Once UI + Supabase.</>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "Supabase",
            icon: "supabase",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },  
    ],
  },
};


const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

// Global list of project slugs to hide across the site (useful for drafts or in-progress work)
const hiddenProjects: string[] = [
  "portfolio-website",
  "autonomous-vehicle-mapping",
  "automate-design-handovers-with-a-figma-to-code-pipeline",
];

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, work, gallery, hiddenProjects };
