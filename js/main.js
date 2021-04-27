const PAGE_PATH = window.location.pathname;
const FEEDBACK = {
    CORRECT: 'ans',
    ALMOST: 'alm',
    INCORRECT: 'd',
    NONE: 'none'
}

let answerKey = {};
let feedbackGifs = {};
let puzzleNum = 0;

$(function () {
    // retrieve the numeric index for this puzzle from the path name
    puzzleNum = PAGE_PATH.split('/').pop().split('.')[0].slice(6);
    loadAnswerKey();
    loadFeedbackGifs();
    setupEventListeners();
    enableQuiz().then(() => {
        //TODO: page shows up
    });
    restyleOptions();
});

// Setup Functions

const setupEventListeners = () => {
    // divs for options are recoloured when a different option is selected
    $('#puzzle-answer-options').find('input').each((i, el) => {
        $(el).on('change', () => {
            restyleOptions();
        })
    });
    // clicking the bounding div will select the input box within it
    $('div.answer-option').each((i, el) => {
        $(el).on('click', () => {
            $(el).find('input').prop('checked', true);
            restyleOptions();
        })
    });
}

// Logic Functions

const restyleOptions = () => {
    $('#puzzle-answer-options').find('input').each((i, el) => {
        const parentDiv = $(el).parent();
        if ($(el).is(':checked')) {
            parentDiv.addClass('selected');
        } else {
            parentDiv.removeClass('selected');
        }
    });
};

const addFeedbackGifs = () => {
    $("input:checked").each(function () {
        const gifType = $(this).attr("id").startsWith("ans")
            ? "correct"
            : $(this).attr("id").startsWith("alm")
                ? "almost"
                : "wrong";

        const offset = Math.floor(Math.random() * feedbackGifs[gifType]);
        // attach gif after the question-wrapper div element
        attachOrEditGif($(this).parent().parent(), gifType, offset);
    });
};

const attachOrEditGif = (jqElement, gifType, offset) => {
    const gifClass = jqElement.attr("id");
    const newEmbedGif = `<img id="giphy-embed-${gifClass}" class="giphy-embed giphy-embed-${gifType}"
                        src="../assets/feedback-gifs/${gifType}/${offset}.gif" alt="${gifType} Gif"/>`;
    const oldEmbedGif = $(`#giphy-embed-${gifClass}`);

    if (oldEmbedGif.length === 0) {
        jqElement.after(newEmbedGif);
        return;
    }

    oldEmbedGif.attr({
        src: `../assets/feedbackGifs/${gifType}/${offset}.gif`,
        class: `giphy-embed giphy-embed-${gifType}`
    });
};

const loadFeedbackGifs = () => {
    fetch(`../assets/feedback-gifs/feedback-gifs.json`)
        .then((response) => response.json())
        .then((json) => feedbackGifs = json)
        .catch(e => console.error(e));
};

const loadAnswerKey = () => {
    fetch(`../assets/answer-key.json`)
        .then((response) => response.json())
        .then((json) => answerKey = json)
        .catch(e => console.error(e));
};

const enableQuiz = async () => {
    // TODO: scramble answers
    $('#puzzle-question-container').find('button[type="submit"]').on('click', () => {
        const feedbackCode = checkAnswer();
        // TODO: add feedback gifs
        // addFeedbackGifs();
    })
};

const checkAnswer = () => {
    const selectedVal = $('#puzzle-answer-options').find('input:checked').val();
    if (!selectedVal)
        return FEEDBACK.NONE;
    return selectedVal === answerKey[puzzleNum] ? FEEDBACK.CORRECT : FEEDBACK.INCORRECT;
};

// Helper Functions

const getOptionType = (option) => {
    let key = Object.keys(option)[0];
    if (key === 'answer') return 'ans';
    else return option[key].slice(0, 1) === '~' ? 'alm' : 'd';
};

const trimIfDefined = (target) => {
    return target ? target.trim() : target;
};
