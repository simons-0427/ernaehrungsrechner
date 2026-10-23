/* PFAS-4 lower-bound planning estimates. See Daten/PFAS-4-Methodik.md. */
(function (root) {
  "use strict";
  const KEYS = ["PFOS (ng)", "PFOA (ng)", "PFNA (ng)", "PFHxS (ng)"];
  const SUM = "PFAS-4 (ng)";
  // EFSA 2020 lower-bound means in µg/kg wet food, with BfR sums split into
  // modelled components for grain, mushrooms, algae, boar and deer. The
  // generic processed-food proxy is also a model assumption. See method note.
  const V = {
    vegetable: [0.003, 0.006, 0.001, 0],
    mushroom: [0.282, 0.564, 0.094, 0],
    algae: [0.162, 0.324, 0.054, 0],
    fruit: [0.027, 0.009, 0.011, 0.022],
    grain: [0.045, 0.014, 0.004, 0.007],
    processed: [0.02, 0.01, 0.003, 0.002],
    livestock: [0.028, 0.028, 0, 0],
    poultry: [0.009, 0.002, 0, 0],
    game: [0.94, 0.38, 0, 0.015],
    wildboar: [23.78, 9.61, 0, 0.38],
    deer: [0.021, 0.009, 0, 0],
    offal: [0.87, 0.092, 0.087, 0.014],
    gameOffal: [214, 5.48, 9.77, 0.01],
    dairy: [0.001, 0.001, 0, 0],
    milk: [0.001, 0, 0, 0],
    egg: [0.27, 0.106, 0, 0],
    oil: [0.004, 0.002, 0, 0],
    water: [0.0001, 0.001, 0, 0.002],
    alcohol: [0, 0.01, 0, 0.006],
    fish: [0.47, 0.012, 0.016, 0],
    herring: [0.32, 0.016, 0.023, 0],
    sardine: [4.73, 0.101, 0.084, 0.014],
    anchovy: [0.58, 0.044, 0, 0],
    salmon: [0.31, 0.13, 0.003, 0],
    mackerel: [0.36, 0.31, 0.004, 0.001],
    tuna: [0.16, 0, 0, 0],
    cod: [0.47, 0.012, 0.016, 0],
    halibut: [0.26, 0.003, 0, 0.002],
    carp: [14.12, 4.1, 0.84, 0.066],
    eel: [9.23, 0.071, 0.98, 0.017],
    mussel: [0.08, 0, 0, 0],
  };
  function category(food) {
    const n = String(food.name || "").toLocaleLowerCase("de");
    const c = food.category;
    if (c === "supplements" && (food.unit === "stk" || food.unit === "tr")) return "supplementPiece";
    if (/lebertran/.test(n)) return "fish";
    if (c === "fisch") {
      if (/(^|\W)aal(\W|$)|\beel\b/.test(n)) return "eel";
      if (/karpfen/.test(n)) return "carp";
      if (/sardin|sprott/.test(n)) return "sardine";
      if (/sardell|anchov/.test(n)) return "anchovy";
      if (/kabeljau|dorsch|seelachs|pollack|köhler|schellfisch|wittling/.test(n)) return "cod";
      if (/lachs|forelle|saibling/.test(n)) return "salmon";
      if (/hering|matjes|kippers/.test(n)) return "herring";
      if (/makrele|stöcker/.test(n)) return "mackerel";
      if (/thun|pelamide|bonito/.test(n)) return "tuna";
      if (/heilbutt/.test(n)) return "halibut";
      if (/muschel/.test(n)) return "mussel";
      return "fish";
    }
    if (c === "eier" || /^(ei,|eigelb|eiklar|hühnerei|wachtelei|entenei|putenei|rührei|omelett)/.test(n)) return "egg";
    if (c === "fleisch") {
      const game = /wildschwein|hirsch|reh\b|rentier|wildbraten/.test(n);
      const offal = /leber|niere|herz|innereien|milz|bries|hirn|zunge|magen|kutteln/.test(n);
      if (game && offal) return "gameOffal";
      if (offal) return "offal";
      if (/wildschwein/.test(n)) return "wildboar";
      if (/hirsch|reh\b/.test(n)) return "deer";
      if (game) return "game";
      if (/hähn|hühn|pute|puten|truthahn|ente|gans|geflügel|perlhuhn|taube|wachtel|fasan/.test(n)) return "poultry";
      return "livestock";
    }
    if (c === "getraenke") {
      if (/wasser|nearwater|aqua plus/.test(n)) return "water";
      if (/bier|wein|likör|gin|rum|sherry|wermut|madeira|glühwein|cocktail|alkohol/.test(n)) return "alcohol";
      if (/milch|joghurt|kefir|kakao/.test(n)) return "dairy";
      if (/saft|nektar|smoothie/.test(n)) return "fruit";
      return "water";
    }
    if (/honigmelone|cantaloupe/.test(n)) return "fruit";
    if (/champignon|pfifferling|steinpilz|pilze?\b|shiitake|austernseitling/.test(n)) return "mushroom";
    if (/alge|spirulina|chlorella|nori|wakame|kombu/.test(n)) return "algae";
    if (/tomaten, getrocknet/.test(n)) return "vegetable";
    if (/haferflocken/.test(n)) return "grain";
    if (c === "milch") return /drink|hafermilch|sojamilch/.test(n) ? "grain" : "dairy";
    if (c === "obst") return "fruit";
    if (c === "gemuese" || c === "huelsenfruechte") return "vegetable";
    if (c === "getreide") return "grain";
    if (c === "oele_fette") return "oil";
    if (c === "nuesse_samen") return "vegetable";
    if (c === "verarbeitet") {
      if (/nuss|mandel|erdnuss|pekann|walnuss|haselnuss|paranuss/.test(n)) return "vegetable";
      if (/cornflakes|müsli|brot|teig|nudel|reis/.test(n)) return "grain";
    }
    if (c === "suessung" && /zucker|sirup|honig|süßstoff/.test(n)) return "processed";
    return "processed";
  }
  function estimate(food) {
    const group = category(food);
    const vector = V[group] || V.processed;
    // µg/kg -> ng/100 g or 100 ml (density approximated as 1 kg/l).
    // A tablet/drop has no measured PFAS data; the LB proxy is zero.
    const factor = group === "supplementPiece" ? 0 : 100;
    const out = {};
    KEYS.forEach((key, i) => { out[key] = Math.round(vector[i] * factor * 1000) / 1000; });
    out[SUM] = Math.round(KEYS.reduce((s, key) => s + out[key], 0) * 1000) / 1000;
    return out;
  }
  function sync(nutrients, food) {
    const fallback = estimate(food);
    for (const key of KEYS) {
      const value = nutrients[key];
      if (value == null || value === "" || !Number.isFinite(+value) || +value < 0) nutrients[key] = fallback[key];
      else nutrients[key] = +value;
    }
    nutrients[SUM] = Math.round(KEYS.reduce((s, key) => s + nutrients[key], 0) * 1000000) / 1000000;
    return nutrients;
  }
  const api = { KEYS, SUM, category, estimate, sync };
  root.PFAS4 = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
