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
  inProgress = true;
  const t = transitionHelper({
    updateDOM: async () => {
      clearCallbacks();
      await tick();
      clearCallbacks(); // some callbacks may be queued in the middle of the transition, resolve those too
    }
  });

  t.finished.finally(() => {
    clearCallbacks();
    inProgress = false;
  });
}

// copied from Jake Archibald's explainer
// https://developer.chrome.com/docs/web-platform/view-transitions/#not-a-polyfill
function transitionHelper({
  skipTransition = false,
  classNames = [],
  updateDOM
}) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => {});

    return {
      ready: Promise.reject(Error("View transitions unsupported")),
      updateCallbackDone,
      finished: updateCallbackDone,
      skipTransition: () => {}
    };
  }

  document.documentElement.classList.add(...classNames);

  const transition = document.startViewTransition(updateDOM);

  transition.finished.finally(() =>
    document.documentElement.classList.remove(...classNames)
  );

  return transition;
}
