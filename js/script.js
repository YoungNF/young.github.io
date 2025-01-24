// script.js

function handleWindowResize() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        const isSmall = carousel.classList.contains('carousel-small');
        const gap = isSmall ? 90 : 50;

        // Dynamically update carousel state
        manageCarousel(track, slides, indicatorsContainer, gap);
    });
}

function initializeIndicators(track, slides, indicatorsContainer) {
    slides.forEach((_, index) => {
        // Create and append indicator for each slide
        const dot = document.createElement('dot');
        dot.classList.add('carousel-indicator');
        // Mark the first indicator as current
        if (index === 0) dot.classList.add('current'); 
        indicatorsContainer.appendChild(dot);
        dot.addEventListener('click', (e) => handleIndicatorClick(track, slides, indicatorsContainer, e));
    });
}

function setupSlidePosition(track, slides, gap) {
    // Position slides horizontally
    slides.forEach((slide, index) => {
        slide.style.left = `${(slide.getBoundingClientRect().width + gap) * index}px`;
        console.log(`Slide ${index} Left Position: ${slide.style.left}`);
    });

    // Center the first slide
    const currentSlide = track.querySelector('.current');
    console.log('Current Slide:', currentSlide);

    return currentSlide;
}
// function setupIndicatorPosition(track, slides, indicatorsContainer) {
//     slides.forEach((_, index) => {
//         const indicators = Array.from(indicatorsContainer.children);
//         indicators.forEach((dot, index) => {
//             if (index === currentIndex) {
//                 dot.classList.add('current');
//             } else {
//                 dot.classList.remove('current');
//             }
//         });

//     });
// }

function moveSlideAndIndicator(track, slides, currentSlide, targetSlide) {
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
    const indicatorsContainer = track.closest('.carousel').querySelector('.carousel-indicators');
    if (indicatorsContainer) {
        
        console.log('Target Index:', targetIndex);
        const currentIndicator = indicatorsContainer.querySelector('.current');
        const targetIndicator = indicatorsContainer.children[targetIndex];
        console.log('Indicators Container Checked:', currentIndicator, targetIndicator);
        updateIndicators(currentIndicator, targetIndicator);
    }

    console.log("moveSlideAndIndicator Done");
}





// // Update slides
// const updateSlides = (currentSlide, targetSlide) => {
//     currentSlide.classList.remove('current');
//     targetSlide.classList.add('current');
// };

function updateSlides(currentSlide, targetSlide) {
    if (currentSlide) currentSlide.classList.remove('current');
    if (targetSlide) targetSlide.classList.add('current');
}

// // Update indicators
// const updateIndicators = (currentIndicator, targetIndicator) => {
//     currentIndicator.classList.remove('current');
//     targetIndicator.classList.add('current');
// };

function updateIndicators(currentIndicator, targetIndicator) {
    if (currentIndicator) currentIndicator.classList.remove('current');
    if (targetIndicator) targetIndicator.classList.add('current');
}

// // Handle the display of the arrows
// const toggleArrows = (slides, prevButton, nextButton, targetIndex) => {
//     if (targetIndex === 0) {
//         prevButton.style.opacity = '0.5';
//         prevButton.style.pointerEvents = 'none'; // Disable click
//     } else {
//         prevButton.style.opacity = '1';
//         prevButton.style.pointerEvents = 'auto'; // Enable click
//     }

//     if (targetIndex === slides.length - 1) {
//         nextButton.style.opacity = '0.5';
//         nextButton.style.pointerEvents = 'none'; // Disable click
//     } else {
//         nextButton.style.opacity = '1';
//         nextButton.style.pointerEvents = 'auto'; // Enable click
//     }
// };

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
function handleArrowClick(track, slides, direction) {
    const currentSlide = track.querySelector('.current');
    const currentIndex = slides.indexOf(currentSlide);
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    // Ensure the target index is within bounds
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const targetSlide = slides[targetIndex];
    moveSlideAndIndicator(track, slides, currentSlide, targetSlide);

    // Update arrows (optional: disable/hide if at start/end)
    const carousel = track.closest('.carousel');
    const nextButton = carousel.querySelector('.carousel-arrow.right');
    const prevButton = carousel.querySelector('.carousel-arrow.left');
    toggleArrows(slides, prevButton, nextButton, targetIndex);
}

function handleIndicatorClick(track, slides, indicatorsContainer, event) {
    const targetIndicator = event.target.closest('.carousel-indicator');
    if (!targetIndicator) return; // Ignore clicks outside indicators

    const currentSlide = track.querySelector('.current');

    // Determine the index of the clicked indicator
    const targetIndex = Array.from(indicatorsContainer.children).indexOf(targetIndicator);
    const targetSlide = slides[targetIndex];

    // Move to the target slide
    moveSlideAndIndicator(track, slides, currentSlide, targetSlide);

    // Update arrows (optional)
    const carousel = track.closest('.carousel');
    const nextButton = carousel.querySelector('.carousel-arrow.right');
    const prevButton = carousel.querySelector('.carousel-arrow.left');
    toggleArrows(slides, prevButton, nextButton, targetIndex);
}

// // Click right
// nextButton.addEventListener('click', () => {
//     const currentSlide = track.querySelector('.current');
//     const nextSlide = currentSlide.nextElementSibling;

//     if (!nextSlide) return; // Exit if there's no next slide

//     const nextIndex = slides.findIndex(slide => slide === nextSlide);
//     console.log('Next Slide:',nextSlide);
//     moveToSlide(track, currentSlide, nextSlide);
//     toggleArrows(slides, prevButton, nextButton, nextIndex);
//     console.log('Current Slide:', currentSlide);
// });
// // nextButton.addEventListener('click', () => handleArrowClick(track, slides, 'next'));

// // Click left
// prevButton.addEventListener('click', () => {
//     const currentSlide = track.querySelector('.current');
//     const prevSlide = currentSlide.previousElementSibling;

//     if (!prevSlide) return; // Exit if there's no previous slide

//     const prevIndex = slides.findIndex(slide => slide === prevSlide);
//     console.log('Prev Slide:',prevSlide);
//     moveToSlide(track, currentSlide, prevSlide);
//     toggleArrows(slides, prevButton, nextButton, prevIndex);
//     console.log('Current Slide:', currentSlide);
// });
// // prevButton.addEventListener('click', () => handleArrowClick(track, slides, 'prev'));

// Click indicators
// indicatorsContainer.addEventListener('click', (event) => {
//     const targetIndicator = event.target.closest('.carousel-indicator');

//     if (!targetIndicator) return; // Ignore clicks outside indicators

//     const currentSlide = track.querySelector('.current');
//     const targetIndex = Array.from(indicatorsContainer.children).indexOf(targetIndicator);
//     const targetSlide = slides[targetIndex];

//     moveToSlide(track, currentSlide, targetSlide);
//     toggleArrows(slides, prevButton, nextButton, targetIndex);
//     console.log('Target Slide:', targetSlide);
// });
// indicatorsContainer.addEventListener('click', (event) => {
//     const targetIndicator = event.target.closest('.carousel-indicator');
//     if (!targetIndicator) return; // Ignore clicks outside indicators

//     const targetIndex = Array.from(indicatorsContainer.children).indexOf(targetIndicator);
//     handleIndicatorClick(track, slides, indicatorsContainer, targetIndex);
// });

function initializeCarousel(track, slides, indicatorsContainer, gap, slideThreshold) {
    // Position slides
    slides.forEach((slide, index) => {
        slide.style.left = `${(slide.getBoundingClientRect().width + gap) * index}px`;
    });

    // Initialize event listeners for arrows
    if (slides.length > slideThreshold) {
        nextButton.style.display = 'block';
        prevButton.style.display = 'block';
        indicatorsContainer.style.display = 'block';
        nextButton.addEventListener('click', () => handleArrowClick(track, slides, currentSlide, 'next'));
        prevButton.addEventListener('click', () => handleArrowClick(track, slides, currentSlide, 'prev'));
    } else {
        nextButton.style.display = 'none';
        prevButton.style.display = 'none';
        indicatorsContainer.style.display = 'none';
    }

    // Position indicators
    initializeIndicators(track, slides, indicatorsContainer);

    console.log('Initialization Survived?');
}


function manageCarousel(track, slides, indicatorsContainer, gap){
    console.log('track:', track);
    console.log('slides:', slides);
    console.log('indicatorsContainer:', indicatorsContainer);
    console.log('config:', config);
    console.log('gap:', gap);


    // Position slides
    const currentSlide = setupSlidePosition(track, slides, gap);
    console.log('setupSlidePosition Done');

    // Position indicators
    // setupIndicatorPosition(track, slides, indicatorsContainer);
    // console.log('setupIndicatorPosition Done');

    moveSlideAndIndicator(track, slides, currentSlide, currentSlide);
    console.log('Event Listeners Added');
};

// Call the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        const isSmall = carousel.classList.contains('carousel-small');
        const gap = isSmall ? 90 : 50;
        const slideThreshold = isSmall ? 2 : 1;

        // Initialize the carousel
        initializeCarousel(track, slides, indicatorsContainer, gap, slideThreshold);
    });

    // Trigger a manual resize to ensure carousels are correctly managed on load
    handleWindowResize();
});

window.addEventListener('resize', handleWindowResize);







document.addEventListener('DOMContentLoaded', () => {
      // Select elements to fade in
      const fadeInElements = document.querySelectorAll('.fade-in');

      // Add the 'visible' class to each element
      fadeInElements.forEach(element => {
          element.classList.add('visible');
      });
});