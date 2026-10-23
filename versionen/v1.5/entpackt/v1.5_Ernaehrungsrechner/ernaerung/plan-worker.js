/* jsLPSolver off the main thread … keeps the loading bar animating. */
importScripts("solver.js");

self.onmessage = function (e) {
  try {
    if (Array.isArray(e.data && e.data.batchModels)) {
      self.postMessage({ ok: true, results: e.data.batchModels.map(model => self.solver.Solve(model)) });
      return;
    }
    self.postMessage({ ok: true, result: self.solver.Solve(e.data) });
  } catch (err) {
    self.postMessage({
      ok: false,
      error: String(err && err.message ? err.message : err),
    });
  }
};
