# Onscroll

Makes your web page dance on scroll

<!--[![Travis build status](http://img.shields.io/travis/nire0510/onscroll.svg?style=flat)](https://travis-ci.org/nire0510/onscroll)-->
<!--[![Code Climate](https://codeclimate.com/github/nire0510/onscroll/badges/gpa.svg)](https://codeclimate.com/github/nire0510/onscroll)-->
<!--[![Test Coverage](https://codeclimate.com/github/nire0510/onscroll/badges/coverage.svg)](https://codeclimate.com/github/nire0510/onscroll)-->
[![Dependency Status](https://david-dm.org/nire0510/onscroll.svg)](https://david-dm.org/nire0510/onscroll)
[![devDependency Status](https://david-dm.org/nire0510/onscroll/dev-status.svg)](https://david-dm.org/nire0510/onscroll#info=devDependencies)

## Introduction
Many web pages these days produce the "wow effect" by triggering transitions and animations based on scroll position.
Though it might look good, it may require massive coding, plus - naive implementation can affect performance and lead to a bad user experience.  
With page performance in mind, Onscroll can help you achieve this behaviour with a single command.

## Installation:
Bower: `bower install onscroll --save`  
<!--npm: `npm install onscroll --save`-->

## Usage:
1. Add a reference to **Onscroll** library to your web page:  
`<script src='bower_components/onscroll/dist/onscroll.min.js'></script>`
2. Create a new Onscroll instance:  
 ```javascript
let obj = new Onscroll({
  // {string} CSS3 selector or multiple comma separated selectors: 
  selector: '.first-selector, #second-selector',
    
  // {number} horizontal scroll (X axis) position in pixels from which to apply the actions
  // or
  // {from: {number}, to: {number}} horizontal scroll (X axis) min & max positions in pixels to apply the actions: 
  left: 20,
  //left: {
  //  from: 20,
  //  to: 100
  //},
  
  // {number} vertical scroll (Y axis) position in pixels from which to apply the actions
  // or
  // {from: {number}, to: {number}} vertical scroll (Y axis) min & max positions in pixels to apply the actions: 
  top: 20,
  //top: {
  //  from: 20,
  //  to: 100
  //},
  
  // {string} limit manipulation to specific scrolling direction (north, south, west, east)
  // or
  // [{string}] multiple directions with OR relation between
  direction: 'south',
  //direction: ['south-west', 'west'],

  // add one or more class names:
  addClass: 'gold',
  //addClass: ['yellow', 'bold'],
    
  // remove one or more class names:
  removeClass: 'center',
  //removeClass: ['opacity', 'double-padding'],
    
  // set inline style:
  setStyle: {
    transform: function(position/*, direction*/) {
      return `translateY(${20 - position.top}px)`;
    },
    paddingLeft: function(left/*, top*/) {
      return `${left}px`;
    }
  },
    
  // call a function:
  callFunction: function(/*position, direction*/) {
    this.revealPopup();
  }
});
```

### Basic
Use `addClass` and `removeClass` when you want to set or unset CSS properties with fixed values.
This is done by adding or removing class name(s) to element(s).
```javascript
new Onscroll({
  selector: '.some-element',
  top: 20,
  // value can be either string in case of a single class name to add:
  addClass: 'gold'
  // or an array in case of multiple class names to add:
  //addClass: ['gold', 'double-spacing'],
  // to remove one or more class names, use the -removeClass- action:
  //removeClass: 'gold'
});
```

### Moderate
Use `setStyle` when you want to set or unset CSS properties with **dynamic** values, based on the scroll position.
This is done by setting inline style to elements. Each property in object is a CSS property and its value is a function 
with two arguments, `position` (object which contains current horizontal (left) and vertical (top) scroll position)
and `direction` (object which contains scroll direction), which can be used for calculating the function's return value - the value of CSS property. 
```javascript
new Onscroll({
  selector: '.some-element',
  top: 20,
  setStyle: {
    transform: function(position/*, direction*/) {
      return `translateY(${20 - position.top}px)`;
    },
    paddingLeft: function(position/*, direction*/) {
      return `${position.left}px`;
    }
  }
});
```

### Advance
Use `callFunction` when you not necessarily want to manipulate style, but rather call an existing function,
execute JavaScript etc. The action's value is a function with two arguments,
`position` (object which contains current horizontal (left) and vertical (top) scroll position) and
`direction` (object which contains scroll direction). Function should not return any value.
```javascript
new Onscroll({
  selector: '.some-element',
  top: 20,
  callFunction: function (position, direction) {
    if (left > 100 && direction.north === true) {
      submitForm();          
    }
  }
});
```

## More Commands
* `obj.disable()` - disables instance.
* `obj.enable()` - enables instance.
