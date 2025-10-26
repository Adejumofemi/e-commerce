const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const login1Btn = document.getElementById("login1");
const register1Btn = document.getElementById("register1");

function safeAddListener(el, event, fn) {
  if (!el) return;
  el.addEventListener(event, fn);
}

safeAddListener(registerBtn, "click", (e) => {
  e.preventDefault && e.preventDefault();
  container && container.classList.add("active");
});

safeAddListener(loginBtn, "click", (e) => {
  e.preventDefault && e.preventDefault();
  container && container.classList.remove("active");
});

safeAddListener(login1Btn, "click", (e) => {
  // This button is inside a form; prevent it from submitting the form.
  e.preventDefault && e.preventDefault();
  container && container.classList.add("active");
});

safeAddListener(register1Btn, "click", (e) => {
  // This button is inside a form; prevent it from submitting the form.
  e.preventDefault && e.preventDefault();
  container && container.classList.remove("active");
});