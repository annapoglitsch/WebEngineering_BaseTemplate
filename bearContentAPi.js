// Fetching bear data
// Fetching bear data

const baseUrl = "https://en.wikipedia.org/w/api.php";
const title = "List_of_ursids";

const params = {
    action: "parse",
    page: title,
    prop: "wikitext",
    section: 3,
    format: "json",
    origin: "*"
};

export async function fetchImageUrl(fileName) { //.then zu await
    const imageParams = {
        action: "query",
        titles: "File:" + fileName,
        prop: "imageinfo",
        iiprop: "url",
        format: "json",
        origin: "*"
    };
    const url = baseUrl + "?" + new URLSearchParams(imageParams).toString();
    const res = await fetch(url)
        if (!res.ok) {
            throw new Error("HTTP error: " + res.status);
        }
        const data = await res.json();

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

}

export function extractBears(wikitext) {
    const rows = wikitext.split('{{Species table/row').slice(1); //wikitext

    return rows.map(function (row) { //map -> Reihenfolge
        const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
        const binomialMatch = row.match(/\|binomial=(.*?)(?:\n|\|)/);
        const imageMatch = row.match(/\|image=(.*?)(?:\n|\|)/);

        if (!nameMatch || !binomialMatch || !imageMatch) { //unvollständige Daten -> mag ich halt nicht
            console.warn("unvollständiger bären-datensatz:", row);
            return null;
        }

        const fileName = imageMatch[1].trim().replace('File:', '');

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

export async function insertBearsInDOM (bearPromises){
        const bears = await Promise.all(bearPromises);
    const moreBears = document.querySelector('.more-bears');

        if (!moreBears) {
            console.error('element mit klasse "more-bears" nicht gefunden.');
            return;
        }

        const html = bears.map(bear =>
            '<div class="bear">' +
                '<img src="' + bear.image + '" alt="Image of ' + bear.name + '" style="width:200px; height:auto;">' +
                '<p><b>' + bear.name + '</b> (' + bear.binomial + ')</p>' +
                '<p>Range: ' + bear.range + '</p>' +
                '</div>'
        ).join('');

        moreBears.insertAdjacentHTML('beforeend', html);
}

export async function loadBears() {
try{
    const res = await fetch(baseUrl + "?" + new URLSearchParams(params).toString());
        const data = await res.json();

            const bearPromises = extractBears(data.parse.wikitext['*']);
            return insertBearsInDOM(bearPromises);
} catch(err) {
            console.error('fehler beim Laden der bärendaten:', err);
        }
}
