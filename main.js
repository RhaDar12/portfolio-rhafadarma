

document.addEventListener('DOMContentLoaded', () => {
  
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  const cloudLoader = document.getElementById('cloudLoader');
  const cloudCurtain = document.getElementById('cloudCurtain');
  const cloudLoaderCenter = document.getElementById('cloudLoaderCenter');
  const loaderFill = document.getElementById('loaderFill');
  const progressBar = document.querySelector('.loader-progress-bar');

  const TOTAL_FRAMES = 111;
  const isMobile = window.innerWidth < 768;
  const frameDir = isMobile ? 'assets/dive-m/' : 'assets/dive/';
  const frameImages = [];
  let loadedFrames = 0;
  let introDismissed = false;

  const canvas = document.getElementById('diveCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  function padZero(num, size) {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  function renderCanvasFrame(img) {
    if (!ctx || !img || !img.complete || !img.naturalWidth) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let rw, rh, ox, oy;

    if (canvasRatio > imgRatio) {
      rw = w;
      rh = w / imgRatio;
      ox = 0;
      oy = (h - rh) / 2;
    } else {
      rh = h;
      rw = h * imgRatio;
      ox = (w - rw) / 2;
      oy = 0;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, ox, oy, rw, rh);
    ctx.restore();
  }

  let currentFrameIndex = 0;
  let lastRenderedIndex = -1;
  let isRenderPending = false;

  function requestFrameRender(index) {
    currentFrameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
    if (currentFrameIndex === lastRenderedIndex) return;
    if (!isRenderPending) {
      isRenderPending = true;
      requestAnimationFrame(() => {
        isRenderPending = false;
        lastRenderedIndex = currentFrameIndex;
        const img = frameImages[currentFrameIndex];
        if (img) renderCanvasFrame(img);
      });
    }
  }

  window.addEventListener('resize', () => {
    lastRenderedIndex = -1;
    requestFrameRender(currentFrameIndex);
  });

  const MIN_ANIM_DURATION = 1400; 
  const loadStartTime = performance.now();
  let visualProgress = 0;
  let animLoopId = null;

  function updateVisualProgress() {
    if (introDismissed) return;
    const elapsed = performance.now() - loadStartTime;
    const timeProgress = Math.min(100, (elapsed / MIN_ANIM_DURATION) * 100);
    const assetProgress = Math.min(100, (loadedFrames / TOTAL_FRAMES) * 100);

    const target = Math.min(timeProgress, assetProgress >= 70 ? timeProgress : assetProgress);

    visualProgress += (target - visualProgress) * 0.16;
    if (Math.abs(target - visualProgress) < 0.3) {
      visualProgress = target;
    }

    if (loaderFill) {
      loaderFill.style.width = `${visualProgress.toFixed(1)}%`;
    }

    if (loadedFrames >= TOTAL_FRAMES && visualProgress >= 99 && elapsed >= MIN_ANIM_DURATION) {
      if (loaderFill) loaderFill.style.width = '100%';
      setTimeout(runIntroDismiss, 180);
    } else {
      animLoopId = requestAnimationFrame(updateVisualProgress);
    }
  }

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const num = padZero(i, 3);
    img.src = `${frameDir}f_${num}.webp`;
    img.onload = () => {
      loadedFrames++;
      if (i === 1) {
        requestFrameRender(0);
      }
    };
    img.onerror = () => {
      loadedFrames++;
    };
    frameImages.push(img);
  }

  animLoopId = requestAnimationFrame(updateVisualProgress);

  setTimeout(() => {
    if (!introDismissed) {
      if (loaderFill) loaderFill.style.width = '100%';
      runIntroDismiss();
    }
  }, 3500);

  if (cloudLoader) {
    cloudLoader.addEventListener('click', () => {
      if (loaderFill) loaderFill.style.width = '100%';
      runIntroDismiss();
    });
  }

    function initAmbientClouds() {
    const cloudsContainer = document.getElementById('heroSkyClouds');
    if (!cloudsContainer || !window.gsap) return;
    cloudsContainer.innerHTML = '';

    const isMobile = window.innerWidth < 768;
    const widthScale = isMobile ? 0.65 : 1.0;

    const cloudConfigs = [
      
      { src: 'assets/clouds/cloud_1.png', top: '1%', width: 440, opacity: 0.32, progress: 0.04, duration: 95, blur: 1.5, bobAmp: 10, bobDur: 7.2 },
      { src: 'assets/clouds/cloud_3.png', top: '4%', width: 380, opacity: 0.28, progress: 0.22, duration: 105, blur: 2.0, bobAmp: 8, bobDur: 8.0 },
      { src: 'assets/clouds/cloud_2.png', top: '0%', width: 520, opacity: 0.25, progress: 0.46, duration: 110, blur: 2.0, bobAmp: 12, bobDur: 8.5 },
      { src: 'assets/clouds/cloud_4.png', top: '3%', width: 420, opacity: 0.30, progress: 0.68, duration: 100, blur: 1.5, bobAmp: 9, bobDur: 7.6 },
      { src: 'assets/clouds/cloud_1.png', top: '6%', width: 460, opacity: 0.26, progress: 0.88, duration: 115, blur: 2.0, bobAmp: 11, bobDur: 8.2 },

      { src: 'assets/clouds/cloud_2.png', top: '7%', width: 620, opacity: 0.48, progress: 0.12, duration: 68, blur: 0, bobAmp: 18, bobDur: 6.0 },
      { src: 'assets/clouds/cloud_4.png', top: '12%', width: 560, opacity: 0.45, progress: 0.34, duration: 62, blur: 0, bobAmp: 15, bobDur: 5.5 },
      { src: 'assets/clouds/cloud_1.png', top: '5%', width: 680, opacity: 0.52, progress: 0.58, duration: 74, blur: 0, bobAmp: 16, bobDur: 6.4 },
      { src: 'assets/clouds/cloud_3.png', top: '15%', width: 540, opacity: 0.42, progress: 0.78, duration: 58, blur: 0, bobAmp: 14, bobDur: 5.8 },
      { src: 'assets/clouds/cloud_2.png', top: '18%', width: 590, opacity: 0.46, progress: 0.96, duration: 65, blur: 0, bobAmp: 17, bobDur: 6.2 },

      { src: 'assets/clouds/cloud_3.png', top: '22%', width: 510, opacity: 0.38, progress: 0.08, duration: 78, blur: 0.5, bobAmp: 12, bobDur: 6.8 },
      { src: 'assets/clouds/cloud_1.png', top: '25%', width: 480, opacity: 0.35, progress: 0.28, duration: 82, blur: 0.5, bobAmp: 11, bobDur: 7.0 },
      { src: 'assets/clouds/cloud_4.png', top: '20%', width: 530, opacity: 0.40, progress: 0.52, duration: 72, blur: 0, bobAmp: 13, bobDur: 6.5 },
      { src: 'assets/clouds/cloud_2.png', top: '27%', width: 460, opacity: 0.33, progress: 0.72, duration: 85, blur: 0.5, bobAmp: 10, bobDur: 7.4 },
      { src: 'assets/clouds/cloud_3.png', top: '23%', width: 500, opacity: 0.36, progress: 0.90, duration: 76, blur: 0, bobAmp: 12, bobDur: 6.7 },

      { src: 'assets/clouds/cloud_4.png', top: '2%', width: 820, opacity: 0.24, progress: 0.18, duration: 48, blur: 3.0, bobAmp: 22, bobDur: 5.0 },
      { src: 'assets/clouds/cloud_2.png', top: '14%', width: 780, opacity: 0.26, progress: 0.62, duration: 44, blur: 2.5, bobAmp: 20, bobDur: 4.8 },
      { src: 'assets/clouds/cloud_1.png', top: '8%', width: 850, opacity: 0.22, progress: 0.82, duration: 50, blur: 3.5, bobAmp: 24, bobDur: 5.2 }
    ];

    const screenW = window.innerWidth;
    const minX = isMobile ? -550 : -900;
    const maxX = screenW + (isMobile ? 200 : 350);
    const range = maxX - minX;

    cloudConfigs.forEach((cfg, idx) => {
      const img = document.createElement('img');
      img.className = 'ambient-cloud-item';
      img.src = cfg.src;
      img.alt = `Ambient Cloud ${idx + 1}`;
      img.style.top = cfg.top;
      img.style.width = `${Math.round(cfg.width * widthScale)}px`;
      img.style.opacity = cfg.opacity;
      if (cfg.blur) {
        img.style.filter = `blur(${cfg.blur}px)`;
      }
      cloudsContainer.appendChild(img);

      const initX = minX + (cfg.progress * range);

      gsap.fromTo(img,
        { x: initX },
        {
          x: initX + range,
          duration: cfg.duration,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => {
              const val = parseFloat(x);
              return ((((val - minX) % range) + range) % range) + minX;
            })
          }
        }
      );

      gsap.to(img, {
        y: `+=${cfg.bobAmp}`,
        duration: cfg.bobDur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: (idx * 0.35) % 3
      });
    });
  }

  function initLightParticles() {
    const lightContainer = document.getElementById('heroLightParticles');
    if (!lightContainer || !window.gsap) return;
    lightContainer.innerHTML = '';

    const count = window.innerWidth < 768 ? 24 : 42;
    for (let i = 0; i < count; i++) {
      const mote = document.createElement('span');
      mote.className = 'light-mote';

      const typeRandom = Math.random();
      if (typeRandom < 0.25) {
        mote.classList.add('light-mote-cyan');
      } else if (typeRandom < 0.50) {
        mote.classList.add('light-mote-white');
      }

      const size = Math.random() < 0.7 ? (Math.random() * 3 + 2.5) : (Math.random() * 4.5 + 4);
      mote.style.width = `${size.toFixed(1)}px`;
      mote.style.height = `${size.toFixed(1)}px`;

      const startLeft = Math.random() * 100;
      const startTop = Math.random() * 100; 
      mote.style.left = `${startLeft.toFixed(1)}%`;
      mote.style.top = `${startTop.toFixed(1)}%`;

      lightContainer.appendChild(mote);

      const riseDuration = Math.random() * 7 + 8;
      const riseDelay = Math.random() * -10; 

      gsap.fromTo(mote,
        { y: 0, opacity: Math.random() * 0.3 + 0.2 },
        {
          y: -window.innerHeight * 1.05,
          duration: riseDuration,
          ease: 'none',
          repeat: -1,
          delay: riseDelay,
          modifiers: {
            y: gsap.utils.unitize(y => {
              const max = window.innerHeight * 0.2;
              const min = -window.innerHeight * 1.1;
              const range = max - min;
              return ((((y - min) % range) + range) % range) + min;
            })
          }
        }
      );

      const swayDist = Math.random() * 35 + 15;
      gsap.to(mote, {
        x: `+=${swayDist}`,
        duration: Math.random() * 2.5 + 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      });

      gsap.to(mote, {
        opacity: Math.random() * 0.5 + 0.5,
        scale: Math.random() * 0.4 + 1.1,
        duration: Math.random() * 2 + 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      });
    }
  }

  const runIntroDismiss = () => {
    if (introDismissed) return;
    introDismissed = true;
    if (animLoopId) cancelAnimationFrame(animLoopId);

    if (frameImages[0] && frameImages[0].complete) {
      renderCanvasFrame(frameImages[0]);
    }

    initAmbientClouds();
    initLightParticles();

    if (cloudCurtain) {
      cloudCurtain.classList.add('parting');
    }

    if (window.gsap) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (cloudLoader) {
            cloudLoader.style.display = 'none';
          }
          animateHeroEntrance();
        }
      });

      if (progressBar) {
        tl.to(progressBar, {
          scaleX: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut'
        }, 0);
      }

      if (cloudLoaderCenter) {
        tl.to(cloudLoaderCenter, {
          scale: 0.85,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.in'
        }, 0.08);
      }

      tl.to('#cLayerCenter', {
        scale: 4.8,
        filter: 'blur(35px)',
        opacity: 0,
        duration: 1.35,
        ease: 'power3.out'
      }, 0.15);

      tl.to('#cLayerTop', {
        y: -window.innerHeight * 0.95,
        scale: 1.6,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out'
      }, 0.15);

      tl.to('#cLayerBottom', {
        y: window.innerHeight * 0.95,
        scale: 1.6,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out'
      }, 0.15);

      tl.to('#cLayerLeft', {
        x: -window.innerWidth * 0.98,
        rotation: -9,
        scale: 1.5,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out'
      }, 0.15);

      tl.to('#cLayerRight', {
        x: window.innerWidth * 0.98,
        rotation: 9,
        scale: 1.5,
        opacity: 0,
        duration: 1.4,
        ease: 'power3.out'
      }, 0.15);

      tl.to(cloudLoader, {
        opacity: 0,
        duration: 0.85,
        ease: 'power2.inOut'
      }, 0.65);

    } else {
      if (progressBar) progressBar.style.display = 'none';
      if (cloudLoader) {
        cloudLoader.style.opacity = '0';
        setTimeout(() => {
          cloudLoader.style.display = 'none';
          animateHeroEntrance();
        }, 800);
      }
    }
  };

  const animateHeroEntrance = () => {
    const heroElements = ['#pillNav', '#heroColLeft', '#heroColCenter', '#heroColRight', '#scrollDivePrompt'];
    
    heroElements.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) {
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
      }
    });

    if (!window.gsap) {
      document.body.style.overflow = '';
      heroElements.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.style.opacity = '1';
      });
      initDiveScrollTrigger();
      return;
    }

    gsap.set('#pillNav', { y: -35, opacity: 0 });
    gsap.set('#heroColLeft', { x: -35, opacity: 0, filter: 'blur(6px)' });
    gsap.set('#heroColCenter', { y: 30, scale: 0.92, opacity: 0, filter: 'blur(6px)' });
    gsap.set('#heroColRight', { x: 35, opacity: 0, filter: 'blur(6px)' });
    gsap.set('#scrollDivePrompt', { y: 20, opacity: 0 });

    const entranceTl = gsap.timeline({
      onComplete: () => {
        
        document.body.style.overflow = '';

        gsap.set('#heroColLeft', { clearProps: 'filter,x', opacity: 1 });
        gsap.set('#heroColCenter', { clearProps: 'filter,y', scale: 1, opacity: 1 });
        gsap.set('#heroColRight', { clearProps: 'filter,x', opacity: 1 });
        gsap.set('#pillNav', { clearProps: 'y', opacity: 1 });
        gsap.set('#scrollDivePrompt', { clearProps: 'y', opacity: 1 });

        initDiveScrollTrigger();
      }
    });

    entranceTl.to('#pillNav', {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out'
    })
    .to('#heroColLeft', {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.95,
      ease: 'power3.out'
    }, '-=0.55')
    .to('#heroColCenter', {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.05,
      ease: 'back.out(1.2)'
    }, '-=0.75')
    .to('#heroColRight', {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.95,
      ease: 'power3.out'
    }, '-=0.75')
    .to('#scrollDivePrompt', {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power2.out'
    }, '-=0.55');
  };

  const diveParticlesEl = document.getElementById('diveParticles');
  const undergroundParticles = [];
  if (diveParticlesEl) {
    diveParticlesEl.innerHTML = '';
    const particleCount = window.innerWidth < 768 ? 20 : 35;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('span');
      p.className = 'dive-particle';
      const size = Math.random() < 0.6 ? (Math.random() * 2.5 + 2) : (Math.random() * 4 + 4.5);
      const x = Math.random() * 100;
      const y = Math.random() * 95 + 5;
      const opacity = (Math.random() * 0.4 + 0.35).toFixed(2);
      const speed = size / 2.5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${x}%`;
      p.style.top = `${y}%`;
      p.style.opacity = opacity;
      diveParticlesEl.appendChild(p);
      undergroundParticles.push({ el: p, speed: speed });
    }
  }

  let diveTL = null;
  const frameTracker = { frame: 0 };

  function resetHeroToInitial() {
    frameTracker.frame = 0;
    lastRenderedIndex = -1;
    requestFrameRender(0);

    gsap.set('#diveCanvas', { scale: 1, filter: 'none', opacity: 1 });
    gsap.set('#diveVignette', { opacity: 0 });
    gsap.set('#diveEarthOverlay', { opacity: 0 });
    gsap.set('#diveParticles', { opacity: 0 });

    gsap.set('#home', { autoAlpha: 1, pointerEvents: 'auto', opacity: 1 });
    gsap.set('#heroColLeft', { x: 0, opacity: 1, filter: 'none' });
    gsap.set('#heroColCenter', { y: 0, scale: 1, opacity: 1, filter: 'none' });
    gsap.set('#heroColRight', { x: 0, opacity: 1, filter: 'none' });
    gsap.set('#heroSkyClouds', { y: 0, opacity: 1 });
    gsap.set('#heroLightParticles', { opacity: 1 });
    gsap.set('#scrollDivePrompt', { y: 0, opacity: 1 });
  }

  function initDiveScrollTrigger() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    if (diveTL) {
      diveTL.kill();
    }

    resetHeroToInitial();

    diveTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#dive',
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onLeaveBack: () => {
          resetHeroToInitial();
        }
      }
    });

    diveTL.fromTo('#scrollDivePrompt',
      { y: 0, opacity: 1 },
      { y: 22, opacity: 0, duration: 0.05, ease: 'power1.out' },
      0.00
    );

    diveTL.fromTo('#heroColLeft',
      { x: 0, opacity: 1, filter: 'blur(0px)' },
      { x: -220, opacity: 0, filter: 'blur(8px)', duration: 0.16, ease: 'power2.in' },
      0.00
    );

    diveTL.fromTo('#heroColCenter',
      { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' },
      { y: -90, scale: 1.15, opacity: 0, filter: 'blur(8px)', duration: 0.16, ease: 'power2.in' },
      0.01
    );

    diveTL.fromTo('#heroColRight',
      { x: 0, opacity: 1, filter: 'blur(0px)' },
      { x: 220, opacity: 0, filter: 'blur(8px)', duration: 0.16, ease: 'power2.in' },
      0.02
    );

    diveTL.fromTo('#heroSkyClouds',
      { opacity: 1, y: 0 },
      { opacity: 0, y: -70, duration: 0.15, ease: 'power1.in' },
      0.00
    );

    diveTL.fromTo('#heroLightParticles',
      { opacity: 1 },
      { opacity: 0, duration: 0.12, ease: 'power1.in' },
      0.00
    );

    diveTL.fromTo('#home',
      { autoAlpha: 1, pointerEvents: 'auto' },
      { autoAlpha: 0, pointerEvents: 'none', duration: 0.02 },
      0.16
    );

    frameTracker.frame = 0;
    diveTL.to(frameTracker, {
      frame: TOTAL_FRAMES - 1,
      duration: 1.00,
      ease: 'none',
      onUpdate: () => {
        requestFrameRender(Math.round(frameTracker.frame));
      }
    }, 0.00);

    diveTL.fromTo('#diveCanvas',
      { scale: 1.00 },
      { scale: 1.08, duration: 0.50, ease: 'none' },
      0.15
    );

    diveTL.fromTo('#diveVignette',
      { opacity: 0 },
      { opacity: 0.40, duration: 0.50, ease: 'none' },
      0.15
    );

    diveTL.to('#diveCanvas', {
      scale: 1.52,
      duration: 0.35,
      ease: 'power2.in'
    }, 0.65);

    diveTL.fromTo('#diveCanvas',
      { filter: 'blur(0px)' },
      { filter: 'blur(28px)', duration: 0.35, ease: 'power2.in' },
      0.65
    );

    diveTL.to('#diveParticles', {
      opacity: 1,
      duration: 0.10,
      ease: 'power1.out'
    }, 0.60);

    undergroundParticles.forEach(item => {
      diveTL.to(item.el, {
        y: -380 * item.speed,
        duration: 0.40,
        ease: 'power1.in'
      }, 0.60);
    });

    diveTL.to('#diveVignette', {
      opacity: 0.85,
      duration: 0.35,
      ease: 'power2.in'
    }, 0.65);

    diveTL.to('#diveEarthOverlay', {
      opacity: 1.0,
      duration: 0.35,
      ease: 'power2.in'
    }, 0.65);

    diveTL.to('#diveCanvas', {
      opacity: 0.20,
      duration: 0.30,
      ease: 'power2.in'
    }, 0.70);

    ScrollTrigger.refresh();
  }

  const coverflowStage = document.getElementById('coverflowStage');
  const cfCards = Array.from(document.querySelectorAll('.coverflow-card'));
  const cfPrevBtn = document.getElementById('cfPrevBtn');
  const cfNextBtn = document.getElementById('cfNextBtn');
  const cfDotsContainer = document.getElementById('cfDots');

  let activeCfIndex = 0;
  const totalCfCards = cfCards.length;

  if (cfDotsContainer && totalCfCards > 0) {
    cfDotsContainer.innerHTML = '';
    cfCards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `cf-dot ${idx === activeCfIndex ? 'is-active' : ''}`;
      dot.addEventListener('click', () => updateCoverflow(idx));
      cfDotsContainer.appendChild(dot);
    });
  }

  const updateCoverflow = (targetIdx) => {
    activeCfIndex = (targetIdx + totalCfCards) % totalCfCards;

    const isMobile = window.innerWidth <= 768;
    const xStep = isMobile ? 180 : 270;
    const zStep = isMobile ? 120 : 150;
    const rotY = isMobile ? 24 : 32;

    cfCards.forEach((card, idx) => {
      let offset = idx - activeCfIndex;

      if (offset > totalCfCards / 2) offset -= totalCfCards;
      if (offset < -totalCfCards / 2) offset += totalCfCards;

      if (offset === 0) {
        
        card.style.transform = `translateX(0px) translateZ(40px) rotateY(0deg) scale(1.03)`;
        card.style.opacity = '1';
        card.style.zIndex = '30';
        card.style.filter = 'none';
        card.classList.add('is-active');
      } else if (offset === -1) {
        
        card.style.transform = `translateX(-${xStep}px) translateZ(-${zStep}px) rotateY(${rotY}deg) scale(0.88)`;
        card.style.opacity = '0.82';
        card.style.zIndex = '20';
        card.style.filter = 'brightness(0.92)';
        card.classList.remove('is-active');
      } else if (offset === 1) {
        
        card.style.transform = `translateX(${xStep}px) translateZ(-${zStep}px) rotateY(-${rotY}deg) scale(0.88)`;
        card.style.opacity = '0.82';
        card.style.zIndex = '20';
        card.style.filter = 'brightness(0.92)';
        card.classList.remove('is-active');
      } else if (offset <= -2) {
        
        card.style.transform = `translateX(-${xStep * 1.75}px) translateZ(-${zStep * 2}px) rotateY(${rotY * 1.3}deg) scale(0.74)`;
        card.style.opacity = '0.45';
        card.style.zIndex = '10';
        card.style.filter = 'brightness(0.8)';
        card.classList.remove('is-active');
      } else {
        
        card.style.transform = `translateX(${xStep * 1.75}px) translateZ(-${zStep * 2}px) rotateY(-${rotY * 1.3}deg) scale(0.74)`;
        card.style.opacity = '0.45';
        card.style.zIndex = '10';
        card.style.filter = 'brightness(0.8)';
        card.classList.remove('is-active');
      }
    });

    if (cfDotsContainer) {
      const dots = Array.from(cfDotsContainer.children);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === activeCfIndex);
      });
    }
  };

  cfCards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      
      if (e.target.closest('a') || e.target.closest('button')) return;
      updateCoverflow(idx);
    });
  });

  let cfAutoTimer = null;
  const startCfAutoSlide = () => {
    stopCfAutoSlide();
    cfAutoTimer = setInterval(() => {
      updateCoverflow(activeCfIndex + 1);
    }, 5000);
  };
  const stopCfAutoSlide = () => {
    if (cfAutoTimer) {
      clearInterval(cfAutoTimer);
      cfAutoTimer = null;
    }
  };

  if (cfPrevBtn) {
    cfPrevBtn.addEventListener('click', () => {
      stopCfAutoSlide();
      updateCoverflow(activeCfIndex - 1);
      startCfAutoSlide();
    });
  }
  if (cfNextBtn) {
    cfNextBtn.addEventListener('click', () => {
      stopCfAutoSlide();
      updateCoverflow(activeCfIndex + 1);
      startCfAutoSlide();
    });
  }

  if (coverflowStage) {
    coverflowStage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        stopCfAutoSlide();
        updateCoverflow(activeCfIndex - 1);
        startCfAutoSlide();
      }
      if (e.key === 'ArrowRight') {
        stopCfAutoSlide();
        updateCoverflow(activeCfIndex + 1);
        startCfAutoSlide();
      }
    });

    let touchStartX = 0;
    coverflowStage.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        stopCfAutoSlide();
      }
    }, { passive: true });

    coverflowStage.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 45) {
          if (diffX < 0) updateCoverflow(activeCfIndex + 1);
          else updateCoverflow(activeCfIndex - 1);
        }
        startCfAutoSlide();
      }
    }, { passive: true });

    coverflowStage.addEventListener('mouseenter', stopCfAutoSlide);
    coverflowStage.addEventListener('mouseleave', startCfAutoSlide);

    startCfAutoSlide();
  }

  updateCoverflow(0);

  const orbitWrap = document.getElementById('orbitSystem') || document.querySelector('.orbit-system-wrap');
  const ringInner = document.getElementById('ringInner');
  const ringOuter = document.getElementById('ringOuter');
  const coreDefaultView = document.getElementById('coreDefaultView');
  const coreHoverView = document.getElementById('coreHoverView');
  const coreHoverImg = document.getElementById('coreHoverImg');
  const coreHoverTitle = document.getElementById('coreHoverTitle');
  const coreHoverSub = document.getElementById('coreHoverSub');
  const orbitCore = document.getElementById('orbitCenterCore');

  const techMeta = {
    'flutter': { cat: 'Cross-Platform Framework', color: '#02569B' },
    'dart': { cat: 'Client-Optimized Language', color: '#0175C2' },
    'python': { cat: 'AI & Data Automation', color: '#3776AB' },
    'javascript': { cat: 'Modern Web Engine', color: '#F7DF1E' },
    'node.js': { cat: 'Backend & Server Runtime', color: '#339933' },
    'sqlite': { cat: 'Lightweight SQL Database', color: '#003B57' },
    'discord api': { cat: 'Bot & Gateway Integration', color: '#5865F2' },
    'discord.js': { cat: 'Bot & Gateway Integration', color: '#5865F2' },
    'git': { cat: 'Version Control System', color: '#F05032' },
    'github': { cat: 'CI/CD & Collaboration', color: '#181717' },
    'android studio': { cat: 'Mobile Development IDE', color: '#3DDC84' },
    'react': { cat: 'Component UI Library', color: '#61DAFB' },
    'electron': { cat: 'Cross-Platform Desktop Apps', color: '#47848F' },
    'vs code': { cat: 'Primary Code Editor', color: '#007ACC' },
    'figma': { cat: 'UI/UX Interface Design', color: '#F24E1E' },
    'figma ui': { cat: 'UI/UX Interface Design', color: '#F24E1E' },
    'html5': { cat: 'Semantic Web Structure', color: '#E34F26' },
    'css3': { cat: 'Styling & Motion Graphics', color: '#1572B6' }
  };

  if (orbitWrap && ringInner && ringOuter && coreDefaultView && coreHoverView) {
    const orbitItems = orbitWrap.querySelectorAll('.orbit-item');

    orbitItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        
        const title = item.getAttribute('title') || item.querySelector('.orbit-tooltip')?.textContent || 'Tech';
        const img = item.querySelector('img');
        const meta = techMeta[title.toLowerCase().trim()] || { cat: 'Technology Stack', color: '#10b981' };

        if (coreHoverImg && img) {
          coreHoverImg.src = img.src;
          coreHoverImg.alt = title;
        }
        if (coreHoverTitle) {
          coreHoverTitle.textContent = title;
        }
        if (coreHoverSub) {
          coreHoverSub.textContent = meta.cat;
        }

        if (orbitCore) orbitCore.classList.add('is-hovered');

        if (window.gsap) {
          gsap.to(coreDefaultView, {
            opacity: 0,
            scale: 0.8,
            duration: 0.18,
            overwrite: 'auto',
            onComplete: () => {
              coreDefaultView.style.display = 'none';
              coreHoverView.style.display = 'flex';
              gsap.fromTo(coreHoverView, 
                { opacity: 0, scale: 0.82 }, 
                { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.6)', overwrite: 'auto' }
              );
            }
          });
        } else {
          coreDefaultView.style.display = 'none';
          coreHoverView.style.display = 'flex';
          coreHoverView.style.opacity = '1';
        }
      });

      item.addEventListener('mouseleave', () => {
        
        if (orbitCore) orbitCore.classList.remove('is-hovered');

        if (window.gsap) {
          gsap.to(coreHoverView, {
            opacity: 0,
            scale: 0.82,
            duration: 0.18,
            overwrite: 'auto',
            onComplete: () => {
              coreHoverView.style.display = 'none';
              coreDefaultView.style.display = 'flex';
              gsap.fromTo(coreDefaultView, 
                { opacity: 0, scale: 0.8 }, 
                { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' }
              );
            }
          });
        } else {
          coreHoverView.style.display = 'none';
          coreDefaultView.style.display = 'flex';
          coreDefaultView.style.opacity = '1';
        }
      });
    });
  }

  const eduAnimItems = document.querySelectorAll('.edu-animate');
  if (eduAnimItems.length) {
    const eduObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = (parseInt(entry.target.dataset.eduIndex) || 0) * 160;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          eduObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    eduAnimItems.forEach(el => eduObserver.observe(el));
  }

  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const navIndicator = document.getElementById('navIndicator');

  const moveIndicator = (targetLink) => {
    if (!navIndicator || !targetLink) return;
    const parentRect = targetLink.parentElement.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.transform = `translateX(${linkRect.left - parentRect.left}px)`;
  };

  const setActiveNav = (targetId) => {
    const targetLink = navLinks.find(link => link.getAttribute('href') === `#${targetId}`);
    if (targetLink && !targetLink.classList.contains('is-active')) {
      navLinks.forEach(l => l.classList.remove('is-active'));
      targetLink.classList.add('is-active');
      moveIndicator(targetLink);
    }
  };

  if (navLinks.length > 0 && navIndicator) {
    navLinks.forEach(l => l.classList.remove('is-active'));
    navLinks[0].classList.add('is-active');
    setTimeout(() => moveIndicator(navLinks[0]), 80);
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (!targetId) return;

        if (targetId === 'home') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setActiveNav('home');
          if (diveTL) {
            diveTL.progress(0);
          }
          resetHeroToInitial();
          return;
        }

        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          setActiveNav(targetId);
        }
      }
    });
  });

  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.is-active') || navLinks[0];
    moveIndicator(active);
    if (typeof updateCoverflow === 'function') {
      updateCoverflow(activeCfIndex);
    }
  });

  const navSectionIds = ['home', 'portofolio', 'tech', 'sertifikat', 'experience', 'pendidikan', 'contact'];

  const handleScrollSpy = () => {
    
    if (window.scrollY < 120) {
      setActiveNav('home');
      if (window.scrollY <= 10) {
        resetHeroToInitial();
      }
      return;
    }

    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 160)) {
      setActiveNav('contact');
      return;
    }

    let activeId = 'home';
    const triggerLine = window.innerHeight * 0.35;

    for (let i = 0; i < navSectionIds.length; i++) {
      const secId = navSectionIds[i];
      const secEl = document.getElementById(secId);
      if (secEl) {
        const rect = secEl.getBoundingClientRect();
        if (rect.top <= triggerLine && rect.bottom > triggerLine) {
          activeId = secId;
          break;
        } else if (rect.top <= triggerLine) {
          activeId = secId;
        }
      }
    }

    setActiveNav(activeId);
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  const armorWrapper = document.getElementById('armorRevealWrapper');
  const armorCard = document.getElementById('armorRevealCard');

  if (armorWrapper && armorCard) {
    let isSwapped = false;

    let armorAmbientFloat = null;
    if (window.gsap) {
      armorAmbientFloat = gsap.to(armorWrapper, {
        y: -7,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    armorWrapper.addEventListener('mouseenter', () => {
      if (armorAmbientFloat) armorAmbientFloat.pause();
      if (window.gsap) {
        gsap.to(armorWrapper, { y: 0, duration: 0.3, ease: 'power2.out' });
      }
    });

    armorWrapper.addEventListener('mousemove', (e) => {
      armorWrapper.classList.add('is-active');
      const rect = armorCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      armorCard.style.setProperty('--mouse-x', `${x}px`);
      armorCard.style.setProperty('--mouse-y', `${y}px`);
      armorCard.style.setProperty('--spotlight-radius', '125px');

      const rotX = (-((y - rect.height / 2) / (rect.height / 2)) * 10).toFixed(2);
      const rotY = (((x - rect.width / 2) / (rect.width / 2)) * 10).toFixed(2);
      armorCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.025, 1.025, 1.025)`;
    });

    armorWrapper.addEventListener('mouseleave', () => {
      armorWrapper.classList.remove('is-active');
      armorCard.style.setProperty('--spotlight-radius', '0px');
      armorCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (armorAmbientFloat) armorAmbientFloat.resume();
    });

    armorWrapper.addEventListener('touchmove', (e) => {
      if (!e.touches || !e.touches[0]) return;
      armorWrapper.classList.add('is-active');
      const rect = armorCard.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      armorCard.style.setProperty('--mouse-x', `${x}px`);
      armorCard.style.setProperty('--mouse-y', `${y}px`);
      armorCard.style.setProperty('--spotlight-radius', '125px');
    }, { passive: true });

    armorWrapper.addEventListener('touchend', () => {
      armorWrapper.classList.remove('is-active');
      armorCard.style.setProperty('--spotlight-radius', '0px');
    });

    const handleSwap = () => {
      isSwapped = !isSwapped;
      armorCard.classList.toggle('is-swapped', isSwapped);

      if (window.gsap) {
        gsap.timeline()
          .to(armorCard, { scale: 0.92, duration: 0.12, ease: 'power2.in' })
          .to(armorCard, { scale: 1.06, duration: 0.2, ease: 'back.out(2)' })
          .to(armorCard, { scale: 1, duration: 0.15, ease: 'power2.out' });

        const pulse = document.createElement('div');
        pulse.className = 'armor-swap-pulse';
        armorCard.appendChild(pulse);
        gsap.fromTo(pulse, 
          { scale: 0.3, opacity: 0.85 }, 
          { scale: 2.2, opacity: 0, duration: 0.65, ease: 'power2.out', onComplete: () => pulse.remove() }
        );
      }

      if (window.showToast) {
        window.showToast(isSwapped ? 'Swapped: Mode Wajah Aktif 👤' : 'Swapped: Mode Armor Aktif ⚡');
      }
    };

    armorCard.addEventListener('click', handleSwap);
  }

  document.querySelectorAll('.mini-stat-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      if (window.gsap) {
        gsap.timeline()
          .to(cell, { scale: 0.94, duration: 0.1 })
          .to(cell, { scale: 1.06, duration: 0.18, ease: 'back.out(2)' })
          .to(cell, { scale: 1, duration: 0.15 });
      }
    });
  });

  document.querySelectorAll('.leaf-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (window.gsap) {
        gsap.timeline()
          .to(chip, { scale: 0.88, duration: 0.1 })
          .to(chip, { scale: 1.12, duration: 0.18, ease: 'back.out(2)' })
          .to(chip, { scale: 1, duration: 0.15 });
      }
      const skillName = chip.textContent.trim();
      if (window.showToast) {
        window.showToast(`Keahlian: ${skillName} 🚀`);
      }
    });
  });

  const modalOverlay = document.getElementById('modalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContentArea = document.getElementById('modalContentArea');
  const modalButtons = document.querySelectorAll('.btn-open-modal');

  const modalDetails = {
    'smart-presence': {
      title: 'Smart Presence System (Face Recognition)',
      sub: 'Python • OpenCV • FaceNet • SQLite',
      body: '<p>Sistem presensi mutakhir yang memanfaatkan deep learning face embedding untuk mengenali identitas mahasiswa/karyawan secara nirsentuh dalam waktu di bawah 120 milidetik.</p><ul><li>Model ekstraksi fitur berbasis FaceNet dengan cosine similarity matching.</li><li>Anti-spoofing liveness check untuk menangkal foto atau layar ponsel.</li><li>Penyimpanan presensi real-time terintegrasi ke SQLite dengan log absensi otomatis.</li></ul>'
    },
    'inventory-pos': {
      title: 'Inventory & Point of Sales (POS)',
      sub: 'Python • PyQt • SQLite • Data Analysis',
      body: '<p>Aplikasi desktop kasir dan manajemen pergudangan komprehensif untuk UMKM dengan visualisasi grafik penjualan dan barcode scanner otomatis.</p><ul><li>Dashboard analitik laba rugi real-time dengan charting otomatis.</li><li>Peringatan stok minimum dan manajemen faktur supplier terstruktur.</li><li>Export laporan akuntansi ke format PDF & Excel instan.</li></ul>'
    },
    'security-scanner': {
      title: 'Multi-Tool Security Scanner & Audit',
      sub: 'Python • AsyncIO • Sockets • Network Security',
      body: '<p>Toolkit analisis keandalan jaringan berkinerja tinggi untuk mengaudit celah konfigurasi port terbuka, SSL cert expiry, dan header web security.</p><ul><li>Multi-threaded port scanning asynchronous berbasis socket Python.</li><li>Analisis kepatuhan HTTP security headers (CSP, HSTS, X-Frame-Options).</li><li>Output log terperinci siap audit format JSON dan Markdown.</li></ul>'
    },
    'dart-flutter': {
      title: 'Sertifikat: Memulai Pemrograman Dart & Flutter',
      sub: 'Dicoding Indonesia • Verifikasi Kompetensi',
      body: '<p>Sertifikat kelulusan kurikulum resmi Dicoding Indonesia mencakup penguasaan sintaks bahasa Dart, arsitektur Stateless/Stateful Widgets Flutter, asinkronisasi Future & Streams, serta integrasi API eksternal.</p>'
    },
    'javascript': {
      title: 'Sertifikat: Belajar Dasar Pemrograman JavaScript',
      sub: 'Dicoding Indonesia • Verifikasi Kompetensi',
      body: '<p>Sertifikasi penguasaan fondasi JavaScript ES6+, Functional Programming, OOP Prototype, penanganan asinkron dengan Promise & Async/Await, dan modularisasi Node.js modern.</p>'
    },
    'database': {
      title: 'Kredensial: Basis Data & Arsitektur Sistem Informasi',
      sub: 'Universitas Pamulang • Fakultas Ilmu Komputer',
      body: '<p>Pencapaian akademik unggulan dalam perancangan basis data relasional: normalisasi 1NF hingga 3NF, ERD kompleks, agregasi SQL tingkat lanjut, indexing, dan transaksi ACID.</p>'
    }
  };

  modalButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modalKey = btn.getAttribute('data-modal');
      const data = modalDetails[modalKey] || {
        title: 'Detail Informasi',
        sub: 'Portofolio Rhafadarma Nakaula',
        body: '<p>Informasi detail untuk item ini sedang disiapkan.</p>'
      };

      if (modalContentArea) {
        modalContentArea.innerHTML = `
          <h3>${data.title}</h3>
          <div class="modal-sub">${data.sub}</div>
          ${data.body}
        `;
      }

      if (modalOverlay) {
        modalOverlay.classList.add('is-active');
      }
    });
  });

  const closeModal = () => {
    if (modalOverlay) modalOverlay.classList.remove('is-active');
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  const toast = document.getElementById('toastPopup');
  const toastMessage = document.getElementById('toastMessage');

  window.showToast = (msg) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  };

  document.querySelectorAll('.btn-copy-contact').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-copy') || 'rhafadarmanakaula@gmail.com';
      navigator.clipboard.writeText(val).then(() => {
        window.showToast(`Berhasil disalin: ${val}`);
      });
    });
  });

  const setupMagnetic = (selector, strength = 0.25) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      const handleMove = (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        if (window.gsap) {
          gsap.to(el, {
            x: deltaX,
            y: deltaY,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      };

      const handleLeave = () => {
        if (window.gsap) {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.65,
            ease: 'elastic.out(1.1, 0.35)',
            overwrite: 'auto'
          });
        }
      };

      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseleave', handleLeave);
    });
  };

  setupMagnetic('.btn-glass-primary', 0.22);
  setupMagnetic('.btn-glass-secondary', 0.22);
  setupMagnetic('.cf-nav-btn', 0.35);
  setupMagnetic('.contact-pill-card', 0.15);

  const setupTiltAndShine = (selector) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cards = document.querySelectorAll(selector);

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = -((y - centerY) / centerY) * 4.5;
        const tiltY = ((x - centerX) / centerX) * 4.5;

        card.style.setProperty('--shine-x', `${x}px`);
        card.style.setProperty('--shine-y', `${y}px`);
        card.style.setProperty('--shine-opacity', '1');

        if (window.gsap) {
          gsap.to(card, {
            rotateX: tiltX,
            rotateY: tiltY,
            duration: 0.25,
            ease: 'power1.out',
            transformPerspective: 900,
            overwrite: 'auto'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--shine-opacity', '0');
        if (window.gsap) {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    });
  };

  setupTiltAndShine('.exp-card');
  setupTiltAndShine('.cert-empty-card');
  setupTiltAndShine('.about-clean-content');

  const addClickRipple = (selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'glass-click-ripple';
        const size = Math.max(rect.width, rect.height) * 1.5;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  };

  addClickRipple('.btn-glass-primary');
  addClickRipple('.btn-glass-secondary');
  addClickRipple('.contact-pill-card');
  addClickRipple('.cf-nav-btn');

  const ensureVisibility = () => {
    document.querySelectorAll('.exp-card, .contact-pill-card, .section-header-box, .social-contact-grid, .exp-grid').forEach((el) => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  };
  ensureVisibility();
  window.addEventListener('resize', ensureVisibility);
});
