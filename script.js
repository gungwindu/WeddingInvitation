// small interactions: nav toggle, smooth scroll, gallery lightbox, contact mock
document.addEventListener('DOMContentLoaded', () => {
  // get URL parameter for guest name and group
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  const groupName = urlParams.get('group') || 'Keluarga Besar';
  if (guestName) {
    document.querySelector('.to').innerHTML = `kpd. ${guestName}<br>${groupName}`;
  }

  // open invitation with guest name
  document.getElementById('guestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const guestName = document.getElementById('guestName').value.trim();
    if (guestName) {
      document.querySelector('.to').innerHTML = `kpd.Bpk/Ibu/Saudara/i <br>${guestName}`;
    }
    const cover = document.getElementById('cover');
    const main = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    cover.style.display = 'none';
    main.style.display = 'block';
    main.style.animation = 'fadeIn 1s ease';
    bgMusic.play().catch(() => {});
  });

  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // load and display wishes
  const loadWishes = () => {
    const wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
    const wishesList = document.getElementById('wishesList');
    wishesList.innerHTML = '';
    wishes.forEach(wish => {
      const wishEl = document.createElement('div');
      wishEl.className = 'wish';
      const attendanceText = wish.attendance ? ` (${wish.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'})` : '';
      wishEl.innerHTML = `<h4>${wish.name}${attendanceText}</h4><p>${wish.message}</p>`;
      wishesList.appendChild(wishEl);
    });
  };
  loadWishes();

  // countdown to wedding date
  const weddingDate = new Date('2026-11-16T09:00:00').getTime();
  const countdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById('days').textContent = days.toString().padStart(2, '0');
      document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
  };
  countdown();
  setInterval(countdown, 1000);

  // reset wishes
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin mereset semua ucapan?')) {
      localStorage.removeItem('weddingWishes');
      document.getElementById('wishesList').innerHTML = '';
      alert('Ucapan telah direset.');
    }
  });

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  navToggle.addEventListener('click', () => {
    if (nav.style.display === 'flex') nav.style.display = '';
    else nav.style.display = 'flex';
  });

  // smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const targetId = a.getAttribute('href');
      if (!targetId || targetId === '#') return;
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // gallery lightbox
  const thumbs = document.querySelectorAll('.thumb img');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbClose = document.getElementById('lbClose');

  thumbs.forEach(img=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const full = img.getAttribute('data-full') || img.src;
      lbImage.src = full;
      lightbox.style.display = 'flex';
      lightbox.setAttribute('aria-hidden','false');
    });
  });
  lbClose.addEventListener('click', closeLB);
  lightbox.addEventListener('click', (e)=>{
    if (e.target === lightbox) closeLB();
  });
  function closeLB(){
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden','true');
    lbImage.src = '';
  }

  // contact form (mock behavior; replace with actual endpoint)
  document.getElementById('sendBtn').addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const msg = document.getElementById('message').value.trim();
    const formMsg = document.getElementById('formMsg');

    if (!name || !attendance) {
      formMsg.style.color = 'crimson';
      formMsg.textContent = 'Mohon isi nama dan konfirmasi kehadiran.';
      return;
    }

    // save wish
    const wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
    wishes.push({name, attendance: attendance.value, message: msg || 'Selamat menempuh hidup baru!'});
    localStorage.setItem('weddingWishes', JSON.stringify(wishes));

    // add to display with animation
    const wishEl = document.createElement('div');
    wishEl.className = 'wish';
    wishEl.innerHTML = `<h4>${name} (${attendance.value === 'hadir' ? 'Hadir' : 'Tidak Hadir'})</h4><p>${msg || 'Selamat menempuh hidup baru!'}</p>`;
    document.getElementById('wishesList').appendChild(wishEl);

    // success message
    formMsg.style.color = 'green';
    formMsg.textContent = 'Terima kasih atas konfirmasi dan ucapan Anda!';
    // reset
    document.getElementById('contactForm').reset();
  });

  // reset wishes
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin mereset semua ucapan?')) {
      localStorage.removeItem('weddingWishes');
      document.getElementById('wishesList').innerHTML = '';
      alert('Ucapan telah direset.');
    }
  });

});
