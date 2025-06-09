const nombresDimensiones = ["temas",
  "Finalidad", "Bien supremo", "Felicidad (eudaimonia)", "Función del hombre",
  "Virtud", "Justicia", "Templanza", "Coraje", "Sabiduría práctica (phronesis)",
  "Razón", "Deseo racional", "Acción voluntaria", "Deliberación", "Elección",
  "Responsabilidad moral", "Hábitos (ethos)", "Media dorada", "Vicios",
  "Placer y dolor", "Amistad", "Placer en la contemplación", "Educación ética",
  "Política", "Ciudadanía", "Bien común", "Ley", "Constitución",
  "Justicia distributiva", "Justicia correctiva", "Equidad", "Virtudes intelectuales",
  "Verdad", "Sabiduría teórica", "Autarquía", "Contemplación (theoria)",
  "Naturaleza", "Teleología", "Esencia humana", "Decisión racional",
  "Autodominio", "Deseo irracional", "Ira", "Ignorancia", "Acciones involuntarias",
  "Amor propio", "Reconocimiento", "Respeto", "Amistad perfecta", "Felicidad política",
  "Vida activa", "Vida contemplativa", "Dios como motor", "Fin último"
];
const select = document.getElementById('dimensionNombre');
nombresDimensiones.forEach((nombre, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = `${index}: ${nombre}`;
  select.appendChild(option);
});

// Vincular con el input de dimensión numérica
select.addEventListener('change', () => {
  document.getElementById('dimension').value = select.value;
});

document.getElementById('chunkForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fragmento = document.getElementById('fragmento').value;
  const vector = document.getElementById('vector').value.split(',').map(parseFloat);
  const libro = document.getElementById('libro').value;
  const capitulo = document.getElementById('capitulo').value;
  const bakker = document.getElementById('bakker').value;

  const res = await fetch('/chunks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fragmento, vector, libro, capitulo, bakker })
  });

  if (res.ok) {
    document.getElementById('chunkForm').reset();
    loadChunks();
  }
});

async function loadChunks() {
  const dimension = document.getElementById('dimension').value;
  const min = document.getElementById('min').value;
//  alert(dimension+", "+min);
  let url = '/chunks';
  if (dimension && min) {
    url += `?dimension=${dimension}&min=${min}`;
  }
  const res = await fetch(url);
  const chunks = await res.json();
  const list = document.getElementById('chunkList');
  list.innerHTML = '';
  chunks.forEach(chunk => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${chunk.libro || ''} ${chunk.capitulo || ''} (${chunk.bakker || ''})</strong><br>
      <em>${chunk.fragmento}</em><br>
      <pre>${chunk.vector}</pre>`;
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = async () => {
      await fetch(`/chunks/${chunk.id}`, { method: 'DELETE' });
      loadChunks();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

loadChunks();