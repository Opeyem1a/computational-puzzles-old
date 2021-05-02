const PUZZLES_DIR = `./puzzles`;

$(function () {
    $('#puzzles-drawer').children().each((i, el) => {
        $(el).on('click', () => {
            // routeToPuzzle(i + 1);
            console.log(el);
            showPuzzleHint(el);
        })
    });
});


const routeToPuzzle = (puzzleNum) => {
    window.location.href = `${PUZZLES_DIR}/puzzle${puzzleNum}.html`;
};

const showPuzzleHint = (el) => {
    $(el)?.toggleClass('selected');

    const descDiv = $(el)?.find('div.puzzle-description');
    descDiv?.find('p')?.toggleClass('d-none');
    descDiv?.find('small.hint-reminder')?.toggleClass('d-none');
    descDiv?.find('small').toggleClass('text-muted');
};
