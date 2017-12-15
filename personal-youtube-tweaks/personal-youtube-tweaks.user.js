// ==UserScript==
// @name        Personal YouTube Tweaks
// @description Speed up videos and lower music volume.
// @include     *://www.youtube.com/watch?*
// @version     3.0.0
// @author      ForgottenUmbrella, EdLolington2
// @namespace   https://greasyfork.org/users/83187
// ==/UserScript==

// CHANG'E LOG (are you watching?):
// Remove autoplay disable (permanent)
// Arbitrary code style changes
// Make search work again
// Work on Polymer YouTube
// Remove quality change (commented)

let WAIT = 1000;

// Modified from http://userscripts-mirror.org/scripts/review/174719.
function shareBtnToggle(shareBtn)
{
    // alert("You clicked the share button.");
    shareBtn.setAttribute("data-trigger-for", "action-panel-share");
    window.setTimeout(
        function()
        {
            shareBtn.setAttribute("data-trigger-for", "blank");
        },
        5000
    );
}

// Also modified from the above source.
function disableShareOnLike()
{
    let keyword = "action-panel-trigger";
    let panelBtns = (function()
    {
        let result = [];
        let btns = document.getElementsByTagName("button");
        for (let i=0; i < btns.length; i++)
        {
            if (btns[i].className.indexOf(keyword) != -1)
            {
                result.push(btns[i]);
            }
        }
        return result;
    })();
    let shareBtn;
    let dataTrigger;
    for (let i = 0; i < panelBtns.length; i++)
    {
        dataTrigger = panelBtns[i].getAttribute("data-trigger-for");
        if (dataTrigger == "action-panel-share")
        {
            shareBtn = panelBtns[i];
            shareBtn.setAttribute("data-trigger-for", "blank");
            shareBtn.addEventListener(
                "click", function()
                {
                    shareBtnToggle(shareBtn);
                }, false
            );
        }
    }
}

function inString(string, label)
{
    if (label === undefined)
    {
        label = "";
    }
    function inner(trigger)
    {
        let match = (string.indexOf(trigger) > -1);
        if (match)
        {
            console.log("(YT Tweaks) " + label + " trigger: " + trigger);
        }
        return match;
    }
    return inner;
}

// Change audio, speed and quality for videos presumed to be music.
function adjustForMusic(player)
{
    // For old (non-Polymer) layout.
    let title = document.getElementsByClassName("eow-title").innerText.toLowerCase();
    let inTitle = inString(title, "Title");

    let channel = document.getElementsByClassName("yt-user-info")[0]
        .innerText
        .toLowerCase();

    let inChannelName = inString(channel, "Channel");

    let japChars = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf/]/;
    let musicWords = [
        japChars, "midi", "touhou", "music", "piano", "vocal", "arrange",
        "theme",  "album", "toho", /feat\./, /.* - .*/, "soundtrack",
        /.* ~ .*/, /(^|[^a-z])cover/, "song", /(^|[^a-z])op/, /(^|[^a-z])ep/,
        "remix", "arrangement", /(^|[^a-z])c[0-9][0-9]/, "pv"
        // /('s|[1-6]|stage) theme/
    ];
    let notMusicWords = [
        "play", /(^|[^a-z])ep [0-9]/, "stream", "minecraft", "dlc", "games",
        "online", "episode", /part [0-9]/, /episode [0-9]/,
        "1cc", /(^|[^a-z])clear/, /#[0-9]/, "no miss", "no bomb", "scoring",
        "gmod", "spellcard", "nmnb", "no deaths"
    ];
    let channelBlacklist = [
        "sips", "yogscast", "mamamax", "computerphile", "numberphile",
        "pewdiepie", "nakateleeli", "magiftw", "sixty symbols"
    ];

    // Short-circuits.
    if (musicWords.some(inTitle) && !notMusicWords.some(inTitle)
        && !channelBlacklist.some(inChannelName))
    {
        player.setVolume(25);
        console.log("(YT Tweaks) Set volume to 25");
        // player.setPlaybackRate(1);
    }
    else
    {
        player.setVolume(100);
        player.setPlaybackRate(2);
        console.log("(YT Tweaks) Set volume to 100 and rate to 2");
    }
}

// Change audio, speed and quality for videos presumed to be music.
function adjustForMusic(player)
{
    let nonPolymerTitle = document.getElementsByClassName("eow-title")[0];
    let isPolymer = (nonPolymerTitle === undefined);
    let title;
    let channel;
    if (isPolymer)
    {
        setTimeout(function setTitle()
            {
                let titleElements = document.getElementsByClassName("title");
                if (titleElements[0] === undefined)
                {
                    setTimeout(setTitle, WAIT);
                    return;
                }
                title = titleElements[0].innerText.toLowerCase();
            }, WAIT
        );

        setTimeout(function setChannel()
            {
                let channelElement = document.getElementById("owner-name");
                if (channelElement === undefined)
                {
                    setTimeout(setChannel, WAIT);
                    return;
                }
                channel = channelElement.innerText.toLowerCase();
            }, WAIT
        );
    }
    else
    {
        title = nonPolymerTitle.innerText.toLowerCase();
        channel = document.getElementsByClassName("yt-user-info")[0]
            .innerText
            .toLowerCase();
    }
    let inTitle = inString(title, "Title");
    let inChannelName = inString(channel, "Channel");

    let japChars = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf/]/;
    let musicWords = [
        japChars, "midi", "touhou", "music", "piano", "vocal", "arrange",
        "theme",  "album", "toho", /feat\./, /.* - .*/, "soundtrack",
        /.* ~ .*/, /(^|[^a-z])cover/, "song", /(^|[^a-z])op/, /(^|[^a-z])ep/,
        "remix", "arrangement", /(^|[^a-z])c[0-9][0-9]/, "pv"
        // /('s|[1-6]|stage) theme/
    ];
    let notMusicWords = [
        "play", /(^|[^a-z])ep [0-9]/, "stream", "minecraft", "dlc", "games",
        "online", "episode", /part [0-9]/, /episode [0-9]/,
        "1cc", /(^|[^a-z])clear/, /#[0-9]/, "no miss", "no bomb", "scoring",
        "gmod", "spellcard", "nmnb", "no deaths"
    ];
    let channelBlacklist = [
        "sips", "yogscast", "mamamax", "computerphile", "numberphile",
        "pewdiepie", "nakateleeli", "magiftw", "sixty symbols"
    ];

    let isMusic = (
        musicWords.some(inTitle)
        && !notMusicWords.some(inTitle)
        && !channelBlacklist.some(inChannelName)
    );
    if (isMusic)
    {
        player.setVolume(25);
        console.log("(YT Tweaks) Set volume to 25");
    }
    else
    {
        player.setVolume(100);
        player.setPlaybackRate(2);
        console.log("(YT Tweaks) Set volume to 100 and rate to 2");
    }
}

// function asyncSetQuality(player, quality)
// {
//     if (player.getPlayerState() > -1)
//     {
//         player.setPlaybackQuality(quality);
//     }
//     else
//     {
//         setTimeout(function()
//             {
//                 asyncSetQuality(player, quality);
//             }, WAIT
//         );
//     }
// }

(function()
{
    "use strict";
    console.log("(YT Tweaks) Script running");
    disableShareOnLike();  // Does nothing on Polymer YouTube.
    console.log("(YT Tweaks) Disabled auto-share");
    let player = document.getElementById("movie_player");
    adjustForMusic(player);
    // asyncSetQuality(player, "medium");
})();
