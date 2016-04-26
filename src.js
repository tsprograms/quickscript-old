/*
This file created 4/17/16 by TSPrograms.
Copyright © 2016 TSPrograms.
*/

// Everything is in an anonymous function to prevent global scope corruption
(function() {
  // canBeOperator returns whether a string is a valid operator name
  var canBeOperator = function(str) {
    // A string can be an operator if it does not contain alphanumeric characters or whitespace
    return !(/[a-z0-9_"'\s]/i).test(str + '');
  };
  
  // tokenize takes a code string and returns an array of "tokens" (not hierarchical yet)
  var tokenize = function(code) {
    code += ''; // Make code a string if it isn't already
    
    var regex = /((#+)[\s\S]+?\2)|(("|').*?[^\\]\4)/g;
    
    code = code.replace(regex, function(m, c1, c2, c3, c4) {
      return (!c4) ? '' : m;
    }); // Remove all comments from the code
    
    var tokenized = [''];
    var index = 0;
    var char;
    var type = 'space'; // The type is what kind of token is being made -
    // type can be space, operator, string, or name
    var start; // For strings, the character that started the token
    for (var i = 0; i < code.length; ++i) {
      char = code.charAt(i); // Store the character since it will be used multiple times
      
      switch (type) {
        case 'space':
          if (!(/\s/).test(char)) { // If there is whitespace, nothing is done (it is ignored)
            ++index;
            tokenized[index] = char;
            if (char === '"' || char === "'") { // If the next character is a quote, switch to string
              type = 'string';
              start = char;
            }
            else if (canBeOperator(char)) { // If there was space and now there is an operator, switch type to operator
              type = 'operator';
            }
            else { // If it's not whitespace, a quote, or an operator, it must be part of a name
              type = 'name';
            }
          }
          else { // If the next char is whitespace, continue appending to current index
            tokenized[index] += char;
          }
          break;
        case 'operator':
          if (canBeOperator(char)) {
            tokenized[index] += char;
          }
          else {
            // Switch type if character cannot be operator
            ++index;
            tokenized[index] = char;
            if ((/\s/).test(char)) {
              type = 'space';
            }
            else if (char === '"' || char === "'") {
              type = 'string';
              start = char;
            }
            else {
              type = 'name';
            }
          }
          break;
        case 'string':
          tokenized[i] += char;
          if (char === start && code.charAt(i - 1) !== '\\') {
            // If the character is equal to the start quote and it's not escaped, end the string
            ++index;
            tokenized[index] = '';
            type = 'space';
          }
          break;
        case 'name':
          if ((/\s/).test(char)) {
            type = 'space';
            ++index;
            tokenized[index] = char;
          }
          else if (char === '"' || char === "'") {
            type = 'string';
            start = char;
            ++index;
            tokenized[index] = char;
          }
          else if (canBeOperator(char)) {
            type = 'operator';
            ++index;
            tokenized[index] = char;
          }
          else {
            // It must be a name
            tokenized[index] += char;
          }
          break;
        default:
          // This should never occur
          throw 'QuickScript: ParseError: Unknown token type "' + type + '"';
      }
    }
    return tokenized;
  };
  
  // run takes a code string and (TODO) returns the result of executing it
  var run = function(code) {
    return tokenize(code);
  };
  
  // Export the run function as window.QuickScript.runCode
  window.QuickScript = {
    runCode: function() {
      return run.apply({}, arguments);
    }
  };
})();
