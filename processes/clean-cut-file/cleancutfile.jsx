var dir = {
    ready: new Folder(platform.directory + "/Prepress/External/Special Process/Clean Cut File/Ready/"),
    complete: new Folder(platform.directory + "/Prepress/External/Special Process/Clean Cut File/Complete/"),
    xml: new Folder(platform.directory + "/Prepress/Support/gangData/")
}

// Make the Window
var w = new Window("dialog", "Adjust Cut File");
    w.alignChildren = "top";

    w.search = w.add ('edittext {active: true}', [undefined, undefined, 200, 20]);
    w.search.text = "";
    w.search.onChanging = function(){
        w.list.removeAll();
        getFiles();
    }

    w.list = w.add ('listbox', [0, 0, 300, 175], "", {multiselect: true});
    w.list.selection = 0;

        getFiles();

    w.buttonGroup = w.add ("group");
    w.buttonGroup.alignment = "center";
    w.acceptButton = w.buttonGroup.add ("button", undefined, "Ok");
    w.acceptButton.onClick = function(){
        w.close();
        processFiles();
    }

    w.cancelButton = w.buttonGroup.add ("button", undefined, "Cancel");

w.show()

function processFiles(){
    try{
        for(var k=0; k<w.list.selection.length; k++){
            var file = new File(dir.ready + "/" + w.list.selection[k].text)
            app.open(file);

            var doc = app.activeDocument;

            // Load in the data from the xml that Switch created.
            //var dataFileXML = File(dir.xml + "/" + doc.name.split('.')[0].split('_')[3] + ".xml");
            var dataFileXML = File(dir.xml + "/" + doc.name.split('.')[0] + ".xml");
            var dataFile = loadXmlFile(dataFileXML);

            var data = {
                secondSurface: dataFile.product.secondSurface.text() == 'true' ? true : false,
                material: dataFile.base.process.text()
            }

            // Remove all clipping paths.
            var allPaths = doc.pathItems
            for (var i=allPaths.length-1; i>=0; i--){
                if(allPaths[i].clipping == true){
                    try{
                        allPaths[i].remove();
                    }catch(e){}
                }
            }

            // Move the regmarks to the register layer.
            var allPaths = doc.pageItems
            for (var i=allPaths.length-1; i>=0; i--){
                if(allPaths[i] == "[GroupItem ]"){
                    for (var j=allPaths[i].pathItems.length-1; j>=0; j--){
                        try{
                            if(allPaths[i].pathItems[j].filled == true){
                                var tempLayer = createLayer("register", true);
                                allPaths[i].pathItems[j].move(tempLayer, ElementPlacement.PLACEATBEGINNING)
                            }
                        }catch(e){}
                    }
                }
            }

            // Remove the compound paths
            app.executeMenuCommand("selectall"); 
            app.executeMenuCommand("noCompoundPath");

            // Move the paths to their respective layers.
            var allPaths = doc.layers.getByName("Layer 1").pathItems;
            for (var i=allPaths.length-1; i>=0; i--){
                var layerName = allPaths[i].strokeColor.spot.name;

                if(data.material != "3mm-Sintra" && data.material != "Foamboard"){
                    layerName = "Thru-cut"
                }else{
                    if(layerName == "UPblue" || layerName == "UPgreen"){
                        layerName = "Hole-cut"
                    }

                    if((allPaths[i].width == .25*72 && allPaths[i].height == .25*72) ||
                    (allPaths[i].width == .375*72 && allPaths[i].height == .375*72)){
                        layerName = "Hole-cut"
                    }
                }

                var pathLayer = createLayer(layerName, true)
                allPaths[i].move(pathLayer, ElementPlacement.PLACEATBEGINNING)
            }

            // Remove the final layer.
            doc.layers.getByName("Layer 1").remove();
            
            // Mirror the cut path for applicable materials.
            // Don't activate this logic, just duplicate it into Switch with Pitstop when Bryan asks for it to be enabled.
            /*
            if((material == ("125-Acrylic" || "25-Acrylic" || "ClearCling" || "EtchedGlass") && surface == "2nd Surface") ||
            (material == ("ClearPoly") && surface == "1st Surface")){

                var allLayers = doc.layers
                for(var n=0; n<allLayers.length; n++){
                    var totalMatrix = app.getScaleMatrix(-100,100);  
                    var newGroup = allLayers[n].groupItems.add();  
                    for(var a = allLayers[n].pageItems.length-1; a > 0; a--){  
                        app.activeDocument.layers[n].pageItems[a].moveToBeginning(newGroup);
                    }
                    newGroup.transform(totalMatrix);
                }
            }
            */

            // Save the document.
            var pdfOptions = new PDFSaveOptions();
                pdfOptions.pDFPreset = "Signs - Cut Files";
            
            var outfile = new File(dir.complete + "/" + doc.name);
                doc.saveAs(outfile, pdfOptions);

                doc.close(SaveOptions.DONOTSAVECHANGES)
                file.remove()
        }

    }catch(e){
        alert("Error!\n" + e);
    }
}

function getFiles(){
    var allFiles = [];
    var curFiles = dir.ready.getFiles();

    // Add the active files to the queue.
    for(var i=0; i<curFiles.length; i++){
        if(curFiles[i] instanceof File){
            if(w.search.text == ""){
                w.list.add('item', curFiles[i].name);
                continue;
            }
            if(new RegExp(w.search.text.toLowerCase(),"g").exec(curFiles[i].name.toLowerCase()) == w.search.text.toLowerCase()){
                w.list.add('item', curFiles[i].name);
            continue;
            }
        }
    }

    // Select the first item
    w.list.selection = 0;

   return allFiles
}