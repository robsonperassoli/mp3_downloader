function getApiUrl() {
  const { hostname } = window.location
  return `http://${hostname}:8000`
}

export function getDownloadUrl(filename) {
  return `${getApiUrl()}/${filename}`
}
