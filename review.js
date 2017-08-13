/**
 * Get element if element exist and has innerText.
 * @param  {Element} element
 * @return {Element}
 */
function getElement(element, mode){
    if(element && mode == 0){
        return element.innerText;
    }
    if(element && mode == 1){
        return element.innerHTML;
    }
    return null;
}
/**
 * Function to get array of review objects.
 * @return {Array} An array of review objects
 */
function getReview(){
    var reviews = [];
    var parentDiv = document.querySelectorAll('._3nrCtb');
    for (var i = 0; i < parentDiv.length; i++) {
      var review = {};
      var detail = [];
        var reviewText = getElement(parentDiv[i].querySelector('.qwjRop'), 0);
        var reviewTitle = getElement(parentDiv[i].querySelector('._2xg6Ul'), 0);
        var reviewer = getElement(parentDiv[i].querySelector('._3LYOAd'), 0);
        var dateValue = getElement(parentDiv[i].querySelector('.col.col-8-12'), 0);
        var ratingValue = getElement(parentDiv[i].querySelector('.hGSR34'), 0);
        var helpfulElement = getElement(parentDiv[i].querySelector('._3KBEVV'), 1);
        if(reviewText){
          reviewText = reviewText.replace(/\n?READ MORE/,'');
          review.value = reviewText.trim();
          if(reviewTitle){
              detail.push({key: 'Title',value : reviewTitle});
          }
          if(reviewer){
              detail.push({key:'User Name', value: reviewer});
          }
          if(dateValue){
              var date = dateValue.match(/\d\d?\s.*/g);
              if(date){
                  detail.push({key:'Date',value: date[0]});
              }
          }
          if(ratingValue){
              var userRating = ratingValue.replace('★','');
              detail.push({key:'Rating',value:userRating},
                          {key:'Maximum Rating',value: '5'});
          }
          if(helpfulElement){
              helpfulElement = helpfulElement.replace(/<\/span><\/div><div class="_2ZibVB _1FP7V7".*?>/,',');
              helpfulElement = helpfulElement.replace(/<.*?>/g,'').replace('PermalinkReport Abuse','');
              helpfulElement = helpfulElement.split(',');
              var helpful = helpfulElement[0];
              var notHelpful = helpfulElement[1];
              if(helpful && notHelpful){
                  var totalHelpuful = String(Number(helpful) + Number(notHelpful));
                  detail.push({key: 'Helpful', value: helpful},
                              {key: 'Total Helpful', value: totalHelpuful});
              }
          }
          if(detail.length > 0){
              review.details = detail;
          }
          reviews.push(review);
        }

    }
    return reviews;
}
