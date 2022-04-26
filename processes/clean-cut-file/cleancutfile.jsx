try{

    var doc = app.activeDocument;

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
    var tempLayer = createLayer("Layer 1", true)
    var allPaths = tempLayer.pathItems
    for (var i=allPaths.length-1; i>=0; i--){
        var tempLayer = createLayer(allPaths[i].strokeColor.spot.name, true)
        allPaths[i].move(tempLayer, ElementPlacement.PLACEATBEGINNING)
    }

    // Remove the final layer.
    doc.layers.getByName("Layer 1").remove();

}catch(e){
    alert("Error!\n" + e);
}