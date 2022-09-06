import { User } from "../auth/services/user";

const USER = "user";

export function storeUserData(user: User, token: string): void {
  localStorage.setItem(USER, JSON.stringify(user));
}

export function getUserData(): User | undefined {
  try {
    return JSON.parse(localStorage.getItem(USER) ?? "");
  } catch {
    deleteUserData();
  }
}

export function deleteUserData(): void {
  localStorage.removeItem(USER);
  localStorage.clear();
}

export function getCsrfToken(): string | null {
  return getCookie("csrftoken");
}

function getCookie(name: string): string | null {
  let cookieValue: string | null = null;
  if (document.cookie.length > 0 && document.cookie !== "") {
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
