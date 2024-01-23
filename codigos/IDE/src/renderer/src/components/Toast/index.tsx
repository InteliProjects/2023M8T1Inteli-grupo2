// Helper functions to display notification messages (toasts)
// Includes:
// - `successToast` to display a success message.
// - `errorToast` to display an error message.
// - `infoToast` to display an informational message.
// All functions accept a string as the message content and use the 'react-toastify' library.

import { toast } from 'react-toastify'

export function successToast(content: string) {
  return toast.success(content, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  })
}

export function errorToast(content: string) {
  return toast.error(content, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  })
}

export function infoToast(content: string) {
  return toast.info(content, {
    position: 'top-right',
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  })
}
