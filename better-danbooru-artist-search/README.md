# Better Danbooru Artist Search
Make the [Danbooru artist search](https://danbooru.donmai.us/artists) more convenient by automatically fixing URLs and navigating to the artist's wiki page.

Recommended to be used in conjunction with the Danbooru artist [search engine](https://danbooru.donmai.us/artists?search[name]=%s) in the Chrome omnibox or the like.

Note: to add the search engine, copy the link above, right-click the omnibox, click _Edit search engines..._, scroll to the bottom of the prompt, enter a name for it, enter a trigger, paste the link into the rightmost box and click _Finished_.

With the search engine and this script, you can easily find the artist's tag on Danbooru by simply navigating to the omnibox/search bar, typing the trigger before the URL and hitting Enter.

Features:
* Prepend the missing `http://` protocol (thanks to browsers being "user-friendly") to URL searches
* Convert the new Pixiv URL form (which has since been deprecated) to the legacy form
* Convert image URLs from Tumblr, Twitter and DeviantArt to the artist page URL, since they are more likely to return results
* Convert mobile Twitter and Nico Seiga URLs for the same above reason
* Converts Pixiv "Artist's Works" pages to their profile pages for the same reason
* Optionally add wildcards to the search if there were no results. (Note: this feature is disabled by default; to enable, change the variable `is_desperate` to `true` in the script. I've yet to make this easily accessible, since I don't need the feature. If you like, please file a request and I'll implement a user-friendly option.)
