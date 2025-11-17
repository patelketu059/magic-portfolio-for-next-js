"use client";

import React from "react";
import styles from "../home.module.css";
import Image from "next/image";
import { about } from "@/resources";

export default function ExperiencePage() {
  const work = about.work;

  if (!work?.display) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
          <p>Experience details are currently hidden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
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
                {exp.achievements.map((ach: string, i: number) => (
                  <li key={`${exp.company}-ach-${i}`} className={styles.achievement}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
