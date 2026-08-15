// Replace the three placeholder Vercel URLs below with your real deployed project URLs.
const LIVE_URLS = {
  tradeops: "https://tradeops-vercel.vercel.app/",
  athlete: "https://athelete-performance-vercel.vercel.app/",
  lung: "https://lung-disease-detection-vercel.vercel.app/"
};

const cursor = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; });

const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:.08});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project').forEach(card => {
      const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.style.display = show ? '' : 'none';
    });
  });
});

const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModal = () => { modal.classList.remove('open'); document.body.classList.remove('modal-open'); modalVideo.pause(); modalVideo.removeAttribute('src'); modalVideo.load(); };
document.querySelectorAll('.video-btn').forEach(btn => btn.addEventListener('click', e => {
  e.preventDefault();
  modalVideo.src = btn.dataset.video;
  modalVideo.controls = true;
  modalVideo.load();
  modal.classList.add('open');
  document.body.classList.add('modal-open');
  modalVideo.play().catch(()=>{});
}));
modalVideo.addEventListener('error', () => console.warn('Video could not be loaded:', modalVideo.src));
document.querySelector('#videoModal .modal-close').addEventListener('click', closeModal);
document.querySelector('#videoModal .modal-backdrop').addEventListener('click', closeModal);
document.querySelector('#videoModal .modal-close').addEventListener('pointerdown', e => { e.stopPropagation(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// Make the three live-demo buttons easy to update from one place.
const liveButtons = document.querySelectorAll('.live-link');
const keys = ['tradeops','athlete','lung'];
liveButtons.forEach((btn, i) => { if(LIVE_URLS[keys[i]]) btn.href = LIVE_URLS[keys[i]]; });

// Small 3D tilt on project cards.
document.querySelectorAll('.project').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (window.innerWidth < 900) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*2).toFixed(2)}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave', ()=>card.style.transform='');
});

// Achievement image gallery lightbox.
const galleryImages = {
  bgmi: [
    ["assets/achievements/bgmi-trophy-team.jpg", "BGMI / Runners-up team with trophy"],
    ["assets/achievements/bgmi-team.jpg", "BGMI / Tournament team"],
    ["assets/achievements/bgmi-certificate.jpg", "BGMI / Certificate and trophy"]
  ],
  football: [
    ["assets/achievements/football/football-new-ss.jpg", "Football gallery"],
    ["assets/achievements/football/football-team-tournament-2.jpg", "Football gallery"],
    ["assets/achievements/football/football-team-blue.jpg", "Football gallery"],
    ["assets/achievements/football/football-medals.jpg", "Football gallery"],
    ["assets/achievements/football/football-team-steps.jpg", "Football gallery"],
    ["assets/achievements/football/football-match.jpg", "Football gallery"],
    ["assets/achievements/football/football-team-action.jpg", "Football gallery"],
    ["assets/achievements/football/football-team-red.jpg", "Football gallery"],
    ["assets/achievements/football/football-match-day.jpg", "Football gallery"],
    ["assets/achievements/football/football-awards.jpg", "Football gallery"],
    ["assets/achievements/football/football-trophy-portrait.jpg", "Football / Trophy portrait"],
    ["assets/achievements/football/football-captain-announcement.jpg", "Football / Captain announcement"]
  ],
  internship: [
    ["assets/certificates/multid-internship-certificate.png", "Multi Dimensional Technologies / Internship certificate"]
  ]
};

const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const imageCaption = document.getElementById('imageCaption');
let galleryIndex = 0;
let activeGallery = [];

function renderGallery(){
  if(!activeGallery.length) return;
  modalImage.src = activeGallery[galleryIndex][0];
  imageCaption.textContent = activeGallery[galleryIndex][1] + `  ·  ${galleryIndex + 1}/${activeGallery.length}`;
}
function openGallery(key, index=0){
  activeGallery = galleryImages[key] || [];
  galleryIndex = Math.max(0, Math.min(index, activeGallery.length - 1));
  if(!activeGallery.length) return;
  renderGallery();
  imageModal.classList.add('open');
  document.body.classList.add('modal-open');
}
function closeImageModal(){
  imageModal.classList.remove('open');
  modalImage.removeAttribute('src');
  document.body.classList.remove('modal-open');
}
function stepGallery(delta){
  if(!activeGallery.length) return;
  galleryIndex = (galleryIndex + delta + activeGallery.length) % activeGallery.length;
  renderGallery();
}

document.querySelectorAll('.gallery-open, .cert-mini').forEach(btn =>
  btn.addEventListener('click', ()=>openGallery(btn.dataset.gallery, 0))
);
document.querySelectorAll('.gallery-img[data-gallery]').forEach(img => {
  img.addEventListener('click', ()=>openGallery(img.dataset.gallery, Number(img.dataset.index || 0)));
});
document.querySelector('.image-close').addEventListener('click', closeImageModal);
document.querySelector('#imageModal .modal-backdrop').addEventListener('click', closeImageModal);
document.querySelector('.gallery-prev').addEventListener('click', ()=>stepGallery(-1));
document.querySelector('.gallery-next').addEventListener('click', ()=>stepGallery(1));

document.addEventListener('keydown', e=>{
  if(e.key==='Escape') closeImageModal();
  if(!imageModal.classList.contains('open')) return;
  if(e.key==='ArrowRight') stepGallery(1);
  if(e.key==='ArrowLeft') stepGallery(-1);
});

// Gentle cursor glow + section-aware nav state.
const navLinks = [...document.querySelectorAll('.nav nav a')];
const navSections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle('active-nav', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, {rootMargin:'-35% 0px -55% 0px', threshold:0});
navSections.forEach(s=>sectionObserver.observe(s));

// Hover/focus behavior for the two drone videos: equal size by default, one expands on hover.
document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('mouseenter', ()=>card.closest('.drone-media')?.classList.add('video-focus'));
  card.addEventListener('mouseleave', ()=>card.closest('.drone-media')?.classList.remove('video-focus'));
});

