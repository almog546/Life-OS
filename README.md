#  Life-OS

**Life-OS** is a full-stack productivity system I built to track time, focus, and energy across different areas of life.

The goal of the project was not just to log hours — but to create meaningful insights about how time is actually spent, how focused I am, and how consistent I stay over weeks and months.

 **Live Demo:** [https://life-os-phi-steel.vercel.app/](https://life-os-phi-steel.vercel.app/)

![Dashboard View](Dashboard.jpg)

---

##  Why I Built This

Most productivity tools track tasks. I wanted something that tracks:

* **Time**
* **Energy**
* **Focus quality**
* **Distribution across life areas**

Life-OS is designed more like a personal analytics system than a task manager.

---

##  Core Features

###  Time Logging
* Log sessions by Area.
* Duration stored in minutes (displayed in hours).
* Energy before & after each session.
* Attention level tracking.
* Optional description.

### 📊 Insights Dashboard
The Insights system analyzes logged data and provides:
* Total Time (current vs previous period).
* Time by Area.
* Energy Average.
* Weekly and Monthly comparison.

> **Note:** All aggregation logic is implemented manually using `Array.reduce()` and date handling with `dayjs`.

![Insights View](Insights.jpg)

###  Calendar View
* Monthly visual overview.
* Aggregated daily duration.

![Calendar View](Calendar.jpg)

###  Comparison Mode
The system compares:
* **This Week** vs **Last Week**
* **This Month** vs **Last Month**

The idea is to measure improvement without overcomplicating the UI.

---

## 🛠️ Tech Stack

| Frontend | Backend | Deployment |
| :--- | :--- | :--- |
| React | Node.js | Vercel (Frontend) |
| React Router | Express | Render (Backend) |
| Chart.js | Prisma ORM | |
| Day.js | PostgreSQL | |
| CSS Modules | | |

---
