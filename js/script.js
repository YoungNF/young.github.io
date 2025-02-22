// script.js

function handleWindowResize() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        // const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        const isSmall = carousel.classList.contains('carousel-small');
        // const gap = isSmall ? 50 : 50; //? 90 : 50;

        // Get the currently active slide
        const currentSlide = track.querySelector('.current'); // Default to first slide if none is active
        const targetSlide = currentSlide; // Resize should keep the current slide in the center
        console.log('Current Slide:', currentSlide);

        // Dynamically update carousel state
        moveSlideAndIndicator(carousel, track, slides, currentSlide, targetSlide);
    });
}

function initializeIndicators(slides, indicatorsContainer) {
    slides.forEach((_, index) => {
        // Create and append indicator for each slide
        const dot = document.createElement('button');
        dot.classList.add('carousel-indicator');
        // Mark the first indicator as current
        if (index === 0) dot.classList.add('current'); 
        indicatorsContainer.appendChild(dot);
        dot.addEventListener('click', (event) => handleIndicatorClick(event, slides, indicatorsContainer));
    });
    console.log("this is initializing stage", slides.length)
}

// function setupSlidePosition(track, slides, gap) {
//     // Position slides horizontally
//     slides.forEach((slide, index) => {
//         slide.style.left = `${(slide.getBoundingClientRect().width + gap) * index}px`;
//         console.log(`Slide ${index} Left Position: ${slide.style.left}`);
//     });
    
//     // Center the first slide
//     const currentSlide = track.querySelector('.current');
//     console.log('Current Slide:', currentSlide);

//     return currentSlide;
// }

function moveSlideAndIndicator(carousel, track, slides, currentSlide, targetSlide) {
    // Return if the target slide is the same as the current slide
    // if (currentSlide === targetSlide) return;

    const targetIndex = slides.indexOf(targetSlide);

    // Ensure the target slide exists
    if (targetIndex === -1) return;

    // Calculate the left position of the target slide
    const targetLeft = parseFloat(targetSlide.style.left);
    const windowWidth = window.innerWidth;
    const slideWidth = targetSlide.offsetWidth;

    // Adjust to center the target slide
    const offset = (windowWidth - slideWidth) / 2;
    const adjustedLeft = -(Math.round(targetLeft - offset));
    // Move the track to the target slide
    track.style.transform = `translateX(${adjustedLeft}px)`;

    // Update the active slide
    updateSlides(currentSlide, targetSlide);

    // Update indicators (if applicable)
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');
    console.log('What track?', track);
    console.log('What target?', targetIndex);
    console.log('Indicators Container:', indicatorsContainer, "we are going to update the indicators");
    if (indicatorsContainer) { 
        console.log('Target Index:', targetIndex);
        const currentIndicator = indicatorsContainer.querySelector('.current');
        const targetIndicator = indicatorsContainer.children[targetIndex];
        console.log('Indicators Container Checked:', currentIndicator, targetIndicator);
        updateIndicators(currentIndicator, targetIndicator);
    }

    console.log("moveSlideAndIndicator Done");
}



function initializeCarousel(track, slides, navContainer, indicatorsContainer, nextButton, prevButton, gap, slideThreshold) {
    // Position slides
    slides.forEach((slide, index) => {
        slide.style.left = `${(slide.getBoundingClientRect().width + gap) * index}px`;
        // console.log(`Slide ${index} Left Position: ${slide.style.left}`);
        if (index === 0) {
            slide.classList.add('current'); // Mark the first indicator as current
        }
    });
    
    // Initialize event listeners for arrows
    if (slides.length > slideThreshold) {
        nextButton.style.display = 'block';
        prevButton.style.display = 'block';
        indicatorsContainer.style.display = 'block';
        nextButton.addEventListener('click', (event) => handleArrowClick(event, slides, 'next'));
        prevButton.addEventListener('click', (event) => handleArrowClick(event, slides, 'prev'));
        nextButton.dataset.listenerAdded = true; // Mark that event listeners have been added
        prevButton.dataset.listenerAdded = true;
        // console.log('Initialization Nav Activated');

        // Position indicators
        initializeIndicators(slides, indicatorsContainer);
        console.log('Nav Activated');
    } else {
        if (navContainer) navContainer.remove();
        console.log(navContainer);
        console.log('Nav Deactivated');
    }
    // console.log('Initialization Survived?');
}

// function manageCarousel(carousel, track, slides, indicatorsContainer, gap){
//     console.log('track:', track);
//     console.log('slides:', slides);
//     console.log('indicatorsContainer:', indicatorsContainer);
//     console.log('gap:', gap);

//     // Position slides
//     // const currentSlide = setupSlidePosition(track, slides, gap);
//     // console.log('setupSlidePosition Done');

//     // Position indicators
//     // setupIndicatorPosition(track, slides, indicatorsContainer);
//     // console.log('setupIndicatorPosition Done');

//     moveSlideAndIndicator(carousel, track, slides, currentSlide, currentSlide);
//     console.log('Event Listeners Added');
// };

function updateSlides(currentSlide, targetSlide) {
    if (currentSlide) currentSlide.classList.remove('current');
    if (targetSlide) targetSlide.classList.add('current');
}

function updateIndicators(currentIndicator, targetIndicator) {
    if (currentIndicator) currentIndicator.classList.remove('current');
    if (targetIndicator) targetIndicator.classList.add('current');
}

function toggleArrows(slides, prevButton, nextButton, targetIndex) {
    if (targetIndex === 0) {
        prevButton.style.opacity = '0.5';
        prevButton.style.pointerEvents = 'none'; // Disable click
    } else {
        prevButton.style.opacity = '1';
        prevButton.style.pointerEvents = 'auto'; // Enable click
    }

    if (targetIndex === slides.length - 1) {
        nextButton.style.opacity = '0.5';
        nextButton.style.pointerEvents = 'none'; // Disable click
    } else {
        nextButton.style.opacity = '1';
        nextButton.style.pointerEvents = 'auto'; // Enable click
    }
}

// Handle arrow clicks
function handleArrowClick(event, slides, direction) {
    const button = event.currentTarget; // Get the clicked button
    const carousel = button.closest('.carousel'); // Find the nearest carousel
    const track = carousel.querySelector('.carousel-track'); // Get its track
        
    const currentSlide = track.querySelector('.current');
    const currentIndex = slides.indexOf(currentSlide);
    console.log('Current Index:', currentIndex);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    // Ensure the target index is within bounds
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    console.log('Target Index:', targetIndex);
    const targetSlide = slides[targetIndex];
    moveSlideAndIndicator(carousel, track, slides, currentSlide, targetSlide);
    // updateSlides(slides, currentIndex, targetIndex);
    // updateIndicators(track, currentIndex, targetIndex);

    // Update arrows (optional: disable/hide if at start/end)
    // const carousel = track.closest('.carousel');
    const nextButton = carousel.querySelector('.carousel-arrow.right');
    const prevButton = carousel.querySelector('.carousel-arrow.left');
    toggleArrows(slides, prevButton, nextButton, targetIndex);
}

function handleIndicatorClick(event, slides, indicatorsContainer) {
    const button = event.currentTarget; // Get the clicked button
    const carousel = button.closest('.carousel'); // Find the nearest carousel
    const track = carousel.querySelector('.carousel-track'); // Get its track
    const targetIndicator = button.closest('.carousel-indicator');
    if (!targetIndicator) return; // Ignore clicks outside indicators

    const currentSlide = track.querySelector('.current');
    const currentIndex = slides.indexOf(currentSlide);

    // Determine the index of the clicked indicator
    const targetIndex = Array.from(indicatorsContainer.children).indexOf(targetIndicator);
    const targetSlide = slides[targetIndex];

    // Move to the target slide
    moveSlideAndIndicator(carousel, track, slides, currentSlide, targetSlide); //<-- REMOVE THIS
    // updateSlides(slides, currentIndex, targetIndex);
    // updateIndicators(track, currentIndex, targetIndex);

    // Update arrows (optional)
    const nextButton = carousel.querySelector('.carousel-arrow.right');
    const prevButton = carousel.querySelector('.carousel-arrow.left');
    toggleArrows(slides, prevButton, nextButton, targetIndex);
}


// Call the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const navContainer = carousel.querySelector('.carousel-nav');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        const isSmall = carousel.classList.contains('carousel-small');
        const gap = isSmall ? 50 : 50; // ? 90 : 50;
        const slideThreshold = isSmall ? 2 : 1;

        const nextButton = carousel.querySelector('.carousel-arrow.right');
        const prevButton = carousel.querySelector('.carousel-arrow.left');

        // const updateOffset = () => {
        //     const currentSlide = track.querySelector('.current');
        //     const slideWidth = currentSlide.getBoundingClientRect().width;
        //     const slideLeft = currentSlide.offsetLeft;
        //     const carouselWidth = carousel.getBoundingClientRect().width;

        //     const offset = slideLeft - (carouselWidth - slideWidth) / 2;
        //     track.style.setProperty('--carousel-offset', offset);
        // };

        // // Update offset on load and resize
        // updateOffset();
        // window.addEventListener('resize', updateOffset);

        // Initialize the carousel
        initializeCarousel(track, slides, navContainer, indicatorsContainer, nextButton, prevButton, gap, slideThreshold);
        console.log('Initialized Track', carousel);
    });
    handleWindowResize();
    console.log('Initialized Carousels');
});

window.addEventListener('resize', handleWindowResize);

// document.addEventListener('DOMContentLoaded', () => {
//       // Select elements to fade in
//       const fadeInElements = document.querySelectorAll('.fade-in');

//       // Add the 'visible' class to each element
//       fadeInElements.forEach(element => {
//           element.classList.add('visible');
//       });
// });