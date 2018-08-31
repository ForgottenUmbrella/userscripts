// ==UserScript==
// @name DuckDuckGoogle
// @description Try to search DuckDuckGo, and if it fails, use Google instead.
// @author ForgottenUmbrella
// @namespace https://greasyfork.org/users/83187
// @version 1.0.1
// @match https://duckduckgo.com
// ==/UserScript==

// Some schools' proxy servers interfere with DDG's privacy measures, so
// students have to resort to Google. This userscript seeks to automate
// that process.
// It is recommended that users don't sign in to Google, or use a
// container to protect their privacy.

// Return a URL for searching Google.
function googleSearchUrl(query) {
    const base = "https://www.google.com";
    return `${base}/search?q=${query}`;
}

// Return the search query on DuckDuckGo.
function ddgQuery(searchUrl) {
    const params = new URLSearchParams(searchUrl);
    return params.get("q");
}

// Return whether Firefox has encountered a HTTP error.
function firefoxError() {
    const errors = document.getElementsByClassName("error-message");
    return errors.length !== 0;
}

// Navigate to a URL.
function goto(url) {
    location.href = url;
}

(() => {
    // TODO: Handle Chrome failures.
    const failed = firefoxError();
    if (failed) {
        goto(googleSearchUrl(ddgQuery(location.href)));
    }
})();
