var dir = {
    ready: new Folder(platform.directory + "/Prepress/External/Special Process/Cut Vinyl/Ready/")
}

var userFolders = getUserFolders(dir)

// Make the Window
var w = new Window("dialog", "Vinyl Lettering");
    w.alignChildren = "top";

    w.dropdown = w.add ('dropdownlist', undefined, userFolders);
    w.dropdown.selection = 1;
    w.dropdown.onChange = function(){
        w.list.removeAll();
        getUserFiles(w);
    }

    w.search = w.add ('edittext {active: true}', [undefined, undefined, 200, 20]);
    w.search.text = "";
    w.search.onChanging = function(){
        w.list.removeAll();
        getUserFiles(w);
    }

    w.list = w.add ('listbox', [0, 0, 300, 175], "", {multiselect: true});
    w.list.selection = 0;

        getUserFiles(w);

    w.buttonGroup = w.add ("group");
    w.buttonGroup.alignment = "center";
    w.acceptButton = w.buttonGroup.add ("button", undefined, "Ok");
    w.acceptButton.onClick = function(){
        w.close();
        processFiles(w);
    }

    w.cancelButton = w.buttonGroup.add ("button", undefined, "Cancel");

w.show()
    
function processFiles(query){
    try{
        for(var i=0; i<w.list.selection.length; i++){
            app.open(new File(dir.ready + "/" + query.dropdown.selection.text + "/" + w.list.selection[i].text));
        }
    }catch(e){
        alert("Error!\n" + e);
    }
}

function getUserFiles(query){
    var allFiles = [];
    var curFiles = Folder(dir.ready + "/" + query.dropdown.selection.text).getFiles();

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