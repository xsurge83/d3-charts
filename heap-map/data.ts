
function generateRandom(multiplier:number = 100) {
    return Math.round(Math.random() * multiplier);
}
let DATA = [];
for (let i = 1; i <= 7; i++) {
    for (let j = 1; j <= 24; j++) {
        DATA.push({count: generateRandom(), day: i, hour: j})
    }
}
export default DATA;