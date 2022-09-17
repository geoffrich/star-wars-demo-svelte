import { tick } from "svelte";

let cbs = [];
let inProgress = false;

function clearCallbacks() {
  while (cbs.length > 0) {
    const cb = cbs.pop();
    cb();
  }
}

export function pageTransition(fn, shouldTransition = true) {
  // allows for easily toggling off the transition for certain state changes
  if (!shouldTransition) {
    fn();
    return;
  }
  cbs.push(fn);
  if (inProgress) {
    return;
  }
  try {
    const t = document.createDocumentTransition();
    inProgress = true;
    t.start(async () => {
      clearCallbacks();
      await tick();
      clearCallbacks(); // some callbacks may be queued in the middle of the transition, resolve those too
      inProgress = false;
    });
  } catch (e) {
    console.error(e);
    clearCallbacks();
    inProgress = false;
  }
}
