// Cargamos el DOM
$(document).ready(function () {
  // Inicializa el total de pago si no está inicializado
  if (isNaN(parseFloat($("#total-pagar").text()))) {
    $("#total-pagar").text(0);
  } else {
    // Asegúrate de que sea un número
    $("#total-pagar").text(parseFloat($("#total-pagar").text()));
  }

  // 1. Cuando se haga click en cada uno de los <div>
  $(".categoria").on("dblclick", function () {
    // Obtengo el elemento clicado
    let divSeleccionado = $(this);

    // Verificamos si ya tiene un precio asignado
    if (divSeleccionado.data("precio")) {
      alert("Esta categoría ya tiene un precio asignado.");
      return; // Si ya tiene precio, no hacemos nada
    }

    // Pido la cantidad en euros
    let cantiObt = prompt("Indica la cantidad en euros de  " + $(this).text());
    // Lo añado al mismo div
    // divSeleccionado.text(divSeleccionado.text() + " " + cantiObt);

    /*Con jQuery.data() guardo ese precio en el elemento como un valor interno:
     Asocio un dato personalizado al <div> clicado.*/
    divSeleccionado.data("precio", parseFloat(cantiObt)); // Guardamos el precio.
    divSeleccionado.text(`${divSeleccionado.text()} ${cantiObt}`); // Actualizamos el texto para mostrar el precio.
  });

  // 2. Configuramos las categorías para que sean arrastrables

  $(".categoria").on("dragstart", function (e) {
    // Obtengo el elemento que se está arrastrando
    // console.log(e.target);

    /*Cuando arrastramos una categoría, tendremos que pasar el nombre y el precio al DROP */
    const categoriaTexto = $(this).text(); // Obtengo el texto sin el precio.
    // alert(categoriaTexto);
    const precio = $(this).data("precio") || 0; // Recupero el precio guardado, o 0 si no hay precio.
    const categoriaData = `${categoriaTexto},${precio}`; // Concateno texto y precio.

    // Obtengo la categoria que se está arrastrando
    // let categoriaArrastrada = e.target.outerText;
    // También se podría hacer así, que es más fácil --> $(this).text();

    // Usamos e.originalEvent para acceder al objeto nativo del evento
    e.originalEvent.dataTransfer.setData("text", categoriaData);

    console.log("Categoría arrastrada:", categoriaData);
  });

  // $(".categoria").on("drag", function (e) {
  //   console.log("Estamos arrastrando --> DRAG");
  // });

  // $(".categoria").on("dragend", function (e) {
  //   console.log("Hemos dejado de arrastrar --> dragEND");
  // });

  // $("#canasta").on("dragenter", function (e) {
  //   e.preventDefault(); // Previene comportamientos no deseados
  //   console.log("Hemos entrado en la canasta--> dragENTER");
  // e.target.classList.add("drag-enter"); // Agrega la clase al contenedor
  //   $(this).addClass("drag-enter"); // Agrega la clase al contenedor
  // });

  // 3. Permitir que el area de la canasta acepte elementos arrastrados

  $("#canasta").on("dragover", function (e) {
    e.preventDefault(); // Necesario para permitir el "drop"
  });

  // 4. Manejar el "drop"

  $("#canasta").on("drop", function (e) {
    e.preventDefault(); // Evitar comportamiento predeterminado
    // const categoriaObtenida = e.originalEvent.dataTransfer.getData("text");

    // Obtenerlos jqData del dragstart
    const categoriaData = e.originalEvent.dataTransfer.getData("text");

    const [categoria, precio] = categoriaData.split(","); // Dividir la cadena en nombre y precio.

    const precioFloat = parseFloat(precio);

    console.log(
      "La categoria que se ha dropeado es la siguiente: \n" +
        categoria +
        "Y el precio asignado es de :" +
        precioFloat
    );

    // Verificamos si ya se ha agregado esta categoría
    if ($("#canasta").find(`.canasta-item:contains(${categoria})`).length > 0) {
      alert("Esta categoría ya está en la canasta.");
      return; // Si la categoría ya está, no la agregamos
    }

    // 5. Insertar el elemento arrastrado dentro de la canasta

    $(
      "#canasta"
    ).append(`<div class="canasta-item" data-precio="${precioFloat}">
      ${categoria} <button class="eliminarCategoria">Eliminar</button></div>`);

    actualizarPrecio(precioFloat);

    /* También se podría hacer así:
     const categoriaElemento = $("<div>")
    .text(categoriaObtenida)
    .addClass("canasta-item");
    */

    // 6. Actualizar el total del presupuesto

    function actualizarPrecio(precio) {
      const totalActual = parseFloat($("#total-pagar").text());

      if (isNaN(totalActual)) {
        totalActual = 0; // Asegurarse de que el total sea un número válido
      }
      // Verifica que el precio sea un número
      if (isNaN(precio)) {
        precio = 0;
      }

      const nuevoTotal = totalActual + precio; // Sumar el precio al total.
      $("#total-pagar").text(nuevoTotal);
    }

    // Método para eliminar la categoria añadida, y además restaura valores
    $(".eliminarCategoria").on("click", function () {
      // Obtengo el precio
      const precioCategoriaBorrada = parseFloat(
        $(this).parent().data("precio")
      );
      $(this).parent().remove();
      actualizarPrecio(-precioCategoriaBorrada);
    });
  });
});
