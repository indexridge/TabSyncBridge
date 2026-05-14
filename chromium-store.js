(function () {
  'use strict';

  var CHROME_WEB_STORE =
    'https://chromewebstore.google.com/detail/tabsyncbridge/fbhngbfbapkkhcdpijagknchlcmcfmgl';

  /**
   * When Microsoft Edge Add-ons approves the listing, set this to the store URL.
   * Until then, Edge users keep the Chrome Web Store link (installable from Edge).
   */
  var EDGE_ADDONS_URL = '';

  function brandsMentionEdge(brands) {
    if (!brands || !brands.length) {
      return false;
    }
    for (var i = 0; i < brands.length; i += 1) {
      var b = brands[i].brand || '';
      if (b.indexOf('Edge') !== -1) {
        return true;
      }
    }
    return false;
  }

  function isMicrosoftEdge() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    var ua = navigator.userAgent || '';
    if (ua.indexOf('Edg/') !== -1) {
      return true;
    }
    var ud = navigator.userAgentData;
    if (ud && ud.brands && brandsMentionEdge(ud.brands)) {
      return true;
    }
    return false;
  }

  function resolvedStoreUrl() {
    if (isMicrosoftEdge() && EDGE_ADDONS_URL) {
      return EDGE_ADDONS_URL;
    }
    return CHROME_WEB_STORE;
  }

  function resolvedLabel() {
    if (isMicrosoftEdge() && EDGE_ADDONS_URL) {
      return 'Add from Microsoft Edge Add-ons';
    }
    return 'Add the Chromium companion';
  }

  function apply() {
    var url = resolvedStoreUrl();
    var label = resolvedLabel();
    var nodes = document.querySelectorAll('a[data-chromium-store]');
    for (var i = 0; i < nodes.length; i += 1) {
      var a = nodes[i];
      a.setAttribute('href', url);
      if (a.getAttribute('data-store-dynamic-label') === '1') {
        a.textContent = label;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
