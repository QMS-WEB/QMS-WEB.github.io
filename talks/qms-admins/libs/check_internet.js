let previousInternetStatus = navigator.onLine;

function checkInternetConnection() {
  const currentInternetStatus = navigator.onLine;
  if (previousInternetStatus !== currentInternetStatus) {
    if (currentInternetStatus) {
      Swal.fire('Internet connection is active', '', 'success');
    
    } else {
      Swal.fire('Internet connection is not active', '', 'error');
    }
    previousInternetStatus = currentInternetStatus;
  }
}

setInterval(checkInternetConnection, 1000);