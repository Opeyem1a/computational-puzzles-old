const PUZZLES_DIR = `./puzzles`;

$(function () {
    $('#puzzles-drawer').children().each((i, el) => {
        $(el).on('click', () => {
            routeToPuzzle(i + 1);
        })
    });
});


const routeToPuzzle = (puzzleNum) => {
    window.location.href = `${PUZZLES_DIR}/puzzle${puzzleNum}.html`;
};
