export function save(name, value) {
  window.localStorage.setItem(name, value)
}

export function load(name) {
  return window.localStorage.getItem(name)
}
