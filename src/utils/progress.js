const KEY = 'kbd-trainer-progress'

const DEFAULT = {
  lang: 'de',
  completedLevels: [],
  stars: {},
  unlockedPlanets: ['coruscant']
}

export function getProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT }
  } catch {
    return { ...DEFAULT }
  }
}

export function saveProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function resetProgress() {
  localStorage.removeItem(KEY)
}
