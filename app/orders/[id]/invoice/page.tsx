import InvoiceClient from './InvoiceClient';

// Invoices require a logged-in account + backend (dynamic on the `backend`
// branch). `output: export` needs at least one param, so we emit a single
// placeholder route that renders the "unavailable" state. Nothing links to it.
export function generateStaticParams() {
    return [{ id: '1' }];
}

export default function InvoicePage() {
    return <InvoiceClient />;
}
