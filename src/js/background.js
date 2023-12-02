const cookieNamePart = 'NSC';
const url = 'https://vdi.vtb.ru';


if (chrome.action) {
  chrome.action.onClicked.addListener(async (tab) => {
    const cookies = await getCookies(tab.id);
    cookies.forEach(c => removeCookie(c));
    chrome.tabs.create({url});
  });
}

function getCookies(tabId) {
  return new Promise((resolve, reject) => {
    let storeId;
    // first get the current tab.id
    try {
      // get the cookieStore.id using tab.id
      chrome.cookies.getAllCookieStores(function (a) {
        for (let i = 0; i < a.length; i++) {
          if (a[i].tabIds.includes(tabId)) {
            storeId = a[i].id;
            break;
          }
        }
        // now get cookies from this cookieStore
        chrome.cookies.getAll({ 'storeId': storeId }, function (cookies) {
          const domainCookies = cookies.filter(c => c.name.startsWith(cookieNamePart));
          //console.log('cookies', domainCookies);
          resolve(domainCookies);
        });
      })
    } catch (e) {
      console.error(e);
    }
  });
}


function removeCookie(cookie) {
  const url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
  chrome.cookies.remove({
    url: url,
    name: cookie.name,
    storeId: cookie.storeId
  }, function (details) {
  });
}