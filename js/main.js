let snls = null;
let currentEpisode = 0;

function init() {
    loadBoard().then(result => {
        snls = result;
        setEpisode();
    });

    setListeners();

}

function setListeners() {

    document.addEventListener('keydown', function (e) {

        if (e.key === 'ArrowRight') {
            if (currentEpisode - 1 >= 0) {
                currentEpisode--;
                setEpisode();
            }
        }

        if (e.key === 'ArrowLeft') {
            if (currentEpisode + 1 < snls.seasons.length) {
                currentEpisode++;
                setEpisode();
            }
        }

        if (e.key.toLowerCase() === 'r') {
            pickRandom();
        }
    });
}

function setEpisode() {

    let episode = snls.seasons[currentEpisode];

    let airDate = new Date(episode.airDate);
    let formatDate = airDate.toLocaleString('default', { month: 'long' }) + ' ' + airDate.getDate();
    if (new Date().getFullYear() != airDate.getFullYear()) {
        formatDate = formatDate + ', ' + airDate.getFullYear();// + ' (s'  + episode.season + ')';
    }

    document.getElementById("date").innerHTML = formatDate;
    document.getElementById("host").innerHTML = episode.host;
    document.getElementById("music").innerHTML = episode.musicalGuest;

    fitFont(document.getElementById("date"));
    fitFont(document.getElementById("host"));
    fitFont(document.getElementById("music"));
}

function pickRandom() {
    currentEpisode = getRandomInt(0, snls.seasons.length - 1)
    setEpisode();
}

function fitFont(elm) {
    var outer = window.getComputedStyle(elm.parentElement);
    var paddingHorz = parseFloat(outer.paddingRight) + parseFloat(outer.paddingLeft);
    var paddingVert = parseFloat(outer.paddingTop) + parseFloat(outer.paddingBottom);

    for (let size = 120; size > 10; size--) {
        elm.style.fontSize = size + "px";
        elm.style.lineHeight = size + "px";

        if (elm.clientWidth < elm.parentElement.clientWidth - paddingHorz && elm.clientHeight < elm.parentElement.clientHeight - paddingVert) {
            break;
        }
    }
}


async function loadBoard() {
    const response = await fetch('../data/seasons.json');
    const shows = await response.json();
    return shows;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}