// ==============================
//  سیستم آب واقعی برای دکمه‌ها (نسخه اصلاح شده)
// ==============================

class WaterButton {
  constructor(button) {
    this.button = button;
    this.canvas = button.querySelector('.water-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.width = 0;
    this.height = 0;
    this.level = 0.58;
    this.targetLevel = 0.58;
    this.velocity = 0;
    this.ripples = [];
    this.particles = [];
    this.lastPointer = null;
    this.time = 0;
    this.isHovering = false;

    this.resize();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const rect = this.button.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  addRipple(x, strength = 1) {
    this.ripples.push({ x, age: 0, strength });
    if (this.ripples.length > 14) this.ripples.shift();
  }

  splash(x) {
    for (let i = 0; i < 14; i++) {
      this.particles.push({
        x,
        y: this.height * (1 - this.level),
        vx: (Math.random() - 0.5) * 5.5,
        vy: -Math.random() * 6 - 2,
        life: 1,
        radius: Math.random() * 3 + 1
      });
    }
    this.addRipple(x, 2.6);
  }

  bindEvents() {
    // حرکت موس
    this.button.addEventListener('pointermove', (e) => {
      if (!this.isHovering) return;

      const rect = this.button.getBoundingClientRect();
      const x = e.clientX - rect.left;

      if (this.lastPointer !== null) {
        const speed = Math.abs(x - this.lastPointer);
        if (speed > 1.5) {
          this.addRipple(x, Math.min(speed / 9, 2.2));
          this.velocity += (Math.random() - 0.5) * speed * 0.0012;
        }
      }
      this.lastPointer = x;
    });

    // ورود موس
    this.button.addEventListener('pointerenter', (e) => {
      this.isHovering = true;
      this.lastPointer = null; // ریست مهم

      const rect = this.button.getBoundingClientRect();
      this.addRipple(e.clientX - rect.left, 1.6);
    });

    // خروج موس
    this.button.addEventListener('pointerleave', () => {
      this.isHovering = false;
      this.lastPointer = null;
    });

    // کلیک
    this.button.addEventListener('pointerdown', (e) => {
      const rect = this.button.getBoundingClientRect();
      this.splash(e.clientX - rect.left);
    });

    // بعد از کلیک هم وضعیت را تمیز نگه می‌داریم
    this.button.addEventListener('pointerup', () => {
      this.lastPointer = null;
    });

    window.addEventListener('resize', () => this.resize());
  }

  waveY(x) {
    let y = this.height * (1 - this.level);

    y += Math.sin(x * 0.035 + this.time * 0.002) * 2.8;
    y += Math.sin(x * 0.018 - this.time * 0.0015) * 1.8;

    this.ripples.forEach(r => {
      const distance = x - r.x;
      const attenuation = Math.exp(-r.age * 0.042);
      y += Math.sin(distance * 0.11 - r.age * 0.17)
        * Math.exp(-Math.abs(distance) * 0.024)
        * r.strength * attenuation * 9.5;
    });

    return y;
  }

  drawWater() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, this.waveY(0));

    for (let x = 0; x <= this.width; x += 2) {
      ctx.lineTo(x, this.waveY(x));
    }

    ctx.lineTo(this.width, this.height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, this.height * (1 - this.level), 0, this.height);
    gradient.addColorStop(0, "rgba(145,225,255,0.85)");
    gradient.addColorStop(0.15, "rgba(30,155,235,0.88)");
    gradient.addColorStop(0.55, "rgba(0,105,195,0.95)");
    gradient.addColorStop(1, "rgba(0,55,120,1)");

    ctx.fillStyle = gradient;
    ctx.fill();

    // خط درخشان سطح آب
    ctx.save();
    ctx.beginPath();
    for (let x = 0; x <= this.width; x += 2) {
      const y = this.waveY(x);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(230,250,255,0.8)";
    ctx.lineWidth = 1.8;
    ctx.shadowColor = "#8ee8ff";
    ctx.shadowBlur = 7;
    ctx.stroke();
    ctx.restore();
  }

  updateParticles() {
    this.particles = this.particles.filter(p => p.life > 0);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.16;
      p.life -= 0.02;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(190,240,255,${p.life})`;
      this.ctx.shadowColor = "#80dfff";
      this.ctx.shadowBlur = 6;
      this.ctx.fill();
    });
    this.ctx.shadowBlur = 0;
  }

  animate() {
    this.time = performance.now();

    const difference = this.targetLevel - this.level;
    this.velocity += difference * 0.012;
    this.velocity *= 0.94;
    this.level += this.velocity;

    this.ripples.forEach(r => r.age++);
    this.ripples = this.ripples.filter(r => r.age < 95);

    this.drawWater();
    this.updateParticles();

    requestAnimationFrame(() => this.animate());
  }
}

// راه‌اندازی همه دکمه‌های آب
document.querySelectorAll('.btn-liquid').forEach(btn => {
  new WaterButton(btn);
});

// دکمه مقایسه
document.querySelectorAll('.compare').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
      btn.textContent = '＋';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.style.background = '';
    } else {
      btn.classList.add('active');
      btn.textContent = '✓';
      btn.style.borderColor = '#22d3ee';
      btn.style.color = '#022c22';
      btn.style.background = '#22d3ee';
    }
  });
});