console.log("JS del frontend cargó");
console.log("LOGIN JS CORRECTO CARGADO");


//LOGEO DE USUARIO
const form = document.getElementById("formRegistro");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // evita que se recargue la página

  // tomar datos del formulario
  const nombre_completo = form.nombre.value;
  const nombre_usuario = form.usuario.value;
  const email = form.email.value;
  const contrasenia = form.password.value;

  // (por ahora usamos una foto fija)
  const foto_perfil = "/imagenes/perfil-default.jpeg";

  const usuario = {
    nombre_completo,
    nombre_usuario,
    email,
    contrasenia,
    foto_perfil
  };

  console.log("Enviando usuario:", usuario);

  try {
   const response = await fetch("http://localhost:3000/api/v1/usuarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(usuario)
});



    if (!response.ok) {
      throw new Error("Error al registrar usuario");
    }
    const data = await response.json().catch(() => null);
    console.log("Usuario creado:", data);


    alert("Usuario registrado con éxito");
    form.reset();

  } catch (error) {
    console.error(error);
    alert("Error al registrar usuario");
  }
})

