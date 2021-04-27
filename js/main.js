let feedbackGifs = {};

$(function () {
    loadFeedbackGifs();
    setupEventListeners();
    restyleOptions();
});

// Setup Functions

const setupEventListeners = () => {
    // divs for options are recoloured when a different option is selected
    $('#puzzle-answer-options').find('input').each((i, el) => {
        $(el).on('change', () => {
            console.log('triggered');
            restyleOptions();
        })
    });
    // clicking the bounding div will select the input box within it
    $('div.answer-option').each((i, el) => {
        $(el).on('click', () => {
            const innerInputEl = $(el).find('input');
            innerInputEl.prop('checked', !innerInputEl.is(':checked'));
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
                        src="../assets/feedbackGifs/${gifType}/${offset}.gif" alt="${gifType} Gif"/>`;
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
        .then((json) => {
            feedbackGifs = json;
        });
};

const enableQuiz = async () => {
    // return so the promise can be chained
    // TODO: scramble answers
    // TODO: attach all event listeners
};

const displayGrade = (grade) => {
    // TODO: check if selected is correct
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
