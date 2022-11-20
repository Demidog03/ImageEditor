const container = document.querySelector(".container")
const fileInput = document.querySelector(".file-input")
const chooseImgBtn = document.querySelector(".choose-img")
const previewImg = document.querySelector(".preview-img img")
const filterOptions = document.querySelectorAll(".filter button")
const rotateOptions = document.querySelectorAll(".rotate button")
const filterName = document.querySelector(".filter-info .name")
const filterValue = document.querySelector(".filter-info .value")
const filterSlider = document.querySelector(".slider input")
const resetFilterBtn = document.querySelector(".reset-filter")
const saveImgBtn = document.querySelector(".save-img")

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0
let rotate = 0, flipHorizontal = 1,flipVertical = 1

const applyFilters = () => {
    //scale(-1, 1) flips horizontally, scale(1, -1) flips vertically
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`

}

const loadImage = () => {
    let file = fileInput.files[0] //getting user selected file
    if(!file) return
    previewImg.src = URL.createObjectURL(file) //creating url of passed file and passing this URL
    previewImg.addEventListener('load', () => {
        resetFilterBtn.click() //clicking reset button so the filters are reset if user selects new image
        container.classList.remove('disable')
    })
}

//updating filter value text to value of slider
const updateFilter = () => {
    filterValue.innerHTML = filterSlider.value + '%'
    const selectedFilter = document.querySelector(".filter .active")
    if(selectedFilter.id === 'brightness'){
        brightness = filterSlider.value
    }
    else if(selectedFilter.id === 'saturation'){
        saturation = filterSlider.value
    }
    else if(selectedFilter.id === 'inversion'){
        inversion = filterSlider.value
    }
    else{
        grayscale = filterSlider.value
    }

    applyFilters()
}

filterOptions.forEach(option => {
    option.addEventListener('click', () => { //adding click event listener to all option buttons
        document.querySelector('.filter .active').classList.remove('active')
        option.classList.add('active')
        filterName.innerHTML=option.innerHTML

        //saving selected slider value for every option and saving the changes in filter value
        //also at the beginning default values are assigned
        if(option.id === 'brightness'){
            filterSlider.value = brightness
            filterValue.innerHTML = `${brightness}%`
        }
        else if(option.id === 'saturation'){
            filterSlider.value = saturation
            filterValue.innerHTML = `${saturation}%`
        }
        else if(option.id === 'inversion'){
            filterSlider.value = inversion
            filterValue.innerHTML = `${inversion}%`
        }
        else{
            filterSlider.value = grayscale
            filterValue.innerHTML = `${grayscale}%`
        }
    })
})

//adding click event listener for each rotate button
rotateOptions.forEach(option => {
    option.addEventListener('click', () => {
        if(option.id === 'left'){
            rotate -= 90
        }
        else if(option.id === 'right'){
            rotate += 90
        }
        else if(option.id === 'horizontal'){
            // if flipHorizontal value is 1 set to -1 else set to 1 again
            flipHorizontal = flipHorizontal === 1 ? -1 : 1
        }
        else if(option.id === 'vertical'){
            // if flipHorizontal value is 1 set to -1 else set to 1 again
            flipVertical = flipVertical === 1 ? -1 : 1
        }
        applyFilters()
    })
})

const resetFilter = () => {
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0
    rotate = 0, flipHorizontal = 1,flipVertical = 1
    filterOptions[0].click() //clicking brightness button, so brightness is selected as default
    applyFilters()
}

const saveImage = () => {
    const canvas = document.createElement("canvas")  //creating canvas element
    const ctx = canvas.getContext("2d") //canvas.getContent returns a drawing context on the canvas
    canvas.width = previewImg.naturalWidth //setting canvas` width as a width of image
    canvas.height = previewImg.naturalHeight //setting canvas` height as a height of image
    //applying user selected filters to canvas
    ctx.translate(canvas.width / 2, canvas.height / 2)
    if(rotate !== 0){ //if rotate isnt 0 rotate the canvas
        ctx.rotate(rotate * Math.PI / 180)
        //added extra scale function to scale image because rotated image is not fully located in canvas
        ctx.scale(0.5, 0.5)
    }
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
    ctx.scale(flipHorizontal, flipVertical)
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2 , canvas.width, canvas.height)  //drawImage() provides different ways to draw an image onto the canvas
    // document.body.appendChild(canvas)

    const link = document.createElement('a')
    link.download = 'image.jpg'
    link.href = canvas.toDataURL()
    link.click()
}

chooseImgBtn.addEventListener("click", () => fileInput.click())
fileInput.addEventListener('change', loadImage)
filterSlider.addEventListener('input', updateFilter)
resetFilterBtn.addEventListener('click', resetFilter)
saveImgBtn.addEventListener('click', saveImage)
