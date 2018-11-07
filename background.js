
const chromep = new ChromePromise();

//Option onChange Listener
chrome.storage.onChanged.addListener(() => {
  chromep.contextMenus.removeAll().then(initContextMenus);
});
//create ContextMenus
function initContextMenus() {
  chromep.storage.sync.get("allData")
  .then(function (storeData) {
    if (!!storeData && !!storeData.allData) {
      storeData.allData.forEach(function (data) {
        chrome.contextMenus.create({
          "title": data.name + "%s",
          "contexts": ["all"],
          "onclick": (info) => {
            chrome.tabs.create({
              url: data.target.replace("%s", info.selectionText)
            })
          }
        });
      })
    }
    chrome.contextMenus.create({
      "title": "設定頁",
      "contexts": ["all"],
      "onclick": () => {
        chrome.tabs.create({ url: "options.html" });
      }
    });
  });
}

//initSetting
document.addEventListener('DOMContentLoaded', initContextMenus);

