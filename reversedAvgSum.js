/**
 * when given 3-5 digit integers, return the average of the sum of the
 * first 3 digitd in the reverse order
 * @param {Array} list 
 */
function digitAv(list) {
    let temp, final = [], avg = 0;
    for (let i of list) {
        let digitSum = 0
        if (i > 99) {
            tempArr = String(i).split('');
            tempArr = tempArr.slice(0, 3);
            tempArr = tempArr.reverse();
            for (let j of tempArr) {
                digitSum += Number(j);
            }
            final.push(digitSum);
        }
    }
    for (let k in final) {
        avg += final[k];
    }
    return avg / final.length;
}

ls = [1243, 123, 456, 7, 8, 1, 999]
console.log('digitAv(ls): ', digitAv(ls));
