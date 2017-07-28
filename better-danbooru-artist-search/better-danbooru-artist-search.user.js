// ==UserScript==
// @name         Better Danbooru Artist Search
// @version      3.7.0
// @description  Improve URL handling within the Danbooru artist search engine and automatically navigate to the wiki page if indubitable.
// @author       ForgottenUmbrella
// @match        *://danbooru.donmai.us/artists?*
// @namespace    https://greasyfork.org/users/83187
// ==/UserScript==


function submit(query, old_query) {
    if (query !== old_query) {
        console.log("(arsearch) new query = " + query);
        document.getElementById("search_name").value = query;
        document.getElementsByName("commit")[0].click();
    }
}


(function() {
    "use strict";
    var is_desperate = false;
    // Set this to true if you want the query to be changed with wildcards
    // until it matches.
    console.log("(arsearch) Running");
    var query = document.getElementById("search_name").value;
    console.log("(arsearch) query = " + query);
    var old_query = query;
    var domains = [/\.com(\/|$)/, /\.net(\/|$)/, /\.jp(\/|$)/];

    var has_domain = domains.some(function(elem) {
        return ~query.search(elem);
    });
    var has_periods = (
        query.match(/\./) &&
        query.split(".").every(function(elem){
            return elem.length > 1;
        }));
    var is_url = has_domain || has_periods;

    if (is_url) {
        if (!query.startsWith("http://") && !query.startsWith("https://")) {
            query = "http://" + query;
            console.log("(arsearch) Does not begin with protocol");
        }

        if (query.includes("pixiv")) {
            console.log("(arsearch) Is pixiv");
            query = query.replace("/whitecube/user/", "/member.php?id=");
            query = query.replace(/\/illust\/.*/, "");
            query = query.replace("#_=_", "");
            query = query.replace("/member_illust", "/member");
            query = query.replace(/&.*/, "");
        } else if (query.includes("twitter")) {
            console.log("(arsearch) Is twitter");
            query = query.replace("mobile.", "");
            query = query.replace(/\?.*/, "");
            query = query.replace(/\/status\/.*/, "");
        } else if (query.includes("tumblr")) {
            console.log("(arsearch) Is tumblr");
            if (!query.endsWith("com")) {
                console.log("(arsearch) Contains path; removing it");
                query = query.substr(
                    0, query.lastIndexOf("com") + "com".length);
            }
        } else if (query.includes("nicovideo")) {
            console.log("(arsearch) Is nico");
            if (query.includes("sp")) {
                query = "http://seiga.nicovideo.jp/seiga/" + query.substr(
                    query.length - "imXXXXXXX".length);
                console.log("(arsearch) Is mobile");
            }
        } else if (query.includes("deviantart")) {
            console.log("(arsearch) Is deviant");
            if (!query.endsWith("com")) {
                console.log("(arsearch) Contains path; removing it");
                query = query.substr(
                    0, query.lastIndexOf("com") + "com".length);
            }
        }

        submit(query, old_query);
    }

    var artists_list = document.getElementsByTagName("tbody")[0];
    var num_artists = artists_list.childElementCount;
    if (num_artists === 1) {
        var first_artist = artists_list.firstElementChild;
        var artist_table_data = first_artist.getElementsByTagName("td")[0];
        var url = artist_table_data.getElementsByTagName("a")[0].href;
        window.location.href = url;
    } else if (is_desperate && num_artists === 0 && !is_url) {
        if (!query.startsWith("*_(") && !query.endsWith("_(*)")) {
            query = "*_(" + query + ")";
            submit(query, old_query);
        } else if (query.startsWith("*_(")) {
            var fresh_query = query.substr(
                "*_(".length, query.length - "*_(".length - ")".length);
            query = fresh_query + "_(*)";
            submit(query, old_query);
        } else if (query.endsWith("_(*)")) {
            var fresh_query = query.substr(0, query.length - "_(*)".length);
            query = "*" + fresh_query + "*";
            submit(query, old_query);
        }
    }
})();
