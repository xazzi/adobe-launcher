$.evalFile(platform.local + "/adobe-library/library.jsx");

var w = new Window ('palette');

    w.welcomeText = w.add("statictext", undefined, "Welcome!");

    w.main = w.add ('group');
    w.main.orientation = "column"

    w.stubs = w.main.add ('dropdownlist', undefined, ['Vinyl Lettering','Utilities']);
    w.stubs.onChange = showTab;

    w.tabGroup = w.main.add('group');
    w.tabGroup.orientation = "stack";
    w.tabGroup.alignChildren = "top";

    w.tabs = [];

    // Make the 1st panel -----------------------
    w.tabs[0] = w.tabGroup.add ('panel');

    w.tabs[0].vlOpen = w.tabs[0].add("button", [0,0,100,30], "Open");
    w.tabs[0].vlOpen.onClick = function(){
        funcToBT($.evalFile(platform.local + "/vinyl-lettering/vl-open.jsx"));
    }

    w.tabs[0].vlPrep = w.tabs[0].add("button", [0,0,100,30], "Prep");
    w.tabs[0].vlPrep.onClick = function(){
        funcToBT($.evalFile(platform.local + "/vinyl-lettering/vl-prep.jsx"));
    }

    w.tabs[0].vlSave = w.tabs[0].add("button", [0,0,100,30], "Save");
    w.tabs[0].vlSave.onClick = function(){
        funcToBT($.evalFile(platform.local + "/vinyl-lettering/vl-save.jsx"));
    }

    // Make the 2nd panel -----------------------
    w.tabs[1] = w.tabGroup.add('panel');

    w.tabs[1].buttCut = w.tabs[1].add("button", [0,0,100,30], "ButtCut");
    w.tabs[1].buttCut.onClick = function(){
        funcToBT($.evalFile(platform.local + "/butt-cut/buttcut.jsx"));
    }

    w.tabs[1].ccFile = w.tabs[1].add("button", [0,0,100,30], "Clean Cut File");
    w.tabs[1].ccFile.enabled = true;
    w.tabs[1].ccFile.onClick = function(){
        funcToBT($.evalFile(platform.local + "/clean-cut-file/cleancutfile.jsx"));
    }

    for(var i=0; i<w.tabs.length; i++){
        w.tabs[i].visible = false;
    }

    w.onShow = function(){
        w.stubs.selection = 0;
        showTab;
    }

    w.show();

// Operating functions for the window -----------------------
function showTab(){
    if(w.stubs.selection !== null){
        for(var i=w.tabs.length-1; i>=0; i--){
            w.tabs[i].visible = false;
        }
        w.tabs[w.stubs.selection.index].visible = true;
    }
}