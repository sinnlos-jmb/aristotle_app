// public/app.js (común para index.html y buscar.html)

const arbolOriginal = get_arbol();

function renderArbol(obj, path = []) {
  const container = document.createElement('div');
  container.classList.add('child-container');

  for (const key in obj) {
    const val = obj[key];
    const ruta = [...path, key].join('.');
    const wrapper = document.createElement('div');
    wrapper.classList.add('nivel');
    wrapper.classList.toggle('highlight');

    const isLeafWithPeso = typeof val === 'object' && val !== null && 'peso' in val && Object.keys(val).every(k => k === 'peso');
    const isNumber = typeof val === 'number';
    const is_parr=document.getElementById("nro_p");
    let label = '';
    if (isLeafWithPeso || isNumber) {
      if (is_parr)  {label = `<label> ${key} <input type="number" name="categs" value="0" id="${ruta}"></label>`; }
      else {label = `<label><input type="checkbox" data-cat="${ruta}"> ${key}</label>`; }      
      } 
    else { label = `<span class="toggle">−</span><span>${key}</span>`; }
    wrapper.innerHTML = label;
    wrapper.setAttribute("ruta", ruta);

    if (typeof val === 'object' && val !== null) {
      const children = renderArbol(val, [...path, key]);
      if (children.children.length > 0) {
        wrapper.appendChild(children);
      }
    }

    container.appendChild(wrapper);
  }
  return container;
}


function mostrarResultados(lista, mostrarSimilitud = false) {
  const ul = document.getElementById('resultados');
  if (!ul) return;
  ul.innerHTML = '';
  if (!lista.length) {
    ul.innerHTML = '<li>No se encontraron resultados.</li>';
    return;
  }
  lista.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = mostrarSimilitud && 'similitud' in r
      ? `<b>Similitud:</b> ${parseFloat(r.similitud).toFixed(3)}<br><pre>${r.texto}</pre>`
      : `<pre>${r.texto}</pre>`;
    ul.appendChild(li);
  });
}



function buscarExacto() {
  const seleccionadas = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.dataset.cat);

  if (!seleccionadas.length) return alert("Seleccioná al menos una categoría.");

  fetch('/buscar-coincidencia-exacta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categorias: seleccionadas })
  })
    .then(res => res.json())
    .then(data => mostrarResultados(data))
    .catch(err => {
      console.error('Error en búsqueda exacta:', err);
      alert('Error al buscar en el servidor.');
    });
}




function buscarSimilares() {
  const seleccionadas = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.dataset.cat);

  if (!seleccionadas.length) return alert("Seleccioná al menos una categoría.");

  fetch('/buscar-chunks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categorias: seleccionadas })
  })
    .then(res => res.json())
    .then(data => mostrarResultados(data, true))
    .catch(err => {
      console.error('Error en búsqueda por similitud:', err);
      alert('Error al buscar en el servidor.');
    });
}



function guardarParrafo() {
  const nro_p=document.getElementById("nro_p").value;
  const textarea = document.querySelector('textarea');
  const texto = textarea.value.trim();
  if (!texto) return alert("Ingresá un párrafo.");
    //alert(texto+"\n"+nro_p);

let rta="";
const inputs = Array.from(document.querySelectorAll('input[name="categs"]'));

let target = arbolOriginal;
try{
inputs.forEach(input => {
  target =arbolOriginal;
  const ruta = input.id; // ej: "bien.peso"
  const valor = parseFloat(input.value); // o parseInt, según el tipo de dato
  rta+=ruta+"."+valor;

  const keys = ruta.split('.');
  const lastKey = keys.pop();

  // Recorrer el árbol hasta llegar al nodo objetivo
  for (let i = 0; i < keys.length; i++) {
    target = target[keys[i]];
   
  }
  
  target[lastKey] = valor;// Asignar el nuevo valor
  });

}
catch (er) {alert ("err9r: "+err);}
finally { //alert("target: "+JSON.stringify(target));

}

    if (!inputs.length) return alert("Seleccioná al menos una categoría para guardar.");
      fetch('/guardar-parrafo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'parrafo':texto, 'arbor':arbolOriginal})
      })
    .then(res => res.json())
    .then(data => alert('ok'+data.msg))
    .catch(err => {
      console.error('Error en guardar parrafo:', err);
      alert('Error al buscar en el servidor.');
    });

    
}



function setupInteracciones() {

  console.log("hola !!!!!!!!!!!");
  
  const inputBuscar = document.getElementById('buscar');
  if (inputBuscar) {
    inputBuscar.addEventListener('input', function () {
       
      const query = this.value.trim().toLowerCase();
      const nodos = document.querySelectorAll('.nivel');
        let ruta="", categ="";
      nodos.forEach(nodo => {
        
        const texto = nodo.textContent.toLowerCase();
        if(texto.includes("−")) {
          ruta=texto;
          categ=texto.substring(1, texto.indexOf(" "));
           console.log("hola 2");
          
        }
        const ancenstros=nodo.getAttribute("ruta");
        
        nodo.style.display = (!query || texto.includes(query)|| ancenstros.includes(query) ) ? 'block' : 'none';
        
        if (texto.startsWith("−cau") || texto.startsWith("−tipo_cau")) { //|| categ.includes(query)
          console.log("query: ", query, "ruta: "+ruta);
          console.log("nodos", nodo.children.length);
          console.log("nodo.innerHTML", nodo.innerHTML);//dataset.keys
          console.log("nodo.getAttributeNames()", nodo.getAttributeNames());//dataset.keys
          console.log("nodo.class", nodo.getAttribute("class"));//dataset.keys
          console.log("nodo.style", nodo.getAttribute("style"));//dataset.keys
          console.log("nodo.ruta", nodo.getAttribute("ruta"));//dataset.keys
          //alert (categ.includes(query));
          //alert ("content: "+nodo.textContent+"\n\n style: "+nodo.style.display+"\nid: "+nodo.id+", categ: "+categ);
          }
        nodo.classList.toggle('highlight', texto.includes(query));
        });
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('toggle')) {
      const sibling = e.target.parentElement.querySelector('.child-container');
      if (sibling) {
        sibling.style.display = sibling.style.display === 'none' ? 'block' : 'none';
        e.target.textContent = sibling.style.display === 'none' ? '+' : '−';
      }
    }
  });

  const btnExacto = document.getElementById('buscar-exacto');
  if (btnExacto) btnExacto.addEventListener('click', buscarExacto);

  const btnSimilares = document.getElementById('buscar-similares');
  if (btnSimilares) btnSimilares.addEventListener('click', buscarSimilares);

  const btnGuardar = document.getElementById('guardar-parrafo');
  if (btnGuardar) btnGuardar.addEventListener('click', guardarParrafo);
}

window.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('busqueda-categorias');
  if (contenedor) contenedor.appendChild(renderArbol(arbolOriginal));
  setupInteracciones();
});