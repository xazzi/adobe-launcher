try{

    var dir = {
        ready: new Folder(platform.directory + "/Prepress/External/Special Process/Cut Vinyl/Ready/"),
        complete: new Folder(platform.directory + "/Prepress/External/Special Process/Cut Vinyl/Complete/")
    }

    var $doc = app.activeDocument

    var userFolders = getUserFolders(dir)

    for(var i in userFolders){
        var file = new File(dir.ready + "/" + userFolders[i] + "/" + $doc.name);
        if(file.exists){
            break;
        }
    }

    var allLayers = $doc.layers;
    var lastIndex = allLayers.length-1;
    
    for(var lr = allLayers.length-1; lr >= 0; lr--){
        if(allLayers[lr].name == "Thru-cut" || allLayers[lr].name == "Extras" || allLayers[lr].name == "Layer 1" || allLayers[lr].name == "Undefined Color"){
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
        
        var sv_file = $doc.name.split('.')[0] + "_" + allLayers[0].name;
        
        if(app.documents.length > 0){
            var pdfOptions = new PDFSaveOptions();
                pdfOptions.pDFPreset = "Signs - Cut Files";

            var outfolder = makeOrGetFolder(dir.complete + "/" + allLayers[0].name)
            
            var outfile = new File(outfolder + "/" + sv_file + ".pdf");
                $doc.saveAs(outfile, pdfOptions);
        }
        lastIndex--;
        app.undo();
    }

    $doc.close(SaveOptions.DONOTSAVECHANGES)
    file.remove()

}catch(e){
    alert("Error!\n" + e);
}