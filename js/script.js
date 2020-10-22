function draw() {
    let pathToImages = "assets/images/fruits/";
    let availableImages = [
        "apple", "fig", "grape", "kiwi", "lemon", "lime", "mango", "melon",
        "apple", "fig", "grape", "kiwi", "lemon", "lime", "mango", "melon"
    ];
    let cardSize = {
        width: 140,
        height: 150
    };
    let availableCards = [];
    let checkingTwoCards = [];
    while (availableImages.length > 0) {
        let randomNumber = randomImage(0, availableImages.length - 1);
        let image = new Image();
        image.src = `${pathToImages}${availableImages[randomNumber]}.jpg`;
        image.alt = availableImages[randomNumber];
        availableImages.splice(randomNumber, 1);
        image.addEventListener("load", createCanvas);
    }

    function createCanvas() {
        let image = this;
        let imageCell = document.querySelector(".free-cell");
        let canvas = document.createElement("canvas");
        canvas.classList.add("active");
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");
            canvas.setAttribute("width", cardSize.width);
            canvas.setAttribute("height", cardSize.height);
            imageCell.append(canvas);
            imageCell.append(image);
            imageCell.classList.remove("free-cell");
            canvas.id = `card-${image.getAttribute("alt")}`;
            // Add all images to available cards
            availableCards.push(canvas);
            ctx.fillStyle = '#204f7a';
            ctx.fillRect(0, 0, cardSize.width, cardSize.height);
            canvas.addEventListener("click", checkCard);
        }
    }

    function checkCard() {
        if (checkingTwoCards.length <= 1) {
            let canvasCard = this;
            let imageForCard = canvasCard.nextElementSibling;
            checkingTwoCards.push(canvasCard);
            let ctxCard = canvasCard.getContext("2d");
            ctxCard.drawImage(imageForCard,0,0, cardSize.width, cardSize.height);

            let delayAnimation = setTimeout(() => {
                if (checkingTwoCards.length > 1) {
                    if (checkingTwoCards[0].id === checkingTwoCards[1].id) {
                        console.log("matched");
                        checkingTwoCards.forEach((correctCard) => {
                            correctCard.removeEventListener("click", checkCard);
                            correctCard.classList.remove("active");
                            availableCards.splice(availableCards.indexOf(correctCard), 1)
                        });
                        checkingTwoCards = [];
                        console.log("availableCards after del", availableCards);
                        if (availableCards.length === 0) {
                            let playAgain = confirm("You Win! Play again?");
                            if (playAgain) {
                                document.location.reload();
                            }
                        }
                    } else {
                        console.log("doesn't match");
                        checkingTwoCards.forEach((wrongCard) => {
                            let ctxWrongCard = wrongCard.getContext("2d");
                            ctxWrongCard.fillRect(0, 0, cardSize.width, cardSize.height);
                        });
                        checkingTwoCards = [];
                    }
                }
                clearTimeout(delayAnimation);
            }, 1500);
        }

    }


    function randomImage(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
