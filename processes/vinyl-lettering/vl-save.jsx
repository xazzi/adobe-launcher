try{

    var dir = {
        xml: new Folder(platform.directory + "/.itemData"),
        ready: new Folder(platform.directory + "/Vinyl Lettering/Ready/"),
        complete: new Folder(platform.directory + "/Vinyl Lettering/Complete_Dev/")
    }

    var doc = app.activeDocument

    // Load in the data from the xml that Switch created.
    //var dataFileXML = File(dir.xml + "/" + doc.name.split('.')[0].split('_')[4] + ".xml");
    var dataFile = loadXmlFile(File(dir.xml + "/" + doc.name.split('.')[0].split('_')[4] + ".xml"));

    var handoffData = {
        contentFile: dataFile.product.contentFile.text()
    }

    // Find the file for deletion later.
    var userFolders = getUserFolders(dir)
    for(var i in userFolders){
        var file = new File(dir.ready + "/" + userFolders[i] + "/" + doc.name);
        if(file.exists){
            break;
        }
    }

    var allLayers = doc.layers;
    var lastIndex = allLayers.length-1;

    var baseName = doc.name.split('.')[0]

    var saveFiles = true;
    for(var j=0; j<allLayers.length; j++){
        if(new RegExp("Discontinued","g").exec(allLayers[j].name) == "Discontinued"){
            alert("File contains discontinued color or layer. Ending process.")
            saveFiles = false;
        }
    }

    var facility = null

    // Scan the settings layer.
    for(var ii = 0; ii<allLayers.length; ii++){
        if(allLayers[ii].name == "Settings"){
            var subLayers = allLayers[ii].layers
            for(var h = 0; h<subLayers.length; h++){
                if(new RegExp("facility","g").exec(subLayers[h].name) == "facility"){
                    if(new RegExp("Salt Lake City","g").exec(subLayers[h].name) == "Salt Lake City"){
                        facility = "Salt Lake City"
                    }
                    if(new RegExp("Wixom","g").exec(subLayers[h].name) == "Wixom"){
                        facility = "Wixom"
                    }

                }
            }
        }
    }

    if(facility == null){
        saveFiles = false;
        alert("No Facility Assigned!")
    }
    
    if(saveFiles){
        for(var lr = allLayers.length-1; lr >= 0; lr--){
            if(allLayers[lr].name == "Thru-cut" || allLayers[lr].name == "Extras" || allLayers[lr].name == "Layer 1" || allLayers[lr].name == "Undefined Color" || allLayers[lr].name == "Settings"){
                lastIndex--;
                continue;
            }
            for (var ii = allLayers.length-1; ii >= 0; ii-- ) {
                if(ii!=lastIndex) {
                    if(allLayers[ii].locked == true) allLayers[ii].locked = false;
                    if(allLayers[ii].visible == false) allLayers[ii].visible = true;           
                    try{allLayers[ii].remove();}catch(ex){}
                }       
            }
            
            if(app.documents.length > 0){
                var pdfOptions = new PDFSaveOptions();
                    pdfOptions.pDFPreset = "[Illustrator Default]";

                var outfolder = makeOrGetFolder(dir.complete + "/" + facility + "/" + allLayers[0].name + "/" + handoffData.contentFile.split('.pdf')[0]);
                
                var outfile = new File(outfolder + "/" + baseName + "_" + allLayers[0].name + ".pdf");
                    doc.saveAs(outfile, pdfOptions);
            }
            lastIndex--;
            app.undo();
        }

        doc.close(SaveOptions.DONOTSAVECHANGES)
        file.remove()
    }

}catch(e){
    alert("Error!\n" + e);
}