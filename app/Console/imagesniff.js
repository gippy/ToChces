if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        function pad(n) { return n < 10 ? '0' + n : n; }
        function ms(n) { return n < 10 ? '00'+ n : n < 100 ? '0' + n : n }
        return this.getFullYear() + '-' +
            pad(this.getMonth() + 1) + '-' +
            pad(this.getDate()) + 'T' +
            pad(this.getHours()) + ':' +
            pad(this.getMinutes()) + ':' +
            pad(this.getSeconds()) + '.' +
            ms(this.getMilliseconds()) + 'Z';
    }
}

function compareEntrySize(entryA, entryB){
    if (entryA.type != entryB.type){
        if (entryA.type.indexOf('jpeg') != -1) return -1;
        else if (entryB.type.indexOf('jpeg') != -1) return 1;
    }

    var sizeA = entryA.size ? entryA.size : 0;
    var sizeB = entryB.size ? entryB.size : 0;
    return sizeB - sizeA;
}

function createHAR(title, resources)
{
    var entries = [];

    resources.forEach(function (resource) {
        var request = resource.request,
            startReply = resource.startReply,
            endReply = resource.endReply;

        if (!request || !startReply || !endReply) {
            return;
        }

        // Exclude Data URI from HAR file because
        // they aren't included in specification
        if (request.url.match(/(^data:image\/.*)/i)) {
            return;
        }

        var type = endReply.contentType;
        if (type && type.indexOf('image') != -1 && type.indexOf('gif') == -1 && startReply.bodySize > 500){
            entries.push({
                src: request.url,
                status: endReply.status,
                size: startReply.bodySize,
                contentType: endReply.contentType
            });
        }
    });

    entries.sort(compareEntrySize);

    return {       
        title: title,
        images: entries
    };
}

var page = require('webpage').create(),
    system = require('system');

function closeConnection(){
	page.endTime = new Date();
	page.title = page.evaluate(function () {
		return document.title;
	});
	var har = createHAR(page.title, page.resources);
	console.log(JSON.stringify(har, undefined, 4));
	phantom.exit();
}

if (system.args.length === 1) {
    console.log('Usage: imagesniff.js <some URL>');
    phantom.exit(1);
} else {

    page.address = system.args[1];
    page.resources = [];

    page.onLoadStarted = function () {
        page.startTime = new Date();
    };

    page.onResourceRequested = function (req) {
        page.resources[req.id] = {
            request: req,
            startReply: null,
            endReply: null
        };
    };

    page.onResourceReceived = function (res) {
        if (res.stage === 'start') {
            page.resources[res.id].startReply = res;
        }
        if (res.stage === 'end') {
            page.resources[res.id].endReply = res;
        }
    };

	page.onLoadFinished = function (status){
		if (status !== 'success') {
			console.log('FAIL to load the address');
			phantom.exit(1);
		} else {
			window.clearTimeout(timeout);
			closeConnection();
		}
	};

    page.open(page.address);

	var timeout = window.setTimeout(closeConnection, 10000);
}
