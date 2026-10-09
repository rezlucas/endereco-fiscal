function toggleFaq( e ) {
	const btn = e.currentTarget;
	const currentCard = btn.closest( '.faq-card' );
	const allCards = document.querySelectorAll( '.faq-card' );

	allCards.forEach( ( card ) => {
		if ( card !== currentCard ) {
			card.classList.remove( 'active' );
		}
	} );

	currentCard.classList.toggle( 'active' );
}

document.addEventListener( "DOMContentLoaded", () => {
	// Controlar o abrir e fechar do modal Whats
	const modalWhats = document.getElementById( "modal-form-whats" );
	const openBtns = document.querySelectorAll( ".open-modal-whats" );
	const closeBtns = document.querySelectorAll( ".close-modal" );

	openBtns.forEach( ( btn ) => {
		btn.onclick = ( e ) => {
			e.preventDefault();
			modalWhats.style.display = "block";
			document.body.classList.add( "modal-open" );
		}
	} );

	const closeModal = ( modal ) => {
		modal.style.display = "none";
		document.body.classList.remove( "modal-open" );
	};

	closeBtns.forEach( ( btn ) => {
		btn.onclick = ( e ) => {
			closeModal( e.currentTarget.closest( '.modal-overlay' ) );
		}
	} );

	window.onclick = ( event ) => {
		if ( event.target.classList.contains( "modal-overlay" ) ) {
			closeModal( event.target );
		}
	}

	document.addEventListener( 'keydown', ( e ) => {
		if ( e.key !== 'Escape' ) return;

		document.querySelectorAll( '.modal-overlay' ).forEach( ( modal ) => {
			if ( modal.style.display === 'block' ) closeModal( modal );
		} );
	} );

	// Toggle Navbar
	const btnNavbar = document.getElementById( 'toggler-navbar' );
	const navTopBar = document.querySelector( '.top-bar .nav-top-bar' );

	btnNavbar.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		navTopBar.classList.toggle( "active" );
	} );

	// Modal de Planos — todos os botões "Contratar" levam para o WhatsApp da unidade
	// (a planilha tem 1 número/mensagem por unidade, independente do plano escolhido)
	const planTitles = {
		mensal: 'Plano Mensal',
		anual: 'Plano Anual',
		bianual: 'Plano Bianual'
	};

	const whatsappLinks = {
		savassi: 'https://wa.me/553173515101?text=Ol%C3%A1%2C%20vim%20do%20site%20do%20Endere%C3%A7o%20Fiscal%20gostaria%20de%20saber%20mais.%20Pode%20me%20ajudar%3F%20Savassi',
		aguas_claras: 'https://wa.me/556193559051?text=Ol%C3%A1%2C%20vim%20do%20site%20do%20Endere%C3%A7o%20Fiscal%20gostaria%20de%20saber%20mais.%20Pode%20me%20ajudar%3F%20Bras%C3%ADlia',
		asa_norte: 'https://wa.me/556193559051?text=Ol%C3%A1%2C%20vim%20do%20site%20do%20Endere%C3%A7o%20Fiscal%20gostaria%20de%20saber%20mais.%20Pode%20me%20ajudar%3F%20Bras%C3%ADlia',
		asa_sul: 'https://wa.me/556193559051?text=Ol%C3%A1%2C%20vim%20do%20site%20do%20Endere%C3%A7o%20Fiscal%20gostaria%20de%20saber%20mais.%20Pode%20me%20ajudar%3F%20Bras%C3%ADlia',
		barra: 'https://wa.me/5521991676417?text=Ol%C3%A1%2C%20vim%20do%20site%20do%20Endere%C3%A7o%20Fiscal%20gostaria%20de%20saber%20mais.%20Pode%20me%20ajudar%3F%20Rio%20de%20Janeiro',
		paulista_1: 'https://wa.me/5511921262191?text=Ol%C3%A1%2C%20vim%20do%20site%20do%20Endere%C3%A7o%20Fiscal%20gostaria%20de%20saber%20mais.%20Pode%20me%20ajudar%3F%20S%C3%A3o%20Paulo',
		paulista_2: 'https://wa.me/5511921262191?text=Ol%C3%A1%2C%20vim%20do%20site%20do%20Endere%C3%A7o%20Fiscal%20gostaria%20de%20saber%20mais.%20Pode%20me%20ajudar%3F%20S%C3%A3o%20Paulo',
		berrini: 'https://wa.me/5511921262191?text=Ol%C3%A1%2C%20vim%20do%20site%20do%20Endere%C3%A7o%20Fiscal%20gostaria%20de%20saber%20mais.%20Pode%20me%20ajudar%3F%20S%C3%A3o%20Paulo'
	};

	const planPrices = {
		mensal: 'R$ 79,00/mês',
		anual: 'R$ 699,00 à vista',
		bianual: 'R$ 936,00 à vista'
	};

	// Modal único: o usuário escolhe o período (1) e a unidade (2) e contrata num só botão
	const modalPlan = document.getElementById( 'modal-plan' );
	const planInputs = modalPlan.querySelectorAll( 'input[name="checkout-plan"]' );
	const locationInputs = modalPlan.querySelectorAll( 'input[name="checkout-location"]' );
	const locationOptions = modalPlan.querySelectorAll( '.location-option' );
	const cityChips = modalPlan.querySelectorAll( '.city-chip' );
	const locationStep = document.getElementById( 'checkout-location-step' );
	const summaryPlan = document.getElementById( 'checkout-summary-plan' );
	const summaryLocation = document.getElementById( 'checkout-summary-location' );
	const cta = document.getElementById( 'checkout-cta' );

	const updateCheckout = () => {
		const plan = modalPlan.querySelector( 'input[name="checkout-plan"]:checked' );
		const location = modalPlan.querySelector( 'input[name="checkout-location"]:checked' );

		summaryPlan.innerText = planTitles[ plan.value ] + ' · ' + planPrices[ plan.value ];

		if ( location ) {
			const city = location.closest( '.location-option' ).querySelector( '.location-city' ).textContent;
			summaryLocation.innerText = location.dataset.name + ' — ' + city;
			summaryLocation.classList.add( 'filled' );

			// id no formato "plano-unidade" usado no rastreamento do GTM
			cta.id = plan.value + '-' + location.value;
			cta.href = whatsappLinks[ location.value ];
			cta.classList.remove( 'is-disabled' );
			cta.setAttribute( 'aria-disabled', 'false' );
		} else {
			summaryLocation.innerText = 'Selecione uma unidade';
			summaryLocation.classList.remove( 'filled' );

			cta.id = 'checkout-cta';
			cta.href = '#';
			cta.classList.add( 'is-disabled' );
			cta.setAttribute( 'aria-disabled', 'true' );
		}
	};

	planInputs.forEach( input => input.addEventListener( 'change', updateCheckout ) );
	locationInputs.forEach( input => input.addEventListener( 'change', updateCheckout ) );

	cityChips.forEach( chip => {
		chip.addEventListener( 'click', () => {
			const city = chip.dataset.city;

			cityChips.forEach( c => c.classList.toggle( 'active', c === chip ) );
			locationOptions.forEach( option => {
				option.hidden = city !== 'all' && option.dataset.city !== city;
			} );
		} );
	} );

	// Sem unidade escolhida, o botão aponta o passo que falta em vez de não fazer nada
	cta.addEventListener( 'click', ( e ) => {
		if ( !cta.classList.contains( 'is-disabled' ) ) return;

		e.preventDefault();
		locationStep.scrollIntoView( { behavior: 'smooth', block: 'center' } );
		locationStep.classList.remove( 'attention' );
		void locationStep.offsetWidth;
		locationStep.classList.add( 'attention' );
	} );

	document.querySelectorAll( '.btn-plan-select' ).forEach( button => {
		button.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			// Já abre com o plano do card clicado selecionado
			const planType = e.currentTarget.getAttribute( 'data-plan' );
			const planInput = modalPlan.querySelector( 'input[name="checkout-plan"][value="' + planType + '"]' )
				|| modalPlan.querySelector( 'input[name="checkout-plan"][value="anual"]' );
			planInput.checked = true;

			updateCheckout();

			modalPlan.style.display = "block";
			document.body.classList.add( "modal-open" );
			modalPlan.querySelector( '.checkout-body' ).scrollTop = 0;
		} );
	} );
} );

// Formulário HubSpot (mesmo código de assets/embed-smart.html)
(function () {
  var HUBSPOT = {
    portalId: '51922874',
    formId: 'f9c089f7-0d36-48d6-a2e6-e76cf0c2b4f1',
    endpoint: 'https://api.hsforms.com/submissions/v3/integration/submit'
  };

  var UTM_KEYS = ['utm_term', 'utm_content', 'utm_source', 'utm_medium', 'utm_campaign'];

  var form = document.getElementById('hsm-form');
  if (!form) return;

  var success = document.getElementById('hsm-success');
  var submitBtn = document.getElementById('hsm-submit');
  var submitError = document.getElementById('hsm-submit-error');

  var name = form.querySelector('#hsm-name');
  var email = form.querySelector('#hsm-email');
  var phone = form.querySelector('#hsm-phone');
  var produto = form.querySelector('#hsm-produto');
  var contrato = form.querySelector('#hsm-contrato');
  var estado = form.querySelector('#hsm-estado');
  var unidade = form.querySelector('#hsm-unidade');

  function digitsOnly(value) {
    return value.replace(/\D/g, '');
  }

  function maskPhone(value) {
    var digits = digitsOnly(value).slice(0, 11);
    if (!digits.length) return '';
    if (digits.length <= 2) return '(' + digits;
    if (digits.length <= 6) return '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
    if (digits.length <= 10) return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6);
    return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
  }

  function validateName() {
    var value = name.value.trim();
    if (!value) return 'Informe seu nome.';
    if (value.length < 2) return 'Informe pelo menos 2 caracteres.';
    return '';
  }

  function validateEmail() {
    var value = email.value.trim();
    if (!value) return 'Informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Informe um e-mail válido.';
    return '';
  }

  function validatePhone() {
    var digits = digitsOnly(phone.value);
    if (!digits.length) return 'Informe seu telefone.';
    if (digits.length < 10 || digits.length > 11) return 'Informe um telefone válido com DDD.';
    if (digits.length === 11 && digits.charAt(2) !== '9') return 'Celular deve começar com 9 após o DDD.';
    return '';
  }

  function validateSelect(el) {
    if (!el.value) return 'Selecione uma opção.';
    return '';
  }

  var fieldList = [
    { el: name, errorId: 'hsm-name-error', validate: validateName },
    { el: email, errorId: 'hsm-email-error', validate: validateEmail },
    { el: phone, errorId: 'hsm-phone-error', validate: validatePhone },
    { el: produto, errorId: 'hsm-produto-error', validate: function () { return validateSelect(produto); } },
    { el: contrato, errorId: 'hsm-contrato-error', validate: function () { return validateSelect(contrato); } },
    { el: estado, errorId: 'hsm-estado-error', validate: function () { return validateSelect(estado); } },
    { el: unidade, errorId: 'hsm-unidade-error', validate: function () { return validateSelect(unidade); } }
  ];

  function setFieldState(el, errorId, message) {
    var errorEl = document.getElementById(errorId);
    var isValid = !message;
    el.classList.toggle('hsm-field--invalid', !isValid);
    el.setAttribute('aria-invalid', isValid ? 'false' : 'true');
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateField(field) {
    var message = field.validate();
    setFieldState(field.el, field.errorId, message);
    return !message;
  }

  function validateForm() {
    var isValid = true;
    fieldList.forEach(function (field) {
      if (!validateField(field)) isValid = false;
    });
    return isValid;
  }

  phone.addEventListener('input', function () {
    var cursorFromEnd = phone.value.length - phone.selectionStart;
    phone.value = maskPhone(phone.value);
    var nextPos = Math.max(phone.value.length - cursorFromEnd, 0);
    phone.setSelectionRange(nextPos, nextPos);
  });

  fieldList.forEach(function (field) {
    var eventName = field.el.tagName === 'SELECT' ? 'change' : 'input';
    field.el.addEventListener('blur', function () { validateField(field); });
    field.el.addEventListener(eventName, function () {
      if (field.el.classList.contains('hsm-field--invalid')) validateField(field);
    });
  });

  function getHubspotUtk() {
    var match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
    return match ? match[1] : '';
  }

  function getUtms() {
    var params = new URLSearchParams(window.location.search);
    var utms = {};
    UTM_KEYS.forEach(function (key) {
      utms[key] = params.get(key) || '';
    });
    return utms;
  }

  function buildHubspotFields(lead) {
    var fields = [
      { name: 'name', value: lead.name },
      { name: 'email', value: lead.email },
      { name: 'phone', value: lead.phone },
      { name: 'produto_de_interessse', value: lead.produto },
      { name: 'tem_contrato_social', value: lead.contrato },
      { name: 'estado_uf', value: lead.estado },
      { name: 'unidades', value: lead.unidade }
    ];

    UTM_KEYS.forEach(function (key) {
      var value = lead.utms[key];
      if (value) fields.push({ name: key, value: value });
    });

    return fields;
  }

  function submitToHubspot(lead) {
    var hutk = getHubspotUtk();
    var context = { pageUri: window.location.href, pageName: document.title };
    if (hutk) context.hutk = hutk;

    return fetch(HUBSPOT.endpoint + '/' + HUBSPOT.portalId + '/' + HUBSPOT.formId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submittedAt: Date.now(),
        fields: buildHubspotFields(lead),
        context: context
      })
    }).then(function (response) {
      if (!response.ok) {
        return response.json().catch(function () { return {}; }).then(function (error) {
          throw new Error(error.message || 'Erro ao enviar formulário');
        });
      }
      return response.json();
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateForm()) {
      var firstInvalid = form.querySelector('.hsm-field--invalid');
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    submitError.classList.remove('show');

    var lead = {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: '+55' + digitsOnly(phone.value),
      produto: produto.value,
      contrato: contrato.value,
      estado: estado.value,
      unidade: unidade.value,
      utms: getUtms()
    };

    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    submitToHubspot(lead).then(function () {
      if (typeof fbq === 'function') fbq('track', 'Lead');
      form.style.display = 'none';
      success.style.display = 'block';
      // Mesma página de agradecimento do fluxo antigo: as conversões (GTM/Ads) dependem dela
      window.location.href = 'https://coworkingsmart.com.br/agradecimento/';
    }).catch(function (err) {
      console.error('HubSpot submit error:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      submitError.classList.add('show');
    });
  });
})();
