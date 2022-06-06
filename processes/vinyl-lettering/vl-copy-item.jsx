var $doc = app.activeDocument;

copyToClipboard($doc.name.split('.')[0].split('_')[4])

function copyToClipboard(string) {
	var cmd, isWindows;

	string = (typeof string === 'string') ? string : string.toString();
	isWindows = $.os.indexOf('Windows') !== -1;
	
	cmd = 'echo "' + string + '" | pbcopy';
	if (isWindows) {
		cmd = 'cmd.exe /c cmd.exe /c "echo ' + string + ' | clip"';
	}

	$.os.callSystem(cmd);
}