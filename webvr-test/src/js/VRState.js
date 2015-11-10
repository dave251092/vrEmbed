require('./VRIcons.js');

var Emitter = require('../js-ext/emitter.js');

/**
 * VR state machine:
 * 
 */

THREE.VRStates = {
  INACTIVE: 0,
  WINDOWED: 1,
  WINDOWED_ANAGLYPH: 2,
  FULLSCREEN: 3,
  FULLSCREEN_ANAGLYPH: 4,
  CARDBOARD: 5
};

THREE.VRStateToggler = function() {
  this.createButtons();
  this.buttonLeft.addEventListener('click', this.onClickLeft_.bind(this));
  this.buttonMiddle.addEventListener('click', this.onClickMiddle_.bind(this));
  this.buttonRight.addEventListener('click', this.onClickRight_.bind(this));

  this.buttonLeftClick.prototype = new function () {};
  this.buttonMiddleClick.prototype = new function () {};
  this.buttonRightClick.prototype = new function () {};

  this.on('clickLeft', this.buttonLeftClick.bind(this));  
  this.on('clickMiddle', this.buttonMiddleClick.bind(this));  
  this.on('clickRight', this.buttonRightClick.bind(this));  
  
  this.logoCardboard = VRLogos.logoCardboard;
  this.logoFullscreen = VRLogos.logoFullscreen;
  this.logoFullscreenAnaglyph = VRLogos.logoFullscreenAnaglyph;
  this.logoWindowed = VRLogos.logoWindowed;
  this.logoWindowedAnaglyph = VRLogos.logoWindowedAnaglyph;  
}

THREE.VRStateToggler.prototype = new Emitter();

THREE.VRStateToggler.prototype.createMiddleButton = function() {
    this.buttonMiddle = document.createElement('img');
  var s = this.buttonMiddle.style;
  s.position = 'absolute';
  s.bottom = '5px';
  s.left = 0;
  s.right = 0;
  s.marginLeft = 'auto';
  s.marginRight = 'auto';
  s.width = '56px'
  s.height = '56px';
  s.backgroundSize = 'cover';
  s.backgroundColor = 'transparent';
  s.border = 0;
  s.userSelect = 'none';
  s.webkitUserSelect = 'none';
  s.MozUserSelect = 'none';
  s.cursor = 'pointer';
  // Prevent button from being dragged.
  this.buttonMiddle.draggable = false;
  this.buttonMiddle.addEventListener('dragstart', function(e) {
    e.preventDefault();
  });
}

THREE.VRStateToggler.prototype.createLeftButton = function() {
  this.buttonLeft = document.createElement('img');
  var s = this.buttonLeft.style;
  s.position = 'absolute';
  s.bottom = '5px';
  s.left = 0;
  s.right = 5;
  s.marginLeft = 'auto';
  s.width = '56px'
  s.height = '56px';
  s.backgroundSize = 'cover';
  s.backgroundColor = 'transparent';
  s.border = 0;
  s.userSelect = 'none';
  s.webkitUserSelect = 'none';
  s.MozUserSelect = 'none';
  s.cursor = 'pointer';
  // Prevent button from being dragged.
  this.buttonLeft.draggable = false;
  this.buttonLeft.addEventListener('dragstart', function(e) {
    e.preventDefault();
  });
}

THREE.VRStateToggler.prototype.createRightButton = function() {
  this.buttonRight = document.createElement('img');
  var s = this.buttonRight.style;
  s.position = 'absolute';
  s.bottom = '5px';
  s.left = 5;
  s.right = 0;
  s.marginRight = 'auto';
  s.width = '56px'
  s.height = '56px';
  s.backgroundSize = 'cover';
  s.backgroundColor = 'transparent';
  s.border = 0;
  s.userSelect = 'none';
  s.webkitUserSelect = 'none';
  s.MozUserSelect = 'none';
  s.cursor = 'pointer';
  // Prevent button from being dragged.
  this.buttonRight.draggable = false;
  this.buttonRight.addEventListener('dragstart', function(e) {
    e.preventDefault();
  });
}

THREE.VRStateToggler.prototype.createButtons = function() {
  this.createMiddleButton();
  this.createLeftButton();
  this.createRightButton();
};

THREE.VRStateToggler.prototype.onClickLeft_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  this.emit('clickLeft');
}

THREE.VRStateToggler.prototype.onClickMiddle_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  this.emit('clickMiddle');
}

THREE.VRStateToggler.prototype.onClickRight_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  this.emit('clickRight');
}

THREE.VRStateToggler.prototype.setupButton = function(button, src, title, isVisible) {
  // Hack for Safari Mac/iOS to force relayout (svg-specific issue)
  // http://goo.gl/hjgR6r
  button.style.display = 'inline-block';
  button.offsetHeight;
  button.style.display = 'block';

  button.src = src;
  button.title = title;
  button.style.display = isVisible ? 'inline-block' : 'none';  
};

THREE.VRStateToggler.prototype.setState = function(state) {
  switch (state) {
    case THREE.VRStates.CARDBOARD:
      this.setupButton(this.buttonLeft, "", "", false);
      this.setupButton(this.buttonMiddle, this.logoWindowed, 'Windowed mode', true);
      this.setupButton(this.buttonRight, "", "", false);
      break;
    case THREE.VRStates.FULLSCREEN:
      this.setupButton(this.buttonLeft, this.logoCardboard, 'Immersive mode', true);
      this.setupButton(this.buttonMiddle, this.logoWindowed, 'Windowed mode', true);
      this.setupButton(this.buttonRight, this.logoFullscreenAnaglyph, 'Red-blue mode', true);
      break;
    case THREE.VRStates.FULLSCREEN_ANAGLYPH:
      this.setupButton(this.buttonLeft, "", "", false);
      this.setupButton(this.buttonMiddle, "", "", false);
      this.setupButton(this.buttonRight, this.logoWindowedAnaglyph, 'Windowed mode', true);
      break;
    case THREE.VRStates.WINDOWED:
      this.setupButton(this.buttonLeft, this.logoCardboard, 'Immersive mode', true);
      this.setupButton(this.buttonMiddle, this.logoFullscreen, 'Fullscreen mode', true);
      this.setupButton(this.buttonRight, this.logoWindowedAnaglyph, 'Red-blue mode', true);
      break;
    case THREE.VRStates.WINDOWED_ANAGLYPH:
      this.setupButton(this.buttonLeft,  "", "", false);
      this.setupButton(this.buttonMiddle, this.logoWindowed, 'Windowed mode', true);
      this.setupButton(this.buttonRight, this.logoFullscreenAnaglyph, 'Fullscreen mode', true);
      break;
  }
};

THREE.VRStateToggler.prototype.stateChange = function(buttonSrc) {
  switch (buttonSrc) {
    case this.logoCardboard:
      this.setState(THREE.VRStates.CARDBOARD);
      break;
    case this.logoFullscreen:
      this.setState(THREE.VRStates.FULLSCREEN);
      break;
    case this.logoFullscreenAnaglyph:
      this.setState(THREE.VRStates.FULLSCREEN_ANAGLYPH);
      break;
    case this.logoWindowed:
      this.setState(THREE.VRStates.WINDOWED);
      break;
    case this.logoWindowedAnaglyph:
      this.setState(THREE.VRStates.WINDOWED_ANAGLYPH);
  }
};


THREE.VRStateToggler.prototype.buttonLeftClick = function() {
  this.stateChange(this.buttonLeft.src);
};
THREE.VRStateToggler.prototype.buttonMiddleClick = function() {
  this.stateChange(this.buttonMiddle.src);
};
THREE.VRStateToggler.prototype.buttonRightClick = function() {
  this.stateChange(this.buttonRight.src);
};

// modules.export = THREE.VRStateToggler;


