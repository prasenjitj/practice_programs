/**
 * @fileoverview Lottery extraction Task for vincicasa.
 * Gets all lottery detail info from vincicasa lottery website and put them into
 * extension
 * result, including htmls of  detail content and urls of out link detail
 * page.
 */
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.i18n.DateTimeSymbols_it');
/**
 * variable that neeeds to be initialized in common.js
 */
this.prizeCategory_ = new com.google.onebox.features.lottery.feed.PrizeCategory;
this.winningResult_ = new com.google.onebox.features.lottery.feed.WinningResult;
this.prize_ = new com.google.onebox.features.lottery.feed.Prize;
this.moneyValue_ = new com.google.onebox.features.lottery.feed.MoneyValue;
this.currency_ = new com.google.onebox.features.lottery.feed.Currency;
this.locationWinnersPrize_ = new com.google.onebox.features.lottery.feed.LocationWinnersPrize;
this.drawResult_ = new com.google.onebox.features.lottery.feed.DrawResult;
this.drawType_ = new com.google.onebox.features.lottery.feed.DrawType;
/**
 * Get url
 * @return {Element}
 */
crawlData.ExtractLotteryResult.prototype.url = function() {
    return domRef.location.href;
};
/**
 * Get lotteryId
 * @return {string} [description]
 */
crawlData.ExtractLotteryResult.prototype.lotteryId = function() {
    const id = domRef.location.host.split('.')[1];
    //TODO:check if this is working or fix it.
    return TITLE_MAP.hasOwnProperty(id) ? TITLE_MAP[id] : console.error('LotteryId fingerprint failed. Possible DOM change detcted.');
};
/**
 * Get officialName
 * @return {string}
 */
crawlData.ExtractLotteryResult.prototype.officialName = function() {
    const officialNameElement = domRef.document.querySelector('.ws-nve-quote-giochi h2');
    return officialNameElement ? this.officialNameElement.innerText.replace(/Quote\s/, '').trim() : console.error('Official Name not found. Possible DOM change detected.');
};
/**
 * Set game.
 * @param {string} url
 * @param {string} lotteryId
 * @param {Element} officialName
 */
crawlData.ExtractLotteryResult.prototype.setGameValues = function() {
    this.game_.setResultPageUrl(this.url());
    this.game_.setId(TITLE_MAP[this.lotteryId()]);
    this.game_.setOfficialName(this.officialName());
    // TODO(prasenjitj) : Add fingerprint for organizer Id 'sisal'
    this.organizer_.setId('sisal');
    this.organizer_.setOfficialName('Sisal');
    this.game_.setOrganizer(this.organizer_);
    this.game_.setCountry('IT');
    this.game_.setLanguage('IT');
    this.game_category.setId('lottery');
    this.game_.setGameCategory(this.gamecategory_);
    this.renderResult_.setGame(this.game_);
};
crawlData.ExtractLotteryResult.replaceChars = {
    "\\.": "",
    ",": ".",
    "€": ""
};
const regex = new RegExp(Object.keys(crawlData.ExtractLotteryResult.replaceChars).join("|"), "g");
/**
 * [checkJackpot description]
 * @param  {[type]} selector [description]
 * @return {[type]}          [description]
 */
crawlData.ExtractLotteryResult.prototype.checkJackpot = function(selector) {
    const fingerprint = this.getElement(this.domRef_.document, selector).innerText.trim();
    return fingerprint == FINGERPRINT_MAP['jackpot'] ? true : console.error('Jackpot fingerPrint failed. Possible DOM change detected.');
}
/**
 * Get jackpot value.
 * @param  {string} selector
 * @return {number}
 */
crawlData.ExtractLotteryResult.prototype.getJackpot = function(selector) {
    let jackpotString = this.getElement(this.domRef_.document, selector).innerText.trim();
    if (this.checkJackpot('.ws-nve-montepremi strong')) {
        if (jackpotString.indexOf('€') !== -1) {
            return jackpotString.replace(regex, function(match) {
                return match == '.' ? crawlData.ExtractLotteryResult.replaceChars['\\.'] : crawlData.ExtractLotteryResult.replaceChars[match];
            });
        }
    }
};
/**
 * Set jackpot value
 */
crawlData.ExtractLotteryResult.prototype.setJackpot = function() {
    const jackpot = this.getJackpot('#ws-nve-montConc');
    if (jackpot) {
        this.currency_.setId('EUR');
        this.moneyValue_.setCurrency(currency);
        this.moneyValue_.setAmount(parseFloat(jackpot));
        this.renderResult_.setEstimatedWinnings(this.moneyValue_);
    }
};
/**
 * Return an Array containing date and lottery Sequence.
 * @param  {string} selector
 * @return {Object}
 */
crawlData.ExtractLotteryResult.prototype.getDateAndSeqElement = function(selector) {
    let nodeArray = Array.from(domRef.document.querySelectorAll(selector));
    nodeArray = nodeArray[nodeArray.length - 1];
    //TODO : Fix crawlData.matchFingerPrint.
    let fingerPrintArray = crawlData.ExtractLotteryResult.matchFingerPrint(nodeArray, 'span', /Concorso/);
    if (fingerPrintArray.length > 0) {
        let fingerPrintString += fingerPrintArray.join(';');
    }
    if (FINGERPRINT_MAP['dateAndSequence'].indexOf(fingerPrintString) != -1) {
        return function(nodeArray) {
            return nodeArray.querySelector('span').innerText.split(' del ');
        }
    } else {
        console.error('Date and Lottery Drawn Sequence fingerprint match failed, Possible DOM change detected.');
    }
};
/**
 * [getSequnce description]
 * @param  {[type]} concorso [description]
 * @return {[type]}          [description]
 */
crawlData.ExtractLotteryResult.prototype.getSequnce = function(concorso) {
    let sequnceString = concorso[0].replace(/Concorso\sN°/, '');
    return !isNaN(sequnceString) ? parseInt(sequnceString, 10) : console.error('Not a valid sequence. Possible DOM change detected.');
};
/**
 * [getDate description]
 * @param  {[type]} concorso [description]
 * @return {[type]}          [description]
 */
crawlData.ExtractLotteryResult.prototype.getDate = function(concorso) {
    return concorso[1].trim();
};
/**
 * [getFormatedDate description]
 * @param  {[type]} dateString [description]
 * @return {[type]}            [description]
 */
crawlData.ExtractLotteryResult.prototype.getFormatedDate = function(dateString) {
    const date = new Date();
    goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_it;
    const dateParser = new goog.i18n.DateTimeParse('dd MMM yyyy', goog.i18n.DateTimeSymbols);
    dateParser.parse(dateString, date, 0);
    const dateFormatter = new goog.i18n.DateTimeFormat('yyyy-MM-dd');
    return dateFormatter.format(date);
};
/**
 * Set prize categories for the game.
 * @param {Object} renderResult - renderResult object
 * @param {string} lotteryId - Lottery Id value
 * @param {Object} game - Game object
 */
crawlData.ExtractLotteryResult.prototype.setPrizeCategoryValue = function() {
    for (let i in CATEGORY_MAP[this.lotteryId()]) {
        this.prizeCategory_.setId(CATEGORY_MAP[id][i]['id']);
        this.prizeCategory_.setOfficialName(CATEGORY_MAP[id][i]['official_name']);
        this.prizeCategory_.setRank(parseInt(CATEGORY_MAP[id][i]['rank'], 10));
        this.game_.addPrizeCategory(this.prizeCategory_);
    }
    this.renderResult_.setGame_(game);
};
//TODO: Move to common.js
crawlData.ExtractLotteryResult.prototype.getElement = function(node, selector) {
    const element = node.querySelector(selector);
    return element ? element : console.error('DOM element not found. Possible DOM change detected.');
};
//TODO: Move to common.js
crawlData.ExtractLotteryResult.prototype.getElements = function(node, selector) {
    const elements = node.querySelectorAll(selector);
    return elements.length > 0 ? Array.from(elements) : console.error('DOM elements not found. Possible DOM change detected.');
};
crawlData.ExtractLotteryResult.prototype.checkPrizeFingerPrint = function(selector) {
    let prizeTable = this.getElement(this.domRef_.document, selector);
    let fingerPrintArray = this.matchFingerPrint(prizeTable, 'th', /[\s\S*]*/i);
    //TOOD: Move this section to macheFingerPrint() in common.js
    //*****
    let fingerPrintString;
    if (fingerPrintArray != null) {
        fingerPrintString = fingerPrintArray.join(';').trim();
    } else {
        console.error('Failed to generate fingerprint string, Possible DOM change detected.');
    }
    //*****
    return FINGERPRINT_MAP['prize'].indexOf(fingerPrintString) != -1 ? true : console.error('Prize table fingerprint match failed, Possible DOM change detected.');
};
/**
 * get prize category
 * @param  {Element} element
 * @return {string}
 */
crawlData.ExtractLotteryResult.prototype.getPrizeCategory = function(element) {
    return element.innerText.trim();
};
/**
 * get prize winner
 * @param  {Element} element
 * @return {string}
 */
crawlData.ExtractLotteryResult.prototype.getPrizeWinner = function(element) {
    return innerText.trim() == 'nessuna' ? '0' : winnerElement.innerText.trim();
};
/**
 * get prize amount
 * @param  {Element} element
 * @return {number}
 */
crawlData.ExtractLotteryResult.prototype.getPrizeAmount = function(element) {
    const amount = element.innerText.trim();
    return amount == '0,00' ? parseFloat(0.00) : parseFloat(amount.replace(/\./g, '').replace(',', '.'));
};
/**
 * check prize category fingerprint
 * @param  {number} index
 * @param  {Element} element
 * @return {boolean}
 */
crawlData.ExtractLotteryResult.prototype.checkPrizeCategoryFingerPrint = function(index, element) {
    return CATEGORY_MAP[TITLE_MAP[this.lotteryId()]][index]['official_name'] === this.getPrizeCategory(element) ? true : console.error('Prize Category fingerprint failed. Possible DOM change detetcted.');
};
/**
 * Set prize
 * @param {string} selector
 * @return {Object}
 */
crawlData.ExtractLotteryResult.prototype.setPrizes = function(selector) {
    if (this.checkPrizeFingerPrint(selector)) {
        let trTag = this.getElements('tbody tr');
        trTag.shift();
        for (let i in trTag) {
            let otherElements = this.getElements(trTag[i], 'td');
            let [winnerElement, categoryElement, prizeElement] = otherElements;
            if (categoryElement && winnerElement && prizeElement) {
                if (this.checkPrizeCategoryFingerPrint) {
                    this.prize_.setPrizeCategoryId(CATEGORY_MAP[TITLE_MAP[this.lotteryId()]][i][this.getPrizeCategory(categoryElement)]);
                    this.prize_.setAmount(this.getPrizeAmount(prizeElement));
                    this.currency_.setId('EUR');
                    this.moneyValue_.setCurrency(this.currency_);
                    this.locationWinnersPrize_.setNumberOfWinners(parseInt(this.getPrizeWinner(winnerElement), 10));
                    this.locationWinnersPrize_.setMoneyWon(this.moneyValue_);
                    this.prize_.setLocationWinnersPrize(this.locationWinnersPrize_);
                    this.winningResult_.addPrizes(this.prize_);
                }
            } else {
                console.error('Prize elements not found. Possible DOM change detetcted.');
            }
        }
    }
};
/**
 * check draw finger print
 * @param  {string} selector
 * @return {boolean}
 */
crawlData.ExtractLotteryResult.prototype.checkDrawFingerPrint = function(selector) {
    const fingerPrint = this.getElement(this.domRef_, selector).innerText.trim();
    return FINGERPRINT_MAP['drawResult'] === fingerPrint ? true : console.error('Drawresult fingerprint failed.Possible DOM change detected.');
}
/**
 * Set draw values
 * @param  {string} selector
 */
crawlData.ExtractLotteryResult.prototype.setDrawValues = function(selector) {
    const drawElement = this.getElements(this.domRef_, selector);
    if (this.checkDrawFingerPrint('.ws-txtCombVincente span')) {
        for (let i of drawElement) {
            this.drawResult_.addDrawValues(i.innerText.trim());
        }
        this.drawResult_.setDisplayOrder(1);
        this.drawType_.setId('REGULAR_NUMBERS');
        this.drawResult_.setDrawType(this.drawType_);
        this.winningResult_.addDrawResults(this.drawResult_);
    }
};
/**
 * Captures source code on the detailed page and pushes to the output result.
 */
crawlData.ExtractLotteryResult.prototype.getDetailContent = function() {
    console.log('inside getDetailContent');
    const concorso = this.getDateAndSequence('.ws-containerCombinazione');
    this.renderResult_.setDateDrawn(this.getFormatedDate(this.getDate(concorso())));
    this.renderResult_.setLotteryDrawingRoundSequence(this.getSequnce(concorso()));
    this.setGameValues(url, lotteryId, officialName);
    this.setJackpot();
    this.setPrizeCategoryValue();
    this.setPrizes('.ws-nve-tblQuote.thWidth');
    this.setDrawValues(selector);
    this.renderResult_.addWinningResults(this.winningResult_);
    this.setNextState_(crawlData.ExtractLotteryResult.State.FINISHED);
};
/**
 * Does pre-processing before click event entries: finds all event entries and
 * shows more links on the page.
 */
crawlData.ExtractLotteryResult.prototype.preprocess = function() {
    this.setNextState_(crawlData.ExtractLotteryResult.State.GET_DETAIL_CONTENT);
};
