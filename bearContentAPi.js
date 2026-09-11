// Fetching bear data
// Fetching bear data

var baseUrl = "https://en.wikipedia.org/w/api.php";
var title = "List_of_ursids";

var params = {
    action: "parse",
    page: title,
    prop: "wikitext",
    section: 3,
    format: "json",
    origin: "*"
};

export function fetchImageUrl(fileName) {
    var imageParams = {
        action: "query",
        titles: "File:" + fileName,
        prop: "imageinfo",
        iiprop: "url",
        format: "json",
        origin: "*"
    };

    var url = baseUrl + "?" + new URLSearchParams(imageParams).toString();
    return fetch(url).then(function(res) {
        if (!res.ok) {
            throw new Error("HTTP error: " + res.status);
        }
        return res.json();
    }).then(function(data) {
        if (!data.query || !data.query.pages) {
            throw new Error("ungültige Antwort von Wikipedia");
        }
        var pages = data.query.pages;
        var page = Object.values(pages)[0];
        if (!page.imageinfo || !page.imageinfo[0]) {
            console.warn("kein Bild gefunden für:", fileName);
            return "media/noImageFound.jpg";
        }
        return page.imageinfo[0].url;
    });
}

export function extractBears(wikitext) {
    var rows = wikitext.split('{{Species table/row').slice(1); //wikitext

    return rows.map(function (row) { //map -> Reihenfolge
        var nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
        var binomialMatch = row.match(/\|binomial=(.*?)(?:\n|\|)/);
        var imageMatch = row.match(/\|image=(.*?)(?:\n|\|)/);

        if (!nameMatch || !binomialMatch || !imageMatch) { //unvollständige Daten -> mag ich halt nicht
            console.warn("unvollständiger bären-datensatz:", row);
            return null;
        }

        var fileName = imageMatch[1].trim().replace('File:', '');

        return fetchImageUrl(fileName).then(function (imageUrl) {
            return {
                name: nameMatch[1],
                binomial: binomialMatch[1],
                image: imageUrl,
                range: "TODO extract correct range"
            };
        });
    }).filter(function (bearPromise) { //null werte raus
        return bearPromise !== null;
    });

}

export function insertBearsInDOM (bearPromises){
    return Promise.all(bearPromises).then(function(bears) {
        var moreBears = document.querySelector('.more-bears');
        if (!moreBears) {
            console.error('element mit klasse "more-bears" nicht gefunden.');
            return;
        }

        var html = bears.map(function(bear) {
            return '<div class="bear">' +
                '<img src="' + bear.image + '" alt="Image of ' + bear.name + '" style="width:200px; height:auto;">' +
                '<p><b>' + bear.name + '</b> (' + bear.binomial + ')</p>' +
                '<p>Range: ' + bear.range + '</p>' +
                '</div>';
        }).join('');
        moreBears.insertAdjacentHTML('beforeend', html);
    });
}

export function loadBears() {
    return fetch(baseUrl + "?" + new URLSearchParams(params).toString())
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            var bearPromises = extractBears(data.parse.wikitext['*']);
            return insertBearsInDOM(bearPromises);
        }).catch(function(err) {
            console.error('fehler beim Laden der bärendaten:', err);
        });
}
