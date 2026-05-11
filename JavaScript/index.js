function mascaraTelefone(event) {
    let input = event.target;
    let valor = input.value.replace(/\D/g, "");

    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");

    input.value = valor;
}

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  const target = document.getElementById(cityName);
  if (!target) {
    return;
  }

  target.style.display = "block";
  evt.currentTarget.className += " active";
}

function Sim(event) {
}

document.addEventListener('DOMContentLoaded', function() {
  const cadastroForm = document.getElementById('cadastroForm');
  const navConta = document.getElementById('navConta');

  if (cadastroForm && navConta) {
    cadastroForm.addEventListener('submit', function(e) {
      e.preventDefault();
      navConta.click();
    });
  }

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

  const contaForm = document.getElementById('contaForm');
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

    if (contaForm) {
      contaForm.addEventListener('submit', function(e) {
        const checks = getChecks(senha.value);
        const allGood = Object.values(checks).every(Boolean);
        if (!allGood) {
          e.preventDefault();
          renderFeedback(senha.value);
          senha.focus();
          senha.reportValidity();
          return;
        }
        if (senha.value !== senhaC.value) {
          e.preventDefault();
          senhaC.setCustomValidity('Senhas diferentes');
          senhaC.reportValidity();
          senhaC.focus();
          return;
        }
      });
    }

    renderFeedback('');
  }
});