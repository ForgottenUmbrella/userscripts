// ==UserScript==
// @name        Personal YouTube Tweaks
// @description Prevent automatically switching to share panel & autoplay, and change music volume & speed.
// @include     *://www.youtube.com/watch?*
// @version     2.10.2
// @author      edlolington, ForgottenUmbrella and Yonezpt
// @namespace   https://greasyfork.org/users/83187
// ==/UserScript==


function removeAPUN() {
    // Borrowed from https://gist.github.com/Yonezpt/51adf278a24488f75ff0.
    var autoplaybar = document.getElementsByClassName("autoplay-bar")[0];
    if (autoplaybar) {
        autoplaybar.removeAttribute("class");
        document.getElementsByClassName("checkbox-on-off")[0].remove();
    }
}


// Modified from http://userscripts-mirror.org/scripts/review/174719.
function disable_share_on_like() {
    var keyword = "action-panel-trigger";
    var panelBtns = (function() {
        var result = [];
        var btns = document.getElementsByTagName("button");
        for (var i=0; i < btns.length; i++) {
            if (btns[i].className.indexOf(keyword) != -1) {
                result.push(btns[i]);
            }
        }
        return result;
    })();
    var shareBtn;
    for (var i = 0; i < panelBtns.length; i++) {
            if (panelBtns[i].getAttribute("data-trigger-for") ==
                "action-panel-share") {
                shareBtn = panelBtns[i];
                shareBtn.setAttribute("data-trigger-for", "blank");
            shareBtn.addEventListener("click", function() {
                shareBtnToggle(shareBtn);
            }, false);
        }
    }
}


function shareBtnToggle(shareBtn) {
    //alert("You clicked the share button.");
    shareBtn.setAttribute("data-trigger-for", "action-panel-share");
    window.setTimeout(function(){ shareBtn.setAttribute("data-trigger-for",
        "blank"); }, 1000);
}
// End borrowing.


function in_string(string, label) {
    if (label === undefined) {
        label = "";
    }
    function inner(trigger)
    {
        var match = ~string.search(trigger);
        if (match) {
            console.log("(YT Tweaks) " + label + " trigger: " + trigger);
        }
        return match;
    }
    return inner;
}


function adjust_for_music(player) {
    // Change audio, speed and quality for videos presumed to be music.
    // var prev_vol = player.getVolume();
    var title =
        document.getElementsByClassName("title")[0].innerText.toLowerCase();
    var channel =
        // For new Polymer layout (which doesn't work at all).
        // document.getElementById("owner-name").innerText.toLowerCase();
        // For old (non-Polymer) layout.
        document.getElementsByClassName(
            "yt-user-info"
        )[0].children[0].text.toLowerCase();
    var in_title = in_string(title, "Title");
    var in_channel_name = in_string(channel, "Channel");
    var jap_chars = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf/]/;
    var music_indication = [
        jap_chars, "midi", "touhou", "music", "piano", "vocal", "arrange",
        "theme",  "album", "toho", /feat\./, /.* - .*/, "soundtrack",
        /.* ~ .*/, /(^|[^a-z])cover/, "song", /(^|[^a-z])op/, /(^|[^a-z])ep/,
        "remix", "arrangement", /(^|[^a-z])c[0-9][0-9]/, "pv"];
        // /('s|[1-6]|stage) theme/
    var other_indication = [
        "play", /(^|[^a-z])ep [0-9]/, "stream", "minecraft", "dlc", "games",
        "online", "episode", /part [0-9]/, /episode [0-9]/,
        "1cc", /(^|[^a-z])clear/, /#[0-9]/, "no miss", "no bomb", "scoring",
        "gmod", "spellcard", "nmnb", "no deaths"];
    var channel_blacklist = [
        "sips", "yogscast", "mamamax", "computerphile", "numberphile",
        "pewdiepie", "nakateleeli", "magiftw", "sixty symbols"];

    // Short-circuits.
    if (music_indication.some(in_title) && !other_indication.some(in_title)
        && !channel_blacklist.some(in_channel_name)) {
        player.setVolume(25);
        console.log("(YT Tweaks) Set volume to 25");
        // player.setPlaybackRate(1);
    } else {
        player.setVolume(100);
        player.setPlaybackRate(2);
        console.log("(YT Tweaks) Set volume to 100 and rate to 2");
    }

    // if (player.getPlayerState() > -1) {
        player.setPlaybackQuality("medium");
    // } else {
    //     setTimeout(function(){ player.setPlaybackQuality("medium"); }, 5000);
    // }
}


function enable_captions(player) {
    player.loadModule("captions");
    player.setOption("captions", "track", {"languageCode": "en"});
}


(function() {
    "use strict";
    console.log("(YT Tweaks) Script running");
    window.addEventListener("readystatechange", removeAPUN, true);
    window.addEventListener("spfdone", removeAPUN);
    disable_share_on_like();
    console.log("(YT Tweaks) Disabled share button");
    var player = document.getElementById("movie_player");
    adjust_for_music(player);
    // enable_captions(player);
    // console.log("(YT Tweaks) Enabled captions (if possible)");
})();
