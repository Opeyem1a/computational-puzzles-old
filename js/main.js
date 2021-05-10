const PAGE_PATH = window.location.pathname;
const FEEDBACK = {
    CORRECT: 'correct',
    ALMOST: 'almost',
    INCORRECT: 'incorrect',
    NONE: 'none'
};
const GIF_DIR = `../assets/feedback-gifs`;

let answerKey = {};
let feedbackGifs = {};
let puzzleNum = 0;

// initial app state before quiz is loaded up
$('.content-section').hide();
$('.header-group').show();
$('#loading-screen').show();

$(function () {
    // retrieve the numeric index for this puzzle from the path name
    puzzleNum = PAGE_PATH.split('/').pop().split('.')[0].slice(6);
    loadAnswerKey();
    loadFeedbackGifs();
    setupEventListeners();
    enableQuiz().then(() => {
        $('.content-section').show();
        $('#loading-screen').hide();
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
    // enable the back to map button's functionality
    $('a.map-link').each((i, el) => {
        $(el).on('click', () => {
            backToMap();
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

const addAlert = (type, message) => {
    const alertElement =
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
          <strong>Hold it!</strong> ${message}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>`;

    $('#puzzle-feedback').append(alertElement);
};

const addFeedbackGif = (gifType) => {
    // gifType is the same as the feedback code given from the checkAnswer method
    const offset = Math.floor(Math.random() * feedbackGifs[gifType]);
    const feedbackContainer = $('#puzzle-feedback');
    feedbackContainer.empty();

    if (gifType === FEEDBACK.NONE) {
        addAlert('warning', 'You haven\'t selected an answer yet!');
        return;
    }

    const feedbackMessage = gifType === FEEDBACK.CORRECT ? 'Nice Work!' : 'That wasn\'t quite right - Try again!';

    const newEmbedGif = `<img id="feedback-gif" class="gif-embed gif-embed-${gifType} my-2"
                        src="${GIF_DIR}/${gifType}/${offset}.gif" alt="${gifType} - Gif"
                        aria-label="You have ${gifType}ly answered this puzzle"/>
                        <p class="h6 my-2">${feedbackMessage}</p>`;

    feedbackContainer.append(newEmbedGif);
};

const loadFeedbackGifs = () => {
    fetch(`${GIF_DIR}/feedback-gifs.json`)
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
    $('#puzzle-question-container').find('button[type="submit"]').on('click', () => {
        const feedbackCode = checkAnswer();
        if (feedbackCode === FEEDBACK.CORRECT) {
            // remove answer options if answered correctly
            $('button[type="submit"]').toggleClass('d-none');
            $('a#success-map-link').toggleClass('d-none').toggleClass('d-inline-flex');
            $('form#puzzle-answer-options').attr('style','display:none !important');
            $('form.puzzle-form').attr('style','display:none !important');
        }
        addFeedbackGif(feedbackCode);
    })
};

const checkAnswer = () => {
    const userAnswer = $('#puzzle-answer-options').find('input:checked').val() || $('#puzzle-answer-text').val();

    if (!userAnswer)
        return FEEDBACK.NONE;
    return userAnswer.toLowerCase() === answerKey[puzzleNum] ? FEEDBACK.CORRECT : FEEDBACK.INCORRECT;
};

const backToMap = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isOnlineMode = urlParams.get('online') === 'true';
    window.location.href = isOnlineMode ? '../online.html' : '../outside.html';
};
