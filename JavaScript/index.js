function mascaraTelefone(event) {
    let input = event.target;
    let valor = input.value.replace(/\D/g, "");

    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");

    input.value = valor;
}

function mascaraCPF(event) {
  const input = event.target;
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
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

  // localizar o container de progresso dentro da mesma seção do form
  const section = form.closest('section');
  const progressContainer = section ? section.querySelector('.progress-steps') : null;

  function ensureProgressBoxes() {
    if (!progressContainer) return;
    const existing = progressContainer.querySelectorAll('.step-box');
    if (existing.length === 0) {
      for (let i = 0; i < 7; i++) {
        const d = document.createElement('div');
        d.className = 'step-box';
        d.dataset.index = (i + 1).toString();
        progressContainer.appendChild(d);
      }
    }
  }

  function updateProgressBoxes() {
    if (!progressContainer) return;
    const boxes = Array.from(progressContainer.querySelectorAll('.step-box'));
    const boxesLen = boxes.length || 7;
    const ratio = steps.length > 1 ? currentStep / (steps.length - 1) : 1;
    const filled = Math.round(ratio * (boxesLen - 1)) + 1;
    boxes.forEach(function(b, i) {
      b.classList.toggle('filled', (i + 1) <= filled);
    });
  }

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

    updateProgressBoxes();
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

  ensureProgressBoxes();
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
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
      cpfInput.addEventListener('input', mascaraCPF);
    }
    cadastroForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Cadastro concluído com sucesso!');
      cadastroForm.reset();
      const entreButton = document.querySelector('[data-target="Entre"]');
      if (entreButton) {
        entreButton.click();
      }
    });
  }

  if (loginForm) {
    setupWizard(loginForm);
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Login enviado com sucesso!');
      window.location.href = './index.html';
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