define(['react', 'glamor'], function (React, glamor) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  var Test = () => React.createElement(
    "div",
    glamor.css({
      backgroundColor: 'purple',
      color: 'white'
    }),
    "other side"
  );

  return Test;

});