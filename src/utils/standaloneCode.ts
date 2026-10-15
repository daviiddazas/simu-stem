/**
 * Código fuente autónomo en un único archivo HTML/CSS/JS
 * Listo para ejecutarse en cualquier navegador web moderno sin dependencias externas.
 */

export const STANDALONE_SIMULATION_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulación Ambiental · Colegio Orlando Fals Borda</title>
  <style>
    :root {
      --bg-main: #FBF9F5;
      --bg-surface: #FFFFFF;
      --bg-panel: #F5F0E8;
      --border: #E8E1D5;
      --text-primary: #2D3732;
      --text-secondary: #66746D;
      --accent: #6E8E79;
      --accent-hover: #5B7965;
      --chart-line: #6E8E79;
      --overflow-color: #D27979;
      --canvas-ground: #EFE9DF;
      --canvas-wall: #E4DDD0;
      --canvas-path: #F7F4EE;
    }

    [data-theme="termico"] {
      --bg-main: #F8F6F9;
      --bg-surface: #FFFFFF;
      --bg-panel: #F0EAF5;
      --border: #E2D9EA;
      --text-primary: #34293D;
      --text-secondary: #6E6179;
      --accent: #957DAD;
      --accent-hover: #7E6396;
      --chart-line: #D27979;
      --overflow-color: #D27979;
      --canvas-ground: #EFE7F2;
      --canvas-wall: #E2D5E8;
      --canvas-path: #FAF6FC;
    }

    [data-theme="ecologico"] {
      --bg-main: #F4F7F4;
      --bg-surface: #FFFFFF;
      --bg-panel: #E8EFE8;
      --border: #D4E2D5;
      --text-primary: #22382C;
      --text-secondary: #546E5F;
      --accent: #548268;
      --accent-hover: #426953;
      --chart-line: #548268;
      --overflow-color: #C48161;
      --canvas-ground: #E3ECE4;
      --canvas-wall: #D1DFD3;
      --canvas-path: #F2F7F3;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      background-color: var(--bg-main);
      color: var(--text-primary);
      line-height: 1.5;
      padding: 20px;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 16px;
    }

    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 6px;
      background-color: var(--bg-panel);
      color: var(--accent);
      margin-bottom: 6px;
    }

    h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--text-secondary);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Button grids */
    .button-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 8px;
      margin-bottom: 12px;
    }

    button.btn-select {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 12px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    button.btn-select:hover {
      border-color: var(--accent);
    }

    button.btn-select.active {
      background: var(--bg-panel);
      border-color: var(--accent);
      font-weight: 600;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .canvas-wrap {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--bg-surface);
    }

    canvas {
      display: block;
      width: 100%;
      height: auto;
    }

    /* Controls bar */
    .playback-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }

    .btn-action {
      background: var(--accent);
      color: #FFFFFF;
      border: none;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-action:hover {
      opacity: 0.9;
    }

    .time-slider {
      flex: 1;
      min-width: 180px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
      margin-top: 14px;
    }

    .metric-card {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      padding: 10px 12px;
      border-radius: 12px;
    }

    .metric-label {
      font-size: 10px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-value {
      font-size: 16px;
      font-weight: 700;
      font-family: monospace;
      margin-top: 2px;
    }

    .intervention-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 8px;
    }

    .checkbox-card {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 10px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--bg-surface);
      font-size: 11px;
      cursor: pointer;
    }

    .checkbox-card input {
      margin-top: 2px;
      cursor: pointer;
    }
  </style>
</head>
<body data-theme="dia">
  <div class="container">
    <header>
      <span class="badge">Laboratorio Ambiental · Ciencia y Acción Participativa (IAP)</span>
      <h1>EcoLab Fals Borda · ¿Podemos Evitar el Colapso de Basuras?</h1>
      <p class="subtitle">Ponte en los zapatos de un científico ambiental: interactúa con los valores, analiza los picos de saturación dS/dt y activa soluciones.</p>
    </header>

    <!-- Panel de Botones: Selección de Ambiente -->
    <div class="card">
      <div class="section-title">Puntos Críticos del Colegio Fals Borda</div>
      <div class="button-group" id="envButtons">
        <button class="btn-select active" onclick="setEnvironment('entrada')">
          <strong>Entrada Principal</strong><br>
          <span style="font-size:10px; opacity:0.8;">Hora Pico (6:15 - 7:00 / 12:15 - 13:00)</span>
        </button>
        <button class="btn-select" onclick="setEnvironment('cafeteria')">
          <strong>Cafetería y Comercios</strong><br>
          <span style="font-size:10px; opacity:0.8;">Alto empaque desechable y puestos de comida</span>
        </button>
        <button class="btn-select" onclick="setEnvironment('parqueadero')">
          <strong>Parqueadero Periférico</strong><br>
          <span style="font-size:10px; opacity:0.8;">Baja vigilancia y acumulación dispersa</span>
        </button>
      </div>

      <div class="section-title" style="margin-top:14px;">Modo de Visualización</div>
      <div class="button-group" id="themeButtons">
        <button class="btn-select active" onclick="setTheme('dia')">
          <strong>Modo Día Suave</strong><br>
          <span style="font-size:10px; opacity:0.8;">Crema, lino y verde salvia</span>
        </button>
        <button class="btn-select" onclick="setTheme('termico')">
          <strong>Análisis Térmico Suave</strong><br>
          <span style="font-size:10px; opacity:0.8;">Pastel melocotón, lavanda y calor</span>
        </button>
        <button class="btn-select" onclick="setTheme('ecologico')">
          <strong>Modo Ecológico</strong><br>
          <span style="font-size:10px; opacity:0.8;">Eucalipto, arcilla y tierra vegetal</span>
        </button>
      </div>
    </div>

    <!-- Canvas de Simulación -->
    <div class="card">
      <div class="canvas-wrap">
        <canvas id="simCanvas" width="900" height="360"></canvas>
      </div>

      <!-- Barra de tiempo y reproducción -->
      <div class="playback-bar">
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn-action" id="playBtn" onclick="togglePlay()">Pausar Simulación</button>
          <button class="btn-select" style="padding:6px 12px;" onclick="resetTime()">06:00 AM</button>
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex:1; max-width:480px;">
          <span style="font-size:11px; font-weight:600;">Hora:</span>
          <input type="range" id="timeRange" class="time-slider" min="6" max="18" step="0.1" value="6" oninput="onTimeInput(this.value)">
          <span id="timeDisplay" style="font-family:monospace; font-weight:700; font-size:13px; min-width:65px;">06:00 AM</span>
        </div>
      </div>

      <!-- Métricas en tiempo real -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Peatones en Tránsito</div>
          <div class="metric-value" id="valPedestrians">0 est/h</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Tasa dS/dt (Ingreso)</div>
          <div class="metric-value" id="valRate">0.0 kg/h</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Llenado Contenedor</div>
          <div class="metric-value" id="valSaturation">0.0%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">En Suelo (Desborde)</div>
          <div class="metric-value" id="valOverflow" style="color:var(--overflow-color);">0.0 kg</div>
        </div>
      </div>
    </div>

    <!-- Intervenciones activables -->
    <div class="card">
      <div class="section-title">3. Intervenciones de Mitigación (What-If)</div>
      <div class="intervention-grid">
        <label class="checkbox-card">
          <input type="checkbox" id="chkCollection" checked onchange="updateCalculations()">
          <span><strong>Ruta Sincronizada UAESP (13:15):</strong> Vaciado en cambio de jornada escolar.</span>
        </label>
        <label class="checkbox-card">
          <input type="checkbox" id="chkIslands" checked onchange="updateCalculations()">
          <span><strong>Puntos Ecológicos (Res. 2184):</strong> Separación de 3 fracciones aprovechables.</span>
        </label>
        <label class="checkbox-card">
          <input type="checkbox" id="chkStalls" onchange="updateCalculations()">
          <span><strong>Pacto con Vendedores:</strong> Sustitución de icopor y canastillas propias.</span>
        </label>
        <label class="checkbox-card">
          <input type="checkbox" id="chkBrigade" onchange="updateCalculations()">
          <span><strong>Brigada IAP Fals Borda:</strong> Vigilancia y educación estudiantil en horas pico.</span>
        </label>
      </div>
    </div>
  </div>

  <script>
    // Variables de estado del modelo matemático
    let currentEnv = 'entrada';
    let currentTheme = 'dia';
    let currentHour = 6.0;
    let isPlaying = true;
    let animId = null;

    const envConfigs = {
      entrada: { name: 'Entrada Principal', basePed: 1100, stalls: 4, bins: 3, binCapacityKg: 97.2, risk: 0.4 },
      cafeteria: { name: 'Cafetería & Comercio', basePed: 850, stalls: 7, bins: 2, binCapacityKg: 64.8, risk: 0.55 },
      parqueadero: { name: 'Parqueadero Periférico', basePed: 320, stalls: 1, bins: 2, binCapacityKg: 64.8, risk: 0.65 }
    };

    function setEnvironment(env) {
      currentEnv = env;
      document.querySelectorAll('#envButtons button').forEach((btn, idx) => {
        btn.classList.toggle('active', (idx === 0 && env === 'entrada') || (idx === 1 && env === 'cafeteria') || (idx === 2 && env === 'parqueadero'));
      });
      updateCalculations();
    }

    function setTheme(th) {
      currentTheme = th;
      document.body.setAttribute('data-theme', th);
      document.querySelectorAll('#themeButtons button').forEach((btn, idx) => {
        btn.classList.toggle('active', (idx === 0 && th === 'dia') || (idx === 1 && th === 'termico') || (idx === 2 && th === 'ecologico'));
      });
    }

    function togglePlay() {
      isPlaying = !isPlaying;
      document.getElementById('playBtn').textContent = isPlaying ? 'Pausar Simulación' : 'Reanudar Simulación';
    }

    function resetTime() {
      currentHour = 6.0;
      document.getElementById('timeRange').value = 6;
      updateCalculations();
    }

    function onTimeInput(val) {
      currentHour = parseFloat(val);
      updateCalculations();
    }

    function gaussian(x, mu, sigma, A) {
      return A * Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
    }

    function calculateState(t) {
      const cfg = envConfigs[currentEnv];
      let ped = 0;
      if (currentEnv === 'entrada') {
        ped = gaussian(t, 6.75, 0.45, 950) + gaussian(t, 12.35, 0.55, 1100) + gaussian(t, 17.5, 0.45, 750) + 40;
      } else if (currentEnv === 'cafeteria') {
        ped = gaussian(t, 9.75, 0.4, 650) + gaussian(t, 12.5, 0.65, 880) + gaussian(t, 15.35, 0.4, 520) + 25;
      } else {
        ped = gaussian(t, 6.8, 0.5, 280) + gaussian(t, 17.2, 0.5, 320) + 15;
      }

      // Tasa Rin(t)
      let rate = (ped * 0.032) + (cfg.stalls * 0.45 * gaussian(t, 12.3, 2.0, 1.0));
      
      // Mitigaciones
      const hasIslands = document.getElementById('chkIslands').checked;
      const hasStalls = document.getElementById('chkStalls').checked;
      const hasBrigade = document.getElementById('chkBrigade').checked;
      const hasSync = document.getElementById('chkCollection').checked;

      let mitigation = 1.0;
      if (hasIslands) mitigation -= 0.3;
      if (hasStalls) mitigation -= 0.2;
      if (hasBrigade) mitigation -= 0.15;
      rate *= Math.max(0.35, mitigation);

      // Integración numérica acumulada desde 6:00 hasta t
      let accumulatedBin = 0;
      let accumulatedOverflow = 0;
      const dt = 0.1;
      const collectHour = hasSync ? 13.25 : 22.0;

      for (let tau = 6.0; tau <= t; tau += dt) {
        let subPed = (currentEnv === 'entrada')
          ? gaussian(tau, 6.75, 0.45, 950) + gaussian(tau, 12.35, 0.55, 1100) + gaussian(tau, 17.5, 0.45, 750) + 40
          : gaussian(tau, 12.5, 0.65, 880) + 30;
        let subRate = ((subPed * 0.032) + (cfg.stalls * 0.45 * gaussian(tau, 12.3, 2.0, 1.0))) * Math.max(0.35, mitigation);
        let delta = subRate * dt;

        if (Math.abs(tau - collectHour) < dt / 1.8) {
          accumulatedBin = 0;
          accumulatedOverflow *= 0.2;
        }

        let capEff = accumulatedBin < cfg.binCapacityKg * 0.8 ? 0.95 : (accumulatedBin < cfg.binCapacityKg ? 0.4 : 0.0);
        let toBin = delta * capEff;
        let toGround = delta * (1 - capEff);

        if (accumulatedBin + toBin <= cfg.binCapacityKg) {
          accumulatedBin += toBin;
          accumulatedOverflow += toGround;
        } else {
          let room = Math.max(0, cfg.binCapacityKg - accumulatedBin);
          accumulatedBin = cfg.binCapacityKg;
          accumulatedOverflow += toGround + (toBin - room);
        }
      }

      return {
        ped: Math.round(ped),
        rate: rate.toFixed(1),
        binKg: accumulatedBin.toFixed(1),
        satPct: Math.min(100, (accumulatedBin / cfg.binCapacityKg) * 100).toFixed(1),
        overflowKg: accumulatedOverflow.toFixed(1)
      };
    }

    function updateCalculations() {
      const state = calculateState(currentHour);
      document.getElementById('valPedestrians').textContent = state.ped + ' est/h';
      document.getElementById('valRate').textContent = state.rate + ' kg/h';
      document.getElementById('valSaturation').textContent = state.satPct + '%';
      document.getElementById('valOverflow').textContent = state.overflowKg + ' kg';

      const h = Math.floor(currentHour);
      const m = Math.round((currentHour - h) * 60);
      document.getElementById('timeDisplay').textContent = 
        h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + (h < 12 ? ' AM' : ' PM');
    }

    // Dibujo en el lienzo Canvas
    const canvas = document.getElementById('simCanvas');
    const ctx = canvas.getContext('2d');

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const state = calculateState(currentHour);

      // Limpiar fondo con tonalidad según tema
      ctx.fillStyle = currentTheme === 'termico' ? '#EFE7F2' : currentTheme === 'ecologico' ? '#E3ECE4' : '#EFE9DF';
      ctx.fillRect(0, 0, w, h);

      // Cerros suaves al fondo
      ctx.fillStyle = currentTheme === 'termico' ? '#E2D5E8' : currentTheme === 'ecologico' ? '#D1DFD3' : '#E4DDD0';
      ctx.beginPath();
      ctx.moveTo(0, 150);
      ctx.bezierCurveTo(200, 80, 450, 130, 600, 90);
      ctx.bezierCurveTo(750, 60, 820, 110, w, 120);
      ctx.lineTo(w, 160);
      ctx.lineTo(0, 160);
      ctx.fill();

      // Edificio escolar
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#D8D0C5';
      ctx.fillRect(80, 50, 480, 110);
      ctx.strokeRect(80, 50, 480, 110);

      // Ventanales
      ctx.fillStyle = '#F4EDE4';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(110 + i * 85, 70, 50, 36);
        ctx.strokeRect(110 + i * 85, 70, 50, 36);
      }

      // Rótulo
      ctx.fillStyle = currentTheme === 'termico' ? '#957DAD' : '#548268';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('COLEGIO ORLANDO FALS BORDA I.E.D. · ' + envConfigs[currentEnv].name.toUpperCase(), 110, 65);

      // Acera peatonal
      ctx.fillStyle = '#F8F4EE';
      ctx.fillRect(0, 160, w, 80);
      ctx.strokeRect(0, 160, w, 80);

      // Calzada
      ctx.fillStyle = '#E8E2D8';
      ctx.fillRect(0, 240, w, 120);

      // Mapa térmico suave si es modo térmico
      if (currentTheme === 'termico' && parseFloat(state.satPct) > 30) {
        const radGrad = ctx.createRadialGradient(480, 210, 5, 480, 210, 140);
        radGrad.addColorStop(0, 'rgba(216, 125, 103, 0.45)');
        radGrad.addColorStop(0.6, 'rgba(235, 178, 155, 0.2)');
        radGrad.addColorStop(1, 'rgba(240, 234, 245, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(480, 210, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // Contenedores físicos
      const fillFrac = parseFloat(state.satPct) / 100;
      for (let b = 0; b < envConfigs[currentEnv].bins; b++) {
        const bx = 420 + b * 40;
        const by = 180;
        ctx.fillStyle = b === 0 ? '#6E8E79' : b === 1 ? '#C8C4B7' : '#3D4540';
        ctx.fillRect(bx, by, 28, 44);
        ctx.strokeRect(bx, by, 28, 44);

        // Nivel de llenado
        ctx.fillStyle = currentTheme === 'termico' ? '#D27979' : '#548268';
        const fillH = 40 * fillFrac;
        ctx.fillRect(bx + 2, by + 42 - fillH, 24, fillH);

        // Tapa
        ctx.fillStyle = '#2F3632';
        ctx.fillRect(bx - 3, by - 4, 34, 6);
      }

      // Basura en el suelo si hay desborde
      const overKg = parseFloat(state.overflowKg);
      if (overKg > 0.1) {
        ctx.fillStyle = '#D27979';
        for (let l = 0; l < Math.min(30, overKg * 4); l++) {
          ctx.beginPath();
          ctx.arc(460 + Math.sin(l * 1.5) * 50, 226 + Math.cos(l * 2) * 14, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('▲ Desborde en acera: ' + state.overflowKg + ' kg', 410, 256);
      }

      // Puestos de comercio informal
      for (let s = 0; s < Math.min(4, envConfigs[currentEnv].stalls); s++) {
        const sx = 580 + s * 70;
        ctx.fillStyle = s % 2 === 0 ? '#E8B4A2' : '#C7D9C9';
        ctx.fillRect(sx, 180, 48, 22);
        ctx.fillStyle = '#F4EDE4';
        ctx.fillRect(sx + 4, 202, 40, 22);
      }
    }

    function loop() {
      if (isPlaying) {
        currentHour += 0.04;
        if (currentHour > 18.0) currentHour = 6.0;
        document.getElementById('timeRange').value = currentHour;
        updateCalculations();
      }
      draw();
      requestAnimationFrame(loop);
    }

    updateCalculations();
    loop();
  </script>
</body>
</html>`;
