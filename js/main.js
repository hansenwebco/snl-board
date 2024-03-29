let snls = null;
let currentEpisode = 0;

function init() {
    loadBoard().then(result => {

        snls = result;

        // determine next episode
        let currentDate = new Date();

        let episode = snls.seasons[currentEpisode];
        let airDate = new Date(episode.airDate + ' 00:00');

        airDate.setHours(0,0,0,0);
        currentDate.setHours(0,0,0,0);

        while (currentDate <= airDate) {
            currentEpisode++;
            episode = snls.seasons[currentEpisode];
            airDate = new Date(episode.airDate + ' 00:00');
        }
        if (currentEpisode > 0) // unless we're showing out last item we subtract one
            currentEpisode--;

        setCard();
    });

    MicroModal.init();
    //MicroModal.show('modal-1');
    setListeners();

}



function setCard() {


    var height = window.innerHeight;
    var width = window.innerWidth;

    // TODO: we should compute the with the border set in css
    // padding = 35 = (70 * 3) = 240px in padding
    // margin-top on cards = 10px = 20
    // body margin top = 40

    height = (height - 320) / 3;

    var card = document.getElementById("card-date");
    card.style.height = height;
    card.style.width = (height) * (5 / 3);

    var card = document.getElementById("card-host");
    card.style.height = height;
    card.style.width = height * (5 / 3);

    var card = document.getElementById("card-music");
    card.style.height = height;
    card.style.width = height * (5 / 3);


    setEpisode();
}

function setListeners() {

    window.addEventListener('resize', function () {
        setCard();
    });

    document.addEventListener('keydown', function (e) {

        if (e.key === 'ArrowRight') {
            nextEpisode();
        }

        if (e.key === 'ArrowLeft') {
            prevEpisode();
        }

        if (e.key.toLowerCase() === 'r') {
            pickRandom();
        }
    });

    var is_touch_device = 'ontouchstart' in document.documentElement;
    if (is_touch_device) {

        let mc = new Hammer.Manager(document.getElementById("body"));
        //mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
        mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));


        mc.on("swipeleft swiperight swipedown doubletap", function (ev) {

            if (ev.type === 'swipeleft')
                nextEpisode();
            else if (ev.type === 'swiperight')
                prevEpisode();
            else if (ev.type === 'doubletap')
                pickRandom();

        });

        window.addEventListener('orientationchange', function (event) {
            //setCard();
        })
    }

}

function nextEpisode() {

    gtag('event', 'action_next_episode', {
        'event_category': 'engagement',
        'event_label': 'action_next_episode',
        'value': 1
    });

    if (currentEpisode - 1 >= 0) {
        currentEpisode--;
        setEpisode();
    }
}
function prevEpisode() {

    gtag('event', 'action_previous_episode', {
        'event_category': 'engagement',
        'event_label': 'action_previous_episode',
        'value': 1
    });

    if (currentEpisode + 1 < snls.seasons.length) {
        currentEpisode++;
        setEpisode();
    }
}

function setEpisode() {

    let episode = snls.seasons[currentEpisode];

    let airDate = new Date(episode.airDate + ' 00:00');
    let formatDate = airDate.toLocaleString('default', { month: 'short' }) + ' ' + airDate.getDate();
    if (new Date().getFullYear() != airDate.getFullYear()) {
        formatDate = formatDate + ', ' + airDate.getFullYear();// + ' (s'  + episode.season + ')';
    }

    document.getElementById("date").innerHTML = formatDate;
    document.getElementById("host").innerHTML = episode.host;
    document.getElementById("music").innerHTML = episode.musicalGuest;

    fitFont(document.getElementById("date"));
    fitFont(document.getElementById("host"));
    fitFont(document.getElementById("music"));

    let rightNav = document.getElementById("rightNav");
    if (currentEpisode == 0)
        rightNav.style.visibility = "hidden";
    else
        rightNav.style.visibility = "visible";


    let leftNav = document.getElementById("leftNav");
    if (currentEpisode == snls.seasons.length-1) 
        leftNav.style.visibility = "hidden";
    else
        leftNav.style.visibility = "visible";


}

function pickRandom() {

    gtag('event', 'action_pick_random', {
        'event_category': 'engagement',
        'event_label': 'action_pick_random',
        'value': 1
    });

    currentEpisode = getRandomInt(0, snls.seasons.length - 1)
    setEpisode();
}

function fitFont(elm) {
    var outer = window.getComputedStyle(elm.parentElement);
    var paddingHorz = parseFloat(outer.paddingRight) + parseFloat(outer.paddingLeft);
    var paddingVert = parseFloat(outer.paddingTop) + parseFloat(outer.paddingBottom);

    for (let size = 140; size > 10; size--) {
        elm.style.fontSize = size + "px";
        elm.style.lineHeight = size + "px";

        if (elm.clientWidth < elm.parentElement.clientWidth - paddingHorz && elm.clientHeight < elm.parentElement.clientHeight - paddingVert) {
            break;
        }
    }
}
function ShowDirections() {
    gtag('event', 'action_show_directions', {
        'event_category': 'engagement',
        'event_label': 'action_show_directions',
        'value': 1
    });
    MicroModal.show('modal-1');
}

async function loadBoard() {
    const response = await fetch('./data/seasons.json');
    const shows = await response.json();
    return shows;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}