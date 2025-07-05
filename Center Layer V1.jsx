// Center Anchor Point and Position Script for After Effects
(function centerAnchorAndPosition() {
    // Ensure a project is open
    if (app.project === null) {
        alert("Please open a project first.");
        return;
    }

    app.beginUndoGroup("Center Anchor Point and Position");

    // Get the active composition
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) {
        alert("Please select a composition.");
        app.endUndoGroup();
        return;
    }

    // Get selected layers
    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select one or more layers.");
        app.endUndoGroup();
        return;
    }

    // Iterate through selected layers
    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];

        // Skip layers that don't have an anchor point property
        if (!layer.property("Anchor Point") || !layer.property("Position")) {
            continue;
        }

        // Get layer dimensions and position using sourceRectAtTime
        var rect = layer.sourceRectAtTime(comp.time, false);
        var layerWidth = rect.width;
        var layerHeight = rect.height;
        var layerLeft = rect.left;
        var layerTop = rect.top;

        // Calculate the center of the layer in its own space
        var layerCenter = [
            layerLeft + layerWidth / 2,
            layerTop + layerHeight / 2
        ];

        // Set the anchor point to the center of the layer
        layer.property("Anchor Point").setValue(layerCenter);

        // Get the current position values
        var currentPosition = layer.property("Position").value;

        // Set only the X and Y position to the center of the composition
        layer.property("Position").setValue([
            comp.width / 2,
            comp.height / 2,
            currentPosition[2] // Keep the Z position unchanged
        ]);
    }

    app.endUndoGroup();
})();
