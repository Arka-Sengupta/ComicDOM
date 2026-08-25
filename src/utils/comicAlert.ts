import Swal, { SweetAlertIcon } from 'sweetalert2'

export const ComicSwal = Swal.mixin({
  customClass: {
    popup: 'comic-swal-popup',
    title: 'comic-swal-title',
    htmlContainer: 'comic-swal-html',
    confirmButton: 'comic-swal-confirm',
    cancelButton: 'comic-swal-cancel',
  },
  buttonsStyling: false,
  background: '#FFF8E7',
  color: '#1A1A1A',
})

/**
 * Show a comic-styled confirmation dialog (replaces window.confirm)
 */
export async function showComicConfirm({
  title = 'ARE YOU SURE, CITIZEN?',
  text = 'This action cannot be undone!',
  confirmButtonText = 'YES, EXECUTE! >',
  cancelButtonText = 'CANCEL MISSION',
  icon = 'warning' as SweetAlertIcon,
}): Promise<boolean> {
  const result = await ComicSwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  })
  return result.isConfirmed
}

/**
 * Show a comic-styled alert dialog (replaces window.alert)
 */
export async function showComicAlert({
  title = 'TRANSMISSION ALERT!',
  text = '',
  icon = 'info' as SweetAlertIcon,
  confirmButtonText = 'UNDERSTOOD >',
}) {
  return await ComicSwal.fire({
    title,
    text,
    icon,
    confirmButtonText,
  })
}

/**
 * Show a quick comic toast popup
 */
export async function showComicToast({
  title = 'POW! SUCCESSFUL!',
  icon = 'success' as SweetAlertIcon,
}) {
  return await ComicSwal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}
