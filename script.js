/* ===== PROYECTOS =====
   Para añadir uno nuevo, copia un bloque { ... } y cambia los datos.
   Deja sitio o codigo en "" si todavía no tienes el enlace. */
const PROYECTOS = [
  {
    nombre: "Marea Alta",
    descripcion: "Tienda de práctica creada con HTML y CSS, publicada en Netlify.",
    tecnologias: ["HTML", "CSS"],
    sitio: "https://marea-alta-web.netlify.app/",
    codigo: "https://github.com/jadergalindo31-hash/marea-alta-web"
  },
  {
    nombre: "Página de la cafetería",
    descripcion: "Mi primera página web, con estilos y un toque de JavaScript.",
    tecnologias: ["HTML", "CSS", "JavaScript"],
    sitio: "",
    codigo: ""
  }
];

const CORREO = "jaderquiroga31@gmail.com";

/* ===== Utilidades ===== */
const $ = (id) => document.getElementById(id);

function esEnlaceSeguro(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch (e) {
    return false;
  }
}

/* ===== Renderizar proyectos (con textContent: sin HTML inyectado) ===== */
function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto) el.textContent = texto;
  return el;
}

function enlace(texto, url) {
  const a = crear("a", "", texto);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

function pintarProyectos() {
  const contenedor = $("lista-proyectos");
  PROYECTOS.forEach((p) => {
    const tarjeta = crear("article", "proyecto");
    tarjeta.appendChild(crear("div", "vista", p.nombre.slice(0, 2).toUpperCase()));

    const cuerpo = crear("div", "proyecto-cuerpo");
    cuerpo.appendChild(crear("h3", "", p.nombre));
    cuerpo.appendChild(crear("p", "", p.descripcion));

    const etiquetas = crear("div", "etiquetas");
    p.tecnologias.forEach((t) => etiquetas.appendChild(crear("span", "", t)));
    cuerpo.appendChild(etiquetas);

    const enlaces = crear("div", "enlaces");
    if (esEnlaceSeguro(p.sitio)) enlaces.appendChild(enlace("Ver sitio", p.sitio));
    if (esEnlaceSeguro(p.codigo)) enlaces.appendChild(enlace("Ver código", p.codigo));
    if (enlaces.children.length) cuerpo.appendChild(enlaces);

    tarjeta.appendChild(cuerpo);
    contenedor.appendChild(tarjeta);
  });
}

/* ===== Tema oscuro / claro ===== */
$("btn-tema").addEventListener("click", () => {
  const raiz = document.documentElement;
  const nuevo = raiz.dataset.tema === "claro" ? "oscuro" : "claro";
  raiz.dataset.tema = nuevo;
  try { localStorage.setItem("tema", nuevo); } catch (e) {}
});

/* ===== Menú móvil ===== */
const menu = $("menu");
const btnMenu = $("btn-menu");
function cerrarMenu() {
  menu.classList.remove("abierto");
  btnMenu.setAttribute("aria-expanded", "false");
}
btnMenu.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  btnMenu.setAttribute("aria-expanded", String(abierto));
});
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrarMenu));

/* ===== Botón volver arriba ===== */
const btnSubir = $("btn-subir");
window.addEventListener("scroll", () => {
  btnSubir.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });
btnSubir.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ===== Animaciones de entrada ===== */
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observador.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observador.observe(el));

/* ===== Formulario =====
   No hay servidor: al enviar, se abre tu app de correo con el mensaje listo. */
const form = $("form");
const estado = $("estado");

function mostrar(texto, tipo) {
  estado.textContent = texto;
  estado.className = tipo;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const mensaje = form.mensaje.value.trim();
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  [form.nombre, form.correo, form.mensaje].forEach((c) => c.classList.remove("error"));

  if (nombre.length < 2) { form.nombre.classList.add("error"); form.nombre.focus(); return mostrar("Escribe tu nombre.", "mal"); }
  if (!correoValido) { form.correo.classList.add("error"); form.correo.focus(); return mostrar("Escribe un correo válido.", "mal"); }
  if (mensaje.length < 10) { form.mensaje.classList.add("error"); form.mensaje.focus(); return mostrar("El mensaje es muy corto (mínimo 10 caracteres).", "mal"); }

  const asunto = encodeURIComponent("Contacto desde tu portafolio: " + nombre);
  const cuerpo = encodeURIComponent(mensaje + "\n\n— " + nombre + " (" + correo + ")");
  window.location.href = "mailto:" + CORREO + "?subject=" + asunto + "&body=" + cuerpo;
  mostrar("Se abrió tu app de correo. Solo falta presionar enviar.", "bien");
  form.reset();
});

/* ===== Inicio ===== */
$("anio").textContent = new Date().getFullYear();
pintarProyectos();