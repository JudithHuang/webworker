postMessage("I\'m working before postMessage(\'judith\').");

onmessage = function (oEvent) {
  console.log(oEvent.data);
  postMessage("Hi " + JSON.stringify(oEvent.data));
};

// use web worker complicated calculations

/**
(function() {
  for (var i = 0; i < 13000; i ++) {
    console.log('event loop is blocking...');
  }

  postMessage('event loop finished...');
})();
**/
