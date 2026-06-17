
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  document.querySelectorAll(".links a").forEach(a => {
    if ((a.getAttribute("href") || "").includes(page)) a.classList.add("active");
  });
  document.querySelectorAll("[data-checklist]").forEach(box => {
    const key = "festival-student-" + (box.dataset.checklist || location.pathname);
    const inputs = box.querySelectorAll("input[type='checkbox']");
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    inputs.forEach((input, i) => {
      input.checked = !!saved[i];
      input.addEventListener("change", () => localStorage.setItem(key, JSON.stringify([...inputs].map(x => x.checked))));
    });
  });
});


// Festival name generator for the planning page
function festivalTitleCaseWord(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function cleanFestivalKeywords(raw) {
  return raw
    .split(/[,\s]+/)
    .map(w => w.trim().replace(/[^a-zA-Z0-9-]/g, ""))
    .filter(w => w.length > 1)
    .slice(0, 6);
}

function pickFestivalRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFestivalNames() {
  const input = document.getElementById("festivalKeywords");
  const styleSelect = document.getElementById("festivalStyle");
  const results = document.getElementById("festivalNameResults");

  if (!input || !results) return;

  const rawKeywords = cleanFestivalKeywords(input.value || "");
  const style = styleSelect ? styleSelect.value : "";

  const fallbackWords = {
    pop: ["Glow", "Spark", "Pulse", "Star", "Dream"],
    rock: ["Riff", "Amp", "Storm", "Rebel", "Thunder"],
    dance: ["Neon", "Pulse", "Bass", "Electric", "Afterglow"],
    indie: ["Meadow", "Echo", "Drift", "Lantern", "Bloom"],
    rap: ["Rhythm", "Block", "Flow", "Beat", "Cipher"],
    mixed: ["Fusion", "Vibe", "Sound", "Stage", "Wave"],
    "": ["Sound", "Vibe", "Pulse", "Glow", "Wave", "Stage"]
  };

  const nouns = ["Fest", "Festival", "Live", "Weekender", "Sessions", "Sounds", "Jam", "Carnival", "Stage"];
  const prefixes = ["The", "Project", "Club", "Summer", "Big", "Electric", "Golden", "Neon", "Mainstage", "Soundwave"];
  const joiners = ["&", "and"];
  const moodWords = fallbackWords[style] || fallbackWords[""];

  const pool = rawKeywords.length ? rawKeywords.map(festivalTitleCaseWord) : moodWords;
  const names = new Set();

  let guard = 0;
  while (names.size < 8 && guard < 100) {
    guard++;
    const a = pickFestivalRandom(pool);
    const b = pickFestivalRandom(moodWords);
    const noun = pickFestivalRandom(nouns);
    const prefix = pickFestivalRandom(prefixes);

    const patterns = [
      `${a} ${noun}`,
      `${prefix} ${a}`,
      `${a} ${b} Festival`,
      `${b} ${a} Live`,
      `${a} ${pickFestivalRandom(joiners)} ${b}`,
      `${a} Soundwave`,
      `${b} ${noun}`,
      `${a} Vibes`,
      `${a} on the Stage`
    ];

    names.add(pickFestivalRandom(patterns).replace(/\s+/g, " ").trim());
  }

  results.innerHTML = `
    <h3>Name ideas</h3>
    <div class="name-chip-grid">
      ${Array.from(names).map(name => `<button class="name-chip" type="button" data-name="${name.replace(/"/g, "&quot;")}">${name}</button>`).join("")}
    </div>
    <p class="muted-help">Click a name to copy it, or mix two ideas together to create your own.</p>
  `;

  results.querySelectorAll(".name-chip").forEach(button => {
    button.addEventListener("click", () => copyFestivalName(button.dataset.name));
  });
}

function copyFestivalName(name) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(name);
  }
  const results = document.getElementById("festivalNameResults");
  if (results) {
    const oldNote = results.querySelector(".copy-note");
    if (oldNote) oldNote.remove();
    const note = document.createElement("p");
    note.className = "copy-note";
    note.textContent = `"${name}" copied. You can paste it into your planning sheet.`;
    results.appendChild(note);
    setTimeout(() => note.remove(), 2200);
  }
}

function clearFestivalNames() {
  const input = document.getElementById("festivalKeywords");
  const results = document.getElementById("festivalNameResults");
  if (input) input.value = "";
  if (results) results.innerHTML = `<p class="muted-help">Generated names will appear here.</p>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.getElementById("generateFestivalNamesBtn");
  const clearButton = document.getElementById("clearFestivalNamesBtn");
  const input = document.getElementById("festivalKeywords");

  if (generateButton) generateButton.addEventListener("click", generateFestivalNames);
  if (clearButton) clearButton.addEventListener("click", clearFestivalNames);
  if (input) {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        generateFestivalNames();
      }
    });
  }
});
