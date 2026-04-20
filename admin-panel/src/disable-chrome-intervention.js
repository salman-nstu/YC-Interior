// Disable Chrome's slow network detection
(function() {
  'use strict';
  
  // Override navigator.connection to report fast connection
  if ('connection' in navigator) {
    try {
      Object.defineProperty(navigator, 'connection', {
        get: function() {
          return {
            effectiveType: '4g',
            downlink: 10,
            rtt: 50,
            saveData: false,
            onchange: null
          };
        },
        configurable: true
      });
    } catch (e) {
      console.log('Could not override navigator.connection');
    }
  }
  
  // Override Network Information API
  if ('NetworkInformation' in window) {
    try {
      Object.defineProperty(window.NetworkInformation.prototype, 'effectiveType', {
        get: function() { return '4g'; }
      });
      Object.defineProperty(window.NetworkInformation.prototype, 'downlink', {
        get: function() { return 10; }
      });
      Object.defineProperty(window.NetworkInformation.prototype, 'rtt', {
        get: function() { return 50; }
      });
    } catch (e) {
      console.log('Could not override NetworkInformation');
    }
  }
  
  console.log('🚀 Chrome intervention disabled - reporting fast network');
})();
