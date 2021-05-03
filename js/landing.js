const PUZZLES_DIR = `./puzzles`;

$(function () {
    const isOnlineMode = determineIfOnline();
    $('#puzzles-drawer').find('.puzzle-display').each((i, el) => {
        $(el).on('click', () => {
            clickHandler(i, el, isOnlineMode);
        })
    });
});

const clickHandler = (i, el, isOnlineMode) => {
    isOnlineMode ? routeToPuzzle(i + 1) : showPuzzleHint(el);
}

const routeToPuzzle = (puzzleNum) => {
    const queryParams = `online=true`;
    window.location.href = `${PUZZLES_DIR}/puzzle${puzzleNum}.html?${queryParams}`;
};

const showPuzzleHint = (el) => {
    $(el)?.toggleClass('selected');

    const descDiv = $(el)?.find('div.puzzle-description');
    descDiv?.find('p')?.toggleClass('d-none');
    descDiv?.find('small.hint-reminder')?.toggleClass('d-none');
    descDiv?.find('small').toggleClass('text-muted');
};

const determineIfOnline = () => {
    const url = window.location.href;
    const mode = url.split('.html')[0].split('/').pop();
    return mode === 'online';
}
