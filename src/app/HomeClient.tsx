"use client";

import { useState, useEffect } from "react";
import { about, person, social } from "@/resources";
import { iconLibrary } from "@/resources/icons";
import { TypingAnimation } from "@/components/TypingAnimation";
import Image from "next/image";
import styles from "./home.module.css";
import PostsCarousel from "@/components/PostsCarousel";
import { ProjectCard } from "@/components";

export default function HomeClient() {
  

  const skillCategories = [
    {
      title: "Core ML & Optimization",
      items: [
        "Python",
        "scikit-learn",
        "Classical ML",
        "Optimization",
        "Evaluation Metrics",
      ],
    },
    {
      title: "Deep Learning & Generative Models",
      items: [
        "PyTorch",
        "TensorFlow",
        "Keras",
        "GANs / VAEs",
        "Diffusion Models",
      ],
    },
    {
      title: "NLP, Seq2Seq & Transformers",
      items: [
        "NLP",
        "Transformers",
        "Seq2Seq",
        "Attention / Tokenization",
      ],
    },
    {
      title: "Computer Vision & Representation Learning",
      items: [
        "Computer Vision",
        "CNNs / ResNet",
        "Object Detection",
        "Segmentation / ViT",
      ],
    },
    {
      title: "Engineering & Tools",
      items: ["React", "Next.js", "TypeScript", "Node.js", "Docker", "AWS", "Git", "SQL"],
    },
  ];

  type PostMeta = {
    slug: string;
    metadata: {
      title: string;
      summary?: string;
      images?: string[];
      team?: { avatar?: string }[];
      link?: string;
      publishedAt?: string;
    };
    content?: string;
  };

  const [posts, setPosts] = useState<PostMeta[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/projects?exclude=portfolio-website,autonomous-vehicle-mapping')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setPosts(data.posts || []);
      })
      .catch(() => {
        if (!mounted) return;
        setPosts([]);
      });

    return () => { mounted = false; };
  }, []);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>

        {/* Background moved to global layout */}

        <div className={styles.heroInner}>
          <p className={styles.role}>{person.role}</p>
          <h1 className={styles.heroTitle}>
            <TypingAnimation text={`Hi, I am ${person.firstName} ${person.lastName}`} />
          </h1>

          <nav className={styles.heroNav} aria-label="Primary">
            <a href="#about" className={styles.heroNavLink}>About</a>
            <a href="#experience" className={styles.heroNavLink}>Experience</a>
            <a href="#skills" className={styles.heroNavLink}>Skills</a>
            <a href="#projects" className={styles.heroNavLink}>Projects</a>
          </nav>
        </div>
      </section>

      

      {/* About Section (embedded on home) */}
      <section id="about" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>ABOUT</h2>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImage}>
              <Image
                src={person.avatar}
                alt={person.name}
                width={720}
                height={900}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </div>
            <div className={styles.aboutText}>
              <h3 className={styles.aboutHeading}>A little something about me</h3>
              <div className={styles.aboutDescription}>{about.intro.description}</div>
            </div>
          </div>
        </div>
      </section>

        {/* Experience Section (from about.work) */}
        {about.work.display && (
          <section id="experience" className={styles.section}>
            <div className={styles.sectionContent}>
              <h2 className={styles.sectionTitle}>{about.work.title}</h2>
              <div className={styles.timeline}>
                {about.work.experiences.map((exp, idx) => (
                  <div key={`${exp.company}-${exp.role}-${idx}`} className={styles.timelineItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 className={styles.experienceRole}>{exp.role}</h3>
                      <div className={styles.experienceTimeframe}>{exp.timeframe}</div>
                    </div>
                    <div className={styles.experienceCompany}>{exp.company}</div>
                    <ul className={styles.achievementsList}>
                      {exp.achievements.slice(0, 3).map((ach, i) => (
                        <li key={`${exp.company}-ach-${i}`} className={styles.achievement}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Projects Section */}
      <section id="projects" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>PROJECTS</h2>
          <div className={styles.projectsList}>
            {posts && posts.length > 0 ? (
              <PostsCarousel
                slides={posts.map((post: PostMeta) => ({
                  key: post.slug,
                  alt: post.metadata.title,
                  node: (
                    <div style={{ padding: 12 }}>
                      <ProjectCard
                        href={`/work/${post.slug}`}
                        images={post.metadata.images || []}
                        title={post.metadata.title}
                        description={post.metadata.summary || ""}
                        content={post.content || ""}
                        avatars={post.metadata.team?.filter((m) => !!m.avatar).map((m) => ({ src: m.avatar as string })) || []}
                        link={post.metadata.link || ""}
                      />
                    </div>
                  ),
                }))}
                interval={3000}
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>SKILLS</h2>
          <p className={styles.skillsSubtitle}> </p>
          <div className={styles.skillsGrid}>
            {skillCategories.map((cat, i) => (
              <div key={cat.title} className={styles.skillCategory}>
                <h3 className={`${styles.categoryTitle} ${styles[`hue${i + 1}`]}`}>{cat.title}</h3>
                <ul className={styles.skillList} aria-label={`${cat.title} skills`}>
                  {cat.items.map((name) => (
                    <li key={`${cat.title}-${name}`} className={styles.skillListItem}>
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>CONTACT</h2>
          <h3 className={styles.contactHeading}>I have got just what you need. Let's talk.</h3>
          <div className={styles.contactInfo}>
            <p className={styles.contactDetail}>{person.email}</p>
            <p className={styles.contactDetail}>{person.location}</p>
          </div>
          <div className={styles.socialLinks}>
            {social.map((item) => {
              const Icon = iconLibrary[item.icon as keyof typeof iconLibrary];
              return (
                <a
                  key={item.name}
                  href={item.link}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Icon ? <Icon className={styles.socialIcon} aria-hidden /> : <span className={styles.socialIcon}>{item.icon}</span>}
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
