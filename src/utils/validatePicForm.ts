import { PicFormInitialState } from "../interfaces";

function validatePicForm(payload: Partial<PicFormInitialState>) {
  const errors: Partial<PicFormInitialState> = {};
  const { name, position, email, phone } = payload;
  if (!name) {
    errors.errorName = "Nama harus diisi";
  } else if (name.length < 4) {
    errors.errorName = "Nama tidak boleh kurang dari 4 karakter";
  }
  if (!position) {
    errors.errorPosition = "Jabatan harus diisi";
  } else if (position.length < 4) {
    errors.errorPosition = "Jabatan tidak boleh kurang dari 4 karakter";
  }
  if (!email) {
    errors.errorEmail = "Email harus diisi";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    errors.errorEmail = "Format email salah";
  }
  if (!phone) {
    errors.errorPhone = "Nomor telepon harus diisi";
  } else if (!/^(^\+62)(\d{3,4}-?){2}\d{3,4}$/g.test(phone)) {
    errors.errorPhone = "Format nomor telepon salah";
  }
  return errors;
}

export default validatePicForm;
