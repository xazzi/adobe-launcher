try{

    var dir = {
        xml: new Folder(platform.directory + "/Prepress/Support/itemData/")
    }

    var doc = app.activeDocument;

    if(doc.documentColorSpace == "DocumentColorSpace.RGB"){
        //alert("Wrong color space");
    }

    // Load in the data from the xml that Switch created.
    var dataFileXML = File(dir.xml + "/" + doc.name.split('.')[0].split('_')[3] + ".xml");
    var dataFile = loadXmlFile(dataFileXML);

    var data = {
        secondSurface: dataFile.product.secondSurface.text() == 'true' ? true : false
    }

    var colors = 0;
    var offCut = doc.cropBox[3] - (.9-72);

        addSwatches()
        addCutVinylSwatches();

    // Remove all clipping paths    
    for(i=doc.pageItems.length-1; i>=0; i--){
        if(doc.pageItems[i].clipping == true){
            try{
                doc.pageItems[i].remove();
            }catch(e){}
        }
    }

    // Move the text elements to their own layer.
    var textFrames = doc.textFrames;
    for(i=0; i<textFrames.length; i++){
        textFrames[i].move(createLayer("Extras", true), ElementPlacement.PLACEATBEGINNING);
    }

    // Loop through all of the paths for some initial cleanup.
    var allPaths = doc.pathItems;
    for(i=0; i<allPaths.length; i++){
        // Move the extra elements to their own layer.
        if(allPaths[i].top < offCut){
            allPaths[i].move(createLayer("Extras", false), ElementPlacement.PLACEATBEGINNING);
            continue
        }

        // Move the Thru-cut to it's own layer.
        if(allPaths[i].stroked == true){
            if(allPaths[i].strokeColor.spot != undefined){
                if(allPaths[i].strokeColor.spot.name == "Thru-cut"){
                    allPaths[i].move(createLayer("Thru-cut", false), ElementPlacement.PLACEATBEGINNING);
                    continue;
                }
            }
        }
    }

    try{
        doc.layers.getByName("Extras").remove();
    }catch(e){}

    var allPaths = doc.pathItems;
    for(i=0; i<allPaths.length; i++){
        if(allPaths[i].layer.name == "Thru-cut" || allPaths[i].layer.name == "Extras"){
            continue;
        }

        var pathColor = {
            fill: allPaths[i].filled == true ? allPaths[i].fillColor.spot != undefined : null ? allPaths[i].fillColor.spot.name : null,
            stroke: allPaths[i].stroked == true ? allPaths[i].strokeColor.spot != undefined : null ? allPaths[i].strokeColor.spot.name : null,
            cyan: Math.floor(allPaths[i].fillColor.cyan),
            magenta : Math.floor(allPaths[i].fillColor.magenta),
            yellow: Math.floor(allPaths[i].fillColor.yellow),
            black: Math.floor(allPaths[i].fillColor.black)
        }

        var vinylData = readDatabase_cutVinyl(pathColor);
            
        if(allPaths[i].stroked == false && allPaths[i].filled == false){
            //allPaths[i].remove();
            
        }else if(app.activeDocument.pathItems[i].parent.typename == "CompoundPathItem"){
            var cvLayer = createLayer(vinylData.name, true);
                allPaths[i].parent.move(cvLayer, ElementPlacement.PLACEATEND);

        }else{
            var cvLayer = createLayer(vinylData.name, true);
                allPaths[i].move(cvLayer, ElementPlacement.PLACEATEND);
        }
    }

        deleteEmptyLayers();

    try{
        doc.layers.getByName("Layer 1").remove();
    }catch(e){}

    var allLayers = doc.layers

    // Merge all elements on the layer.
    for(var i=0; i<allLayers.length; i++){
        if(allLayers[i].name == "Thru-cut" || allLayers[i].name == "Extras" || allLayers[i].name == "Layer 1" || allLayers[i].name == "Undefined Color"){
            continue;
        }
        colors++
        var layerItems = allLayers[i].pathItems && allLayers[i].pageItems;
        for(var k=layerItems.length-1;  k>=0; k--){ 
            layerItems[k].selected = true;
        }
            app.doScript('Unite Paths', 'BatchScripts');
            app.executeMenuCommand('deselectall');
    }

        fitArtboardToArt();

    // Create corner registration marks for multicolor alignment.
    for(var n=0; n<allLayers.length; n++){

        if(allLayers[n].name == "Thru-cut" || allLayers[n].name == "Extras" || allLayers[n].name == "Layer 1"){
            continue;
        }

        var abTop = doc.cropBox[1];
        var abLeft = doc.cropBox[0];
        var abWidth = doc.width;
        var abHeight = doc.height;
        var regmarkSize = .35 * 72;
        
            doc.activeLayer = doc.layers[n]
        
        var regmarkLayer = doc.layers[n];
        
        if(colors > 1){
            createStar(abLeft - (.5*72), abTop + (.5*72), regmarkSize, 3);
            createStar(abLeft + abWidth + (.5*72), abTop - abHeight - (.5*72), regmarkSize, 3);
        }

        var weedBorder = regmarkLayer.pathItems.roundedRectangle(abTop + (1 * 72), abLeft - (1 * 72), abWidth + (2 * 72), abHeight + (2 * 72), 0, 0);
            weedBorder.pixelAligned = false;
            weedBorder.stroked = true;
            weedBorder.filled = false;
            weedBorder.name = "Kiss-cut";
            weedBorder.strokeWidth = 1;
            weedBorder.strokeColor = doc.swatches.getByName("Kiss-cut").color;
    }

    // Mirror for second surface applications
    if(data.secondSurface){
        for(var n=0; n<allLayers.length; n++){
            var totalMatrix = app.getScaleMatrix(-100,100);  
            var newGroup = allLayers[n].groupItems.add();  
            for(var a = allLayers[n].pageItems.length-1; a > 0; a--){  
                app.activeDocument.layers[n].pageItems[a].moveToBeginning(newGroup);
            }
            newGroup.transform(totalMatrix);
        }
    }

    // Color each path with the color of the vinyl.
    var elements = doc.pathItems;
    for(var m=0; m<elements.length; m++){
        elements[m].filled = false;
        elements[m].stroked = true;
        elements[m].strokeWidth = 1;
        try{
            if(elements[m].layer.name == "White" || elements[m].layer.name == "Antique White"){
                elements[m].strokeColor = doc.swatches.getByName("Kiss-cut").color;
            }else{
                elements[m].strokeColor = doc.swatches.getByName(elements[m].layer.name + "_cv").color;
            }
        }catch(e){}
    }

        fitArtboardToArt();

}catch(e){
    alert("Error!\n" + e);
}

function createStar(topDim, rightDim, size, points){
    var regMark = regmarkLayer.pathItems.star(topDim, rightDim, size, size/2, points);
        regMark.filled = false;
        regMark.stroked = true;
        regMark.strokeWidth = 1;
        regMark.strokeColor = doc.swatches.getByName("Kiss-cut").color;
        regMark.name = "regmark"
}