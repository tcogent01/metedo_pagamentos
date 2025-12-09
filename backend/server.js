const express = require("express");
const path = require("path");
const crypto = require("crypto");
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Simulação de geração de pagamento Vinti4
app.post("/create-payment", (req, res) => {
  const { valorCVE } = req.body;

  if (!valorCVE || isNaN(valorCVE) || Number(valorCVE) <= 0) {
    return res.status(400).json({ error: "Valor inválido" });
  }

  // Dados obrigatórios da documentação
  const posID = "SEU_POS_ID"; // fornecido pela Vinti4
  const posAuthCode = "SEU_POS_AUTH"; // fornecido pela Vinti4
  const amount = valorCVE;
  const currency = "CVE";
  const merchantRef = `DONATION-${Date.now()}`;
  const merchantSession = `SESSION-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // Montando string para gerar fingerprint (exemplo conforme documentação)
  const fingerprintStr = `${posID}${posAuthCode}${amount}${currency}${merchantRef}${merchantSession}${timestamp}`;
  const fingerprint = crypto.createHash("sha512").update(fingerprintStr).digest("base64");

  // URL de pagamento oficial
  const paymentUrl = "https://mc.vinti4net.cv/Client_VbV_v2/biz_vbv_clientdata.jsp";

  // Retornamos os dados necessários para criar o form no frontend
  res.json({
    paymentUrl,
    posID,
    posAuthCode,
    amount,
    currency,
    merchantRef,
    merchantSession,
    timestamp,
    fingerprint
    
  });
});

// Endpoint para receber resposta do pagamento
app.post("/payment-response", (req, res) => {
  // Aqui a Vinti4 vai enviar os dados do pagamento
  console.log("Dados recebidos da Vinti4:", req.body);
  res.send("OK"); // Resposta obrigatória
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

