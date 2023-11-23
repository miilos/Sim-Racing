const p1 = document.getElementById('p1')
const p2 = document.getElementById('p2')
const modal = document.querySelector('.modal')
let p1Left = 0
let p2Left = 0
let breakdown = false

modal.style.visibility = 'hidden'

const reset = () => {
    p1.style.left = '0px'
    p2.style.left = '0px'
    p1Left = 0
    p2Left = 0
    modal.style.visibility = 'hidden'
}

document.addEventListener('keydown', event => {
    if(p1.style.left === '650px' || p2.style.left === '650px') {
        modal.style.visibility = 'visible'
        document.querySelector('.modal_title').textContent = `Player ${p1.style.left > p2.style.left ? '1' : '2'} won!`
        return
    }

    const percent = Math.floor(Math.random()*100)
    if(percent <= 50)
        breakdown = true

    if(event.key === 'ArrowRight') {
        if(!breakdown) {
            p1.style.color = '#F2B138'
            p1.style.left = `${p1Left+10}px`
            p1Left += 10
        }
        else
            p1.style.color = '#F25A38'
    }
    else if(event.key === 'd') {
        if(!breakdown) {
            p2.style.color = '#F2B138'
            p2.style.left = `${p2Left+10}px`
            p2Left += 10
        }
        else
            p2.style.color = '#F25A38'
    }
    breakdown = false
})

document.getElementById('play_again_btn').addEventListener('click', reset)