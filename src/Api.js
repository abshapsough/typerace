import proxy from "./proxy";

export function login(
  firebase,
  provider,
  setUser,
  setOpenDialog,
  setOpenLogin
) {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(async function (result) {
      const idToken = await firebase.auth().currentUser.getIdToken(true);
      const newUser = result.additionalUserInfo.isNewUser;
      fetch(`${proxy}login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          newUser,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setOpenLogin(false);
          if (newUser) {
            res.display_name = res.full_name;
            setOpenDialog(true);
          } else {
            let selectionFired = new CustomEvent("login-result", {
              detail: { result: true },
            });
            document.dispatchEvent(selectionFired);
          }
          setUser(res);
          localStorage.setItem("user", JSON.stringify(res));
        });
    })
    .catch(function (error) {
      let selectionFired = new CustomEvent("login-result", {
        detail: { result: false },
      });
      document.dispatchEvent(selectionFired);
      console.log(error);
    });
}

export async function update(user, setUser) {
  return fetch(`${proxy}update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: user.token,
    },
    body: JSON.stringify({
      ...user,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.message) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      }
      return false;
    });
}

export async function UpdateRaceData(details) {
  return fetch(`${proxy}update-race-data`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: details.token,
    },
    body: JSON.stringify({
      ...details,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
}

export async function create(token) {
  return fetch(`${proxy}create`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: token,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
}

export async function UpdateParagraph(token) {
  return fetch(`${proxy}new-paragraph`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: token,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
}
