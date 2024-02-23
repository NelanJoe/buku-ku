const buttonTheme = document.getElementById("theme-toggle");

const localTheme = localStorage.getItem("theme");
const systemTheme =
  window && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const storedTheme = localTheme || systemTheme;

if (storedTheme) {
  document.documentElement.setAttribute("data-theme", storedTheme);
}

buttonTheme.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  let newTheme = "light";

  if (currentTheme === "light") {
    newTheme = "dark";
  }

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});
