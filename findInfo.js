/**
 * Create an object of key value pair with info form li tags.
 * @return {object} key value pair object from li elments.
 */
function findDetailInfo() {
    var infoObject = {};
    var values = [];
    var infoElement = document.querySelectorAll('ul.info li b, ul.details-column li b');
    if (infoElement.length < 1) {
        console.log('countInfo');
        return null;
    }
    for (var i = 0; i < infoElement.length; i++) {
        if (infoElement[i].nextSibling !== null) {
            var key = infoElement[i].innerText.replace(':', '').trim();
            var value = infoElement[i].nextSibling;
            if (value.nodeValue !== null) {
                infoObject[key] = value.nodeValue.trim();
            } else if (value.innerText !== null) {
                if (key === 'Autor') {
                    values.push({
                        value: value.innerText.trim(),
                        link: value.getAttribute('href') ? value.getAttribute('href') : null
                    });
                    infoObject[key] = values;
                }
                else if (key === 'Assunto') {
                    aTags = infoElement[i].parentElement.querySelectorAll('a');
                    if (aTags.length > 0) {
                        var categories = Array.prototype.map.call(aTags, x => x.innerText).join(' - ');
                        infoObject[key] = categories;
                    }
                } else {
                    infoObject[key] = value.innerText.trim();
                }
            }
        }
    }
    return infoObject;
}
