$(document).ready(function(){

    var DogName;
    var DogBreed;
    var DogFont;
    var DogImage;
    var DogColor;
    var storagedDogs;
    var dateAndHour

    // Load Storaged Dogs
    loadStorageDogs();

    // Load All Google Fonts and slice first 5 fonts
    loadAllFonts("AIzaSyCaSl95k6AXycPoFLA4Fl87FCy_R0RIkmg");

    // Get all breeds from the Dog API
    getAllBreeds();


    $("#dogname-color").change(() => {
        let color = $("#dogname-color").val();
        changeColor(color);
    });
    
    $("#dogname-input").change(() => {
        let name = $("#dogname-input").val();
        $(".dogs__name-img").text(name);
    });
    
    $("#dogbreed-select").change(() => {
        let selectedDogBreed = $("#dogbreed-select").val();
        getDogImage(selectedDogBreed);
    });

    $("#dogfont-select").change(() =>  {
        applyNewFontSelected(this);
    })

    $("#reset-button").click(() => {
        resetForm();
    })

    $("#save-button").click(() => {
        DogName = $(".dogs-name").val()
        DogBreed = $("#dogbreed-select").val()
        DogFont = $("#font-select").val()
        DogImage = $(".dog__image").attr("src");
        DogColor = $("#dogname-color").val();
        
        if (isValid(DogName, DogBreed, DogFont, DogColor)) {
            saveNewDog(DogName, DogBreed, DogFont, DogImage, DogColor);
        } else {
            $(".form__msg-error").text("Please fill in all fields!").css('color', 'red');
            setTimeout(() => {
                $(".form__msg-error").addClass("form__msg-error--visible");
            }, 100);

            setTimeout(function() {
                $(".form__msg-error").removeClass("form__msg-error--visible")
            }, 3000);
        }
    })
});


/*
 * Functions
 */

/**
 * @function
 * @description check if the form has been filled
 * @param {string} newDogName 
 * @param {string} newDogBreed 
 * @param {string} newDogFont
 * @param {string} newDogColor 
 */

isValid = (newDogName, newDogBreed, newDogFont, newDogColor) => {
    if (newDogName && newDogBreed !== 'default' && newDogFont !== 'default' && newDogColor !== 'default') return true;
    else return false;
}

 /**
 * @function
 * @description Change Color Dog Name on select change
 * @param {string} color 
 */
changeColor = (color) => {
    $(".dogs-name").css("color", color);
    $(".dogs__name-img").css("color", color);
}

/**
 * @external
 * @param {string} apiKey 
 */
loadAllFonts = (apiKey) => {
    $.ajax({
        url: "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=" + apiKey,
        success: (success) => {
            // Populate fonts select input with most popularity fonts
            success.items = success.items.slice(0, 5);
            $.each(success.items, function (fonts, font) {
                let fontItem = '<option value="' + font.files.regular + '">' + font.family + '</option>';
                $("#dogfont-select").append(fontItem);
            });
        }
    });
}

/**
 * @function
 * @description load the stored dogs
 */
loadStorageDogs = () => {
    // Get Dogs from Local Storage and turn data into Objects
    var dogs = JSON.parse(localStorage.getItem("dogs"));

    if (!dogs) {
        $(".dogs__msg-empty").fadeIn();
        return false;
    }

    if (dogs.length && typeof dogs !== 'undefined') {
        $(".dogs__msg-empty").css("display", "none");

        // Remove old dogs to update
        $(".dogs__storage-item[data-index]").fadeIn(300);
        setTimeout(function() {
            $(".dogs__storage-item[data-index]").remove();
        }, 320);

        // Show all dogs in local storage
        setTimeout(function() {    
            $.each(dogs, function (index, dog) {
                storagedDogData = $(".dogs__storage--example").clone();
                storagedDogData.removeClass("dogs__storage--example")
                storagedDogData.attr("data-index", index);
                storagedDogData.css("opacity", "0");
                storagedDogData.find("img").attr("src", dog.image)
                storagedDogData.find("img").attr("dog-breed", dog.breed)
                storagedDogData.find(".dogs__storage-name").text(dog.name)
                storagedDogData.find(".dogs__storage-name").attr("data-color", dog.color)
                storagedDogData.find(".dogs__storage-name").attr("data-font", dog.font)
                
                if (dog.breed.indexOf("-") > -1) {
                    dog.breed = dog.breed.replace("-", ' ');
                }
                storagedDogData.find(".dogs__storage-breed").text(dog.breed);
                storagedDogData.find(".dogs__storage-dateAndHour").text(dog.dateAndHour);
                
                // Show items in fade effect
                $(".dogs__storage").append(storagedDogData);
                setTimeout(function() {
                    $(".dogs__storage-item[data-index='" + index + "']").css("opacity", "1");                
                }, 550 * index);
            })
        }, 350);
    } else {
        $(".dogs__msg-empty").fadeIn();
    }
}

/**
 * @external
 * @description Get all breeds on page load
 */
getAllBreeds = () => {
    $.ajax({
        url: "https://dog.ceo/api/breeds/list/all",
        success: (result) => {
            var breeds = result.message;

            $.each(breeds, (dog, breed) => {
                // Populate Sub Breeds
                if (breeds[dog].length >= 1) {
                    for (i = 0; i < breeds[dog].length; i++) {
                        $("#dogbreed-select").append('<option value="' + dog + '-' + breeds[dog][i] + '">' + breeds[dog][i] + ' ' + dog + '</option>');
                    }
                }

                // Populate Parent Breeds
                else if (breeds[dog].length < 1) {
                    $("#dogbreed-select").append('<option value="' + dog + '">' + dog + '</option>');
                }
            });
        },
        error: (result) => {
            console.log("Error: " + result)
            $("#dogbreed-select").html('<option value="erro">Sorry, we got a problem :(</option>')
        }
    });
}


/**
 * @function
 * @description Get Random breed or sub-breed Dog Image and Update in Form
 * @param {DOM Element} item 
 */
getDogImage = (selectedDogBreed) => {

    if (selectedDogBreed.indexOf('-') > -1) {
        selectedDogBreed = selectedDogBreed.replace('-', '/');
    }
    $(".dog__image").css("opacity", 0);

    $.getJSON("https://dog.ceo/api/breed/" + selectedDogBreed + "/images/random", (result) => {

        // Fade Effect on Image Change
        $(".dog__image").attr("src", result.message);
        $(".dog__image").attr("alt", selectedDogBreed);
        $(".dog__image").animate({ opacity: '0.25' }, 400);
        $(".dog__image").animate({ opacity: '0.5' }, 600);
        $(".dog__image").animate({ opacity: '0.75' }, 800);
        $(".dog__image").animate({ opacity: '1' }, 1000);
    })
    .fail((result) => {
        console.log("Error: " + result)
        $(".dog__image").attr("src", "assets/images/error-dog.png");
    })
}

/**
 * @function
 * @description Change Font Dog Name on select change
 * @param {DOM Element} item 
 */
applyNewFontSelected = (item) => {
    newFontSrc = $(item).find("option:selected").val();
    newFontName = $(item).find("option:selected").text();

    newFont = new FontFace(newFontName, 'url(' + newFontSrc + ')');
    newFont.load().then((fontLoaded) => {
        document.fonts.add(fontLoaded)
    }).catch((error) => {});

    $("#dogname-input").css("font-family", newFontName);
    $(".dogs__name-img").css("font-family", newFontName);
}

/**
 * @function
 * @description Add new dog to Local Storage Object
 * @param {string} newDogName 
 * @param {string} newDogBreed 
 * @param {string} newDogFont 
 * @param {string} newDogImage 
 * @param {string} newDogColor 
 */
saveNewDog = (newDogName, newDogBreed, newDogFont, newDogImage, newDogColor) => {
    storagedDogs = localStorage.getItem("dogs");

    dateAndHour = new Date();
    dateAndHour = dateAndHour.toGMTString();
    dateAndHour = dateAndHour.slice(4, 26);

    newDog = {};
    newDog = {
        name: newDogName,
        breed: newDogBreed,
        font: newDogFont,
        color: newDogColor,
        image: newDogImage,
        dateAndHour: dateAndHour
    }

    !storagedDogs ? storagedDogs = [] : storagedDogs = JSON.parse(storagedDogs);

    storagedDogs.push(newDog);
    localStorage.setItem("dogs", JSON.stringify(storagedDogs))

    $(".form__msg-error").css('color', 'green').text("The dog was successfully saved!");
    setTimeout(() => {
        $(".form__msg-error").addClass("form__msg-error--visible");
    }, 200);

    setTimeout(() => {
        $(".form__msg-error").removeClass("form__msg-error--visible")
    }, 3000);

    $(".dogs__name-img").text('').css('color', 'black');
    // Load dogs on add dog
    loadStorageDogs();
    // Reset Form
    resetForm();
}

/**
 * @function
 * @description Reset Form to add New Dog
 */
resetForm = () => {
    $(".dogs-name").val("").removeAttr("style");
    $("#dogbreed-select").val("default");
    $("#font-select").val("default");
    $("#dogname-color").val("default");
    changeColor("#fffed8");
    $(".form__button").attr("data-update", "true").removeAttr("data-index");
    $(".dog__image").attr("src", "assets/images/dog.png");
}
