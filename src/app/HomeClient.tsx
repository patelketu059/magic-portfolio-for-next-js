"use client";

import { useState, useEffect } from "react";
import { about, person, social, hiddenProjects } from "@/resources";
import { iconLibrary } from "@/resources/icons";
import { TypingAnimation } from "@/components/TypingAnimation";
import Image from "next/image";
import styles from "./home.module.css";
import { Carousel } from "@once-ui-system/core";
import { ProjectCard } from "@/components";

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

export default function HomeClient({ initialPosts }: { initialPosts?: PostMeta[] }) {
  

  const skillCategories = [
    {
      title: "Core ML & Optimization",
      items: [
        "Classical ML",
        "Regression & Classification",
        "Tree-Based Models",
        "Imbalanced Learning",
        "Regularization",
        "Optimization & Tuning",
        "Model Evaluation"
      ],
    },
    {
      title: "Deep Learning & Generative Models",
      items: [
        "Neural Networks",
        "Diffusion Models",
        "RNNs / LSTMs",
        "Transformers",
        "Seq2Seq",
        "VAEs",
        "GANs",
        "Natural Language Processing (NLP)",
        "Tokenization"
      ],
    },
    {
      title: "Computer Vision & Representation Learning",
      items: [
        "Computer Vision",
        "CNNs / ResNet",
        "Autoencoders",
        "Vision Transformers (ViT)",
        "Representation Learning",
        "Robustness & Bias",
        "Image Generation",
        "3D Point Cloud Reconstruction"
      ],
    },

    {
      title: "Engineering & Tools",
      items: [
        "Python",
        "Scikit-learn",
        "TensorFlow",
        "Keras",
        "PySpark",
        "Databricks",
        "Docker",
        "AWS", 
        "Git", 
        "SQL",
        "React",
        "Next.js", 
        "TypeScript", 
        "Node.js", 
      ],
    },
  ];

  const [posts, setPosts] = useState<PostMeta[]>(initialPosts || []);

  useEffect(() => {
    // Fetch updates on mount to get any changes since server render
    let mounted = true;
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const all = data.posts || [];
        const visible = all.filter((p: PostMeta) => !hiddenProjects.includes(p.slug));
        setPosts(visible);
      })
      .catch(() => {
        if (!mounted) return;
      });

    return () => { mounted = false; };
  }, []);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>

        {/* Background moved to global layout */}

        <div className={styles.heroInner}>
          <div className={styles.role} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {(() => {
              const order = ["linkedin", "github", "email", "instagram"];
              return order.map((key) => {
                const item = social.find((s) => s.name.toLowerCase().includes(key));
                if (!item) return null;
                const Icon = iconLibrary[item.icon as keyof typeof iconLibrary];
                return (
                  <a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, textDecoration: 'none' }}
                  >
                    {Icon ? <Icon style={{ width: 18, height: 18 }} aria-hidden /> : <span>{item.name}</span>}
                  </a>
                );
              });
            })()}
          </div>
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
              <Carousel
                items={posts.map((post: PostMeta) => ({
                  slide: (
                    <ProjectCard
                      cardId={post.slug}
                      href={`/work/${post.slug}`}
                      images={post.metadata.images || []}
                      title={post.metadata.title}
                      description={post.metadata.summary || ""}
                      content={post.content || ""}
                      avatars={post.metadata.team?.filter((m) => !!m.avatar).map((m) => ({ src: m.avatar as string })) || []}
                      link={post.metadata.link || ""}
                    />
                  ),
                  alt: post.metadata.title,
                }))}
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
