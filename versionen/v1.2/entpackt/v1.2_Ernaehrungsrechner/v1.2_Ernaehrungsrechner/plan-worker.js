/* jsLPSolver off the main thread … keeps the loading bar animating. */
importScripts("solver.js");

self.onmessage = function (e) {
  try {
    self.postMessage({ ok: true, result: self.solver.Solve(e.data) });
  } catch (err) {
    self.postMessage({
      ok: false,
      error: String(err && err.message ? err.message : err),
    });
  }
};
