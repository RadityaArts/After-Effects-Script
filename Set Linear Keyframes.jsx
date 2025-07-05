// Sets the selected keyframes to linear interpolation
function setLinear() {
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
  
  app.beginUndoGroup("Linear");
  
  for (var i = 0; i < selectedLayers.length; i++) {
    var layer = selectedLayers[i];
    var propertyGroup = layer.selectedProperties;
    
    for (var j = 0; j < propertyGroup.length; j++) {
      var prop = propertyGroup[j];
      
      if (prop.propertyType === PropertyType.PROPERTY) {
        var selectedKeys = prop.selectedKeys;
        
        for (var k = 0; k < selectedKeys.length; k++) {
          var keyIndex = selectedKeys[k];
          prop.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.LINEAR);
        }
      }
    }
  }
  
  app.endUndoGroup();
}

setLinear();
