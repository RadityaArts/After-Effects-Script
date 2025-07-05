function addExpressionToSelectedProperties() {
    var selectedLayers = app.project.activeItem.selectedLayers;
    if (!selectedLayers || selectedLayers.length === 0) {
        alert("Silakan pilih property layer terlebih dahulu.");
        return;
    }

    // Expression yang akan ditambahkan
    var expressionText =
        "// Universal Custom Property Posterize Time\n" +
        "var newFramerate = effect(\"Universal Custom Posterize Time\")(\"Frame Rate\");\n" +
        "var frameOffset = effect(\"Universal Custom Posterize Time\")(\"Offset\");\n\n" +
        "var frameRate = 1 / thisComp.frameDuration;\n" +
        "var t = time * frameRate;\n\n" +
        "var newT = Math.floor((t - frameOffset) / (frameRate / newFramerate));\n" +
        "newT = newT * (frameRate / newFramerate) + frameOffset;\n" +
        "newT /= frameRate;\n" +
        "valueAtTime(newT);";

    app.beginUndoGroup("Add Expression and Apply Preset");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];

        // Iterasi untuk semua property yang dipilih
        for (var j = 0; j < layer.selectedProperties.length; j++) {
            var prop = layer.selectedProperties[j];

            // Memastikan bahwa property mendukung expression
            if (prop.canSetExpression) {
                prop.expression = expressionText;
            }
        }

        // Tambahkan preset efek ke layer
        var presetPath = "C:\\Program Files\\Adobe\\Adobe After Effects 2020\\Support Files\\Presets\\RadityaArts Presets Pack\\Pseudo\\Ps_Universal Custom Posterize Time.ffx";
        try {
            layer.applyPreset(new File(presetPath));
        } catch (e) {
            alert("Gagal menambahkan preset. File preset tidak ditemukan. " + e.toString());
        }
    }

    app.endUndoGroup();
}

// Jalankan fungsi
addExpressionToSelectedProperties();
