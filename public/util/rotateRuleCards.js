const arr_left = document.querySelector('.arrow_left');
const arr_right = document.querySelector('.arrow_right');
const cards = Array.from(document.querySelectorAll('.card'));
let cardContent = cards.map(curr => curr.innerHTML); // go through the cards and assign all the html in them to array elems

const toggleContent = direction => {
    let newOrder = cardContent.slice(); // copy the current order into temp variable

    /* 
        if it's moving the array elements right, it adds another element to the beginning of the array to shift the old values by one index and then adds the value of the last element to the new first elment, thus making the shift of elements by one space complete, and then just assigns everything except the last element (because it's a duplicate of the last, now first value) to the original array
        if it's moving the elements left, it just inserts the first element to the end of the array and takes all the elements except the first one
    */

    if(direction === 'right') {
        newOrder.unshift('');
        newOrder[0] = newOrder[newOrder.length-1];
        cardContent = newOrder.slice(0, newOrder.length-1);
    }
    else {
        newOrder.push(newOrder[0]);
        cardContent = newOrder.slice(1, newOrder.length);
    }

    // display the shifted card content
    cards.forEach((curr, i) => curr.innerHTML = cardContent[i]);
}

arr_right.addEventListener('click', () => toggleContent('right'));
arr_left.addEventListener('click', () => toggleContent('left'));