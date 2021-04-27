let feedbackGifs = {};


$(function () {
    loadFeedbackGifs();
});


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
    if ($("#form-grade").length == 0) {
        $("#review-form")
            .find("hr").eq(1)
            .before(
                $("<p></p>").attr({
                    id: "form-grade",
                    class: "",
                })
            );
    }

    if (grade[0] == grade[1]) {
        $("#goto-next-section").show();
    }

    logTimingQuiz(grade);

    $("#form-grade").text(`Score: ${grade[0]}/${grade[1]}`);
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
