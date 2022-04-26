function makeOrGetFolder(path){
    if(!(Folder(path)).exists){
        new Folder(path).create();
    }
    var folder = new Folder(path);
    return folder;
}

function createLayer(name, print){
    var $doc = app.activeDocument;

    var color = makeRGBColor(0,0,0);
        if(name == "White"){color = makeRGBColor(216,0,122)}
        if(name == "Art"){color = makeRGBColor(79,128,255);}
        if(name == "Hole-cut"){color = makeRGBColor(0,159,238)}
        if(name == "Thru-cut"){color = makeRGBColor(255,79,79)}
        if(name == "regmark"){color = makeRGBColor(79,255,79)}
        if(name == "Crease-cut"){color = makeRGBColor(216,0,122)}
        if(name == "Kiss-cut"){color = makeRGBColor(255,241,0)}
        if(name == "DS Marks"){color = makeRGBColor(26,24,24)}
    
    try{
        var createLayer = $doc.layers.getByName(name);
    }catch(e){
        if($doc.activeLayer.name == "Layer 1" && name == "Art"){
            var createLayer = $doc.activeLayer;
        }else{
            var createLayer = $doc.layers.add();
        }
        createLayer.name = name;
    }
    
        createLayer.printable = print;
        createLayer.color = color;
    
    return createLayer;
}

function fitArtboardToArt(){
    var $doc = app.activeDocument;

        app.executeMenuCommand('selectall');
        $doc.fitArtboardToSelectedArt(0);
        app.executeMenuCommand('deselectall');
}

function lockLayers(){
    var $doc = app.activeDocument;

    for (var i = 0; i < $doc.layers.length; i++){    
        $doc.layers[i].locked = true;
    }
}

function unlockLayers(inputArray){
    var $doc = app.activeDocument;

    for (var i = 0; i < $doc.layers.length; i++){    
        if(inputArray == undefined){
            $doc.layers[i].locked = false
        }else{
            var curLayer = $doc.layers[i]; 
            for (var j = 0; j < inputArray.length; j++) {
                if (curLayer.name == inputArray[j]) {  
                    curLayer.locked = false; 
                }
            }
        }
    }
}

function deleteEmptyLayers(){
    var doc = app.activeDocument;
    var layers = doc.layers

    for(var i=layers.length-1; i>=0; i--){
        if(layers[i].pageItems.length == 0){
            layers[i].remove();
        }
    }
}

// Save functions -------------------
function savePDFFile(destination, filename, pdfSettings){
    var $doc = app.activeDocument;
    
    var pdfOptions = new PDFSaveOptions();
        pdfOptions.pDFPreset = pdfSettings;
    
    var pdfFile = new File(destination + "/" + filename + ".pdf");
           
        $doc.saveAs(pdfFile, pdfOptions)
    
    return pdfFile;
    
}

function saveEPSFile(destination, filename){
    var $doc = app.activeDocument;
    
    var epsOpts = new EPSSaveOptions();
   	    epsOpts.compatibility = Compatibility.ILLUSTRATOR8;
   	    epsOpts.generateThumbnails = true;
        epsOpts.preserveEditability = true;
   	    epsOpts.useArtboards = true;
   	    epsOpts.preserveapperance = true;  
   	    epsOpts.artBoardClipping = true;
    
    var epsFile = new File(destination + "/" + filename + ".eps");
    
        $doc.saveAs(epsFile, epsOpts);
    
    return epsFile;
    
}

function saveAIFile(destination, filename){
    var $doc = app.activeDocument;
    
    var aiOpts = new IllustratorSaveOptions();
   	    aiOpts.compatibility = Compatibility.ILLUSTRATOR8;
    
    var aiFile = new File(destination + "/" + filename + ".ai");
    
        $doc.saveAs(aiFile, aiOpts);
    
    return aiFile;
    
}

// Color Functions -------------------
function addSwatches(){
    var $doc = app.activeDocument;
    if($doc.documentColorSpace == "DocumentColorSpace.RGB"){
        addRGBSwatches();  //This can be called directly
    }
    
    if($doc.documentColorSpace == "DocumentColorSpace.CMYK"){
       addCMYKSwatches();  //This can be called directly
    }
}

function addCutVinylSwatches(){
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_cutVinyl-slc.csv");
    
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
            while(!csvFile.eof){
                var line = csvFile.readln();
                    line = line.replace(/\"/g,' ');
                var detailsArray = line.split(',');
                if(detailsArray[0] != "name"){
                    //createRgbSwatch("CutVinyl", detailsArray[0] + "_cv", Number(detailsArray[3]), Number(detailsArray[4]), Number(detailsArray[5]))
                    createCmykSwatch("CutVinyl", detailsArray[0] + "_cv", Number(detailsArray[6]), Number(detailsArray[7]), Number(detailsArray[8]), Number(detailsArray[9]))
                }
            }
        csvFile.close();
    }
}

function addRGBSwatches(){
    var $doc = app.activeDocument;

    createRgbSwatch('Zund','Thru-cut',231,126,0);
    createRgbSwatch('Zund','Hole-cut',116,107,176);
    createRgbSwatch('Zund','Contour-cut',128,189,39);
    createRgbSwatch('Zund','Kiss-cut',49,176,212);
    createRgbSwatch('Zund','Crease-cut',216,0,23);
    createRgbSwatch('Zund','Small-cut',26,0,153);
    
    createRgbSwatch('Router','Outside-cut',0,157,167);  
    createRgbSwatch('Router','Inside-cut',0,194,176);  
    createRgbSwatch('Router','Centerline-cut',173,70,149); 

    createRgbSwatch('Other','WhiteSpot',215,0,122);
    createRgbSwatch('Other','Varnish',246,191,0);
    createRgbSwatch('Other','Regmark',0,0,0);

    createRgbSwatch('Auto','autoBlack',0,0,0);
    createRgbSwatch('Auto','autoGray',175,175,175);
    createRgbSwatch('Auto','autoWhite',255,255,255);
    createRgbSwatch('Auto','autoPolish',255,0,0);
    createRgbSwatch('Auto','autoLaminate',146,39,143);
}

function addCMYKSwatches(){
    var $doc = app.activeDocument;

    createCmykSwatch('Zund','Thru-cut',0,50,100,0);  
    createCmykSwatch('Zund','Hole-cut',51,50,0,0);
    createCmykSwatch('Zund','Contour-cut',50,0,100,0);
    createCmykSwatch('Zund','Kiss-cut',72,0,12,0);  
    createCmykSwatch('Zund','Crease-cut',0,100,100,0); 

    createCmykSwatch('Router','Outside-cut',100,0,35,0);  
    createCmykSwatch('Router','Inside-cut',100,50,0,0);  
    createCmykSwatch('Router','Centerline-cut',22,76,0,0); 

    createCmykSwatch('Other','WhiteSpot',0,100,0,0);
    createCmykSwatch('Other','Varnish',0,20,100,0);
    createCmykSwatch('Other','Regmark',0,0,0,100);
    
    createCmykSwatch('Auto','autoBlack',0,0,0,100);
    createCmykSwatch('Auto','autoGray',0,0,0,30);
    createCmykSwatch('Auto','autoWhite',0,0,0,0);
    createCmykSwatch('Auto','autoPolish',0,100,100,0);
    createCmykSwatch('Auto','autoLaminate',50,100,0,0);
}

function createCmykSwatch(g,n,c,m,y,k){  
    var $doc = app.activeDocument;
    var group, sw;  
    try{  
        group = $doc.swatchGroups.getByName(g);  
    }catch(e){  
        group = $doc.swatchGroups.add();  
        group.name = g;  
    }  
    try{  
        sw = $doc.spots.getByName(n);  
    }catch(e){  
        sw = $doc.spots.add();  
        sw.colorType = ColorModel.SPOT;  
        sw.name = n;  
        sw.color.cyan = c;  
        sw.color.magenta = m;  
        sw.color.yellow = y;  
        sw.color.black = k;  
    }  
        sw = $doc.spots.getByName(n);  
        group.addSpot(sw);
}

function createRgbSwatch(g,n,red,green,blue){
    var $doc = app.activeDocument;
    var group, sw;  
    try{  
        group = $doc.swatchGroups.getByName(g);  
    }catch(e){  
        group = $doc.swatchGroups.add();  
        group.name = g;  
    }
    try{  
        sw = $doc.spots.getByName(n);  
    }catch(e){  
        sw = $doc.spots.add();  
        sw.colorType = ColorModel.SPOT;  
        sw.name = n;
        sw.color.red = red;  
        sw.color.green = green;  
        sw.color.blue = blue;  
    }  
        sw = $doc.spots.getByName(n);  
        group.addSpot(sw);  
}

function makeRGBColor(r,g,b){
    if(r > 255){r = 255}; if(r < 0){r = 0};
    if(g > 255){g = 255}; if(g < 0){g = 0};
    if(b > 255){b = 255}; if(b < 0){b = 0};
        var color = new RGBColor();
            color.red = r;
            color.green = g;
            color.blue = b;
        return color;
}

function makeCMYKColor(c,m,y,k){
    if(c > 100){c = 100}; if(c < 0){c = 0};
    if(m > 100){m = 100}; if(m < 0){m = 0};
    if(y > 100){y = 100}; if(y < 0){y = 0};
    if(k > 100){k = 100}; if(k < 0){k = 0};
        var color = new CMYKColor;
            color.cyan = c;
            color.magenta = m;
            color.yellow = y;
            color.black = k;
        return color;
}

// Database Functions -------------------
function readDatabase_cutVinyl(query){

    var tolerance = 5

    var cvInfo = {
        match: false,
        name: "Undefined Color"
    }
    
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_cutVinyl-slc.csv");
        csvFile.open(File.ReadOnly);

    while(!csvFile.eof){
        var line = csvFile.readln();
            line = line.replace(/\"/g,' ');
        var detailsArray = line.split(',');

        if(detailsArray[11] == query.fill){
            cvInfo.match = true;
            break;
        }

        if((Math.abs(detailsArray[6] - query.cyan) < tolerance) &&
        (Math.abs(detailsArray[7] - query.magenta) < tolerance) && 
        (Math.abs(detailsArray[8] - query.yellow) < tolerance) && 
        (Math.abs(detailsArray[9] - query.black) < tolerance)){
            cvInfo.match = true;
            break;
        }
    }

        csvFile.close();

    if(cvInfo.match){
        cvInfo.name = detailsArray[0];
        cvInfo.hexID = detailsArray[1];
        cvInfo.dataID = detailsArray[2];
        cvInfo.red = Number(detailsArray[3]);
        cvInfo.green = Number(detailsArray[4]);
        cvInfo.blue = Number(detailsArray[5]);
        cvInfo.cyan = Number(detailsArray[6]);
        cvInfo.magenta = Number(detailsArray[7]);
        cvInfo.yellow = Number(detailsArray[8]);
        cvInfo.black = Number(detailsArray[9]);
        cvInfo.width = Number(detailsArray[10]);
        cvInfo.swatchName = detailsArray[11];
    }

    return cvInfo;
}

function readDatabase_phoenix_old(query){
    writeFunctionUsage("readDatabase_phoenix")
    var phoenixInfo = {};
        phoenixInfo.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_phoenix.csv");
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
            var detailsArray = line.split(',');
            if(detailsArray[1] == query){
                phoenixInfo.match = true;
                phoenixInfo.prodName = detailsArray[1];
                phoenixInfo.approved = detailsArray[2].toLowerCase() == "true" ? true : false;
                phoenixInfo.rotation = detailsArray[3];
                phoenixInfo.spacing = detailsArray[4];
                phoenixInfo.bleed = Number(detailsArray[5]);
                phoenixInfo.width = Number(detailsArray[6]);
                phoenixInfo.height = Number(detailsArray[7]);
                phoenixInfo.approvedRotations = Number(detailsArray[8]);
                phoenixInfo.bottomBarcode = detailsArray[9];
                phoenixInfo.nestingMethod = detailsArray[10];
                phoenixInfo.version = detailsArray[11];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Phoenix database missing.");
    }
    return phoenixInfo;
}

function readDatabase_phoenix(query){
    writeFunctionUsage("readDatabase_phoenix_DEV")
    var phoenixInfo = {};
        phoenixInfo.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_phoenix_v2.csv");
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
            var detailsArray = line.split(',');
            if(detailsArray[1] == query){
                phoenixInfo.match = true;
                phoenixInfo.prodName = detailsArray[1];
                phoenixInfo.approved = detailsArray[2].toLowerCase() == "true" ? true : false;
                phoenixInfo.rotation = detailsArray[3];
                phoenixInfo.spacingType = detailsArray[4];
                phoenixInfo.spacing = detailsArray[5];
                phoenixInfo.spacingTop = detailsArray[6];
                phoenixInfo.spacingBottom = detailsArray[7];
                phoenixInfo.spacingLeft = detailsArray[8];
                phoenixInfo.spacingRight = detailsArray[9];
                phoenixInfo.bleed = Number(detailsArray[10]);
                phoenixInfo.width = Number(detailsArray[11]);
                phoenixInfo.height = Number(detailsArray[12]);
                phoenixInfo.approvedRotations = Number(detailsArray[13]);
                phoenixInfo.bottomBarcode = detailsArray[14];
                phoenixInfo.nestingMethod = detailsArray[15];
                phoenixInfo.version = detailsArray[16];
                phoenixInfo.gsmStandard = detailsArray[17];
                phoenixInfo.gsmOversize = detailsArray[18];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Phoenix database missing.");
    }
    return phoenixInfo;
}

function readDatabase_phoenixSheetOverride(query){
    var phoenixOverride = []
    var phoenixInfo = {};
        phoenixInfo.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_phoenixSheetOverrides.csv");
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
            var detailsArray = line.split(',');
            if(detailsArray[1] == query && detailsArray[4].toLowerCase() == "true"){
                phoenixInfo.match = true;
                phoenixInfo.prodName = detailsArray[1];
                phoenixInfo.width = detailsArray[2];
                phoenixInfo.height = detailsArray[3];
                phoenixOverride.push(phoenixInfo)
            }
        }
        csvFile.close();
    }else{
        alert("Phoenix override database missing.");
    }
    return phoenixOverride;
}

function readDatabase_cereberus(query){
    var cereberusInfo = {};
        cereberusInfo.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_cereberus.csv");
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
            var detailsArray = line.split(',');
            if(detailsArray[0] == query){
                cereberusInfo.match = true;
                cereberusInfo.id = detailsArray[0];
                cereberusInfo.prodName = detailsArray[1];
                cereberusInfo.approved = detailsArray[2].toLowerCase() == "true" ? true : false;
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Cereberus database missing.");
    }
    return cereberusInfo;
}

function readDatabase_printers(query){
    var printerInfo = {};
        printerInfo.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_printers.csv");
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
            var detailsArray = line.split(',');
            if(detailsArray[0] == query || detailsArray[1] == query){
                printerInfo.match = true;
                printerInfo.printer = detailsArray[1];
                printerInfo.printListName = detailsArray[2];
                printerInfo.margin = {}
                printerInfo.margin.top = Number(detailsArray[3]);
                printerInfo.margin.bottom = Number(detailsArray[4]);
                printerInfo.margin.left = Number(detailsArray[5]);
                printerInfo.margin.right = Number(detailsArray[6]);
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Printer database missing.");
    }
    return printerInfo;
}

function readDatabase_cutters(query, pathQuery){
    var cutterInfo = {};
        cutterInfo.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_cutters.csv");
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
            var detailsArray = line.split(',');
            if(detailsArray[0] == query || detailsArray[1] == query){
                cutterInfo.match = true;
                cutterInfo.id = detailsArray[0];
                cutterInfo.name = detailsArray[1];
                cutterInfo.layer = {}
                cutterInfo.layer.thru = detailsArray[2];
                cutterInfo.layer.rounded = detailsArray[3];
                cutterInfo.layer.contour = detailsArray[4];
                cutterInfo.layer.drill = detailsArray[5];
                cutterInfo.preferredPath = detailsArray[pathQuery];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Cutter database missing.");
    }
    return cutterInfo.preferredPath;
}

function readDatabase_autopaths(query, matInfo, objectUsage){
    var pathInfo = {};
        pathInfo.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_autopaths.csv");
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
            var detailsArray = line.split(',');
            if((detailsArray[2] == query.red &&
                detailsArray[3] == query.green &&
                detailsArray[4] == query.blue) || 
                (detailsArray[1] == query.spotName)){
                    pathInfo.match = true;
                    pathInfo.id = detailsArray[0];
                    pathInfo.spotName = detailsArray[1];
                    pathInfo.red = detailsArray[2];
                    pathInfo.green = detailsArray[3];
                    pathInfo.blue = detailsArray[4];
                    pathInfo.usage = detailsArray[5];

                   // pathInfo.preferredPath = readDatabase_cutters(matInfo.cutter, objectUsage <= 100 && pathInfo.usage != "Hole-cut" ? 6 : detailsArray[6]);
                    pathInfo.preferredPath = readDatabase_cutters(matInfo.cutter, detailsArray[6]);

                    break;
            }
        }
        csvFile.close();
    }else{
        alert("Autopath database missing.");
    }
    return pathInfo;
}

function readDatabase_baseFolder(query){

    var standardFolder = "Unknown";
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_folders.csv");
    
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
                line = line.split(',');
            if(line[0] == query){
                standardFolder = line[1];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Folder database missing.");
    }

    return standardFolder;
}

function readDatabase_ripFlow(query){

    var ripFlow
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_ripFlows.csv");
    
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
                line = line.split(',');
            if(line[0] == query){
                ripFlow = line[1];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("RipFlow database missing.");
    }

    return ripFlow;
}

function readDatabase_asantiHotfolder(query){

    var hotfolder
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_asantiHotfolders.csv");
    
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
                line = line.split(',');
            if(line[0] == query){
                hotfolder = line[1];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Asanti Hotfolder database missing.");
    }

    return hotfolder;
}

function readDatabase_cutFolder(query){

    var cutfolder
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_cutfolders.csv");
    
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
                line = line.split(',');
            if(line[0] == query){
                cutfolder = line[1];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("CutFolder database missing.");
    }

    return cutfolder;
}

function readDatabase_process(query){

    var process
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_processes.csv");
    
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
                line = line.split(',');
            if(line[0] == query){
                process = line[1];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Process database missing.");
    }

    return process;
}

function readDatabase_hemSpecs(query){

    var hemSpecs = {}
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_hemSpecs.csv");
    
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
                line = line.split(',');
            if(line[0] == query){
                hemSpecs.type = line[1];
                hemSpecs.hem = line[2];
                hemSpecs.pocket = line[3];
                hemSpecs.dashOffsetHem = line[4];
                hemSpecs.dashOffsetPocket = line[5];
                hemSpecs.labelOffsetTop = line[6];
                hemSpecs.labelOffsetBottom = line[7];
                hemSpecs.labelOffsetLeft = line[8];
                hemSpecs.labelOffsetRight = line[9];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("Hem specs database missing.");
    }

    return hemSpecs;
}

function readDatabase_userData(query){ //10.19.20

    var userData = {};
        userData.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/database_userData.csv");

    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
                line = line.split(',');
            if(line[0].toLowerCase() == query.toLowerCase() || line[1].toLowerCase() == query.toLowerCase() || line[2].toLowerCase() == query.toLowerCase()){
                userData.match = true;
                userData.login = line[0];
                userData.macLogin = line[1];
                userData.first = line[2];
                userData.last = line[3];
                userData.initials = line[4];
                userData.email = line[5];
                break;
            }
        }
        csvFile.close();
    }else{
        alert("UserData database missing.");
    }

    return userData;
}

function readDatabase_userOptions(userData, query, defaultValue){ //10.19.20
    var userOptions = {}
        userOptions.match = false;

    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/User Options/database_userOptions_" + userData.first + "-" + userData.last + ".csv");

    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
        while(!csvFile.eof){
            var line = csvFile.readln();
                line = line.replace(/\"/g,' ');
                line = line.split(',');
            if(query == null){
                userOptions[line[0]] = line[1];
            }else{
                if(line[0] == query){
                    //alert("Match found in database")
                    userOptions.match = true
                    return line[1];
                }
            }
        }
        csvFile.close();

    }else{
        //alert("Creating user options database for " + userData.first + " " + userData.last + ".");
        writeDatabase_userOptions(userData, null);
    }

    if(!userOptions.match && query != null){
        //alert("Returning default value")
        return defaultValue;
    }

    //alert("Returning all options")
    return userOptions;
}

function writeDatabase_userOptions(userData, fieldArray){
    var temp = []
    var csvFile = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/User Options/database_userOptions_" + userData.first + "-" + userData.last + ".csv");

    // Read the current settings to array.
    csvFile.open(File.ReadOnly);
    while(!csvFile.eof){
        var line = csvFile.readln();
            line = line.replace(/\"/g,' ');
            line = line.split(',');
        temp.push([line[0],line[1]])
    }
    csvFile.close();

    // Change the array to account for the new passed in setting.
    if(fieldArray != null){
        for(var k=0; k<fieldArray.length; k++){
            var fieldMatch = false;
            for(var l in temp){
                if(temp[l][0] == fieldArray[k][0]){
                    temp[l].splice(1,1,fieldArray[k][1])
                    fieldMatch = true;
                    break
                }
            }
            if(!fieldMatch){
                temp.push([fieldArray[k][0],fieldArray[k][1]])
            }
        }
    }
        
    // Rewrite the file with the new settings.
    csvFile.open('w');
    for(var j=0; j<temp.length; j++){
        csvFile.writeln(temp[j][0] + "," + temp[j][1]);
    }
    csvFile.close();
}

// Data Functions -------------------
function readInTextFile(file){
    if(file.exists){
        file.open('r');
        var line = file.read();
        file.close();
    return line;
    }
}

function readInCSV(fileObj){  
    var fileArray, thisLine, csvArray;  
        fileArray = [];
        fileObj.open('r');  

    while(!fileObj.eof){  
        thisLine = fileObj.readln();  
        thisLine = thisLine.replace(/"/g,'');
        csvArray = thisLine.split(',');  
        fileArray.push(csvArray);
    }
        fileObj.close();  
    return fileArray;
}

function loadXmlFile(location){
    var xmlFile = File(location);
    if(!xmlFile.exists){
        throw "Error Code: 0004"
    }
        xmlFile.encoding = "UTF8"; 
        xmlFile.lineFeed = "unix"; 
        xmlFile.open("r", "TEXT", "????"); 
    
    var str = xmlFile.read(); 
        xmlFile.close(); 
    
    return new XML(str); 
}

function writeXmlLine(xmlFile, xmlLabel, xmlVariable){
    xmlFile.write("<" + xmlLabel + ">");
    xmlFile.write(xmlVariable);
    xmlFile.writeln("</" + xmlLabel + ">");
}

function updateStatusID(uniqueID, status){
    var xmlF = File(makeOrGetFolder(platform.directory + "/Prepress/Private/_Handoffs/Status ID/" + status + "/") + "/" + uniqueID + ".xml");
        xmlF.open("w");
        xmlF.writeln('<?xml version="1.0" encoding="UTF-8"?>');
        xmlF.writeln("<data>");

        writeXmlLine(xmlF, "ID", uniqueID);

        xmlF.writeln("</data>");
        xmlF.close();
}

function loadLocalData(file){
    // This function is build for mac only currently.
    var folder = Folder("/Users/" + platform.username + "/Data")
        if(!folder.exists){
            new Folder(folder).create();
        }

    var userXML = new File(folder + "/" + file);
        if(!userXML.exists){
            if(file == "userInfo_UserData.xml"){
                userXML = getNewUserInfo(userXML);
            }else{
                userXML.open("w");
                userXML.writeln('<?xml version="1.0" encoding="UTF-8"?>');
                userXML.writeln("<data>");

                // These will be the defaults for first time runs.
                writeXmlLine(userXML, "close_file", 'true'); //FileHandler default
                writeXmlLine(userXML, "selection", '0'); //MaterialOrder default

                userXML.writeln("</data>");
                userXML.close();
            }
        }
    return userXML;
}

function writeFileNumber(number){

    var currentNumber = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/fileNumber.txt");



    number++

    if(number >= 1000)
        number = 001;

    var numZeropad = number + '';
    while(numZeropad.length < 3) {
        numZeropad = "0" + numZeropad;
    }

        currentNumber.open('w');
        currentNumber.write(numZeropad);
        currentNumber.close();
}

function logErrors(filename, e, process){
        var errorsFile = new File(platform.directory + "/Prepress/Data/Anomolies/" + filename + ".txt");

        errorsFile.open('a', undefined, undefined);
        errorsFile.writeln(filename + ", " + process + ", " + e);
        errorsFile.close();
}

function logSwitchPrepData(script, data, status, e){
    if(e == null){
        e = data.file.art.modified;
    }
    var prepLog = new File(data.folder.api + "/PrepLog_" + status + ".txt");
        prepLog.open('a');
        prepLog.writeln(data.file.original + "," + date + "," + script.name + "," + e);
        prepLog.close();
}

function getBroadData(fileNumber, material){
    var tempData = null
    var broadLocation = new Folder(platform.directory + "/Prepress/Signs_Jobs/_Incoming/Data/").getFiles().reverse();;
    for(var k=0; k<broadLocation.length; k++){
        var tempLocation = new Folder(broadLocation[k] + "/" + material + "/")
        var dataFile = File(tempLocation.getFiles("*" + fileNumber + "*_Data.xml"))
        if(dataFile.exists){
            tempData = loadXmlFile(dataFile);
            break;
        }
    }
    return tempData;
}

// User Data Functions -------------------
function getUserFolders(dir){
    var userFolders = [];
    var userDir = dir.ready.getFiles();

    for(var i=0; i<userDir.length; i++){
        if(userDir[i] instanceof Folder){
            userFolders.push(decodeURI(userDir[i].name));
        }
    }

   return userFolders;
}

function writeData_Finalize(xmlF){
    writeFunctionUsage("writeData_Finalize")
    xmlF.open("w");
    xmlF.writeln('<?xml version="1.0" encoding="UTF-8"?>');
    xmlF.writeln("<data>");

    writeXmlLine(xmlF, "job_number", jobDropdown.selection);
    writeXmlLine(xmlF, "selection", jobDropdown.selection.index);
    writeXmlLine(xmlF, "remove_input", removeInput.value);

    xmlF.writeln("</data>");
    xmlF.close();
}

function writeData_SortFiles(xmlF){
    writeFunctionUsage("writeData_SortFiles")
    xmlF.open("w");
    xmlF.writeln('<?xml version="1.0" encoding="UTF-8"?>');
    xmlF.writeln("<data>");

    writeXmlLine(xmlF, "selection", jobDropdown.selection.index);

    xmlF.writeln("</data>");
    xmlF.close();
}

function writeData_MergeFiles(xmlF){
    writeFunctionUsage("writeData_MergeFiles")
    xmlF.open("w");
    xmlF.writeln('<?xml version="1.0" encoding="UTF-8"?>');
    xmlF.writeln("<data>");

    writeXmlLine(xmlF, "activeJob", activeJobList.selection.index);
    writeXmlLine(xmlF, "mergeJob", mergeJobList.selection.index);

    xmlF.writeln("</data>");
    xmlF.close();
}

function writeData_FileHandler(xmlF){
    writeFunctionUsage("writeData_FileHandler")
    xmlF.open("w");
    xmlF.writeln('<?xml version="1.0" encoding="UTF-8"?>');
    xmlF.writeln("<data>");

    writeXmlLine(xmlF, "selection", jobDropdown.selection.index);
    writeXmlLine(xmlF, "close_file", closeDocument.value);
    //writeXmlLine(xmlF, "actions_modified", batchActions);

    xmlF.writeln("</data>");
    xmlF.close();
}

function writeData_MaterialOrder(xmlF){
    writeFunctionUsage("writeData_MaterialOrder")
    xmlF.open("w");
    xmlF.writeln('<?xml version="1.0" encoding="UTF-8"?>');
    xmlF.writeln("<data>");

    writeXmlLine(xmlF, "selection", shiftDropdown.selection.index);

    xmlF.writeln("</data>");
    xmlF.close();
}

function writeData_UserData(xmlF){
    writeFunctionUsage("writeData_UserData")
    xmlF.open("w");
    xmlF.writeln('<?xml version="1.0" encoding="UTF-8"?>');
    xmlF.writeln("<data>");

    writeXmlLine(xmlF, "name", jobDropdown.selection.index);
    writeXmlLine(xmlF, "initials", closeDocument.value);

    xmlF.writeln("</data>");
    xmlF.close();
}

function writeData_Phoenix(xmlF){
    writeFunctionUsage("writeData_Phoenix")
    xmlF.open("w");
    xmlF.writeln('<?xml version="1.0" encoding="UTF-8"?>');
    xmlF.writeln("<data>");

    writeXmlLine(xmlF, "selection", jobDropdown.selection.index);

    xmlF.writeln("</data>");
    xmlF.close();
}

// Technical Functions -------------------
function funcToBT(f){
    var version = app.version.split('.')[0];
    var bt = new BridgeTalk();
        //bt.target = "illustrator-" + version;
        bt.target = "illustrator"
    var script = asSourceString(f);
        bt.body = script;
        bt.send();
        bt.onResult = function(resObj){
            return resObj.body;  
        };
}

function asSourceString(func){
    return func.toSource().toString().replace("(function "+func.name+"(){","").replace(/}\)$/,""); 
}

function skuGenerator(length, type, dataLocation){
    if(dataLocation == "global"){
        var skuLog = new File(platform.directory + "/Prepress/Private/Scripts/Resources/Data Files/SKU/skuNumbers_" + length + "digit.txt");
    }else{
        var curJob = makeOrGetFolder(platform.directory + "/Prepress/Signs_Jobs/Processed/" + dataLocation + "/Data/")
        var skuLog = new File(curJob + "/skuNumbers_" + length + "digit.txt");
    }

    var result = '';

    if(type == 'alpha_uppercase'){
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }else if(type == 'alpha_lowercase'){
        var chars = 'abcdefghijklmnopqrstuvqxys';
    }else if(type == 'numeric'){
        var chars = '0123456789';
    }else if(type == 'alphanumeric_uppercase'){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }else if(type == 'alphanumeric_lowercase'){
        var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    }else if(type == 'all'){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    }else{
        alert("Input SKU parameters");
        return
    }

    makeSKU();

    function makeSKU(){
        // Make a SKU.
        for(var i=length; i>0; --i){
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        }

        // Check and see if the SKU is already in use.
            skuLog.open(File.ReadOnly);
        var lines = skuLog.read().split('\n');
            for(i=0; i<lines.length; i++){
                if(lines[i] == result){
                    // If it's in use then search again.
                    skuLog.close();
                    result = '';
                    makeSKU();
                }
            }
            skuLog.close();
    }

        skuLog.open('a', undefined, undefined);
        skuLog.writeln("");
        skuLog.write(result);
        skuLog.close(); 

    return result;
}

function milSecTommss(milS){
    
    var seconds = milS / 1000;
    var min = 0;
    var remSec
    var hr = 0;

    if(seconds >= 60){
        min = seconds / 60;
        min = Math.round(min);
        remSec = seconds - (min * 60);
        remSec = Math.round(remSec);
    }else{
        remSec = Math.round(seconds);
    };
    
    if(min >= 60){
        hr = min / 60;
        hr = hr.toString ();
    var hrA = hr.split ('.');
        if(hrA.length > 1){
            hr = hrA[0];
                var b = '.'+hrA[1];
                    min = b * 60;
                    min = Math.round(min);
        }else{min = 0;};
            hr = "00"+hr;
            hr = hr.slice (hr.length -2, hr.length);
    };  
    
    hr = "00"+hr;
    hr = hr.slice(hr.length -2, hr.length);
    min = "00"+min;
    min = min.slice (min.length -2, min.length);
    remSec ="00"+remSec;
    remSec = remSec.slice(remSec.length - 2, remSec.length);
    
    return hr+":"+ min + "." + remSec;
}

function dateObj(d){
    var parts = d.split(/:|\s/),
        date  = new Date();
    if (parts.pop().toLowerCase() == 'pm') parts[0] = (+parts[0]) + 12;
    date.setHours(+parts.shift());
    date.setMinutes(+parts.shift());
    return date;
}

function getShipDate(){
    writeFunctionUsage("getShipDate")
    var today = new Date();

    var tomorrow = new Date(today);
        tomorrow.setDate(today.getDate()+1);
        
        // Adjusts for working on Friday, for Monday ship.
        if(tomorrow.getDay() == 6){
            tomorrow.setDate(today.getDate()+3)
        }
        
        // Adjusts if we are working on Saturday, for Monday ship..
        if(tomorrow.getDay() == 0){
            tomorrow.setDate(today.getDate()+2)
        }

    var weekday = tomorrow.toString().split(' ')[0];
    var month = tomorrow.toString().split(' ')[1];
    var day = tomorrow.toString().split(' ')[2];
    var year = tomorrow.toString().split(' ')[3];

    var shipdate = weekday + ", " + month + " " + day + ", " + year

    if(rework.value){
        shipdate = "Rework! Ship ASAP!"
    }

    return shipdate;
}

function getNextShipDate(module){
    writeFunctionUsage("getNextShipDate")
    var today = new Date();
    var daysTillNextShip
    var shipDate = {}

    var dayOfWeek = today.getDay();
    if(dayOfWeek == 0){daysTillNextShip = 1} // Sunday
    if(dayOfWeek == 1){daysTillNextShip = 1} // Monday
    if(dayOfWeek == 2){daysTillNextShip = 1} // Tuesday
    if(dayOfWeek == 3){daysTillNextShip = 1} // Wednesday
    if(dayOfWeek == 4){daysTillNextShip = 1} // Thursday
    if(dayOfWeek == 5){daysTillNextShip = 3} // Friday
    if(dayOfWeek == 6){daysTillNextShip = 2} // Saturday

    // Holiday overrides.
    //if(dayOfWeek == 5){daysTillNextShip = 4} // If we have a holiday on Monday.

    shipDate.entireDate = new Date(today) //Today

    if(shipDate.entireDate.getHours() >= 04){
        if(module == "Phoenix"){
            if(jobDropdown.selection.toString() == "Working" && !rush.value){
                shipDate.entireDate.setDate(shipDate.entireDate.getDate() + daysTillNextShip) //Tomrrow, or next shipdate if weekend.
            }
        }

        if(module == "Finalize"){
            if(jobDropdown.selection.toString() == "Working"){
                shipDate.entireDate.setDate(shipDate.entireDate.getDate() + daysTillNextShip) //Tomrrow, or next shipdate if weekend.
            }
        }

        if(module == "Compile"){
            if(jobDropdown.selection.toString() == "Working"){
                shipDate.entireDate.setDate(shipDate.entireDate.getDate() + daysTillNextShip) //Tomrrow, or next shipdate if weekend.
            }
        }

        if(module == "ProcessCutVinyl"){
            if(jobDropdown.selection.toString() == "Working"){
                shipDate.entireDate.setDate(shipDate.entireDate.getDate() + daysTillNextShip) //Tomrrow, or next shipdate if weekend.
            }
        }
    }

    shipDate.month = shipDate.entireDate.getMonth()+1
    if(shipDate.month < 10){
		shipDate.month = "0" + shipDate.month;
	}

    shipDate.date = shipDate.entireDate.getDate();
    if(shipDate.date < 10){
		shipDate.date = "0" + shipDate.date;
    }

    return shipDate
}

// InDesign functions -------------------
function createLayerIndd(name, print){
    var $doc = app.activeDocument;
    
    var createLayer = $doc.layers.add();
        createLayer.name = name;
        createLayer.printable = print;
    
    return createLayer;
}

function addSwatchesIndd(){
    var $doc = app.activeDocument
    createCmykSwatch('Thru-cut',0,50,100,0);  
    createCmykSwatch('Hole-cut',51,50,0,0);
    createCmykSwatch('Contour-cut',50,0,100,0);
    createCmykSwatch('Kiss-cut',72,0,12,0);  
    createCmykSwatch('Crease-cut',0,100,100,0); 

    createCmykSwatch('Outside-cut',100,0,35,0);  
    createCmykSwatch('Inside-cut',100,50,0,0);  
    createCmykSwatch('Centerline-cut',22,76,0,0); 

    createCmykSwatch('WhiteSpot',0,100,0,0);
    createCmykSwatch('Varnish',0,20,100,0);
    createCmykSwatch('Regmark',0,0,0,100);
    
    createCmykSwatch('autoBlack',0,0,0,100);
    createCmykSwatch('autoGray',0,0,0,10);
    createCmykSwatch('autoWhite',0,0,0,0);
    createCmykSwatch('autoPolish',0,100,50,0);
    createCmykSwatch('autoLaminate',50,100,0,0);

    function createCmykSwatch(n,c,m,y,k){  
        var sw;  
        //try{  
        //    sw = doc.colors.itemByName(n);  
        //}catch(e){  
            sw = $doc.colors.add();  
            sw.model = ColorModel.SPOT;  
            sw.name = n;  
            sw.colorValue = [c,m,y,k];  
        //}  
        sw = $doc.colors.itemByName(n);  
    }
}