var dir = {
    ready: new Folder(platform.support + "/Vinyl Lettering/")
}

var userFolders = getUserFolders(dir);
var user = 0

// Try to automatically determine the user.
for(var i=0; i<userFolders.length; i++){
    if(platform.username.split('.')[0].toLowerCase() == userFolders[i].split(' ')[0].toLowerCase()){
        user = i
        break
    }
}

// Make the Window
var w = new Window("dialog", "Vinyl Lettering");
    w.alignChildren = "top";

    w.dropdown = w.add ('dropdownlist', undefined, userFolders);
    w.dropdown.selection = user;
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

    w.deleteButton = w.buttonGroup.add ("button", undefined, "Delete");
    w.deleteButton.onClick = function(){
        deleteFiles(w);
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

function deleteFiles(query){
    try{
        for(var i=w.list.selection.length-1; i>-1; i--){
            var cvFile = new File(dir.ready + "/" + query.dropdown.selection.text + "/" + w.list.selection[i].text);
            if(cvFile.exists){
                cvFile.remove();
                w.list.remove(w.list.selection[i]);
            }
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