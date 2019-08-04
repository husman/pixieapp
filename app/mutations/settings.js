export function updateSettings(_, { settings }, { cache }) {
  cache.writeData({ data: { ...settings } });
}
