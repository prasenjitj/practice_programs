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

const message = function(){
  'currency': new com.google.onebox.features.lottery.feed.Currency(),

};
/**
 * Captures source code on the detailed page and pushes to the output result.
 */
crawlData.ExtractLotteryResult.prototype.getDetailContent = function() {
  console.log('inside getDetailContent');
  const currency = new com.google.onebox.features.lottery.feed.Currency;
  const renderResult = this.getContext().getRenderResult();
  const URL = extension.target.location.href;
  let lotteryId = extension.target.location.host.split('.');
  lotteryId = lotteryId[lotteryId.length - 2];
  let officialName =
      extension.target.document.querySelector('.ws-nve-quote-giochi h2');
  let game = crawlData.setGameValues(URL, lotteryId, officialName);
  renderResult.setGame(game);
  const jackpot = crawlData.getEstimatedJackpot('#ws-nve-montConc');
  if (jackpot) {
    let moneyValue = new com.google.onebox.features.lottery.feed.MoneyValue;
    currency.setId('EUR');
    moneyValue.setCurrency(currency);
    moneyValue.setAmount(parseFloat(jackpot));
    renderResult.setEstimatedWinnings(moneyValue);
  }
  var [lotteryDate, lotterySequence] =
      crawlData.getDateAndSequence('.ws-containerCombinazione');
  renderResult.setDateDrawn(lotteryDate);
  if (!isNaN(lotterySequence)) {
    renderResult.setLotteryDrawingRoundSequence(lotterySequence);
  } else {
    console.error('Not a valid sequence. Possible DOM change detected.');
  }
  const regexp = /[\s\S*]*/i;
  let winningResult = crawlData.setPrizes(
      'table', 'class', 'ws-nve-tblQuote thWidth', lotteryId, regexp);
  const mainDrawElement = Array.from(
      extension.target.document.querySelectorAll('.ws-numberEstrazione'));
  crawlData.setPrizeCategoryValue(renderResult, lotteryId, game);
  // let firstWinningResult = crawlData.setPrize(lotteryId, response);
  crawlData.setDrawValues(
      lotteryId, renderResult, mainDrawElement, winningResult);
  renderResult.addWinningResults(winningResult);
  this.setNextState_(crawlData.ExtractLotteryResult.State.FINISHED);
};
/**
 * Does pre-processing before click event entries: finds all event entries and
 * shows more links on the page.
 */
crawlData.ExtractLotteryResult.prototype.preprocess = function() {
  this.setNextState_(crawlData.ExtractLotteryResult.State.GET_DETAIL_CONTENT);
};
/**
 * Returns Estimated jackpot Value or Null if not found.
 * @param  {string} selector
 * @return {number} Estimated jackpot remaining after this result
 */
crawlData.getEstimatedJackpot = function(selector) {
  let parentNode = extension.target.document.querySelectorAll(selector);
  let jackpotFingerPrintElement =
      extension.target.document.querySelector('.ws-nve-montepremi strong');
  let jackpotFingerPrintValue =
      jackpotFingerPrintElement && jackpotFingerPrintElement.innerText;
  if (jackpotFingerPrintValue == FINGERPRINT_MAP['jackpot']) {
    for (let i = 0; i < parentNode.length; i++) {
      let pTag = parentNode[i].innerText;
      if (pTag.match(/(.*?)\s€/)) {
        let jackpot =
            pTag.match(/(.*?)\s€/)[1].trim().replace(/\./g, '').replace(
                ',', '.');
        if (!isNaN(jackpot)) {
          return jackpot;
        } else {
          console.error('Jackpot is not Number. Possible DOM change detected.');
        }
      } else {
        console.error('Jackpot value not found. Possible DOM change detected.');
      }
    }
  } else {
    console.error('Jackpot fingerPrint failed. Possible DOM change detected.');
  }
};
/**
 * Set prize categories for the game.
 * @param {Object} renderResult - renderResult object
 * @param {string} lotteryId - Lottery Id value
 * @param {Object} game - Game object
 */
crawlData.setPrizeCategoryValue = function(renderResult, lotteryId, game) {
  if (TITLE_MAP.hasOwnProperty(lotteryId)) {
    const id = TITLE_MAP[lotteryId];
    for (let i in CATEGORY_MAP[id]) {
      let prizeCategory =
          new com.google.onebox.features.lottery.feed.PrizeCategory;
      prizeCategory.setId(CATEGORY_MAP[id][i]['id']);
      prizeCategory.setOfficialName(CATEGORY_MAP[id][i]['official_name']);
      prizeCategory.setRank(parseInt(CATEGORY_MAP[id][i]['rank'], 10));
      game.addPrizeCategory(prizeCategory);
    }
    renderResult.setGame(game);
  } else {
    console.error('Lottery ID not found.Possible DOM change dectecd.');
  }
};
/**
 * Return an Array containing date and lottery Sequence.
 * @param  {string} selector
 * @return {Array<?>}
 */
crawlData.getDateAndSequence = function(selector) {
  let parentNode = extension.target.document.querySelectorAll(selector);
  parentNode = Array.from(parentNode);
  parentNode = parentNode[parentNode.length - 1];
  const regexp = /Concorso/;
  let fingerPrintArray = crawlData.matchFingerPrint(parentNode, 'span', regexp);
  let fingerPrintString = '';
  if (fingerPrintArray.length > 0) {
    fingerPrintString = fingerPrintString + fingerPrintArray.join(';');
  }
  if (FINGERPRINT_MAP['dateAndSequence'].indexOf(fingerPrintString) != -1) {
    let element = parentNode.querySelector('span').innerText;
    let elementValue = element.split(' del ');
    let sequence = elementValue[0].replace(/Concorso\sN°/, '');
    sequence = parseInt(sequence, 10);
    let dateString = elementValue[1].trim();
    let date = new Date();
    goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_it;
    let dateParser =
        new goog.i18n.DateTimeParse('dd MMM yyyy', goog.i18n.DateTimeSymbols);
    dateParser.parse(dateString, date, 0);
    let dateFormatter = new goog.i18n.DateTimeFormat('yyyy-MM-dd');
    let dateValue = dateFormatter.format(date);
    return [dateValue, sequence];
  } else {
    console.error(
        'Date and Lottery Drawn Sequence fingerprint match failed, Possible DOM change detected.');
  }
};
/**
 * Set Draw values for the game.
 * @param  {string} lotteryId
 * @param  {Object} renderResult
 * @param  {Array|HTMLSpanElement} drawElement   Array containing draw html elements.
 * @param  {Object} winningResult
 * @return {Object}               winningResult object
 */
crawlData.setDrawValues = function(
    lotteryId, renderResult, drawElement, winningResult) {
  const drawResult = new com.google.onebox.features.lottery.feed.DrawResult;
  const drawType = new com.google.onebox.features.lottery.feed.DrawType;
  let drawValueFingerPrint =
      extension.target.document.querySelector('.ws-txtCombVincente span') &&
      extension.target.document.querySelector('.ws-txtCombVincente span')
          .innerText.trim();
  if (FINGERPRINT_MAP['drawResult'] == drawValueFingerPrint) {
    for (let i of drawElement) {
      drawResult.addDrawValues(i.innerText);
    }
    drawResult.setDisplayOrder(1);
    drawType.setId('REGULAR_NUMBERS');
    drawResult.setDrawType(drawType);
    winningResult.addDrawResults(drawResult);
    return winningResult;
  } else {
    console.error(
        'Drawresult fingerprint failed.Possible DOM change detected.');
  }
};
/**
 * Set prize object for vincicasa.
 * @param {string} tagname
 * @param {string} property
 * @param {string} expression
 * @param {string} lotteryId
 * @param {RegExp} regexp
 * @return {Object}
 */
crawlData.setPrizes = function(
    tagname, property, expression, lotteryId, regexp) {
  let prizeTable =
      crawlData.getElementByTagNameAndProperty(tagname, property, expression);
  const winningResult =
      new com.google.onebox.features.lottery.feed.WinningResult;
  let fingerPrintArray = crawlData.matchFingerPrint(prizeTable, 'th', regexp);
  let fingerPrintString;
  if (fingerPrintArray != null) {
    fingerPrintString = fingerPrintArray.join(';').trim();
  } else {
    console.error(
        'Failed to generate fingerprint string, Possible DOM change detected.');
  }
  if (FINGERPRINT_MAP['prize'].indexOf(fingerPrintString) != -1) {
    let trTag = Array.from(prizeTable.querySelectorAll('tbody tr'));
    trTag.shift();
    for (let i = 0; i < trTag.length; i++) {
      const prize = new com.google.onebox.features.lottery.feed.Prize;
      const moneyValue = new com.google.onebox.features.lottery.feed.MoneyValue;
      const currency = new com.google.onebox.features.lottery.feed.Currency;
      const locationWinnersPrize =
          new com.google.onebox.features.lottery.feed.LocationWinnersPrize;
      let otherElements = Array.from(trTag[i].querySelectorAll('td'));
      let [winnersElement, categoryElement, prizeElement] = otherElements;
      if (categoryElement && winnersElement && prizeElement) {
        let prizeCategoryValue = categoryElement.innerText.trim();
        let prizeWinnersValue = winnersElement.innerText.trim() == 'nessuna' ?
            '0' :
            winnersElement.innerText.trim();
        let prizeAmountValue = prizeElement.innerText.trim();
        if (CATEGORY_MAP[TITLE_MAP[lotteryId]][i]['official_name'] ==
            prizeCategoryValue) {
          prize.setPrizeCategoryId(CATEGORY_MAP[TITLE_MAP[lotteryId]][i]['id']);
          if (prizeAmountValue == '0,00') {
            moneyValue.setAmount(parseFloat(0.00));
          } else {
            moneyValue.setAmount(parseFloat(
                prizeAmountValue.replace(/\./g, '').replace(',', '.')));
          }
          currency.setId('EUR');
          moneyValue.setCurrency(currency);
          locationWinnersPrize.setNumberOfWinners(
              parseInt(prizeWinnersValue, 10));
          locationWinnersPrize.setMoneyWon(moneyValue);
          prize.setLocationWinnersPrize(locationWinnersPrize);
          winningResult.addPrizes(prize);
        } else {
          console.error(
              'Prize Category fingerprint failed. Possible DOM change detetcted.');
        }
      } else {
        console.error(
            'Prize elements not found. Possible DOM change detetcted.');
      }
    }
    return winningResult;
  } else {
    console.error(
        'Prize table fingerprint match failed, Possible DOM change detected.');
  }
};

/**
 * Setter method for game.
 * @param {string} URL
 * @param {string} lotteryId
 * @param {Element} officialName
 * @return {Object}
 */
crawlData.setGameValues = function(URL, lotteryId, officialName) {
  const game = new com.google.onebox.features.lottery.feed.Game;
  const organizer = new com.google.onebox.features.lottery.feed.Organizer;
  const gamecategory = new com.google.onebox.features.lottery.feed.GameCategory;
  const organizerValue = 'Sisal';
  game.setResultPageUrl(URL);
  if (lotteryId == TITLE_MAP[lotteryId]) {
    game.setId(TITLE_MAP[lotteryId]);
  } else {
    console.error('LotteryId fingerprint failed. Possible DOM change detcted.');
  }
  if (officialName) {
    officialName = officialName.innerText.replace(/Quote\s/, '');
    game.setOfficialName(officialName.trim());
  } else {
    console.error('Official Name not found. Possible DOM change detected.');
  }
  organizer.setId('sisal');
  organizer.setOfficialName(organizerValue);
  game.setOrganizer(organizer);
  game.setCountry('IT');
  game.setLanguage('IT');
  gamecategory.setId('lottery');
  game.setGameCategory(gamecategory);
  return game;
};
