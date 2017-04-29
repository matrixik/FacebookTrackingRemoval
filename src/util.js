var log = function(){};

const ALLOWED_CLICK_ELEMENTS = ["A", "INPUT", "SELECT", "BUTTON"];
function isAllowedTarget(e) {
    let checkTarget = e.target;

    // Walk through event target and parents until the currentTarget looking for an element that clicks are allowed on
    while (e.currentTarget !== checkTarget) {
        let role = checkTarget.attributes.role;
        if (ALLOWED_CLICK_ELEMENTS.includes(checkTarget.tagName) || checkTarget.classList.contains("FBTR-SAFE") || (role && role.value.toUpperCase() == "BUTTON"))
            return true;
        checkTarget = checkTarget.parentNode;
    }

    return false;
}

// Meant to be used as a capturing event handler
function restrictEventPropagation(e) {
    if (!isAllowedTarget(e))
    {
        log("Prevented propagation of " + e.type + " to " + e.target);
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
}

function stopPropagation(e) {
    e.stopPropagation();
}

function extractQuotedString(s) {
    return s.substring(s.indexOf('"') + 1, s.lastIndexOf('"'));
}

function removeAllAttrs(elem) {
    while (elem.attributes.length)
        elem.removeAttribute(elem.attributes[0].name);
}

function buildCollapsible(label) {
    const content = document.createElement("summary");
    content.textContent = label;
    content.classList.add("fbtrLabel");

    const collapsible = document.createElement("details");
    collapsible.classList.add("fbtrCollapsible", "mbm", "_4-u8");
    collapsible.appendChild(content);

    return collapsible;
}

const STRIPPED_PARAMS = ["ref", "ref_type", "source"];
function cleanLinkParams(link) {
    try {
        const url = new URL(link, location.origin);
        const cleanParams = new URLSearchParams(url.search);
        STRIPPED_PARAMS.forEach(cleanParams.delete.bind(cleanParams));
        url.search = cleanParams;
        return url.pathname + url.search;
    } catch (e) {
        return link;
    }
}

function getOptions() {
    return browser.storage.local.get(localOptions).then(opts => {
        const storage = browser.storage[opts.enableSync ? "sync" : "local"] || browser.storage.local;
        return storage.get();
    });
}