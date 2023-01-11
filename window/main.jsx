$.evalFile(platform.local + "/library/library.jsx");

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
    w.tabs[0] = w.tabGroup.add('group');
    w.tabs[0].orientation = "column";

    w.scripts = w.tabs[0].add ('panel');

    w.scripts.vlOpen = w.scripts.add("button", [0,0,100,30], "Open");
    w.scripts.vlOpen.onClick = function(){
        funcToBT(function temp(){
            $.evalFile(platform.local + "/processes/vinyl-lettering/vl-open.jsx");
        });
    }

    w.scripts.vlPrep = w.scripts.add("button", [0,0,100,30], "Prep");
    w.scripts.vlPrep.onClick = function(){
        funcToBT(function temp(){
            $.evalFile(platform.local + "/processes/vinyl-lettering/vl-prep.jsx");
        });
    }

    w.scripts.vlSave = w.scripts.add("button", [0,0,100,30], "Save");
    w.scripts.vlSave.onClick = function(){
        funcToBT(function temp(){
            $.evalFile(platform.local + "/processes/vinyl-lettering/vl-save.jsx");
        });
    }

    w.options = w.tabs[0].add ('panel');
    w.options.alignChildren = "left"

    w.options.outline = w.options.add("checkbox", undefined, "Outline")
	w.options.outline.value = false;

    w.options.merge = w.options.add("checkbox", undefined, "Merge")
	w.options.merge.value = true;

    // Make the 2nd panel -----------------------
    w.tabs[1] = w.tabGroup.add('panel');

    w.tabs[1].buttCut = w.tabs[1].add("button", [0,0,100,30], "ButtCut");
    w.tabs[1].buttCut.onClick = function(){
        funcToBT(function temp(){
            $.evalFile(platform.local + "/processes/butt-cut/buttcut.jsx");
        });
    }

    w.tabs[1].ccFile = w.tabs[1].add("button", [0,0,100,30], "Clean Cut File");
    w.tabs[1].ccFile.enabled = true;
    w.tabs[1].ccFile.onClick = function(){
        funcToBT(function temp(){
            $.evalFile(platform.local + "/processes/clean-cut-file/cleancutfile.jsx");
        });
    }

    // Make the 3rd panel -----------------------
    w.tabs[2] = w.tabGroup.add('panel');

    w.tabs[2].buttCut = w.tabs[2].add("button", [0,0,100,30], "Outline Stroke");
    w.tabs[2].buttCut.onClick = function(){
        funcToBT(function temp(){
            $.evalFile(platform.local + "/processes/misc/outline-stroke.jsx");
        });
    }

    w.tabs[2].vlSave = w.tabs[2].add("button", [0,0,100,30], "Copy Item");
    w.tabs[2].vlSave.onClick = function(){
        funcToBT(function temp(){
            $.evalFile(platform.local + "/processes/misc/copy-item.jsx");
        });
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