export function openMobileApp() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );

  if (!isMobile) {
    window.location.href = "/login";
    return;
  }

  const appUrl = "gymgit://app";

  // Your APK download or GitHub release URL
  const downloadUrl =
    "https://github.com/gymgit/releases/download/latest/gymgit.apk";

  let appOpened = false;

  const onVisibilityChange = () => {
    if (document.hidden) {
      appOpened = true;
    }
  };

  document.addEventListener(
    "visibilitychange",
    onVisibilityChange
  );

  // Attempt to open app
  window.location.href = appUrl;

  // If app did not open, show download
  setTimeout(() => {
    document.removeEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    if (!appOpened) {
      window.location.href = downloadUrl;
    }
  }, 1500);
}