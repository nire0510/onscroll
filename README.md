# Orchestrator

Directs web page elements to produce a desired effect.

<!--[![Travis build status](http://img.shields.io/travis/nire0510/orchestrator.svg?style=flat)](https://travis-ci.org/nire0510/orchestrator)-->
<!--[![Code Climate](https://codeclimate.com/github/nire0510/orchestrator/badges/gpa.svg)](https://codeclimate.com/github/nire0510/orchestrator)-->
<!--[![Test Coverage](https://codeclimate.com/github/nire0510/orchestrator/badges/coverage.svg)](https://codeclimate.com/github/nire0510/orchestrator)-->
[![Dependency Status](https://david-dm.org/nire0510/orchestrator.svg)](https://david-dm.org/nire0510/orchestrator)
[![devDependency Status](https://david-dm.org/nire0510/orchestrator/dev-status.svg)](https://david-dm.org/nire0510/orchestrator#info=devDependencies)

## Introduction
Many web pages these days produce the "wow effect" by triggering transitions and animations based on scroll position.
Though it might look good, naive implementation can affect performance and lead to a bad user experience.  
With page performance in mind, Orchestrator can help you achieve this behaviour with only one command in three flavors:
basic, moderate & advance.  

## Installation:
Bower: `bower install orchestrator --save`  
npm: `npm install orchestrator --save`

## Usage:
1. Add a reference to **orchestrator** library to your web page:  
`<script src='bower_components/orchestrator/orchestrator.min.js'></script>`
2. Add one or more directives:  
 ```javascript
let directiveId = orchestrator.default.add({
  // {string} CSS3 selector or multiple comma separated selectors: 
  selector: '.first-selector, #second-selector',
    
  // {number} horizontal scroll (X axis) position in pixels from which to apply the actions
  // or
  // [{number}, {number}] horizontal scroll (X axis) min & max positions in pixels to apply the actions: 
  left: 20,
    
  // {number} vertical scroll (Y axis) position in pixels from which to apply the actions
  // or
  // [{number}, {number}] vertical scroll (Y axis) min & max positions in pixels to apply the actions: 
  top: 20,
  // one or more actions to apply:
  actions: {
    // add one or more class names:
    addClass: 'gold',
    
    // remove one or more class names:
    removeClass: ['opacity', 'double-padding'],
    
    // set inline style:
    setStyle: {
      transform: function(left, top) {
        return `translateY(${20 - top}px)`;
      },
      paddingLeft: function(left/*, top*/) {
        return `${left}px`;
      }
    },
    
    // call a function:
    callFunction: function(/*left, top*/) {
      this.revealPopup();
    }
  }
});
```
The return value is the directive auto-generated id.
If you want name it yourself, do as follows:
`orchestrator.default.add('my-directive', {/*...*/});`

### Basic
Use `addClass` and `removeClass` when you want to set or unset CSS properties with fixed values.
This is done by adding or removing class name(s) to element(s).
```javascript
orchestrator.default.add({
  selector: '.some-element',
  top: 20,
  actions: {
    // value can be either string in case of a single class name to add:
    addClass: 'gold'
    // or an array in case of multiple class names to add:
    //addClass: ['gold', 'double-spacing'],
    // to remove one or more class names, use the -removeClass- action:
    //removeClass: 'gold'
  }
});
```

### Moderate
Use `setStyle` when you want to set or unset CSS properties with **dynamic** values, based on the scroll position.
This is done by setting inline style to elements. Each property in object is a CSS property and its value is a function 
with two arguments, `left` (current horizontal scroll position) and `top` (current vertical scroll position),
which can be used for calculating the function's return value - the value of CSS property. 
```javascript
orchestrator.default.add({
  selector: '.some-element',
  top: 20,
  actions: {
    setStyle: {
      transform: function(left, top) {
        return `translateY(${20 - top}px)`;
      },
      paddingLeft: function(left/*, top*/) {
        return `${left}px`;
      }
    },
  }
});
```

### Advance
Use `callFunction` when you not necessarily want to manipulate style, but rather call an existing function,
execute JavaScript etc. The action's value is a function with two arguments,
`left` (current horizontal scroll position) and `top` (current vertical scroll position) which should not return any value.
```javascript
orchestrator.default.add({
  selector: '.some-element',
  top: 20,
  actions: {
    callFunction: function (left, top) {
      if (left > 100) {
        submitForm();          
      }
    }
  }
});
```

## More Commands
* `orchestrator.default.remove(id, id, ...)` - removes one or more directives.
* `orchestrator.default.disable(id, id, ...)` - disables one or more directives.
* `orchestrator.default.enable(id, id, ...)` - enables one or more directives.
