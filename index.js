class FormValidate {
  constructor(form, {submitCallback, customValidation} = {}) {
    this.form = $(form);
    this.currentErrors = [];
    this.submitCallback = submitCallback;
    this.customValidation = customValidation;
    this.rules = [
      {
        rule: (input) => {
          const value = $(input).val();
          return (
            !value ||
            !value
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
          );
        },
        message: "Incorrect email",
        attr: "data-email",
      },
      {
        rule: (input) => !$(input).val(),
        message: "This field is required",
        attr: "data-required",
      },
    ];

    this.init();
  }

  init() {

    const inputs = this.form.find("input");
    inputs.each((_, input) => {
      const $input = $(input);
      $input.on("input", () => {
        this.clearErrors();
      });
    });

    const selects = this.form.find("select");
    selects.each((_, select) => {
      const $select = $(select);
      $select.on("change", () => {
        this.clearErrors();
      });
    });

    this.form.submit(() => {
      const result = this.validate();
      if (!result) {
        return false
      }
      this.submitCallback();
      return true
    });
  }

  validate() {
    this.clearErrors(); // Удаляем старые ошибки

    const inputs = this.form.find("input");
    let result = true;

    inputs.each((_, input) => {
      const $input = $(input); // Преобразуем элемент в объект jQuery
      for (const rule of this.rules) {
        if ($input.is(`[${rule.attr}]`) && rule.rule(input)) {
          this.showError($input, rule.message);
          result = false;
          break; // Прекращаем проверку, если правило сработало
        }
      }
    });
    if (this.customValidation) {
      const customResult = this.customValidation()
      if (!customResult) {
        result = false
      }
    }

    return result;
  }

  showError($input, message) {
    const $error = $("<span>")
      .addClass("error")
      .text(message);
    $input.after($error); // Добавляем ошибку после input
    this.currentErrors.push($error);
  }

  clearErrors() {
    this.currentErrors.forEach(($error) => $error.remove());
    this.currentErrors = [];
  }
}
