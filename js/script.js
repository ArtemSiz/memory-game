function draw() {
    let pathToImages = "assets/images/fruits/";
    let availableImages = [
        "apple", "fig", "grape", "kiwi", "lemon", "lime", "mango", "melon",
        "apple", "fig", "grape", "kiwi", "lemon", "lime", "mango", "melon"
    ];
    let coordsForCard = {
        x: 0,
        y: 0,
        width: 140,
        height: 150
    };
    let savedCardSize = {
        width: 140,
        height: 150
    };
    let cardColor = "#204f7a";
    let availableCards = [];
    let checkingTwoCards = [];
    // properties for animation
    let ctxSelectedCard;
    let imgSelectedCard;
    let requestAnimation;
    let increaseAnimation = false;

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
            canvas.setAttribute("width", savedCardSize.width);
            canvas.setAttribute("height", savedCardSize.height);
            imageCell.append(canvas);
            imageCell.append(image);
            imageCell.classList.remove("free-cell");
            canvas.id = `card-${image.getAttribute("alt")}`;
            // Add all images to available cards
            availableCards.push(canvas);
            ctx.fillStyle = cardColor;
            ctx.fillRect(coordsForCard.x, coordsForCard.y, savedCardSize.width, savedCardSize.height);
            canvas.addEventListener("click", checkCard);
        }
    }

    function checkCard() {
        if (checkingTwoCards.length <= 1) {
            let canvasCard = this;
            imgSelectedCard = canvasCard.nextElementSibling;
            ctxSelectedCard = canvasCard.getContext("2d");
            window.requestAnimationFrame(runAnimation);
            checkingTwoCards.push(canvasCard);
            let delayShowingCards = setTimeout(() => {
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
                            let playAgain = confirm("You won! Play again?");
                            if (playAgain) {
                                document.location.reload();
                            }
                        }
                    } else {
                        console.log("doesn't match");
                        checkingTwoCards.forEach((wrongCard) => {
                            let ctxWrongCard = wrongCard.getContext("2d");
                            ctxWrongCard.fillRect(coordsForCard.x, coordsForCard.y, savedCardSize.width, savedCardSize.height);
                        });
                        checkingTwoCards = [];
                    }
                }
                clearTimeout(delayShowingCards);
            }, 1500);
        }

    }

    function runAnimation() {
        requestAnimation = window.requestAnimationFrame(runAnimation);
        if (coordsForCard.width > 1 && !increaseAnimation) {
            ctxSelectedCard.clearRect(coordsForCard.x, coordsForCard.y, coordsForCard.width, coordsForCard.height);
            coordsForCard.width -= 28;
            ctxSelectedCard.fillRect(coordsForCard.x, coordsForCard.y, coordsForCard.width, coordsForCard.height);
        } else if (coordsForCard.width < savedCardSize.width) {
            increaseAnimation = true;
            ctxSelectedCard.clearRect(coordsForCard.x, coordsForCard.y, coordsForCard.width, coordsForCard.height);
            coordsForCard.width += 28;
            ctxSelectedCard.drawImage(imgSelectedCard, coordsForCard.x, coordsForCard.y, coordsForCard.width, coordsForCard.height);
        } else if (coordsForCard.width === savedCardSize.width) {
            cancelAnimationFrame(requestAnimation);
            increaseAnimation = false;
        }

    }


    function randomImage(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
