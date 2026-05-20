# SEZ Investment & Performance Dashboard
[View the Live Dashboard Here](https://lonwabo-100.github.io/SEZ-Investment-Dashboard/)

## Overview

The SEZ Investment & Performance Dashboard is a browser-based web application built to simulate an internal monitoring system used within a Special Economic Zone (SEZ) environment.

The application allows management teams to track enterprise tenants, monitor Foreign Direct Investment (FDI), and review job creation statistics across different industrial sectors. It was designed as a lightweight Single Page Application (SPA) using only frontend technologies.

This project was mainly built to strengthen my understanding of:
- DOM manipulation
- Dynamic data rendering
- Client-side state management
- Data visualization using Chart.js
- Interactive table operations using Vanilla JavaScript

---

## Features

### Sector-Based Analytics
Interactive charts update dynamically based on the selected industry sector:
- Automotive
- Energy
- Logistics

Chart rendering is handled using Chart.js with JavaScript event listeners updating the displayed dataset in real time.

### Enterprise Management
The dashboard includes a modal-based form that allows administrators to add new enterprise tenants directly into the table without refreshing the page.

New entries are immediately reflected in:
- the enterprise table
- investment totals
- job creation statistics
- chart visualizations

### Search and Sorting
The enterprise table supports:
- instant search filtering
- column sorting
- dynamic rendering

Filtering and sorting are handled on the client side using JavaScript array methods and DOM updates.

### CSV Export
Users can export the currently displayed table data into a `.csv` file for external reporting or spreadsheet analysis.

This feature was implemented using JavaScript Blob generation and downloadable object URLs.

---

## Technologies Used

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

### Libraries
- Chart.js

### Concepts Practiced
- DOM manipulation
- Array filtering and sorting
- Event-driven UI updates
- State synchronization
- Responsive layout design

### Deployment
- GitHub Pages

---

## Challenges & Learning Outcomes

One of the main challenges during development was keeping the analytics charts synchronized with dynamically filtered table data while avoiding unnecessary DOM re-renders.

Building this project improved my understanding of:
- managing UI state without frameworks
- structuring reusable JavaScript functions
- handling real-time table updates
- integrating third-party libraries into a frontend-only project

It also helped me practice building applications around realistic business requirements rather than simple demo features.

---

## Future Improvements

Planned improvements for future versions include:
- persistent backend storage
- authentication and role-based access
- database integration
- REST API support
- PDF reporting
- improved mobile responsiveness

---

## Running the Project Locally

Clone the repository:

```bash
git clone https://github.com/Lonwabo-100/SEZ-Investment-Dashboard.git
```

Open the project folder and launch `index.html` in any modern web browser.

No additional dependencies, build tools, or local server setup are required.

---

## Author

Lonwabo Nqamra
(Computer Engineering Graduate)

LinkedIn: www.linkedin.com/in/lonwabo-nqamra-96b2572a6
