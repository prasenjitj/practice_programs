/**
 * [item description]
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
const item = (argument) => {
    return argument.filter(item => item % 2 ==0 );

};
const res = item([2, 4, 3, 6, 7, 8, 9, 6, 8]);
console.log(res);
