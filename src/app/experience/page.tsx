import type React from "react";
import styles from "../home.module.css";
import Image from "next/image";
import { about } from "@/resources";

export default function ExperiencePage() {
  const work = about.work;

  if (!work?.display) {
    return (
      <div className={`${styles.section} ${styles.experiencePage}`}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
          <p>Experience details are currently hidden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.section} ${styles.experiencePage}`}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>{work.title}</h2>
        <div className={styles.timeline}>
          {work.experiences.map((exp, idx) => (
            <div key={`${exp.company}-${exp.role}-${idx}`} className={styles.timelineItem}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 className={styles.experienceRole}>{exp.role}</h3>
                <div className={styles.experienceTimeframe}>{exp.timeframe}</div>
              </div>
              <div className={styles.experienceCompany}>{exp.company}</div>
              <ul className={styles.achievementsList}>
                {exp.achievements.map((ach: React.ReactNode, i: number) => (
                  <li key={`${exp.company}-ach-${i}`} className={styles.achievement}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Studies / Education - inline under timeline so it sits directly beneath and aligns with the timeline */}
        {about.studies?.display && (
          <div id="education" className={styles.educationSectionInline}>
            <h2 className={styles.sectionTitle}>{about.studies.title || "Education"}</h2>
            <div className={styles.educationList}>
              {about.studies.institutions.map((inst) => (
                <div key={inst.name} className={styles.institution}>
                  <div className={styles.institutionHeader}>
                    <div className={styles.institutionTitle}>{inst.name}</div>
                    <div className={styles.institutionMeta}>
                      {inst.degree ? <div className={styles.institutionDegree}>{inst.degree}</div> : null}
                      {inst.specialization ? (
                        <div className={styles.institutionSpecialization}>{inst.specialization}</div>
                      ) : null}
                    </div>
                  </div>

                  {inst.description?.length ? (
                    <div className={styles.institutionDesc}>
                      {inst.description.map((d, idx) => (
                        <div key={`${inst.name}-desc-${idx}`}>{d}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
