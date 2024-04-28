try{

    var dir = {
        xml: new Folder(platform.liveServices + "/Item Data"),
        ready: new Folder(platform.support + "/Vinyl Lettering/"),
        data: new Folder(platform.liveServices + "/Vinyl Lettering Data/"),
        complete: new Folder(platform.liveServices + "/Vinyl Lettering/")
    }

    var doc = app.activeDocument

    // Load in the data from the xml that Switch created.
    var dataFile = loadXmlFile(File(dir.xml + "/" + doc.name.split('.')[0].split('_')[4] + ".xml"));

    var handoffData = {
        contentFile: dataFile.product.contentFile.text(),
        itemNumber: dataFile.product.itemNumber.text(),
        gangNumber: dataFile.base.projectID.text(),
        sku: dataFile.base.sku.text()
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

    var saveFiles = true;
    for(var j=0; j<allLayers.length; j++){
        if(new RegExp("Discontinued","g").exec(allLayers[j].name) == "Discontinued"){
            alert("File contains discontinued color or layer. Ending process.")
            saveFiles = false;
        }
    }

    var totalColors = 0;

    var settings = {
        facility: null,
        layout: null,
        color: null
    }

    var filename = {
        single: doc.name.split('.')[0],
        phoenix: handoffData.contentFile.split('.pdf')[0]
    }

    // Scan the settings layer.
    for(var ii = 0; ii<allLayers.length; ii++){
        if(allLayers[ii].name == "Settings"){
            var subLayers = allLayers[ii].layers
            for(var h = 0; h<subLayers.length; h++){
                if(new RegExp("facility","g").exec(subLayers[h].name) == "facility"){
                    settings.facility = subLayers[h].name.split(':')[1]
                }
                if(new RegExp("layout","g").exec(subLayers[h].name) == "layout"){
                    settings.layout = subLayers[h].name.split(':')[1]
                }
            }
        }
    }

    if(settings.facility == null){
        saveFiles = false;
        alert("No Facility Assigned!")
    }

    for(var t in allLayers){
        if(allLayers[t].name == "Thru-cut" || allLayers[t].name == "Extras" || allLayers[t].name == "Layer 1" || allLayers[t].name == "Undefined Color" || allLayers[t].name == "Settings"){
            continue;
        }
        totalColors++
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

                    settings.color = allLayers[0].name
                
                var outfile = new File(dir.complete + "/" + filename.single + "_" + settings.color + ".pdf");
                    doc.saveAs(outfile, pdfOptions);

                if(settings.layout == 'null'){
                    if(totalColors == 2){
                        settings.layout = "Type-2"
                    }else{
                        settings.layout = "Type-1"
                    }
                }

                    writeXmlFile(dir, handoffData, settings)
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

function writeXmlFile(dir, handoffData, settings){
    var xmlFile = new File(dir.complete + "/" + filename.single + "_" + settings.color + ".xml");

        xmlFile.open('w')
        xmlFile.writeln('<?xml version="1.0" encoding="UTF-8"?>')

        xmlFile.writeln("<data>")

        xmlFile.writeln("<sku>" + handoffData.sku + "</sku>")
        xmlFile.writeln("<gangNumber>" + handoffData.gangNumber + "</gangNumber>")
        xmlFile.writeln("<itemNumber>" + handoffData.itemNumber + "</itemNumber>")

        xmlFile.writeln("<settings>")
        xmlFile.writeln("<facility>" + settings.facility + "</facility>")
        xmlFile.writeln("<layout>" + settings.layout + "</layout>")
        xmlFile.writeln("<color>" + settings.color + "</color>")
        xmlFile.writeln("</settings>")

        xmlFile.writeln("<filename>")
        xmlFile.writeln("<single>" + filename.single + "</single>")
        xmlFile.writeln("<phoenix>" + filename.phoenix + "</phoenix>")
        xmlFile.writeln("</filename>")

        xmlFile.write("</data>")

        xmlFile.close(); 
}