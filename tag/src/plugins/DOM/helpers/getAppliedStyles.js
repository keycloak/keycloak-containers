// https://github.com/MicrosoftDX/Vorlonjs/blob/master/Plugins/Vorlon/plugins/domExplorer/vorlon.domExplorer.client.ts#L19
module.exports =  function GetAppliedStyles(node) {
  // Style sheets
  var styleNode = [];
  var sheets = document.styleSheets;
  var style;
  var appliedStyles = [];
  var index;
  for (var c = 0; c < sheets.length; c++) {
    var rules = sheets[c].rules || sheets[c].cssRules;
    if (!rules) {
      continue;
    }
    for (var r = 0; r < rules.length; r++) {
      var rule = rules[r];
      var selectorText = rule.selectorText;
      try {
        var matchedElts = document.querySelectorAll(selectorText);
        for (index = 0; index < matchedElts.length; index++) {
          var element = matchedElts[index];
          style = rule.style;
          if (element === node) {
            for (var i = 0; i < style.length; i++) {
              if (appliedStyles.indexOf(style[i]) === -1) {
                appliedStyles.push(style[i]);
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  // Local style
  style = node.style;
  if (style) {
    for (index = 0; index < style.length; index++) {
      if (appliedStyles.indexOf(style[index]) === -1) {
        appliedStyles.push(style[index]);
      }
    }
  }

  // Get effective styles
  var winObject = document.defaultView || window;
  for (index = 0; index < appliedStyles.length; index++) {
    var appliedStyle = appliedStyles[index];
    if (winObject.getComputedStyle) {
      styleNode.push(appliedStyle + ":" + winObject.getComputedStyle(node, "").getPropertyValue(appliedStyle));
    }
  }
  return styleNode;
};
