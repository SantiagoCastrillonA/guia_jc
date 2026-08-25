import type { GrupoFragmentos } from '../../components/visuals';

/**
 * El recetario de la sesión: cada método con su explicación adentro, para
 * copiar y pegar.
 *
 * Todos los fragmentos corren sobre el mismo ejemplo —la tarjeta de producto
 * de SUELA que se arma en clase— a propósito. Veinte ejemplos con veinte
 * contextos distintos no se acumulan; con uno solo, cada método nuevo se
 * entiende contra lo anterior.
 *
 * Los comentarios se copian junto con el código. Eso es intencional: pegado en
 * su archivo, el fragmento sigue explicándose solo.
 */

export const REFERENCIA: GrupoFragmentos[] = [
  {
    id: 'seleccion',
    titulo: 'Selección',
    fragmentos: [
      {
        nombre: 'document.querySelector()',
        codigo: `// Qué hace: devuelve el PRIMER elemento que coincide con el selector.
// Cómo: pásale cualquier selector CSS válido, igual que en tus hojas de estilo.
// Si no encuentra nada devuelve null.
const producto = document.querySelector('.producto');`,
      },
      {
        nombre: 'document.querySelectorAll()',
        codigo: `// Qué hace: devuelve TODOS los que coinciden, en una lista (NodeList).
// Cómo: se recorre con forEach. Ojo: a la lista no se le cambia el texto,
// se le cambia a cada elemento de adentro.
const tarjetas = document.querySelectorAll('.producto');
tarjetas.forEach(tarjeta => console.log(tarjeta));`,
      },
    ],
  },

  {
    id: 'contenido',
    titulo: 'Contenido',
    fragmentos: [
      {
        nombre: 'element.textContent (leer)',
        codigo: `// Qué hace: lee el texto plano de un elemento, sin las etiquetas HTML.
// Cómo: es una propiedad, no un método — va sin paréntesis.
const precio = producto.querySelector('.precio');
console.log(precio.textContent); // "$120.000"`,
      },
      {
        nombre: 'element.textContent (escribir)',
        codigo: `// Qué hace: reemplaza el contenido del elemento por el texto que le asignes.
// Cómo: asígnale un string. Es la opción segura: trata todo como texto plano.
precio.textContent = "$99.000";`,
      },
      {
        nombre: 'element.innerHTML',
        codigo: `// Qué hace: lee o escribe el contenido INTERPRETÁNDOLO como HTML.
// Cómo: solo si necesitas insertar etiquetas nuevas. Nunca con texto que venga
// de un usuario: le estarías dejando escribir HTML en tu página (XSS).
producto.innerHTML = '<span class="oferta">Oferta</span>';`,
      },
      {
        nombre: 'input.value',
        codigo: `// Qué hace: lee o cambia lo que hay escrito en un campo de formulario.
// Cómo: textContent no sirve para un input — lo escrito vive en value.
const buscador = document.querySelector('#buscar');
console.log(buscador.value);
buscador.value = ''; // lo deja vacío`,
      },
    ],
  },

  {
    id: 'clases',
    titulo: 'Clases',
    fragmentos: [
      {
        nombre: 'classList.add()',
        codigo: `// Qué hace: agrega una clase al elemento (no la duplica si ya la tiene).
// Cómo: pásale el nombre de la clase, sin el punto.
const boton = producto.querySelector('.btn-agregar');
boton.classList.add('agregado');`,
      },
      {
        nombre: 'classList.remove()',
        codigo: `// Qué hace: quita una clase del elemento si la tiene.
boton.classList.remove('agregado');`,
      },
      {
        nombre: 'classList.toggle()',
        codigo: `// Qué hace: si la clase está la quita, y si no está la pone.
// Ideal para un botón que se enciende y se apaga.
boton.classList.toggle('agregado');`,
      },
      {
        nombre: 'classList.contains()',
        codigo: `// Qué hace: revisa si el elemento tiene esa clase. Devuelve true o false.
// Cómo: úsalo antes de decidir qué hacer.
if (boton.classList.contains('agregado')) {
  boton.textContent = "Agregado ✓";
}`,
      },
    ],
  },

  {
    id: 'atributos',
    titulo: 'Atributos',
    fragmentos: [
      {
        nombre: 'element.getAttribute()',
        codigo: `// Qué hace: lee el valor de un atributo HTML del elemento.
const img = producto.querySelector('img');
console.log(img.getAttribute('src')); // "tenis1.jpg"`,
      },
      {
        nombre: 'element.setAttribute()',
        codigo: `// Qué hace: cambia el valor de un atributo, o lo crea si no existía.
// Cómo: primero el nombre del atributo, después el nuevo valor.
img.setAttribute('src', 'tenis1-hover.jpg');`,
      },
    ],
  },

  {
    id: 'crear',
    titulo: 'Crear y quitar',
    fragmentos: [
      {
        nombre: 'document.createElement()',
        codigo: `// Qué hace: crea un elemento nuevo en memoria.
// Ojo: todavía no aparece en pantalla. Falta montarlo.
const etiqueta = document.createElement('span');
etiqueta.textContent = "Nuevo";
etiqueta.classList.add('etiqueta-nuevo');`,
      },
      {
        nombre: 'element.appendChild()',
        codigo: `// Qué hace: mete un elemento dentro de otro, al final de sus hijos.
// Aquí sí aparece en pantalla.
producto.appendChild(etiqueta);`,
      },
      {
        nombre: 'element.remove()',
        codigo: `// Qué hace: saca el elemento del DOM, y por lo tanto de la pantalla.
etiqueta.remove();`,
      },
    ],
  },

  {
    id: 'navegar',
    titulo: 'Navegar el árbol',
    fragmentos: [
      {
        nombre: 'element.parentElement',
        codigo: `// Qué hace: devuelve el elemento padre directo.
// Para qué sirve: desde el botón que se tocó, llegar a la tarjeta entera.
console.log(precio.parentElement); // div.producto`,
      },
      {
        nombre: 'element.children',
        codigo: `// Qué hace: devuelve los hijos directos, sin los nodos de texto.
console.log(producto.children); // img, h3, p, button`,
      },
      {
        nombre: 'element.firstElementChild',
        codigo: `// Qué hace: devuelve el primer hijo directo.
// También existe lastElementChild, para el último.
console.log(producto.firstElementChild); // img`,
      },
      {
        nombre: 'element.nextElementSibling',
        codigo: `// Qué hace: devuelve el hermano inmediatamente siguiente.
console.log(precio.nextElementSibling); // button.btn-agregar`,
      },
    ],
  },

  {
    id: 'eventos',
    titulo: 'Eventos',
    fragmentos: [
      {
        nombre: 'element.addEventListener()',
        codigo: `// Qué hace: escucha un evento sobre un elemento y ejecuta una función
// cuando ocurre.
// Cómo: primero el nombre del evento (sin "on"), después la función.
boton.addEventListener('click', function () {
  boton.classList.toggle('agregado');
});`,
      },
      {
        nombre: 'event.target',
        codigo: `// Qué hace: dentro del listener, dice qué elemento exacto se tocó.
// Para qué sirve: un solo listener en el catálogo atiende todas las tarjetas,
// incluidas las que se creen después. Eso es delegación.
catalogo.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-agregar')) {
    e.target.classList.toggle('agregado');
  }
});`,
      },
      {
        nombre: 'event.preventDefault()',
        codigo: `// Qué hace: le quita al navegador su comportamiento de fábrica.
// Cuándo: en el submit de un formulario, que si no recarga la página y borra
// todo antes de que se alcance a ver. Va siempre de primera.
formulario.addEventListener('submit', function (e) {
  e.preventDefault();
  // ... aquí tu código
});`,
      },
    ],
  },

  {
    id: 'datos',
    titulo: 'Pedir datos',
    fragmentos: [
      {
        nombre: 'await fetch()',
        codigo: `// Qué hace: pide datos a una dirección de internet.
// Ojo: un 404 NO lanza error. Para fetch, "el servidor respondió" ya es éxito,
// así que hay que preguntarle con respuesta.ok.
const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
if (!respuesta.ok) {
  throw new Error('El servidor respondió ' + respuesta.status);
}`,
      },
      {
        nombre: 'await respuesta.json()',
        codigo: `// Qué hace: convierte la respuesta en un objeto de JavaScript que puedes usar.
// Cómo: solo dentro de una función async, y con await — sin él verías
// Promise { <pending> } en vez del dato.
const datos = await respuesta.json();
console.log(datos.name); // "pikachu"`,
      },
    ],
  },
];
