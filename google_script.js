var ENVIAR_EMAIL = false; // true/false para activar/desactivar envíos

function doPost(e) {
  try {
    Logger.log('=== INICIO doPost ===');
    Logger.log('e.parameter: ' + JSON.stringify(e.parameter));
    Logger.log('e.postData existe: ' + (e.postData ? 'Sí' : 'No'));
    
    var sheetId = '1PYWjMR6rEquiUiJF_C7dj1Pe8ei-TV3OpZzsRq7-QNc';
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName('Respuestas');
    
    if (!sheet) {
      Logger.log('ERROR: Hoja "Respuestas" no encontrada');
      Logger.log('Hojas disponibles: ' + ss.getSheets().map(s => s.getName()).join(', '));
      throw new Error('Hoja "Respuestas" no encontrada');
    }
    
    // FormData llega en e.parameter
    var params = e.parameter;
    
    Logger.log('Datos recibidos:');
    Logger.log('- name: ' + params.name);
    Logger.log('- email: ' + params.email);
    Logger.log('- subject: ' + params.subject);
    Logger.log('- message: ' + params.message);
    
    if (!params.email) {
      throw new Error('Email requerido');
    }
    
    // Preparar fila
    var timestamp = new Date();
    var rowData = [
      timestamp,
      params.name || '',
      params.email || '',
      params.subject || '',
      params.message || ''
    ];
    
    Logger.log('Guardando fila: ' + JSON.stringify(rowData));
    
    // Guardar
    sheet.appendRow(rowData);
    var lastRow = sheet.getLastRow();
    
    Logger.log('✓ Guardado en fila: ' + lastRow);
    
    // Enviar email SOLO SI LA VARIABLE GLOBAL ESTÁ ACTIVADA
    if (ENVIAR_EMAIL) {
      try {
        var emailBody = "Nuevo contacto de Cartas de Alias\n\n" +
                       "Fecha: " + timestamp + "\n" +
                       "Nombre: " + params.name + "\n" +
                       "Email: " + params.email + "\n" +
                       "Asunto: " + params.subject + "\n\n" +
                       "Mensaje:\n" + params.message;
        
        MailApp.sendEmail({
          to: "fjvico@uma.es",
          subject: "Nuevo contacto - Cartas de Alias",
          body: emailBody
        });
        Logger.log('✓ Email enviado');
      } catch (emailError) {
        Logger.log('⚠ Error al enviar email: ' + emailError);
      }
    } else {
      Logger.log('Envío de email desactivado.');
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        row: lastRow,
        emailEnviado: ENVIAR_EMAIL
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Servicio activo',
      emailActivo: ENVIAR_EMAIL
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función para cambiar el estado del envío de emails
function cambiarEstadoEmail(estado) {
  ENVIAR_EMAIL = estado;
  Logger.log('Estado de envío de emails cambiado a: ' + estado);
  return ENVIAR_EMAIL;
}

// Función para desactivar emails
function desactivarEmails() {
  return cambiarEstadoEmail(false);
}

// Función para activar emails
function activarEmails() {
  return cambiarEstadoEmail(true);
}

// Función para ver estado actual
function verEstadoEmail() {
  Logger.log('Estado actual de envío de emails: ' + ENVIAR_EMAIL);
  return ENVIAR_EMAIL;
}

// Función de prueba
function testManual() {
  var testEvent = {
    parameter: {
      name: 'Prueba Manual',
      email: 'prueba@test.com',
      subject: 'Test',
      message: 'Mensaje de prueba desde testManual'
    }
  };
  
  var resultado = doPost(testEvent);
  Logger.log('Resultado test: ' + resultado.getContent());
}