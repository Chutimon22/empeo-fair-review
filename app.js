(() => {
  "use strict";

  const STORAGE_KEY = "empeo-fair-review-demo-v1";

  const employees = [
    { id: "may", name: "เมธาวี สุขใจ", initials: "มส", position: "Senior Product Designer", department: "Product", status: "submitted", selfScore: 4.2, goal: 92, managerScore: null, color: "#ffe1d4" },
    { id: "ton", name: "ธนกฤต วัฒนา", initials: "ธว", position: "Frontend Developer", department: "Technology", status: "manager-review", selfScore: 3.8, goal: 87, managerScore: 3.7, color: "#e6f2ff" },
    { id: "ning", name: "ณิชา พงศ์ภักดี", initials: "ณพ", position: "Growth Marketing", department: "Marketing", status: "completed", selfScore: 4.4, goal: 108, managerScore: 4.5, color: "#e9f8f0" },
    { id: "beam", name: "ปวริศ ทองดี", initials: "ปท", position: "Account Executive", department: "Sales", status: "completed", selfScore: 4.7, goal: 72, managerScore: 5.0, color: "#fff2cf" },
    { id: "fah", name: "ฟ้ารุ่ง สายชล", initials: "ฟส", position: "People Operations", department: "People", status: "submitted", selfScore: 3.5, goal: 81, managerScore: null, color: "#f0e9ff" },
    { id: "art", name: "อาทิตย์ สงวนศรี", initials: "อส", position: "QA Engineer", department: "Technology", status: "completed", selfScore: 3.2, goal: 84, managerScore: 3.1, color: "#e7f7f5" },
    { id: "pla", name: "ปลายฟ้า วงศ์ทอง", initials: "ปว", position: "Customer Success", department: "Customer", status: "not-started", selfScore: null, goal: 64, managerScore: null, color: "#fce8ef" },
    { id: "joe", name: "จิรายุ เมืองงาม", initials: "จม", position: "Sales Manager", department: "Sales", status: "completed", selfScore: 4.1, goal: 118, managerScore: 4.6, color: "#e9efff" }
  ];

  const managers = [
    { name: "ศิริพร (Product)", score: 3.4, count: 12, flagged: false },
    { name: "กิตติ (Technology)", score: 3.2, count: 24, flagged: false },
    { name: "วรพล (Sales)", score: 4.6, count: 15, flagged: true },
    { name: "พิมพ์ชนก (Marketing)", score: 3.5, count: 9, flagged: false }
  ];

  const ratingCopy = [
    { value: 1, title: "ต้องปรับปรุงเร่งด่วน", detail: "ต่ำกว่าเกณฑ์อย่างชัดเจนและต่อเนื่อง" },
    { value: 2, title: "ต้องพัฒนา", detail: "ต่ำกว่าความคาดหวังบางส่วน" },
    { value: 3, title: "ตามความคาดหวัง", detail: "ทำได้ตามมาตรฐานของตำแหน่ง" },
    { value: 4, title: "เกินความคาดหวัง", detail: "เกินเป้าหมายในหลายด้าน มีหลักฐานชัดเจน" },
    { value: 5, title: "ยอดเยี่ยม", detail: "สร้างผลกระทบเหนือเป้าหมายระดับทีม/องค์กร" }
  ];

  const baseState = {
    role: "hr",
    page: "dashboard",
    mobileNav: false,
    cycleCreated: false,
    cycleDraft: {
      name: "Leadership Review 2027",
      startDate: "2027-01-01",
      endDate: "2027-03-31",
      participants: "Leadership level",
      reviewer: "ผู้บังคับบัญชาโดยตรง",
      selfDeadline: "2027-02-15",
      managerDeadline: "2027-03-10",
      publishDate: "2027-03-31",
      components: [
        { name: "Goal Achievement", weight: 60 },
        { name: "Competency & Behavior", weight: 40 }
      ]
    },
    selfReviewSubmitted: false,
    viewingSubmittedReview: false,
    selfRating: 4,
    selfDraft: {
      achievement: "ส่งมอบ Design System ชุดใหม่ครบ 42 components และลดเวลาออกแบบหน้าจอใหม่ของทีมลงประมาณ 30%",
      competency: "ร่วมทำงานกับทีม Engineering ตั้งแต่ช่วง discovery และจัด workshop ทดสอบ usability กับผู้ใช้ 8 คน",
      development: "ต้องการพัฒนาทักษะด้าน product analytics เพื่อเชื่อมการตัดสินใจเชิงดีไซน์กับผลลัพธ์ทางธุรกิจได้ชัดขึ้น"
    },
    managerRatings: { goal: 4, competency: 4 },
    managerDraft: {
      evidence: "Design System adoption เพิ่มจาก 45% เป็น 86% ภายในสองไตรมาส และช่วยลด design QA issues 24%",
      feedback: "เมย์สร้างผลกระทบที่ชัดเจนทั้งด้านคุณภาพผลิตภัณฑ์และความเร็วของทีม จุดต่อไปคือการใช้ข้อมูลเชิงปริมาณประกอบการตัดสินใจให้มากขึ้น"
    },
    managerValidation: "",
    managerReviews: {},
    submittedEmployees: [],
    acknowledged: false,
    teamFilter: "all",
    teamSearch: "",
    selectedEmployee: "may"
  };

  let state = loadState();

  const roleNames = {
    hr: "HR Admin",
    manager: "Manager",
    employee: "Employee"
  };

  const rolePeople = {
    hr: { name: "อรทัย วัฒนกุล", initials: "อว", position: "People & Culture Lead" },
    manager: { name: "ศิริพร ธนากุล", initials: "ศธ", position: "Head of Product" },
    employee: { name: "เมธาวี สุขใจ", initials: "มส", position: "Senior Product Designer" }
  };

  const navConfig = {
    hr: [
      { page: "dashboard", icon: "⌂", label: "ภาพรวม" },
      { page: "cycles", icon: "▣", label: "รอบประเมิน" },
      { page: "insights", icon: "◫", label: "Fairness Insights" }
    ],
    manager: [
      { page: "dashboard", icon: "⌂", label: "ภาพรวม" },
      { page: "team", icon: "☷", label: "ทีมของฉัน" }
    ],
    employee: [
      { page: "dashboard", icon: "⌂", label: "ภาพรวม" },
      { page: "my-review", icon: "◇", label: "แบบประเมินของฉัน" },
      { page: "result", icon: "◎", label: "ผลการประเมิน" }
    ]
  };

  const pageNames = {
    dashboard: "ภาพรวม",
    cycles: "รอบประเมิน",
    "create-cycle": "สร้างรอบประเมิน",
    insights: "Fairness Insights",
    team: "ทีมของฉัน",
    evaluation: "ประเมินผลงาน",
    "my-review": "แบบประเมินของฉัน",
    result: "ผลการประเมิน"
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved) return structuredClone(baseState);
      const cycleDraft = {
        ...baseState.cycleDraft,
        ...(saved.cycleDraft || {}),
        components: Array.isArray(saved.cycleDraft?.components) && saved.cycleDraft.components.length
          ? saved.cycleDraft.components
          : structuredClone(baseState.cycleDraft.components)
      };
      return {
        ...baseState,
        ...saved,
        teamFilter: saved.teamFilter === "submitted" ? "ready" : (saved.teamFilter || "all"),
        cycleDraft,
        selfDraft: { ...baseState.selfDraft, ...(saved.selfDraft || {}) },
        managerDraft: { ...baseState.managerDraft, ...(saved.managerDraft || {}) },
        managerRatings: { ...baseState.managerRatings, ...(saved.managerRatings || {}) },
        managerReviews: saved.managerReviews && typeof saved.managerReviews === "object" ? saved.managerReviews : {}
      };
    } catch {
      return structuredClone(baseState);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetDemo() {
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(baseState);
    render();
    toast("รีเซ็ตข้อมูลตัวอย่างแล้ว", "ทุกสถานการณ์กลับสู่ค่าเริ่มต้น");
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "–";
    return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", year: "numeric" }).format(date);
  }

  function getParticipantCount(value) {
    return value === "พนักงานทุกคน" ? 184 : value === "เลือกตามแผนก" ? 48 : 24;
  }

  function getCycleValidation() {
    const draft = state.cycleDraft;
    const totalWeight = draft.components.reduce((sum, component) => sum + (Number(component.weight) || 0), 0);
    const hasValidComponents = draft.components.length > 0 && draft.components.every(component => component.name.trim() && Number(component.weight) > 0);
    const chronologicalDates = draft.startDate && draft.endDate && draft.startDate <= draft.endDate;
    const deadlineDates = draft.selfDeadline && draft.managerDeadline && draft.publishDate
      && draft.startDate <= draft.selfDeadline
      && draft.selfDeadline <= draft.managerDeadline
      && draft.managerDeadline <= draft.publishDate
      && draft.publishDate <= draft.endDate;
    const valid = Boolean(draft.name.trim() && chronologicalDates && deadlineDates && hasValidComponents && totalWeight === 100);
    return { valid, totalWeight, chronologicalDates, deadlineDates, hasValidComponents };
  }

  function getSelfReviewValidation() {
    const fields = ["achievement", "competency", "development"];
    const missing = fields.filter(field => !state.selfDraft[field].trim());
    return { valid: missing.length === 0 && state.selfRating >= 1 && state.selfRating <= 5, missing };
  }

  function saveActiveManagerReview() {
    if (!state.selectedEmployee) return;
    state.managerReviews[state.selectedEmployee] = {
      ratings: { ...state.managerRatings },
      draft: { ...state.managerDraft },
      validation: state.managerValidation
    };
  }

  function loadManagerReview(employee) {
    const saved = state.managerReviews[employee.id];
    if (saved) {
      state.managerRatings = { ...baseState.managerRatings, ...(saved.ratings || {}) };
      state.managerDraft = { ...baseState.managerDraft, ...(saved.draft || {}) };
      state.managerValidation = saved.validation || "";
      return;
    }
    if (employee.id === "may") {
      state.managerRatings = { ...baseState.managerRatings };
      state.managerDraft = { ...baseState.managerDraft };
    } else {
      const initialRating = Math.max(1, Math.min(5, Math.round(employee.managerScore || employee.selfScore || 3)));
      state.managerRatings = { goal: initialRating, competency: initialRating };
      state.managerDraft = { evidence: "", feedback: "" };
    }
    state.managerValidation = "";
  }

  function statusBadge(status) {
    const map = {
      "not-started": ["ยังไม่เริ่ม", "gray"],
      draft: ["ฉบับร่าง", "amber"],
      submitted: ["ส่ง Self Review แล้ว", "blue"],
      "manager-review": ["Manager กำลังประเมิน", "orange"],
      completed: ["ประเมินเสร็จแล้ว", "green"]
    };
    const [label, color] = map[status] || [status, "gray"];
    return `<span class="badge badge-${color}">${label}</span>`;
  }

  function personCell(person) {
    return `<div class="person">
      <span class="person-avatar" style="--person-bg:${person.color || "#ffe1d4"}">${esc(person.initials)}</span>
      <span><strong>${esc(person.name)}</strong><span>${esc(person.position)}</span></span>
    </div>`;
  }

  function metricCard(label, value, note, icon, theme = "orange") {
    const themes = {
      orange: ["#fff4ee", "#b63d20"], green: ["#eefaf4", "#126b48"], blue: ["#eff6ff", "#1d4ed8"], purple: ["#f7f2ff", "#6d3fd1"]
    };
    const [bg, color] = themes[theme];
    return `<article class="card metric-card" style="--metric-bg:${bg};--metric-glow:${bg};--metric-color:${color}">
      <div class="metric-top"><span class="metric-label">${esc(label)}</span><span class="metric-icon">${icon}</span></div>
      <div class="metric-value">${esc(value)}</div><div class="metric-note">${esc(note)}</div>
    </article>`;
  }

  function timeline(current = 2) {
    const steps = ["ตั้งค่ารอบ", "Self Review", "Manager Review", "HR Review", "เผยแพร่ผล"];
    return `<div class="timeline" aria-label="สถานะรอบประเมิน">${steps.map((label, index) => {
      const cls = index < current ? "done" : index === current ? "current" : "";
      return `<div class="timeline-step ${cls}"><span class="timeline-dot">${index < current ? "✓" : index + 1}</span><span>${label}</span></div>`;
    }).join("")}</div>`;
  }

  function pageHeader(eyebrow, title, subtitle, actions = "") {
    return `<header class="page-header"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>${actions ? `<div class="button-row">${actions}</div>` : ""}</header>`;
  }

  function render() {
    const currentPerson = rolePeople[state.role];
    const nav = navConfig[state.role];
    const validPages = nav.map(item => item.page).concat(state.role === "hr" ? ["create-cycle"] : [], state.role === "manager" ? ["evaluation"] : []);
    if (!validPages.includes(state.page)) state.page = "dashboard";

    document.getElementById("app").innerHTML = `
      <div class="app-shell">
        <aside class="sidebar ${state.mobileNav ? "open" : ""}" aria-label="เมนูหลัก">
          <button class="brand" data-action="navigate" data-page="dashboard" aria-label="ไปหน้าหลัก">
            <span class="brand-mark">e</span><span class="brand-copy"><strong>empeo</strong><span>Fair Review</span></span>
          </button>
          <div class="sidebar-section-label">เมนูสำหรับ ${roleNames[state.role]}</div>
          <nav><ul class="nav-list">${nav.map(item => `<li><button class="nav-button ${state.page === item.page ? "active" : ""}" data-action="navigate" data-page="${item.page}"><span class="nav-icon">${item.icon}</span>${item.label}</button></li>`).join("")}</ul></nav>
          <div class="sidebar-footer"><div class="sidebar-help"><strong>โหมดสาธิต</strong><p>ข้อมูลทั้งหมดเป็นข้อมูลจำลอง และบันทึกเฉพาะในเบราว์เซอร์นี้</p><button class="text-button" data-action="reset">รีเซ็ตข้อมูลตัวอย่าง</button></div></div>
        </aside>
        <button class="mobile-overlay ${state.mobileNav ? "open" : ""}" data-action="close-menu" aria-label="ปิดเมนู"></button>
        <div class="main-area">
          <header class="topbar">
            <div class="button-row"><button class="mobile-menu" data-action="toggle-menu" aria-label="เปิดเมนู">☰</button><div class="breadcrumb">Performance Management / <strong>${pageNames[state.page] || "ภาพรวม"}</strong></div></div>
            <div class="topbar-actions">
              <label class="role-switcher"><span class="skip-link">เลือกบทบาท</span><select id="role-select" class="role-select" aria-label="สลับบทบาทผู้ใช้งาน"><option value="hr" ${state.role === "hr" ? "selected" : ""}>HR Admin</option><option value="manager" ${state.role === "manager" ? "selected" : ""}>Manager</option><option value="employee" ${state.role === "employee" ? "selected" : ""}>Employee</option></select></label>
              <span class="avatar" title="${esc(currentPerson.name)}">${esc(currentPerson.initials)}</span>
            </div>
          </header>
          <main id="main-content" class="content">${renderPage()}</main>
        </div>
      </div>`;
    saveState();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function renderPage() {
    if (state.page === "dashboard") return renderDashboard();
    if (state.page === "cycles") return renderCycles();
    if (state.page === "create-cycle") return renderCreateCycle();
    if (state.page === "insights") return renderInsights();
    if (state.page === "team") return renderTeam();
    if (state.page === "evaluation") return renderEvaluation();
    if (state.page === "my-review") return renderMyReview();
    if (state.page === "result") return renderResult();
    return renderDashboard();
  }

  function renderDashboard() {
    if (state.role === "hr") return renderHrDashboard();
    if (state.role === "manager") return renderManagerDashboard();
    return renderEmployeeDashboard();
  }

  function renderHrDashboard() {
    return `${pageHeader("People & Performance", "สวัสดีค่ะ อรทัย", "ติดตามความคืบหน้ารอบประเมินและตรวจสอบว่าทุกทีมใช้มาตรฐานเดียวกัน", `<button class="btn btn-primary" data-action="navigate" data-page="create-cycle">＋ สร้างรอบประเมิน</button>`)}
      <section class="grid grid-4">
        ${metricCard("ผู้เข้าร่วมทั้งหมด", "184 คน", "จาก 8 แผนก", "◉", "orange")}
        ${metricCard("ดำเนินการแล้ว", "74%", "เพิ่มขึ้น 18% จากสัปดาห์ก่อน", "✓", "green")}
        ${metricCard("รอ Manager Review", "28 คน", "จาก Manager 12 คน", "⌛", "blue")}
        ${metricCard("ต้องตรวจความสอดคล้อง", "3 ทีม", "พบรูปแบบคะแนนต่างจากองค์กร", "!", "purple")}
      </section>
      <section class="section card hero-card"><div class="hero-content"><span class="badge badge-orange">กำลังดำเนินการ</span><h2>Annual Performance Review 2026</h2><p>รอบประเมินประจำปีที่เชื่อมข้อมูลเป้าหมาย ผลงาน และ Competency เพื่อให้การตัดสินใจโปร่งใสและตรวจสอบได้</p><div class="hero-meta"><span>◷ 1 ต.ค. – 15 ธ.ค. 2569</span><span>◎ Goal 60% · Competency 40%</span><span>◉ 184 คน</span></div><div class="progress-labels"><span>ความคืบหน้ารวม</span><strong>74%</strong></div><div class="progress-track"><div class="progress-bar" style="width:74%"></div></div>${timeline(3)}<div class="button-row"><button class="btn btn-primary" data-action="navigate" data-page="insights">ดูภาพรวมการประเมิน</button><button class="btn btn-secondary" data-action="navigate" data-page="cycles">จัดการรอบประเมิน</button></div></div></section>
      <section class="section"><div class="section-heading"><div><h2>สัญญาณที่ควรตรวจสอบ</h2><p>ระบบแสดงข้อมูลที่ผิดไปจากรูปแบบองค์กร เพื่อให้ HR ตัดสินใจต่อด้วยบริบทจริง</p></div><button class="text-button" data-action="navigate" data-page="insights">ดูทั้งหมด</button></div><div class="grid grid-3">
        <article class="card insight-card"><span class="insight-icon">↗</span><div><h3>Sales ให้คะแนนสูงกว่าองค์กร</h3><p>ค่าเฉลี่ย 4.6 เทียบกับค่าเฉลี่ยองค์กร 3.4 ควรตรวจสอบมาตรฐานที่ใช้</p></div></article>
        <article class="card insight-card"><span class="insight-icon">!</span><div><h3>คะแนนสูงแต่ Goal ไม่สอดคล้อง</h3><p>พบ 2 คนที่ได้ระดับ 5 แต่ Goal Achievement ต่ำกว่า 80%</p></div></article>
        <article class="card insight-card"><span class="insight-icon">◎</span><div><h3>Extreme rating ขาดหลักฐาน</h3><p>มี 4 การประเมินที่ต้องเพิ่ม Evidence ก่อนส่งผลให้ HR</p></div></article>
      </div></section>`;
  }

  function renderManagerDashboard() {
    const done = Math.min(12, 6 + state.submittedEmployees.length);
    return `${pageHeader("Manager Workspace", "ทีม Product พร้อมให้คุณประเมิน", "ดูข้อมูลผลงาน Self Review และหลักฐานของทีมในที่เดียว", `<button class="btn btn-primary" data-action="navigate" data-page="team">เปิด Team Review</button>`)}
      <section class="grid grid-3">
        ${metricCard("สมาชิกในทีม", "12 คน", "อยู่ในรอบประเมินนี้ทั้งหมด", "◉", "orange")}
        ${metricCard("ประเมินเสร็จแล้ว", `${done}/12`, "บันทึกและส่งให้ HR แล้ว", "✓", "green")}
        ${metricCard("รอการประเมิน", `${12 - done} คน`, "Self Review พร้อมแล้ว", "◇", "blue")}
      </section>
      <section class="section card hero-card"><div class="hero-content"><span class="badge badge-blue">งานของฉัน</span><h2>ทำให้ทุกคะแนนมีความหมายเดียวกัน</h2><p>เปรียบเทียบผลงานกับเป้าหมาย ใช้ Behavioral Anchors และอธิบายเหตุผลด้วยหลักฐาน โดยเฉพาะคะแนนระดับ 1 และ 5</p><div class="hero-meta"><span>◷ Manager Review ถึง 30 พ.ย. 2569</span><span>◎ ทีม Product · 12 คน</span></div><div class="button-row"><button class="btn btn-primary" data-action="start-evaluation" data-id="may">ประเมิน เมธาวี</button><button class="btn btn-secondary" data-action="navigate" data-page="team">ดูสมาชิกทั้งหมด</button></div></div></section>
      <section class="section"><div class="section-heading"><div><h2>ล่าสุดจากทีม</h2><p>Self Review ที่พร้อมให้ประเมิน</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>พนักงาน</th><th>Goal Achievement</th><th>Self Rating</th><th>สถานะ</th><th></th></tr></thead><tbody>${employees.slice(0, 4).map(employee => `<tr><td>${personCell(employee)}</td><td><strong>${employee.goal}%</strong></td><td>${employee.selfScore ? employee.selfScore.toFixed(1) : "–"}</td><td>${statusBadge(state.submittedEmployees.includes(employee.id) ? "completed" : employee.status)}</td><td><button class="btn btn-secondary btn-small" data-action="start-evaluation" data-id="${employee.id}">${state.submittedEmployees.includes(employee.id) || employee.status === "completed" ? "ดูรายละเอียด" : "เริ่มประเมิน"}</button></td></tr>`).join("")}</tbody></table></div></section>`;
  }

  function renderEmployeeDashboard() {
    return `${pageHeader("My Performance", "สวัสดีค่ะ เมธาวี", "ติดตามเป้าหมาย ทำ Self Review และเข้าใจผลการประเมินของคุณอย่างชัดเจน")}
      <section class="card hero-card"><div class="hero-content">${state.selfReviewSubmitted ? `<span class="badge badge-green">ส่ง Self Review แล้ว</span><h2>ส่วนของคุณเสร็จเรียบร้อย</h2><p>Manager จะตรวจผลงานและหลักฐานที่คุณส่ง เมื่อ HR เปิดผลแล้วคุณจะเห็นคะแนน Feedback และแผนพัฒนาในหน้านี้</p>` : `<span class="badge badge-amber">รอดำเนินการ</span><h2>Annual Performance Review 2026</h2><p>ทบทวนผลงานตลอดปี เลือกหลักฐานที่สะท้อนผลลัพธ์จริง และบอกสิ่งที่คุณอยากพัฒนาต่อ</p>`}<div class="hero-meta"><span>◷ ส่งภายใน 15 พ.ย. 2569</span><span>◎ Goal 60% · Competency 40%</span><span>✓ บันทึกอัตโนมัติ</span></div><div class="button-row"><button class="btn btn-primary" data-action="navigate" data-page="my-review">${state.selfReviewSubmitted ? "ดู Self Review" : "เริ่มทำ Self Review"}</button><button class="btn btn-secondary" data-action="navigate" data-page="result">ดูผลรอบก่อนหน้า</button></div></div></section>
      <section class="section"><div class="section-heading"><div><h2>เป้าหมายของฉัน</h2><p>ข้อมูลถูกเชื่อมเข้าสู่รอบประเมินโดยอัตโนมัติ</p></div><span class="badge badge-green">ภาพรวม 92%</span></div><div class="grid grid-2">
        ${goalSummary("เพิ่ม Adoption ของ Design System", 96, "เป้าหมาย 80%", "น้ำหนัก 35%")}
        ${goalSummary("ลด Design QA Issues", 88, "เป้าหมายลด 20%", "น้ำหนัก 25%")}
      </div></section>
      <section class="section grid grid-2"><article class="card card-body"><h3>ผลประเมินรอบล่าสุด</h3><p class="page-subtitle">Mid-year Review 2026</p><div style="margin:18px 0"><span class="score-band">Exceeds Expectations</span><strong style="display:block;font-size:1.7rem">4.2 / 5.0</strong></div><button class="btn btn-secondary btn-small" data-action="navigate" data-page="result">ดูรายละเอียด</button></article><article class="card card-body"><h3>แผนพัฒนาต่อเนื่อง</h3><p class="page-subtitle">โฟกัสที่ Product Analytics และ Data Storytelling ในไตรมาสถัดไป</p><div class="progress-labels" style="margin-top:20px"><span>ความคืบหน้า</span><strong>2 จาก 3 กิจกรรม</strong></div><div class="progress-track"><div class="progress-bar" style="width:67%"></div></div></article></section>`;
  }

  function goalSummary(title, progress, target, weight) {
    return `<article class="card review-cycle-card"><div class="review-cycle-top"><div><h3>${title}</h3><p>${target} · ${weight}</p></div><span class="goal-score">${progress}%</span></div><div class="progress-track" style="margin-top:18px"><div class="progress-bar" style="width:${Math.min(progress, 100)}%"></div></div></article>`;
  }

  function renderCycles() {
    const draft = state.cycleDraft;
    const created = state.cycleCreated ? `<article class="card review-cycle-card"><div class="review-cycle-top"><div><h3>${esc(draft.name)}</h3><p>รอบประเมินที่สร้างใหม่ · บันทึกล่าสุดเมื่อสักครู่</p></div><span class="badge badge-gray">ฉบับร่าง</span></div><div class="review-cycle-meta"><div class="meta-block"><span>ระยะเวลา</span><strong>${formatDate(draft.startDate)} – ${formatDate(draft.endDate)}</strong></div><div class="meta-block"><span>ผู้เข้าร่วม</span><strong>${getParticipantCount(draft.participants)} คน</strong></div><div class="meta-block"><span>รูปแบบ</span><strong>${draft.components.length} องค์ประกอบ</strong></div></div><div class="button-row"><button class="btn btn-secondary btn-small" data-action="navigate" data-page="create-cycle">แก้ไขการตั้งค่า</button></div></article>` : "";
    return `${pageHeader("Review Cycles", "จัดการรอบประเมิน", "กำหนดช่วงเวลา ผู้เข้าร่วม น้ำหนัก และเกณฑ์กลางที่ทุกคนใช้ร่วมกัน", `<button class="btn btn-primary" data-action="navigate" data-page="create-cycle">＋ สร้างรอบประเมิน</button>`)}
      <div class="grid grid-2">${created}<article class="card review-cycle-card"><div class="review-cycle-top"><div><h3>Annual Performance Review 2026</h3><p>รอบประเมินประจำปี · อัปเดตล่าสุด 18 พ.ย. 2569</p></div><span class="badge badge-orange">กำลังดำเนินการ</span></div><div class="review-cycle-meta"><div class="meta-block"><span>ระยะเวลา</span><strong>1 ต.ค. – 15 ธ.ค. 2569</strong></div><div class="meta-block"><span>ผู้เข้าร่วม</span><strong>184 คน</strong></div><div class="meta-block"><span>ความคืบหน้า</span><strong>74%</strong></div></div><div class="progress-track"><div class="progress-bar" style="width:74%"></div></div><div class="button-row" style="margin-top:18px"><button class="btn btn-primary btn-small" data-action="navigate" data-page="insights">ดูภาพรวม</button><button class="btn btn-secondary btn-small" data-action="navigate" data-page="create-cycle">ดูการตั้งค่า</button></div></article>
      <article class="card review-cycle-card"><div class="review-cycle-top"><div><h3>Mid-year Review 2026</h3><p>รอบประเมินกลางปี · เผยแพร่ผลแล้ว 30 มิ.ย. 2569</p></div><span class="badge badge-green">เสร็จสิ้น</span></div><div class="review-cycle-meta"><div class="meta-block"><span>ระยะเวลา</span><strong>1 เม.ย. – 30 มิ.ย. 2569</strong></div><div class="meta-block"><span>ผู้เข้าร่วม</span><strong>176 คน</strong></div><div class="meta-block"><span>เสร็จสิ้น</span><strong>100%</strong></div></div><div class="progress-track"><div class="progress-bar" style="width:100%"></div></div><div class="button-row" style="margin-top:18px"><button class="btn btn-secondary btn-small" data-action="toast-info">ดูรายงานย้อนหลัง</button></div></article></div>`;
  }

  function renderCreateCycle() {
    const draft = state.cycleDraft;
    const validation = getCycleValidation();
    const validationMessage = !draft.name.trim()
      ? "กรุณาระบุชื่อรอบประเมิน"
      : !validation.chronologicalDates
        ? "วันที่สิ้นสุดต้องไม่มาก่อนวันที่เริ่มต้น"
        : !validation.deadlineDates
          ? "กำหนดเวลาต้องเรียงตามลำดับและอยู่ภายในช่วงรอบประเมิน"
          : !validation.hasValidComponents
            ? "ทุกองค์ประกอบต้องมีชื่อและน้ำหนักมากกว่า 0"
            : validation.totalWeight !== 100
              ? `น้ำหนักรวมต้องเท่ากับ 100% (ปัจจุบัน ${validation.totalWeight}%)`
              : "ข้อมูลจำเป็นครบและน้ำหนักรวม 100%";
    const saveButton = `<button class="btn btn-primary" data-action="save-cycle" ${validation.valid ? "" : "disabled"}>บันทึกฉบับร่าง</button>`;
    return `${pageHeader("Cycle Setup", `${state.cycleCreated ? "แก้ไข" : "สร้าง"}รอบประเมิน`, "สร้างมาตรฐานที่ชัดเจนก่อนเริ่มประเมิน เพื่อให้ทุกทีมเข้าใจคะแนนในความหมายเดียวกัน", `<button class="btn btn-secondary" data-action="navigate" data-page="cycles">ยกเลิก</button><button class="btn btn-primary" data-action="save-cycle">บันทึกฉบับร่าง</button>`)}
      <div class="layout-main-aside"><form class="card form-card" id="cycle-form">
        <section class="form-section"><div class="form-section-heading"><span class="step-chip">1</span><div><h2>ข้อมูลรอบประเมิน</h2><p>ชื่อและช่วงเวลาที่ทุกฝ่ายเข้าใจตรงกัน</p></div></div><div class="form-grid"><div class="field field-full"><label for="cycle-name">ชื่อรอบประเมิน</label><input class="input" id="cycle-name" name="cycleName" value="${esc(draft.name)}" data-bind="cycleDraft.name" required /></div><div class="field"><label for="start-date">วันที่เริ่มต้น</label><input class="input" id="start-date" type="date" value="${esc(draft.startDate)}" data-bind="cycleDraft.startDate" required /></div><div class="field"><label for="end-date">วันที่สิ้นสุด</label><input class="input" id="end-date" type="date" value="${esc(draft.endDate)}" data-bind="cycleDraft.endDate" required /></div><div class="field"><label for="participants">กลุ่มผู้เข้าร่วม</label><select class="select" id="participants" data-bind="cycleDraft.participants"><option ${draft.participants === "พนักงานทุกคน" ? "selected" : ""}>พนักงานทุกคน</option><option ${draft.participants === "Leadership level" ? "selected" : ""}>Leadership level</option><option ${draft.participants === "เลือกตามแผนก" ? "selected" : ""}>เลือกตามแผนก</option></select></div><div class="field"><label for="reviewer">ผู้ประเมินหลัก</label><select class="select" id="reviewer" data-bind="cycleDraft.reviewer"><option ${draft.reviewer === "ผู้บังคับบัญชาโดยตรง" ? "selected" : ""}>ผู้บังคับบัญชาโดยตรง</option><option ${draft.reviewer === "หัวหน้าสายงาน" ? "selected" : ""}>หัวหน้าสายงาน</option><option ${draft.reviewer === "HR Business Partner" ? "selected" : ""}>HR Business Partner</option></select></div></div></section>
        <section class="form-section"><div class="form-section-heading"><span class="step-chip">2</span><div><h2>องค์ประกอบและน้ำหนัก</h2><p>คะแนนรวมคำนวณจากข้อมูลผลงานที่จับต้องได้</p></div></div>${draft.components.map((component, index) => `<div class="weight-row"><input class="input" value="${esc(component.name)}" data-component-index="${index}" data-component-field="name" aria-label="องค์ประกอบคะแนน ${index + 1}" /><input class="input" type="number" min="1" max="100" value="${Number(component.weight) || 0}" data-component-index="${index}" data-component-field="weight" aria-label="น้ำหนักเปอร์เซ็นต์ ${index + 1}" /><button type="button" class="remove-row" data-action="remove-cycle-component" data-index="${index}" aria-label="ลบองค์ประกอบ ${index + 1}" ${draft.components.length === 1 ? "disabled" : ""}>×</button></div>`).join("")}<button type="button" class="btn btn-secondary btn-small" data-action="add-cycle-component">＋ เพิ่มองค์ประกอบ</button></section>
        <section class="form-section"><div class="form-section-heading"><span class="step-chip">3</span><div><h2>มาตรฐานการให้คะแนน</h2><p>คำอธิบายพฤติกรรมช่วยลดการตีความต่างกันระหว่าง Manager</p></div></div><div class="rating-scale">${ratingCopy.map(r => `<div class="rating-option" style="cursor:default"><span class="rating-number">${r.value}</span><strong>${r.title}</strong><small>${r.detail}</small></div>`).join("")}</div><div class="notice notice-info" style="margin-top:16px"><span>ⓘ</span><div><strong>Evidence requirement</strong>คะแนนระดับ 1 และ 5 ต้องมีหลักฐานหรือเหตุผลประกอบก่อนส่ง</div></div></section>
        <section class="form-section"><div class="form-section-heading"><span class="step-chip">4</span><div><h2>กำหนดเวลา</h2><p>กำหนด Deadline แยกตามช่วงของกระบวนการ</p></div></div><div class="form-grid"><div class="field"><label for="self-deadline">Self Review</label><input class="input" id="self-deadline" type="date" value="${esc(draft.selfDeadline)}" data-bind="cycleDraft.selfDeadline" required /></div><div class="field"><label for="manager-deadline">Manager Review</label><input class="input" id="manager-deadline" type="date" value="${esc(draft.managerDeadline)}" data-bind="cycleDraft.managerDeadline" required /></div><div class="field field-full"><label for="publish-date">วันที่เปิดผลให้พนักงาน</label><input class="input" id="publish-date" type="date" value="${esc(draft.publishDate)}" data-bind="cycleDraft.publishDate" required /><span class="field-hint">พนักงานจะไม่เห็นคะแนนจนกว่า HR จะกดเผยแพร่ผล</span></div></div></section>
      </form><aside class="sticky-panel"><article class="card card-body"><h3>สรุปรอบประเมิน</h3><ul class="summary-list"><li><span>ผู้เข้าร่วม</span><strong>${getParticipantCount(draft.participants)} คน</strong></li><li><span>องค์ประกอบ</span><strong>${draft.components.length} รายการ</strong></li><li><span>น้ำหนักรวม</span><strong>${validation.totalWeight}%</strong></li><li><span>ผู้ประเมิน</span><strong>${esc(draft.reviewer)}</strong></li><li><span>Rating scale</span><strong>5 ระดับ</strong></li></ul><div class="notice ${validation.valid ? "notice-success" : "notice-warning"}" style="margin-top:18px"><span>${validation.valid ? "✓" : "!"}</span><div><strong>${validation.valid ? "พร้อมบันทึก" : "ยังบันทึกไม่ได้"}</strong>${esc(validationMessage)}</div></div><button class="btn btn-primary" style="width:100%;margin-top:16px" data-action="save-cycle" ${validation.valid ? "" : "disabled"}>บันทึกฉบับร่าง</button></article></aside></div>`;
  }

  function renderInsights() {
    const dist = [6, 18, 76, 64, 20];
    return `${pageHeader("Organization Insights", "ภาพรวมความเป็นธรรม", "เปรียบเทียบรูปแบบคะแนน หา Signal ที่ควรตรวจ และย้อนดูหลักฐานก่อนตัดสินใจ", `<button class="btn btn-secondary">ส่งออกรายงาน</button><button class="btn btn-primary">เตรียมเผยแพร่ผล</button>`)}
      <section class="grid grid-4">${metricCard("ประเมินเสร็จแล้ว", "136/184", "74% ของผู้เข้าร่วม", "✓", "green")}${metricCard("คะแนนเฉลี่ยองค์กร", "3.4", "ใกล้เคียงรอบก่อน 3.3", "◎", "orange")}${metricCard("Extreme ratings", "26", "14% ของการประเมิน", "↕", "blue")}${metricCard("ควรตรวจเพิ่มเติม", "7", "จาก 3 ทีม", "!", "purple")}</section>
      <section class="section grid grid-2"><article class="card chart-card"><div class="section-heading"><div><h2>Rating Distribution</h2><p>จำนวนพนักงานในแต่ละระดับคะแนน</p></div><span class="badge badge-gray">ทั้งองค์กร</span></div><div class="distribution-chart">${dist.map((v, i) => `<div class="bar-group"><span class="bar-value">${v} คน</span><div class="chart-bar" style="height:${Math.max(18, v * 2.1)}px"></div><span class="bar-label">ระดับ ${i + 1}</span></div>`).join("")}</div></article><article class="card chart-card"><div class="section-heading"><div><h2>ค่าเฉลี่ยตาม Manager</h2><p>ใช้เปรียบเทียบรูปแบบ ไม่ใช่ตัดสินอัตโนมัติ</p></div></div><div style="margin-top:28px">${managers.map(manager => `<div class="compare-row"><span class="compare-person">${manager.name}</span><div class="compare-track"><div class="compare-fill ${manager.flagged ? "flagged" : ""}" style="width:${manager.score / 5 * 100}%"></div></div><span class="compare-value">${manager.score.toFixed(1)}</span></div>`).join("")}</div><div class="notice notice-warning"><span>!</span><div><strong>รูปแบบที่ควรตรวจ</strong>ทีม Sales มีค่าเฉลี่ยสูงกว่าองค์กร 1.2 คะแนน</div></div></article></section>
      <section class="section"><div class="section-heading"><div><h2>รายการที่ควรตรวจสอบ</h2><p>เปิดดูเหตุผลและหลักฐานก่อนตัดสินใจว่าจะปรับหรือคงคะแนน</p></div><span class="badge badge-amber">7 รายการ</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>พนักงาน</th><th>แผนก</th><th>Goal</th><th>Manager Rating</th><th>สัญญาณ</th><th></th></tr></thead><tbody>
        <tr><td>${personCell(employees[3])}</td><td>Sales</td><td><strong>72%</strong></td><td><strong>5.0</strong></td><td><span class="badge badge-amber">คะแนนสูงกว่าผลงาน</span></td><td><button class="btn btn-secondary btn-small" data-action="toast-info">ดูหลักฐาน</button></td></tr>
        <tr><td>${personCell(employees[7])}</td><td>Sales</td><td><strong>118%</strong></td><td><strong>4.6</strong></td><td><span class="badge badge-orange">ทีมมีค่าเฉลี่ยสูง</span></td><td><button class="btn btn-secondary btn-small" data-action="toast-info">ดูหลักฐาน</button></td></tr>
        <tr><td>${personCell(employees[5])}</td><td>Technology</td><td><strong>84%</strong></td><td><strong>3.1</strong></td><td><span class="badge badge-blue">Self/Manager ต่างกัน</span></td><td><button class="btn btn-secondary btn-small" data-action="toast-info">ดูหลักฐาน</button></td></tr>
      </tbody></table></div></section>`;
  }

  function renderTeam() {
    const normalizedSearch = state.teamSearch.trim().toLowerCase();
    const filtered = employees.filter(employee => {
      const effectiveStatus = state.submittedEmployees.includes(employee.id) ? "completed" : employee.status;
      const matchesFilter = state.teamFilter === "all"
        || (state.teamFilter === "ready" && ["submitted", "manager-review"].includes(effectiveStatus))
        || effectiveStatus === state.teamFilter;
      const matchesSearch = !normalizedSearch || `${employee.name} ${employee.position} ${employee.department}`.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
    return `${pageHeader("Team Review", "ทีมของฉัน", "ประเมินโดยดูทั้งเป้าหมาย Self Review หลักฐาน และพฤติกรรมตามเกณฑ์กลาง")}
      <div class="filter-bar"><div class="search-box"><input id="team-search" value="${esc(state.teamSearch)}" placeholder="ค้นหาชื่อหรือตำแหน่ง" aria-label="ค้นหาสมาชิกทีม" /></div><div class="segmented" role="group" aria-label="กรองสถานะ"><button class="segment ${state.teamFilter === "all" ? "active" : ""}" data-action="filter-team" data-filter="all">ทั้งหมด</button><button class="segment ${state.teamFilter === "ready" ? "active" : ""}" data-action="filter-team" data-filter="ready">พร้อมประเมิน</button><button class="segment ${state.teamFilter === "completed" ? "active" : ""}" data-action="filter-team" data-filter="completed">เสร็จแล้ว</button></div></div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>พนักงาน</th><th>แผนก</th><th>Goal</th><th>Self Rating</th><th>สถานะ</th><th></th></tr></thead><tbody>${filtered.length ? filtered.map(employee => { const currentStatus = state.submittedEmployees.includes(employee.id) ? "completed" : employee.status; return `<tr><td>${personCell(employee)}</td><td>${employee.department}</td><td><strong>${employee.goal}%</strong></td><td>${employee.selfScore ? employee.selfScore.toFixed(1) : "–"}</td><td>${statusBadge(currentStatus)}</td><td><button class="btn ${currentStatus === "submitted" || currentStatus === "manager-review" ? "btn-primary" : "btn-secondary"} btn-small" data-action="start-evaluation" data-id="${employee.id}">${currentStatus === "completed" ? "ดูรายละเอียด" : currentStatus === "not-started" ? "ยังไม่พร้อม" : "ประเมิน"}</button></td></tr>`; }).join("") : `<tr><td colspan="6"><div class="empty-state"><span class="empty-icon">⌕</span><h3>ไม่พบสมาชิกทีม</h3><p>ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</p></div></td></tr>`}</tbody></table></div>`;
  }

  function renderEvaluation() {
    const employee = employees.find(e => e.id === state.selectedEmployee) || employees[0];
    const alreadySubmitted = state.submittedEmployees.includes(employee.id) || employee.status === "completed";
    if (alreadySubmitted && employee.id !== "may") {
      return `${pageHeader("Manager Review", `ผลประเมิน: ${esc(employee.name)}`, "การประเมินนี้ถูกส่งให้ HR แล้ว", `<button class="btn btn-secondary" data-action="navigate" data-page="team">กลับไปทีมของฉัน</button>`)}<article class="card success-state"><span class="success-mark">✓</span><h2>การประเมินเสร็จเรียบร้อย</h2><p>Manager Rating ${employee.managerScore || 4.0} · Goal Achievement ${employee.goal}% · ผลจะยังไม่แสดงต่อพนักงานจนกว่า HR จะเผยแพร่</p><button class="btn btn-primary" data-action="navigate" data-page="team">ประเมินคนถัดไป</button></article>`;
    }
    if (alreadySubmitted && employee.id === "may" && state.submittedEmployees.includes("may")) {
      return `${pageHeader("Manager Review", `ผลประเมิน: ${esc(employee.name)}`, "การประเมินนี้ถูกส่งให้ HR แล้ว", `<button class="btn btn-secondary" data-action="navigate" data-page="team">กลับไปทีมของฉัน</button>`)}<article class="card success-state"><span class="success-mark">✓</span><h2>ส่งการประเมินแล้ว</h2><p>คะแนนและหลักฐานถูกบันทึกเรียบร้อย ผลจะยังไม่แสดงต่อพนักงานจนกว่า HR จะเผยแพร่</p><button class="btn btn-primary" data-action="navigate" data-page="team">กลับไปทีมของฉัน</button></article>`;
    }
    return `${pageHeader("Manager Review", `ประเมิน: ${esc(employee.name)}`, `${esc(employee.position)} · ${esc(employee.department)}`, `<button class="btn btn-secondary" data-action="navigate" data-page="team">บันทึกและออก</button><button class="btn btn-primary" data-action="submit-manager-review">ส่งให้ HR</button>`)}
      <div class="layout-main-aside"><div>
        <article class="card form-card"><div class="form-section-heading"><span class="person-avatar" style="--person-bg:${employee.color}">${employee.initials}</span><div><h2>${employee.name}</h2><p>${employee.position} · ทำงานร่วมกับทีม 2 ปี 8 เดือน</p></div></div><div class="grid grid-3"><div class="meta-block"><span>Goal Achievement</span><strong>${employee.goal}%</strong></div><div class="meta-block"><span>Self Rating</span><strong>${employee.selfScore || "–"} / 5.0</strong></div><div class="meta-block"><span>Feedback รอบก่อน</span><strong>4.2 / 5.0</strong></div></div></article>
        <section class="section card form-card"><div class="form-section-heading"><span class="step-chip">1</span><div><h2>Goal Achievement</h2><p>น้ำหนัก 60% · พิจารณาผลลัพธ์และคุณภาพของหลักฐานร่วมกัน</p></div></div>
          <div class="goal-card"><div class="goal-head"><div><h3>เพิ่ม Adoption ของ Design System</h3><p>เป้าหมาย 80% · ผลจริง 86%</p></div><span class="goal-score">108%</span></div><div class="goal-stats"><div class="goal-stat"><span>เริ่มต้น</span><strong>45%</strong></div><div class="goal-stat"><span>เป้าหมาย</span><strong>80%</strong></div><div class="goal-stat"><span>ผลจริง</span><strong>86%</strong></div></div><div class="evidence-list"><span class="evidence-chip">▤ Adoption dashboard</span><span class="evidence-chip">▤ Component changelog</span></div></div>
          <div class="goal-card"><div class="goal-head"><div><h3>ลด Design QA Issues</h3><p>เป้าหมายลด 20% · ผลจริงลด 24%</p></div><span class="goal-score">120%</span></div><div class="goal-stats"><div class="goal-stat"><span>Baseline</span><strong>42 issues</strong></div><div class="goal-stat"><span>เป้าหมาย</span><strong>≤ 34</strong></div><div class="goal-stat"><span>ผลจริง</span><strong>32</strong></div></div></div>
          <h3 style="margin-top:20px">คะแนน Goal</h3>${renderRatingOptions("goal", state.managerRatings.goal)}
        </section>
        <section class="section card form-card"><div class="form-section-heading"><span class="step-chip">2</span><div><h2>Competency & Behavior</h2><p>น้ำหนัก 40% · ใช้ตัวอย่างพฤติกรรมที่สังเกตได้</p></div></div><div class="notice notice-info"><span>ⓘ</span><div><strong>Self Review</strong>${esc(state.selfDraft.competency)}</div></div><h3 style="margin-top:20px">คะแนน Competency</h3>${renderRatingOptions("competency", state.managerRatings.competency)}</section>
        <section class="section card form-card"><div class="form-section-heading"><span class="step-chip">3</span><div><h2>หลักฐานและ Feedback</h2><p>อธิบายเหตุผลให้พนักงานและ HR เข้าใจการตัดสินใจ</p></div></div>${state.managerValidation ? `<div class="notice notice-warning" style="margin-bottom:16px"><span>!</span><div><strong>ต้องเพิ่มหลักฐาน</strong>${esc(state.managerValidation)}</div></div>` : ""}<div class="field"><label for="manager-evidence">หลักฐานประกอบคะแนน</label><textarea id="manager-evidence" class="textarea" data-bind="managerDraft.evidence" placeholder="ระบุผลลัพธ์ ตัวเลข หรือเหตุการณ์ที่สังเกตได้">${esc(state.managerDraft.evidence)}</textarea><span class="field-hint">จำเป็นเมื่อให้คะแนนระดับ 1 หรือ 5</span></div><div class="field" style="margin-top:16px"><label for="manager-feedback">Feedback สำหรับพนักงาน</label><textarea id="manager-feedback" class="textarea" data-bind="managerDraft.feedback" placeholder="จุดแข็งและโอกาสในการพัฒนา">${esc(state.managerDraft.feedback)}</textarea></div></section>
      </div><aside class="sticky-panel"><article class="card card-body"><h3>สรุปคะแนน</h3><ul class="summary-list"><li><span>Goal (60%)</span><strong>${state.managerRatings.goal}.0 / 5</strong></li><li><span>Competency (40%)</span><strong>${state.managerRatings.competency}.0 / 5</strong></li><li><span>คะแนนรวม</span><strong>${(state.managerRatings.goal * 0.6 + state.managerRatings.competency * 0.4).toFixed(1)} / 5</strong></li></ul><div class="notice notice-success" style="margin-top:18px"><span>✓</span><div><strong>ผ่านเกณฑ์ข้อมูล</strong>มีหลักฐานและ Feedback พร้อมส่ง</div></div><button class="btn btn-primary" style="width:100%;margin-top:16px" data-action="submit-manager-review">ส่งให้ HR</button><p class="field-hint" style="text-align:center;margin-top:10px">พนักงานจะยังไม่เห็นผลในขั้นตอนนี้</p></article></aside></div>`;
  }

  function renderRatingOptions(type, selected) {
    return `<div class="rating-scale" style="margin-top:12px">${ratingCopy.map(r => `<button class="rating-option ${selected === r.value ? "selected" : ""}" data-action="select-manager-rating" data-type="${type}" data-rating="${r.value}"><span class="rating-number">${r.value}</span><strong>${r.title}</strong><small>${r.detail}</small></button>`).join("")}</div>`;
  }

  function renderMyReview() {
    const readOnly = state.selfReviewSubmitted && state.viewingSubmittedReview;
    const validation = getSelfReviewValidation();
    if (state.selfReviewSubmitted && !state.viewingSubmittedReview) {
      return `${pageHeader("Self Review", "Self Review ของฉัน", "Annual Performance Review 2026", `<button class="btn btn-secondary" data-action="navigate" data-page="dashboard">กลับหน้าหลัก</button>`)}<article class="card success-state"><span class="success-mark">✓</span><h2>ส่ง Self Review เรียบร้อยแล้ว</h2><p>ข้อมูลผลงาน Evidence และแผนพัฒนาถูกส่งให้ Manager แล้ว คุณยังเปิดดูข้อมูลที่ส่งได้ แต่แก้ไขไม่ได้ในขั้นตอนนี้</p><div class="button-row" style="justify-content:center"><button class="btn btn-primary" data-action="reopen-self-review">ดูข้อมูลที่ส่ง</button><button class="btn btn-secondary" data-action="navigate" data-page="dashboard">กลับหน้าหลัก</button></div></article>`;
    }
    if (readOnly) {
      return `${pageHeader("Self Review", "ข้อมูล Self Review ที่ส่งแล้ว", "ข้อมูลนี้ถูกส่งให้ Manager แล้วและเปิดในโหมดอ่านอย่างเดียว", `<button class="btn btn-secondary" data-action="navigate" data-page="dashboard">กลับหน้าหลัก</button>`)}
        <div class="layout-main-aside"><div>
          <section class="card form-card"><div class="form-section-heading"><span class="step-chip">1</span><div><h2>ผลงานและผลลัพธ์</h2><p>ข้อมูลที่ส่งประกอบการประเมิน</p></div></div><div class="feedback-block"><p>${esc(state.selfDraft.achievement)}</p></div></section>
          <section class="section card form-card"><div class="form-section-heading"><span class="step-chip">2</span><div><h2>Competency & Behavior</h2><p>ตัวอย่างพฤติกรรมที่ส่งให้ Manager</p></div></div><div class="feedback-block"><p>${esc(state.selfDraft.competency)}</p></div><h3 style="margin-top:20px">Self Rating</h3><span class="score-band">${state.selfRating} / 5 · ${esc(ratingCopy.find(rating => rating.value === state.selfRating)?.title || "")}</span></section>
          <section class="section card form-card"><div class="form-section-heading"><span class="step-chip">3</span><div><h2>แผนพัฒนา</h2><p>เป้าหมายการพัฒนาถัดไป</p></div></div><div class="feedback-block"><p>${esc(state.selfDraft.development)}</p></div></section>
        </div><aside class="sticky-panel"><article class="card card-body"><h3>สถานะ</h3><div class="notice notice-success"><span>✓</span><div><strong>ส่งเรียบร้อยแล้ว</strong>ข้อมูลนี้แก้ไขไม่ได้ในขั้นตอนนี้</div></div><button class="btn btn-secondary" style="width:100%;margin-top:16px" data-action="navigate" data-page="dashboard">กลับหน้าหลัก</button></article></aside></div>`;
    }
    return `${pageHeader("Self Review", "ทบทวนผลงานของฉัน", "เล่าผลลัพธ์ที่เกิดขึ้นจริง พร้อมหลักฐานและสิ่งที่คุณอยากพัฒนาต่อ", `<button class="btn btn-secondary" data-action="save-self">บันทึกฉบับร่าง</button><button class="btn btn-primary" data-action="submit-self-review">ส่ง Self Review</button>`)}
      <div class="layout-main-aside"><div>
        <section class="card form-card"><div class="form-section-heading"><span class="step-chip">1</span><div><h2>ผลงานตามเป้าหมาย</h2><p>ข้อมูลเป้าหมายถูกนำเข้าจาก Goals Management</p></div></div><div class="goal-card"><div class="goal-head"><div><h3>เพิ่ม Adoption ของ Design System</h3><p>ทำให้ทีม Product และ Engineering ใช้มาตรฐานเดียวกัน</p></div><span class="goal-score">108%</span></div><div class="goal-stats"><div class="goal-stat"><span>เริ่มต้น</span><strong>45%</strong></div><div class="goal-stat"><span>เป้าหมาย</span><strong>80%</strong></div><div class="goal-stat"><span>ผลจริง</span><strong>86%</strong></div></div><div class="evidence-list"><span class="evidence-chip">▤ Adoption dashboard</span><span class="evidence-chip">▤ Component changelog</span></div></div><div class="goal-card"><div class="goal-head"><div><h3>ลด Design QA Issues</h3><p>ลดปัญหาความไม่สอดคล้องระหว่าง Design และ Production</p></div><span class="goal-score">120%</span></div><div class="goal-stats"><div class="goal-stat"><span>Baseline</span><strong>42 issues</strong></div><div class="goal-stat"><span>เป้าหมาย</span><strong>≤ 34</strong></div><div class="goal-stat"><span>ผลจริง</span><strong>32</strong></div></div></div><div class="field" style="margin-top:18px"><label for="self-achievement">สรุปผลลัพธ์และสิ่งที่คุณภูมิใจ</label><textarea id="self-achievement" class="textarea" data-bind="selfDraft.achievement">${esc(state.selfDraft.achievement)}</textarea></div></section>
        <section class="section card form-card"><div class="form-section-heading"><span class="step-chip">2</span><div><h2>Competency & Behavior</h2><p>ทบทวนวิธีทำงาน ไม่ใช่เฉพาะสิ่งที่ส่งมอบ</p></div></div><div class="field"><label for="self-competency">ตัวอย่างพฤติกรรมที่สะท้อนการทำงาน</label><textarea id="self-competency" class="textarea" data-bind="selfDraft.competency">${esc(state.selfDraft.competency)}</textarea></div><h3 style="margin-top:20px">Self Rating</h3><div class="rating-scale" style="margin-top:12px">${ratingCopy.map(r => `<button class="rating-option ${state.selfRating === r.value ? "selected" : ""}" data-action="select-self-rating" data-rating="${r.value}"><span class="rating-number">${r.value}</span><strong>${r.title}</strong><small>${r.detail}</small></button>`).join("")}</div></section>
        <section class="section card form-card"><div class="form-section-heading"><span class="step-chip">3</span><div><h2>แผนพัฒนา</h2><p>ระบุสิ่งที่อยากเรียนรู้หรือการสนับสนุนที่ต้องการ</p></div></div><div class="field"><label for="self-development">เป้าหมายการพัฒนาถัดไป</label><textarea id="self-development" class="textarea" data-bind="selfDraft.development">${esc(state.selfDraft.development)}</textarea></div></section>
      </div><aside class="sticky-panel"><article class="card card-body"><h3>ความพร้อมก่อนส่ง</h3><ul class="summary-list"><li><span>เป้าหมาย</span><strong>2 จาก 2</strong></li><li><span>Evidence</span><strong>2 รายการ</strong></li><li><span>Self Rating</span><strong>${state.selfRating} / 5</strong></li><li><span>แผนพัฒนา</span><strong>ระบุแล้ว</strong></li></ul><div class="notice notice-success" style="margin-top:18px"><span>✓</span><div><strong>ข้อมูลครบแล้ว</strong>คุณสามารถส่ง Self Review ได้</div></div><button class="btn btn-primary" style="width:100%;margin-top:16px" data-action="submit-self-review">ส่ง Self Review</button><button class="btn btn-ghost" style="width:100%;margin-top:6px" data-action="save-self">บันทึกฉบับร่าง</button></article></aside></div>`;
  }

  function renderResult() {
    return `${pageHeader("Published Result", "ผลการประเมิน Mid-year 2026", "ผลถูกเผยแพร่โดย HR เมื่อ 30 มิถุนายน 2569", `<span class="badge badge-green">เผยแพร่แล้ว</span>`)}
      <section class="card form-card"><div class="score-hero"><div class="score-ring"><div class="score-ring-content"><strong>4.2</strong><span>จาก 5.0</span></div></div><div><span class="score-band">Exceeds Expectations</span><h2>ผลงานเกินความคาดหวัง</h2><p class="page-subtitle">คุณส่งมอบผลลัพธ์เหนือเป้าหมายหลายด้าน และสร้างมาตรฐานการทำงานที่ช่วยให้ทีมทำงานได้เร็วและสอดคล้องกันมากขึ้น</p><div style="margin-top:20px"><div class="breakdown-row"><span class="breakdown-label">Goal Achievement</span><div class="progress-track"><div class="progress-bar" style="width:88%"></div></div><span class="breakdown-score">4.4</span></div><div class="breakdown-row"><span class="breakdown-label">Competency</span><div class="progress-track"><div class="progress-bar" style="width:80%"></div></div><span class="breakdown-score">4.0</span></div></div></div></div></section>
      <section class="section grid grid-2"><article class="card card-body"><h2>จุดแข็ง</h2><ul class="action-list"><li class="action-item"><span class="action-check">✓</span><div><strong>Systems thinking</strong><div class="field-hint">เปลี่ยนปัญหาที่กระจายให้เป็นระบบที่ทีมใช้ร่วมกันได้</div></div></li><li class="action-item"><span class="action-check">✓</span><div><strong>Cross-functional collaboration</strong><div class="field-hint">เชื่อมทีม Design และ Engineering ได้อย่างมีประสิทธิภาพ</div></div></li><li class="action-item"><span class="action-check">✓</span><div><strong>Ownership</strong><div class="field-hint">ติดตามผลลัพธ์จนเกิด Adoption จริง</div></div></li></ul></article><article class="card card-body"><h2>โอกาสในการพัฒนา</h2><ul class="action-list"><li class="action-item"><span class="action-check" style="background:var(--orange-100);color:var(--orange-800)">1</span><div><strong>Product Analytics</strong><div class="field-hint">ใช้ข้อมูลเชิงปริมาณวัดผลการออกแบบให้ชัดขึ้น</div></div></li><li class="action-item"><span class="action-check" style="background:var(--orange-100);color:var(--orange-800)">2</span><div><strong>Data Storytelling</strong><div class="field-hint">สื่อสาร Insight ให้ผู้มีส่วนได้ส่วนเสียตัดสินใจได้เร็วขึ้น</div></div></li></ul></article></section>
      <section class="section card card-body"><h2>Feedback จาก Manager</h2><div class="feedback-block"><p>“เมย์สร้างผลกระทบที่ชัดเจนทั้งด้านคุณภาพผลิตภัณฑ์และความเร็วของทีม โดยเฉพาะการผลักดัน Design System จากแนวคิดไปสู่การใช้งานจริง จุดต่อไปคือการใช้ข้อมูลเชิงปริมาณประกอบการตัดสินใจให้มากขึ้น เพื่อเชื่อมงานออกแบบกับผลลัพธ์ทางธุรกิจได้ชัดเจนกว่าเดิม”</p><strong>— ศิริพร ธนากุล, Head of Product</strong></div>${state.acknowledged ? `<div class="notice notice-success" style="margin-top:18px"><span>✓</span><div><strong>รับทราบผลแล้ว</strong>บันทึกเมื่อวันนี้ · คุณยังเปิดดูผลนี้ได้ตลอดเวลา</div></div>` : `<div class="button-row" style="margin-top:18px"><button class="btn btn-primary" data-action="acknowledge">รับทราบผลการประเมิน</button><button class="btn btn-secondary" data-action="toast-info">นัดหมายพูดคุยกับ Manager</button></div>`}</section>`;
  }

  function navigate(page) {
    if (state.page === "my-review" && page !== "my-review") state.viewingSubmittedReview = false;
    state.page = page;
    state.mobileNav = false;
    render();
  }

  function toast(title, message) {
    const region = document.getElementById("toast-region");
    const item = document.createElement("div");
    item.className = "toast";
    item.innerHTML = `<span class="toast-icon">✓</span><span><strong>${esc(title)}</strong><span>${esc(message)}</span></span>`;
    region.appendChild(item);
    window.setTimeout(() => item.remove(), 3500);
  }

  function setNested(path, value) {
    const [parent, child] = path.split(".");
    if (child) state[parent][child] = value;
    else state[parent] = value;
    saveState();
  }

  document.addEventListener("click", event => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      if (event.target.closest("button")) toast("ฟีเจอร์ตัวอย่าง", "ปุ่มนี้จะแสดงขั้นตอนถัดไปเมื่อเชื่อมต่อกับระบบ Production");
      return;
    }
    const action = target.dataset.action;

    if (action === "navigate") navigate(target.dataset.page);
    if (action === "toggle-menu") { state.mobileNav = !state.mobileNav; render(); }
    if (action === "close-menu") { state.mobileNav = false; render(); }
    if (action === "reset") resetDemo();
    if (action === "save-cycle") {
      const validation = getCycleValidation();
      if (!validation.valid) {
        toast("ยังบันทึกรอบประเมินไม่ได้", "ตรวจสอบชื่อ ช่วงเวลา กำหนดเวลา และน้ำหนักรวมให้เท่ากับ 100%");
        return;
      }
      state.cycleCreated = true;
      state.page = "cycles";
      render();
      toast("บันทึกรอบประเมินแล้ว", `${state.cycleDraft.name} ถูกบันทึกเป็นฉบับร่าง`);
    }
    if (action === "add-cycle-component") {
      state.cycleDraft.components.push({ name: "องค์ประกอบใหม่", weight: 0 });
      render();
    }
    if (action === "remove-cycle-component") {
      if (state.cycleDraft.components.length === 1) return;
      state.cycleDraft.components.splice(Number(target.dataset.index), 1);
      render();
    }
    if (action === "save-self") { saveState(); toast("บันทึกฉบับร่างแล้ว", "ข้อมูลของคุณถูกบันทึกในเบราว์เซอร์นี้"); }
    if (action === "submit-self-review") {
      const validation = getSelfReviewValidation();
      if (!validation.valid) {
        const fieldIds = { achievement: "self-achievement", competency: "self-competency", development: "self-development" };
        document.getElementById(fieldIds[validation.missing[0]])?.focus();
        toast("ข้อมูลยังไม่ครบ", "กรุณากรอกผลงาน พฤติกรรม และแผนพัฒนาให้ครบก่อนส่ง");
        return;
      }
      state.selfReviewSubmitted = true;
      state.viewingSubmittedReview = false;
      render();
      toast("ส่ง Self Review สำเร็จ", "Manager ได้รับข้อมูลเพื่อดำเนินการต่อแล้ว");
    }
    if (action === "reopen-self-review") { state.viewingSubmittedReview = true; render(); }
    if (action === "select-self-rating" && !state.selfReviewSubmitted) { state.selfRating = Number(target.dataset.rating); render(); }
    if (action === "select-manager-rating") {
      state.managerRatings[target.dataset.type] = Number(target.dataset.rating);
      state.managerValidation = "";
      saveActiveManagerReview();
      render();
    }
    if (action === "start-evaluation") {
      const employee = employees.find(e => e.id === target.dataset.id);
      if (employee?.status === "not-started") { toast("ยังเริ่มประเมินไม่ได้", "พนักงานยังไม่ได้ส่ง Self Review"); return; }
      if (!employee) return;
      saveActiveManagerReview();
      state.selectedEmployee = employee.id;
      loadManagerReview(employee);
      navigate("evaluation");
    }
    if (action === "submit-manager-review") {
      const hasExtreme = [state.managerRatings.goal, state.managerRatings.competency].some(value => value === 1 || value === 5);
      if (hasExtreme && state.managerDraft.evidence.trim().length < 20) {
        state.managerValidation = "คะแนนระดับ 1 หรือ 5 ต้องระบุหลักฐานอย่างน้อย 20 ตัวอักษร";
        saveActiveManagerReview();
        render();
        document.querySelector(".notice-warning")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (!state.managerDraft.feedback.trim()) { toast("กรุณาเขียน Feedback", "Feedback ช่วยให้พนักงานเข้าใจคะแนนและนำไปพัฒนาต่อได้"); return; }
      if (!state.submittedEmployees.includes(state.selectedEmployee)) state.submittedEmployees.push(state.selectedEmployee);
      state.managerValidation = "";
      saveActiveManagerReview();
      render();
      toast("ส่งการประเมินให้ HR แล้ว", "คะแนนและหลักฐานถูกบันทึกเรียบร้อย");
    }
    if (action === "filter-team") { state.teamFilter = target.dataset.filter; render(); }
    if (action === "acknowledge") { state.acknowledged = true; render(); toast("บันทึกการรับทราบแล้ว", "คุณยังดูผลและแผนพัฒนาได้ทุกเมื่อ"); }
    if (action === "toast-info") toast("เปิดรายละเอียดตัวอย่าง", "ใน Production จะเชื่อมไปยังหลักฐานหรือการนัดหมายที่เกี่ยวข้อง");
  });

  document.addEventListener("change", event => {
    if (event.target.id === "role-select") {
      state.role = event.target.value;
      state.page = "dashboard";
      render();
      toast("สลับบทบาทแล้ว", `กำลังดูระบบในมุมของ ${roleNames[state.role]}`);
      return;
    }
    const path = event.target.dataset.bind;
    if (path) {
      setNested(path, event.target.value);
      if (state.page === "create-cycle") render();
    }
    const componentIndex = event.target.dataset.componentIndex;
    if (componentIndex !== undefined) {
      const field = event.target.dataset.componentField;
      const value = field === "weight" ? Number(event.target.value) : event.target.value;
      state.cycleDraft.components[Number(componentIndex)][field] = value;
      render();
    }
  });

  document.addEventListener("input", event => {
    const path = event.target.dataset.bind;
    if (path) {
      setNested(path, event.target.value);
      if (path.startsWith("managerDraft.")) {
        saveActiveManagerReview();
        saveState();
      }
    }
    const componentIndex = event.target.dataset.componentIndex;
    if (componentIndex !== undefined) {
      const field = event.target.dataset.componentField;
      state.cycleDraft.components[Number(componentIndex)][field] = field === "weight" ? Number(event.target.value) : event.target.value;
      saveState();
    }
    if (event.target.id === "team-search") {
      state.teamSearch = event.target.value;
      saveState();
      const cursor = event.target.selectionStart;
      render();
      const input = document.getElementById("team-search");
      input?.focus();
      input?.setSelectionRange(cursor, cursor);
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.id === "cycle-form") event.preventDefault();
  });

  render();
})();
