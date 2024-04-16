import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

var parsePage = function(obj, callback) {
  Object.getOwnPropertyNames(obj).forEach(function(val) {
    if(val == "String") {
      for(var i = 0; i < obj[val].length; i++) {
        callback(obj[val][i]['$'].CONTENT);
        if (i < obj[val].length-1) {
          callback(' ');
        } else {
          callback("<br />\r\n");
        }
      }
    }
    else if(typeof(obj[val]) == "object" && val != "$") {
      parsePage(obj[val], function(res) {
        callback(res);
      });
    }
  });
};

fs.readFile(path.resolve('src/ALTO/test.xml'), (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  xml2js.parseString(data, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }

    // Here you can process the parsed data according to the ALTO schema
    console.log(result);
    var page = result.alto.Layout[0].Page[0].PrintSpace;
    if (!page) {
      console.log('empty');
      return;
    }

    parsePage(page, function(text) {
      console.log(text);
    });
  });
});
