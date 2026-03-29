export interface FAQQuestion {
  q: string;
  a: string;
}

export interface FAQSection {
  id: string;
  title: string;
  icon: string;
  questions: FAQQuestion[];
}

export interface ContactOption {
  icon: string;
  label: string;
  value: string;
  note: string;
}

export const faqSections: FAQSection[] = [
  {
    id: 'orders-delivery',
    title: 'Orders & Delivery',
    icon: 'local_shipping',
    questions: [
      {
        q: 'How long does standard delivery take?',
        a: 'Standard delivery takes 2–3 business days. Plus members enjoy free next-day delivery on eligible orders placed before midnight.',
      },
      {
        q: 'Can I change or cancel my order after placing it?',
        a: 'You can cancel or modify your order within 30 minutes of placing it. After that, the order enters fulfillment and changes may not be possible. Contact us immediately if you need to make a change.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order ships, you\'ll receive a tracking link via email and in-app notification. You can also view real-time delivery status from My Orders → select order → Track Shipment.',
      },
      {
        q: 'What happens if I miss my delivery?',
        a: 'Our courier will attempt delivery twice. If both attempts fail, the package is held at the nearest pickup point for 5 business days before being returned. You can reschedule delivery from the tracking page.',
      },
    ],
  },
  {
    id: 'payments-refunds',
    title: 'Payments & Refunds',
    icon: 'payments',
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), Kakao Pay, Naver Pay, Samsung Pay, and bank transfer. You can also save cards for faster checkout in Payment Methods.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 1–3 business days after we receive and inspect the returned item. The credit then takes 3–5 business days to appear on your card or account, depending on your bank.',
      },
      {
        q: 'Is it safe to save my card details?',
        a: 'Yes. Card details are encrypted and stored securely via a PCI DSS-compliant payment vault. The Curator never stores your full card number — only a masked token used for future payments.',
      },
    ],
  },
  {
    id: 'account-membership',
    title: 'Account & Membership',
    icon: 'person',
    questions: [
      {
        q: 'How do I upgrade to Plus membership?',
        a: 'Go to My Page → Membership and choose between Monthly (₩4,990/mo) or Annual (₩49,900/yr) plans. Plus membership unlocks free express delivery, exclusive prices, and Plus Video streaming.',
      },
      {
        q: 'How do I reset my password?',
        a: 'On the login screen, tap "Forgot Password" and enter your registered email. You\'ll receive a reset link within a few minutes. The link expires after 30 minutes for security.',
      },
      {
        q: 'Can I have multiple delivery addresses?',
        a: 'Yes. You can save up to 10 delivery addresses in My Page → Addresses. Set any address as the default, and switch between them at checkout.',
      },
    ],
  },
  {
    id: 'returns-exchanges',
    title: 'Returns & Exchanges',
    icon: 'assignment_return',
    questions: [
      {
        q: 'What is the return policy?',
        a: 'Most items can be returned within 30 days of delivery, provided they are unused, in original packaging, and with all tags attached. Some categories (e.g., fresh food, personalised items) are non-returnable.',
      },
      {
        q: 'How do I start a return?',
        a: 'Go to My Orders, select the order, tap "Return / Exchange", choose your reason, and schedule a free pickup. We\'ll arrange collection at your door — no need to visit a post office.',
      },
      {
        q: 'Can I exchange an item for a different size or colour?',
        a: 'Yes. During the return flow, select "Exchange" instead of "Refund" and choose the replacement variant. Exchanges are subject to stock availability. If the item is out of stock, a full refund will be issued.',
      },
    ],
  },
];

export const contactOptions: ContactOption[] = [
  {
    icon: 'mail',
    label: 'Email',
    value: 'support@thecurator.kr',
    note: '24hr response',
  },
  {
    icon: 'call',
    label: 'Phone',
    value: '1588-0000',
    note: 'Mon–Fri 9:00–18:00 KST',
  },
];
