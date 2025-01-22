// Select carousel elements
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel-arrow.right');
const prevButton = document.querySelector('.carousel-arrow.left');
const indicatorsContainer = document.querySelector('.carousel-indicators');

// Get the gap value between slides
const trackStyles = window.getComputedStyle(track);
const gapValue = trackStyles.getPropertyValue('gap');
const gap = parseFloat(gapValue);

// Calculate slide width dynamically (include margin)
// 70px total margin (35px per side)
const slideWidth = slides[0].getBoundingClientRect().width; 



// Arrange slides next to each other
slides.forEach((slide, index) => {
    // Position slides horizontally
    slide.style.left = `${(slideWidth+gap) * index}px`;
    console.log(`slideWidth: ${slideWidth}`);
    console.log(`Slide ${index} Left Position: ${slide.style.left}`);

    // Create and append indicator for each slide
    const dot = document.createElement('dot');
    dot.classList.add('carousel-indicator');
    if (index === 0) {
        dot.classList.add('current'); // Mark the first indicator as current
    }
    indicatorsContainer.appendChild(dot);

});

document.querySelectorAll('.carousel').forEach((carousel) => {
    const isSmall = carousel.classList.contains('carousel-small');
    const gap = isSmall ? 90 : 50; // Adjust gap based on type
    const slideWidth = isSmall ? 640 : 1300;

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.carousel-arrow.right');
    const prevButton = carousel.querySelector('.carousel-arrow.left');
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');


    initializeCarousel(track, slides, nextButton, prevButton, indicatorsContainer, { gap, slideWidth });
});


// Designate 'current' to the target slide and indicator
const moveToSlide = (track, currentSlide, targetSlide) => {
    const windowWidth = window.innerWidth; // Window width
    const targetLeft = parseFloat(targetSlide.style.left); // Get the target slide's left position
    // const offset = Math.max((windowWidth - targetSlide.offsetWidth) / 2, 0);// Calculate the centering offset
    const offset = (windowWidth - targetSlide.offsetWidth) / 2;// Calculate the centering offset
    const adjustedLeft = -(Math.round(targetLeft - offset));

    console.log('Target Left:', targetLeft);
    console.log('Offset:', offset);
    console.log('Adjusted Left:', adjustedLeft);
    console.log('Updated Current Slide:', targetSlide);
    console.log('Updated Transform Value1 :', track.style.transform);
    track.style.transform = `translateX(${adjustedLeft}px)`; // Center the target slide
    
    updateSlides(currentSlide, targetSlide);

    console.log('Updated Transform Value2 :', track.style.transform);


    // Update indicators
    const currentIndicator = indicatorsContainer.querySelector('.current');
    const targetIndex = slides.findIndex(slide => slide === targetSlide);
    const targetIndicator = indicatorsContainer.children[targetIndex];
    updateIndicators(currentIndicator, targetIndicator);

    console.log('Target Index:', targetIndex);
    console.log('Updated Current Indicator:', targetIndicator);
};

// Update slides
const updateSlides = (currentSlide, targetSlide) => {
    currentSlide.classList.remove('current');
    targetSlide.classList.add('current');
};

// Update indicators
const updateIndicators = (currentIndicator, targetIndicator) => {
    currentIndicator.classList.remove('current');
    targetIndicator.classList.add('current');
};

// Handle the display of the arrows
const toggleArrows = (slides, prevButton, nextButton, targetIndex) => {
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
};

// Click right
nextButton.addEventListener('click', () => {
    const currentSlide = track.querySelector('.current');
    const nextSlide = currentSlide.nextElementSibling;

    if (!nextSlide) return; // Exit if there's no next slide

    const nextIndex = slides.findIndex(slide => slide === nextSlide);
    console.log('Next Slide:',nextSlide);
    moveToSlide(track, currentSlide, nextSlide);
    toggleArrows(slides, prevButton, nextButton, nextIndex);
    console.log('Current Slide:', currentSlide);
});

// Click left
prevButton.addEventListener('click', () => {
    const currentSlide = track.querySelector('.current');
    const prevSlide = currentSlide.previousElementSibling;

    if (!prevSlide) return; // Exit if there's no previous slide

    const prevIndex = slides.findIndex(slide => slide === prevSlide);
    console.log('Prev Slide:',prevSlide);
    moveToSlide(track, currentSlide, prevSlide);
    toggleArrows(slides, prevButton, nextButton, prevIndex);
    console.log('Current Slide:', currentSlide);
});

indicatorsContainer.addEventListener('click', (event) => {
    const targetIndicator = event.target.closest('.carousel-indicator');

    if (!targetIndicator) return; // Ignore clicks outside indicators

    const currentSlide = track.querySelector('.current');
    const targetIndex = Array.from(indicatorsContainer.children).indexOf(targetIndicator);
    const targetSlide = slides[targetIndex];

    moveToSlide(track, currentSlide, targetSlide);
    toggleArrows(slides, prevButton, nextButton, targetIndex);
    console.log('Target Slide:', targetSlide);
});

const initializeCarousel = () => {
    const currentSlide = track.querySelector('.current') || slides[0];// Find the first slide with the 'current' class
    if (!currentSlide) {
        console.error("No slide with 'current' class found. Defaulting to the first slide.");
        return;
    }

    const targetLeft = parseFloat(currentSlide.style.left); // Get the current slide's left position
    const cardWidth = currentSlide.offsetWidth; // Card width
    const windowWidth = window.innerWidth; // Window width

    // Adjust offset for cases where cardWidth > windowWidth
    // const offset = Math.max((windowWidth - cardWidth) / 2, 0);
    const offset = (windowWidth - cardWidth) / 2;
    const adjustedLeft = -(Math.round(targetLeft - offset));
    track.style.transform = `translateX(${adjustedLeft}px)`; // Center the first card
    
    console.log('Slide Left:', currentSlide.style.left);
    console.log('Offset:', offset);
    console.log('Window Width:', window.innerWidth);
    console.log('Card Width:', currentSlide.offsetWidth);
    console.log('Calculated Offset:', adjustedLeft);
    console.log('Transform Value:', track.style.transform);
    console.log('Current Slide:', currentSlide);
};

// Call the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeCarousel);
document.addEventListener('DOMContentLoaded', () => {
      // Select elements to fade in
      const fadeInElements = document.querySelectorAll('.fade-in');

      // Add the 'visible' class to each element
      fadeInElements.forEach(element => {
          element.classList.add('visible');
      });
});


window.addEventListener('resize', initializeCarousel);