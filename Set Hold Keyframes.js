// Sets the selected keyframes to hold interpolation
function setHold() {
  var comp = app.project.activeItem;
  
  if (!(comp instanceof CompItem)) {
    alert("Please select a composition.");
    return;
  }
  
  var selectedLayers = comp.selectedLayers;
  
  if (selectedLayers.length === 0) {
    alert("Please select at least one layer.");
    return;
  }
  
  app.beginUndoGroup("Hold");
  
  for (var i = 0; i < selectedLayers.length; i++) {
    var layer = selectedLayers[i];
    var propertyGroup = layer.selectedProperties;
    
    for (var j = 0; j < propertyGroup.length; j++) {
      var prop = propertyGroup[j];
      
      if (prop.propertyType === PropertyType.PROPERTY) {
        for (var k = 1; k <= prop.numKeys; k++) {
          prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.HOLD);
        }
      }
    }
  }
  
  app.endUndoGroup();
}

setHold();
