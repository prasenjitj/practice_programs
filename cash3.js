
function crawlData(){}

                                                                                        crawlData.prototype.lottery =function () {
}
/**
 * Returns Array of Nodes
 * @param {Object} node
 * @param {string}  param
 * @return {Array}
 */
crawlData.prototype.getElements = function (node, param) {
    var elements = Array.from(node.querySelectorAll(param));
    if (elements.length !== 0) {
        return elements;
    }
};
/**
 * Throws custom exception
 * @param {string} message
 */
crawlData.prototype.customException = function (message) {
    throw message;
};
/**
 *
 *
 * @param {any} h3
 * @returns
 */
crawlData.prototype.getDate = function (h3) {
    if (!h3) {
        this.customException("Date element not found");
    }
    return h3.innerText.replace(/\s-\s.*/, "");
};
crawlData.prototype.getDayFromDate = function(dateString){
    var date = new Date(dateString);
    return date.getDay();
};
/**
 *
 *
 * @param {any} h3
 * @returns
 */
crawlData.prototype.getGameType = function (h3) {
    if (!h3) {
        this.customException("Game type element not found");
    }
    return h3.innerText.replace(/\d{1,2}\/\d{1,2}\/\d{4}\s-\s/, "");
};

/**
 *
 *
 * @param {any} span
 * @returns
 */
crawlData.prototype.getDrawValues = function (span) {
    return span.map((item) => item.innerText);
};
crawlData.prototype.getFingerPrint = function(tag){
    return tag.innerText;
};
/**
 *
 *
 * @returns
 */
crawlData.prototype.setObject = function () {
    var parenElement = document.querySelector("#winner_wrapper");
    if (!parenElement) {
        this.customException("Parent element not found.");
    }
    var resultElement = this.getElements(parenElement, ".winner-entry");
    for (var element of resultElement) {

        var h3 = element.querySelector("h3");
        if(!h3){
            this.customException("H3 tag not found.");
        }
        var fingerPrint = this.getFingerPrint(h3);
        if(!fingerPrint.match(/\d{1,2}\/\d{1,2}\/\d{4}\s-\s(Midday|Evening)/)){
            this.customException("Fingerprint check failed.");
        }
        var span = this.getElements(element, "span");
        var date = this.getDate(h3);
        var day = this.getDayFromDate(date);
        var gameType = this.getGameType(h3);
        var drawValues = this.getDrawValues(span);
        // If day is not sunday.
        if(day === 0 && gameType === "Evening"){
            return this.lottery[gameType] = {
                game: {
                    id: "cash_3",
                    url: location.href,
                    country: "US",
                    language: "en",
                    date_drawn: date,
                },
                gameCategory: gameType,
                winningResult: [{
                    drawResult: {
                        drawValues: drawValues,
                        drawType: "REGULAR_NUMBERS",
                    }
                }]
            };
        } else {
            this.lottery[gameType] = {
                game: {
                    id: "cash_3",
                    url: location.href,
                    country: "US",
                    language: "en",
                    date_drawn: date,
                },
                gameCategory: gameType,
                winningResult: [{
                    drawResult: {
                        drawValues: drawValues,
                        drawType: "REGULAR_NUMBERS",
                    }
                }]
            };

        }

    }
    return this.lottery;
};

var cash3 = new crawlData();
JSON.stringify(cash3.setObject(),null,2);
