formIniciarSesion.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre_usuario = formIniciarSesion.usuario.value;
  const contrasenia = formIniciarSesion.password.value;

  try {
    const response = await fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_usuario, contrasenia })
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const usuario = await response.json();
    console.log("Login OK:", usuario);

    alert("Sesión iniciada");
    // acá después podés redirigir

  } catch (error) {
    alert(error.message);
  }
});
