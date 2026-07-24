// ============================================================
// Variables — reusable {token} interpolation for story text.
// Today it's just {nickname}, but new tokens (title, department,
// affinity levels, ...) can be added later without touching every
// call site that renders text.
// ============================================================

const vars = {
  nickname: "主管",
};

export function setVar(key, value) {
  vars[key] = value;
}

export function getVar(key) {
  return vars[key];
}

export function interpolate(text) {
  if (typeof text !== "string") return text;
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));
}
