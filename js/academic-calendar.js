// KL University academic calendar 2026-27 — B.Tech III & IV year (College of Engineering).
// Transcribed from the official PDF (colour key: grey = holiday, blue = SEM-IN, red = lab / sem-end exams,
// yellow = orientation & immersion weeks, orange = key dates).
// A copy lives in the backend (lib/academic-calendar.js) for the admin summaries — change both together.
export const SOURCE = "https://www.kluniversity.in/site/pdfs/Academic-calendars//College-of-Engineering/2026-27//COLLEGE%20OF%20ENGINEERING/Academic%20Calendar%202026-27%20III%20and%20IV%20Year%20UG%20Engineering%20Programs.pdf";

export const KINDS = {
  holiday: { label: "Holiday", color: "#8a8594" },
  sem_end: { label: "Sem-end exams", color: "#d9485f" },
  sem_in: { label: "SEM-IN exams", color: "#4f6bd8" },
  lab: { label: "Lab in-sem exams", color: "#e0779a" },
  event: { label: "Immersion week", color: "#d4b106" },
  orientation: { label: "Orientation", color: "#e6c200" },
  internship: { label: "Internship", color: "#b8a24a" },
  key: { label: "Key date", color: "#e6892e" },
};
const PRIORITY = Object.keys(KINDS); // order above = which colour wins when events overlap
const NO_CLASS = new Set(["holiday", "sem_end", "sem_in", "lab", "event"]);
const EXAMS = new Set(["sem_end", "sem_in", "lab"]);

const T = (id, year, sem, name, start, classStart, lastClass, end, events) => ({
  id, year, sem, name, start, classStart, lastClass, end,
  events: events.map(([s, e, kind, label]) => ({ start: s, end: e || s, kind, label })),
});

export const TERMS = [
  T("odd", "2026-27", "Odd Sem", "2026-27 Odd Semester", "2026-06-29", "2026-07-17", "2026-11-12", "2026-11-29", [
    ["2026-06-29", "2026-07-04", "orientation", "Odd Sem orientation & registrations"],
    ["2026-07-17", 0, "key", "Commencement of classwork"],
    ["2026-09-07", "2026-09-12", "sem_in", "SEM-IN-1 exams"],
    ["2026-09-17", 0, "key", "Last date to request re-check for SEM-IN-1"],
    ["2026-10-12", "2026-10-17", "lab", "Lab in-sem exams"],
    ["2026-10-19", "2026-10-24", "holiday", "Holidays"],
    ["2026-10-30", "2026-10-31", "event", "Techno-Management Immersion Week"],
    ["2026-10-31", 0, "key", "Last date to pay end-exam fee"],
    ["2026-11-09", "2026-11-14", "sem_in", "SEM-IN-2 exams"],
    ["2026-11-12", 0, "key", "Last instruction day"],
    ["2026-11-13", 0, "key", "Declaration of detention list"],
    ["2026-11-16", "2026-11-29", "sem_end", "SEM-end theory & lab exams"],
  ]),
  T("even", "2026-27", "Even Sem", "2026-27 Even Semester", "2026-11-30", "2026-12-22", "2027-04-14", "2027-05-02", [
    ["2026-11-30", "2026-12-05", "orientation", "Even Sem orientation & registrations"],
    ["2026-12-22", 0, "key", "Commencement of classwork"],
    ["2027-01-11", "2027-01-16", "holiday", "Holidays"],
    ["2027-02-08", "2027-02-13", "sem_in", "SEM-IN-1 exams"],
    ["2027-02-18", 0, "key", "Last date to request re-check for SEM-IN-1"],
    ["2027-03-12", "2027-03-13", "event", "Cultural Immersion Week"],
    ["2027-03-15", "2027-03-20", "lab", "Lab in-sem exams"],
    ["2027-04-03", 0, "key", "Last date to pay end-exam fee"],
    ["2027-04-12", "2027-04-17", "sem_in", "SEM-IN-2 exams"],
    ["2027-04-14", 0, "key", "Last instruction day"],
    ["2027-04-15", 0, "key", "Declaration of detention list"],
    ["2027-04-19", "2027-05-02", "sem_end", "SEM-end theory & lab exams"],
  ]),
  T("summer", "2026-27", "Summer Term", "2026-27 Summer Term", "2027-05-03", "2027-05-31", "2027-07-03", "2027-07-13", [
    ["2027-05-03", "2027-05-29", "internship", "4-week summer technical internship"],
    ["2027-05-03", "2027-06-26", "internship", "8-week summer technical internship"],
    ["2027-05-28", "2027-05-29", "orientation", "Summer term orientation & registrations"],
    ["2027-05-31", 0, "key", "Commencement of summer term classwork"],
    ["2027-06-14", "2027-06-15", "sem_in", "SEM-IN-1 exams"],
    ["2027-06-18", "2027-06-19", "lab", "Lab in-sem exams"],
    ["2027-06-28", "2027-07-03", "orientation", "2027-28 Odd Semester registrations"],
    ["2027-07-03", 0, "key", "Summer term last instruction day"],
    ["2027-07-05", "2027-07-06", "sem_in", "SEM-IN-2 exams"],
    ["2027-07-08", "2027-07-10", "sem_end", "SEM-end theory & lab exams"],
    ["2027-07-13", 0, "key", "2027-28 academic year commencement"],
  ]),
];
const BAKED = TERMS.flatMap((t) => t.events);
// Admin-added overlay (holidays / events) loaded at runtime from the backend via setExtraEvents().
let EXTRA = [];
/** Replace the admin overlay. Each item: { start, end?, kind, label, id? }. */
export function setExtraEvents(list) {
  EXTRA = (Array.isArray(list) ? list : []).map((e) => ({
    start: e.start, end: e.end || e.start, kind: e.kind, label: e.label, id: e.id, admin: true,
  })).filter((e) => e.start && e.end && KINDS[e.kind] && e.label);
}
export const extraEvents = () => EXTRA;
const ALL = () => [...BAKED, ...EXTRA];
/** A term's events (baked + any admin events overlapping its span), for display. */
export const termEvents = (t) => [...t.events, ...EXTRA.filter((e) => e.start <= t.end && e.end >= t.start)];

// ---- dates are "YYYY-MM-DD" strings (compare as strings, do maths in UTC) ----
const D = (k) => new Date(k + "T00:00:00Z");
export const addDays = (k, n) => new Date(D(k).getTime() + n * 864e5).toISOString().slice(0, 10);
export const dow = (k) => D(k).getUTCDay(); // 0 = Sunday
export const daysBetween = (a, b) => Math.round((D(b) - D(a)) / 864e5);
export const todayKey = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
export function* range(a, b) { for (let k = a; k <= b; k = addDays(k, 1)) yield k; }

export const termById = (id) => TERMS.find((t) => t.id === id) || null;
/** The ERP's ("2026-2027", "Odd Sem") → a term, or null if this calendar doesn't cover it. */
export function termFor(year = "", sem = "") {
  const y = String(year).match(/\d{4}/)?.[0];
  return TERMS.find((t) => y && t.year.startsWith(y) && t.sem.toLowerCase() === String(sem).trim().toLowerCase()) || null;
}
/** The term whose span contains `k`, else the next one, else the last. */
export const termOn = (k) => TERMS.find((t) => k <= t.end) || TERMS.at(-1);

export const eventsOn = (k) => ALL().filter((e) => e.start <= k && k <= e.end);
/** Most important kind on a day (for colouring), or "" if nothing is scheduled. */
export const kindOn = (k) => eventsOn(k).map((e) => e.kind).sort((a, b) => PRIORITY.indexOf(a) - PRIORITY.indexOf(b))[0] || "";
/** A regular class day: inside the classwork window, not Sunday, not a holiday/exam/immersion day. */
export const isClassDay = (t, k) => k >= t.classStart && k <= t.lastClass && dow(k) !== 0 && !eventsOn(k).some((e) => NO_CLASS.has(e.kind));
export const isHoliday = (k) => dow(k) === 0 || eventsOn(k).some((e) => e.kind === "holiday");
export const isExam = (k) => eventsOn(k).some((e) => EXAMS.has(e.kind));

/** Day counts for a term (or for a sub-range of it, e.g. one month) as of `today`. */
export function termStats(t, today = todayKey(), from = t.start, to = t.end) {
  const s = { classDays: 0, done: 0, left: 0, holidays: 0, sundays: 0, examDays: 0 };
  for (const k of range(from, to)) {
    if (isClassDay(t, k)) { s.classDays++; k <= today ? s.done++ : s.left++; }
    if (dow(k) === 0) { s.sundays++; continue; }
    if (eventsOn(k).some((e) => e.kind === "holiday")) s.holidays++;
    if (isExam(k)) s.examDays++;
  }
  s.progress = s.classDays ? s.done / s.classDays : 0;
  s.upcoming = termEvents(t).filter((e) => e.end >= today).sort((a, b) => (a.start < b.start ? -1 : 1))
    .map((e) => ({ ...e, inDays: daysBetween(today, e.start) }));
  return s;
}

// A (weekday, hour) slot counts as a regular weekly class once it has been held on at least
// this fraction of that weekday's class days — filters out one-off / rescheduled extra hours.
const SLOT_THRESH = 0.4;

/**
 * Reconstruct each course's weekly timetable from its attendance register (the realized schedule),
 * using class days from `t.classStart` up to `asOf`. Returns per course a list of regular slots
 * { w: weekday 0-6, h: ERP hour, held, of, ratio }, sorted by weekday then hour.
 */
export function slotsOf(t, courses, asOf) {
  const wdDays = Array(7).fill(0);
  for (const k of range(t.classStart, asOf)) if (isClassDay(t, k)) wdDays[dow(k)]++;
  return courses.map((c) => {
    const cnt = {};
    for (const [k, h] of c.s) if (k >= t.classStart && k <= asOf && isClassDay(t, k)) cnt[`${dow(k)}-${h}`] = (cnt[`${dow(k)}-${h}`] || 0) + 1;
    return Object.entries(cnt).map(([key, held]) => {
      const [w, h] = key.split("-").map(Number);
      return { w, h, held, of: wdDays[w], ratio: wdDays[w] ? held / wdDays[w] : 0 };
    }).filter((s) => s.ratio >= SLOT_THRESH).sort((a, b) => a.w - b.w || a.h - b.h);
  });
}

/**
 * How many more classes each course will hold this term, from its weekly timetable:
 * each regular slot contributes (its hold-rate) × (class days on that weekday still ahead),
 * so realistic cancellations are already discounted. `asOf` = last date the register covers.
 */
export function project(t, courses, asOf) {
  const ahead = Array(7).fill(0);
  for (const k of range(addDays(asOf, 1), t.lastClass)) if (isClassDay(t, k)) ahead[dow(k)]++;
  const slots = slotsOf(t, courses, asOf);
  return {
    left: ahead.reduce((a, b) => a + b, 0),
    slots,
    rem: slots.map((ss) => Math.round(ss.reduce((sum, s) => sum + s.ratio * ahead[s.w], 0))),
  };
}

/**
 * A weekly timetable grid for display: rows = ERP hours actually used, columns = Mon..Sat.
 * Returns { hours: [h…], cell(h, weekday) → [{ i, code, ltps, sec }] }. `asOf` defaults to the last logged day.
 */
export function timetable(t, courses, asOf = lastLogged(courses)) {
  const slots = slotsOf(t, courses, asOf || addDays(t.classStart, -1));
  const hours = new Set(), grid = {};
  slots.forEach((ss, i) => ss.forEach((s) => {
    hours.add(s.h);
    (grid[`${s.h}-${s.w}`] ||= []).push({ i, code: courses[i].code, ltps: courses[i].ltps, sec: courses[i].sec });
  }));
  return { hours: [...hours].sort((a, b) => a - b), cell: (h, w) => grid[`${h}-${w}`] || [] };
}

/** With `rem` classes left and target fraction `t`: best reachable %, and how many of `rem` can still be missed (<0 = target out of reach). */
export function plan(ta, tc, rem, t) {
  const best = tc + rem ? ((ta + rem) / (tc + rem)) * 100 : 0;
  const skip = Math.floor(ta + rem - t * (tc + rem) + 1e-9);
  return { best, skip: Math.min(skip, rem) };
}

export const lastLogged = (d) => d.flatMap((c) => c.s.map((s) => s[0])).sort().at(-1) || null;

/** What the admin page stores per student: counts only, no register, no password. */
export function summarize(id, { meta, d }) {
  const t = termFor(meta.year, meta.sem), asOf = lastLogged(d);
  const p = t ? project(t, d, asOf || addDays(t.classStart, -1)) : null;
  return {
    id, year: meta.year, sem: meta.sem, term: t?.id || null, at: new Date().toISOString(), asOf, left: p ? p.left : null,
    courses: d.map((c, i) => ({ code: c.code, name: c.name, ltps: c.ltps, sec: c.sec, tc: c.tc, ta: c.ta, rem: p ? p.rem[i] : 0 })),
  };
}
