```javascript
/* =========================================
   1. GET HTML ELEMENTS
========================================= */

// Color helper elements

const colorPicker = document.getElementById("colorPicker");

const hexInput = document.getElementById("hexInput");

const doubt = document.getElementById("doubt");

const suggestBtn = document.getElementById("suggestBtn");

const colorResult = document.getElementById("colorResult");


// Painting review elements

const paintingInput =
    document.getElementById("paintingInput");

const chooseImage =
    document.getElementById("chooseImage");

const preview =
    document.getElementById("preview");

const uploadContent =
    document.getElementById("uploadContent");

const submitReview =
    document.getElementById("submitReview");

const formMessage =
    document.getElementById("formMessage");


/* =========================================
   2. COLOR PICKER → HEX INPUT
========================================= */

// Whenever the user changes the colour,
// update the HEX input.

colorPicker.addEventListener("input", function () {

    hexInput.value =
        colorPicker.value.toUpperCase();

});


/* =========================================
   3. HEX INPUT → COLOR PICKER
========================================= */

hexInput.addEventListener("input", function () {

    let value = hexInput.value.trim();


    // If the user doesn't type #,
    // add it automatically.

    if (!value.startsWith("#")) {

        value = "#" + value;

    }


    // Check if the HEX colour is valid.

    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {

        colorPicker.value = value;

    }

});


/* =========================================
   4. HEX → RGB
========================================= */

function hexToRgb(hex) {

    const r =
        parseInt(hex.substring(1, 3), 16);

    const g =
        parseInt(hex.substring(3, 5), 16);

    const b =
        parseInt(hex.substring(5, 7), 16);


    return {
        r: r,
        g: g,
        b: b
    };

}


/* =========================================
   5. RGB → HEX
========================================= */

function rgbToHex(r, g, b) {

    return "#" +

        [r, g, b]

            .map(function (value) {

                // Keep value between 0 and 255

                value =
                    Math.max(
                        0,
                        Math.min(
                            255,
                            Math.round(value)
                        )
                    );


                // Convert number to hexadecimal

                return value
                    .toString(16)
                    .padStart(2, "0");

            })

            .join("")

            .toUpperCase();

}


/* =========================================
   6. FIND COMPLEMENTARY COLOUR
========================================= */

function getContrastColor(hex) {

    const rgb = hexToRgb(hex);


    // Complementary colour:
    //
    // Red     → 255 - Red
    // Green   → 255 - Green
    // Blue    → 255 - Blue

    const oppositeRed =
        255 - rgb.r;

    const oppositeGreen =
        255 - rgb.g;

    const oppositeBlue =
        255 - rgb.b;


    return rgbToHex(
        oppositeRed,
        oppositeGreen,
        oppositeBlue
    );

}


/* =========================================
   7. MIX TWO COLOURS
========================================= */

function mixColors(hex1, hex2, amount) {

    const color1 =
        hexToRgb(hex1);

    const color2 =
        hexToRgb(hex2);


    const r =
        color1.r +
        (color2.r - color1.r) * amount;


    const g =
        color1.g +
        (color2.g - color1.g) * amount;


    const b =
        color1.b +
        (color2.b - color1.b) * amount;


    return rgbToHex(r, g, b);

}


/* =========================================
   8. GENERATE COLOR SUGGESTIONS
========================================= */

function getSuggestions(hex, type) {

    // Complementary colour

    const opposite =
        getContrastColor(hex);


    // Darker version

    const darker =
        mixColors(
            hex,
            "#000000",
            0.25
        );


    // Lighter version

    const lighter =
        mixColors(
            hex,
            "#FFFFFF",
            0.35
        );


    /* -------------------------------------
       BACKGROUND
    ------------------------------------- */

    if (type === "background") {

        return [

            {
                name: "Strong contrast",
                color: opposite
            },

            {
                name: "Soft light",
                color: lighter
            },

            {
                name: "Soft dark",
                color: darker
            }

        ];

    }


    /* -------------------------------------
       SHADOW
    ------------------------------------- */

    if (type === "shadow") {

        return [

            {
                name: "Deep shadow",
                color: darker
            },

            {
                name: "Complementary",
                color: opposite
            },

            {
                name: "Light shadow",
                color: mixColors(
                    hex,
                    "#000000",
                    0.12
                )
            }

        ];

    }


    /* -------------------------------------
       HIGHLIGHT
    ------------------------------------- */

    if (type === "highlight") {

        return [

            {
                name: "Bright highlight",
                color: "#FFFFFF"
            },

            {
                name: "Light version",
                color: lighter
            },

            {
                name: "Warm contrast",
                color: mixColors(
                    opposite,
                    "#FFFFFF",
                    0.25
                )
            }

        ];

    }


    /* -------------------------------------
       OUTLINE
    ------------------------------------- */

    return [

        {
            name: "Complementary",
            color: opposite
        },

        {
            name: "Dark outline",
            color: "#222222"
        },

        {
            name: "Light outline",
            color: "#F5F0E8"
        }

    ];

}


/* =========================================
   9. SUGGEST CONTRAST BUTTON
========================================= */

suggestBtn.addEventListener("click", function () {

    const hex =
        hexInput.value.trim().toUpperCase();


    /* -------------------------------------
       CHECK HEX VALUE
    ------------------------------------- */

    if (!/^#[0-9A-F]{6}$/.test(hex)) {

        colorResult.innerHTML = `

            <div class="result-placeholder">

                <span>⚠️</span>

                <h3>
                    Please enter a valid HEX colour
                </h3>

                <p>
                    Example: #D97757
                </p>

            </div>

        `;

        return;

    }


    /* -------------------------------------
       GET SUGGESTIONS
    ------------------------------------- */

    const suggestions =
        getSuggestions(
            hex,
            doubt.value
        );


    /* -------------------------------------
       DISPLAY RESULTS
    ------------------------------------- */

    colorResult.innerHTML = `

        <div class="result-card">

            <h3>
                Suggested colours for ${hex}
            </h3>


            <div
                class="color-preview"
                style="background: ${hex};"
            ></div>


            <div class="suggestion-row">

                ${suggestions.map(function (item) {

                    return `

                        <div class="swatch">

                            <div
                                class="swatch-color"
                                style="
                                    background: ${item.color};
                                "
                            ></div>


                            <strong>
                                ${item.name}
                            </strong>

                            <br>

                            <small>
                                ${item.color}
                            </small>

                        </div>

                    `;

                }).join("")}

            </div>

        </div>

    `;

});


/* =========================================
   10. OPEN IMAGE SELECTOR
========================================= */

chooseImage.addEventListener("click", function () {

    paintingInput.click();

});


/* =========================================
   11. PREVIEW UPLOADED IMAGE
========================================= */

paintingInput.addEventListener(
    "change",
    function () {

        const file =
            paintingInput.files[0];


        // If no file was selected

        if (!file) {

            return;

        }


        // FileReader lets us read
        // the selected image.

        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                // Put image into preview

                preview.src =
                    event.target.result;


                // Show image

                preview.style.display =
                    "block";


                // Hide upload instructions

                uploadContent.style.display =
                    "none";

            };


        // Read image

        reader.readAsDataURL(file);

    }
);


/* =========================================
   12. REQUEST ARTIST REVIEW
========================================= */

submitReview.addEventListener(
    "click",
    function () {

        const problem =
            document
                .getElementById("problem")
                .value
                .trim();


        /* ---------------------------------
           CHECK IMAGE
        --------------------------------- */

        if (!paintingInput.files[0]) {

            formMessage.textContent =
                "Please upload your painting first.";

            return;

        }


        /* ---------------------------------
           CHECK DESCRIPTION
        --------------------------------- */

        if (!problem) {

            formMessage.textContent =
                "Please describe what you want the artist to check.";

            return;

        }


        /* ---------------------------------
           SUCCESS MESSAGE
        --------------------------------- */

        formMessage.textContent =
            "Review request created! " +
            "In the full app, this would now be " +
            "sent to a professional artist.";

    }
);
```
