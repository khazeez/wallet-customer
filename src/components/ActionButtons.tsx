

interface ActionButtonsProps {
  onSend: () => void;
  onReceive: () => void;
  onSwap: () => void;
  onScan: () => void;
  onPromo: () => void;
}

export function ActionButtons({ onSend, onReceive, onSwap, onScan, onPromo }: ActionButtonsProps) {
  // Arrange actions so QR is centered under Receive and Swap
  const actions = [
    {
      name: 'Send',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4Z"/>
          <path d="M22 2 11 13"/>
        </svg>
      ),
      onClick: onSend,
      primary: true
    },
    {
      name: 'Receive',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>
          <path d="M21 12H5"/>
          <path d="M12 22V8"/>
        </svg>
      ),
      onClick: onReceive,
      primary: false
    },
    {
      name: 'Swap',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3h5v5"/>
          <path d="M8 3H3v5"/>
          <path d="M3 16v5h5"/>
          <path d="M16 21h5v-5"/>
          <path d="m21 3-7 7"/>
          <path d="m3 21 7-7"/>
        </svg>
      ),
      onClick: onSwap,
      primary: false
    },
    // Insert QR after Swap for center alignment
    {
      name: 'QR',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
      onClick: onScan,
      primary: 'qr'
    },
    {
      name: 'Promo',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="13" rx="2"/>
          <path d="M16 3.13V7"/>
          <path d="M8 3.13V7"/>
        </svg>
      ),
      onClick: onPromo,
      primary: false
    }
  ];

  return (
    <div className="rounded-lg shadow-sm border border-cloud-grey p-4 mb-6">
      <h3 className="text-sm font-semibold text-secondary-text mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, idx) => (
          <button
            key={action.name}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors text-deep-ink hover:bg-cloud-grey/30 focus:bg-cloud-grey/30`}
            aria-label={action.name}

          >
            <div className="mb-2">{action.icon}</div>
            <span className="text-xs font-medium">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
