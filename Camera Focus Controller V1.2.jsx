// Mulai undo group untuk membungkus seluruh skrip sebagai satu aksi undo
app.beginUndoGroup("Add Camera Focus Controller");

// Ambil komposisi dan layer yang dipilih
var myComp = app.project.activeItem;
var selectedLayer = myComp.selectedLayers[0];

// Periksa apakah layer yang dipilih adalah layer kamera dan apakah DepthOfField belum diaktifkan
if (selectedLayer instanceof CameraLayer && !selectedLayer.property("Camera Options").property("Depth of Field").value) {
  // Aktifkan DepthOfField jika belum diaktifkan
  selectedLayer.property("Camera Options").property("Depth of Field").setValue(true);
}

// Tambahkan null object
var nullLayer = myComp.layers.addNull();
nullLayer.name = "FOCUS CONTROL";

// Aktifkan 3D mode pada null object
nullLayer.threeDLayer = true;

// Atur posisi, anchor point, dan rotasi null object sama dengan layer yang dipilih
nullLayer.property("Position").setValue(selectedLayer.property("Position").value);
nullLayer.property("Anchor Point").setValue([50, 50, 0]); // Mengatur anchor point ke (50, 50, 0)

// Set posisi Z null menjadi 0
var nullPosition = nullLayer.property("Position").value;
nullPosition[2] = 0;
nullLayer.property("Position").setValue(nullPosition);

// Mengatur posisi X dan Y null agar berada di tengah comp
var compWidth = myComp.width;
var compHeight = myComp.height;
nullPosition = nullLayer.property("Position").value;
nullPosition[0] = compWidth / 2;
nullPosition[1] = compHeight / 2;
nullLayer.property("Position").setValue(nullPosition);

// Pindahkan null object target ke atas layer yang dipilih
nullLayer.moveBefore(selectedLayer);

// Link Focus Distance kamera ke posisi null object 'FOCUS CONTROL' menggunakan expression
var expression = 
"//Automatically calculates Focus Distance to follow the layer 'FOCUS CONTROL'\n" +
"var usingLegacyEngine = !!$.version;\n" +
"try{\n" +
"    thisLayer( 'ADBE Transform Group' )( 'ADBE Anchor Point' ).value;\n" +
"}catch(err){\n" +
"    var quote = String.fromCharCode(34);\n" +
"    if ( usingLegacyEngine ) {\n" +
"        $.error = '' + quote + 'CAMERA' + quote + ' cannot be a One-Node camera';\n" +
"    } else {\n" +
"        throw '' + quote + 'CAMERA' + quote + ' cannot be a One-Node camera';\n" +
"    }\n" +
"}\n" +
"var targetLayer = thisComp.layer('FOCUS CONTROL');\n" +
"try{\n" +
"    targetLayer.transform.position[2];\n" +
"}catch(err){\n" +
"    var quote = String.fromCharCode(34);\n" +
"    if ( usingLegacyEngine ) {\n" +
"        $.error = '' + quote + 'FOCUS CONTROL' + quote + ' cannot be a 2D layer. The Focus Distance of ' + quote + 'CAMERA' + quote + ' can only be set to follow 3D layers.';\n" +
"    } else {\n" +
"        throw '' + quote + 'FOCUS CONTROL' + quote + ' cannot be a 2D layer. The Focus Distance of ' + quote + 'CAMERA' + quote + ' can only be set to follow 3D layers.';\n" +
"    }\n" +
"}\n" +
"var cameraPosition = [transform.position[0] * thisComp.pixelAspect, transform.position[1], transform.position[2]];\n" +
"var cameraPoi = [transform.pointOfInterest[0] * thisComp.pixelAspect, transform.pointOfInterest[1], transform.pointOfInterest[2]];\n" +
"if ( thisLayer.hasParent ){\n" +
"    cameraPosition = thisLayer.parent.toWorld( cameraPosition );\n" +
"    cameraPoi = thisLayer.parent.toWorld( cameraPoi );\n" +
"}\n" +
"var targetPosition = [targetLayer.transform.position[0] * thisComp.pixelAspect, targetLayer.transform.position[1], targetLayer.transform.position[2]];\n" +
"if ( targetLayer.hasParent ){\n" +
"    targetPosition = targetLayer.parent.toWorld( targetLayer.transform.position );\n" +
"}\n" +
"var cameraVector = sub( cameraPoi, cameraPosition );\n" +
"if( length( cameraVector ) != 0 ) {\n" +
"    cameraVector = normalize( cameraVector );\n" +
"}\n" +
"var targetVector = sub( targetPosition, cameraPosition );\n" +
"dot( targetVector, cameraVector );";

selectedLayer.property("Camera Options").property("Focus Distance").expression = expression;

// Akhir dari undo group
app.endUndoGroup();
