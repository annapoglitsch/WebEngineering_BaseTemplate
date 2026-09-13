// Fetching bear data
// Fetching bear data

const baseUrl = "https://en.wikipedia.org/w/api.php";
const title = "List_of_ursids";
const BearSectionIndex = 3;

const params = {
    action: "parse",
    page: title,
    prop: "wikitext",
    section: BearSectionIndex,
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
    const pages = data.query.pages;
    const page = Object.values(pages)[0];
    if (!page.imageinfo || !page.imageinfo[0]) {
        console.warn("kein Bild gefunden für:", fileName);
        return "media/noImageFound.jpg";
    }
    return page.imageinfo[0].url;

}

export function extractBears(wikitext) {
    return wikitext.split('{{Species table/row').slice(1).map(parseBearRow).filter(bear => bear !== null); //wikitext

}

export function parseBearRow(row) {
    const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
    const binomialMatch = row.match(/\|binomial=(.*?)(?:\n|\|)/);
    const imageMatch = row.match(/\|image=(.*?)(?:\n|\|)/);

    if (!nameMatch || !binomialMatch || !imageMatch) { //unvollständige Daten -> mag ich halt nicht
        console.warn("unvollständiger bären-datensatz:", row);
        return null;
    }
    return {
        name: nameMatch[1],
        binomial: binomialMatch[1],
        fileName: imageMatch[1].trim().replace('File:', ''),
        range: null
    };

}

export async function enrichBearWithImage(bear) {
    const image = await fetchImageUrl(bear.fileName);
    return {
        name: bear.name,
        binomial: bear.binomial,
        image: image,
        range: bear.range
    };
}

function bearToHtml(bear) {
    return `
        <div class="bear">
            <img src="${bear.image}" alt="Image of ${bear.name}" style="width:200px; height:auto;">
            <p><b>${bear.name}</b> (${bear.binomial})</p>
            <p>Range: ${bear.range ?? 'Unknown'}</p>
        </div>`;
}

export async function insertBearsInDOM(bearPromises) {
    const results = await Promise.allSettled(bearPromises);
    const bears = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const moreBears = document.querySelector('.more-bears');

    if (!moreBears) {
        console.error('element mit klasse "more-bears" nicht gefunden.');
        return;
    }


    moreBears.insertAdjacentHTML('beforeend', bears.map(bearToHtml).join(''));
}

export async function loadBears() {
    try {
        const res = await fetch(baseUrl + "?" + new URLSearchParams(params).toString());
        const data = await res.json();

        const bearPromises = extractBears(data.parse.wikitext['*']);
        const enrichedBearPromises = bearPromises.map(enrichBearWithImage);
        return insertBearsInDOM(enrichedBearPromises);
    } catch (err) {
        console.error('fehler beim Laden der bärendaten:', err);
    }
}
