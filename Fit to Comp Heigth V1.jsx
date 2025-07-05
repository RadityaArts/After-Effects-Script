(function fitToCompHeight() {
    // Get the active composition
    var comp = app.project.activeItem;

    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    app.beginUndoGroup("Fit to Comp Height");

    // Loop through selected layers
    var selectedLayers = comp.selectedLayers;

    if (selectedLayers.length === 0) {
        alert("Please select at least one layer.");
        app.endUndoGroup();
        return;
    }

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];

        // Center the layer in the comp, considering keyframes
        var positionProp = layer.property("Position");
        if (positionProp.isTimeVarying) {
            positionProp.setValueAtTime(comp.time, [comp.width / 2, comp.height / 2]);
        } else {
            positionProp.setValue([comp.width / 2, comp.height / 2]);
        }

        // Get layer bounds or mask bounds if masks are present
        var bounds = layer.sourceRectAtTime(comp.time, false);

        if (layer.property("Masks") && layer.property("Masks").numProperties > 0) {
            bounds = getMaskBounds(layer);
        }

        // Calculate adjusted bounds for rotation
        var rotation = layer.property("Rotation").value;
        var angle = rotation * (Math.PI / 180);
        var adjustedHeight = Math.abs(bounds.width * Math.sin(angle)) + Math.abs(bounds.height * Math.cos(angle));

        // Calculate new scale based on comp height
        var scaleFactor = (comp.height / adjustedHeight) * 100;
        var scaleProp = layer.property("Scale");

        if (scaleProp.isTimeVarying) {
            scaleProp.setValueAtTime(comp.time, [scaleFactor, scaleFactor]);
        } else {
            scaleProp.setValue([scaleFactor, scaleFactor]);
        }
    }

    app.endUndoGroup();

    // Function to get mask bounds
    function getMaskBounds(layer) {
        var maskGroup = layer.property("Masks");
        var compToLayer = layer.containingComp.pixelAspect;

        var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
        var maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;

        for (var j = 1; j <= maskGroup.numProperties; j++) {
            var maskShape = maskGroup.property(j).property("maskShape").value;

            for (var k = 0; k < maskShape.vertices.length; k++) {
                var vertex = maskShape.vertices[k];

                minX = Math.min(minX, vertex[0]);
                minY = Math.min(minY, vertex[1]);
                maxX = Math.max(maxX, vertex[0]);
                maxY = Math.max(maxY, vertex[1]);
            }
        }

        return {
            width: (maxX - minX) * compToLayer,
            height: (maxY - minY) * compToLayer,
        };
    }
})();
