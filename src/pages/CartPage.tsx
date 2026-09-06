import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { apiErrorMessage } from '../hooks/useApiError';
import { CartItemRow } from '../components/cart/CartItemRow';
import { PaymentForm } from '../components/cart/PaymentForm';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { formatPrice } from '../lib/format';

export default function CartPage() {
  const { items, total, loading, removeItem, checkout } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRemove(cartItemId: string) {
    setRemovingId(cartItemId);
    try {
      await removeItem(cartItemId);
      toast('Səbətdən silindi.');
    } catch (error) {
      toast(apiErrorMessage(error, 'Silmək alınmadı.'));
    } finally {
      setRemovingId(null);
    }
  }

  async function handleCheckout(customerName: string) {
    setSubmitting(true);
    try {
      const order = await checkout(customerName);
      toast(`Ödəniş tamamlandı. Sifariş ${order.code}`);
      navigate('/sifarisler');
    } catch (error) {
      toast(apiErrorMessage(error, 'Ödəniş alınmadı.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && items.length === 0) return <Spinner />;

  return (
    <div className="shell py-10 sm:py-14">
      <h1 className="font-heading text-3xl font-bold text-brand-navy">Səbət</h1>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Səbətiniz boşdur"
            text="Təlim və ya ödənişli resurs əlavə edib ödənişə keçə bilərsiniz."
            action={
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Link to="/telimler">
                  <Button size="sm">Təlimlərə bax</Button>
                </Link>
                <Link to="/resurslar">
                  <Button size="sm" variant="secondary">
                    Resurs Bankı
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <ul className="card !p-0">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  removing={removingId === item.id}
                  onRemove={() => handleRemove(item.id)}
                />
              ))}
            </ul>

            <div className="card mt-4 flex items-center justify-between">
              <span className="font-heading text-base font-semibold text-brand-slate">
                Ümumi məbləğ
              </span>
              <span className="font-heading text-2xl font-bold text-brand-navy">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <PaymentForm submitting={submitting} onSubmit={handleCheckout} />
          </div>
        </div>
      )}
    </div>
  );
}
