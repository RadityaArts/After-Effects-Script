// Ambil komposisi dan layer yang dipilih
var myComp = app.project.activeItem;
var selectedLayer = myComp.selectedLayers[0];

// Periksa apakah layer yang dipilih adalah layer kamera dan apakah DepthOfField belum diaktifkan
if (selectedLayer instanceof CameraLayer && !selectedLayer.property("Camera Options").property("Depth of Field").value) {
  // Aktifkan DepthOfField jika belum diaktifkan
  selectedLayer.property("Camera Options").property("Depth of Field").setValue(true);
}

// Buat expression untuk property focus distance
var expression =
  "//Automatically calculates Focus Distance to follow the layer 'FOCUS CONTROL'\n" +
  "var usingLegacyEngine = !!$.version;\n" +
  "try{\n" +
  "    thisLayer( 'ADBE Transform Group' )( 'ADBE Anchor Point' ).value;\n" +
  "}catch(err){\n" +
  "    quote = String.fromCharCode(34);\n" +
  "    if ( usingLegacyEngine ) {\n" +
  "        $.error = '' + quote + 'CAMERA' + quote + ' cannot be a One-Node camera';\n" +
  "    } else {\n" +
  "        throw '' + quote + 'CAMERA' + quote + ' cannot be a One-Node camera';\n" +
  "    }\n" +
  "}\n" +
  "layer = thisComp.layer('FOCUS CONTROL');\n" +
  "try{\n" +
  "    layer.transform.position[2]\n" +
  "}catch(err){\n" +
  "    quote = String.fromCharCode(34);\n" +
  "    if ( usingLegacyEngine ) {\n" +
  "        $.error = '' + quote + 'FOCUS CONTROL' + quote + ' cannot be a 2D layer. The Focus Distance of ' + quote + 'CAMERA' + quote + ' can only be set to follow 3D layers.';\n" +
  "    } else {\n" +
  "        throw '' + quote + 'FOCUS CONTROL' + quote + ' cannot be a 2D layer. The Focus Distance of ' + quote + 'CAMERA' + quote + ' can only be set to follow 3D layers.';\n" +
  "    }\n" +
  "}\n" +
  "cam_pos = [transform.position[0] * thisComp.pixelAspect, transform.position[1], transform.position[2]];\n" +
  "cam_poi = [transform.pointOfInterest[0] * thisComp.pixelAspect, transform.pointOfInterest[1], transform.pointOfInterest[2]];\n" +
  "if (this.hasParent)\n" +
  "{\n" +
  "    cam_pos = this.parent.toWorld( cam_pos );\n" +
  "    cam_poi = this.parent.toWorld( cam_poi );\n" +
  "}\n" +
  "layer = thisComp.layer('FOCUS CONTROL');\n" +
  "layer_pos = [layer.transform.position[0] * thisComp.pixelAspect, layer.transform.position[1], layer.transform.position[2]];\n" +
  "if ( layer.hasParent )\n" +
  "{\n" +
  "    layer_pos = layer.parent.toWorld(  layer.transform.position);\n" +
  "}\n" +
  "cam_vector = sub(cam_poi, cam_pos);\n" +
  "if( length(cam_vector) != 0) {\n" +
  "    cam_vector = normalize(cam_vector);\n" +
  "}\n" +
  "layer_vector = sub(layer_pos, cam_pos);\n" +
  "dot(layer_vector, cam_vector);";

selectedLayer.property("Camera Options").property("Focus Distance").expression = expression;

// tambahkan null object
var nullLayer = myComp.layers.addNull();
nullLayer.name = "FOCUS CONTROL";

// aktifkan 3D mode pada null object
nullLayer.threeDLayer = true;

// atur posisi, anchor point, dan rotasi null object sama dengan layer yang diselect
nullLayer.property("Position").setValue(selectedLayer.property("Position").value);
nullLayer.property("Anchor Point").setValue([50, 50, 0]); // Mengatur anchor point ke (50, 50, 0)

// Set posisi Z null menjadi 0
var nullPosition = nullLayer.property("Position").value;
nullPosition[2] = 0;
nullLayer.property("Position").setValue(nullPosition);

// Mengatur posisi X dan Y null agar berada di tengah comp
var compWidth = myComp.width;
var compHeight = myComp.height;
var nullPosition = nullLayer.property("Position").value;
nullPosition[0] = compWidth / 2;
nullPosition[1] = compHeight / 2;
nullLayer.property("Position").setValue(nullPosition);

// Pindahkan null object target ke atas layer yang dipilih
nullLayer.moveBefore(selectedLayer);
