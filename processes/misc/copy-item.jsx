var $doc = app.activeDocument;

//copyToClipboard($doc.name.split('.')[0].split('_')[4])

//alert($doc.textFrames.length)

var copyText = $doc.activeLayer.textFrames.add();
	copyText.contents = $doc.name.split('.')[0].split('_')[4];

	copyText.select();

	//alert($doc.textFrames.length)

	//app.copy()


function copyToClipboard(string) {
	var cmd, isWindows;

	string = (typeof string === 'string') ? string : string.toString();
	isWindows = $.os.indexOf('Windows') !== -1;
	
	cmd = 'echo "' + string + '" | pbcopy';
	if (isWindows) {
		cmd = 'cmd.exe /c cmd.exe /c "echo ' + string + ' | clip"';
	}

	alert("1")

	//system.callSystem(cmd);

	app.copy(cmd)

	alert("2")

	
}