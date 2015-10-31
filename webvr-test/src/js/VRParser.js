
var container = document.getElementById( 'vrcanvas' );


var containerWidth = container.clientWidth;
var containerHeight = container.clientHeight;

alert(containerWidth +","+ containerHeight);
//Setup three.js WebGL renderer
// var renderer = new THREE.WebGLRenderer({ antialias: true });
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( containerWidth, containerHeight );

// Append the canvas element created by the renderer to document body element.
// document.body.appendChild(renderer.domElement);
container.appendChild( renderer.domElement );

// Create a three.js scene.
var scene = new THREE.Scene();

// Create a three.js camera.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);

// Apply VR stereo rendering to renderer.
var effect = new THREE.VRViewerEffect(renderer, 0);
// effect.setSize(window.innerWidth, window.innerHeight);
effect.setSize(containerWidth, containerHeight);

var textureDescription = new TextureDescription();

// textureDescription.textureSource = "left01.jpg";
// textureDescription.metaSource = "";
// textureDescription.isStereo = false;
// textureDescription.sphereFOV = new THREE.Vector2(360, 180);
// // in degrees
// textureDescription.sphereCentre = new THREE.Vector2(0.0, 0.0);
// textureDescription.U = new THREE.Vector2(0.0, 0.0);
// textureDescription.V = new THREE.Vector2(1.0, 1.0);
// textureDescription.U = new THREE.Vector2(0.0, 0.0);
// textureDescription.V = new THREE.Vector2(1.0, 1.0);

// textureDescription.textureSource = "stereograph_c.jpg";
// textureDescription.metaSource = "";
// textureDescription.isStereo = true;
// textureDescription.sphereFOV = new THREE.Vector2(90, 90);
// // in degrees
// textureDescription.sphereCentre = new THREE.Vector2(0.0, 0.0);
// textureDescription.U_l = new THREE.Vector2(0.0, 0.0);
// textureDescription.V_l = new THREE.Vector2(0.5, 1.0);
// textureDescription.U_r = new THREE.Vector2(0.5, 0.0);
// textureDescription.U_r = new THREE.Vector2(1.0, 1.0);

textureDescription.textureSource = "stereograph_a.jpg";
textureDescription.metaSource = "https://www.flickr.com/photos/127906254@N06/17787986691/";
textureDescription.isStereo = true;
textureDescription.sphereFOV = new THREE.Vector2(90, 90);
// in degrees
textureDescription.sphereCentre = new THREE.Vector2(0.0, 0.0);
textureDescription.U_l = new THREE.Vector2(0.0, 0.0);
textureDescription.V_l = new THREE.Vector2(0.493, 1.0);
textureDescription.U_r = new THREE.Vector2(0.497, 0.0);
textureDescription.V_r = new THREE.Vector2(0.990, 1.0);

// textureDescription.textureSource = "stereograph_b.jpg";
// textureDescription.metaSource = "https://www.flickr.com/photos/library_of_congress/3253742804/";
// textureDescription.isStereo = true;
// textureDescription.leftTopLeft = new THREE.Vector2(0.0, 0.0);
// textureDescription.leftBottomRight = new THREE.Vector2(1.0, 1.0);
// textureDescription.rightTopLeft = new THREE.Vector2(0.0, 0.0);
// textureDescription.rightBottomRight = new THREE.Vector2(1.0, 1.0);

effect.setStereographicProjection(textureDescription);

// Create a VR manager helper to enter and exit VR mode.
var manager = new WebVRManager(renderer, effect, {hideButton: false});

//----------

/*
var boxgeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
var boxmat = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(boxgeom, boxmat);

// Position cube mesh
cube.position.z = -1;

// Add cube mesh to your three.js scene
scene.add(cube);
*/

//override render function
manager.render = function(scene, camera, timestamp) {
  if (this.isVRMode()) {
    this.distorter.preRender();
    this.effect.render(scene, camera);
    this.distorter.postRender();
  } else {
    // Scene may be an array of two scenes, one for each eye.
    if (scene instanceof Array) {
      this.effect.render(scene[0], camera);
    } else {
      this.effect.render(scene, camera);
    }
  }
  if (this.input && this.input.setAnimationFrameTime) {
    this.input.setAnimationFrameTime(timestamp);
  }
};

// WebVRPolyfill.prototype.isCardboardCompatible = functon() {
//   return true;
// };

// Request animation frame loop function
function animate(timestamp) {
  // Apply rotation to cube mesh
//    cube.rotation.y += 0.01;

  // Update VR headset position and apply to camera.
  controls.update();
  
  manager.renderer.autoClear = false;
  manager.renderer.clear();

  if (manager.isVRMode()){ 
    effect.setRenderMode(2);
  } else {
    effect.setRenderMode(1);
  }
  
  manager.render(scene, camera, timestamp);

  //   uniforms.iGlobalTime.value += 0.001;

  requestAnimationFrame(animate);
}

// window.CARDBOARD_DEBUG = true;

// Kick off animation loop
animate();

// Reset the position sensor when 'z' pressed.
function onKey(event) {
  if (event.keyCode == 90) { // z
    controls.resetSensor();
  }
};

window.addEventListener('keydown', onKey, true);

// Handle window resizes
function onWindowResize() {
  if (effect.isFullscreenMode()) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(window.innerWidth, window.innerHeight);
  }
  else {
    camera.aspect = containerWidth/containerHeight;
    camera.updateProjectionMatrix();
    effect.setSize(containerWidth, containerHeight);
  }

}

window.addEventListener('resize', onWindowResize, false);