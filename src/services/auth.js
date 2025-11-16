// Serviço simples de autenticação usando LocalStorage

// Salvar usuário no sistema
export function registerUser(user) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // verificar se email já existe
  const exists = users.some((u) => u.email === user.email);
  if (exists) return { success: false, message: "E-mail já cadastrado" };

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  return { success: true };
}

// Fazer login
export function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return { success: false, message: "E-mail ou senha incorretos" };

  // salva usuário logado
  localStorage.setItem("loggedUser", JSON.stringify(user));
  return { success: true, user };
}

// Pegar usuário logado
export function getLoggedUser() {
  return JSON.parse(localStorage.getItem("loggedUser"));
}

// Deslogar
export function logoutUser() {
  localStorage.removeItem("loggedUser");
}
