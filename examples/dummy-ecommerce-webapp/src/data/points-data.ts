export interface PointsTransaction {
  id: string;
  type: 'earned' | 'spent' | 'expired';
  description: string;
  amount: number;
  balance: number;
  date: string;
  dateGroup: string;
}

export const pointsBalance = 12450;

export const expiringPoints = {
  amount: 2000,
  date: 'Apr 15, 2026',
};

export const currentTier = {
  name: 'Silver',
  progress: 60,
  nextTier: 'Gold',
  pointsNeeded: 7550,
};

export const monthlySummary = {
  earned: 5200,
  spent: 3000,
};

export const pointsTransactions: PointsTransaction[] = [
  // Today
  {
    id: 'pt-001',
    type: 'earned',
    description: 'Purchase: Dyson V15 Detect',
    amount: 1200,
    balance: 12450,
    date: '2026-03-29T10:30:00.000Z',
    dateGroup: 'Today',
  },
  {
    id: 'pt-002',
    type: 'spent',
    description: 'Redeemed for discount',
    amount: -500,
    balance: 11250,
    date: '2026-03-29T09:15:00.000Z',
    dateGroup: 'Today',
  },
  // This Week
  {
    id: 'pt-003',
    type: 'earned',
    description: 'Purchase: Samsung 4K Monitor',
    amount: 890,
    balance: 11750,
    date: '2026-03-27T14:00:00.000Z',
    dateGroup: 'This Week',
  },
  {
    id: 'pt-004',
    type: 'earned',
    description: 'Referral bonus',
    amount: 300,
    balance: 10860,
    date: '2026-03-25T08:45:00.000Z',
    dateGroup: 'This Week',
  },
  {
    id: 'pt-005',
    type: 'spent',
    description: 'Redeemed for discount',
    amount: -1000,
    balance: 10560,
    date: '2026-03-24T16:30:00.000Z',
    dateGroup: 'This Week',
  },
  // Earlier
  {
    id: 'pt-006',
    type: 'earned',
    description: 'Purchase: Nike Air Max 270',
    amount: 450,
    balance: 11560,
    date: '2026-03-15T11:20:00.000Z',
    dateGroup: 'Earlier',
  },
  {
    id: 'pt-007',
    type: 'expired',
    description: 'Points expired (issued Jan 2026)',
    amount: -200,
    balance: 11110,
    date: '2026-03-01T00:00:00.000Z',
    dateGroup: 'Earlier',
  },
];
