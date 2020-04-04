export const APP_UPDATE_AVAILABLE = 'APP_UPDATE_AVAILABLE';
export const APP_UPDATE_DOWNLOADED = 'APP_UPDATE_DOWNLOADED';
export const CLOSE_APP_UPDATE_NOTICE = 'CLOSE_APP_UPDATE_NOTICE';

export function appUpdateAvailable() {
  return {
    type: APP_UPDATE_AVAILABLE,
  };
}

export function appUpdateDownloaded() {
  return {
    type: APP_UPDATE_DOWNLOADED,
  };
}

export function closeAppUpdateNotice() {
  return {
    type: CLOSE_APP_UPDATE_NOTICE,
  };
}
