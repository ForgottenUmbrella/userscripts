// ==UserScript==
// @name DuckDuckGoogle
// @description Try to search DuckDuckGo, and if it fails, use Google instead.
// @author ForgottenUmbrella
// @namespace https://greasyfork.org/users/83187
// @version 1.0.2
// @match *://duckduckgo.com/*
// ==/UserScript==

// Return a URL for searching Google.
function googleSearchUrl(query: string): string {
    const base = "https://www.google.com";
    return `${base}/search?q=${query}`;
}

// Return the search query on DuckDuckGo.
function ddgQuery(searchUrl: string): string {
    const params = new URLSearchParams(searchUrl);
    return params.get("q");
}

// Return whether Firefox has encountered a HTTP error.
function firefoxError(): boolean {
    const errors = document.getElementsByClassName("error-message");
    return errors.length !== 0;
}

// Navigate to a URL.
function goto(url: string): void {
    location.href = url;
}

(() => {
    // TODO: Handle Chrome failures.
    const failed = firefoxError();
    if (failed) {
        goto(googleSearchUrl(ddgQuery(location.href)));
    }
})();
