const API_URL = 'http://localhost:3000/personas';

$(document).ready(function () {
  cargarDatosTable();
});

function cargarDatosTable() {
  $.ajax({
      url: API_URL,
      type: 'GET',
      datatype: 'JSON',
      success: function (response) {
          let myItems = response.data;
          let valor = '';
          for (i = 0; i < myItems.length; i++) {
              valor += `
              <div class="card">
                <div>Nombre: `+ myItems[i].Nombre+`</div>
                <div>Apellido: `+ myItems[i].Apellido+` </div>
                <div>Edad: `+ myItems[i].Edad+` años</div>
                <div class="options">
                  <button class="btnEdit" type="button" onclick="editProduct(`+ myItems[i].Id +`)">Editar</button>
                  <button class="btnRemove" type="button" onclick="openModalConfirm(`+ myItems[i].Id+`)">Eliminar</button>
                </div>
              </div>
            `
          }
          $('#personasList').html(valor);
      }
  });
}

function createProduct() {
  let datosFormulario = {
      Nombre: $('#nombre').val(),
      Apellido: $('#apellido').val(),
      Edad: $('#edad').val(),
  };

  let datosFormularioJson = JSON.stringify(datosFormulario);

  $.ajax({
      url: API_URL,
      type: 'POST',
      data: datosFormularioJson,
      datatype: 'JSON',
      contentType: 'application/json',
      success: function(response) {
          console.log(response);
          alertManager('success', response.mensaje);
          closeModalConfirm();
          cargarDatosTable();
          limpiarFormulario();
      }
  });
}

function borrarCampo(deleteId) {
  let datosFormulario = {
      id: deleteId
  };

  let datosFormularioJson = JSON.stringify(datosFormulario);

  $.ajax({
      url: API_URL + `/` + deleteId,
      type: 'DELETE',
      data: datosFormularioJson,
      datatype: 'JSON',
      contentType: 'application/json',
      success: function(response) {
          console.log(response);
          alertManager('success', response.mensaje);
          closeModalConfirm();
          cargarDatosTable();
      }
  });
}
const confirmDelete = (res) => {
  if(res){
    borrarCampo(deleteId);
  } else {
    closeModalConfirm();
  }
}

const editProduct = (idEdit) => {
  $.ajax({
    url: API_URL + `/` + idEdit,
    type: 'GET',
    datatype: 'JSON',
    success: function(response) {
        let myItems = response.data;
        let valor = '';
        for(i=0;i<myItems.length;i++){

        valor = `<input type="hidden" id="ID">
        <div class="control">
          <label>Nombre: </label>
          <input type="text" id="Nombre" value="`+ myItems[i].Nombre+`">
        </div>
        <div class="control">
          <label>Apellido: </label>
          <input type="text" id="Apellido" value="${myItems[i].Apellido}">
        </div>
        <div class="control">
          <label>Edad: </label>
          <input type="number" id="Edad" value="${myItems[i].Edad}"></div>
          <button class="btnRemove" type="button" onclick="closeModalEdit()">Cancelar</button>
          <button class="btnEdit" type="button" onclick="updateProduct(${myItems[i].Id})">Guardar cambios</button>`
        }
          
        $('#formEdit').html(valor);
    }
});
  openModalEdit();
}
function updateProduct(updateId) {
  let datosFormulario = {
    Nombre: $('#Nombre').val(),
    Apellido: $('#Apellido').val(),
    Edad: $('#Edad').val(),
    Id:updateId
};

  let datosFormularioJson = JSON.stringify(datosFormulario);

  $.ajax({
      url: API_URL ,
      type: 'PUT',
      data: datosFormularioJson,
      datatype: 'JSON',
      contentType: 'application/json',
      success: function(response) {
          console.log(response);
          alertManager('success', response.mensaje);
          closeModalConfirm();
          cargarDatosTable();
          
      }
  });
}

// Administrador de ventana Modal
/** --------------------------------------------------------------- */
const btnAdd = document.querySelector('#btnAdd');
const modalAdd = document.querySelector('#modalAdd');

btnAdd.onclick = () => openModalAdd();

window.onclick = function(event) {
  if (event.target == modalAdd) {
    //modalAdd.style.display = "none";
  }
}

const closeModalAdd = () => {
  modalAdd.style.display = 'none';
}

const openModalAdd = () => {
  modalAdd.style.display = 'block';
}

// MODAL ADIT MANAGER
/** --------------------------------------------------------------- */
const modalEdit = document.querySelector('#modalEdit');

const openModalEdit = () => {
  modalEdit.style.display = 'block';
}

const closeModalEdit = () => {
  modalEdit.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modalEdit) {
    //modalEdit.style.display = "none";
  }
}

// MODAL CONFIRM MANAGER
/** --------------------------------------------------------------- */
const modalConfirm = document.getElementById('modalConfirm');

window.onclick = function(event) {
  if (event.target == modalConfirm) {
    modalConfirm.style.display = "none";
  }
}

const closeModalConfirm = () => {
  modalConfirm.style.display = 'none';
}

const openModalConfirm = (id) => {
  deleteId = id;
  modalConfirm.style.display = 'block';
  
}


/** ALERT */
const alertManager = (typeMsg, message) => {
  const alert = document.querySelector('#alert');

  alert.innerHTML = message || 'Se produjo cambios';
  alert.classList.add(typeMsg);
  alert.style.display = 'block';

  setTimeout(() => {
    alert.style.display = 'none';
    alert.classList.remove(typeMsg);
  }, 3500);

}

function limpiarFormulario() {
  $('#formAdd')[0].reset();
}