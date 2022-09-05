import { User } from "../auth/services/user";

const USER = "user";

export function storeUserData(user: User, token: string) {
  localStorage.setItem(USER, JSON.stringify(user));
}

export function getUserData(): User | undefined {
  try {
    return JSON.parse(localStorage.getItem(USER));
  } catch {
    deleteUserData();
  }
}

export function deleteUserData() {
  localStorage.removeItem(USER);
  localStorage.clear();
}

export function getCsrfToken() {
  return getCookie("csrftoken");
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
