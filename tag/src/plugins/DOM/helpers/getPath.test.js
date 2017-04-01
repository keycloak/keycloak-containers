const jsdom = require('jsdom');
const fs = require('fs');
const path = require('path');
const t = require('chai').assert;

// @fixme require getPath from babel (without flow type annotations)

describe('getPath', () => {
  // Count all of the links from the io.js build page
  it('should yield a valid css selector', (f) => {
    var getPath = fs.readFileSync(path.resolve(__dirname, "./getPath.js"), "utf-8");
    var virtualConsole = jsdom.createVirtualConsole().sendTo(console);
    jsdom.env({
      url: "http://www.nytimes.com/",
      src: [getPath],
      virtualConsole:virtualConsole,
      done: function(err, window) {
        var element = window.document.querySelectorAll('.section-heading')[40];
        var selector = window.getSelector(element);
        var foundEls = window.document.querySelectorAll(selector);

        t.strictEqual(foundEls.length, 1);
        t.strictEqual(foundEls[0], element);

        f();
      }
    });
  });
});
