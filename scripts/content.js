// We set a timer to periodically check if the subscription feed browser is ready.
const timerId = setInterval(() => {

    // We check if the feed browser is ready
    const feedBrowser = document.getElementsByTagName('ytd-browse')[0];
    if (!feedBrowser) {
        // Not ready yet, will try next time.
        return;
    }

    // If the feed browser is ready, no need to look for it anymore, so we clear the timer.
    clearInterval(timerId);

    // Next we will setup the mutation observer on the feed browser

    // Observer should be configured to react to child mutations anywhere down the subtree.
    const observerConfig = { attributes: false, childList: true, subtree: true };

    /*
        Callback when feedBrowser children change, which is admittedly pretty noisy, but,
        hopefully YouTube subscription feed is not a very dynamic page.
    */
    const mutationCallback = (mutationList, observer) => {

        // Look for SHORTS and UPCOMING overlay icons
        let targets = [
            feedBrowser.querySelectorAll('[overlay-style="SHORTS"]'),
            feedBrowser.querySelectorAll('[overlay-style="UPCOMING"]')];

        // For each target, for each element in the target, hide that element
        targets.forEach((t) => { t.forEach((e) => {

                // We'll have to climb four parent elements before we can tell which layout is used.
                for (var i = 0; i < 4; i++) {
                    e = e.parentElement;
                }

                // Presence of ytd-grid-video-renderer CSS class indicates the Grid layout.
                const isGridLayout = e.classList.contains("ytd-grid-video-renderer");

                /*
                    If grid layout is used - we need to climb one parent until we get to subscription feed item.
                    If list layout is used - we need to climb five parents for the same.
                */
                for (var i = 0; i < (isGridLayout ? 1 : 5); i++) {
                    e = e.parentElement;
                }

                // If this feed item is not hidden yet, hide it.
                const hiddenAlready = e.style.display === 'none';
                if (!hiddenAlready) {
                    e.style.display = 'none';
                }
            });
        });
    };

    // Execute the callback once even before any items change, for the initial removal of shorts.
    mutationCallback(null, null);

    // Initialize and activate the observer.
    const observer = new MutationObserver(mutationCallback);
    observer.observe(feedBrowser, observerConfig);

}, 1000); // Timer will activate once every second.
