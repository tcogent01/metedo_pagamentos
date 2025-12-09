// Cotação: 1€ = 110$00 (ajusta se quiser)
const CVE_TO_EURO = 100;

const totalInput = document.getElementById("total");
const euroDisplay = document.getElementById("euro-display");

// ===== Conversão correta =====
function updateEuroDisplay() {
  const valor = totalInput.value.trim();

  if (valor === "" || isNaN(valor) || Number(valor) <= 0) {
    euroDisplay.textContent = "≈ 0 €";
    return;
  }

  const valorEuro = Number(valor) / CVE_TO_EURO;
  euroDisplay.textContent = `≈ ${valorEuro.toFixed(2)} €`;
}

// ===== Botões de valor (CVE) =====
function addAmount(cve) {
  totalInput.value = cve;
  updateEuroDisplay();
}

// Atualiza ao digitar
totalInput.addEventListener("input", updateEuroDisplay);


async function criarPagamento() {
  const valorCVE = totalInput.value.trim();

  if (!valorCVE || isNaN(valorCVE) || Number(valorCVE) <= 0) {
    alert("Por favor, digite ou selecione um valor válido para doação.");
    return;
  }

  try {
    const response = await fetch("/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valorCVE })
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // Cria form POST e envia automaticamente
    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.paymentUrl;

    // Campos obrigatórios Vinti4
    for (const key of ["posID", "posAuthCode", "amount", "currency", "merchantRef", "merchantSession", "timestamp", "fingerprint"]) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

  } catch (err) {
    console.error(err);
    alert("Erro ao criar pagamento. Tente novamente.");
  }
}
// ====================================================================
// Fallback que abre o link direto (não recomendado, mas funciona)
// ====================================================================
function donateNow() {
  const valor = document.getElementById("total").value.trim();

  if (!valor || isNaN(valor) || Number(valor) <= 0) {
    alert("Digite ou selecione um valor válido.");
    return;
  }

  const vinti4Link = `=${valor}`;
  window.open(vinti4Link, "_blank");
}




// Inicializa exibição ao carregar a página
updateEuroDisplay();