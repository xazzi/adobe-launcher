var dir = {
    ready: new Folder(platform.directory + "/Prepress/External/Special Process/Butt Cut/Ready/"),
    complete: new Folder(platform.directory + "/Prepress/External/Special Process/Butt Cut/Complete/")
}

// Make the Window
var w = new Window("dialog", "Butt Cut");
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
        processFiles(w);
    }

    w.cancelButton = w.buttonGroup.add ("button", undefined, "Cancel");

w.show()
    
function processFiles(){
    try{
        for(var k=0; k<w.list.selection.length; k++){
            var file = new File(dir.ready + "/" + w.list.selection[k].text)
            app.open(file);

            var doc = app.activeDocument;
            var allPaths = doc.pageItems

            var layer = {
                register: createLayer("register", true),
                thruCut: createLayer("Thru-cut", true)
            }
            
            // Move the regmarks to the register layer.
            var allPaths = doc.pageItems
            for(var i=0; i<allPaths.length; i++){
                if(allPaths[i].filled){
                    var tempLayer = createLayer("register", true);
                    allPaths[i].move(tempLayer, ElementPlacement.PLACEATBEGINNING)
                }
            }

            var perimeter = {
                top: null,
                bottom: null,
                left: null,
                right: null
            }

            var size = {
                width: null,
                height: null
            }

            // Get the locations of the current cut paths.
            var allPaths = doc.pageItems
            for(var i=0; i<allPaths.length; i++){
                allPaths[i].bottom = allPaths[i].top - allPaths[i].height;
                allPaths[i].right = allPaths[i].left + allPaths[i].width;
                if(allPaths[i].stroked){
                    if(allPaths[i].strokeColor.spot.name == "Thru-cut"){
                        size.width == null ? size.width = allPaths[i].width : null;
                        size.height == null ? size.height = allPaths[i].height : null;
                        perimeter.top == null ? perimeter.top = allPaths[i].top : perimeter.top < allPaths[i].top ? perimeter.top = allPaths[i].top : null;
                        perimeter.bottom == null ? perimeter.bottom = allPaths[i].bottom : perimeter.bottom > allPaths[i].bottom ? perimeter.bottom = allPaths[i].bottom : null;
                        perimeter.left == null ? perimeter.left = allPaths[i].left : perimeter.left > allPaths[i].left ? perimeter.left = allPaths[i].left : null;
                        perimeter.right == null ? perimeter.right = allPaths[i].right : perimeter.right < allPaths[i].right ? perimeter.right = allPaths[i].right : null;
                    }
                }
            }

            // Create the new perimeter cut path.
            var keyline = layer.thruCut.pathItems.rectangle(perimeter.top, perimeter.left, perimeter.right - perimeter.left, perimeter.top - perimeter.bottom)
                keyline.pixelAligned = false;
                keyline.filled = false;
                keyline.strokeColor = doc.swatches.getByName('Thru-cut').color;
            
            // Create the columns.
            var xAxis = perimeter.left + size.width
            while(xAxis < perimeter.right){
                var path = doc.pathItems.add();
                    path.setEntirePath([[xAxis, perimeter.top], [xAxis, perimeter.bottom]]);
                    path.filled = false;
                    path.strokeColor = doc.swatches.getByName('Thru-cut').color;
                    xAxis += size.width;
            }

            // Create the rows.
            var yAxis = perimeter.top - size.height
            while(yAxis > perimeter.bottom){
                var path = doc.pathItems.add();
                    path.setEntirePath([[perimeter.left, yAxis], [perimeter.right, yAxis]]);
                    path.filled = false;
                    path.strokeColor = doc.swatches.getByName('Thru-cut').color;
                    yAxis -= size.height;
            }

            try{
                doc.layers.getByName("Layer 1").remove();
            }catch(e){}

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