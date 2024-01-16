// Pilih layer
var layerToMatch = app.project.activeItem.selectedLayers[0];

  // Buat layer null baru
  var targetLayer = app.project.activeItem.layers.addNull();

  // Aktifkan properti layer 3D untuk layer null target
  targetLayer.threeDLayer = true;
  
  // Ganti nama layer null
  targetLayer.name = "NULL CONTROL";

    // Dapatkan properti posisi dari layer yang ingin Anda samakan
    var layerToMatchPosition = layerToMatch.property("Position");
    var layerToMatchRotationX = layerToMatch.property("X Rotation");
    var layerToMatchRotationY = layerToMatch.property("Y Rotation");
    var layerToMatchRotationZ = layerToMatch.property("Z Rotation");

    // Temukan waktu keyframe terakhir untuk layerToMatch
    var lastKeyframeTime = Math.max(
      layerToMatchPosition.numKeys > 0 ? layerToMatchPosition.keyTime(layerToMatchPosition.numKeys) : 0,
      layerToMatchRotationX.numKeys > 0 ? layerToMatchRotationX.keyTime(layerToMatchRotationX.numKeys) : 0,
      layerToMatchRotationY.numKeys > 0 ? layerToMatchRotationY.keyTime(layerToMatchRotationY.numKeys) : 0,
      layerToMatchRotationZ.numKeys > 0 ? layerToMatchRotationZ.keyTime(layerToMatchRotationZ.numKeys) : 0
    );

    // Dapatkan nilai properti posisi pada keyframe terakhir atau gunakan nilai default jika tidak ada keyframe
    var layerToMatchPositionValue = lastKeyframeTime > 0 ? layerToMatchPosition.valueAtTime(lastKeyframeTime, false) : layerToMatchPosition.value;
    var layerToMatchRotationXValue = lastKeyframeTime > 0 ? layerToMatchRotationX.valueAtTime(lastKeyframeTime, false) : layerToMatchRotationX.value;
    var layerToMatchRotationYValue = lastKeyframeTime > 0 ? layerToMatchRotationY.valueAtTime(lastKeyframeTime, false) : layerToMatchRotationY.value;
    var layerToMatchRotationZValue = lastKeyframeTime > 0 ? layerToMatchRotationZ.valueAtTime(lastKeyframeTime, false) : layerToMatchRotationZ.value;

    // Setel nilai properti posisi layer null target untuk disamakan dengan layerToMatch
    targetLayer.property("Position").setValue([layerToMatchPositionValue[0], layerToMatchPositionValue[1], layerToMatchPositionValue[2]]);

    // Setel nilai properti rotasi layer null target untuk disamakan dengan layerToMatch
    targetLayer.property("X Rotation").setValue(layerToMatchRotationXValue);
    targetLayer.property("Y Rotation").setValue(layerToMatchRotationYValue);
    targetLayer.property("Z Rotation").setValue(layerToMatchRotationZValue);

  // Jika layer yang dipilih adalah kamera, atur posisi null ke tengah kamera
  if (layerToMatch instanceof CameraLayer) {
    var cameraPosition = layerToMatch.property("Position").value;
    targetLayer.property("Position").setValue([cameraPosition[0], cameraPosition[1], 0]);
  }

  // Setel anchor point dari layer null target
  targetLayer.property("Anchor Point").setValue([50, 50, 0]);
  
// Pindahkan layer null target di atas layerToMatch
targetLayer.moveBefore(layerToMatch);

// Jadikan layerToMatch sebagai parent dari layer null target
layerToMatch.parent = targetLayer;