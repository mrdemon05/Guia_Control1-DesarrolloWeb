// ========== DATOS Y PROGRESO ==========
const STORAGE_KEY = 'dw1_study_progress';
let progress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  answered: 0, correct: 0, byTopic: {}, hard: [], bestScore: 0
};

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  updateUI();
}

function updateUI() {
  const pct = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : 0;
  document.getElementById('statCorrectas').textContent = progress.correct;
  document.getElementById('statPorcentaje').textContent = pct + '%';
  document.getElementById('globalProgress').style.width = pct + '%';
}

// ========== NAVEGACIÓN ==========
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showSection(btn.dataset.section);
  });
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'guia') renderTopics();
  if (id === 'repaso') renderRepaso();
  if (id === 'progreso') renderProgress();
  if (id === 'flashcards') initFlashcards();
}

// ========== TEMAS (extraídos fielmente de los PDFs) ==========
const topics = [
  {
    id: 'listas',
    title: 'Listas en HTML',
    icon: '📋',
    summary: 'Listas desordenadas (<ul>), ordenadas (<ol>) y anidadas.',
    content: `
      <h3>Listas desordenadas – &lt;ul&gt;</h3>
      <p>La etiqueta <code>&lt;ul&gt;</code> crea una lista no numerada. Cada ítem va dentro de <code>&lt;li&gt;</code>.</p>
      <div class="code-block">&lt;ul&gt;
  &lt;li&gt;Elemento 1&lt;/li&gt;
  &lt;li&gt;Elemento 2&lt;/li&gt;
&lt;/ul&gt;</div>
      <h3>Listas ordenadas – &lt;ol&gt;</h3>
      <p>Igual que <ul> pero con numeración automática.</p>
      <div class="code-block">&lt;ol&gt;
  &lt;li&gt;Primer elemento&lt;/li&gt;
  &lt;li&gt;Segundo elemento&lt;/li&gt;
&lt;/ol&gt;</div>
      <h3>Listas anidadas</h3>
      <p>Una lista puede contener otra lista dentro de un &lt;li&gt;.</p>
      <div class="remember"><strong>Recuerda para el examen:</strong> Siempre cierra &lt;li&gt; antes de abrir otra lista anidada. El navegador muestra viñetas diferentes en los niveles.</div>
    `
  },
  {
    id: 'tablas',
    title: 'Tablas en HTML',
    icon: '📊',
    summary: 'Estructura completa de tablas + colspan/rowspan + thead/tbody/tfoot.',
    content: `
      <h3>Estructura básica</h3>
      <div class="code-block">&lt;table&gt;
  &lt;caption&gt;Título de la tabla&lt;/caption&gt;
  &lt;tr&gt;
    &lt;th&gt;Encabezado&lt;/th&gt;
    &lt;td&gt;Celda&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</div>
      <h3>colspan y rowspan</h3>
      <p><code>colspan="2"</code> → la celda ocupa 2 columnas.<br>
      <code>rowspan="2"</code> → la celda ocupa 2 filas.</p>
      <h3>thead / tbody / tfoot</h3>
      <p>Permiten estructurar la tabla independientemente del orden en el código. El navegador las coloca correctamente.</p>
      <div class="remember"><strong>Recuerda:</strong> &lt;th&gt; es encabezado (negrita + centrado por defecto). &lt;td&gt; es celda de datos.</div>
    `
  },
  {
    id: 'css-intro',
    title: 'Introducción a CSS',
    icon: '🎨',
    summary: 'Qué es CSS, sintaxis de reglas y las 3 formas de incluirlo.',
    content: `
      <h3>Sintaxis de una regla</h3>
      <div class="code-block">selector {
  propiedad: valor;
}</div>
      <p>Ejemplo del material:</p>
      <div class="code-block">footer {
  background-color: black;
  color: white;
}</div>
      <h3>Formas de incluir CSS</h3>
      <ol>
        <li><strong>&lt;style&gt;</strong> dentro de &lt;head&gt; (para estilos específicos de una página).</li>
        <li><strong>Archivo externo</strong> con &lt;link rel="stylesheet" href="estilos.css"&gt; (la más recomendada).</li>
        <li><strong>Inline</strong> con atributo style="..." (evitar salvo casos muy puntuales).</li>
      </ol>
      <div class="remember"><strong>Recuerda:</strong> El método externo es el preferido porque permite reutilizar y mantener un solo archivo.</div>
    `
  },
  {
    id: 'selectores-basicos',
    title: 'Selectores CSS Básicos',
    icon: '🎯',
    summary: 'Universal, etiqueta, clase e ID.',
    content: `
      <ul>
        <li><code>*</code> → todos los elementos</li>
        <li><code>p</code> → todos los párrafos</li>
        <li><code>.destacado</code> → elementos con class="destacado"</li>
        <li><code>#especial</code> → el único elemento con id="especial"</li>
        <li><code>p.destacado</code> → solo párrafos que tengan esa clase</li>
      </ul>
      <div class="remember"><strong>Diferencia clave:</strong> class se puede repetir, id debe ser único en toda la página.</div>
    `
  },
  {
    id: 'selectores-avanzados',
    title: 'Selectores Avanzados',
    icon: '⚡',
    summary: 'Descendiente, hijo, adyacente, atributos y CSS3.',
    content: `
      <table style="width:100%; border-collapse:collapse; margin:1rem 0;">
        <tr><td style="padding:4px; border:1px solid #334155;"><code>div p</code></td><td style="padding:4px; border:1px solid #334155;">Descendiente (cualquier profundidad)</td></tr>
        <tr><td style="padding:4px; border:1px solid #334155;"><code>div > p</code></td><td style="padding:4px; border:1px solid #334155;">Hijo directo</td></tr>
        <tr><td style="padding:4px; border:1px solid #334155;"><code>h1 + p</code></td><td style="padding:4px; border:1px solid #334155;">Adyacente (hermano inmediato)</td></tr>
        <tr><td style="padding:4px; border:1px solid #334155;"><code>h1 ~ p</code></td><td style="padding:4px; border:1px solid #334155;">Hermano general (cualquier hermano posterior)</td></tr>
        <tr><td style="padding:4px; border:1px solid #334155;"><code>a[href]</code></td><td style="padding:4px; border:1px solid #334155;">Tiene el atributo</td></tr>
        <tr><td style="padding:4px; border:1px solid #334155;"><code>a[href$=".html"]</code></td><td style="padding:4px; border:1px solid #334155;">Termina con .html</td></tr>
      </table>
      <div class="remember"><strong>No confundas:</strong> espacio = descendiente, > = hijo directo, + = adyacente inmediato.</div>
    `
  },
  {
    id: 'box-model',
    title: 'Modelo de Caja',
    icon: '📦',
    summary: 'Content, padding, border, margin + width/height + box-sizing.',
    content: `
      <p>Todo elemento HTML es una caja con 4 capas:</p>
      <ol>
        <li><strong>Content</strong> – el contenido real</li>
        <li><strong>Padding</strong> – espacio interior (transparente, muestra el fondo del elemento)</li>
        <li><strong>Border</strong> – el borde</li>
        <li><strong>Margin</strong> – espacio exterior (transparente, muestra el fondo del padre)</li>
      </ol>
      <p>La anchura total en pantalla = width + padding-left + padding-right + border-left + border-right + margin-left + margin-right.</p>
      <div class="code-block">div {
  width: 300px;
  padding: 50px;
  border: 10px solid black;
  margin: 30px;
  /* anchura total = 480px */
}</div>
      <p><code>box-sizing: border-box;</code> hace que width incluya padding y border.</p>
      <div class="remember"><strong>Recuerda:</strong> Los márgenes verticales se fusionan (el mayor gana). Padding y border no se fusionan.</div>
    `
  },
  {
    id: 'fondos-colores',
    title: 'Colores y Fondos',
    icon: '🌈',
    summary: 'Keywords, hex, rgba + background-* + shorthand.',
    content: `
      <h3>Colores</h3>
      <ul>
        <li>Keywords: red, blue, black...</li>
        <li>Hex: #4762B0</li>
        <li>RGBA: rgba(71, 98, 176, 0.6)</li>
      </ul>
      <h3>Fondos</h3>
      <div class="code-block">body {
  background: #222d2d url(imagen.gif) repeat-x 0 0;
}</div>
      <p>Propiedades individuales: background-color, background-image, background-repeat (repeat | repeat-x | no-repeat), background-position, background-attachment (scroll | fixed), background-size (cover | contain).</p>
    `
  },
  {
    id: 'tipografia',
    title: 'Tipografía',
    icon: '🔤',
    summary: 'color, font-family, font-size e herencia.',
    content: `
      <div class="code-block">body {
  font-family: Arial, Helvetica, sans-serif;
  color: #333;
}
h1 { font-size: 20px; }</div>
      <p>Siempre termina la lista de font-family con una familia genérica (sans-serif, serif, monospace).</p>
      <div class="remember"><strong>Herencia:</strong> color y font-family se heredan a los hijos. width, margin y padding no se heredan.</div>
    `
  }
];

function renderTopics() {
  const grid = document.getElementById('topicsGrid');
  grid.innerHTML = topics.map(t => `
    <div class="topic-card" onclick="showTopic('${t.id}')">
      <h3>${t.icon} ${t.title}</h3>
      <p>${t.summary}</p>
    </div>
  `).join('');
  document.getElementById('topicDetail').classList.add('hidden');
}

function showTopic(id) {
  const t = topics.find(x => x.id === id);
  const detail = document.getElementById('topicDetail');
  detail.classList.remove('hidden');
  detail.innerHTML = `
    <button class="btn-mode" onclick="renderTopics()">← Volver</button>
    <h3>${t.icon} ${t.title}</h3>
    ${t.content}
    <div style="margin-top:1.5rem;">
      <button class="btn-primary" onclick="startTopicQuiz('${id}')">Mini-preguntas de este tema</button>
    </div>
  `;
}

// ========== BANCO DE PREGUNTAS (todas basadas en los PDFs) ==========
const questions = [
  // LISTAS
  { id:1, topic:'listas', level:'facil', type:'mc', q:'¿Qué etiqueta se usa para una lista desordenada?', options:['<ol>','<ul>','<li>','<list>'], correct:1, explain:'<ul> = Unordered List. <ol> es ordenada. <li> es el ítem de ambas.' },
  { id:2, topic:'listas', level:'medio', type:'mc', q:'¿Se pueden anidar listas?', options:['No','Sí, poniendo otra <ul> o <ol> dentro de un <li>','Solo listas ordenadas','Solo con CSS'], correct:1, explain:'El material muestra claramente listas anidadas dentro de <li>.' },
  { id:3, topic:'listas', level:'facil', type:'code', q:'¿Qué produce este código?', code:'<ol>\n  <li>Uno</li>\n  <li>Dos</li>\n</ol>', options:['Lista con viñetas','Lista numerada 1. 2.','Una tabla','Nada'], correct:1, explain:'<ol> genera numeración automática.' },

  // TABLAS
  { id:4, topic:'tablas', level:'facil', type:'mc', q:'¿Qué etiqueta crea una celda de encabezado?', options:['<td>','<th>','<tr>','<caption>'], correct:1, explain:'<th> = table header (negrita y centrado por defecto). <td> es celda de datos.' },
  { id:5, topic:'tablas', level:'medio', type:'mc', q:'¿Para qué sirve colspan="2"?', options:['La celda ocupa 2 filas','La celda ocupa 2 columnas','Añade 2 bordes','Centra el texto'], correct:1, explain:'colspan expande horizontalmente (columnas). rowspan expande verticalmente (filas).' },
  { id:6, topic:'tablas', level:'medio', type:'code', q:'¿Qué elemento falta para dar título a la tabla?', code:'<table>\n  <tr><th>Nombre</th></tr>\n</table>', options:['<title>','<caption>','<header>','<thead>'], correct:1, explain:'<caption> coloca un título descriptivo corto a la tabla.' },
  { id:7, topic:'tablas', level:'dificil', type:'mc', q:'¿Cuál es la diferencia principal entre <thead> y <th>?', options:['Ninguna','<thead> agrupa filas de encabezado; <th> es una celda de encabezado','<th> solo se usa en tbody','<thead> es obligatorio'], correct:1, explain:'<thead> es un contenedor de filas. <th> es la celda individual.' },

  // CSS INTRO
  { id:8, topic:'css-intro', level:'facil', type:'mc', q:'¿Cuál es la forma más recomendada de incluir CSS?', options:['Inline style','<style> en el head','Archivo externo con <link>','@import dentro del body'], correct:2, explain:'El material indica que el archivo externo es la más utilizada y recomendable porque permite reutilizar y mantener un solo archivo.' },
  { id:9, topic:'css-intro', level:'facil', type:'code', q:'¿Qué hace esta regla?', code:'footer {\n  background-color: black;\n  color: white;\n}', options:['Cambia el color del texto del footer a negro','Pone fondo negro y texto blanco al footer','No hace nada','Solo funciona en Chrome'], correct:1, explain:'Ejemplo directo del material de Clase 3.' },
  { id:10, topic:'css-intro', level:'medio', type:'mc', q:'¿Dónde se coloca la etiqueta <style>?', options:['Dentro de <body>','Solo dentro de <head>','En cualquier sitio','Después de </html>'], correct:1, explain:'El material dice explícitamente: “solamente se pueden incluir en la cabecera del documento (sólo dentro de la sección <head>).”' },

  // SELECTORES BÁSICOS
  { id:11, topic:'selectores-basicos', level:'facil', type:'mc', q:'¿Qué selector selecciona TODOS los elementos?', options:['#all','.all','*','body *'], correct:2, explain:'El selector universal es el asterisco (*).' },
  { id:12, topic:'selectores-basicos', level:'medio', type:'mc', q:'¿Cuál es la diferencia entre .clase y #id?', options:['Ninguna','class se puede repetir, id debe ser único','id se puede repetir','Ambos son iguales'], correct:1, explain:'El material enfatiza: id debe ser único; class puede compartirse.' },
  { id:13, topic:'selectores-basicos', level:'medio', type:'code', q:'¿A qué elementos afecta p.destacado?', code:'p.destacado { color: red; }', options:['Todos los p','Todos los .destacado','Solo los <p> que tengan class="destacado"','Ninguno'], correct:2, explain:'Combinación de selector de etiqueta + clase = más específico.' },

  // SELECTORES AVANZADOS
  { id:14, topic:'selectores-avanzados', level:'medio', type:'mc', q:'¿Qué selecciona div > p?', options:['Cualquier p dentro de div','Solo los p hijos directos de div','El primer p después de div','Todos los div y todos los p'], correct:1, explain:'> es selector de hijo directo. El espacio (div p) selecciona cualquier profundidad.' },
  { id:15, topic:'selectores-avanzados', level:'dificil', type:'mc', q:'¿Qué diferencia hay entre h1 + p y h1 ~ p?', options:['Ninguna','+ es adyacente inmediato; ~ es cualquier hermano posterior','~ es hijo','+ es descendiente'], correct:1, explain:'+ exige que estén uno inmediatamente después del otro. ~ selecciona todos los hermanos posteriores.' },
  { id:16, topic:'selectores-avanzados', level:'medio', type:'code', q:'¿Qué selecciona a[href$=".html"]?', code:'a[href$=".html"] { color: blue; }', options:['Enlaces que empiezan con .html','Enlaces que contienen .html','Enlaces cuyo href termina exactamente en .html','Todos los enlaces'], correct:2, explain:'$= significa “termina con” (CSS3).' },

  // BOX MODEL
  { id:17, topic:'box-model', level:'facil', type:'mc', q:'¿Cuáles son las 4 partes del modelo de caja?', options:['margin, border, padding, content','width, height, color, font','top, right, bottom, left','display, position, float, clear'], correct:0, explain:'Content → Padding → Border → Margin (del interior al exterior).' },
  { id:18, topic:'box-model', level:'medio', type:'mc', q:'Si un div tiene width:300px + padding:50px + border:10px + margin:30px, ¿cuál es la anchura total en pantalla (modelo clásico)?', options:['300px','480px','390px','360px'], correct:1, explain:'30+10+50+300+50+10+30 = 480px (ejemplo exacto del material).' },
  { id:19, topic:'box-model', level:'medio', type:'mc', q:'¿Qué hace box-sizing: border-box?', options:['Añade borde automático','Incluye padding y border dentro del width','Elimina el margin','Cambia el color del borde'], correct:1, explain:'Con border-box el width ya incluye padding + border, por lo que el elemento no crece.' },
  { id:20, topic:'box-model', level:'dificil', type:'mc', q:'¿Qué ocurre con los márgenes verticales adyacentes?', options:['Se suman','Se fusionan y gana el mayor','Se eliminan','Se multiplican'], correct:1, explain:'Fusión de márgenes (margin collapse): el mayor de los dos prevalece.' },

  // COLORES Y FONDOS
  { id:21, topic:'fondos-colores', level:'facil', type:'mc', q:'¿Cuál es el método de color más usado en sitios reales según el material?', options:['Keywords','RGB porcentual','Hexadecimal (#rrggbb)','Nombres del sistema'], correct:2, explain:'El material dice que el hexadecimal es el más utilizado con mucha diferencia.' },
  { id:22, topic:'fondos-colores', level:'medio', type:'code', q:'¿Qué hace background-repeat: no-repeat?', code:'body { background-image: url(fondo.png); background-repeat: no-repeat; }', options:['Repite la imagen','No repite la imagen','Solo repite en X','Fija la imagen'], correct:1, explain:'no-repeat evita que la imagen se repita.' },

  // TIPOGRAFÍA
  { id:23, topic:'tipografia', level:'facil', type:'mc', q:'¿Por qué se pone sans-serif al final de font-family?', options:['Es obligatorio','Es una familia genérica de respaldo si las anteriores no están instaladas','Cambia el color','Aumenta el tamaño'], correct:1, explain:'Si el usuario no tiene Arial ni Helvetica, el navegador usa la sans-serif del sistema.' },
  { id:24, topic:'tipografia', level:'medio', type:'mc', q:'¿Qué propiedades se heredan normalmente?', options:['width y height','color y font-family','margin y padding','border'], correct:1, explain:'color y font-family se heredan. width, margin y padding no.' },

  // MÁS PREGUNTAS DE RECONOCIMIENTO
  { id:25, topic:'selectores-avanzados', level:'dificil', type:'code', q:'¿Qué elementos selecciona este selector?', code:'div.aviso span.especial', options:['Todos los span','Solo span.especial dentro de div.aviso','Todos los div.aviso','Cualquier span dentro de cualquier div'], correct:1, explain:'Combinación de clase + descendiente + clase.' },
  { id:26, topic:'box-model', level:'medio', type:'mc', q:'¿Qué unidad es relativa al tamaño de fuente del elemento raíz (html)?', options:['em','rem','px','%'], correct:1, explain:'rem = root em. em es relativo al elemento actual.' },
  { id:27, topic:'tablas', level:'facil', type:'mc', q:'¿Qué etiqueta agrupa el cuerpo de datos de una tabla?', options:['<thead>','<tbody>','<tfoot>','<caption>'], correct:1, explain:'tbody recoge los datos del cuerpo.' },
  { id:28, topic:'css-intro', level:'medio', type:'mc', q:'¿Cómo se escriben los comentarios en CSS?', options:['<!-- comentario -->','// comentario','/* comentario */','# comentario'], correct:2, explain:'/* ... */. Los de HTML son <!-- --> y no deben confundirse.' },
  { id:29, topic:'selectores-basicos', level:'facil', type:'code', q:'¿Qué tipo de selector es #lateral?', code:'#lateral { width: 200px; }', options:['Clase','ID','Etiqueta','Universal'], correct:1, explain:'# indica selector de ID.' },
  { id:30, topic:'box-model', level:'dificil', type:'mc', q:'Si no se especifica border-style en un shorthand, ¿qué pasa?', options:['Se pone solid','Se pone medium','El borde no se muestra (style = none)','Se pone dotted'], correct:2, explain:'Valor por defecto de border-style es none. Si no se indica estilo, no hay borde visible.' }
];

// Añadir más preguntas generadas a partir de los mismos conceptos (variaciones)
function generateMoreQuestions() {
  // Se pueden añadir dinámicamente, pero con las 30 anteriores ya hay variedad suficiente para los exámenes.
}
generateMoreQuestions();

// ========== LÓGICA DE QUIZ ==========
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let userAnswers = [];
let examMode = '';
let simTimerEnabled = false;
let simTimerInterval = null;
const SIM_TIME_PER_Q = 60;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startDetecta(tipo) {
  let pool = questions.filter(q => q.type === 'code' || q.type === 'mc');
  if (tipo === 'error') pool = questions.filter(q => q.q.toLowerCase().includes('error') || q.q.includes('falta'));
  currentQuestions = shuffle(pool).slice(0, 8);
  currentIndex = 0; score = 0; userAnswers = [];
  document.getElementById('detectaArea').classList.remove('hidden');
  renderQuestion('detectaArea');
}

function startExam(mode) {
  examMode = mode;
  let pool = [...questions];
  if (mode === 'codigo') pool = pool.filter(q => q.type === 'code');
  if (mode === 'teoria') pool = pool.filter(q => q.type === 'mc');
  if (mode === 'rapido') currentQuestions = shuffle(pool).slice(0, 10);
  else if (mode === 'completo') currentQuestions = shuffle(pool).slice(0, 25);
  else currentQuestions = shuffle(pool).slice(0, 15);
  currentIndex = 0; score = 0; userAnswers = [];
  document.getElementById('examArea').classList.remove('hidden');
  renderQuestion('examArea');
}

function startTopicQuiz(topicId) {
  currentQuestions = shuffle(questions.filter(q => q.topic === topicId)).slice(0, 5);
  currentIndex = 0; score = 0; userAnswers = [];
  const area = document.getElementById('topicDetail');
  area.innerHTML += '<div id="topicQuizArea" class="quiz-area"></div>';
  renderQuestion('topicQuizArea');
}

function renderQuestion(containerId) {
  const container = document.getElementById(containerId);
  if (currentIndex >= currentQuestions.length) {
    showResults(containerId);
    return;
  }
  const q = currentQuestions[currentIndex];
  const opts = shuffle([...q.options]);
  const correctText = q.options[q.correct];

  const showTimer = containerId === 'simArea' && simTimerEnabled;

  container.innerHTML = `
    <div class="question-box">
      <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
        <span>Pregunta ${currentIndex + 1} / ${currentQuestions.length}</span>
        <span class="level-${q.level}">${q.level === 'facil' ? '🟢 Fácil' : q.level === 'medio' ? '🟡 Medio' : '🔴 Difícil'}</span>
      </div>
      ${showTimer ? `<div class="timer-row"><div class="timer-bar"><div class="timer-fill" id="timerFill"></div></div><span id="timerText">${SIM_TIME_PER_Q}s</span></div>` : ''}
      <h3>${q.q}</h3>
      ${q.code ? `<div class="code-snippet">${escapeHtml(q.code)}</div>` : ''}
      <div class="options" id="opts">
        ${opts.map((o,i) => `<button class="option" onclick="answer('${escapeJsString(o)}', '${escapeJsString(correctText)}', ${containerId === 'simArea'})">${escapeHtml(o)}</button>`).join('')}
      </div>
      <div id="feedback" class="feedback hidden"></div>
      <button id="nextBtn" class="btn-primary hidden" style="margin-top:1rem;" onclick="nextQ('${containerId}')">Siguiente</button>
    </div>
  `;

  if (showTimer) startQuestionTimer();
}

function startQuestionTimer() {
  clearInterval(simTimerInterval);
  let timeLeft = SIM_TIME_PER_Q;
  const fill = document.getElementById('timerFill');
  const text = document.getElementById('timerText');
  simTimerInterval = setInterval(() => {
    timeLeft--;
    if (text) text.textContent = timeLeft + 's';
    if (fill) {
      fill.style.width = (timeLeft / SIM_TIME_PER_Q * 100) + '%';
      fill.classList.toggle('warning', timeLeft <= SIM_TIME_PER_Q * 0.5 && timeLeft > SIM_TIME_PER_Q * 0.2);
      fill.classList.toggle('danger', timeLeft <= SIM_TIME_PER_Q * 0.2);
    }
    if (timeLeft <= 0) {
      clearInterval(simTimerInterval);
      const q = currentQuestions[currentIndex];
      answer('', q.options[q.correct], true);
    }
  }, 1000);
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escapeJsString(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function answer(selected, correct, isSim) {
  clearInterval(simTimerInterval);
  const opts = document.querySelectorAll('.option');
  opts.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
    else if (btn.textContent === selected && selected !== correct) btn.classList.add('wrong');
  });

  const isCorrect = selected === correct;
  if (isCorrect) score++;
  userAnswers.push({ q: currentQuestions[currentIndex], selected, isCorrect });

  // Guardar progreso
  progress.answered++;
  if (isCorrect) progress.correct++;
  const topic = currentQuestions[currentIndex].topic;
  if (!progress.byTopic[topic]) progress.byTopic[topic] = { a:0, c:0 };
  progress.byTopic[topic].a++;
  if (isCorrect) progress.byTopic[topic].c++;
  saveProgress();

  if (!isSim) {
    const fb = document.getElementById('feedback');
    fb.classList.remove('hidden');
    fb.className = 'feedback ' + (isCorrect ? 'correct' : 'wrong');
    fb.innerHTML = isCorrect
      ? `<strong>✅ Correcto</strong><br>${currentQuestions[currentIndex].explain}`
      : `<strong>❌ Incorrecto</strong><br>Respuesta correcta: <strong>${correct}</strong><br><br>¿Por qué?<br>${currentQuestions[currentIndex].explain}`;
    document.getElementById('nextBtn').classList.remove('hidden');
  } else {
    // En simulación no mostramos feedback inmediato
    setTimeout(() => nextQ('simArea'), 600);
  }
}

function nextQ(containerId) {
  currentIndex++;
  renderQuestion(containerId);
}

function showResults(containerId) {
  clearInterval(simTimerInterval);
  const container = document.getElementById(containerId);
  const pct = Math.round((score / currentQuestions.length) * 100);
  if (pct > progress.bestScore) progress.bestScore = pct;
  saveProgress();

  const wrong = userAnswers.filter(a => !a.isCorrect);
  container.innerHTML = `
    <div class="score-box">
      <div class="big">${score}/${currentQuestions.length}</div>
      <p>${pct}%</p>
      <p>Mejor puntuación histórica: ${progress.bestScore}%</p>
      ${wrong.length ? `<button class="btn-primary" onclick="retryWrong()">Repasar solo los errores (${wrong.length})</button>` : '<p>¡Perfecto! Sin errores.</p>'}
      <button class="btn-mode" style="margin-top:1rem;" onclick="location.reload()">Volver al inicio</button>
    </div>
    <div style="margin-top:2rem;">
      <h3>Revisión</h3>
      ${userAnswers.map((a,i) => `
        <div style="margin:1rem 0;padding:1rem;background:#1e293b;border-radius:8px;border-left:4px solid ${a.isCorrect ? 'var(--success)' : 'var(--error)'}">
          <strong>${i+1}. ${a.q.q}</strong><br>
          Tu respuesta: ${a.selected} ${a.isCorrect ? '✅' : '❌'}<br>
          ${!a.isCorrect ? `Correcta: ${a.q.options[a.q.correct]}<br>${a.q.explain}` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function retryWrong() {
  currentQuestions = userAnswers.filter(a => !a.isCorrect).map(a => a.q);
  currentIndex = 0; score = 0; userAnswers = [];
  renderQuestion(document.querySelector('.quiz-area:not(.hidden)').id);
}

// ========== SIMULACIÓN ==========
function startSimulacion() {
  const num = parseInt(document.getElementById('simNum').value) || 15;
  simTimerEnabled = document.getElementById('simTimer').checked;
  currentQuestions = shuffle(questions).slice(0, num);
  currentIndex = 0; score = 0; userAnswers = [];
  document.getElementById('simConfig').classList.add('hidden');
  document.getElementById('simArea').classList.remove('hidden');
  renderQuestion('simArea');
}

// ========== FLASHCARDS ==========
const cards = [
  { front: '¿Qué etiqueta crea una lista desordenada?', back: '<ul> (Unordered List)' },
  { front: '¿Qué hace colspan="2"?', back: 'La celda ocupa 2 columnas' },
  { front: '¿Cuál es el selector de ID?', back: '#nombre (debe ser único)' },
  { front: '¿Qué es el modelo de caja?', back: 'content + padding + border + margin' },
  { front: '¿Qué hace box-sizing: border-box?', back: 'width incluye padding y border' },
  { front: 'Diferencia entre div p y div > p', back: 'espacio = cualquier descendiente\n> = solo hijo directo' },
  { front: '¿Cómo se escribe un comentario en CSS?', back: '/* comentario */' },
  { front: 'Forma más recomendada de incluir CSS', back: 'Archivo externo con <link rel="stylesheet">' },
  { front: '¿Qué significa a[href$=".html"]?', back: 'Enlaces cuyo href termina en .html' },
  { front: '¿Qué se hereda: color o width?', back: 'color (y font-family) se heredan. width no.' }
];
let cardIndex = 0;
let flipped = false;

function initFlashcards() {
  cardIndex = 0; flipped = false;
  showCard();
}
function showCard() {
  document.getElementById('cardFront').textContent = cards[cardIndex].front;
  document.getElementById('cardBack').textContent = cards[cardIndex].back;
  document.getElementById('flashcard').classList.remove('flipped');
  flipped = false;
}
function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
  flipped = !flipped;
}
function nextCard() { cardIndex = (cardIndex + 1) % cards.length; showCard(); }
function prevCard() { cardIndex = (cardIndex - 1 + cards.length) % cards.length; showCard(); }
function shuffleCards() { cards.sort(() => Math.random() - 0.5); cardIndex = 0; showCard(); }
function markHard() {
  if (!progress.hard.includes(cards[cardIndex].front)) {
    progress.hard.push(cards[cardIndex].front);
    saveProgress();
    alert('Marcada como difícil');
  }
}

// ========== REPASO RÁPIDO ==========
function renderRepaso() {
  document.getElementById('repasoContent').innerHTML = topics.map(t => `
    <div class="topic-card" style="margin-bottom:1rem;">
      <h3>${t.icon} ${t.title}</h3>
      <div class="remember">Debes saber / reconocer: ${t.summary}</div>
      <button class="btn-mode" onclick="startTopicQuiz('${t.id}')">5 preguntas rápidas</button>
    </div>
  `).join('');
}

// ========== PROGRESO Y DEBILIDADES ==========
function renderProgress() {
  const byTopic = progress.byTopic;
  let html = `<p>Preguntas respondidas: <strong>${progress.answered}</strong> | Acertadas: <strong>${progress.correct}</strong> | Mejor score: <strong>${progress.bestScore}%</strong></p>`;
  html += '<h3 style="margin-top:1.5rem;">Por tema</h3>';
  if (Object.keys(byTopic).length === 0) {
    html += '<p>Aún no has respondido preguntas. ¡Empieza a practicar!</p>';
  } else {
    html += Object.entries(byTopic).map(([topic, data]) => {
      const pct = Math.round((data.c / data.a) * 100);
      return `<div style="margin:0.5rem 0;"><strong>${topic}</strong>: ${pct}% (${data.c}/${data.a})</div>`;
    }).join('');
    // Debilidades
    const weak = Object.entries(byTopic).filter(([_,d]) => (d.c/d.a) < 0.7).map(([t]) => t);
    if (weak.length) {
      html += `<div class="remember" style="margin-top:1.5rem;"><strong>Tu principal dificultad parece estar en:</strong> ${weak.join(', ')}. Repasa esos temas.</div>`;
    }
  }
  if (progress.hard.length) {
    html += '<h3 style="margin-top:1.5rem;">Marcadas como difíciles</h3><ul>' + progress.hard.map(h => `<li>${h}</li>`).join('') + '</ul>';
  }
  document.getElementById('progressContent').innerHTML = html;
}

// Inicio
document.getElementById('statTemas').textContent = topics.length;
document.getElementById('statPreguntas').textContent = questions.length;
updateUI();
showSection('inicio');
