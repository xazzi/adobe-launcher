// Process Functions -------------------
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

function deleteEmptyLayers(){
    var doc = app.activeDocument;
    var layers = doc.layers

    for(var i=layers.length-1; i>=0; i--){
        if(layers[i].pageItems.length == 0){
            layers[i].remove();
        }
    }
}

function fitArtboardToArt(){
    var $doc = app.activeDocument;

        app.executeMenuCommand('selectall');
        $doc.fitArtboardToSelectedArt(0);
        app.executeMenuCommand('deselectall');
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
    var csvFile = new File(platform.local + "/library/color-database.csv");
    var folder
    
    if(csvFile.exists){
        csvFile.open(File.ReadOnly);
            while(!csvFile.eof){
                var line = csvFile.readln();
                    line = line.replace(/\"/g,' ');
                var detailsArray = line.split(',');
                if(detailsArray[0] != "name"){
                    detailsArray[12] == 'y' ? folder = "CutVinyl" : folder = "Discontinued";
                    createCmykSwatch(folder, detailsArray[0] + "_cv", Number(detailsArray[13]), Number(detailsArray[14]), Number(detailsArray[15]), Number(detailsArray[16]))
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

// User Data Functions -------------------
function getUserFolders(dir){
    var userFolders = [];
        userFolders.push("")
    var userDir = dir.ready.getFiles();

    for(var i=0; i<userDir.length; i++){
        if(userDir[i] instanceof Folder){
            userFolders.push(decodeURI(userDir[i].name));
        }
    }

    return userFolders;
}

function makeOrGetFolder(path){
    if(!(Folder(path)).exists){
        new Folder(path).create();
    }
    var folder = new Folder(path);
    return folder;
}

// Database Functions -------------------
function readDatabase_cutVinyl(query){

    var tolerance = 5

    var cvInfo = {
        match: false,
        name: "Undefined Color"
    }
    
    var csvFile = new File(platform.local + "/library/color-database.csv");
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
        cvInfo.enabled = detailsArray[12] == 'y' ? true : false;
        if(!cvInfo.enabled){
            cvInfo.name = detailsArray[0] + " (Discontinued)"
        }
    }

    return cvInfo;
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

function contains(a, obj){
    for(var i=0; i<a.length; i++){
        if(a[i] === obj){
            return true;
        }
    }
    return false;
}

// Data Functions -------------------
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