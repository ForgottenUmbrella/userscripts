// ==UserScript==
// @name DuckDuckGoogle
// @description Try to search DuckDuckGo, and if it fails, use Google instead.
// @author ForgottenUmbrella
// @namespace https://greasyfork.org/users/83187
// @version 1.0.4
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

// Return whether Firefox has encountered a proxy error.
function firefoxProxyError(): boolean {
    const errors = document.getElementsByClassName("error-message");
    return errors.length !== 0;
}

// Return whether Chrome has encountered a privacy error.
function chromePrivacyError(): boolean {
    const isNewTabPage = document.getElementById("one-google") !== null;
    // Chrome loads the new tab page when a privacy error occurs, so
    // detect whether the current page is the new tab page and return it.
    return isNewTabPage;
}

// Return whether the browser is Chrome.
function isChrome(): boolean {
    return (<any>window).chrome !== undefined;
}

// Navigate to a URL.
function goto(url: string): void {
    location.href = url;
}

(() => {
    const failed = isChrome() ? chromePrivacyError() : firefoxProxyError();
    if (failed) {
        goto(googleSearchUrl(ddgQuery(location.search)));
    }
})();
