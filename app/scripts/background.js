'use strict';

var idsList = [];

var getIds = function(callback) {
    if (idsList.length == 0) {
        console.log("Getting IDs...");

        $.get('http://backbonejs.org', function(data) {
            $("[id]", data).each(function(k,v) {
                idsList.push(v.id);
            })
        });
    }

    if (typeof callback == "function") {
        callback();
    }
};

getIds();

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.pageAction.show(tabId);
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    getIds(function() {
        var suggestList = [];

        $.each(idsList, function(k,value) {
            console.log("ID: "+value);

            if (value.toLowerCase().search(text.toLowerCase()) > -1) {
                suggestList.push({ content: value, description: "Documentation for: " + value });
            }
        });

        suggest(suggestList);
    });
});

chrome.omnibox.onInputEntered.addListener(function(text) {
    chrome.tabs.create({
        url: "http://backbonejs.org/#" + text
    }, function() {

    })
});