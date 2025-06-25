/*
    This event triggers when the browser has committed to loading a webpage.
    As opposed to e.g. webNavigation.onCompleted, this will start to run early
    so that we can begin to remove ads as soon as possible.
*/
chrome.webNavigation.onCommitted.addListener(async function (tab) {
  // Prevents script from running when other frames load
  if (tab.frameId == 0) {
    const tabInfo = await chrome.tabs.get(tab.tabId);
    const url = tabInfo.url;
    // Remove unnecessary protocol definitions and www subdomain from the URL
    const parsedUrl = url.replace(/^https?:\/\//, "").replace("www.", "");

    // Remove path and queries e.g. linkedin.com/feed or linkedin.com?query=value
    // We only want the base domain

    const domain = parsedUrl.split(/[/?#]/)[0];

    if (domain === "linkedin.com") {
      chrome.scripting.executeScript({
        target: { tabId: tab.tabId },
        files: ["linkedin.js"],
      });
    }
  }
});
