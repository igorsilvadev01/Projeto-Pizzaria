import Link from "next/link";
import BrandMark from "../../components/brand-mark";

export default async function PaymentReturnPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status;
  const message = status === "success"
    ? "O Mercado Pago retornou você ao site. Confira o comprovante e a confirmação na sua conta Mercado Pago; esta demonstração ainda não verifica o pagamento no servidor."
    : status === "pending"
      ? "Seu pagamento está aguardando confirmação no Mercado Pago."
      : "O pagamento não foi concluído. Você pode tentar novamente ou falar com a pizzaria pelo WhatsApp.";

  return (
    <main className="payment-return">
      <div className="payment-return-card">
        <BrandMark />
        <p className="eyebrow"><span /> PEDIDO SPADONI</p>
        <h1>{status === "success" ? "Obrigado pelo pedido." : status === "pending" ? "Pagamento pendente." : "Pagamento não concluído."}</h1>
        <p>{message}</p>
        <Link className="button button-primary" href="/">Voltar para a SPADONI <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}
