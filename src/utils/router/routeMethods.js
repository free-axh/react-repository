let history = null;

export function saveHistory(customHistory) {
  history = customHistory;
}

export function push(path, state) {
  history.push(path, state);
}

export function replace(path, state) {
  history.replace(path, state);
}

export function goBack() {
  history.goBack();
}

export function go(n = -1) {
  history.go(n);
}