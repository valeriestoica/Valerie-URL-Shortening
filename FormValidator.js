export default class FormValidator {
  constructor(form_selector, formHandler) {

    this.formHandler = formHandler
    this.form = document.querySelector(form_selector)
    this.inputsWithErrors = new Set()

    this.form.addEventListener('submit', e => {
      e.preventDefault()
      if(!this.hasErrors) {
        this.formHandler ? this.formHandler(this.form) : this.form.submit()
      } else {
        this.form.querySelector('.error-message').textContent = "Please enter a link"
        this.form.querySelector('#url').classList.add('error-outline')
      }      
    })
  }

  get hasErrors() {
    return this.inputsWithErrors.size > 0;
  }

  register(field_selector, check) {
    const inputField = this.form.querySelector(field_selector)
    const errorElement = inputField.closest(".form-shorten").querySelector(".error-message")

    const execute = (hideErrors) => {
      const {pass, error} = check(inputField.value, inputField)

      //do not execute on load
      if(!hideErrors) {
        errorElement.textContent = error || ''
        if(!pass) {
          inputField.classList.add('error-outline')
        } else {
         inputField.classList.remove('error-outline') 
        }
      }

      // execute on-loadprevent submit if it has errors
      if(!pass) {
        this.inputsWithErrors.add(inputField)
      } else {
        this.inputsWithErrors.delete(inputField)
      }
    }

    inputField.addEventListener('change', () => execute())
    execute(true)
  }
}