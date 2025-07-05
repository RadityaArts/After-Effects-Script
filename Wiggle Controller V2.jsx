// Mulai undo group untuk membungkus seluruh skrip sebagai satu aksi undo
app.beginUndoGroup("Add Camera Wiggle Controller");

// Ambil komposisi dan layer yang dipilih
var myComp = app.project.activeItem;
var selectedLayer = myComp.selectedLayers[0];
var cameraLayer = null;

// Buat expression untuk property
selectedLayer.property("Point of Interest").expression =
    'seedRandom(thisComp.layer("WIGGLE").effect("Wiggle - Point of Interest")("Random Seed"));\nwiggle(thisComp.layer("WIGGLE").effect("Wiggle - Point of Interest")("Frequency"), thisComp.layer("WIGGLE").effect("Wiggle - Point of Interest")("Amplitude"), thisComp.layer("WIGGLE").effect("Wiggle - Point of Interest")("Octaves"), thisComp.layer("WIGGLE").effect("Wiggle - Point of Interest")("Intensity"));';

// Cari layer null dengan nama "WIGGLE" di dalam komposisi
var wiggleNull = null;
for (var i = 1; i <= myComp.numLayers; i++) {
  var layer = myComp.layer(i);
  if (layer.name === "WIGGLE" && layer.nullLayer) {
    wiggleNull = layer;
    break;
  }
}

// Jika tidak ada layer null dengan nama "WIGGLE", buat layer null baru
if (!wiggleNull) {
  wiggleNull = myComp.layers.addNull(myComp.duration);
  wiggleNull.name = "WIGGLE";
  
  // Pindahkan null object di atas layer kamera terpilih
  for (var j = 1; j <= myComp.numLayers; j++) {
    var thisLayer = myComp.layer(j);
    if (thisLayer instanceof CameraLayer) {
      cameraLayer = thisLayer;
      break;
    }
  }
  if (cameraLayer) {
    wiggleNull.moveBefore(cameraLayer);
  }
}

// Mengatur anchor point null object
wiggleNull.property("Anchor Point").setValue([50, 50, 0]);

// Tambahkan efek Preset ke dalam layer null jika belum ada
var thePreset = File("C:\\Program Files\\Adobe\\Adobe After Effects 2020\\Support Files\\Presets\\RadityaArts Presets Pack\\Pseudo\\Ps_Wiggle Control.ffx");
if (!wiggleNull.effect("C_Wiggle Control")) {
  wiggleNull.applyPreset(thePreset);
}

// Akhir dari undo group
app.endUndoGroup();
