---
title: "Pulse of the Crowd: Quantifying Crowd Energy through Audio and Video Analysis"
date: 2024-06-01
draft: false

summary: "Multimodal crowd energy estimation using STEERER for density + CLAP audio embeddings for noise classification."

paper: "ADD_IEEE_LINK_HERE"
pdf: "ADD_PDF_LINK_HERE"
github: "ADD_GITHUB_LINK_HERE"

venue: "IEEE 7th International Conference on Multimedia Information Processing and Retrieval (MIPR), 2024"
tags: ["Multimodal Learning", "Audio-Video Analysis", "Crowd Monitoring", "Computer Vision"]
---

## Overview

This work proposes a multimodal pipeline to quantify **crowd energy** using both:

- video-based crowd density estimation  
- audio-based noise classification  

The goal was to combine visual and acoustic cues for robust crowd monitoring.

---

## Key Contributions

- Built a multimodal framework including:

  - **STEERER model** for crowd density estimation  
  - **CLAP-based audio embeddings** for noise classification  

- Curated a labeled audio dataset with:

  - 50 minutes positive crowd audio  
  - 40 minutes neutral audio  

- Trained a **ResNet50-based classifier** for positive-noise detection.

---

## Results

- Achieved **0.85 accuracy** in positive-noise classification.

---

## Links

- Paper (IEEE MIPR'2024): https://ieeexplore.ieee.org/document/10707791 
