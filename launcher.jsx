#targetengine "main";

var paths = $.fileName.split("\\");
    paths.splice(paths.length-1,1);

if(new RegExp("Macintosh","g").exec($.os) == "Macintosh"){
    var platform = {
        name: "Macintosh",
        username: $.getenv('USER'),
        support: "",
        local: paths.join("\\")
    }
}else if(new RegExp("Windows","g").exec($.os) == "Windows"){
    var platform = {
        name: "Windows",
        username: $.getenv('USERNAME'),
        support: "//amz-impsw-data.us.digitalroominc.com/IMPSW_DATA/Support/",
        liveServices: "//amz-impsw-data.us.digitalroominc.com/IMPSW_DATA/.Live Services/",
        //directory: "//amz-impsw-data/IMPSW_DATA/Support/",
        local: paths.join("\\")
    }
}else{
    alert("Operating System Not Detected.")
}

if(platform !== undefined){
    $.evalFile(platform.local + "/window/main.jsx");
}