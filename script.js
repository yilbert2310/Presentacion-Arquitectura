const slides = Array.from(document.querySelectorAll('.slide'));
const dots = Array.from(document.querySelectorAll('.rail .dot'));
const counter = document.getElementById('counter');
const bar = document.getElementById('bar');

function go(n) {
  if (typeof window.goSlide === 'function') {
    window.goSlide(n);
    return;
  }
  if (!slides.length) return;
  window.curSlide = Math.max(0, Math.min(slides.length - 1, Number(n) || 0));
  slides.forEach((s, i) => {
    const active = i === window.curSlide;
    s.classList.toggle('active', active);
    s.hidden = !active;
    s.style.setProperty('display', active ? 'flex' : 'none', 'important');
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === window.curSlide));
  if (counter) {
    counter.textContent = String(window.curSlide + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  }
  if (bar) {
    bar.style.width = (((window.curSlide + 1) / slides.length) * 100) + '%';
  }
}

dots.forEach((d, idx) => {
  d.onclick = () => go(d.dataset.go !== undefined ? Number(d.dataset.go) : idx);
});

const prevBtn = document.getElementById('prev-btn');
if (prevBtn) prevBtn.onclick = () => go((window.curSlide || 0) - 1);

const nextBtn = document.getElementById('next-btn');
if (nextBtn) nextBtn.onclick = () => go((window.curSlide || 0) + 1);

document.getElementById('full')?.addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});

document.addEventListener('keydown', (e) => {
  const cur = window.curSlide || 0;
  if (cur === 1 && ['1', '2', '3'].includes(e.key)) {
    document.querySelectorAll('.choice')[Number(e.key) - 1]?.click();
  }
  if (cur === 4 && ['1', '2', '3'].includes(e.key)) {
    document.querySelectorAll('[data-alu]')[Number(e.key) - 1]?.click();
  }
});

const lvlData = [
  [
    '1. Arquitectura del Conjunto de Instrucciones (ISA)',
    'Define los atributos del procesador visibles al programador de bajo nivel o compilador: repertorio de instrucciones, tipos de datos, registros direccionables y modos de acceso a memoria.',
    '¿Qué operaciones reconoce el CPU?<br>Ej: Instrucción ADD R1, R2 y su efecto sobre el registro destino.'
  ],
  [
    '2. Organización o Microarquitectura (Stallings, 2004)',
    'Especifica cómo se interconectan funcionalmente las unidades operativas internas (banco de registros, ALU, buses internos, multiplexores y unidad de control) para materializar la arquitectura.',
    '¿Cómo se implementan las instrucciones?<br>Ej: Camino de datos de bus interno único con registros Y y T.'
  ],
  [
    '3. Diseño Lógico (Morris Mano, 1994, 2005)',
    'Define los circuitos digitales combinacionales y secuenciales junto con las ecuaciones booleanas que construyen físicamente cada bloque de la organización.',
    '¿Qué circuitos materializan la microarquitectura?<br>Ej: Sumadores completos (FA), MUX 4:1 y biestables tipo D.'
  ]
];

document.querySelectorAll('.choice').forEach((c) => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.choice').forEach((x) => x.classList.remove('selected'));
    c.classList.add('selected');
    const d = lvlData[Number(c.dataset.lvl)];
    const spot = document.getElementById('lvl-spot');
    if (spot && d) {
      spot.innerHTML = `
        <div>
          <h4>${d[0]}</h4>
          <p>${d[1]}</p>
        </div>
        <div class="feature-meta">
          <small>PREGUNTA Y EJEMPLO CLAVE</small>
          <strong>${d[2]}</strong>
        </div>
      `;
    }
  });
});

const stageData = [
  [
    'Etapa 1 · F (Fetch / Búsqueda)',
    'El procesador obtiene la próxima instrucción desde la memoria RAM usando la dirección contenida en el Contador de Programa (PC), la carga en el registro IR e incrementa automáticamente el PC.',
    'MAR ← PC · MBR ← M[MAR]<br>IR ← MBR · PC ← PC + 1'
  ],
  [
    'Etapa 2 · D (Decode / Decodificación)',
    'La Unidad de Control decodifica el código de operación (Opcode) alojado en el registro IR, identifica los registros fuente/destino y prepara las señales de control del camino de datos.',
    'Decodificación de IR en Unidad de Control<br>Lectura de registros fuente (R1, R2)'
  ],
  [
    'Etapa 3 · EX (Execute / Ejecución en la ALU)',
    'La Unidad Aritmético-Lógica (ALU) procesa los operandos según las líneas de selección S2, S1, S0 y Cin, generando el resultado F y actualizando las banderas de estado (Z, C, N, V).',
    'Y ← R1 · T ← Y + R2<br>Actualización de Flags (Z, C, N, V)'
  ],
  [
    'Etapa 4 · MEM (Memory Access / Acceso a Datos)',
    'Fase utilizada por instrucciones de carga o almacenamiento (LOAD / STORE) para leer o escribir palabras de datos en la memoria principal a través de MAR y MBR.',
    'MAR ← Dirección Efectiva<br>MBR ← M[MAR]  o  M[MAR] ← MBR'
  ],
  [
    'Etapa 5 · WB (Write Back / Escritura de Resultado)',
    'El resultado final calculado por la ALU (retenido en el registro temporal T) o el dato leído de la memoria se almacena definitivamente en el registro destino.',
    'R1 ← T  (o  AC ← Resultado)<br>Fin del ciclo de la instrucción'
  ]
];

document.querySelectorAll('.stage-btn').forEach((b) => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.stage-btn').forEach((x) => x.classList.remove('active-stage'));
    b.classList.add('active-stage');
    const d = stageData[Number(b.dataset.st)];
    const spot = document.getElementById('stage-spot');
    if (spot && d) {
      spot.innerHTML = `
        <div>
          <h4>${d[0]}</h4>
          <p>${d[1]}</p>
        </div>
        <div class="feature-meta">
          <small>REGISTROS Y MICROOPERACIÓN</small>
          <strong>${d[2]}</strong>
        </div>
      `;
    }
  });
});

const aluInfo = {
  opA: [
    'Operando A (Entrada Directa de n bits)',
    'Representa la primera palabra binaria de entrada (proveniente de un registro de uso general, del registro temporal <code>Y</code> o del Acumulador <code>AC</code>).',
    'Sus <i>n</i> líneas de bits ingresan de manera directa y simultánea tanto a los Sumadores Completos del circuito aritmético como a las compuertas del circuito lógico.',
    'Entrada directa: A = A_{n-1} ... A_1 A_0<br>Conecta en paralelo con etapa Aritmética y Lógica'
  ],
  opB: [
    'Operando B (Entrada a Multiplexor Y)',
    'Representa el segundo operando binario de <i>n</i> bits (proveniente del banco de registros o del Registro de Datos <code>DR/MBR</code>).',
    'En el circuito aritmético pasa por un <b>MUX 4:1</b> controlado por <code>S1, S0</code> que permite seleccionar entre <code>0</code>, <code>B</code>, <code>NOT(B)</code> o <code>1</code> para realizar sumas, restas, incrementos o decrementos.',
    'Y = 0 (S1S0=00) · Y = B (S1S0=01)<br>Y = NOT B (S1S0=10) · Y = 1111 (S1S0=11)'
  ],
  arith: [
    '1. Circuito Aritmético (Modo S2 = 0)',
    'Se construye encadenando <b>Sumadores Completos (Full Adders)</b> en paralelo. Delante de la entrada B de cada sumador se ubica un <b>Multiplexor 4 a 1</b> gobernado por <code>S1</code> y <code>S0</code> que elige entre <code>0</code>, <code>B</code>, <code>NOT(B)</code> o <code>1</code>.',
    'Al combinarse con el acarreo de entrada <code>Cin</code>, el mismo circuito sumador ejecuta 8 microoperaciones aritméticas, incluyendo la resta mediante suma en <b>complemento a dos</b>.',
    'Ecuación General: D = A + Y + Cin<br>Resta: A - B = A + NOT(B) + 1'
  ],
  logic: [
    '2. Circuito Lógico (Modo S2 = 1)',
    'Opera de forma paralela e independiente para cada posición de bit <i>i</i> sin propagación de acarreos entre etapas vecinas.',
    'Emplea un arreglo de compuertas básicas (<code>AND, OR, XOR</code> e inversor <code>NOT</code>) conectadas a las entradas A y B, cuyas salidas alimentan un MUX 4 a 1 controlado por <code>S1</code> y <code>S0</code>.',
    'S1S0 = 00 (AND) · 01 (OR)<br>S1S0 = 10 (XOR) · 11 (NOT A)'
  ],
  mux: [
    '3. Etapa de Selección Final (MUX 2:1 · Modo S2)',
    'Un multiplexor de 2 a 1 por cada bit de salida, gobernado por la variable de selección de modo (<code>S2</code>), decide qué circuito entrega su resultado a la salida final <code>F</code> de la ALU.',
    'Con <code>S2 = 0</code> transfiere el resultado de los sumadores completos; con <code>S2 = 1</code> transfiere la salida de las compuertas booleanas.',
    'Si S2 = 0 → Salida Aritmética (8 funciones)<br>Si S2 = 1 → Salida Lógica (4 funciones)'
  ],
  outF: [
    'Salida F + Banderas de Estado (Z, C, N, V)',
    'Entrega la palabra resultante de <i>n</i> bits (<code>F</code>) hacia el bus de retorno o registro temporal de salida <code>T</code>, recuerda que la ALU es combinacional y no almacena datos por sí sola.',
    'Al mismo tiempo, los bits de <code>F</code> y los acarreos finales alimentan las compuertas detectoras que actualizan el Registro de Condición: <b>Zero (Z), Carry (C), Negative (N) y Overflow (V)</b>.',
    'Z = NOR(F) · C = c_n<br>N = F_{n-1} · V = c_{n-1} ⊕ c_n'
  ]
};

document.querySelectorAll('[data-alu]').forEach((n) => {
  n.addEventListener('click', () => {
    document.querySelectorAll('[data-alu]').forEach((x) => x.classList.remove('active'));
    n.classList.add('active');
    const d = aluInfo[n.dataset.alu];
    const panel = document.getElementById('alu-info');
    if (panel && d) {
      panel.innerHTML = `
        <div>
          <h3>${d[0]}</h3>
          <p>${d[1]}</p>
          <p style="margin-top:8px">${d[2]}</p>
        </div>
        <div class="formula">${d[3]}</div>
      `;
    }
  });
});

function selectOpRow(r) {
  if (!r) return;
  document.querySelectorAll('.func-table tbody tr').forEach((x) => x.classList.remove('selected-row'));
  r.classList.add('selected-row');
  const title = document.getElementById('op-card-title');
  const f = document.getElementById('op-card-f');
  const name = document.getElementById('op-card-name');
  const cin = document.getElementById('op-card-cin');
  const y = document.getElementById('op-card-y');
  const desc = document.getElementById('op-card-desc');
  if (title) title.textContent = 'MICROOPERACIÓN · S2S1S0 = ' + r.dataset.code;
  if (f) f.textContent = r.dataset.f;
  if (name) name.textContent = r.dataset.name;
  if (cin) cin.textContent = 'Cin = ' + r.dataset.cin;
  if (y) y.textContent = r.dataset.y;
  if (desc) desc.textContent = r.dataset.desc;
}

document.querySelectorAll('.func-table tbody tr').forEach((r) => {
  r.addEventListener('click', () => selectOpRow(r));
});

document.querySelectorAll('.filter').forEach((f) => {
  f.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((x) => x.classList.remove('active'));
    f.classList.add('active');
    const fam = f.dataset.filter;
    let firstVisible = null;
    document.querySelectorAll('.func-table tbody tr').forEach((r) => {
      const show = fam === 'all' || r.dataset.family === fam;
      r.style.display = show ? '' : 'none';
      if (show && !firstVisible) firstVisible = r;
    });
    if (firstVisible) selectOpRow(firstVisible);
  });
});

const flagData = {
  Z: [
    'Bandera Z · Zero Flag (Indicador de Resultado Cero)',
    'Se activa en <b>1 lógico</b> exclusivamente cuando todos los bits de la palabra de salida F de la ALU son iguales a cero (F = 0000). Si al menos un bit vale 1, la bandera permanece en 0.',
    'Z = NOT(F3 + F2 + F1 + F0)<br>Compuerta NOR de n entradas'
  ],
  C: [
    'Bandera C · Carry Flag (Indicador de Acarreo Final)',
    'Se activa en <b>1 lógico</b> cuando el sumador completo del bit más significativo genera un acarreo de salida (C = cn). Advierte que una operación aritmética con enteros <i>sin signo</i> rebasó los n bits.',
    'C = cn (Acarreo de salida de etapa n-1)<br>Detecta límite en enteros sin signo'
  ],
  N: [
    'Bandera N · Negative / Sign Flag (Indicador de Signo)',
    'Copia directamente el estado del bit más significativo del resultado generado por la ALU (N = Fn-1). En la convención de complemento a dos, <b>0</b> representa positivo y <b>1</b> negativo.',
    'N = Fn-1 (En 4 bits: N = F3)<br>1 = Resultado Negativo · 0 = Positivo'
  ],
  V: [
    'Bandera V · Overflow Flag (Desbordamiento con Signo)',
    'Se activa en <b>1 lógico</b> cuando una operación en complemento a dos excede el rango representable [-2^(n-1), +2^(n-1)-1], ocurriendo cuando se suman dos números de igual signo y el resultado cambia de signo.',
    'V = cn-1 ⊕ cn (Compuerta XOR)<br>Compara acarreo entrante y saliente del signo'
  ]
};

document.querySelectorAll('.flag').forEach((f) => {
  f.addEventListener('click', () => {
    document.querySelectorAll('.flag').forEach((x) => x.classList.remove('active'));
    f.classList.add('active');
    const d = flagData[f.dataset.flag];
    const spot = document.getElementById('flag-spot');
    if (spot && d) {
      spot.innerHTML = `
        <div>
          <h4>${d[0]}</h4>
          <p>${d[1]}</p>
        </div>
        <div class="feature-meta">
          <small>ECUACIÓN Y CIRCUITO DETECTOR</small>
          <strong>${d[2]}</strong>
        </div>
      `;
    }
  });
});

const steps = [
  [
    'Pulso T0 (Fase Fetch) · Microoperación: MAR ← PC',
    'La Unidad de Control activa las señales <code>PCout</code> y <code>MARin</code>. El Contador de Programa coloca la dirección inicial <code>20h</code> en el bus interno único y el registro MAR la captura para direccionar la RAM.',
    'Señales: PCout, MARin<br>Dato en Bus = 20h (00100000₂)',
    '20h',
    '20h',
    '—',
    '—',
    '00000101 (5)',
    '—',
    '—'
  ],
  [
    'Pulso T1 (Fase Fetch) · Solicitar M[MAR]; PC ← PC + 1',
    'Se activan <code>MemRead</code> y <code>PCinc</code>. La interfaz de memoria inicia la lectura en la dirección 20h mientras el Contador de Programa avanza automáticamente a <code>21h</code> usando su incrementador dedicado.',
    'Señales: MemRead, PCinc<br>PC avanza de 20h → 21h',
    '21h',
    '20h',
    'Leyendo RAM...',
    '—',
    '00000101 (5)',
    '—',
    '—'
  ],
  [
    'Pulso T2 (Fase Fetch) · Microoperación: MBR ← M[MAR]',
    'Cuando la memoria RAM confirma la entrega del dato, la señal <code>MBRloadMem</code> carga la palabra de instrucción codificada (<code>ADD R1, R2</code>) desde el bus de datos externo hacia el registro MBR.',
    'Señal: MBRloadMem<br>MBR recibe instrucción ADD R1, R2',
    '21h',
    '20h',
    'ADD R1, R2',
    '—',
    '00000101 (5)',
    '—',
    '—'
  ],
  [
    'Pulso T3 (Fase Fetch) · Microoperación: IR ← MBR',
    'Se activan <code>MBRout</code> e <code>IRin</code>. El contenido del registro de buffer de memoria (MBR) se transfiere a través del bus interno hasta quedar almacenado en el Registro de Instrucción (IR).',
    'Señales: MBRout, IRin<br>Bus Interno = ADD R1, R2',
    '21h',
    '20h',
    'ADD R1, R2',
    'ADD R1, R2',
    '00000101 (5)',
    '—',
    '—'
  ],
  [
    'Pulso T4 (Fase Decode) · Decodificación en Unidad de Control',
    'El decodificador de la Unidad de Control analiza los campos de bits en IR: identifica el código de operación <code>ADD</code>, los registros fuente <code>R1</code> y <code>R2</code>, y el destino <code>R1</code>.',
    'Señal: ControlDecode<br>Opcode = ADD · Fuentes = R1, R2',
    '21h',
    '20h',
    'ADD R1, R2',
    'ADD R1, R2',
    '00000101 (5)',
    '—',
    '—'
  ],
  [
    'Pulso T5 (Fase Execute) · Microoperación: Y ← R1',
    'Se activan <code>R1out</code> y <code>Yin</code>. El primer operando almacenado en R1 (<code>00000101₂ = 5</code>) se coloca en el bus interno único y es capturado en el registro auxiliar de entrada Y de la ALU.',
    'Señales: R1out, Yin<br>Bus = 00000101₂ (5) → Registro Y',
    '21h',
    '20h',
    'ADD R1, R2',
    'ADD R1, R2',
    '00000101 (5)',
    '00000101 (5)',
    '—'
  ],
  [
    'Pulso T6 (Fase Execute) · Microoperación: T ← Y + R2',
    'Se activan <code>R2out, ALU=ADD, Tin, FlagsWrite</code>. R2 (<code>00000011₂ = 3</code>) sale al bus; la ALU suma Y (5) + Bus (3) = <code>00001000₂ (8)</code>, guarda la salida en T y actualiza las banderas.',
    'Señales: R2out, ALU=ADD, Tin<br>ALU: 5 + 3 = 8 · Flags: Z=0,C=0,N=0,V=0',
    '21h',
    '20h',
    'ADD R1, R2',
    'ADD R1, R2',
    '00000101 (5)',
    '00000101 (5)',
    '00001000 (8)'
  ],
  [
    'Pulso T7 (Fase Write Back) · Microoperación: R1 ← T',
    'Se activan <code>Tout</code> y <code>R1in</code>. El resultado almacenado en el registro temporal de salida T (<code>00001000₂ = 8</code>) viaja por el bus interno y actualiza finalmente el registro destino R1.',
    'Señales: Tout, R1in<br>Bus = 00001000₂ (8) → R1 actualizado',
    '21h',
    '20h',
    'ADD R1, R2',
    'ADD R1, R2',
    '00001000 (8)',
    '00000101 (5)',
    '00001000 (8)'
  ]
];

document.querySelectorAll('.step').forEach((s) => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.step').forEach((x) => x.classList.remove('active'));
    s.classList.add('active');
    const d = steps[Number(s.dataset.step)];
    if (!d) return;
    const spot = document.getElementById('step-spot');
    if (spot) {
      spot.innerHTML = `
        <div>
          <h4>${d[0]}</h4>
          <p>${d[1]}</p>
        </div>
        <div class="feature-meta">
          <small>ESTADO DEL BUS INTERNO</small>
          <strong>${d[2]}</strong>
        </div>
      `;
    }
    const rPc = document.getElementById('r-pc');
    const rMar = document.getElementById('r-mar');
    const rMbr = document.getElementById('r-mbr');
    const rIr = document.getElementById('r-ir');
    const rR1 = document.getElementById('r-r1');
    const rY = document.getElementById('r-y');
    const rT = document.getElementById('r-t');
    if (rPc) rPc.textContent = d[3];
    if (rMar) rMar.textContent = d[4];
    if (rMbr) rMbr.textContent = d[5];
    if (rIr) rIr.textContent = d[6];
    if (rR1) rR1.textContent = d[7];
    if (rY) rY.textContent = d[8];
    if (rT) rT.textContent = d[9];
  });
});

const shOps = {
  shl: [
    'Entrada: 0101 (5) → Salida: 1010 (10)',
    'Operación Activa · Desplazamiento Lógico Izquierdo (SHL)',
    'Todos los bits de la palabra se mueven una posición hacia la izquierda e ingresa un 0 lógico por el bit menos significativo, multiplicando por 2 el valor numérico en un solo pulso.',
    'R ← shl R<br>0101₂ (5) → 1010₂ (10)'
  ],
  shr: [
    'Entrada: 0101 (5) → Salida: 0010 (2)',
    'Operación Activa · Desplazamiento Lógico Derecho (SHR)',
    'Desplaza todos los bits una posición hacia la derecha e inserta un 0 lógico en el extremo más significativo, efectuando una división entera entre 2.',
    'R ← shr R<br>0101₂ (5) → 0010₂ (2)'
  ],
  rol: [
    'Entrada: 1001 → Salida: 0011',
    'Operación Activa · Rotación Circular Izquierda (ROL)',
    'El bit más significativo que sale por el extremo izquierdo se reintroduce directamente por el extremo derecho sin pérdida de bits.',
    'R ← cil R<br>1001₂ → 0011₂'
  ]
};

document.querySelectorAll('[data-sh]').forEach((b) => {
  b.addEventListener('click', () => {
    document.querySelectorAll('[data-sh]').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    const d = shOps[b.dataset.sh];
    if (!d) return;
    const disp = document.getElementById('shift-display');
    const spot = document.getElementById('sh-ac-spot');
    if (disp) disp.textContent = d[0];
    if (spot) {
      spot.innerHTML = `
        <div>
          <h4>${d[1]}</h4>
          <p>${d[2]}</p>
        </div>
        <div class="feature-meta">
          <small>EXPRESIÓN RTL</small>
          <strong>${d[3]}</strong>
        </div>
      `;
    }
  });
});

const acOps = {
  add: [
    'AC ← AC + DR  (0111 + 0011 = 1010)',
    'Microoperación en Acumulador · Adición (ADD)',
    'El registro AC entrega un operando a la ALU, se suma con el contenido del Registro de Datos (DR) y el resultado vuelve a capturarse en AC con el pulso del reloj.',
    'AC ← AC + DR<br>Acumulación directa sin bus intermedio'
  ],
  clr: [
    'AC ← 0000  (Puesta a Cero)',
    'Microoperación en Acumulador · Limpiar (CLR)',
    'La señal de control síncrona pone todos los flip-flops del registro acumulador AC en 0 lógico en un ciclo de reloj.',
    'AC ← 0<br>Reinicio inmediato del acumulador'
  ],
  inr: [
    'AC ← AC + 1  (Incremento)',
    'Microoperación en Acumulador · Incrementar (INR)',
    'Incrementa en una unidad el valor binario contenido actualmente en el registro AC, permitiendo utilizarlo como contador.',
    'AC ← AC + 1<br>Incremento síncrono'
  ],
  com: [
    "AC ← AC'  (0101 → 1010)",
    'Microoperación en Acumulador · Complementar (CMA)',
    'Invierte bit a bit el contenido almacenado en el registro acumulador (complemento a uno), base para operaciones de sustracción.',
    'AC ← NOT(AC)<br>Inversión booleana en AC'
  ]
};

document.querySelectorAll('[data-ac]').forEach((b) => {
  b.addEventListener('click', () => {
    document.querySelectorAll('[data-ac]').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    const d = acOps[b.dataset.ac];
    if (!d) return;
    const disp = document.getElementById('ac-display');
    const spot = document.getElementById('sh-ac-spot');
    if (disp) disp.textContent = d[0];
    if (spot) {
      spot.innerHTML = `
        <div>
          <h4>${d[1]}</h4>
          <p>${d[2]}</p>
        </div>
        <div class="feature-meta">
          <small>EXPRESIÓN RTL</small>
          <strong>${d[3]}</strong>
        </div>
      `;
    }
  });
});

const aluCases = [
  {
    title: '1. SUMA ARITMÉTICA · S2S1S0 = 001, Cin = 0',
    ans: 'F = 1010',
    carries: 'Acarreos internos: c0=0 → c1=1 → c2=1 → <b>c3=1</b> → <b>c4=0</b>',
    flags: [
      ['Z = 0', false],
      ['C = 0', false],
      ['N = 1', true],
      ['V = 1', true]
    ],
    exp: '<b>¡Ocurre Overflow con signo (V = c3 ⊕ c4 = 1 ⊕ 0 = 1)!</b> Sin signo 7 + 3 = 10 cabe en 4 bits (C=0), pero en complemento a 2 el máximo positivo es +7; al sumar +7 + 3 da +10 y se desborda hacia el signo negativo (1010 = -6).'
  },
  {
    title: '2. RESTA EN COMPLEMENTO A 2 · S2S1S0 = 010, Cin = 1',
    ans: 'F = 0100',
    carries: 'Operación: 0111 + NOT(0011) + 1 = 0111 + 1100 + 1 → <b>c3=1, c4=1</b>',
    flags: [
      ['Z = 0', false],
      ['C = 1', true],
      ['N = 0', false],
      ['V = 0', false]
    ],
    exp: '<b>Resta exacta (+7 - 3 = +4 → 0100):</b> El acarreo saliente C=1 indica ausencia de préstamo. Como c3=1 y c4=1, el desbordamiento es <code>V = 1 ⊕ 1 = 0</code> (resultado válido con signo).'
  },
  {
    title: '3. SUMA CON ACARREO Y CERO · S2S1S0 = 001, Cin = 0',
    ans: 'F = 0000',
    carries: 'Operación: 1111 (-1) + 0001 (+1) = 1 0000 → <b>c3=1, c4=1</b>',
    flags: [
      ['Z = 1', true],
      ['C = 1', true],
      ['N = 0', false],
      ['V = 0', false]
    ],
    exp: '<b>Activación simultánea de Zero (Z=1) y Carry (C=1):</b> Los 4 bits del resultado quedan en 0000 (activando la compuerta NOR de Z) y el quinto bit sale como acarreo C=1. Con signo (-1 + 1 = 0) no hay overflow (V=0).'
  },
  {
    title: '4. PRODUCTO LÓGICO AND · S2S1S0 = 100, Cin = X',
    ans: 'F = 0011',
    carries: 'Operación bit a bit: 0111 AND 0011 = 0011 (Sin acarreos)',
    flags: [
      ['Z = 0', false],
      ['C = —', false],
      ['N = 0', false],
      ['V = —', false]
    ],
    exp: '<b>Enmascaramiento bit a bit:</b> El circuito lógico conserva en 1 únicamente las posiciones donde tanto A como B valen 1. Actualiza Z=0 y N=0 (C y V no aplican en modo lógico).'
  },
  {
    title: '5. SUMA LÓGICA OR · S2S1S0 = 101, Cin = X',
    ans: 'F = 0111',
    carries: 'Operación bit a bit: 0111 OR 0011 = 0111 (Sin acarreos)',
    flags: [
      ['Z = 0', false],
      ['C = —', false],
      ['N = 0', false],
      ['V = —', false]
    ],
    exp: '<b>Unión lógica bit a bit:</b> Coloca un 1 en cada posición donde al menos uno de los operandos A o B tenga un bit en 1. El resultado es 0111 (Z=0, N=0).'
  },
  {
    title: '6. DISYUNCIÓN EXCLUSIVA XOR · S2S1S0 = 110, Cin = X',
    ans: 'F = 0100',
    carries: 'Operación bit a bit: 0111 XOR 0011 = 0100 (Sin acarreos)',
    flags: [
      ['Z = 0', false],
      ['C = —', false],
      ['N = 0', false],
      ['V = —', false]
    ],
    exp: '<b>Comparación de diferencias:</b> Produce 1 únicamente en las posiciones donde los bits de A y B son distintos (si A y B fueran iguales, daría 0000 y activaría Z=1).'
  },
  {
    title: '7. COMPLEMENTO A UNO (NOT A) · S2S1S0 = 111, Cin = X',
    ans: 'F = 1000',
    carries: 'Inversión directa de A: NOT(0111) = 1000 (Sin acarreos)',
    flags: [
      ['Z = 0', false],
      ['C = —', false],
      ['N = 1', true],
      ['V = —', false]
    ],
    exp: '<b>Inversión bit a bit de A:</b> Invierte todos los bits del operando A (0111 pasa a 1000). Como el bit más significativo F3 queda en 1, se activa la bandera de signo <b>N = 1</b>.'
  ]
];

document.querySelectorAll('.case-row').forEach((r) => {
  r.addEventListener('click', () => {
    document.querySelectorAll('.case-row').forEach((x) => x.classList.remove('active-case'));
    r.classList.add('active-case');
    const c = aluCases[Number(r.dataset.idx)];
    if (!c) return;
    const title = document.getElementById('sim-op-title');
    const ans = document.getElementById('sim-answer');
    const carries = document.getElementById('sim-carries');
    const badges = document.getElementById('sim-badges');
    const exp = document.getElementById('sim-exp');
    if (title) title.textContent = c.title;
    if (ans) ans.textContent = c.ans;
    if (carries) carries.innerHTML = c.carries;
    if (badges) {
      badges.innerHTML = c.flags
        .map((f) => `<div class="f-badge ${f[1] ? 'on' : ''}">${f[0]}</div>`)
        .join('');
    }
    if (exp) exp.innerHTML = c.exp;
  });
});

const ex1Cards = Array.from(document.querySelectorAll('.ex-card[data-ex1]'));
const btnRevEx1 = document.getElementById('btn-rev-ex1');

function toggleEx1Card(card, forceState) {
  if (!card) return;
  const rev = forceState !== undefined ? forceState : !card.classList.contains('revealed');
  card.classList.toggle('revealed', rev);
  const box = card.querySelector('.ans-box');
  if (box) box.textContent = rev ? box.dataset.a : box.dataset.q;
  const allRev = ex1Cards.every((c) => c.classList.contains('revealed'));
  if (btnRevEx1) btnRevEx1.textContent = allRev ? 'Ocultar todas' : 'Revelar todas';
}

ex1Cards.forEach((c) => {
  c.addEventListener('click', () => toggleEx1Card(c));
});

btnRevEx1?.addEventListener('click', () => {
  const allRev = ex1Cards.every((c) => c.classList.contains('revealed'));
  ex1Cards.forEach((c) => toggleEx1Card(c, !allRev));
});

const ex2Rows = Array.from(document.querySelectorAll('tr[data-ex2]'));
const btnRevEx2 = document.getElementById('btn-rev-ex2');

function toggleEx2Row(row, forceState) {
  if (!row) return;
  const rev = forceState !== undefined ? forceState : !row.classList.contains('revealed-row');
  row.classList.toggle('revealed-row', rev);
  row.querySelectorAll('.cell-hidden').forEach((cell) => {
    cell.textContent = rev ? cell.dataset.val : '?';
  });
  const allRev = ex2Rows.every((r) => r.classList.contains('revealed-row'));
  if (btnRevEx2) btnRevEx2.textContent = allRev ? 'Ocultar todas' : 'Revelar todas';
}

ex2Rows.forEach((r) => {
  r.addEventListener('click', () => toggleEx2Row(r));
});

btnRevEx2?.addEventListener('click', () => {
  const allRev = ex2Rows.every((r) => r.classList.contains('revealed-row'));
  ex2Rows.forEach((r) => toggleEx2Row(r, !allRev));
});

go(0);
