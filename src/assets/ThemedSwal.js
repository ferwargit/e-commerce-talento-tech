import Swal from "sweetalert2";

const ThemedSwal = Swal.mixin({
  customClass: {
    popup: "swal2-custom-dark",
    confirmButton: "swal2-confirm-button",
    cancelButton: "swal2-cancel-button",
  },
  buttonsStyling: false,
});

export default ThemedSwal;
