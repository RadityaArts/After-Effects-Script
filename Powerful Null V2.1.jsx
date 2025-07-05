// Mulai undo group untuk membungkus seluruh skrip sebagai satu aksi undo
app.beginUndoGroup("Add Powerful Camera Null");

// Pilih layer
var layerToMatch = app.project.activeItem.selectedLayers[0];

// Buat layer null baru
var targetLayer = app.project.activeItem.layers.addNull();

// Aktifkan properti layer 3D untuk layer null target
targetLayer.threeDLayer = true;

// Ganti nama layer null
targetLayer.name = "NULL CONTROL";

if (layerToMatch instanceof CameraLayer) {
  // Jika layer yang dipilih adalah kamera
  // Dapatkan Point of Interest (POI) kamera
  var cameraPointOfInterest = layerToMatch.property("Point of Interest").value;
  
  // Hitung vektor arah kamera (POI - posisi kamera)
  var cameraPosition = layerToMatch.property("Position").value;
  var directionVector = [
    cameraPointOfInterest[0] - cameraPosition[0],
    cameraPointOfInterest[1] - cameraPosition[1],
    cameraPointOfInterest[2] - cameraPosition[2]
  ];

  // Hitung rotasi berdasarkan vektor arah
  var rotationX = -Math.atan2(directionVector[1], directionVector[2]) * (180 / Math.PI);
  var rotationY = Math.atan2(directionVector[0], Math.sqrt(Math.pow(directionVector[1], 2) + Math.pow(directionVector[2], 2))) * (180 / Math.PI);
  var rotationZ = layerToMatch.property("Z Rotation").value;

  // Setel posisi null ke Point of Interest kamera
  targetLayer.property("Position").setValue(cameraPointOfInterest);

  // Terapkan rotasi ke null
  targetLayer.property("X Rotation").setValue(rotationX);
  targetLayer.property("Y Rotation").setValue(rotationY);
  targetLayer.property("Z Rotation").setValue(rotationZ);
  
} else {
  // Jika layer yang dipilih adalah bukan kamera
  // Dapatkan properti posisi, rotasi, dan orientation dari layer yang ingin Anda samakan
  var layerToMatchPosition = layerToMatch.property("Position");
  var layerToMatchRotationX = layerToMatch.property("X Rotation");
  var layerToMatchRotationY = layerToMatch.property("Y Rotation");
  var layerToMatchRotationZ = layerToMatch.property("Z Rotation");
  var layerToMatchOrientation = layerToMatch.property("Orientation");

  // Temukan waktu keyframe terakhir untuk layerToMatch
  var lastKeyframeTime = Math.max(
    layerToMatchPosition.numKeys > 0 ? layerToMatchPosition.keyTime(layerToMatchPosition.numKeys) : 0,
    layerToMatchRotationX.numKeys > 0 ? layerToMatchRotationX.keyTime(layerToMatchRotationX.numKeys) : 0,
    layerToMatchRotationY.numKeys > 0 ? layerToMatchRotationY.keyTime(layerToMatchRotationY.numKeys) : 0,
    layerToMatchRotationZ.numKeys > 0 ? layerToMatchRotationZ.keyTime(layerToMatchRotationZ.numKeys) : 0,
    layerToMatchOrientation.numKeys > 0 ? layerToMatchOrientation.keyTime(layerToMatchOrientation.numKeys) : 0
  );

  // Dapatkan nilai properti posisi pada keyframe terakhir atau gunakan nilai default jika tidak ada keyframe
  var layerToMatchPositionValue = lastKeyframeTime > 0 
      ? layerToMatchPosition.valueAtTime(lastKeyframeTime, false) 
      : layerToMatchPosition.value;

  var layerToMatchRotationXValue = lastKeyframeTime > 0 
      ? layerToMatchRotationX.valueAtTime(lastKeyframeTime, false) 
      : layerToMatchRotationX.value;

  var layerToMatchRotationYValue = lastKeyframeTime > 0 
      ? layerToMatchRotationY.valueAtTime(lastKeyframeTime, false) 
      : layerToMatchRotationY.value;

  var layerToMatchRotationZValue = lastKeyframeTime > 0 
      ? layerToMatchRotationZ.valueAtTime(lastKeyframeTime, false) 
      : layerToMatchRotationZ.value;

  var layerToMatchOrientationValue = lastKeyframeTime > 0 
      ? layerToMatchOrientation.valueAtTime(lastKeyframeTime, false) 
      : layerToMatchOrientation.value;

  // Setel posisi null target untuk disamakan dengan posisi layerToMatch
  targetLayer.property("Position").setValue([
    layerToMatchPositionValue[0], 
    layerToMatchPositionValue[1], 
    layerToMatchPositionValue[2]
  ]);

  // Setel rotasi null target untuk disamakan dengan rotasi layerToMatch
  targetLayer.property("X Rotation").setValue(layerToMatchRotationXValue);
  targetLayer.property("Y Rotation").setValue(layerToMatchRotationYValue);
  targetLayer.property("Z Rotation").setValue(layerToMatchRotationZValue);

  // Setel orientation null target untuk disamakan dengan orientation layerToMatch
  targetLayer.property("Orientation").setValue(layerToMatchOrientationValue);
}

// Setel anchor point dari layer null target
targetLayer.property("Anchor Point").setValue([50, 50, 0]);

// Pindahkan layer null target di atas layerToMatch
targetLayer.moveBefore(layerToMatch);

// Jadikan layerToMatch sebagai parent dari layer null target
layerToMatch.parent = targetLayer;

// Akhir dari undo group
app.endUndoGroup();
