const carousel = document.querySelector('.brand-carousel');
const track = document.querySelector('.brand-track');

let isDragging = false;
let startX;
let currentTranslate = 0;
let prevTranslate = 0;

const brands = track.children;
const brandWidth = brands[0].offsetWidth + 80; // width + gap

// Auto step-wise movement
let stepIndex = 0;
let autoMoveInterval = setInterval(() => {
  if(isDragging) return; // skip while dragging
  stepIndex++;
  currentTranslate = -brandWidth * (stepIndex % (brands.length/2));
  track.style.transform = `translateX(${currentTranslate}px)`;
}, 5000); // move one step every 5 seconds

// Drag events
carousel.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.pageX - prevTranslate;
  carousel.style.cursor = 'grabbing';
});

carousel.addEventListener('mousemove', e => {
  if(!isDragging) return;
  e.preventDefault();
  currentTranslate = e.pageX - startX;
  track.style.transform = `translateX(${currentTranslate}px)`;
});

carousel.addEventListener('mouseup', e => {
  isDragging = false;
  carousel.style.cursor = 'grab';
  prevTranslate = currentTranslate;
  // Snap to nearest brand
  stepIndex = Math.round(-currentTranslate / brandWidth);
  currentTranslate = -brandWidth * stepIndex;
  prevTranslate = currentTranslate;
  track.style.transform = `translateX(${currentTranslate}px)`;
});

carousel.addEventListener('mouseleave', e => {
  if(isDragging) {
    isDragging = false;
    carousel.style.cursor = 'grab';
    // Snap to nearest brand
    stepIndex = Math.round(-currentTranslate / brandWidth);
    currentTranslate = -brandWidth * stepIndex;
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }
});

// Touch support for mobile
carousel.addEventListener('touchstart', e => {
  isDragging = true;
  startX = e.touches[0].clientX - prevTranslate;
});

carousel.addEventListener('touchmove', e => {
  if(!isDragging) return;
  currentTranslate = e.touches[0].clientX - startX;
  track.style.transform = `translateX(${currentTranslate}px)`;
});

carousel.addEventListener('touchend', e => {
  isDragging = false;
  stepIndex = Math.round(-currentTranslate / brandWidth);
  currentTranslate = -brandWidth * stepIndex;
  prevTranslate = currentTranslate;
  track.style.transform = `translateX(${currentTranslate}px)`;
});


// Portfolio Filter
const portfolioButtons = document.querySelectorAll('.portfolio-filters button');
const portfolioItems = document.querySelectorAll('.portfolio-item');

function filterPortfolio(category) {
  portfolioItems.forEach(item => {
    if(category === 'all' || item.classList.contains(category)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// Zoom functionality
const zoomLinks = document.querySelectorAll('.portfolio-zoom');

// Create lightbox element
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);

const lightboxImg = document.createElement('img');
lightbox.appendChild(lightboxImg);

// Click on zoom icon
zoomLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const imgSrc = link.href;
    lightboxImg.src = imgSrc;
    lightbox.style.display = 'flex';
  });
});

// Close lightbox on click
lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
});


// Button click events
portfolioButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    portfolioButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterPortfolio(btn.dataset.filter);
  });
});

// Show all items by default
filterPortfolio('all');


// Testimonials Carousel
const testimonials = document.querySelectorAll('.testimonial-item');
const dots = document.querySelectorAll('.testimonial-dots .dot');

let currentTestimonial = 0;

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    if(i === index) {
      t.classList.add('active');
      t.style.opacity = 0;
      setTimeout(() => t.style.opacity = 1, 10); // fade in
    } else {
      t.classList.remove('active');
      t.style.opacity = 0;
    }
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  currentTestimonial = index;
}

// Auto slide every 8 seconds (slower)
let testimonialInterval = setInterval(() => {
  let next = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(next);
}, 8000);

// Dots click
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(testimonialInterval);
    showTestimonial(parseInt(dot.dataset.index));
    testimonialInterval = setInterval(() => {
      let next = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(next);
    }, 8000);
  });
});

// Show first testimonial
showTestimonial(0);

function animateCounter(counter) {
  const target = +counter.getAttribute('data-target');
  const symbol = counter.getAttribute('data-symbol') || '';
  let count = 0;

  const duration = 2500;               
  const increment = Math.ceil(target / (duration / 20));

  const timer = setInterval(() => {
    count += increment;
    if (count >= target) count = target;
    counter.innerHTML = count + symbol + '<span class="label">' + counter.querySelector('.label').textContent + '</span>';

    if (count >= target) clearInterval(timer);
  }, 20);
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

const counters = document.querySelectorAll('.counter');
let animated = false;

// function to check & animate counters
function triggerCounters() {
  if (!animated) {
    counters.forEach(counter => {
      if (isInViewport(counter)) {
        animateCounter(counter);
      }
    });
    animated = true;
  }
}

// Check on scroll
window.addEventListener('scroll', triggerCounters);

// Check immediately on page load
window.addEventListener('load', triggerCounters);
