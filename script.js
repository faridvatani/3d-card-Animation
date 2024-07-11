// Selector utility to reduce repetition and improve readability
const select = (selector, all = false) =>
  all ? document.querySelectorAll(selector) : document.querySelector(selector);

const animationElements = {
  section: select('.animation-section'),
  background: select('.background-container'),
  cards: select('.card', true),
};

// Check if the viewport width is less than or equal to 768px for responsive design considerations
const isMobileWidth = () =>
  window.matchMedia('only screen and (max-width: 768px)').matches;

// Configuration object for card animation properties
const config = {
  // Define the default clip path dimensions, adjusting based on viewport width for responsiveness
  cardClipPath: {
    top: 20,
    right: isMobileWidth() ? 20 : 35,
    bottom: 20,
    left: isMobileWidth() ? 20 : 35,
  },
  movementStrength: 5,
};
// Handles the movement of the card based on mouse or touch position
const handleCardMovement = ({ touches, clientX, clientY }) => {
  const { cardClipPath, movementStrength } = config;
  const [x, y] = touches
    ? [touches[0].clientX, touches[0].clientY]
    : [clientX, clientY];
  const [xPos, yPos] = [
    (x / window.innerWidth - 0.5) * 2,
    (y / window.innerHeight - 0.5) * 2,
  ];

  gsap.to(animationElements.cards[1], {
    rotationX: xPos * movementStrength,
    rotationY: -yPos * movementStrength,
    duration: 0.6,
    clipPath: `inset(${cardClipPath.top + yPos * movementStrength}% ${
      cardClipPath.right - xPos * movementStrength
    }% ${cardClipPath.bottom - yPos * movementStrength}% ${
      cardClipPath.left + xPos * movementStrength
    }% round 10px)`,
  });
};

// Animates the card back to its original position and shape on click
const animateCardOnClick = () => {
  gsap.to(animationElements.cards[1], {
    rotationX: 0,
    rotationY: 0,
    duration: 1.2,
    clipPath: `inset(0% 0% 0% 0% round 0px)`,
    onComplete: () => {
      // Switch the images between the two cards with animation
      const firstCardImage = animationElements.cards[0].querySelector('img');
      const secondCardImage = animationElements.cards[1].querySelector('img');
      const tempSrc = firstCardImage.src;
      firstCardImage.src = secondCardImage.src;
      secondCardImage.src = tempSrc;
    },
  });
};

animationElements.section.addEventListener('mousemove', handleCardMovement);
animationElements.section.addEventListener('touchmove', handleCardMovement);
animationElements.cards[1].addEventListener('click', animateCardOnClick);
