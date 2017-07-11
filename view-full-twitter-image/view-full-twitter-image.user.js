// ==UserScript==
// @name         View Full Twitter Image
// @version      1.2.2
// @description  Undo Twitter's insistence to down-res images when viewing on
// its dedicated page and add a button to download the full image without the
// weird file extensions which don't count as actual images.
// @author       ForgottenUmbrella
// @match        https://pbs.twimg.com/media/*
// @grant        none
// @noframes
// @namespace    https://greasyfork.org/users/83187
// ==/UserScript==


function dom_create(type, text, after, func, style) {
    "use strict";
    if (typeof style === "undefined") {
        style = {};
    }
    var element = document.createElement(type);
    var t = document.createTextNode(text);
    element.appendChild(t);
    element.onclick = func;
    element.style.height = style.height;
    element.style.width = style.width;
    element.style.marginLeft = style.margin_left;
    element.style.marginRight = style.margin_right;
    element.style.marginTop = style.margin_top;
    element.style.marginBottom = style.margin_bottom;
    document.body.insertBefore(element, after);
    return element;
}


function download_pic() {
    "use strict";
    var dl = document.createElement("a");
    var not_filename = "https://pbs.twimg.com/media/";
    var not_filetype = ":orig";
    var filename = location.href.slice(
        not_filename.length, location.href.length - not_filetype.length);
    dl.href = location.href;
    dl.setAttribute("download", filename);
    dl.click();
}


// function iqdb_search() {
//     "use strict";
//     location.href = "https://iqdb.org?url=" + location.href;
// }


(function() {
    "use strict";
    console.log("(Full Image) Running.");
    if (window.location.href.includes(":large")) {
        console.log("(Full Image) Will replace large with original.");
        window.location.href = window.location.href.replace(":large", ":orig");
    } else if (!window.location.href.includes(":orig")) {
        console.log("(Full Image) Will change URL to original.");
        window.location.href += ":orig";
    }

    var img = document.getElementsByTagName("img")[0];
    var spacing = dom_create("p", "", img);
    var btn = dom_create("button", "Download", spacing, download_pic);
    // var btn_2 = dom_create(
    //     "button", "IQDB Search", spacing, iqdb_search, {
    //             margin_left: "20px"});
})();
