const $ = id => document.getElementById(id);

const pairs = [
  ["name", "stackedStudentName"],
  ["company", "stackedStudentCompany"],
  ["designation", "stackedStudentDesignation"],
  ["qual1", "stackedQual"],
  ["qual2", "stackedQual"],
  ["college1", "stackedCollege"],
  ["college2", "stackedCollege"],
  ["training", "stackedTraining"]
];

function updateDesignation() {
  const val = ($("designation")?.value || "").trim();
  const compVal = ($("company")?.value || "").trim();
  
  const stackedDesig = $("stackedStudentDesignation");
  const stackedComp = $("stackedStudentCompany");
  
  if (stackedDesig) {
    stackedDesig.innerHTML = `<i class="fa-solid fa-briefcase"></i> ${val || "Data Analyst"}`;
    stackedDesig.style.display = val ? "inline-flex" : "none";
  }
  if (stackedComp) {
    stackedComp.innerHTML = `<i class="fa-solid fa-building"></i> ${compVal || "Big 6 Company"}`;
    stackedComp.style.display = compVal ? "inline-flex" : "none";
  }
}

function updateStackedMeta() {
  const q1 = ($("qual1")?.value || "").trim();
  const q2 = ($("qual2")?.value || "").trim();
  const stackedQual = $("stackedQual");
  if (stackedQual) {
    stackedQual.textContent = [q1, q2].filter(Boolean).join(" ");
  }

  const c1 = ($("college1")?.value || "").trim();
  const c2 = ($("college2")?.value || "").trim();
  const stackedCollege = $("stackedCollege");
  if (stackedCollege) {
    stackedCollege.textContent = [c1, c2].filter(Boolean).join(", ");
  }

  const train = ($("training")?.value || "").trim();
  const stackedTraining = $("stackedTraining");
  if (stackedTraining) {
    stackedTraining.textContent = train;
  }
}

function toggleCourseVisibility() {
  const showCourseCheckbox = $("showCourse");
  const isChecked = showCourseCheckbox ? showCourseCheckbox.checked : false;
  const courseInputWrap = $("courseInputWrap");
  const courseBlock = $("courseInfoBlock");
  const courseDivider = $("courseDivider");
  const blueInfoPanel = $("blueInfoPanel");

  if (courseInputWrap) {
    courseInputWrap.style.display = isChecked ? "block" : "none";
  }

  if (courseBlock) {
    courseBlock.style.display = isChecked ? "flex" : "none";
  }

  if (courseDivider) {
    courseDivider.style.display = isChecked ? "block" : "none";
  }

  if (blueInfoPanel) {
    if (isChecked) {
      blueInfoPanel.classList.remove("no-course");
      blueInfoPanel.style.gridTemplateColumns = "1.15fr 1.5px 1.15fr 1.5px 1fr";
      blueInfoPanel.style.padding = "16px 24px";
    } else {
      blueInfoPanel.classList.add("no-course");
      blueInfoPanel.style.gridTemplateColumns = "1.15fr 1.5px 1fr";
      blueInfoPanel.style.padding = "18px 45px";
    }
  }
}

function updateHighlightText() {
  const val = ($("highlightText")?.value || "PLACED").trim().toUpperCase() || "PLACED";
  const rows = document.querySelectorAll("#placedTypographyStack .placed-row");
  rows.forEach(row => {
    row.textContent = val;
  });
}

function updateColorTheme() {
  const poster = $("poster");
  if (poster) {
    poster.classList.remove("theme-bright", "theme-cyan", "theme-indigo", "theme-emerald", "theme-purple", "theme-amber");
    poster.classList.add("theme-royal");
  }
}

// Bind input listeners
pairs.forEach(([inputKey, targetId]) => {
  const inputEl = $(inputKey);
  if (!inputEl) return;

  inputEl.addEventListener("input", () => {
    const targetEl = $(targetId);

    if (inputKey === "name" && targetEl) {
      targetEl.textContent = inputEl.value;
    }

    if (inputKey === "company" || inputKey === "designation") {
      updateDesignation();
    }

    if (inputKey.startsWith("qual") || inputKey.startsWith("college") || inputKey === "training") {
      updateStackedMeta();
    }
  });
});

// Highlight text listener
const highlightInput = $("highlightText");
if (highlightInput) {
  highlightInput.addEventListener("input", updateHighlightText);
}

// Color theme selector listener
const themeSelect = $("colorTheme");
if (themeSelect) {
  themeSelect.addEventListener("change", updateColorTheme);
}

// Course optional checkbox listener
const showCourseCheckbox = $("showCourse");
if (showCourseCheckbox) {
  showCourseCheckbox.addEventListener("change", toggleCourseVisibility);
}

// Photo upload handler
const photoInput = $("photo");
if (photoInput) {
  photoInput.addEventListener("change", e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img2 = $("stackedStudentPhoto");
      if (img2) {
        img2.src = reader.result;
        updatePhotoTransform();
      }
    };
    reader.readAsDataURL(file);
  });
}

// Photo Size & Position Adjustment Controls
function updatePhotoTransform() {
  const scale = ($("photoScale")?.value || 100) / 100;
  const posY = $("photoPosY")?.value || 0;
  const posX = $("photoPosX")?.value || 0;

  if ($("photoScaleVal")) $("photoScaleVal").textContent = `${Math.round(scale * 100)}%`;
  if ($("photoPosYVal")) $("photoPosYVal").textContent = `${posY}px`;
  if ($("photoPosXVal")) $("photoPosXVal").textContent = `${posX}px`;

  // Sync Canva floating toolbar
  if ($("canvaPhotoScale")) $("canvaPhotoScale").value = Math.round(scale * 100);
  if ($("canvaScaleVal")) $("canvaScaleVal").textContent = `${Math.round(scale * 100)}%`;

  const img = $("stackedStudentPhoto");
  if (img) {
    img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }
}

["photoScale", "photoPosY", "photoPosX"].forEach(id => {
  const el = $(id);
  if (el) {
    el.addEventListener("input", updatePhotoTransform);
    el.addEventListener("change", updatePhotoTransform);
  }
});

const resetPhotoBtn = $("resetPhotoAdj");
if (resetPhotoBtn) {
  resetPhotoBtn.onclick = () => {
    if ($("photoScale")) $("photoScale").value = 100;
    if ($("photoPosY")) $("photoPosY").value = 0;
    if ($("photoPosX")) $("photoPosX").value = 0;
    updatePhotoTransform();
  };
}

// Canva-Style Direct On-Photo Drag & Position Adjustment
function initCanvaPhotoAdjustment() {
  const frame = $("stackedPhotoFrame");
  if (!frame) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialPosX = 0;
  let initialPosY = 0;

  // Mouse Down - Start Dragging photo inside frame
  frame.addEventListener("mousedown", (e) => {
    if (e.target.closest(".canva-photo-toolbar")) return;
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialPosX = parseFloat($("photoPosX")?.value || 0);
    initialPosY = parseFloat($("photoPosY")?.value || 0);
    frame.classList.add("is-dragging");
    frame.classList.add("is-active");
  });

  // Mouse Move - Reposition photo with 1:1 screen-to-canvas coordinate mapping
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const currentZoom = typeof zoom === "number" && zoom > 0 ? zoom : 0.5;
    const dx = (e.clientX - startX) / currentZoom;
    const dy = (e.clientY - startY) / currentZoom;

    let newX = Math.round(initialPosX + dx);
    let newY = Math.round(initialPosY + dy);

    newX = Math.max(-250, Math.min(250, newX));
    newY = Math.max(-250, Math.min(250, newY));

    if ($("photoPosX")) $("photoPosX").value = newX;
    if ($("photoPosY")) $("photoPosY").value = newY;

    updatePhotoTransform();
  });

  // Mouse Up - End Drag
  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      frame.classList.remove("is-dragging");
    }
  });

  // Touch Screen Support
  frame.addEventListener("touchstart", (e) => {
    if (e.target.closest(".canva-photo-toolbar")) return;
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      initialPosX = parseFloat($("photoPosX")?.value || 0);
      initialPosY = parseFloat($("photoPosY")?.value || 0);
      frame.classList.add("is-dragging");
      frame.classList.add("is-active");
    }
  }, { passive: false });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const currentZoom = typeof zoom === "number" && zoom > 0 ? zoom : 0.5;
    const dx = (e.touches[0].clientX - startX) / currentZoom;
    const dy = (e.touches[0].clientY - startY) / currentZoom;

    let newX = Math.round(initialPosX + dx);
    let newY = Math.round(initialPosY + dy);
    newX = Math.max(-250, Math.min(250, newX));
    newY = Math.max(-250, Math.min(250, newY));

    if ($("photoPosX")) $("photoPosX").value = newX;
    if ($("photoPosY")) $("photoPosY").value = newY;

    updatePhotoTransform();
  }, { passive: false });

  window.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false;
      frame.classList.remove("is-dragging");
    }
  });

  // Wheel Zoom directly on the photo
  frame.addEventListener("wheel", (e) => {
    e.preventDefault();
    e.stopPropagation();
    let currentScale = parseFloat($("photoScale")?.value || 100);
    const step = e.deltaY < 0 ? 5 : -5;
    currentScale = Math.max(60, Math.min(250, currentScale + step));
    if ($("photoScale")) {
      $("photoScale").value = currentScale;
    }
    updatePhotoTransform();
  }, { passive: false });

  // Canva Floating Zoom Slider & Buttons
  if ($("canvaPhotoScale")) {
    $("canvaPhotoScale").addEventListener("input", (e) => {
      const val = e.target.value;
      if ($("photoScale")) $("photoScale").value = val;
      updatePhotoTransform();
    });
  }

  if ($("canvaZoomMinus")) {
    $("canvaZoomMinus").onclick = (e) => {
      e.stopPropagation();
      let scale = parseFloat($("photoScale")?.value || 100);
      scale = Math.max(60, scale - 5);
      if ($("photoScale")) $("photoScale").value = scale;
      updatePhotoTransform();
    };
  }

  if ($("canvaZoomPlus")) {
    $("canvaZoomPlus").onclick = (e) => {
      e.stopPropagation();
      let scale = parseFloat($("photoScale")?.value || 100);
      scale = Math.min(250, scale + 5);
      if ($("photoScale")) $("photoScale").value = scale;
      updatePhotoTransform();
    };
  }

  // Quick Canva Align Presets
  if ($("canvaAlignTop")) {
    $("canvaAlignTop").onclick = (e) => {
      e.stopPropagation();
      if ($("photoPosY")) $("photoPosY").value = 30;
      if ($("photoPosX")) $("photoPosX").value = 0;
      updatePhotoTransform();
    };
  }

  if ($("canvaAlignCenter")) {
    $("canvaAlignCenter").onclick = (e) => {
      e.stopPropagation();
      if ($("photoPosY")) $("photoPosY").value = 0;
      if ($("photoPosX")) $("photoPosX").value = 0;
      updatePhotoTransform();
    };
  }

  if ($("canvaReset")) {
    $("canvaReset").onclick = (e) => {
      e.stopPropagation();
      if ($("photoScale")) $("photoScale").value = 100;
      if ($("photoPosY")) $("photoPosY").value = 0;
      if ($("photoPosX")) $("photoPosX").value = 0;
      updatePhotoTransform();
    };
  }

  // Deactivate when clicked elsewhere
  document.addEventListener("mousedown", (e) => {
    if (!frame.contains(e.target)) {
      frame.classList.remove("is-active");
    }
  });
}

// Initialize Canva photo adjustment
initCanvaPhotoAdjustment();

// Zoom controls & Auto-Fit
let zoom = 0.50;

function setZoom() {
  const poster = $("poster");
  const posterContainer = $("posterContainer");
  const zoomLabel = $("zoom");
  
  if (poster) {
    if (posterContainer) {
      poster.style.transform = `translate(-50%, -50%) scale(${zoom})`;
    } else {
      poster.style.transform = `scale(${zoom})`;
    }
  }
  
  if (posterContainer) {
    posterContainer.style.width = `${Math.round(1080 * zoom)}px`;
    posterContainer.style.height = `${Math.round(1350 * zoom)}px`;
  }
  
  if (zoomLabel) {
    zoomLabel.textContent = Math.round(zoom * 100) + "%";
  }
}

function autoFitPoster() {
  const viewport = document.querySelector(".viewport");
  if (!viewport) return;
  const isMobile = window.innerWidth <= 720;
  const isTablet = window.innerWidth > 720 && window.innerWidth <= 1024;
  const paddingX = isMobile ? 16 : (isTablet ? 24 : 36);
  const paddingY = isMobile ? 70 : 36;
  const availHeight = viewport.clientHeight - paddingY;
  const availWidth = viewport.clientWidth - paddingX;
  if (availHeight > 80 && availWidth > 80) {
    const scaleY = availHeight / 1350;
    const scaleX = availWidth / 1080;
    const fitScale = Math.min(scaleY, scaleX);
    zoom = Math.max(0.18, Math.min(1.10, Math.round(fitScale * 100) / 100));
    setZoom();
  } else {
    setZoom();
  }
}

if ($("plus")) {
  $("plus").onclick = () => {
    zoom = Math.min(1.50, Math.round((zoom + 0.05) * 100) / 100);
    setZoom();
  };
}

if ($("minus")) {
  $("minus").onclick = () => {
    zoom = Math.max(0.18, Math.round((zoom - 0.05) * 100) / 100);
    setZoom();
  };
}

if ($("fitBtn")) {
  $("fitBtn").onclick = () => {
    autoFitPoster();
  };
}

// Sidebar Toggle (Collapse / Expand on Desktop & Tablet)
function toggleSidebar() {
  const appEl = document.querySelector(".app");
  if (!appEl) return;
  appEl.classList.toggle("sidebar-collapsed");
  const isCollapsed = appEl.classList.contains("sidebar-collapsed");
  const toggleBtn = $("sidebarToggleBtn");
  if (toggleBtn) {
    const textSpan = toggleBtn.querySelector(".sidebar-toggle-text");
    if (textSpan) {
      textSpan.textContent = isCollapsed ? "Show Panel" : "Panel";
    }
    toggleBtn.setAttribute("title", isCollapsed ? "Show Sidebar Controls" : "Collapse Sidebar for Full-Screen View");
  }
  // Smoothly refit poster canvas to the new expanded stage dimensions
  setTimeout(() => {
    autoFitPoster();
  }, 260);
}

if ($("sidebarToggleBtn")) {
  $("sidebarToggleBtn").onclick = toggleSidebar;
}

setZoom();

// Auto adjust when window resized
window.addEventListener("resize", () => {
  autoFitPoster();
});

// Fit poster smoothly on load
requestAnimationFrame(() => {
  autoFitPoster();
});
window.addEventListener("load", () => {
  autoFitPoster();
});

// ================= MOBILE VIEW SWITCHER LOGIC =================
function switchMobileTab(tab) {
  const appEl = document.querySelector(".app");
  const editTabBtn = $("tabBtnEdit");
  const previewTabBtn = $("tabBtnPreview");

  if (tab === "preview") {
    if (appEl) {
      appEl.classList.add("mobile-preview-active");
      appEl.classList.remove("mobile-edit-active");
    }
    if (editTabBtn) editTabBtn.classList.remove("active");
    if (previewTabBtn) previewTabBtn.classList.add("active");
    setTimeout(() => {
      autoFitPoster();
    }, 60);
  } else {
    if (appEl) {
      appEl.classList.remove("mobile-preview-active");
      appEl.classList.add("mobile-edit-active");
    }
    if (editTabBtn) editTabBtn.classList.add("active");
    if (previewTabBtn) previewTabBtn.classList.remove("active");
  }
}

if ($("tabBtnEdit")) {
  $("tabBtnEdit").onclick = () => switchMobileTab("edit");
}
if ($("tabBtnPreview")) {
  $("tabBtnPreview").onclick = () => switchMobileTab("preview");
}
if ($("mobileQuickEditBtn")) {
  $("mobileQuickEditBtn").onclick = () => switchMobileTab("edit");
}
if ($("mobileQuickDraftBtn")) {
  $("mobileQuickDraftBtn").onclick = () => {
    if ($("saveDraftBtn")) $("saveDraftBtn").click();
  };
}
if ($("mobileQuickPngBtn")) {
  $("mobileQuickPngBtn").onclick = () => {
    if ($("download")) $("download").click();
  };
}
if ($("mobileQuickPdfBtn")) {
  $("mobileQuickPdfBtn").onclick = () => {
    if ($("print")) $("print").click();
  };
}

// Keep poster view section completely fixed (scrolls the editable section instead on desktop/tablet)
const stageEl = document.querySelector(".stage");
if (stageEl) {
  stageEl.addEventListener("wheel", (e) => {
    if (window.innerWidth <= 720) return;
    const appEl = document.querySelector(".app");
    if (appEl && appEl.classList.contains("sidebar-collapsed")) return;
    const controls = document.querySelector(".controls");
    if (controls) {
      controls.scrollTop += e.deltaY;
    }
  }, { passive: true });
}

// Initialize dynamic elements on page load
updateDesignation();
updateStackedMeta();
updateHighlightText();
updateColorTheme();
toggleCourseVisibility();

// Restore saved photo adjustments if provided by Django context
const initialScale = parseFloat($("initialPhotoScale")?.value);
const initialPosX = parseFloat($("initialPhotoPosX")?.value);
const initialPosY = parseFloat($("initialPhotoPosY")?.value);
if (!isNaN(initialScale) && initialScale > 0 && $("photoScale")) {
  $("photoScale").value = initialScale;
}
if (!isNaN(initialPosX) && $("photoPosX")) {
  $("photoPosX").value = initialPosX;
}
if (!isNaN(initialPosY) && $("photoPosY")) {
  $("photoPosY").value = initialPosY;
}
updatePhotoTransform();

// ================= LOCAL DRAFT AUTO-SAVE & RECOVERY =================
const LOCAL_DRAFT_KEY = "agenticx_poster_auto_draft";

function getFormDataSnapshot() {
  return {
    name: $("name")?.value || "",
    company: $("company")?.value || "",
    designation: $("designation")?.value || "",
    qual1: $("qual1")?.value || "",
    qual2: $("qual2")?.value || "",
    college1: $("college1")?.value || "",
    college2: $("college2")?.value || "",
    training: $("training")?.value || "",
    showCourse: $("showCourse") ? $("showCourse").checked : true,
    highlight_text: $("highlightText")?.value || "PLACED",
    color_theme: "royal",
    photo_scale: $("photoScale")?.value || 100,
    photo_pos_x: $("photoPosX")?.value || 0,
    photo_pos_y: $("photoPosY")?.value || 0,
    activeStudentId: $("activeStudentId")?.value || "",
    timestamp: new Date().toISOString()
  };
}

let autoSaveTimer = null;
function triggerAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    try {
      const data = getFormDataSnapshot();
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not auto-save to localStorage:", e);
    }
  }, 1000);
}

// Attach auto-save to all inputs
["name", "company", "designation", "qual1", "qual2", "college1", "college2", "training", "highlightText", "photoScale", "photoPosX", "photoPosY"].forEach(id => {
  const el = $(id);
  if (el) el.addEventListener("input", triggerAutoSave);
});
if ($("showCourse")) $("showCourse").addEventListener("change", triggerAutoSave);

// Check for local draft on fresh load
function checkLocalDraft() {
  try {
    const raw = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (!raw) return;
    const draft = JSON.parse(raw);
    const activeId = $("activeStudentId")?.value;
    
    // If user is editing a specific saved student in Django, don't nag with local draft unless student matches
    if (activeId && draft.activeStudentId && draft.activeStudentId !== activeId) {
      return;
    }

    const savedTime = draft.timestamp ? new Date(draft.timestamp) : null;
    let timeStr = "earlier";
    if (savedTime && !isNaN(savedTime.getTime())) {
      timeStr = savedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " (" + savedTime.toLocaleDateString() + ")";
    }

    const alertBox = $("localDraftAlert");
    const tsEl = $("localDraftTimestamp");
    if (alertBox && tsEl) {
      tsEl.textContent = `Draft with student "${draft.name || 'Untitled'}" saved at ${timeStr}.`;
      alertBox.style.display = "flex";
    }
  } catch (e) {
    console.warn("Error checking local draft:", e);
  }
}

if ($("resumeDraftBtn")) {
  $("resumeDraftBtn").onclick = () => {
    try {
      const raw = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);

      if ($("name") && draft.name) $("name").value = draft.name;
      if ($("company") && draft.company) $("company").value = draft.company;
      if ($("designation") && draft.designation !== undefined) $("designation").value = draft.designation;
      if ($("qual1") && draft.qual1 !== undefined) $("qual1").value = draft.qual1;
      if ($("qual2") && draft.qual2 !== undefined) $("qual2").value = draft.qual2;
      if ($("college1") && draft.college1 !== undefined) $("college1").value = draft.college1;
      if ($("college2") && draft.college2 !== undefined) $("college2").value = draft.college2;
      if ($("training") && draft.training !== undefined) $("training").value = draft.training;
      if ($("showCourse") && draft.showCourse !== undefined) $("showCourse").checked = draft.showCourse;
      if ($("highlightText") && draft.highlight_text) $("highlightText").value = draft.highlight_text;
      if ($("photoScale") && draft.photo_scale) $("photoScale").value = draft.photo_scale;
      if ($("photoPosX") && draft.photo_pos_x) $("photoPosX").value = draft.photo_pos_x;
      if ($("photoPosY") && draft.photo_pos_y) $("photoPosY").value = draft.photo_pos_y;
      if (draft.activeStudentId && $("activeStudentId")) $("activeStudentId").value = draft.activeStudentId;

      const nameEl = $("stackedStudentName");
      if (nameEl && draft.name) nameEl.textContent = draft.name;

      updateDesignation();
      updateStackedMeta();
      updateHighlightText();
      toggleCourseVisibility();
      updatePhotoTransform();

      const banner = $("editingModeBanner");
      if (banner) {
        banner.style.background = "#fffbeb";
        banner.style.borderColor = "#fde68a";
        banner.style.color = "#92400e";
        banner.innerHTML = `<i class="fa-solid fa-file-pen" style="color: #f59e0b;"></i> Continuing Draft: <b>${draft.name || 'Recovered Draft'}</b> <span style="background: #fef3c7; color: #b45309; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-left: 4px;">LOCAL DRAFT</span>`;
      }

      if ($("localDraftAlert")) $("localDraftAlert").style.display = "none";
    } catch (e) {
      console.error("Error resuming draft:", e);
    }
  };
}

if ($("dismissDraftBtn")) {
  $("dismissDraftBtn").onclick = () => {
    localStorage.removeItem(LOCAL_DRAFT_KEY);
    if ($("localDraftAlert")) $("localDraftAlert").style.display = "none";
  };
}

// Run draft check on startup (or initialize clean state if ?new is present)
try {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('new')) {
    const defaultPhotoUrl = $("defaultStudentPhotoUrl")?.value || $("stackedStudentPhoto")?.dataset?.defaultSrc || "/static/assets/student_1.jpg";
    const studentPhotoImg = $("stackedStudentPhoto");
    if (studentPhotoImg && defaultPhotoUrl) {
      studentPhotoImg.src = defaultPhotoUrl;
    }
    const photoFileInput = $("photo");
    if (photoFileInput) {
      photoFileInput.value = "";
    }
  } else {
    checkLocalDraft();
  }
} catch (e) {
  checkLocalDraft();
}

// Reset Form to Create New Poster
const resetNewFormBtn = $("resetNewFormBtn");
if (resetNewFormBtn) {
  resetNewFormBtn.onclick = () => {
    if ($("activeStudentId")) $("activeStudentId").value = "";
    if ($("name")) $("name").value = "NEW STUDENT NAME";
    if ($("company")) $("company").value = "Company Name";
    if ($("designation")) $("designation").value = "Job Role / Designation";
    if ($("qual1")) $("qual1").value = "B.Tech Computer Science";
    if ($("qual2")) $("qual2").value = "(2026 Batch)";
    if ($("college1")) $("college1").value = "College of Engineering";
    if ($("college2")) $("college2").value = "Attingal";
    if ($("training")) $("training").value = "Data Analytics";
    if ($("showCourse")) $("showCourse").checked = true;
    toggleCourseVisibility();
    if ($("highlightText")) $("highlightText").value = "PLACED";
    if ($("colorTheme")) $("colorTheme").value = "royal";

    const nameEl = $("stackedStudentName");
    if (nameEl) nameEl.textContent = "NEW STUDENT NAME";

    const bannerName = $("bannerStudentName");
    const banner = $("editingModeBanner");
    if (bannerName) bannerName.textContent = "Creating New Poster";
    if (banner) {
      banner.style.background = "#f0fdf4";
      banner.style.borderColor = "#bbf7d0";
      banner.style.color = "#15803d";
      banner.innerHTML = '<i class="fa-solid fa-sparkles"></i> Mode: <b>Creating New Poster</b>';
    }

    const updateBtn = $("updateDbBtn");
    if (updateBtn) updateBtn.style.display = "none";

    // Change photo back to student_1.jpg & clear file input
    const defaultPhotoUrl = $("defaultStudentPhotoUrl")?.value || $("stackedStudentPhoto")?.dataset?.defaultSrc || "/static/assets/student_1.jpg";
    const studentPhotoImg = $("stackedStudentPhoto");
    if (studentPhotoImg) {
      studentPhotoImg.src = defaultPhotoUrl;
    }
    const photoFileInput = $("photo");
    if (photoFileInput) {
      photoFileInput.value = "";
    }

    if ($("initialPhotoScale")) $("initialPhotoScale").value = "100";
    if ($("initialPhotoPosX")) $("initialPhotoPosX").value = "0";
    if ($("initialPhotoPosY")) $("initialPhotoPosY").value = "0";
    if ($("photoScale")) $("photoScale").value = 100;
    if ($("photoPosY")) $("photoPosY").value = 0;
    if ($("photoPosX")) $("photoPosX").value = 0;
    if ($("canvaPhotoScale")) $("canvaPhotoScale").value = 100;
    if ($("photoScaleVal")) $("photoScaleVal").textContent = "100%";
    if ($("canvaScaleVal")) $("canvaScaleVal").textContent = "100%";
    if ($("photoPosYVal")) $("photoPosYVal").textContent = "0px";
    if ($("photoPosXVal")) $("photoPosXVal").textContent = "0px";
    updatePhotoTransform();

    localStorage.removeItem(LOCAL_DRAFT_KEY);
    if ($("localDraftAlert")) $("localDraftAlert").style.display = "none";

    updateDesignation();
    updateStackedMeta();
    updateHighlightText();
    updateColorTheme();

    try {
      window.history.replaceState({}, '', '/?new=1');
    } catch (e) {
      // Ignore if history state cannot be modified
    }

    if ($("name")) $("name").focus();
  };
}

// 0. SAVE AS DRAFT (CONTINUE EDITING LATER)
if ($("saveDraftBtn")) {
  $("saveDraftBtn").onclick = async () => {
    const btn = $("saveDraftBtn");
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving Draft...';
    btn.disabled = true;

    const activeId = $("activeStudentId")?.value;
    const url = activeId ? `/api/students/update/${activeId}/` : "/api/students/create/";

    const formData = new FormData();
    formData.append("name", $("name")?.value || "DRAFT STUDENT");
    formData.append("company", $("company")?.value || "Company");
    formData.append("designation", $("designation")?.value || "");
    formData.append("qual1", $("qual1")?.value || "");
    formData.append("qual2", $("qual2")?.value || "");
    formData.append("college1", $("college1")?.value || "");
    formData.append("college2", $("college2")?.value || "");
    const isCourseChecked = $("showCourse") ? $("showCourse").checked : true;
    formData.append("training", isCourseChecked ? ($("training")?.value || "") : "");
    formData.append("highlight_text", $("highlightText")?.value || "PLACED");
    formData.append("color_theme", "royal");
    formData.append("is_draft", "true");
    formData.append("photo_scale", $("photoScale")?.value || 100);
    formData.append("photo_pos_x", $("photoPosX")?.value || 0);
    formData.append("photo_pos_y", $("photoPosY")?.value || 0);

    const photoFile = $("photo")?.files?.[0];
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        if ($("activeStudentId")) $("activeStudentId").value = data.id;

        // Update banner mode to Draft
        const banner = $("editingModeBanner");
        if (banner) {
          banner.style.background = "#fffbeb";
          banner.style.borderColor = "#fde68a";
          banner.style.color = "#92400e";
          banner.innerHTML = `<i class="fa-solid fa-file-pen" style="color: #f59e0b;"></i> Continuing Draft: <b>${data.name}</b> <span style="background: #fef3c7; color: #b45309; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-left: 4px;">DRAFT SAVED</span>`;
        }

        const updateBtn = $("updateDbBtn");
        if (updateBtn) updateBtn.style.display = "inline-flex";

        // Save snapshot to local storage
        try {
          const snapshot = getFormDataSnapshot();
          snapshot.activeStudentId = data.id;
          localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(snapshot));
        } catch (e) {}

        if ($("localDraftAlert")) $("localDraftAlert").style.display = "none";

        alert(`Draft saved successfully for "${data.name}"!\nYou can continue editing anytime from Manage Posters or right here.`);
      } else {
        alert("Failed to save draft: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error("Save draft error:", err);
      alert("Error saving draft to database.");
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  };
}

// 1. SAVE AS NEW STUDENT POSTER (ALWAYS CREATES NEW DB RECORD - PUBLISHED)
if ($("saveNewDbBtn")) {
  $("saveNewDbBtn").onclick = async () => {
    const btn = $("saveNewDbBtn");
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving New Poster...';
    btn.disabled = true;

    const formData = new FormData();
    formData.append("name", $("name")?.value || "STUDENT NAME");
    formData.append("company", $("company")?.value || "Company");
    formData.append("designation", $("designation")?.value || "");
    formData.append("qual1", $("qual1")?.value || "");
    formData.append("qual2", $("qual2")?.value || "");
    formData.append("college1", $("college1")?.value || "");
    formData.append("college2", $("college2")?.value || "");
    const isCourseChecked = $("showCourse") ? $("showCourse").checked : true;
    formData.append("training", isCourseChecked ? ($("training")?.value || "") : "");
    formData.append("highlight_text", $("highlightText")?.value || "PLACED");
    formData.append("color_theme", $("colorTheme")?.value || "royal");
    formData.append("is_draft", "false");
    formData.append("photo_scale", $("photoScale")?.value || 100);
    formData.append("photo_pos_x", $("photoPosX")?.value || 0);
    formData.append("photo_pos_y", $("photoPosY")?.value || 0);

    const photoFile = $("photo")?.files?.[0];
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      const res = await fetch("/api/students/create/", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        if ($("activeStudentId")) $("activeStudentId").value = data.id;

        // Clear local draft since it is now published
        localStorage.removeItem(LOCAL_DRAFT_KEY);
        if ($("localDraftAlert")) $("localDraftAlert").style.display = "none";

        // Update banner mode
        const banner = $("editingModeBanner");
        if (banner) {
          banner.style.background = "#f0f9ff";
          banner.style.borderColor = "#bae6fd";
          banner.style.color = "#0369a1";
          banner.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editing: <b>${data.name}</b>`;
        }

        const updateBtn = $("updateDbBtn");
        if (updateBtn) updateBtn.style.display = "inline-flex";

        alert(`Successfully created and published poster for "${data.name}"!`);
      } else {
        alert("Failed to create new poster: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving new poster to database.");
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  };
}

// 2. UPDATE ACTIVE STUDENT POSTER (UPDATES EXISTING DB RECORD - PUBLISHED)
if ($("updateDbBtn")) {
  $("updateDbBtn").onclick = async () => {
    const activeId = $("activeStudentId")?.value;
    if (!activeId) {
      alert("No active student loaded to update. Click 'Save as NEW Student Poster' or 'Save as Draft' instead.");
      return;
    }

    const btn = $("updateDbBtn");
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';
    btn.disabled = true;

    const formData = new FormData();
    formData.append("name", $("name")?.value || "STUDENT NAME");
    formData.append("company", $("company")?.value || "Company");
    formData.append("designation", $("designation")?.value || "");
    formData.append("qual1", $("qual1")?.value || "");
    formData.append("qual2", $("qual2")?.value || "");
    formData.append("college1", $("college1")?.value || "");
    formData.append("college2", $("college2")?.value || "");
    const isCourseChecked = $("showCourse") ? $("showCourse").checked : true;
    formData.append("training", isCourseChecked ? ($("training")?.value || "") : "");
    formData.append("highlight_text", $("highlightText")?.value || "PLACED");
    formData.append("color_theme", $("colorTheme")?.value || "royal");
    formData.append("is_draft", "false");
    formData.append("photo_scale", $("photoScale")?.value || 100);
    formData.append("photo_pos_x", $("photoPosX")?.value || 0);
    formData.append("photo_pos_y", $("photoPosY")?.value || 0);

    const photoFile = $("photo")?.files?.[0];
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      const res = await fetch(`/api/students/update/${activeId}/`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.status === "success") {
        // Clear local draft since it is now saved/published
        localStorage.removeItem(LOCAL_DRAFT_KEY);
        if ($("localDraftAlert")) $("localDraftAlert").style.display = "none";

        // Update banner
        const banner = $("editingModeBanner");
        if (banner) {
          banner.style.background = "#f0f9ff";
          banner.style.borderColor = "#bae6fd";
          banner.style.color = "#0369a1";
          banner.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editing: <b>${data.name}</b>`;
        }

        alert(`Successfully updated and published poster for "${data.name}"!`);
      } else {
        alert("Failed to update poster: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating poster.");
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  };
}

// High resolution PNG download for active 4:5 Instagram Portrait Post (1080x1350 px)
if ($("download")) {
  $("download").onclick = async () => {
    const poster = $("poster");
    if (!poster) {
      alert("Poster preview container not found.");
      return;
    }

    const btn = $("download");
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating 4:5 PNG...';
    btn.disabled = true;

    // Create an offscreen container for clean 1080x1350 unscaled capture
    const cloneWrapper = document.createElement("div");
    cloneWrapper.style.position = "fixed";
    cloneWrapper.style.left = "-9999px";
    cloneWrapper.style.top = "0";
    cloneWrapper.style.width = "1080px";
    cloneWrapper.style.height = "1350px";
    cloneWrapper.style.overflow = "hidden";
    cloneWrapper.style.zIndex = "-9999";
    document.body.appendChild(cloneWrapper);

    try {
      const clonedPoster = poster.cloneNode(true);
      clonedPoster.style.transform = "none";
      clonedPoster.style.margin = "0";
      clonedPoster.style.position = "relative";
      clonedPoster.style.left = "0";
      clonedPoster.style.top = "0";
      clonedPoster.style.width = "1080px";
      clonedPoster.style.height = "1350px";

      // Clean up Canva editing overlays from cloned poster
      clonedPoster.querySelectorAll(".canva-photo-toolbar, .canva-crop-grid, .canva-drag-indicator").forEach(el => el.remove());

      cloneWrapper.appendChild(clonedPoster);

      // Wait 100ms for cloned assets to settle
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(clonedPoster, {
        width: 1080,
        height: 1350,
        scale: 2, // High resolution crisp output (2160 x 2700 px)
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1080,
        windowHeight: 1350
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Failed to create PNG image blob.");
          return;
        }
        const rawName = ($("name")?.value || "Student").trim();
        const fileName = `${rawName.replace(/\s+/g, "_")}_4x5_Poster.png`;

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = fileName;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 1000);
      }, "image/png", 1.0);
    } catch (err) {
      console.error("Error generating poster image:", err);
      const activeId = $("activeStudentId")?.value;
      if (activeId) {
        window.location.href = `/download/${activeId}/`;
      } else {
        alert("Failed to generate PNG image: " + err.message);
      }
    } finally {
      if (document.body.contains(cloneWrapper)) {
        document.body.removeChild(cloneWrapper);
      }
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  };
}

// High resolution PDF download for ONLY the active 4:5 Poster (1080x1350 px)
if ($("print")) {
  $("print").onclick = async () => {
    const poster = $("poster");
    if (!poster) {
      alert("Poster preview element not found.");
      return;
    }

    const btn = $("print");
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating 4:5 PDF...';
    btn.disabled = true;

    // Create an offscreen unscaled container for clean 1080x1350 capture
    const cloneWrapper = document.createElement("div");
    cloneWrapper.style.position = "fixed";
    cloneWrapper.style.left = "-9999px";
    cloneWrapper.style.top = "0";
    cloneWrapper.style.width = "1080px";
    cloneWrapper.style.height = "1350px";
    cloneWrapper.style.overflow = "hidden";
    cloneWrapper.style.zIndex = "-9999";
    document.body.appendChild(cloneWrapper);

    try {
      const clonedPoster = poster.cloneNode(true);
      clonedPoster.style.transform = "none";
      clonedPoster.style.margin = "0";
      clonedPoster.style.position = "relative";
      clonedPoster.style.left = "0";
      clonedPoster.style.top = "0";
      clonedPoster.style.width = "1080px";
      clonedPoster.style.height = "1350px";

      // Clean up Canva editing overlays from cloned poster
      clonedPoster.querySelectorAll(".canva-photo-toolbar, .canva-crop-grid, .canva-drag-indicator").forEach(el => el.remove());

      cloneWrapper.appendChild(clonedPoster);

      // Wait 100ms for assets to settle
      await new Promise(r => setTimeout(r, 100));

      // Measure exact bounding boxes for clickable links in 1080x1350 PDF space
      const posterRect = clonedPoster.getBoundingClientRect();
      const scaleX = 1080 / (posterRect.width || 1080);
      const scaleY = 1350 / (posterRect.height || 1350);

      function getLinkBounds(element, paddingX = 4, paddingY = 4) {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return null;
        return {
          x: Math.max(0, (rect.left - posterRect.left - paddingX) * scaleX),
          y: Math.max(0, (rect.top - posterRect.top - paddingY) * scaleY),
          w: (rect.width + paddingX * 2) * scaleX,
          h: (rect.height + paddingY * 2) * scaleY
        };
      }

      const webEl = clonedPoster.querySelector("#footerWebLink") || clonedPoster.querySelector(".footer-web");
      const linkedinEl = clonedPoster.querySelector("#footerLinkedinLink") || clonedPoster.querySelector('a[href*="linkedin"]');
      const instaEl = clonedPoster.querySelector("#footerInstagramLink") || clonedPoster.querySelector('a[href*="instagram"]');

      const webBounds = getLinkBounds(webEl, 4, 4);
      const linkedinBounds = getLinkBounds(linkedinEl, 6, 6);
      const instaBounds = getLinkBounds(instaEl, 6, 6);

      const canvas = await html2canvas(clonedPoster, {
        width: 1080,
        height: 1350,
        scale: 2, // High resolution crisp output (2160 x 2700 px)
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1080,
        windowHeight: 1350
      });

      document.body.removeChild(cloneWrapper);

      const rawName = ($("name")?.value || "Student").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `AgenticX_${rawName}_Placement_Poster.pdf`;

      // Use jsPDF to generate an exact single-page 4:5 PDF with clickable annotations
      const jsPDFConstructor = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
      if (jsPDFConstructor) {
        // PDF with exact 1080 x 1350 pt dimensions (1 single page, 4:5 ratio)
        const pdf = new jsPDFConstructor({
          orientation: "portrait",
          unit: "pt",
          format: [1080, 1350],
          compress: true
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.96);
        pdf.addImage(imgData, "JPEG", 0, 0, 1080, 1350, undefined, "FAST");

        // Add clickable hyperlinks over the rasterized canvas
        // 1. Website Link
        const finalWebBounds = webBounds || { x: 45, y: 1276, w: 220, h: 60 };
        pdf.link(finalWebBounds.x, finalWebBounds.y, finalWebBounds.w, finalWebBounds.h, {
          url: "https://www.agenticx.co.in/"
        });

        // 2. LinkedIn Link
        const finalLinkedinBounds = linkedinBounds || { x: 935, y: 1280, w: 50, h: 50 };
        pdf.link(finalLinkedinBounds.x, finalLinkedinBounds.y, finalLinkedinBounds.w, finalLinkedinBounds.h, {
          url: "https://www.linkedin.com/company/agenticx-knowledge-solutions/"
        });

        // 3. Instagram Link
        const finalInstaBounds = instaBounds || { x: 990, y: 1280, w: 50, h: 50 };
        pdf.link(finalInstaBounds.x, finalInstaBounds.y, finalInstaBounds.w, finalInstaBounds.h, {
          url: "https://www.instagram.com/agenticxknowledgesolutions"
        });

        pdf.save(fileName);
      } else {
        // Fallback: If jsPDF is not found, print popup containing strictly the poster image with links
        const finalWebBounds = webBounds || { x: 45, y: 1276, w: 220, h: 60 };
        const finalLinkedinBounds = linkedinBounds || { x: 935, y: 1280, w: 50, h: 50 };
        const finalInstaBounds = instaBounds || { x: 990, y: 1280, w: 50, h: 50 };
        const imgUri = canvas.toDataURL("image/png");
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`<!doctype html><html><head><title>${fileName}</title><style>@page{size:1080px 1350px;margin:0;}html,body{margin:0;padding:0;background:#fff;position:relative;}img{width:1080px;height:1350px;display:block;margin:0 auto;}.pdf-link{position:absolute;display:block;}</style></head><body><div style="position:relative;width:1080px;height:1350px;margin:0 auto;"><img src="${imgUri}"><a href="https://www.agenticx.co.in/" target="_blank" class="pdf-link" style="left:${finalWebBounds.x}px;top:${finalWebBounds.y}px;width:${finalWebBounds.w}px;height:${finalWebBounds.h}px;"></a><a href="https://www.linkedin.com/company/agenticx-knowledge-solutions/" target="_blank" class="pdf-link" style="left:${finalLinkedinBounds.x}px;top:${finalLinkedinBounds.y}px;width:${finalLinkedinBounds.w}px;height:${finalLinkedinBounds.h}px;"></a><a href="https://www.instagram.com/agenticxknowledgesolutions" target="_blank" class="pdf-link" style="left:${finalInstaBounds.x}px;top:${finalInstaBounds.y}px;width:${finalInstaBounds.w}px;height:${finalInstaBounds.h}px;"></a></div><script>window.onload=function(){window.print();setTimeout(()=>window.close(),1000);};<\/script></body></html>`);
          printWindow.document.close();
        }
      }
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Error generating PDF: " + err.message);
      if (document.body.contains(cloneWrapper)) {
        document.body.removeChild(cloneWrapper);
      }
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  };
}
