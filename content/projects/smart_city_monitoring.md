---
title: "Advanced Smart City Monitoring: Real-Time Identification of Indian Citizen Attributes"
date: 2024-07-01
draft: false

summary: "Real-time person attribute recognition using pretrained transformers + YOLOv10 deployment."

paper: "ADD_ARXIV_LINK_HERE"
pdf: "ADD_PDF_LINK_HERE"
github: "ADD_GITHUB_LINK_HERE"

venue: "arXiv preprint arXiv:2407.03305 (2024)"
tags: ["Person Attribute Recognition", "Transformers", "YOLO", "Smart City AI", "Computer Vision"]
---

## Overview

This work presents a real-time pipeline for **Person Attribute Recognition (PAR)** aimed at smart city surveillance applications.

The system identifies attributes such as:

- clothing type  
- pose  
- headgear  

and is optimized for real-time deployment.

---

## Key Contributions

- Developed an end-to-end PAR pipeline using:

  - pretrained transformer-based models  
  - fine-tuning on pedestrian image datasets  

- Integrated the system with:

  - **YOLOv10** detection  
  - cascading inference for real-time usage  

- Applied regularization improvements:

  - dropout  
  - **ScaledBCELoss**, reducing overfitting  

---

## Results

- Achieved **0.86 accuracy** in attribute recognition  
- Reduced latency by **98%**, enabling real-time performance

---

## Links

- arXiv Paper: ADD_ARXIV_LINK_HERE  
- PDF: ADD_PDF_LINK_HERE  
- Code: ADD_GITHUB_LINK_HERE  

