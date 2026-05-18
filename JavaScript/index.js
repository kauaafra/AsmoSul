function mascaraTelefone(event) {
    let input = event.target;
    let valor = input.value.replace(/\D/g, "");

    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");

    input.value = valor;
}

function openCity(evt, cityName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  const target = document.getElementById(cityName);
  if (!target) {
    return;
  }

  target.style.display = "block";
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add("active");
  }
}

function setupWizard(form) {
  const steps = Array.from(form.querySelectorAll('.wizard-step'));
  const backButton = form.querySelector('.wizard-back');
  const nextButton = form.querySelector('.wizard-next');
  const submitButton = form.querySelector('.wizard-submit');

  if (!steps.length) {
    return;
  }

  let currentStep = 0;

  function renderStep() {
    steps.forEach(function(step, index) {
      step.classList.toggle('is-active', index === currentStep);
    });

    if (backButton) {
      backButton.hidden = currentStep === 0;
    }

    if (nextButton) {
      nextButton.hidden = currentStep === steps.length - 1;
    }

    if (submitButton) {
      submitButton.hidden = currentStep !== steps.length - 1;
    }
  }

  function currentFields() {
    return Array.from(steps[currentStep].querySelectorAll('input, select, textarea'));
  }

  if (backButton) {
    backButton.addEventListener('click', function() {
      if (currentStep > 0) {
        currentStep -= 1;
        renderStep();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', function() {
      const valid = currentFields().every(function(field) {
        return field.checkValidity();
      });

      if (!valid) {
        const firstInvalid = currentFields().find(function(field) {
          return !field.checkValidity();
        });

        if (firstInvalid) {
          firstInvalid.reportValidity();
          firstInvalid.focus();
        }
        return;
      }

      if (currentStep < steps.length - 1) {
        currentStep += 1;
        renderStep();
      }
    });
  }

  renderStep();
}

document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.auth-nav .tablinks');
  tabButtons.forEach(function(button) {
    button.addEventListener('click', function(event) {
      openCity(event, button.dataset.target);
    });
  });

  const select = document.getElementById('Sim');
  const detalhes = document.getElementById('comorbidadeDetalhes');
  if (select && detalhes) {
    select.addEventListener('change', function() {
      if (this.value === 'sim') {
        detalhes.style.display = 'block';
      } else {
        detalhes.style.display = 'none';
      }
    });
    if (select.value === 'sim') detalhes.style.display = 'block';
  }

  const cadastroForm = document.getElementById('cadastroWizard');
  const loginForm = document.getElementById('loginForm');
  if (cadastroForm) {
    setupWizard(cadastroForm);
    cadastroForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Cadastro concluído com sucesso!');
    });
  }

  if (loginForm) {
    setupWizard(loginForm);
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Login enviado com sucesso!');
    });
  }

  const senha = document.getElementById('senha');
  const senhaC = document.getElementById('senhaC');
  const feedback = document.getElementById('passwordFeedback');

  if (senha && senhaC && feedback) {
    function getChecks(pw) {
      return {
        length: pw.length >= 8,
        lower: /[a-z]/.test(pw),
        upper: /[A-Z]/.test(pw),
        digit: /\d/.test(pw),
        special: /[!@#\$%\^&\*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)
      };
    }

    function renderFeedback(pw) {
      const c = getChecks(pw);
      feedback.innerHTML = `
        <ul class="password-feedback">
          <li class="${c.length ? 'valid' : 'invalid'}">Mínimo 8 caracteres</li>
          <li class="${c.lower ? 'valid' : 'invalid'}">Letra minúscula</li>
          <li class="${c.upper ? 'valid' : 'invalid'}">Letra maiúscula</li>
          <li class="${c.digit ? 'valid' : 'invalid'}">Número</li>
          <li class="${c.special ? 'valid' : 'invalid'}">Caracter especial</li>
        </ul>
      `;
    }

    senha.addEventListener('input', function() {
      renderFeedback(senha.value);
      senhaC.setCustomValidity('');
    });

    senhaC.addEventListener('input', function() {
      if (senha.value !== senhaC.value) {
        senhaC.setCustomValidity('Senhas diferentes');
      } else {
        senhaC.setCustomValidity('');
      }
    });

    if (cadastroForm) {
      cadastroForm.addEventListener('submit', function(e) {
        const checks = getChecks(senha.value);
        const allGood = Object.values(checks).every(Boolean);

        if (!allGood) {
          e.preventDefault();
          e.stopImmediatePropagation();
          renderFeedback(senha.value);
          senha.focus();
          senha.reportValidity();
          return;
        }

        if (senha.value !== senhaC.value) {
          e.preventDefault();
          e.stopImmediatePropagation();
          senhaC.setCustomValidity('Senhas diferentes');
          senhaC.reportValidity();
          senhaC.focus();
        }
      });
    }

    renderFeedback('');
  }
});