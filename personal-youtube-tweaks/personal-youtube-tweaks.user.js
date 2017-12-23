// ==UserScript==
// @name        Personal YouTube Tweaks
// @description Speed up videos, lower music volume and don't switch to Share tab.
// @include     *://www.youtube.com/watch?*
// @version     3.0.13
// @author      ForgottenUmbrella, EdLolington2
// @namespace   https://greasyfork.org/users/83187
// ==/UserScript==

// CHANG'E LOG (are you watching?):
// * Additional debug log
// * Don't reference undefined 0th element

const WAIT = 1000;
const BANNER = "(YT Tweaks)"
const isPolymer = window.Polymer != null;
console.log(`${BANNER} Polymer? ${isPolymer}`);

// Modified from http://userscripts-mirror.org/scripts/review/174719.
function shareButtonToggle(shareButton)
{
    "use strict";
    shareButton.setAttribute("data-trigger-for", "action-panel-share");
    window.setTimeout(
        shareButton.setAttribute, 5000, "data-trigger-for", "blank"
    );
}

// Also modified from the above source.
function disableShareOnLike()
{
    "use strict";
    let panelButtons = (
        function()
        {
            let result = [];
            let buttons = document.getElementsByTagName("button");
            for (let button of buttons)
            {
                if (button.className.indexOf("action-panel-trigger") != -1)
                {
                    result.push(button);
                }
            }
            return result;
        }
    )();
    for (let button of panelButtons)
    {
        const dataTrigger = button.getAttribute("data-trigger-for");
        if (dataTrigger == "action-panel-share")
        {
            let shareButton = button;
            shareButton.setAttribute("data-trigger-for", "blank");
            shareButton.addEventListener(
                "click", () => shareButtonToggle(shareButton), false
            );
        }
    }
}

function inString(string, label="")
{
    function inner(trigger)
    {
        const match = (string.indexOf(trigger) > -1);
        if (match)
        {
            console.log(`${BANNER} ${label} trigger: ${trigger}`);
        }
        return match;
    }
    return inner;
}

// async function getTitle()
function getTitle()
{
    "use strict";
    if (isPolymer)
    {
        const titleElements = document.getElementsByClassName("title");
        if (!titleElements.length)
        {
        //     return new Promise(
        //         function()
        //         {
        //             window.setTimeout(getTitle, WAIT);
        //         }
        //     );
            requestAnimationFrame(() => getTitle());
        }
        else
        {
            const title = titleElements[0].innerText.toLowerCase();
            return title;
        }
    }
    else
    {
        const title = document.getElementsByClassName("eow-title")[0]
            .innerText.toLowerCase();
        return title;
    }
}

// async function getChannel()
function getChannel()
{
    "use strict";
    if (isPolymer)
    {
        const channelElement = document.getElementById("owner-name");
        if (channelElement == null)
        {
        //     return new Promise(
        //         function()
        //         {
        //             window.setTimeout(getChannel, WAIT);
        //         }
        //     );
            requestAnimationFrame(() => getChannel());
        }
        else
        {
            const channel = channelElement.innerText.toLowerCase();
            return channel;
        }
    }
    else
    {
        const channel = document.getElementsByClassName("yt-user-info")[0]
            .innerText.toLowerCase();
        return channel;
    }
}

// Change audio, speed and quality for videos presumed to be music.
// async function adjustForMusic(player)
function adjustForMusic(player)
{
    "use strict";
    console.log(`${BANNER} adjustForMusic called`);
    // let [title, channel] = await Promise.all([
    //     getTitle(), getChannel()
    // ]);
    const title = getTitle();
    const channel = getChannel();
    const inTitle = inString(title, "Title");
    const inChannelName = inString(channel, "Channel");

    const JAPANESE = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
    const MUSIC_TERMS = [
        JAPANESE, "midi", "touhou", "music", "piano", "vocal", "arrange",
        "theme",  "album", "toho", /feat\./, /.* - .*/, "soundtrack",
        /.* ~ .*/, /(^|[^a-z])cover/, "song", /(^|[^a-z])op/, /(^|[^a-z])ep/,
        "remix", "arrangement", /(^|[^a-z])c[0-9][0-9]/, "pv"
        // /('s|[1-6]|stage) theme/
    ];
    const NOT_MUSIC_TERMS = [
        "play", /(^|[^a-z])ep [0-9]/, "stream", "minecraft", "dlc", "games",
        "online", "episode", /part [0-9]/, /episode [0-9]/,
        "1cc", /(^|[^a-z])clear/, /#[0-9]/, "no miss", "no bomb", "scoring",
        "gmod", "spellcard", "nmnb", "no deaths"
    ];
    const CHANNEL_BLACKLIST = [
        "sips", "yogscast", "mamamax", "computerphile", "numberphile",
        "pewdiepie", "nakateleeli", "magiftw", "sixty symbols"
    ];

    const isMusic = (
        MUSIC_TERMS.some(inTitle)
        && !NOT_MUSIC_TERMS.some(inTitle)
        && !CHANNEL_BLACKLIST.some(inChannelName)
    );
    if (isMusic)
    {
        player.setVolume(25);
        console.log(`${BANNER} Set volume to 25`);
    }
    else
    {
        player.setVolume(100);
        player.setPlaybackRate(2);
        console.log(`${BANNER} Set volume to 100 and rate to 2`);
    }
    console.log(`${BANNER} adjustForMusic complete`);
}

// function asyncSetQuality(player, quality)
// {
//     if (player.getPlayerState() > -1)
//     {
//         player.setPlaybackQuality(quality);
//     }
//     else
//     {
//         window.setTimeout(asyncSetQuality, WAIT, player, quality);
//     }
// }

(async function()
{
    "use strict";
    console.log(`${BANNER} Script running`);
    disableShareOnLike();  // Does nothing on Polymer YouTube.
    console.log(`${BANNER} Disabled auto-share`);
    let player = document.getElementById("movie_player");
    // await adjustForMusic(player);
    // window.addEventListener(
    //     "WebComponentsReady",
    //     () =>
    //     {
    //         console.log(`${BANNER} WebComponentsReady event fired`);
            adjustForMusic(player);
        // }
    // );
    // asyncSetQuality(player, "medium");
})();
